import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Listing, Category } from '../types';
import { CardSkeleton } from '../components/SkeletonLoader';
import { 
  Plus, 
  Trash2, 
  HandHeart, 
  HelpCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2,
  Scale,
  Check
} from 'lucide-react';

export const MyListings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialTab = searchParams.get('tab') === 'offer' ? 'OFFER' : 'REQUEST';
  const [activeTab, setActiveTab] = useState<'REQUEST' | 'OFFER'>(initialTab);
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationHours, setDurationHours] = useState(1.0);
  const [complexityLevel, setComplexityLevel] = useState<'STANDARD' | 'INTERMEDIATE' | 'ADVANCED'>('STANDARD');
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [complexityExplanation, setComplexityExplanation] = useState<string>('');
  const [materialsRequired, setMaterialsRequired] = useState<boolean>(false);
  const [mode, setMode] = useState('Online');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('15:00');
  const [availabilityDays, setAvailabilityDays] = useState('Saturday & Sunday afternoons');
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'offer') setActiveTab('OFFER');
    if (tab === 'request') setActiveTab('REQUEST');
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, myListings] = await Promise.all([
        api.getCategories(),
        api.getMyListings()
      ]);
      setCategories(cats);
      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0].id);
      }
      setListings(myListings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setSuccessMessage(null);

    try {
      await api.createListing({
        type: activeTab,
        categoryId,
        title,
        description,
        durationHours,
        complexityLevel,
        multiplier,
        complexityExplanation: multiplier > 1.0 ? complexityExplanation : null,
        materialsRequired,
        area: 'Downtown',
        preferredDates: activeTab === 'REQUEST' ? `${preferredDate} at ${preferredTime} (${mode})` : `${availabilityDays} (${mode})`
      });

      setSuccessMessage(activeTab === 'OFFER' ? 'New Help Offer posted successfully.' : 'Help Request submitted successfully.');
      setTitle('');
      setDescription('');
      setComplexityExplanation('');
      setMultiplier(1.0);
      setComplexityLevel('STANDARD');
      setMaterialsRequired(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create listing');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.deleteListing(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  const currentTabListings = listings.filter(l => l.type === activeTab);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 bg-[#F7F4EC] dark:bg-[#141414] text-[#111111] dark:text-[#F7F4EC] min-h-screen">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8] dark:border-[#262626]">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white tracking-tight">
            {activeTab === 'OFFER' ? 'Offer Community Help' : 'Request Assistance'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6B6B] dark:text-[#A0A0A0] mt-1 font-sans">
            {activeTab === 'OFFER'
              ? 'List your skills to earn community credits when assisting others.'
              : 'Post what assistance you need to match with available neighborhood helpers.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 bg-[#FAF8F3] dark:bg-[#1C1C1C] p-1 rounded-none text-xs border border-[#E5E0D8] dark:border-[#262626]">
          <button
            onClick={() => {
              setActiveTab('REQUEST');
              setSearchParams({ tab: 'request' });
            }}
            className={`px-3 py-1.5 rounded-none font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'REQUEST'
                ? 'bg-[#111111] text-white'
                : 'text-[#4A4A4A] dark:text-[#A0A0A0] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Request Help</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('OFFER');
              setSearchParams({ tab: 'offer' });
            }}
            className={`px-3 py-1.5 rounded-none font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'OFFER'
                ? 'bg-[#111111] text-white'
                : 'text-[#4A4A4A] dark:text-[#A0A0A0] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <HandHeart className="w-3.5 h-3.5" />
            <span>Offer Help</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-none bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-[#111111] dark:border-[#FFD21C] text-[#111111] dark:text-white text-xs flex items-center justify-between shadow-none">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#123D32] dark:text-[#FFD21C]" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-[#6B6B6B] hover:text-[#111111] font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Main Editorial Form */}
      <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-6 sm:p-8 rounded-none border border-[#E5E0D8] dark:border-[#262626] space-y-6">
        <div className="pb-3 border-b border-[#E5E0D8] dark:border-[#262626]">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] dark:text-[#8E8E8E] block mb-0.5">
            LISTING DETAILS
          </span>
          <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-white">
            {activeTab === 'OFFER' ? 'Publish a Skill Listing' : 'Specify Required Assistance'}
          </h2>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#4A4A4A] dark:text-[#A0A0A0] mb-1.5">
                {activeTab === 'OFFER' ? 'Skill / Service Category' : 'Skill Needed'}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#333333] rounded-none text-xs text-[#111111] dark:text-white focus:outline-none focus:border-[#111111] dark:focus:border-white transition-colors"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#4A4A4A] dark:text-[#A0A0A0] mb-1.5">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={activeTab === 'OFFER' ? 'e.g. Python Programming & Setup' : 'e.g. Need Help Setting up Wireless Printer'}
                className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#333333] rounded-none text-xs text-[#111111] dark:text-white placeholder-[#8E8E8E] focus:outline-none focus:border-[#111111] dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#4A4A4A] dark:text-[#A0A0A0] mb-1.5">Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={activeTab === 'OFFER' ? 'Describe your expertise, scope of assistance, and session structure...' : 'Describe what you need help with and any specific requirements...'}
              className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#333333] rounded-none text-xs text-[#111111] dark:text-white placeholder-[#8E8E8E] focus:outline-none focus:border-[#111111] dark:focus:border-white transition-colors"
            />
          </div>

          {activeTab === 'OFFER' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#4A4A4A] dark:text-[#A0A0A0] mb-1.5">Session Duration</label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#333333] rounded-none text-xs text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]"
                >
                  <option value={1.0}>1.0 hour (1.0 Credit)</option>
                  <option value={1.5}>1.5 hours (1.5 Credits)</option>
                  <option value={2.0}>2.0 hours (2.0 Credits)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#4A4A4A] dark:text-[#A0A0A0] mb-1.5">Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#333333] rounded-none text-xs text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]"
                >
                  <option value="Online">Online</option>
                  <option value="In-person">In-person</option>
                  <option value="Hybrid / Flexible">Hybrid / Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#4A4A4A] dark:text-[#A0A0A0] mb-1.5">Availability Window</label>
                <input
                  type="text"
                  value={availabilityDays}
                  onChange={(e) => setAvailabilityDays(e.target.value)}
                  placeholder="e.g. Saturday afternoons"
                  className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#333333] rounded-none text-xs text-[#111111] dark:text-white placeholder-[#8E8E8E] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#4A4A4A] dark:text-[#A0A0A0] mb-1.5">Preferred Date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#333333] rounded-none text-xs text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#4A4A4A] dark:text-[#A0A0A0] mb-1.5">Preferred Time</label>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#333333] rounded-none text-xs text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#4A4A4A] dark:text-[#A0A0A0] mb-1.5">Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#333333] rounded-none text-xs text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]"
                >
                  <option value="Online">Online</option>
                  <option value="In-person">In-person</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>
          )}

          {/* Complexity Tier & Fair Multiplier Section (Editorial Reference Match!) */}
          <div className="p-5 bg-[#FAF8F3] dark:bg-[#141414] rounded-none border border-[#E5E0D8] dark:border-[#262626] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E5E0D8] dark:border-[#262626]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#111111] dark:text-white flex items-center gap-1.5">
                  <span>⚖️ Fair Credit Multiplier Tier</span>
                </h3>
                <p className="text-[11px] text-[#6B6B6B] dark:text-[#8E8E8E] mt-0.5">
                  Standard tier is 1.0×. Complex tools, certified instruction, or hazardous equipment can be set up to 1.5×.
                </p>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-mono text-[#8E8E8E]">Expected Credit Rate</div>
                <div className="font-mono font-bold text-sm text-[#111111] dark:text-[#FFD21C]">
                  {(durationHours * multiplier).toFixed(1)} Credits
                </div>
              </div>
            </div>

            {/* Presets with Yellow Selection State */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  level: 'STANDARD' as const,
                  mult: 1.0,
                  title: 'Standard (1.0×)',
                  desc: 'General assistance, peer tutoring, conversation'
                },
                {
                  level: 'INTERMEDIATE' as const,
                  mult: 1.25,
                  title: 'Intermediate (1.25×)',
                  desc: 'Certified skills, diagnostics, moderate tools'
                },
                {
                  level: 'ADVANCED' as const,
                  mult: 1.5,
                  title: 'Advanced (1.5× Cap)',
                  desc: 'Component repair, hazardous equipment'
                }
              ].map((opt) => (
                <button
                  key={opt.mult}
                  type="button"
                  onClick={() => {
                    setComplexityLevel(opt.level);
                    setMultiplier(opt.mult);
                  }}
                  className={`p-3.5 rounded-none border text-left transition-colors ${
                    multiplier === opt.mult
                      ? 'bg-[#FFD21C] border-[#111111] text-[#111111] shadow-none'
                      : 'bg-[#FAF8F3] dark:bg-[#1C1C1C] border-[#E5E0D8] dark:border-[#262626] text-[#4A4A4A] dark:text-[#A0A0A0] hover:border-[#111111]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm text-[#111111] dark:text-white leading-tight">
                      {opt.title}
                    </span>
                    {multiplier === opt.mult && <span className="w-2 h-2 rounded-full bg-[#111111]" />}
                  </div>
                  <p className="text-[11px] leading-snug">{opt.desc}</p>
                </button>
              ))}
            </div>

            {/* Materials Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A4A4A] dark:text-[#A0A0A0] pt-1">
              <input
                type="checkbox"
                checked={materialsRequired}
                onChange={(e) => setMaterialsRequired(e.target.checked)}
                className="w-3.5 h-3.5 rounded-none text-[#111111] border-[#E5E0D8] focus:ring-0"
              />
              <span>Specialized tools or materials required for this session</span>
            </label>

            {multiplier > 1.0 && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#4A4A4A] dark:text-[#A0A0A0]">
                  Multiplier Justification <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={complexityExplanation}
                  onChange={(e) => setComplexityExplanation(e.target.value)}
                  placeholder="e.g. Component micro-soldering rework requiring diagnostic oscilloscope"
                  className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#1C1C1C] border border-[#E5E0D8] dark:border-[#262626] rounded-none text-xs text-[#111111] dark:text-white placeholder-[#8E8E8E] focus:outline-none focus:border-[#111111]"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 rounded-none bg-[#111111] hover:bg-[#2A2A2A] text-white font-medium text-xs transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <span>{creating ? 'Submitting...' : activeTab === 'OFFER' ? 'Post Offer Listing' : 'Submit Assistance Request'}</span>
              <span>→</span>
            </button>
          </div>
        </form>
      </div>

      {/* Published Listings Section */}
      <div className="space-y-4 pt-4 border-t border-[#E5E0D8] dark:border-[#262626]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-white">
            Your Active {activeTab === 'OFFER' ? 'Offers' : 'Requests'} ({currentTabListings.length})
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : currentTabListings.length === 0 ? (
          <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-8 rounded-none border border-[#E5E0D8] dark:border-[#262626] text-center text-[#6B6B6B] dark:text-[#8E8E8E] text-xs">
            You do not have any published {activeTab === 'OFFER' ? 'offers' : 'requests'} yet. Share your skills to help your community!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTabListings.map((l) => (
              <div key={l.id} className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-5 rounded-none border border-[#E5E0D8] dark:border-[#262626] flex flex-col justify-between space-y-4 hover:border-[#111111] transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-none bg-[#FAF8F3] dark:bg-[#252525] text-[#111111] dark:text-white border border-[#E5E0D8] dark:border-[#333333]">
                      {l.category?.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {l.multiplier && l.multiplier > 1.0 && (
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-none bg-[#FFD21C] text-[#111111]">
                          {l.multiplier}×
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-[#111111] dark:text-white">
                        {((l.durationHours || 1.0) * (l.multiplier || 1.0)).toFixed(1)} Credits
                      </span>
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#111111] dark:text-white mb-1">{l.title}</h3>
                  <p className="text-xs text-[#4A4A4A] dark:text-[#A0A0A0] line-clamp-2 leading-relaxed">{l.description}</p>
                </div>

                <div className="pt-3 border-t border-[#E5E0D8] dark:border-[#262626] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#8E8E8E]">{l.preferredDates || 'Flexible'}</span>
                  <button
                    onClick={() => handleDeleteListing(l.id)}
                    className="p-1 rounded text-[#8E8E8E] hover:text-rose-600 transition-colors"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
