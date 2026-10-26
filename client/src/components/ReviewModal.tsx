import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  targetUserName?: string;
  targetName?: string;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  targetUserName,
  targetName,
  onSuccess
}) => {
  const displayName = targetUserName || targetName || 'Member';
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('Super helpful, punctual, and friendly! Highly recommended to the community.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.submitReview({
        bookingId,
        rating,
        comment
      });
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#FAF8F3] dark:bg-[#151515] border-2 border-black dark:border-[#333] shadow-[8px_8px_0px_0px_#111111] w-full max-w-md p-6 sm:p-8 relative space-y-5 text-[#111111] dark:text-white rounded-none">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#111111]/50 hover:text-black dark:text-white/50 dark:hover:text-white p-1 hover:bg-[#F7F4EC] dark:hover:bg-[#222] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-[#E5E0D8] dark:border-[#262626] pb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-[#FFD21C] text-black px-2 py-0.5 inline-block mb-1">
            Dual Verification
          </span>
          <h2 className="font-serif font-bold text-2xl text-[#111111] dark:text-white">
            Rate & Review Session
          </h2>
          <p className="text-xs text-[#111111]/70 dark:text-white/70 mt-1">
            How was your exchange with <strong className="text-[#111111] dark:text-white underline decoration-[#FFD21C] decoration-2">{displayName}</strong>?
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="flex justify-center gap-2 py-3 bg-[#FAF8F3] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333]">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1.5 transition-transform hover:scale-110 focus:outline-hidden cursor-pointer"
              >
                <Star
                  className={`w-7 h-7 ${
                    (hoverRating || rating) >= star
                      ? 'text-[#FFD21C] fill-[#FFD21C]'
                      : 'text-[#E5E0D8] dark:text-[#333] fill-transparent'
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
              Feedback & Recommendation
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe what went well and session outcomes..."
              className="w-full px-3 py-2 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-xs text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
            />
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
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

