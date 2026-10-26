import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { RedemptionOption, Redemption, AuthUser } from '../types';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
  Gift,
  Ticket,
  Percent,
  Package,
  Wrench,
  Coins,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  HeartHandshake,
  Search,
  Calendar,
  Building2,
  ChevronRight
} from 'lucide-react';

interface RedeemCreditsProps {
  user: AuthUser | null;
  onUserUpdate?: () => void;
}

export const RedeemCredits: React.FC<RedeemCreditsProps> = ({ user, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'history'>('catalog');
  const [options, setOptions] = useState<RedemptionOption[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Redeem modal state
  const [selectedOption, setSelectedOption] = useState<RedemptionOption | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Success modal state
  const [successRedemption, setSuccessRedemption] = useState<Redemption | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [opts, history] = await Promise.all([
        api.getRedemptionOptions(),
        api.getMyRedemptions()
      ]);
      setOptions(opts);
      setRedemptions(history);
    } catch (err: any) {
      console.error('Failed to load redemption data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedOption) return;
    try {
      setRedeeming(true);
      setErrorMsg(null);
      const res = await api.redeemOption(selectedOption.id);
      
      setSuccessRedemption(res.redemption);
      setSelectedOption(null);
      if (onUserUpdate) onUserUpdate();
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete redemption.');
    } finally {
      setRedeeming(false);
    }
  };

  const categories = [
    { key: 'ALL', label: 'All Perks', icon: Gift },
    { key: 'COMMUNITY_EVENT_PASS', label: 'Event Passes', icon: Ticket },
    { key: 'PARTNER_DISCOUNT', label: 'Partner Discounts', icon: Percent },
    { key: 'VOUCHER', label: 'Campus Vouchers', icon: Gift },
    { key: 'DONATED_GOODS', label: 'Donated Goods', icon: Package },
    { key: 'LOCAL_SERVICE', label: 'Local Services', icon: Wrench },
  ];

  const filteredOptions = options.filter(opt => {
    const matchesCat = selectedCategory === 'ALL' || opt.category === selectedCategory;
    const matchesSearch = 
      opt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.partnerName && opt.partnerName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'COMMUNITY_EVENT_PASS':
        return { label: 'Event Pass', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
      case 'PARTNER_DISCOUNT':
        return { label: 'Partner Discount', color: 'bg-[#123D32]/10 text-[#123D32] dark:text-[#F7F4EC] border-[#123D32]/20' };
      case 'VOUCHER':
        return { label: 'Voucher', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
      case 'DONATED_GOODS':
        return { label: 'Donated Goods', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
      case 'LOCAL_SERVICE':
        return { label: 'Community Service', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
      default:
        return { label: 'Perk', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  const getPerkImage = (title: string, category: string) => {
    const t = title.toLowerCase();
    if (t.includes('coffee') || t.includes('cafe')) {
      return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80';
    }
    if (t.includes('garden') || t.includes('plant')) {
      return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop&q=80';
    }
    if (t.includes('book') || t.includes('stationery')) {
      return 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&auto=format&fit=crop&q=80';
    }
    if (t.includes('bike') || t.includes('bicycle')) {
      return 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&auto=format&fit=crop&q=80';
    }
    if (t.includes('3d') || t.includes('laser') || t.includes('print')) {
      return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80';
    }
    if (t.includes('music') || t.includes('fest') || t.includes('pass')) {
      return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&auto=format&fit=crop&q=80';
  };

  const userBalance = user?.creditBalance ?? 4.0;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 bg-[#F7F4EC] dark:bg-[#141414] text-[#111111] dark:text-[#F7F4EC] min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E5E0D8] dark:border-[#262626]">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white tracking-tight">
            Perks & Credit Redemption
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6B6B] dark:text-[#A0A0A0] mt-1 max-w-2xl leading-relaxed font-sans">
            Redeem surplus hours for community event passes, campus partner discounts, and vouchers.
            1 credit equals 1 hour of community assistance. Cash withdrawals are not permitted.
          </p>
        </div>

        {/* User Credit Stats Banner with Yellow Donate Button */}
        <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-4 rounded-none border border-[#E5E0D8] dark:border-[#262626] flex items-center gap-5">
          <div>
            <div className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-wider">
              Available Balance
            </div>
            <div className="font-serif font-bold text-2xl text-[#111111] dark:text-white flex items-baseline gap-1">
              <span>{userBalance.toFixed(1)}</span>
              <span className="text-xs font-mono font-normal text-[#6B6B6B]">Credits</span>
            </div>
          </div>
          <div className="border-l border-[#E5E0D8] dark:border-[#262626] pl-4">
            <Link
              to="/community-pool"
              className="px-4 py-2 rounded-none bg-[#FFD21C] hover:bg-[#E8BD14] text-[#111111] font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Donate to Pool</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#E5E0D8] dark:border-[#262626] pb-1">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-none text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-[#111111] text-white dark:bg-white dark:text-black'
                : 'text-[#4A4A4A] dark:text-[#A0A0A0] hover:bg-[#EFECE3] dark:hover:bg-[#262626]'
            }`}
          >
            <span>All Catalog Perks</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-none bg-white/20 dark:bg-black/20">
              {options.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-none text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#111111] text-white dark:bg-white dark:text-black'
                : 'text-[#4A4A4A] dark:text-[#A0A0A0] hover:bg-[#EFECE3] dark:hover:bg-[#262626]'
            }`}
          >
            <span>My Active Vouchers</span>
            {redemptions.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-none bg-[#FFD21C] text-[#111111] font-mono font-bold">
                {redemptions.length}
              </span>
            )}
          </button>
        </div>

        <Link
          to="/wallet"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-mono uppercase font-bold text-[#6B6B6B] dark:text-[#A0A0A0] hover:text-[#111111] dark:hover:text-white"
        >
          <span>Ledger History →</span>
        </Link>
      </div>

      {/* TAB 1: CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Category Filter Pills & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-none text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black font-semibold'
                        : 'bg-[#FAF8F3] dark:bg-[#1C1C1C] text-[#4A4A4A] dark:text-[#A0A0A0] border-[#E5E0D8] dark:border-[#262626] hover:border-[#111111]'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]" />
              <input
                type="text"
                placeholder="Search perks or partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-none border border-[#E5E0D8] dark:border-[#262626] bg-[#FAF8F3] dark:bg-[#1C1C1C] text-[#111111] dark:text-white placeholder-[#8E8E8E] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          {/* Catalog Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-12 text-center max-w-md mx-auto rounded-none border border-[#E5E0D8] dark:border-[#262626] space-y-2">
              <Gift className="w-8 h-8 text-[#8E8E8E] mx-auto" />
              <h3 className="font-serif font-bold text-base text-[#111111] dark:text-white">
                No redemption perks found
              </h3>
              <p className="text-xs text-[#6B6B6B] dark:text-[#8E8E8E]">
                Try selecting another category or clear your search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOptions.map((opt) => {
                const catBadge = getCategoryBadge(opt.category);
                const canAfford = userBalance >= opt.creditCost;
                const isOutOfStock = opt.quantityRemaining <= 0 || opt.status === 'OUT_OF_STOCK';
                const isPaused = opt.status === 'PAUSED';
                const perkImg = getPerkImage(opt.title, opt.category);

                return (
                  <div
                    key={opt.id}
                    className="bg-[#FAF8F3] dark:bg-[#1C1C1C] rounded-none border border-[#E5E0D8] dark:border-[#262626] overflow-hidden flex flex-col justify-between hover:border-[#111111] dark:hover:border-white transition-colors group"
                  >
                    <div>
                      {/* Editorial Catalog Photo */}
                      <div className="relative h-44 w-full bg-[#111111] overflow-hidden">
                        <img
                          src={perkImg}
                          alt={opt.title}
                          className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-mono uppercase bg-[#111111] text-white px-2 py-0.5 rounded-none font-bold">
                            {catBadge.label}
                          </span>
                        </div>
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="font-mono text-xs uppercase tracking-widest text-white bg-rose-900 px-3 py-1 font-bold">
                              SOLD OUT
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="font-serif font-bold text-base text-[#111111] dark:text-white leading-tight line-clamp-1">
                          {opt.title}
                        </h3>

                        {opt.partnerName && (
                          <p className="text-xs text-[#6B6B6B] dark:text-[#8E8E8E] font-medium flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#8E8E8E]" />
                            <span>{opt.partnerName}</span>
                          </p>
                        )}

                        <p className="text-xs text-[#4A4A4A] dark:text-[#A0A0A0] line-clamp-2 leading-relaxed">
                          {opt.description}
                        </p>

                        {opt.expiryDate && (
                          <p className="text-[11px] font-mono text-[#8E8E8E] pt-1">
                            Valid through: {new Date(opt.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Pricing & Action Section */}
                    <div className="p-5 pt-3 border-t border-[#E5E0D8] dark:border-[#262626] flex items-center justify-between gap-3">
                      <div>
                        <div className="font-serif font-bold text-lg text-[#111111] dark:text-white">
                          {opt.creditCost.toFixed(1)} <span className="text-xs font-mono font-normal uppercase text-[#6B6B6B]">Credits</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedOption(opt)}
                        disabled={isOutOfStock || isPaused || !canAfford}
                        className={`px-4 py-2 rounded-none text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                          isOutOfStock || isPaused
                            ? 'bg-[#EFECE3] dark:bg-[#252525] text-[#8E8E8E] cursor-not-allowed'
                            : !canAfford
                            ? 'bg-[#FAF8F3] dark:bg-[#252525] border border-[#D8D1C2] text-[#8E8E8E] cursor-not-allowed'
                            : 'bg-[#111111] hover:bg-[#2A2A2A] text-white'
                        }`}
                      >
                        <span>{isOutOfStock ? 'Sold Out' : isPaused ? 'Unavailable' : !canAfford ? `Needs ${(opt.creditCost - userBalance).toFixed(1)} cr` : 'Redeem'}</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY VOUCHERS */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E0D8] dark:border-[#262626]">
            <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-white">
              My Active Vouchers & Redemptions
            </h2>
            <div className="text-xs font-mono text-[#6B6B6B] dark:text-[#A0A0A0]">
              Total Claimed: <span className="font-bold text-[#111111] dark:text-white">{redemptions.length}</span>
            </div>
          </div>

          {redemptions.length === 0 ? (
            <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-12 text-center max-w-md mx-auto rounded-none border border-[#E5E0D8] dark:border-[#262626] space-y-2">
              <Ticket className="w-8 h-8 text-[#8E8E8E] mx-auto" />
              <h3 className="font-serif font-bold text-base text-[#111111] dark:text-white">
                No redemptions yet
              </h3>
              <p className="text-xs text-[#6B6B6B] dark:text-[#8E8E8E]">
                You have not redeemed any perks yet. Trade your earned hours in the catalog.
              </p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="px-4 py-2 rounded-none bg-[#111111] text-white text-xs font-semibold hover:bg-[#2A2A2A] transition-colors"
              >
                Browse Catalog →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redemptions.map((redemption) => {
                const isUsed = redemption.status === 'USED';
                const isCopied = copiedCode === redemption.voucherCode;

                return (
                  <div
                    key={redemption.id}
                    className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-5 rounded-none border border-[#E5E0D8] dark:border-[#262626] space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-none font-bold ${
                            isUsed
                              ? 'bg-[#EFECE3] text-[#8E8E8E]'
                              : 'bg-[#FFD21C] text-[#111111]'
                          }`}
                        >
                          {isUsed ? 'USED' : 'READY TO CLAIM'}
                        </span>
                        <span className="text-[11px] font-mono text-[#8E8E8E]">
                          {new Date(redemption.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-base text-[#111111] dark:text-white">
                        {redemption.redemptionOption?.title || 'Community Perk'}
                      </h4>
                      {redemption.redemptionOption?.partnerName && (
                        <p className="text-xs text-[#6B6B6B] dark:text-[#8E8E8E] mt-0.5">
                          Partner: {redemption.redemptionOption.partnerName}
                        </p>
                      )}
                    </div>

                    {/* Voucher Code Box */}
                    <div className="p-3 bg-[#FDFBF7] dark:bg-[#141414] rounded-none border border-[#E5E0D8] dark:border-[#262626] flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#8E8E8E]">
                          Voucher Code
                        </div>
                        <div className="font-mono font-bold text-sm text-[#111111] dark:text-white tracking-widest">
                          {redemption.voucherCode}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyCode(redemption.voucherCode)}
                        className={`px-3 py-1.5 rounded-none text-xs font-semibold flex items-center gap-1 transition-colors ${
                          isCopied
                            ? 'bg-[#111111] text-white'
                            : 'bg-[#FAF8F3] dark:bg-[#252525] border border-[#D8D1C2] text-[#111111] dark:text-white hover:bg-[#EFECE3]'
                        }`}
                        title="Copy Code"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[11px]">{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-[#6B6B6B] dark:text-[#8E8E8E] pt-2 border-t border-[#E5E0D8] dark:border-[#262626]">
                      <span>Cost: <strong>{redemption.creditsSpent.toFixed(1)} cr</strong></span>
                      {isUsed && redemption.usedAt && (
                        <span>Redeemed: {new Date(redemption.usedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CONFIRM REDEMPTION MODAL */}
      {selectedOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
          <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] border-2 border-[#111111] w-full max-w-md p-6 rounded-none space-y-4 shadow-[6px_6px_0px_0px_#111111]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFD21C] bg-[#111111] px-2 py-0.5 rounded-none font-bold">
                CONFIRM REDEMPTION
              </span>
              <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-white mt-2">
                Redeem Community Benefit
              </h3>
              <p className="text-xs text-[#6B6B6B] dark:text-[#8E8E8E]">
                Verify the exchange details below before confirming.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-none text-rose-700 dark:text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="p-4 bg-[#FDFBF7] dark:bg-[#141414] rounded-none border border-[#E5E0D8] dark:border-[#262626] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Perk:</span>
                <span className="font-bold text-[#111111] dark:text-white">{selectedOption.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Credit Cost:</span>
                <span className="font-mono font-bold text-[#111111] dark:text-[#FFD21C]">{selectedOption.creditCost.toFixed(1)} Credits</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E5E0D8] dark:border-[#262626]">
                <span className="text-[#6B6B6B]">Remaining Balance:</span>
                <span className="font-mono font-bold text-[#111111] dark:text-white">{(userBalance - selectedOption.creditCost).toFixed(1)} Credits</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setSelectedOption(null); setErrorMsg(null); }}
                className="flex-1 py-2 rounded-none border border-[#D8D1C2] text-xs font-semibold text-[#111111] dark:text-white hover:bg-[#EFECE3]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                disabled={redeeming}
                className="flex-1 py-2 rounded-none bg-[#111111] hover:bg-[#2A2A2A] text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {redeeming ? 'Redeeming...' : 'Confirm Exchange'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {successRedemption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] border-2 border-[#111111] w-full max-w-md p-6 rounded-none space-y-4 text-center shadow-[6px_6px_0px_0px_#111111]">
            <span className="w-12 h-12 bg-[#FFD21C] text-[#111111] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#111111] dark:text-white">
              Perk Redeemed Successfully
            </h3>
            <p className="text-xs text-[#6B6B6B] dark:text-[#8E8E8E]">
              Present this voucher code to the partner to claim your benefit.
            </p>

            <div className="p-3 bg-[#FDFBF7] dark:bg-[#141414] rounded-none border border-[#E5E0D8] dark:border-[#262626] font-mono text-base font-bold text-[#111111] dark:text-white tracking-widest">
              {successRedemption.voucherCode}
            </div>

            <button
              onClick={() => { setSuccessRedemption(null); setActiveTab('history'); }}
              className="w-full py-2.5 rounded-none bg-[#111111] hover:bg-[#2A2A2A] text-white text-xs font-semibold transition-colors"
            >
              View in My Vouchers →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
