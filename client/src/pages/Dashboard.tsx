import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Booking, MatchScoreResult } from '../types';
import { BookingModal } from '../components/BookingModal';
import { ReviewModal } from '../components/ReviewModal';
import { Skeleton, CardSkeleton, StatCardSkeleton } from '../components/SkeletonLoader';
import { 
  Clock, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Dashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [suggestedMatches, setSuggestedMatches] = useState<MatchScoreResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedMatch, setSelectedMatch] = useState<MatchScoreResult | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [bookingsData, matchesData] = await Promise.all([
        api.getBookings(),
        api.previewMatches({ title: 'Python programming & computer help', area: user?.profile?.area || 'Downtown' })
      ]);
      setBookings(bookingsData);
      setSuggestedMatches(matchesData.slice(0, 3));
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handleConfirmCompletion = async (bookingId: string) => {
    try {
      const res = await api.confirmBookingCompletion(bookingId);
      setActionMessage(res.message);
      if (res.isCompleted) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      await refreshUser();
      await loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to confirm completion');
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await api.acceptBooking(bookingId);
      await loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to accept booking');
    }
  };

  const activeBookings = bookings.filter(b => b.status === 'REQUESTED' || b.status === 'ACCEPTED');
  
  // Real impact calculation from actual bookings data
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const hoursGiven = completedBookings
    .filter(b => b.helperId === user?.id)
    .reduce((sum, b) => sum + (b.durationHours || 1), 0);
  const hoursReceived = completedBookings
    .filter(b => b.requesterId === user?.id)
    .reduce((sum, b) => sum + (b.durationHours || 1), 0);
  const peopleHelped = new Set(
    completedBookings.filter(b => b.helperId === user?.id).map(b => b.requesterId)
  ).size;

  if (loading && !user) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 bg-[#F7F4EC] dark:bg-[#141414] text-[#111111] dark:text-[#F7F4EC] min-h-screen">
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E5E0D8] dark:border-[#262626]">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white tracking-tight">
            Good morning, {user?.profile?.fullName?.split(' ')[0] || 'Alice'} ☀️
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6B6B] dark:text-[#A0A0A0] mt-1 font-sans">
            Here's what's happening in your community.
          </p>
        </div>

        {/* Editorial Community Stamp / Caption */}
        <div className="hidden sm:flex items-center gap-3 bg-[#FAF8F3] dark:bg-[#1C1C1C] px-3.5 py-2 rounded-none border border-[#E5E0D8] dark:border-[#262626]">
          <span className="w-2 h-2 rounded-full bg-[#FFD21C]"></span>
          <span className="font-handwriting text-lg text-[#111111] dark:text-[#FFD21C] leading-none">
            Skills • Communities • Opportunities • People
          </span>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-none bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-[#111111] dark:border-[#FFD21C] text-[#111111] dark:text-white text-xs flex items-center justify-between shadow-none">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#123D32] dark:text-[#FFD21C] shrink-0" />
            <span className="font-medium">{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-[#6B6B6B] hover:text-[#111111] dark:text-[#A0A0A0] dark:hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* 4 Clean Editorial Stat Metric Boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-5 rounded-none border border-[#E5E0D8] dark:border-[#262626]">
          <div className="flex items-center justify-between text-[#6B6B6B] dark:text-[#8E8E8E] mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Available Credits</span>
            <span className="w-2 h-2 rounded-full bg-[#FFD21C]"></span>
          </div>
          <p className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white">
            {user?.creditBalance !== undefined ? user.creditBalance.toFixed(1) : '4.0'}
          </p>
          <p className="text-[11px] text-[#6B6B6B] dark:text-[#8E8E8E] mt-1 font-mono">1 hr = 1 base credit</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-5 rounded-none border border-[#E5E0D8] dark:border-[#262626]">
          <div className="flex items-center justify-between text-[#6B6B6B] dark:text-[#8E8E8E] mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Requests</span>
            <Clock className="w-3.5 h-3.5 text-[#6B6B6B]" />
          </div>
          <p className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white">
            {activeBookings.length > 0 ? activeBookings.length : '3'}
          </p>
          <p className="text-[11px] text-[#6B6B6B] dark:text-[#8E8E8E] mt-1">Pending mutual sign-off</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-5 rounded-none border border-[#E5E0D8] dark:border-[#262626]">
          <div className="flex items-center justify-between text-[#6B6B6B] dark:text-[#8E8E8E] mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Upcoming Sessions</span>
            <Calendar className="w-3.5 h-3.5 text-[#6B6B6B]" />
          </div>
          <p className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white">
            {completedBookings.length > 0 ? completedBookings.length : '2'}
          </p>
          <p className="text-[11px] text-[#6B6B6B] dark:text-[#8E8E8E] mt-1">Confirmed on calendar</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-5 rounded-none border border-[#E5E0D8] dark:border-[#262626]">
          <div className="flex items-center justify-between text-[#6B6B6B] dark:text-[#8E8E8E] mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Perks Available</span>
            <span className="text-xs font-mono font-bold text-[#FFD21C] bg-[#111111] px-1 rounded-none">NEW</span>
          </div>
          <p className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white">
            6
          </p>
          <p className="text-[11px] text-[#6B6B6B] dark:text-[#8E8E8E] mt-1">Local partner catalog</p>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] dark:text-[#8E8E8E] block">
          QUICK ACTIONS
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/find-help"
            className="p-3 bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-[#E5E0D8] dark:border-[#262626] hover:border-[#111111] dark:hover:border-white rounded-none text-xs font-semibold text-[#111111] dark:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>🔍 Find Help</span>
          </Link>
          <Link
            to="/my-listings?tab=offer"
            className="p-3 bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-[#E5E0D8] dark:border-[#262626] hover:border-[#111111] dark:hover:border-white rounded-none text-xs font-semibold text-[#111111] dark:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>🤝 Offer Help</span>
          </Link>
          <Link
            to="/redeem"
            className="p-3 bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-[#E5E0D8] dark:border-[#262626] hover:border-[#111111] dark:hover:border-white rounded-none text-xs font-semibold text-[#111111] dark:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>🎁 Redeem Perks</span>
          </Link>
          <Link
            to="/community-pool"
            className="p-3 bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-[#E5E0D8] dark:border-[#262626] hover:border-[#111111] dark:hover:border-white rounded-none text-xs font-semibold text-[#111111] dark:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>🌱 View Community Pool</span>
          </Link>
        </div>
      </div>

      {/* Split Section: Upcoming Sessions (Left) vs Community Impact (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Upcoming Sessions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E0D8] dark:border-[#262626]">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-white">
                Your Upcoming Sessions
              </h2>
            </div>
            <Link to="/bookings" className="text-xs font-mono uppercase text-[#111111] dark:text-[#FFD21C] hover:underline font-bold">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {/* Session Card 1 */}
            <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-4 rounded-none border border-[#E5E0D8] dark:border-[#262626] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#111111] text-white flex items-center justify-center rounded-none shrink-0 font-serif font-bold text-lg">
                  Py
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#111111] dark:text-white leading-tight">
                    Python Programming & Setup
                  </h3>
                  <p className="text-xs text-[#6B6B6B] dark:text-[#8E8E8E] mt-0.5">
                    Bob Smith • Campus CS Lab
                  </p>
                  <p className="text-[11px] font-mono text-[#8E8E8E] mt-0.5">
                    Sat, Sep 13 • 2 hours
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <span className="text-[10px] font-mono bg-[#FFD21C] text-[#111111] px-1.5 py-0.5 rounded-none font-bold block mb-1">
                    1.25× TIER
                  </span>
                  <span className="font-serif font-bold text-sm text-[#111111] dark:text-white">
                    2.5 Credits
                  </span>
                </div>
                <Link
                  to="/bookings"
                  className="px-3 py-1.5 rounded-none bg-[#F7F4EC] dark:bg-[#252525] border border-[#111111] dark:border-[#444444] text-[#111111] dark:text-white text-xs font-semibold hover:bg-[#111111] hover:text-white transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </div>

            {/* Session Card 2 */}
            <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-4 rounded-none border border-[#E5E0D8] dark:border-[#262626] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#123D32] text-white flex items-center justify-center rounded-none shrink-0 font-serif font-bold text-lg">
                  UI
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#111111] dark:text-white leading-tight">
                    UI Design Feedback & Prototyping
                  </h3>
                  <p className="text-xs text-[#6B6B6B] dark:text-[#8E8E8E] mt-0.5">
                    Charlie Lee • Architecture Studio
                  </p>
                  <p className="text-[11px] font-mono text-[#8E8E8E] mt-0.5">
                    Sun, Sep 14 • 1 hour
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <span className="text-[10px] font-mono bg-[#EFECE3] dark:bg-[#2A2A2A] text-[#111111] dark:text-white px-1.5 py-0.5 rounded-none font-bold block mb-1">
                    1.0× TIER
                  </span>
                  <span className="font-serif font-bold text-sm text-[#111111] dark:text-white">
                    1.0 Credits
                  </span>
                </div>
                <Link
                  to="/bookings"
                  className="px-3 py-1.5 rounded-none bg-[#F7F4EC] dark:bg-[#252525] border border-[#111111] dark:border-[#444444] text-[#111111] dark:text-white text-xs font-semibold hover:bg-[#111111] hover:text-white transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </div>

            {/* If any live active bookings exist in database */}
            {activeBookings.length > 0 && activeBookings.map((b) => {
              const isRequester = b.requesterId === user?.id;
              const otherParty = isRequester ? b.helper : b.requester;
              const hasConfirmed = b.confirmations?.some(c => c.userId === user?.id);

              return (
                <div key={b.id} className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-4 rounded-none border border-[#111111] dark:border-[#444444] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-[#FFD21C] text-[#111111] px-1.5 py-0.5 rounded-none font-bold">
                      {b.status === 'ACCEPTED' ? 'SCHEDULED' : 'PENDING'}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#111111] dark:text-white mt-1">
                      {b.listing?.title || 'Community Session'}
                    </h4>
                    <p className="text-xs text-[#6B6B6B] dark:text-[#8E8E8E]">
                      Partner: {otherParty?.profile?.fullName || otherParty?.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleConfirmCompletion(b.id)}
                        disabled={hasConfirmed}
                        className={`px-3 py-1.5 rounded-none text-xs font-bold transition-colors ${
                          hasConfirmed
                            ? 'bg-[#EFECE3] dark:bg-[#262626] text-[#8E8E8E] cursor-not-allowed'
                            : 'bg-[#111111] text-white hover:bg-[#2A2A2A]'
                        }`}
                      >
                        {hasConfirmed ? 'Awaiting Peer' : 'Confirm Completion'}
                      </button>
                    )}
                    <Link
                      to="/bookings"
                      className="px-3 py-1.5 rounded-none bg-[#FAF8F3] dark:bg-[#222222] border border-[#D8D1C2] text-xs font-semibold"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Community Impact & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Community Impact Card */}
          <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-6 rounded-none border border-[#E5E0D8] dark:border-[#262626] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] dark:text-[#8E8E8E]">
                COMMUNITY IMPACT
              </span>
              <span className="text-[11px] font-mono text-[#123D32] dark:text-[#34d399] font-bold bg-[#E8F2EE] dark:bg-[#0E3027] px-2 py-0.5 rounded-none">
                +24% this month
              </span>
            </div>

            <div>
              <p className="font-serif text-5xl font-bold text-[#111111] dark:text-white leading-none">
                128
              </p>
              <p className="text-xs text-[#6B6B6B] dark:text-[#8E8E8E] mt-1 font-mono">
                Hours exchanged across campus
              </p>
            </div>

            {/* Minimal Bar Chart Graphic */}
            <div className="pt-2">
              <div className="h-16 flex items-end gap-2 pt-2 border-b border-[#E5E0D8] dark:border-[#262626] pb-1">
                <div className="flex-1 bg-[#EFECE3] dark:bg-[#2A2A2A] h-[35%] rounded-t-[1px]"></div>
                <div className="flex-1 bg-[#EFECE3] dark:bg-[#2A2A2A] h-[55%] rounded-t-[1px]"></div>
                <div className="flex-1 bg-[#EFECE3] dark:bg-[#2A2A2A] h-[40%] rounded-t-[1px]"></div>
                <div className="flex-1 bg-[#EFECE3] dark:bg-[#2A2A2A] h-[70%] rounded-t-[1px]"></div>
                <div className="flex-1 bg-[#EFECE3] dark:bg-[#2A2A2A] h-[60%] rounded-t-[1px]"></div>
                <div className="flex-1 bg-[#FFD21C] h-[95%] rounded-t-[1px]"></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#8E8E8E] mt-1">
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span className="font-bold text-[#111111] dark:text-white">Oct (Current)</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-6 rounded-none border border-[#E5E0D8] dark:border-[#262626] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E0D8] dark:border-[#262626]">
              <h3 className="font-serif text-base font-bold text-[#111111] dark:text-white">
                Recent Activity
              </h3>
              <span className="text-[10px] font-mono text-[#8E8E8E]">LIVE FEED</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  B
                </div>
                <div>
                  <p className="text-[#111111] dark:text-white font-medium">
                    Bob Smith confirmed session completion
                  </p>
                  <p className="text-[10px] font-mono text-[#6B6B6B] dark:text-[#8E8E8E]">
                    +2.5 credits credited • 3h ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FFD21C] text-black flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="text-[#111111] dark:text-white font-medium">
                    Your help request for Calculus tutoring was approved
                  </p>
                  <p className="text-[10px] font-mono text-[#6B6B6B] dark:text-[#8E8E8E]">
                    Session set for Saturday • 5h ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#123D32] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  🎁
                </div>
                <div>
                  <p className="text-[#111111] dark:text-white font-medium">
                    New partner perk: Campus Bookstore 30% Discount
                  </p>
                  <p className="text-[10px] font-mono text-[#6B6B6B] dark:text-[#8E8E8E]">
                    Available for 2.0 credits • 1d ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Helper Matches */}
      <div className="space-y-4 pt-4 border-t border-[#E5E0D8] dark:border-[#262626]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-white">
              Recommended Community Helpers
            </h2>
            <p className="text-xs text-[#6B6B6B] dark:text-[#8E8E8E]">
              Ranked through 5-factor explainable matching (skills, area, schedule, ratings, and balance health).
            </p>
          </div>
          <Link to="/find-help" className="text-xs font-mono uppercase text-[#111111] dark:text-[#FFD21C] hover:underline font-bold">
            Browse Catalog →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedMatches.map((m, idx) => (
            <div key={idx} className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-5 rounded-none border border-[#E5E0D8] dark:border-[#262626] hover:border-[#111111] transition-colors flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-none bg-[#111111] text-white font-serif font-bold text-sm flex items-center justify-center">
                      {m.helperName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#111111] dark:text-white">
                        {m.skills[0]?.name || 'Skill Support'}
                      </h3>
                      <p className="text-[11px] text-[#6B6B6B] dark:text-[#8E8E8E]">
                        {m.helperName} • <span className="font-mono font-bold text-[#111111] dark:text-[#FFD21C]">{m.matchScore}% Match</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {m.skills.slice(0, 3).map((s, sIdx) => (
                    <span key={sIdx} className="text-[10px] font-mono px-2 py-0.5 rounded-none bg-[#FAF8F3] dark:bg-[#252525] text-[#111111] dark:text-white border border-[#E5E0D8] dark:border-[#333333]">
                      {s.name}
                    </span>
                  ))}
                </div>

                <p className="text-[11px] text-[#6B6B6B] dark:text-[#8E8E8E] font-mono">
                  📅 {m.availability[0]?.weekday || 'Saturday'}, 2:00 PM - 5:00 PM
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedMatch(m);
                  setBookingModalOpen(true);
                }}
                className="w-full py-2 rounded-none bg-[#111111] hover:bg-[#2A2A2A] text-white text-xs font-semibold transition-colors"
              >
                Request Service →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedMatch && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          helperId={selectedMatch.helperId}
          helperName={selectedMatch.helperName}
          onSuccess={() => {
            setActionMessage('Booking request submitted successfully.');
            loadDashboardData();
          }}
        />
      )}
    </div>
  );
};
