import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { WalletData } from '../types';
import { StatCardSkeleton, ListItemSkeleton } from '../components/SkeletonLoader';
import { 
  Clock, 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  HeartHandshake, 
  Ticket 
} from 'lucide-react';

export const Wallet: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'EXCHANGES' | 'REDEEMED' | 'POOL'>('ALL');

  const loadWallet = async () => {
    try {
      setLoading(true);
      const data = await api.getWallet();
      setWallet(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const filteredTransactions = wallet?.transactions.filter((tx) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'EXCHANGES') return tx.type === 'SERVICE_EXCHANGE';
    if (filterType === 'REDEEMED') return tx.type === 'REDEEMED';
    if (filterType === 'POOL') return tx.type === 'DONATED_TO_POOL' || tx.type === 'ALLOCATED_FROM_POOL';
    return true;
  }) || [];

  const hoursGiven = wallet?.transactions
    .filter(t => t.direction === 'INCOMING' && t.type === 'SERVICE_EXCHANGE')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  
  const hoursReceived = wallet?.transactions
    .filter(t => t.direction === 'OUTGOING' && t.type === 'SERVICE_EXCHANGE')
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const peopleHelped = wallet
    ? new Set(wallet.transactions.filter(t => t.direction === 'INCOMING' && t.otherParty && t.type === 'SERVICE_EXCHANGE').map(t => t.otherParty)).size
    : 0;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'REDEEMED':
        return { label: 'Perk Redeemed', color: 'text-black bg-[#F7F4EC] dark:bg-[#222] border-[#E5E0D8] dark:border-[#333]' };
      case 'DONATED_TO_POOL':
        return { label: 'Pool Donation', color: 'text-black bg-[#FFD21C] border-black font-bold' };
      case 'ALLOCATED_FROM_POOL':
        return { label: 'Pool Relief Grant', color: 'text-white bg-[#123D32] border-[#123D32]' };
      case 'SIGNUP_BONUS':
        return { label: 'Welcome Allowance', color: 'text-black bg-[#F7F4EC] dark:bg-[#222] border-black font-bold' };
      case 'ADMIN_ADJUSTMENT':
        return { label: 'Admin Adjustment', color: 'text-black bg-stone-200 border-stone-400' };
      default:
        return { label: 'Service Exchange', color: 'text-black bg-[#F7F4EC] dark:bg-[#222] border-[#E5E0D8] dark:border-[#333]' };
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#E5E0D8] dark:border-[#262626] pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#FFD21C] inline-block" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]/70 dark:text-white/70">
            Solidarity & Value Parity
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-white">
          Time Credit Wallet
        </h1>
        <p className="text-sm sm:text-base text-[#111111]/70 dark:text-[#E5E0D8]/70 max-w-2xl leading-relaxed">
          1 verified hour of community assistance = 1 base credit. Immutable ledger tracks all reciprocal sessions, pool grants, and redeemed campus perks.
        </p>
      </div>

      {/* Top 2 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Balance Box */}
        <div className="lg:col-span-6 bg-[#FAF8F3] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#262626] p-6 sm:p-8 flex flex-col justify-between space-y-6 rounded-none">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#111111]/60 dark:text-white/60 uppercase tracking-widest">
                Available Credit Balance
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif font-bold text-5xl sm:text-6xl text-[#111111] dark:text-white">
                  {wallet ? wallet.creditBalance.toFixed(1) : '3.0'}
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-[#111111]/60 dark:text-white/60">Credits</span>
              </div>
              <p className="text-xs text-[#111111]/50 dark:text-white/50 pt-1">
                Zero monetary fee • Reciprocal community reserve
              </p>
            </div>

            <div className="w-12 h-12 bg-[#111111] text-[#FFD21C] border border-black flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E0D8] dark:border-[#262626] flex flex-wrap gap-3">
            <Link
              to="/find-help"
              className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors border border-black"
            >
              Spend Credits (Find Help)
            </Link>
            <Link
              to="/my-listings?tab=offer"
              className="px-4 py-2.5 bg-[#FDFBF7] dark:bg-[#1c1c1c] hover:bg-[#F7F4EC] dark:hover:bg-[#222] text-[#111111] dark:text-white font-bold text-xs uppercase tracking-wider transition-colors border border-[#E5E0D8] dark:border-[#333]"
            >
              Earn Credits (Offer Help)
            </Link>
            <Link
              to="/community-pool"
              className="px-4 py-2.5 bg-[#FFD21C] hover:bg-[#F4C400] text-black font-bold text-xs uppercase tracking-wider transition-colors border border-black shadow-[2px_2px_0px_0px_#111111] flex items-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-black" />
              <span>Donate to Pool</span>
            </Link>
          </div>
        </div>

        {/* Ledger Summary Stats */}
        <div className="lg:col-span-6 bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#262626] p-6 sm:p-8 flex flex-col justify-between space-y-6 rounded-none">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#111111]/60 dark:text-white/60 uppercase tracking-widest">
              Cumulative Activity
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] dark:text-white bg-[#F7F4EC] dark:bg-[#222] px-2 py-0.5 border border-[#E5E0D8] dark:border-[#333] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#123D32]" />
              <span>Immutable Ledger</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#FAF8F3] dark:bg-[#181818] p-4 border border-[#E5E0D8] dark:border-[#262626] text-center">
              <p className="font-serif font-bold text-3xl text-[#111111] dark:text-white">
                {hoursGiven.toFixed(1)}
              </p>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#111111]/60 dark:text-white/60 mt-1">Earned</p>
            </div>

            <div className="bg-[#FAF8F3] dark:bg-[#181818] p-4 border border-[#E5E0D8] dark:border-[#262626] text-center">
              <p className="font-serif font-bold text-3xl text-[#111111] dark:text-white">
                {hoursReceived.toFixed(1)}
              </p>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#111111]/60 dark:text-white/60 mt-1">Spent</p>
            </div>

            <div className="bg-[#FAF8F3] dark:bg-[#181818] p-4 border border-[#E5E0D8] dark:border-[#262626] text-center">
              <p className="font-serif font-bold text-3xl text-[#123D32] dark:text-emerald-400">
                {peopleHelped}
              </p>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#111111]/60 dark:text-white/60 mt-1">Peers Helped</p>
            </div>
          </div>

          <p className="text-xs text-[#111111]/60 dark:text-white/60 leading-relaxed">
            Time banking transactions are recorded bilaterally upon dual confirmation.
          </p>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#262626] p-6 sm:p-8 space-y-6 rounded-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E0D8] dark:border-[#262626] pb-4">
          <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-white">
            Transaction Ledger
          </h2>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 border border-[#E5E0D8] dark:border-[#262626] p-1 bg-[#F7F4EC] dark:bg-[#1c1c1c]">
            {[
              { id: 'ALL', label: 'All Transactions' },
              { id: 'EXCHANGES', label: 'Service Exchanges' },
              { id: 'REDEEMED', label: 'Perks Redeemed' },
              { id: 'POOL', label: 'Pool Solidarity' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#FFD21C] text-black border border-black shadow-[2px_2px_0px_0px_#111111]'
                    : 'text-[#111111] dark:text-white hover:bg-[#FAF8F3] dark:hover:bg-[#222]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#111111]/60">
            No transactions recorded under this filter.
          </div>
        ) : (
          <div className="divide-y divide-[#E5E0D8] dark:divide-[#262626]">
            {filteredTransactions.map((tx) => {
              const isIncoming = tx.direction === 'INCOMING';
              const badge = getTypeBadge(tx.type);

              return (
                <div key={tx.id} className="py-4 flex items-center justify-between gap-4 hover:bg-[#F7F4EC]/60 dark:hover:bg-[#1c1c1c]/60 px-3 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Amount Badge */}
                    <div className={`w-11 h-11 font-serif font-bold text-base flex items-center justify-center shrink-0 border ${
                      isIncoming
                        ? 'bg-[#123D32] text-white border-[#123D32]'
                        : 'bg-[#111111] text-white border-black'
                    }`}>
                      {isIncoming ? '+' : '-'}{tx.amount.toFixed(1)}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif font-bold text-base text-[#111111] dark:text-white">{tx.description}</h3>
                        {tx.multiplier && tx.multiplier > 1.0 && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 border bg-[#FFD21C] text-black border-black">
                            {tx.multiplier}× Rate
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#111111]/60 dark:text-white/60">
                        {tx.otherParty} • {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        {tx.multiplier && tx.multiplier > 1.0 && (
                          <span className="ml-2 font-mono text-[#123D32] dark:text-emerald-400 font-bold">
                            ({(tx.baseCreditAmount || (tx.amount / tx.multiplier)).toFixed(1)}h × {tx.multiplier}×)
                          </span>
                        )}
                      </p>
                      {tx.transactionReason && (
                        <p className="text-[11px] text-[#111111]/70 dark:text-white/70 italic">
                          Audit Reason: {tx.transactionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

