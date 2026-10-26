import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types';
import { ReviewModal } from '../components/ReviewModal';
import { CardSkeleton } from '../components/SkeletonLoader';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star, 
  Shield, 
  Mail, 
  Phone, 
  User, 
  AlertTriangle, 
  Check,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Bookings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  
  const [reviewBooking, setReviewBooking] = useState<{ id: string; targetName: string } | null>(null);
  const [disputeBookingId, setDisputeBookingId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await api.acceptBooking(id);
      setStatusMessage('Booking request accepted. Schedule confirmed.');
      await loadBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to accept booking');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.cancelBooking(id);
      setStatusMessage('Booking cancelled.');
      await loadBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  const handleConfirmCompletion = async (id: string) => {
    try {
      const res = await api.confirmBookingCompletion(id);
      setStatusMessage(res.message);
      if (res.isCompleted) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      await refreshUser();
      await loadBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to confirm completion');
    }
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeBookingId) return;

    try {
      await api.disputeBooking(disputeBookingId, disputeReason);
      setStatusMessage('Dispute submitted for administrator review.');
      setDisputeBookingId(null);
      setDisputeReason('');
      await loadBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to submit dispute');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 border-b border-[#E5E0D8] dark:border-[#262626] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-4 bg-[#FFD21C] inline-block" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]/70 dark:text-white/70">
              Exchange Ledger
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-white">
            My Service Bookings
          </h1>
          <p className="text-xs sm:text-sm text-[#111111]/70 dark:text-[#E5E0D8]/70 mt-1">
            Manage your scheduled sessions, dual-party completions, or submit audit dispute mediation.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 border border-[#E5E0D8] dark:border-[#262626] p-1 bg-[#FAF8F3] dark:bg-[#151515]">
          {['ALL', 'REQUESTED', 'ACCEPTED', 'COMPLETED', 'DISPUTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-[#FFD21C] text-black border border-black shadow-[2px_2px_0px_0px_#111111]'
                  : 'text-[#111111] dark:text-white hover:bg-[#F7F4EC] dark:hover:bg-[#222]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-[#FAF8F3] dark:bg-[#151515] border-l-4 border-[#123D32] border-y border-r border-[#E5E0D8] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#123D32] shrink-0" />
            <span className="font-medium text-[#111111] dark:text-white">{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-[#111111]/70 dark:text-white/70 font-bold ml-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#262626] p-12 text-center text-[#111111]/60 space-y-2">
          <Calendar className="w-8 h-8 text-[#111111]/30 mx-auto" />
          <h3 className="font-serif font-bold text-[#111111] dark:text-white text-lg">No Bookings Found</h3>
          <p className="text-xs">There are no service sessions under the {filterStatus} filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((b) => {
            const isRequester = b.requesterId === user?.id;
            const otherParty = isRequester ? b.helper : b.requester;

            const userConfirmed = b.confirmations?.some(c => c.userId === user?.id);
            const otherConfirmed = b.confirmations?.some(c => c.userId === otherParty.id);
            const userReviewed = b.reviews?.some(r => r.authorId === user?.id);

            return (
              <div key={b.id} className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#262626] p-6 sm:p-8 space-y-6 rounded-none">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] dark:border-[#262626] pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border uppercase ${
                        b.status === 'COMPLETED'
                          ? 'bg-[#123D32] text-white border-[#123D32]'
                          : b.status === 'ACCEPTED'
                          ? 'bg-[#FFD21C] text-black border-black'
                          : b.status === 'DISPUTED'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-[#F7F4EC] dark:bg-[#222] text-[#111111] dark:text-white border-[#E5E0D8] dark:border-[#333]'
                      }`}>
                        Status: {b.status}
                      </span>
                      <span className="text-xs font-bold text-[#111111]/60 dark:text-white/60">
                        ({isRequester ? 'You are Requester' : 'You are Helper'})
                      </span>
                    </div>

                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#111111] dark:text-white">
                      {b.listing?.title || 'Community Skill Exchange Session'}
                    </h2>
                  </div>

                  <div className="text-right">
                    <span className="font-serif font-bold text-2xl text-[#111111] dark:text-white bg-[#F7F4EC] dark:bg-[#222] px-3 py-1 border border-[#E5E0D8] dark:border-[#333] inline-block">
                      {(b.finalCreditAmount ?? (b.durationHours * (b.agreedMultiplier || 1.0))).toFixed(1)} Credits
                    </span>
                    <span className="text-[10px] text-[#111111]/50 dark:text-white/50 font-mono mt-1 block">
                      {b.durationHours}h @ {b.agreedMultiplier || 1.0}× rate
                    </span>
                  </div>
                </div>

                {/* Fair Credit Multiplier Agreement Banner */}
                <div className="p-3.5 bg-[#FAF8F3] dark:bg-[#181818] border border-[#E5E0D8] dark:border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border ${
                      (b.agreedMultiplier || 1.0) >= 1.5
                        ? 'bg-black text-[#FFD21C] border-black'
                        : (b.agreedMultiplier || 1.0) >= 1.25
                        ? 'bg-[#123D32] text-white border-[#123D32]'
                        : 'bg-[#FFD21C] text-black border-black'
                    }`}>
                      {b.agreedMultiplier || 1.0}× Multiplier
                    </span>
                    <span className="text-[#111111] dark:text-white font-medium">
                      Formula: <strong>{b.durationHours} hrs × {b.agreedMultiplier || 1.0}× = {(b.finalCreditAmount ?? (b.durationHours * (b.agreedMultiplier || 1.0))).toFixed(1)} Credits</strong>
                    </span>
                  </div>
                  <div className="text-[11px] text-[#111111]/60 dark:text-white/60 font-mono">
                    Locked Bilateral Parity
                  </div>
                </div>

                {/* 4-Step Progress Line */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className={`p-2.5 border uppercase font-bold text-[10px] tracking-wider ${
                    b.status !== 'CANCELLED'
                      ? 'bg-[#111111] text-white border-black'
                      : 'bg-[#FDFBF7] dark:bg-[#181818] text-[#111111]/40 dark:text-white/40 border-[#E5E0D8] dark:border-[#333]'
                  }`}>
                    1. Requested
                  </div>
                  <div className={`p-2.5 border uppercase font-bold text-[10px] tracking-wider ${
                    b.status === 'ACCEPTED' || b.status === 'COMPLETED'
                      ? 'bg-[#111111] text-white border-black'
                      : 'bg-[#FDFBF7] dark:bg-[#181818] text-[#111111]/40 dark:text-white/40 border-[#E5E0D8] dark:border-[#333]'
                  }`}>
                    2. Accepted
                  </div>
                  <div className={`p-2.5 border uppercase font-bold text-[10px] tracking-wider ${
                    b.status === 'COMPLETED'
                      ? 'bg-[#123D32] text-white border-[#123D32]'
                      : userConfirmed || otherConfirmed
                      ? 'bg-[#FFD21C] text-black border-black font-extrabold'
                      : 'bg-[#FDFBF7] dark:bg-[#181818] text-[#111111]/40 dark:text-white/40 border-[#E5E0D8] dark:border-[#333]'
                  }`}>
                    3. Dual Confirmed
                  </div>
                  <div className={`p-2.5 border uppercase font-bold text-[10px] tracking-wider ${
                    b.status === 'COMPLETED'
                      ? 'bg-[#111111] text-[#FFD21C] border-black font-extrabold'
                      : 'bg-[#FDFBF7] dark:bg-[#181818] text-[#111111]/40 dark:text-white/40 border-[#E5E0D8] dark:border-[#333]'
                  }`}>
                    4. Settled
                  </div>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F7F4EC] dark:bg-[#1c1c1c] p-4 border border-[#E5E0D8] dark:border-[#333] text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-[#111111] dark:text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#111111]/60" />
                      <span>{isRequester ? 'Helper:' : 'Requester:'}</span>
                      <strong className="underline decoration-[#FFD21C] decoration-2">{otherParty.profile?.fullName || otherParty.email}</strong>
                    </p>
                    <p className="text-[#111111]/70 dark:text-white/70 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#111111]/40" />
                      <span>{otherParty.email}</span>
                    </p>
                    {otherParty.profile?.phone && (
                      <p className="text-[#111111]/70 dark:text-white/70 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#111111]/40" />
                        <span>{otherParty.profile.phone}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-[#111111] dark:text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#111111]/60" />
                      <span>Schedule:</span>
                      <strong>{new Date(b.startAt).toLocaleString()}</strong>
                    </p>
                    {b.notes && (
                      <p className="text-[#111111]/80 dark:text-white/80 italic">"{b.notes}"</p>
                    )}
                  </div>
                </div>

                {/* Double-Confirmation Completion Box */}
                {b.status === 'ACCEPTED' && (
                  <div className="p-4 bg-[#FAF8F3] dark:bg-[#151515] border-2 border-black dark:border-[#333] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <p className="font-bold uppercase tracking-wider text-[#111111] dark:text-white flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-[#123D32]" />
                        <span>Dual-Party Completion Verification</span>
                      </p>
                      <p className="text-[11px] text-[#111111]/70 dark:text-white/70">
                        Your status:{' '}
                        <strong className="text-[#111111] dark:text-white">{userConfirmed ? 'Confirmed ✓' : 'Pending Confirmation'}</strong>
                        {' • '}
                        Peer status:{' '}
                        <strong className="text-[#111111] dark:text-white">{otherConfirmed ? 'Confirmed ✓' : 'Pending Confirmation'}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => handleConfirmCompletion(b.id)}
                      disabled={userConfirmed}
                      className={`px-4 py-2 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
                        userConfirmed
                          ? 'bg-[#E5E0D8] text-[#111111]/50 border border-[#E5E0D8] cursor-not-allowed'
                          : 'bg-[#FFD21C] hover:bg-[#F4C400] text-black border border-black shadow-[2px_2px_0px_0px_#111111]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{userConfirmed ? 'Confirmation Saved' : 'Confirm Service Completion'}</span>
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {!isRequester && b.status === 'REQUESTED' && (
                      <button
                        onClick={() => handleAccept(b.id)}
                        className="px-4 py-2 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors border border-black cursor-pointer"
                      >
                        Accept Booking Request
                      </button>
                    )}

                    {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="px-3 py-1.5 border border-[#E5E0D8] dark:border-[#333] hover:bg-[#F7F4EC] dark:hover:bg-[#222] text-[#111111] dark:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {b.status === 'ACCEPTED' && (
                      <button
                        onClick={() => setDisputeBookingId(b.id)}
                        className="px-3 py-1.5 bg-[#FAF8F3] hover:bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Report Issue / Dispute
                      </button>
                    )}
                  </div>

                  {b.status === 'COMPLETED' && (
                    <button
                      onClick={() => setReviewBooking({ id: b.id, targetName: otherParty.profile?.fullName || otherParty.email })}
                      disabled={userReviewed}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
                        userReviewed
                          ? 'bg-[#F7F4EC] dark:bg-[#222] text-[#111111]/50 border border-[#E5E0D8] dark:border-[#333] cursor-not-allowed'
                          : 'bg-[#FFD21C] hover:bg-[#F4C400] text-black border border-black shadow-[2px_2px_0px_0px_#111111]'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-black" />
                      <span>{userReviewed ? 'Rating Submitted' : 'Submit Review & Rating'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          isOpen={true}
          onClose={() => setReviewBooking(null)}
          bookingId={reviewBooking.id}
          targetName={reviewBooking.targetName}
          onSuccess={() => {
            setStatusMessage('Review submitted successfully.');
            loadBookings();
          }}
        />
      )}

      {/* Dispute Modal */}
      {disputeBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FAF8F3] dark:bg-[#151515] border-2 border-black dark:border-[#333] shadow-[8px_8px_0px_0px_#111111] p-6 max-w-md w-full space-y-4 rounded-none">
            <h3 className="font-serif font-bold text-2xl text-[#111111] dark:text-white">
              Report Service Dispute
            </h3>
            <p className="text-xs text-[#111111]/70 dark:text-white/70">
              Disputed sessions freeze time credit transfers and are escalated to campus moderators for mediation.
            </p>
            <form onSubmit={handleDisputeSubmit} className="space-y-4">
              <textarea
                required
                rows={4}
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Describe what occurred during the scheduled session..."
                className="w-full p-3 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-xs text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDisputeBookingId(null)}
                  className="px-4 py-2 border border-[#E5E0D8] dark:border-[#333] text-xs font-bold uppercase tracking-wider hover:bg-[#F7F4EC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider border border-red-700 cursor-pointer"
                >
                  Submit for Moderation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
