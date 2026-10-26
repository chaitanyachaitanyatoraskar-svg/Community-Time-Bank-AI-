import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Calendar, Clock, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  helperId: string;
  helperName: string;
  listingId?: string;
  listingTitle?: string;
  multiplier?: number;
  complexityLevel?: string;
  materialsRequired?: boolean;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  helperId,
  helperName,
  listingId,
  listingTitle,
  multiplier = 1.0,
  complexityLevel = 'STANDARD',
  materialsRequired = false,
  onSuccess
}) => {
  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('4:00 PM');
  const [durationHours, setDurationHours] = useState<number>(1.0);
  const [sessionMode, setSessionMode] = useState<'Online' | 'In-person'>('Online');
  const [notes, setNotes] = useState<string>('Looking forward to learning with you!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const timeSlots = ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
  const effectiveMultiplier = multiplier || 1.0;
  const calculatedCredits = durationHours * effectiveMultiplier;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const hour = selectedTimeSlot === '4:00 PM' ? '16:00' : selectedTimeSlot === '5:00 PM' ? '17:00' : selectedTimeSlot === '6:00 PM' ? '18:00' : '19:00';
      const startAt = new Date(`${date}T${hour}:00`);

      await api.createBooking({
        helperId,
        listingId: listingId || null,
        startAt: startAt.toISOString(),
        durationHours,
        notes: `Mode: ${sessionMode} • Rate: ${effectiveMultiplier}x (${complexityLevel}) • ${notes}`
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create booking request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#FAF8F3] dark:bg-[#151515] border-2 border-black dark:border-[#333] shadow-[8px_8px_0px_0px_#111111] w-full max-w-lg p-6 sm:p-8 relative space-y-5 text-[#111111] dark:text-white max-h-[90vh] overflow-y-auto rounded-none">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#111111]/50 hover:text-black dark:text-white/50 dark:hover:text-white p-1 hover:bg-[#F7F4EC] dark:hover:bg-[#222] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-[#E5E0D8] dark:border-[#262626] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-[#FFD21C] text-black px-2 py-0.5 inline-block">
              Skill Exchange
            </span>
            {effectiveMultiplier > 1.0 && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#123D32] text-white">
                {effectiveMultiplier}× {complexityLevel}
              </span>
            )}
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl">Book a Session</h2>
          <p className="text-xs text-[#111111]/70 dark:text-white/70 mt-1">
            Assistance with <strong className="text-[#111111] dark:text-white underline decoration-[#FFD21C] decoration-2">{helperName}</strong>
            {listingTitle ? ` for "${listingTitle}"` : ''}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Date & Time Slot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
                Select Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-xs text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
                Select Time
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`py-2 px-2 text-xs font-bold border transition-colors cursor-pointer rounded-none ${
                      selectedTimeSlot === slot
                        ? 'bg-[#FFD21C] text-black border-black font-extrabold shadow-[2px_2px_0px_0px_#111111]'
                        : 'bg-[#FDFBF7] dark:bg-[#1c1c1c] border-[#E5E0D8] dark:border-[#333] text-[#111111] dark:text-white hover:bg-[#F7F4EC]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Session Mode */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
              Session Mode
            </label>
            <div className="flex gap-4">
              {(['Online', 'In-person'] as const).map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sessionMode"
                    checked={sessionMode === m}
                    onChange={() => setSessionMode(m)}
                    className="accent-black"
                  />
                  <span className="font-bold text-[#111111] dark:text-white">{m}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
              Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1.0, 1.5, 2.0].map((hours) => {
                const credits = hours * effectiveMultiplier;
                return (
                  <button
                    type="button"
                    key={hours}
                    onClick={() => setDurationHours(hours)}
                    className={`py-2 px-3 border transition-colors text-left cursor-pointer rounded-none ${
                      durationHours === hours
                        ? 'bg-[#FFD21C] text-black border-2 border-black font-bold shadow-[2px_2px_0px_0px_#111111]'
                        : 'bg-[#FDFBF7] dark:bg-[#1c1c1c] border-[#E5E0D8] dark:border-[#333] text-[#111111] dark:text-white hover:bg-[#F7F4EC]'
                    }`}
                  >
                    <div className="font-bold">{hours} hr{hours > 1 ? 's' : ''}</div>
                    <div className="text-[10px] font-mono opacity-80">
                      {credits.toFixed(1)} cr ({effectiveMultiplier}×)
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fair Rate Breakdown Calculation Box */}
          <div className="p-4 bg-[#FAF8F3] dark:bg-[#181818] border border-[#E5E0D8] dark:border-[#262626] space-y-3 rounded-none">
            <div className="flex items-center justify-between font-bold uppercase tracking-wider text-[#111111] dark:text-white text-xs">
              <span>Rate Calculation</span>
              <span className="font-mono text-sm text-[#111111] dark:text-white">
                {durationHours}h × {effectiveMultiplier}× = {calculatedCredits.toFixed(1)} Credits
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#FDFBF7] dark:bg-[#141414] p-2.5 border border-[#E5E0D8] dark:border-[#333]">
                <span className="text-[#111111]/50 block text-[10px] uppercase font-bold">Base Hours</span>
                <strong className="text-[#111111] dark:text-white font-serif text-base">{durationHours} hr</strong>
              </div>
              <div className="bg-[#FDFBF7] dark:bg-[#141414] p-2.5 border border-[#E5E0D8] dark:border-[#333]">
                <span className="text-[#111111]/50 block text-[10px] uppercase font-bold">Multiplier</span>
                <strong className="text-[#111111] dark:text-white font-serif text-base">{effectiveMultiplier}×</strong>
              </div>
              <div className="bg-[#FDFBF7] dark:bg-[#141414] p-2.5 border border-[#E5E0D8] dark:border-[#333]">
                <span className="text-[#111111]/50 block text-[10px] uppercase font-bold">Total Due</span>
                <strong className="text-black dark:text-[#FFD21C] font-serif text-base">
                  {calculatedCredits.toFixed(1)} cr
                </strong>
              </div>
            </div>
            {materialsRequired && (
              <p className="text-[10px] text-[#111111] dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FFD21C] shrink-0" />
                <span>Specialized materials or tools are required for this session.</span>
              </p>
            )}
            <p className="text-[10px] text-[#111111]/60 dark:text-white/60 leading-relaxed border-t border-[#E5E0D8] dark:border-[#333] pt-2">
              Reciprocity Rule: 1 hour = 1 base credit. Approved multipliers reflect complexity. Both parties bilaterally verify completion before transfer.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
              Notes for Helper
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please bring laptop or review notes..."
              className="w-full px-3 py-2 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-xs text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
            />
          </div>

          <div className="p-3 bg-[#F7F4EC] dark:bg-[#1c1c1c] border-l-2 border-[#123D32] text-xs text-[#111111]/80 dark:text-white/80 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#123D32] shrink-0" />
            <span>Time credits are transferred only after both you and {helperName} confirm completion.</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#E5E0D8] dark:border-[#333] text-[#111111] dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-[#F7F4EC] dark:hover:bg-[#222] transition cursor-pointer rounded-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-[#FFD21C] hover:bg-[#F4C400] text-black font-bold text-xs uppercase tracking-wider border border-black transition shadow-[2px_2px_0px_0px_#111111] cursor-pointer rounded-none"
            >
              {loading ? 'Booking...' : `Confirm & Request (${calculatedCredits.toFixed(1)} cr)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

