import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CommunityPool, AuthUser } from '../types';
import { StatCardSkeleton } from '../components/SkeletonLoader';
import {
  HeartHandshake,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Gift,
  UserCheck,
  Quote
} from 'lucide-react';

interface CommunityPoolProps {
  user: AuthUser | null;
  onUserUpdate?: () => void;
}

export const CommunityPoolPage: React.FC<CommunityPoolProps> = ({ user, onUserUpdate }) => {
  const [pool, setPool] = useState<CommunityPool | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  
  // Donate form
  const [donationAmount, setDonationAmount] = useState<number>(1);
  const [donationNote, setDonationNote] = useState<string>('');
  const [donating, setDonating] = useState(false);
  const [donateSuccess, setDonateSuccess] = useState(false);
  const [donateError, setDonateError] = useState<string | null>(null);

  // Admin Allocate form
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [recipientId, setRecipientId] = useState<string>('');
  const [allocateAmount, setAllocateAmount] = useState<number>(1);
  const [allocateReason, setAllocateReason] = useState<string>('');
  const [allocating, setAllocating] = useState(false);
  const [allocateSuccess, setAllocateSuccess] = useState(false);
  const [allocateError, setAllocateError] = useState<string | null>(null);

  const loadPool = async () => {
    try {
      setLoading(true);
      const data = await api.getCommunityPool();
      setPool(data);
    } catch (err: any) {
      console.error('Failed to load community pool data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminUsers = async () => {
    if (user?.role === 'ADMIN') {
      try {
        const users = await api.getAdminUsers();
        setAllUsers(users);
        if (users.length > 0 && !recipientId) {
          setRecipientId(users[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch admin users:', err);
      }
    }
  };

  useEffect(() => {
    loadPool();
    loadAdminUsers();
  }, [user]);

  const userBalance = user?.creditBalance ?? 0;

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (donationAmount <= 0) {
      setDonateError('Please enter a valid credit amount.');
      return;
    }
    if (donationAmount > userBalance) {
      setDonateError(`You have ${userBalance.toFixed(1)} credits available. Cannot donate more than your balance.`);
      return;
    }

    try {
      setDonating(true);
      setDonateError(null);
      await api.donateToCommunityPool(donationAmount, donationNote);
      setDonateSuccess(true);
      if (onUserUpdate) onUserUpdate();
      await loadPool();
      setTimeout(() => {
        setDonateSuccess(false);
        setShowDonateModal(false);
        setDonationNote('');
      }, 1500);
    } catch (err: any) {
      setDonateError(err.message || 'Donation failed.');
    } finally {
      setDonating(false);
    }
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientId || allocateAmount <= 0 || !allocateReason.trim()) {
      setAllocateError('Recipient, positive amount, and audit reason are required.');
      return;
    }
    if (pool && allocateAmount > pool.currentBalance) {
      setAllocateError(`Pool balance is ${pool.currentBalance.toFixed(1)} credits. Cannot allocate more than available pool balance.`);
      return;
    }

    try {
      setAllocating(true);
      setAllocateError(null);
      await api.allocateFromCommunityPool(recipientId, allocateAmount, allocateReason);
      setAllocateSuccess(true);
      await loadPool();
      setTimeout(() => {
        setAllocateSuccess(false);
        setShowAllocateModal(false);
        setAllocateReason('');
      }, 1500);
    } catch (err: any) {
      setAllocateError(err.message || 'Allocation failed.');
    } finally {
      setAllocating(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header Card with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E5E0D8] dark:border-[#262626]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#FFD21C] inline-block" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]/70 dark:text-white/70">
              Solidarity & Mutual Aid Fund
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-white">
            Community Credit Pool
          </h1>
          <p className="text-sm sm:text-base text-[#111111]/70 dark:text-[#E5E0D8]/70 max-w-2xl leading-relaxed">
            A collective time reserve funded by member contributions. Surplus hours support students, seniors, and newcomers experiencing temporary credit deficits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowDonateModal(true)}
            className="px-5 py-2.5 bg-[#FFD21C] hover:bg-[#F4C400] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-none flex items-center gap-2 border border-black shadow-[2px_2px_0px_0px_#111111] transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-[#111111]" />
            <span>Donate Surplus Credits</span>
          </button>

          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setShowAllocateModal(true)}
              className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white font-medium text-xs rounded-none flex items-center gap-2 border border-black cursor-pointer transition-colors"
            >
              <UserCheck className="w-4 h-4 text-[#FFD21C]" />
              <span>Admin: Allocate</span>
            </button>
          )}

          <Link
            to="/redeem"
            className="px-4 py-2.5 bg-[#FAF8F3] dark:bg-[#151515] hover:bg-[#F7F4EC] dark:hover:bg-[#1e1e1e] text-[#111111] dark:text-white font-medium text-xs rounded-none flex items-center gap-2 border border-[#E5E0D8] dark:border-[#262626] transition-colors"
          >
            <Gift className="w-4 h-4 text-[#111111]/60 dark:text-white/60" />
            <span>Redeem Perks</span>
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards + Documentary Visual in Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          {/* Pool Reserve */}
          <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#262626] rounded-none space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111]/60 dark:text-white/60">
                Current Pool Reserve
              </span>
              <div className="w-7 h-7 bg-[#F7F4EC] dark:bg-[#1e1e1e] border border-[#E5E0D8] dark:border-[#333] flex items-center justify-center">
                <Coins className="w-3.5 h-3.5 text-[#111111] dark:text-white" />
              </div>
            </div>
            <div>
              <div className="font-serif text-4xl sm:text-5xl font-bold text-[#111111] dark:text-white">
                {(pool?.currentBalance ?? 0).toFixed(1)}
              </div>
              <p className="text-xs text-[#111111]/60 dark:text-white/60 mt-1">
                Available for administrative grants to community members.
              </p>
            </div>
          </div>

          {/* Member Donations */}
          <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#262626] rounded-none space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111]/60 dark:text-white/60">
                Total Member Donations
              </span>
              <div className="w-7 h-7 bg-[#F7F4EC] dark:bg-[#1e1e1e] border border-[#E5E0D8] dark:border-[#333] flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5 text-[#123D32]" />
              </div>
            </div>
            <div>
              <div className="font-serif text-4xl sm:text-5xl font-bold text-[#111111] dark:text-white">
                {(pool?.totalDonated ?? 0).toFixed(1)}
              </div>
              <p className="text-xs text-[#111111]/60 dark:text-white/60 mt-1">
                Total surplus service hours gifted into the shared fund.
              </p>
            </div>
          </div>

          {/* Grants Distributed */}
          <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#262626] rounded-none space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111]/60 dark:text-white/60">
                Grants Distributed
              </span>
              <div className="w-7 h-7 bg-[#F7F4EC] dark:bg-[#1e1e1e] border border-[#E5E0D8] dark:border-[#333] flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#111111] dark:text-white" />
              </div>
            </div>
            <div>
              <div className="font-serif text-4xl sm:text-5xl font-bold text-[#111111] dark:text-white">
                {(pool?.totalAllocated ?? 0).toFixed(1)}
              </div>
              <p className="text-xs text-[#111111]/60 dark:text-white/60 mt-1">
                Allocated to students and peers under documented justifications.
              </p>
            </div>
          </div>

          {/* Documentary Photo Card matching reference right */}
          <div className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#262626] rounded-none overflow-hidden relative group hidden md:block">
            <img
              src="/images/hero_collaboration.jpg"
              alt="Community solidarity"
              className="w-full h-full object-cover grayscale contrast-125 filter group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
              <div className="text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#FFD21C] font-bold block">
                  Mutual Aid In Action
                </span>
                <p className="text-xs text-stone-200 font-sans mt-0.5">
                  Campus tutoring grant session
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content: Left Column Ledger + Right Column Audit & Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        {/* Left Column (7 cols): Recent Solidarity Contributions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#E5E0D8] dark:border-[#262626] pb-2">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-white">
                Recent Solidarity Contributions
              </h2>
              <p className="text-xs text-[#111111]/60 dark:text-white/60 mt-0.5">
                Community ledger of member time donations.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {!pool?.recentDonations || pool.recentDonations.length === 0 ? (
              <div className="bg-[#FAF8F3] dark:bg-[#151515] p-8 border border-[#E5E0D8] dark:border-[#262626] text-center text-xs text-[#111111]/60">
                No pool donations recorded yet. Be the first to contribute surplus hours!
              </div>
            ) : (
              pool.recentDonations.map((d) => (
                <div
                  key={d.id}
                  className="bg-[#FAF8F3] dark:bg-[#151515] p-5 border border-[#E5E0D8] dark:border-[#262626] rounded-none flex items-start justify-between gap-4 transition-colors hover:border-[#111111]/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-[#111111] text-[#FFD21C] flex items-center justify-center font-bold text-sm shrink-0 border border-black">
                      {d.user?.profile?.fullName ? d.user.profile.fullName.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs uppercase tracking-wider text-[#111111] dark:text-white">
                          {d.user?.profile?.fullName || d.user?.email || 'Community Member'}
                        </span>
                        {d.user?.profile?.area && (
                          <span className="text-[11px] text-[#111111]/50 dark:text-white/50">
                            • {d.user.profile.area}
                          </span>
                        )}
                      </div>

                      {d.note && (
                        <div className="text-xs text-[#111111]/80 dark:text-white/80 bg-[#F7F4EC] dark:bg-[#1c1c1c] p-2.5 border-l-2 border-[#FFD21C] italic">
                          "{d.note}"
                        </div>
                      )}

                      <div className="text-[10px] text-[#111111]/50 dark:text-white/50 pt-0.5">
                        {new Date(d.createdAt).toLocaleDateString()} at {new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-xs text-[#123D32] dark:text-emerald-400 bg-[#123D32]/10 dark:bg-[#123D32]/30 px-2 py-1 rounded-none border border-[#123D32]/20">
                      +{d.amount.toFixed(1)} cr
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Grant Allocation Audit Trail + Quote Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Audit Card */}
          <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#262626] rounded-none space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] dark:border-[#262626] pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-white">
                  Grant Allocation Audit Trail
                </h3>
                <p className="text-[11px] text-[#111111]/60 dark:text-white/60 mt-0.5">
                  Admins distribute pool credits strictly based on documented community need.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] dark:text-white px-2 py-0.5 bg-[#F7F4EC] dark:bg-[#222] border border-[#E5E0D8] dark:border-[#333]">
                Immutable
              </span>
            </div>

            <div className="space-y-3">
              {!pool?.recentAllocations || pool.recentAllocations.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#111111]/50">
                  No allocations recorded yet.
                </div>
              ) : (
                pool.recentAllocations.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#2c2c2c] rounded-none space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#111111] dark:text-white">
                        Recipient: {a.recipient?.profile?.fullName || a.recipient?.email || 'Member'}
                      </span>
                      <span className="font-mono font-bold text-xs text-[#123D32] dark:text-emerald-400">
                        +{a.amount.toFixed(1)} cr
                      </span>
                    </div>

                    <div className="text-[11px] text-[#111111]/70 dark:text-white/70">
                      <strong className="text-[#111111] dark:text-white">Audit Reason:</strong> {a.reason}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#111111]/50 dark:text-white/50 pt-1 border-t border-[#E5E0D8]/60 dark:border-[#333]">
                      <span>Admin: {a.admin?.profile?.fullName || 'Campus Admin'}</span>
                      <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Editorial Quote + Collage block matching reference image */}
          <div className="bg-[#FAF8F3] dark:bg-[#181818] p-6 border border-[#E5E0D8] dark:border-[#262626] rounded-none relative overflow-hidden flex items-center justify-between gap-4">
            <div className="space-y-3 max-w-xs z-10">
              <span className="text-4xl font-serif text-[#FFD21C] leading-none block select-none">
                “
              </span>
              <p className="font-serif text-lg text-[#111111] dark:text-white italic leading-snug">
                Small acts of help create big opportunities.
              </p>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#111111]/50 dark:text-white/50 block">
                TimeBank Community Creed
              </span>
            </div>

            <div className="w-28 h-28 shrink-0 overflow-hidden border border-[#E5E0D8] dark:border-[#333]">
              <img
                src="/images/campus_walk.jpg"
                alt="Students walking together"
                className="w-full h-full object-cover grayscale contrast-125 filter"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DONATE MODAL */}
      {showDonateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FAF8F3] dark:bg-[#151515] w-full max-w-md p-6 border-2 border-black dark:border-[#333] shadow-[6px_6px_0px_0px_#111111] space-y-5 rounded-none">
            <div className="border-b border-[#E5E0D8] dark:border-[#262626] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD21C] bg-black px-2 py-0.5 inline-block mb-1">
                Mutual Aid
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#111111] dark:text-white">
                Donate Time Credits
              </h3>
              <p className="text-xs text-[#111111]/70 dark:text-white/70">
                Gift surplus hours to the Community Credit Pool.
              </p>
            </div>

            {donateError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                {donateError}
              </div>
            )}

            {donateSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#123D32] mx-auto" />
                <h4 className="font-serif text-xl font-bold">Donation Recorded</h4>
                <p className="text-xs text-[#111111]/70">
                  {donationAmount.toFixed(1)} credits deposited into the community reserve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDonate} className="space-y-4">
                <div className="p-3 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] flex items-center justify-between text-xs">
                  <span className="text-[#111111]/70 dark:text-white/70">Your Available Balance:</span>
                  <span className="font-mono font-bold text-sm text-[#111111] dark:text-white">{userBalance.toFixed(1)} Credits</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
                    Donation Amount (Hours)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[0.5, 1.0, 2.0, 5.0].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setDonationAmount(preset)}
                        className={`py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          donationAmount === preset
                            ? 'bg-[#FFD21C] text-black border-2 border-black font-extrabold'
                            : 'bg-[#FDFBF7] dark:bg-[#222] border border-[#E5E0D8] dark:border-[#444] text-[#111111] dark:text-white hover:bg-[#F7F4EC]'
                        }`}
                      >
                        {preset.toFixed(1)}h
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max={userBalance}
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] dark:border-[#333] bg-[#FAF8F3] dark:bg-[#151515] focus:outline-hidden focus:border-black font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1">
                    Dedication Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={donationNote}
                    onChange={(e) => setDonationNote(e.target.value)}
                    placeholder="e.g. For student exam study support or lab access"
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] dark:border-[#333] bg-[#FAF8F3] dark:bg-[#151515] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDonateModal(false)}
                    className="flex-1 py-2.5 border border-[#E5E0D8] dark:border-[#333] text-xs font-bold uppercase tracking-wider hover:bg-[#F7F4EC] dark:hover:bg-[#222] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={donating || donationAmount <= 0 || donationAmount > userBalance}
                    className="flex-1 py-2.5 bg-[#FFD21C] hover:bg-[#F4C400] text-black text-xs font-bold uppercase tracking-wider border border-black transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {donating ? 'Processing...' : `Donate ${donationAmount.toFixed(1)} Cr`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ADMIN ALLOCATE MODAL */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FAF8F3] dark:bg-[#151515] w-full max-w-md p-6 border-2 border-black dark:border-[#333] shadow-[6px_6px_0px_0px_#111111] space-y-5 rounded-none">
            <div className="border-b border-[#E5E0D8] dark:border-[#262626] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD21C] bg-black px-2 py-0.5 inline-block mb-1">
                Admin Governance
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#111111] dark:text-white">
                Allocate Pool Credits
              </h3>
              <p className="text-xs text-[#111111]/70 dark:text-white/70">
                Grant solidarity hours with an immutable audit justification.
              </p>
            </div>

            {allocateError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                {allocateError}
              </div>
            )}

            {allocateSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#123D32] mx-auto" />
                <h4 className="font-serif text-xl font-bold">Allocation Completed</h4>
                <p className="text-xs text-[#111111]/70">
                  {allocateAmount.toFixed(1)} credits allocated to recipient.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAllocate} className="space-y-4">
                <div className="p-3 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] flex items-center justify-between text-xs">
                  <span className="text-[#111111]/70 dark:text-white/70">Available Reserve:</span>
                  <span className="font-mono font-bold text-sm text-[#111111] dark:text-white">{(pool?.currentBalance ?? 0).toFixed(1)} Credits</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1">
                    Recipient Member
                  </label>
                  <select
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] dark:border-[#333] bg-[#FAF8F3] dark:bg-[#151515] focus:outline-hidden focus:border-black"
                    required
                  >
                    <option value="">-- Choose Member --</option>
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.profile?.fullName || u.email} ({u.email}) - {u.creditBalance.toFixed(1)} cr
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1">
                    Credits to Allocate
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max={pool?.currentBalance ?? 100}
                    value={allocateAmount}
                    onChange={(e) => setAllocateAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] dark:border-[#333] bg-[#FAF8F3] dark:bg-[#151515] focus:outline-hidden focus:border-black font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1">
                    Mandatory Audit Justification
                  </label>
                  <textarea
                    rows={3}
                    value={allocateReason}
                    onChange={(e) => setAllocateReason(e.target.value)}
                    placeholder="e.g. Verified peer tutoring need for student experiencing illness"
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] dark:border-[#333] bg-[#FAF8F3] dark:bg-[#151515] focus:outline-hidden focus:border-black"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAllocateModal(false)}
                    className="flex-1 py-2.5 border border-[#E5E0D8] dark:border-[#333] text-xs font-bold uppercase tracking-wider hover:bg-[#F7F4EC] dark:hover:bg-[#222] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={allocating || allocateAmount <= 0}
                    className="flex-1 py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider border border-black transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {allocating ? 'Allocating...' : 'Confirm Allocation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPoolPage;

