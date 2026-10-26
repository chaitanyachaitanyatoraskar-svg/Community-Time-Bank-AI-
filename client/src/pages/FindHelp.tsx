import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Category, MatchScoreResult, Listing } from '../types';
import { BookingModal } from '../components/BookingModal';
import { CardSkeleton } from '../components/SkeletonLoader';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  SlidersHorizontal,
  User,
  Check
} from 'lucide-react';

export const FindHelp: React.FC = () => {
  const [activeView, setActiveView] = useState<'OFFERS' | 'ALL_HELPERS' | 'AI_RECOMMENDATIONS'>('OFFERS');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string>('');
  
  const [matches, setMatches] = useState<MatchScoreResult[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMatch, setSelectedMatch] = useState<{
    helperId: string;
    helperName: string;
    listingId?: string;
    listingTitle?: string;
    multiplier?: number;
    complexityLevel?: string;
    materialsRequired?: boolean;
  } | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
    api.getListings({ type: 'OFFER' }).then(setListings).catch(console.error);
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const catObj = categories.find(c => c.id === selectedCategory);
      const [matchData, listingsData] = await Promise.all([
        api.previewMatches({
          categoryId: selectedCategory || undefined,
          categoryName: catObj?.name,
          title: searchQuery || 'computer python gardening math design',
          description: searchQuery,
          area: areaFilter || 'Downtown'
        }),
        api.getListings({ type: 'OFFER', categoryId: selectedCategory || undefined })
      ]);
      setMatches(matchData);
      setListings(listingsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [selectedCategory, areaFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Editorial Page Header */}
      <div className="border-b border-[#E5E0D8] dark:border-[#262626] pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#FFD21C] inline-block" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]/70 dark:text-white/70">
            Civic Skill Catalog
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-white">
          Find Community Help
        </h1>
        <p className="text-sm sm:text-base text-[#111111]/70 dark:text-[#E5E0D8]/70 max-w-2xl leading-relaxed">
          Connect with trusted neighbors and student tutors. Every hour spent is verified and reciprocal under fair-credit governance.
        </p>
      </div>

      {/* Search & Filter Header */}
      <div className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#262626] p-6 space-y-5 rounded-none">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#111111]/40 dark:text-white/40 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills (e.g. Python, UI Design, Calculus, Organic Gardening...)"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FDFBF7] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] rounded-none text-xs text-[#111111] dark:text-white placeholder-[#111111]/40 focus:outline-hidden focus:border-black transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-none transition-colors shrink-0 cursor-pointer border border-black"
            >
              Search Catalog
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-[#FDFBF7] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-3 py-2 bg-[#FDFBF7] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
            >
              <option value="all">Online or In-Person</option>
              <option value="online">Online Only</option>
              <option value="in-person">In-Person Only</option>
            </select>

            <select
              className="px-3 py-2 bg-[#FDFBF7] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
            >
              <option value="">Any Schedule</option>
              <option value="weekends">Weekends</option>
              <option value="weekdays">Weekdays</option>
            </select>

            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="px-3 py-2 bg-[#FDFBF7] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
            >
              <option value="">All Campus Areas</option>
              <option value="Downtown">Downtown</option>
              <option value="Westside">Westside</option>
              <option value="Northside">Northside</option>
              <option value="Campus Center">Campus Center</option>
            </select>
          </div>
        </form>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between border-t border-[#E5E0D8] dark:border-[#262626] pt-4 text-xs overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveView('OFFERS')}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
                activeView === 'OFFERS'
                  ? 'bg-[#FFD21C] text-black border border-black shadow-[2px_2px_0px_0px_#111111]'
                  : 'text-[#111111] dark:text-white hover:bg-[#F7F4EC] dark:hover:bg-[#222] border border-transparent'
              }`}
            >
              <span>Service Offers</span>
              <span className={`text-[10px] px-1.5 py-0.2 font-mono ${
                activeView === 'OFFERS' ? 'bg-black text-[#FFD21C]' : 'bg-[#E5E0D8] dark:bg-[#333] text-[#111111] dark:text-white'
              }`}>
                {listings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveView('ALL_HELPERS')}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                activeView === 'ALL_HELPERS'
                  ? 'bg-[#FFD21C] text-black border border-black shadow-[2px_2px_0px_0px_#111111]'
                  : 'text-[#111111] dark:text-white hover:bg-[#F7F4EC] dark:hover:bg-[#222] border border-transparent'
              }`}
            >
              Available Helpers ({matches.length})
            </button>

            <button
              onClick={() => setActiveView('AI_RECOMMENDATIONS')}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'AI_RECOMMENDATIONS'
                  ? 'bg-[#FFD21C] text-black border border-black shadow-[2px_2px_0px_0px_#111111]'
                  : 'text-[#111111] dark:text-white hover:bg-[#F7F4EC] dark:hover:bg-[#222] border border-transparent'
              }`}
            >
              <span>Algorithm Recommendations</span>
            </button>
          </div>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 bg-[#FAF8F3] dark:bg-[#141414] border-l-4 border-[#123D32] border-y border-r border-[#E5E0D8] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#123D32] shrink-0" />
            <span className="font-medium text-[#111111] dark:text-white">{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-[#111111]/70 dark:text-white/70 font-bold ml-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Main Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : activeView === 'OFFERS' ? (
        /* Community Offers with Multipliers */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E0D8] dark:border-[#262626] pb-3">
            <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-white">
              Community Service Offers ({listings.length})
            </h2>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-[#111111]/60 dark:text-white/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#FFD21C] border border-black"></span> 1.0× Standard
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#123D32]"></span> 1.25× Intermediate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-black"></span> 1.5× Advanced
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => {
              const mult = item.multiplier || 1.0;
              const hours = item.durationHours || 1.0;
              const totalCredits = (hours * mult).toFixed(1);
              const helperName = item.owner?.profile?.fullName || item.owner?.email || 'Helper';

              return (
                <div
                  key={item.id}
                  className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#262626] rounded-none p-6 flex flex-col justify-between space-y-4 hover:border-black dark:hover:border-white transition-all"
                >
                  <div className="space-y-3">
                    {/* Category & Multiplier Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] dark:text-white bg-[#F7F4EC] dark:bg-[#222] px-2.5 py-0.5 border border-[#E5E0D8] dark:border-[#333]">
                        {item.category?.name || 'General'}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${
                        mult >= 1.5
                          ? 'bg-black text-[#FFD21C] border-black'
                          : mult >= 1.25
                          ? 'bg-[#123D32] text-white border-[#123D32]'
                          : 'bg-[#FFD21C] text-black border-black'
                      }`}>
                        {mult}× {item.complexityLevel || 'STANDARD'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-white leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#111111]/70 dark:text-white/70 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Complexity explanation if exists */}
                    {item.complexityExplanation && (
                      <div className="text-[11px] bg-[#F7F4EC] dark:bg-[#1c1c1c] p-2.5 border-l-2 border-[#FFD21C] text-[#111111]/80 dark:text-white/80 italic">
                        <span className="font-bold not-italic block text-[10px] uppercase text-[#111111]/60">Approved {mult}× justification:</span>
                        {item.complexityExplanation}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.materialsRequired && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#FAF8F3] dark:bg-[#1e1e1e] text-[#111111] dark:text-white border border-[#E5E0D8] dark:border-[#333] font-medium">
                          Materials Required
                        </span>
                      )}
                      {item.urgencyLevel === 'URGENT' && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#FFD21C] text-black border border-black font-bold uppercase tracking-wider">
                          Priority Assistance
                        </span>
                      )}
                    </div>

                    {/* Provider info */}
                    <div className="flex items-center gap-2.5 pt-3 border-t border-[#E5E0D8] dark:border-[#262626] text-xs text-[#111111]/70 dark:text-white/70">
                      <div className="w-7 h-7 bg-[#111111] text-[#FFD21C] font-bold text-xs flex items-center justify-center border border-black">
                        {helperName.charAt(0)}
                      </div>
                      <span className="font-bold text-[#111111] dark:text-white">{helperName}</span>
                      <span>•</span>
                      <span>{item.owner?.profile?.averageRating ? `${item.owner.profile.averageRating.toFixed(1)} Rating` : 'Verified Member'}</span>
                    </div>
                  </div>

                  {/* Rate footer & Book button */}
                  <div className="pt-4 border-t border-[#E5E0D8] dark:border-[#262626] flex items-center justify-between gap-3">
                    <div>
                      <div className="font-serif text-xl font-bold text-[#111111] dark:text-white">
                        {totalCredits} <span className="text-xs font-sans font-normal text-[#111111]/60">Credits</span>
                      </div>
                      <div className="text-[10px] text-[#111111]/50 dark:text-white/50 font-mono">
                        {hours}h @ {mult}× rate
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedMatch({
                          helperId: item.ownerId,
                          helperName,
                          listingId: item.id,
                          listingTitle: item.title,
                          multiplier: item.multiplier,
                          complexityLevel: item.complexityLevel,
                          materialsRequired: item.materialsRequired
                        });
                        setBookingModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer border border-black flex items-center gap-1.5"
                    >
                      <span>Request</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FFD21C]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeView === 'ALL_HELPERS' ? (
        /* Available Helpers List */
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-white border-b border-[#E5E0D8] dark:border-[#262626] pb-3">
            Available Helpers ({matches.length})
          </h2>
          <div className="space-y-3">
            {matches.map((helper) => (
              <div
                key={helper.helperId}
                className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#262626] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-none hover:border-black transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#111111] text-[#FFD21C] font-bold text-lg flex items-center justify-center border border-black shrink-0">
                    {helper.helperName.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-white">{helper.helperName}</h3>
                    <p className="text-xs text-[#111111]/70 dark:text-white/70">
                      {helper.skills[0]?.category || 'Technical & Academic Assistance'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#111111] dark:text-white pt-0.5">
                      <span className="font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#FFD21C] text-[#FFD21C]" />
                        {helper.averageRating.toFixed(1)}
                      </span>
                      <span className="text-[#111111]/50">({helper.reviewCount} verified sessions)</span>
                    </div>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {helper.skills.map((s, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-[#F7F4EC] dark:bg-[#222] text-[#111111] dark:text-white border border-[#E5E0D8] dark:border-[#333] font-medium">
                          {s.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#111111]/60 dark:text-white/60 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#111111]/50" />
                      <span>Available: {helper.availability[0]?.weekday || 'Saturday'}, 2:00 PM - 6:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSelectedMatch({
                        helperId: helper.helperId,
                        helperName: helper.helperName,
                        multiplier: 1.0,
                        complexityLevel: 'STANDARD'
                      });
                      setBookingModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors border border-black cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Request Helper</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FFD21C]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* AI Recommendations View */
        <div className="space-y-6">
          <div className="bg-[#FAF8F3] dark:bg-[#181818] p-6 border border-[#E5E0D8] dark:border-[#262626]">
            <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-white">
              5-Factor Match Engine Recommendations
            </h2>
            <p className="text-xs text-[#111111]/70 dark:text-white/70 mt-1">
              Ranked by skill relevance, schedule availability, geographic location in <strong>Downtown</strong>, and member rating history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matches.map((m) => (
              <div key={m.helperId} className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#262626] p-6 flex flex-col justify-between space-y-4 hover:border-black rounded-none transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#111111] text-[#FFD21C] font-bold text-sm flex items-center justify-center border border-black">
                        {m.helperName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#111111] dark:text-white">{m.helperName}</h3>
                        <p className="text-[11px] text-[#111111]/60 dark:text-white/60">{m.skills[0]?.name || 'Developer'}</p>
                        <div className="text-[11px] text-[#111111]/60">
                          {m.averageRating.toFixed(1)} ★ ({m.reviewCount} reviews)
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 bg-[#FFD21C] text-black border border-black text-xs font-mono font-bold">
                      {m.matchScore}%
                    </span>
                  </div>

                  {/* Objective Match Breakdown */}
                  <div className="space-y-1.5 py-3 border-t border-[#E5E0D8] dark:border-[#262626] text-xs text-[#111111]/70 dark:text-white/70">
                    <div className="flex justify-between text-[11px]">
                      <span>Skill Relevancy</span>
                      <span className="text-[#111111] dark:text-white font-bold">High Overlap</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Proximity</span>
                      <span className="text-[#111111] dark:text-white font-bold">Campus Downtown</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Schedule Alignment</span>
                      <span className="text-[#111111] dark:text-white font-bold">Matching Windows</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedMatch({
                      helperId: m.helperId,
                      helperName: m.helperName,
                      multiplier: 1.0,
                      complexityLevel: 'STANDARD'
                    });
                    setBookingModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors border border-black cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Request Service</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FFD21C]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedMatch && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          helperId={selectedMatch.helperId}
          helperName={selectedMatch.helperName}
          listingId={selectedMatch.listingId}
          listingTitle={selectedMatch.listingTitle}
          multiplier={selectedMatch.multiplier}
          complexityLevel={selectedMatch.complexityLevel}
          materialsRequired={selectedMatch.materialsRequired}
          onSuccess={() => {
            setSuccessBanner(`Booking request sent to ${selectedMatch.helperName}. Track progress in My Bookings.`);
          }}
        />
      )}
    </div>
  );
};

