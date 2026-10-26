import prisma from '../prisma.js';

export interface ConfirmationResult {
  bookingId: string;
  status: string;
  isCompleted: boolean;
  creditTransferred: boolean;
  amount?: number;
  requesterBalance?: number;
  helperBalance?: number;
  message: string;
}

export async function submitCompletionConfirmation(
  bookingId: string,
  userId: string
): Promise<ConfirmationResult> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      confirmations: true,
      requester: { include: { profile: true } },
      helper: { include: { profile: true } },
      listing: true
    }
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.requesterId !== userId && booking.helperId !== userId) {
    throw new Error('Unauthorized: only participants can confirm completion');
  }

  if (booking.status === 'CANCELLED' || booking.status === 'DISPUTED') {
    throw new Error(`Cannot complete booking in ${booking.status} status`);
  }

  if (booking.status === 'COMPLETED') {
    return {
      bookingId,
      status: 'COMPLETED',
      isCompleted: true,
      creditTransferred: true,
      message: 'Booking is already completed and credits transferred.'
    };
  }

  // 1. Record this party's confirmation if not already recorded
  const alreadyConfirmed = booking.confirmations.some(c => c.userId === userId);
  if (!alreadyConfirmed) {
    await prisma.completionConfirmation.create({
      data: {
        bookingId,
        userId
      }
    });
  }

  // 2. Fetch updated confirmations
  const allConfirmations = await prisma.completionConfirmation.findMany({
    where: { bookingId }
  });

  const requesterConfirmed = allConfirmations.some(c => c.userId === booking.requesterId);
  const helperConfirmed = allConfirmations.some(c => c.userId === booking.helperId);

  // If both have now confirmed, execute atomic credit transfer
  if (requesterConfirmed && helperConfirmed) {
    const baseHours = booking.durationHours || 1.0;
    const multiplier = booking.agreedMultiplier || 1.0;
    const transferAmount = booking.finalCreditAmount || (baseHours * multiplier);

    // Execute atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // Guard against double execution
      const existingTx = await tx.creditTransaction.findFirst({
        where: { bookingId, type: 'SERVICE_EXCHANGE' }
      });

      if (existingTx) {
        return { existing: true, tx: existingTx };
      }

      // 1. Update Booking status to COMPLETED and ensure final credit amount is persisted
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'COMPLETED',
          finalCreditAmount: transferAmount
        }
      });

      // 2. Transfer Credits: Deduct from Requester
      const updatedRequester = await tx.user.update({
        where: { id: booking.requesterId },
        data: { creditBalance: { decrement: transferAmount } }
      });

      // 3. Transfer Credits: Add to Helper
      const updatedHelper = await tx.user.update({
        where: { id: booking.helperId },
        data: { creditBalance: { increment: transferAmount } }
      });

      // 4. Create Immutable Ledger Entry with multiplier breakdown
      const listingTitle = booking.listing?.title || 'Community Service Exchange';
      const reasonText = multiplier > 1.0
        ? `${baseHours} hr × ${multiplier}× complexity multiplier (${booking.listing?.complexityLevel || 'ADVANCED'})`
        : `${baseHours} hr standard service rate (1.0×)`;

      const creditTx = await tx.creditTransaction.create({
        data: {
          bookingId,
          fromUserId: booking.requesterId,
          toUserId: booking.helperId,
          amount: transferAmount,
          baseCreditAmount: baseHours,
          multiplier: multiplier,
          finalCreditAmount: transferAmount,
          transactionReason: reasonText,
          type: 'SERVICE_EXCHANGE',
          description: `Completed exchange: "${listingTitle}" (${baseHours} hr @ ${multiplier}× = ${transferAmount.toFixed(1)} cr)`
        }
      });

      // 5. Update completed count on profiles
      if (booking.requester.profile) {
        await tx.profile.update({
          where: { userId: booking.requesterId },
          data: { completedCount: { increment: 1 } }
        });
      }
      if (booking.helper.profile) {
        await tx.profile.update({
          where: { userId: booking.helperId },
          data: { completedCount: { increment: 1 } }
        });
      }

      return {
        existing: false,
        tx: creditTx,
        requesterBalance: updatedRequester.creditBalance,
        helperBalance: updatedHelper.creditBalance
      };
    });

    return {
      bookingId,
      status: 'COMPLETED',
      isCompleted: true,
      creditTransferred: true,
      amount: transferAmount,
      requesterBalance: result.requesterBalance,
      helperBalance: result.helperBalance,
      message: `Both parties confirmed! ${transferAmount} time credit successfully transferred.`
    };
  }

  return {
    bookingId,
    status: booking.status,
    isCompleted: false,
    creditTransferred: false,
    message: 'Your completion confirmation recorded. Waiting for the other member to confirm.'
  };
}
