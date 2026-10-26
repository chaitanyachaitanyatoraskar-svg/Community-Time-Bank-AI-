import React from 'react';
import { MatchScoreResult } from '../types';
import { Star, MapPin, Calendar, ArrowRight, Check } from 'lucide-react';

interface MatchCardProps {
  match: MatchScoreResult;
  onRequestBooking: (helper: MatchScoreResult) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onRequestBooking }) => {
  return (
    <div className="bg-[#FAF8F3] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#262626] rounded-none p-6 space-y-4 hover:border-black dark:hover:border-white transition-all">
      {/* Top Banner with Match Score Badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-[#111111] text-[#FFD21C] border border-black flex items-center justify-center font-bold text-base shrink-0">
            {match.helperName.charAt(0)}
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#111111] dark:text-white text-lg">
              {match.helperName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-[#111111]/60 dark:text-white/60 mt-0.5">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-[#111111] dark:text-white" />
                {match.area}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-bold text-[#111111] dark:text-white">
                <Star className="w-3 h-3 fill-[#FFD21C] text-[#FFD21C]" />
                {match.averageRating.toFixed(1)} <span className="font-normal text-[#111111]/50">({match.reviewCount} sessions)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Match Percentage Badge */}
        <div className="px-3 py-1 bg-[#FFD21C] text-black border border-black text-xs font-mono font-extrabold uppercase tracking-wider">
          {match.matchScore}% Match
        </div>
      </div>

      {/* Matching Breakdown / Explanation */}
      <div className="bg-[#F7F4EC] dark:bg-[#1c1c1c] border-l-2 border-[#FFD21C] p-3 text-xs leading-relaxed text-[#111111]/80 dark:text-white/80">
        <strong className="text-[#111111] dark:text-white uppercase tracking-wider text-[10px] block mb-0.5">Algorithmic Fit:</strong>
        {match.explanation}
      </div>

      {/* Fit Highlights */}
      {match.fitHighlights && match.fitHighlights.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {match.fitHighlights.slice(0, 3).map((highlight, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-[#111111]/70 dark:text-white/70">
              <Check className="w-3.5 h-3.5 text-[#123D32] dark:text-emerald-400 shrink-0" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      )}

      {/* Skills tags */}
      <div>
        <p className="text-[10px] font-bold text-[#111111]/50 dark:text-white/50 uppercase tracking-widest mb-1.5">
          Verified Competencies
        </p>
        <div className="flex flex-wrap gap-1.5">
          {match.skills.map((s, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-0.5 rounded-none bg-[#F7F4EC] dark:bg-[#222] text-[#111111] dark:text-white border border-[#E5E0D8] dark:border-[#333] flex items-center gap-1.5 font-medium"
            >
              <span>{s.name}</span>
              <span className={`text-[9px] px-1 py-0.2 font-mono uppercase font-bold ${
                s.proficiency === 'EXPERT' ? 'bg-[#FFD21C] text-black' : 'text-[#111111]/50'
              }`}>
                {s.proficiency}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Availability Schedule */}
      {match.availability && match.availability.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-[#111111]/60 dark:text-white/60 pt-1">
          <Calendar className="w-3.5 h-3.5 text-[#111111]/50 dark:text-white/50 shrink-0" />
          <span>Available:</span>
          <span className="text-[#111111] dark:text-white font-medium">
            {match.availability.map(a => `${a.weekday} (${a.startTime}-${a.endTime})`).join(', ')}
          </span>
        </div>
      )}

      {/* Match Breakdown Progress Bars */}
      <div className="bg-[#FAF8F3] dark:bg-[#181818] p-3 border border-[#E5E0D8] dark:border-[#262626]">
        <div className="flex justify-between text-[11px] text-[#111111]/60 dark:text-white/60 mb-2 font-bold uppercase tracking-wider">
          <span>5-Factor Evaluation Breakdown</span>
          <span className="font-mono font-bold text-[#111111] dark:text-white">{match.matchScore}/100</span>
        </div>
        <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
          <div>
            <div className="h-1 bg-[#E5E0D8] dark:bg-[#333] overflow-hidden mb-1">
              <div
                className="h-full bg-[#111111] dark:bg-[#FAF8F3]"
                style={{ width: `${(match.breakdown.skillScore / 40) * 100}%` }}
              />
            </div>
            <span className="text-[#111111]/60 dark:text-[#FAF8F3]/60">Skill ({match.breakdown.skillScore}/40)</span>
          </div>
          <div>
            <div className="h-1 bg-[#E5E0D8] dark:bg-[#333] overflow-hidden mb-1">
              <div
                className="h-full bg-[#111111] dark:bg-[#FAF8F3]"
                style={{ width: `${(match.breakdown.availabilityScore / 25) * 100}%` }}
              />
            </div>
            <span className="text-[#111111]/60 dark:text-[#FAF8F3]/60">Avail ({match.breakdown.availabilityScore}/25)</span>
          </div>
          <div>
            <div className="h-1 bg-[#E5E0D8] dark:bg-[#333] overflow-hidden mb-1">
              <div
                className="h-full bg-[#111111] dark:bg-[#FAF8F3]"
                style={{ width: `${(match.breakdown.locationScore / 15) * 100}%` }}
              />
            </div>
            <span className="text-[#111111]/60 dark:text-[#FAF8F3]/60">Area ({match.breakdown.locationScore}/15)</span>
          </div>
          <div>
            <div className="h-1 bg-[#E5E0D8] dark:bg-[#333] overflow-hidden mb-1">
              <div
                className="h-full bg-[#111111] dark:bg-[#FAF8F3]"
                style={{ width: `${(match.breakdown.ratingScore / 10) * 100}%` }}
              />
            </div>
            <span className="text-[#111111]/60 dark:text-[#FAF8F3]/60">Rating ({match.breakdown.ratingScore}/10)</span>
          </div>
          <div>
            <div className="h-1 bg-[#E5E0D8] dark:bg-[#333] overflow-hidden mb-1">
              <div
                className="h-full bg-[#111111] dark:bg-[#FAF8F3]"
                style={{ width: `${(match.breakdown.reliabilityScore / 10) * 100}%` }}
              />
            </div>
            <span className="text-[#111111]/60 dark:text-[#FAF8F3]/60">Rel ({match.breakdown.reliabilityScore}/10)</span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={() => onRequestBooking(match)}
        className="w-full py-2.5 px-4 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer border border-black"
      >
        <span>Request Help & Schedule</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#FFD21C]" />
      </button>
    </div>
  );
};

