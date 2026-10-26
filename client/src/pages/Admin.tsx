import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AdminStats, RedemptionOption, CommunityPool, Category, AdminAuditLog } from '../types';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Clock, 
  Coins, 
  Layers,
  Gift,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  Search,
  KeyRound,
  UserCheck,
  Building2,
  FileText,
  Sliders,
  Check,
  X,
  Scale
} from 'lucide-react';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'redemptions' | 'pool' | 'governance'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redemption options state
  const [redemptionOptions, setRedemptionOptions] = useState<RedemptionOption[]>([]);
  const [showPerkModal, setShowPerkModal] = useState(false);
  const [editingPerk, setEditingPerk] = useState<RedemptionOption | null>(null);
  const [perkForm, setPerkForm] = useState({
    title: '',
    description: '',
    category: 'COMMUNITY_EVENT_PASS' as any,
    creditCost: 1.0,
    quantityRemaining: 10,
    partnerName: '',
    expiryDate: ''
  });

  // Voucher verification state
  const [verifyCode, setVerifyCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Pool state
  const [pool, setPool] = useState<CommunityPool | null>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocateRecipientId, setAllocateRecipientId] = useState('');
  const [allocateAmount, setAllocateAmount] = useState(1.0);
  const [allocateReason, setAllocateReason] = useState('');
  const [allocating, setAllocating] = useState(false);

  // Multiplier Governance & Audit State
  const [categories, setCategories] = useState<Category[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    multiplierEligible: true,
    maxMultiplier: 1.5,
    reason: 'Policy alignment for service complexity'
  });
  const [manualAuditForm, setManualAuditForm] = useState({
    action: 'AUDIT_POLICY_REVIEW',
    targetType: 'CATEGORY',
    targetId: '',
    multiplier: 1.5,
    reason: ''
  });
  const [submittingGov, setSubmittingGov] = useState(false);

  // Credit Adjustment Modal state
  const [adjustUserId, setAdjustUserId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(1.0);
  const [adjustReason, setAdjustReason] = useState<string>('Campus grant / dispute settlement');

  // Resolution Modal state
  const [resolvingReportId, setResolvingReportId] = useState<string | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<string>('RESOLVED');
  const [resolutionNotes, setResolutionNotes] = useState<string>('Mediation completed and agreed by both members.');

  const [message, setMessage] = useState<string | null>(null);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [sData, uData, rData, opts, poolData, catData, logData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminReports(),
        api.getRedemptionOptions(),
        api.getCommunityPool(),
        api.getAdminCategories(),
        api.getAdminAuditLogs()
      ]);
      setStats(sData);
      setUsers(uData);
      setReports(rData);
      setRedemptionOptions(opts);
      setPool(poolData);
      setCategories(catData);
      setAuditLogs(logData);
      if (uData.length > 0 && !allocateRecipientId) {
        setAllocateRecipientId(uData[0].id);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.updateUserStatus(userId, nextStatus);
      setMessage(`User status updated to ${nextStatus}`);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleAdjustCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustUserId) return;

    try {
      await api.adjustUserCredits(adjustUserId, adjustAmount, adjustReason);
      setMessage(`Adjusted ${adjustAmount} credits with audit log.`);
      setAdjustUserId(null);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to adjust credits');
    }
  };

  const handleResolveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingReportId) return;

    try {
      await api.resolveReport(resolvingReportId, resolutionStatus, resolutionNotes);
      setMessage(`Dispute report updated to ${resolutionStatus}`);
      setResolvingReportId(null);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to resolve report');
    }
  };

  // Perk Handlers
  const handleSavePerk = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPerk) {
        await api.updateRedemptionOption(editingPerk.id, perkForm);
        setMessage('Redemption perk updated successfully.');
      } else {
        await api.createRedemptionOption(perkForm);
        setMessage('New redemption perk added to catalog.');
      }
      setShowPerkModal(false);
      setEditingPerk(null);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save redemption perk');
    }
  };

  const handleTogglePerkPause = async (perk: RedemptionOption) => {
    const nextStatus = perk.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      await api.updateRedemptionOption(perk.id, { status: nextStatus });
      setMessage(`Perk "${perk.title}" status changed to ${nextStatus}`);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle perk status');
    }
  };

  const handleDeletePerk = async (id: string) => {
    if (!confirm('Are you sure you want to remove or pause this perk option?')) return;
    try {
      await api.deleteRedemptionOption(id);
      setMessage('Perk removed or paused from catalog.');
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete perk');
    }
  };

  // Voucher Verification
  const handleVerifyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;
    try {
      setVerifying(true);
      setVerifyError(null);
      setVerificationResult(null);
      const res = await api.verifyVoucher(verifyCode.trim());
      setVerificationResult(res);
      setMessage(`Voucher ${verifyCode} verified successfully!`);
      await loadAdminData();
    } catch (err: any) {
      setVerifyError(err.message || 'Invalid or expired voucher code.');
    } finally {
      setVerifying(false);
    }
  };

  // Pool Allocation Handler
  const handleAllocatePoolCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocateRecipientId || allocateAmount <= 0 || !allocateReason.trim()) {
      alert('Recipient, positive amount, and audit reason are required.');
      return;
    }
    try {
      setAllocating(true);
      await api.allocateFromCommunityPool(allocateRecipientId, allocateAmount, allocateReason);
      setMessage(`Allocated ${allocateAmount} credits from community pool.`);
      setShowAllocateModal(false);
      setAllocateReason('');
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Allocation failed');
    } finally {
      setAllocating(false);
    }
  };

  // Category Multiplier Configuration Handler
  const handleUpdateCategoryConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      setSubmittingGov(true);
      await api.updateCategoryMultiplierConfig(editingCategory.id, {
        multiplierEligible: categoryForm.multiplierEligible,
        maxMultiplier: categoryForm.maxMultiplier,
        reason: categoryForm.reason
      });
      setMessage(`Updated multiplier configuration for ${editingCategory.name}.`);
      setEditingCategory(null);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update category multiplier');
    } finally {
      setSubmittingGov(false);
    }
  };

  // Manual Audit Decision Log Handler
  const handleLogManualAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAuditForm.reason.trim()) {
      alert('Mandatory justification is required for administrative audit decisions.');
      return;
    }
    try {
      setSubmittingGov(true);
      await api.submitMultiplierDecision({
        action: manualAuditForm.action,
        targetType: manualAuditForm.targetType,
        targetId: manualAuditForm.targetId || 'SYSTEM_POLICY',
        newMultiplier: manualAuditForm.multiplier,
        reason: manualAuditForm.reason
      });
      setMessage('Administrative multiplier decision recorded in audit log.');
      setManualAuditForm({
        action: 'AUDIT_POLICY_REVIEW',
        targetType: 'CATEGORY',
        targetId: '',
        multiplier: 1.5,
        reason: ''
      });
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to record audit decision');
    } finally {
      setSubmittingGov(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#111111]/10 dark:border-white/10 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/60 dark:text-[#F7F4EC]/60 block mb-1">
            System Governance & Reciprocity Audits
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] dark:text-[#F7F4EC]">
            Admin & Governance Console.
          </h1>
          <p className="text-xs text-[#111111]/60 dark:text-[#F7F4EC]/60 mt-1 max-w-2xl">
            Dual-party dispute resolution, community credit reserve distribution, voucher validation, and multiplier caps.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border border-[#111111]/20 dark:border-white/20 p-1 bg-[#FAF8F3] dark:bg-[#181818]">
          {[
            { id: 'overview', label: 'Overview & Members', icon: Activity },
            { id: 'redemptions', label: `Redemptions (${redemptionOptions.length})`, icon: Gift },
            { id: 'pool', label: `Pool (${(pool?.currentBalance ?? 0).toFixed(1)} cr)`, icon: HeartHandshake },
            { id: 'governance', label: `Governance & Audits (${auditLogs.length})`, icon: Scale }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#FFD21C] text-[#111111] border-[#111111]'
                    : 'bg-transparent text-[#111111]/70 dark:text-[#F7F4EC]/70 hover:text-[#111111] border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {message && (
        <div className="p-4 bg-[#FFD21C]/20 border border-[#FFD21C] text-[#111111] text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage(null)} className="font-bold hover:text-red-700">✕</button>
        </div>
      )}

      {/* TAB 1: OVERVIEW & USERS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top 4 Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#222222]">
              <span className="text-[10px] font-bold text-[#111111]/60 dark:text-[#F7F4EC]/60 uppercase tracking-widest block mb-2">
                Total Members
              </span>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] dark:text-[#F7F4EC]">
                {stats ? stats.totalUsers : 4}
              </p>
              <span className="text-[11px] font-mono font-bold text-[#123D32] dark:text-emerald-400 mt-2 block uppercase">
                Active Participants
              </span>
            </div>

            <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#222222]">
              <span className="text-[10px] font-bold text-[#111111]/60 dark:text-[#F7F4EC]/60 uppercase tracking-widest block mb-2">
                Total Bookings
              </span>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] dark:text-[#F7F4EC]">
                {stats ? stats.totalBookings : 0}
              </p>
              <span className="text-[11px] font-mono text-[#111111]/60 dark:text-[#F7F4EC]/60 mt-2 block">
                {stats?.completedBookings || 0} Dual-Confirmed
              </span>
            </div>

            <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#222222]">
              <span className="text-[10px] font-bold text-[#111111]/60 dark:text-[#F7F4EC]/60 uppercase tracking-widest block mb-2">
                Pool Balance
              </span>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] dark:text-[#F7F4EC]">
                {stats?.communityPoolBalance !== undefined ? stats.communityPoolBalance.toFixed(1) : '24.0'}
              </p>
              <span className="text-[11px] font-mono text-[#123D32] dark:text-emerald-400 mt-2 block">
                Credits in Reserve
              </span>
            </div>

            <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#222222]">
              <span className="text-[10px] font-bold text-[#111111]/60 dark:text-[#F7F4EC]/60 uppercase tracking-widest block mb-2">
                Perks Claimed
              </span>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] dark:text-[#F7F4EC]">
                {stats?.totalRedemptions || 0}
              </p>
              <span className="text-[11px] font-mono text-[#111111]/60 dark:text-[#F7F4EC]/60 mt-2 block">
                Vouchers Distributed
              </span>
            </div>
          </div>

          {/* User Directory Table */}
          <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 sm:p-8 border border-[#E5E0D8] dark:border-[#222222] space-y-4">
            <div className="flex items-center justify-between border-b border-[#111111]/10 dark:border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 dark:text-[#F7F4EC]/50 block">
                  Member Directory
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
                  User Accounts & Credit Balances.
                </h2>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-1 bg-[#111111] text-[#F7F4EC] dark:bg-[#F7F4EC] dark:text-[#111111]">
                {users.length} MEMBERS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#111111]/20 dark:border-white/20 text-[#111111]/60 dark:text-[#F7F4EC]/60 uppercase tracking-widest text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-3">Member</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Balance</th>
                    <th className="py-3 px-3">Trust Rating</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/10 dark:divide-white/10">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FDFBF7] dark:hover:bg-[#1A1A1A]">
                      <td className="py-3.5 px-3">
                        <div>
                          <p className="font-bold text-[#111111] dark:text-[#F7F4EC]">{u.profile?.fullName || 'Anonymous'}</p>
                          <p className="text-[11px] font-mono text-[#111111]/60 dark:text-[#F7F4EC]/60">{u.email}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                          u.role === 'ADMIN'
                            ? 'bg-[#FFD21C] text-[#111111] border-[#111111]/30'
                            : 'bg-[#F7F4EC] dark:bg-[#1E1E1E] text-[#111111] dark:text-[#F7F4EC] border-[#111111]/15 dark:border-white/15'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                          u.status === 'ACTIVE'
                            ? 'bg-[#123D32]/10 text-[#123D32] dark:text-emerald-300 border-[#123D32]/20'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {u.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-[#111111] dark:text-[#F7F4EC]">
                        {u.creditBalance.toFixed(1)} Credits
                      </td>

                      <td className="py-3.5 px-3 font-bold text-[#111111] dark:text-white">
                        {(u.profile?.averageRating || 5.0).toFixed(1)} ★
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex gap-2 justify-end">
                          {u.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleToggleUserStatus(u.id, u.status)}
                              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                                u.status === 'ACTIVE'
                                  ? 'bg-transparent text-red-700 border-red-300 hover:bg-red-50'
                                  : 'bg-transparent text-[#123D32] border-[#123D32] hover:bg-[#123D32]/10'
                              }`}
                            >
                              {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setAdjustUserId(u.id);
                              setAdjustAmount(1.0);
                            }}
                            className="px-2.5 py-1 bg-[#111111] hover:bg-[#222222] text-white dark:bg-[#F7F4EC] dark:text-[#111111] text-[10px] font-bold uppercase tracking-wider border border-[#111111]"
                          >
                            Adjust Credits
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dispute Reports Section (if any) */}
          {reports && reports.length > 0 && (
            <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 sm:p-8 border border-[#E5E0D8] dark:border-[#222222] space-y-4">
              <div className="border-b border-[#111111]/10 dark:border-white/10 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 dark:text-[#F7F4EC]/50 block">
                  Mediation Desk
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
                  Active Dispute Reports ({reports.length}).
                </h2>
              </div>

              <div className="space-y-3">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-4 bg-[#FDFBF7] dark:bg-[#1E1E1E] border border-[#111111]/15 dark:border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-red-100 text-red-800 border border-red-200">
                          {rep.status}
                        </span>
                        <span className="font-bold text-xs text-[#111111] dark:text-[#F7F4EC]">
                          Report #{rep.id.slice(0, 8)}
                        </span>
                      </div>
                      <p className="text-xs text-[#111111]/80 dark:text-[#F7F4EC]/80 italic">
                        "{rep.reason || 'Service delivery dispute'}"
                      </p>
                    </div>

                    <button
                      onClick={() => setResolvingReportId(rep.id)}
                      className="px-4 py-2 bg-[#FFD21C] text-[#111111] border border-[#111111] text-xs font-bold uppercase tracking-wider hover:bg-yellow-400"
                    >
                      Resolve Dispute
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REDEMPTION CATALOG & VOUCHER VERIFICATION */}
      {activeTab === 'redemptions' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Voucher Verification Desk (5 cols) */}
            <div className="lg:col-span-5 bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#222222] space-y-4">
              <div className="flex items-center gap-3 border-b border-[#111111]/10 dark:border-white/10 pb-4">
                <div className="w-8 h-8 bg-[#111111] text-[#FFD21C] flex items-center justify-center border border-[#111111]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-[#F7F4EC]">
                    Verify & Redeem Voucher.
                  </h3>
                  <p className="text-[11px] text-[#111111]/60 dark:text-[#F7F4EC]/60">Check-in validation for campus partners.</p>
                </div>
              </div>

              {verifyError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{verifyError}</span>
                </div>
              )}

              {verificationResult && (
                <div className="p-4 bg-[#FFD21C]/20 border border-[#FFD21C] text-[#111111] text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 uppercase">
                    <CheckCircle2 className="w-4 h-4 text-[#111111]" />
                    <span>Voucher Successfully Validated!</span>
                  </div>
                  <p className="text-[11px]">
                    Item: <strong>{verificationResult.redemption?.redemptionOption?.title}</strong>
                  </p>
                  <p className="text-[11px]">
                    Member: {verificationResult.redemption?.user?.profile?.fullName || verificationResult.redemption?.user?.email}
                  </p>
                </div>
              )}

              <form onSubmit={handleVerifyVoucher} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] mb-1">
                    Voucher Security Code:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TB-RED-9K3E-7W2P"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    className="w-full uppercase font-mono px-3.5 py-2.5 text-xs border border-[#111111]/20 dark:border-white/20 bg-[#FAF8F3] dark:bg-[#1E1E1E] text-[#111111] dark:text-[#F7F4EC] focus:outline-none focus:border-[#111111] rounded-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifying || !verifyCode.trim()}
                  className="w-full py-2.5 bg-[#111111] hover:bg-[#222222] dark:bg-[#FFD21C] dark:text-[#111111] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#111111] transition disabled:opacity-50"
                >
                  {verifying ? 'Validating...' : 'Verify Voucher Code'}
                </button>
              </form>
            </div>

            {/* Catalog Overview & Add Button (7 cols) */}
            <div className="lg:col-span-7 bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#222222] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-[#111111]/10 dark:border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 dark:text-[#F7F4EC]/50 block">
                      Inventory Control
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-[#111111] dark:text-[#F7F4EC]">
                      Redemption Perks Catalog.
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setEditingPerk(null);
                      setPerkForm({
                        title: '',
                        description: '',
                        category: 'COMMUNITY_EVENT_PASS',
                        creditCost: 1.0,
                        quantityRemaining: 10,
                        partnerName: '',
                        expiryDate: ''
                      });
                      setShowPerkModal(true);
                    }}
                    className="px-4 py-2 bg-[#FFD21C] text-[#111111] border border-[#111111] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-yellow-400 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Perk</span>
                  </button>
                </div>
                <p className="text-xs text-[#111111]/60 dark:text-[#F7F4EC]/60 mt-3 leading-relaxed">
                  Manage inventory across all 5 verified categories: Event passes, partner discounts, vouchers, donated goods, and local services.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#111111]/10 dark:border-white/10">
                <div className="p-3 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/15 dark:border-white/15 text-center">
                  <div className="font-serif font-bold text-2xl text-[#111111] dark:text-[#F7F4EC]">
                    {redemptionOptions.length}
                  </div>
                  <div className="text-[10px] text-[#111111]/50 dark:text-[#F7F4EC]/50 font-bold uppercase">Total Items</div>
                </div>
                <div className="p-3 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/15 dark:border-white/15 text-center">
                  <div className="font-serif font-bold text-2xl text-[#123D32] dark:text-emerald-400">
                    {redemptionOptions.filter(o => o.status === 'ACTIVE').length}
                  </div>
                  <div className="text-[10px] text-[#111111]/50 dark:text-[#F7F4EC]/50 font-bold uppercase">Active</div>
                </div>
                <div className="p-3 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/15 dark:border-white/15 text-center">
                  <div className="font-serif font-bold text-2xl text-[#111111] dark:text-[#FFD21C]">
                    {redemptionOptions.filter(o => o.quantityRemaining <= 3).length}
                  </div>
                  <div className="text-[10px] text-[#111111]/50 dark:text-[#F7F4EC]/50 font-bold uppercase">Low Stock</div>
                </div>
              </div>
            </div>
          </div>

          {/* Perk Catalog Table */}
          <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 sm:p-8 border border-[#E5E0D8] dark:border-[#222222] space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-[#F7F4EC]">Catalog Inventory Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#111111]/20 dark:border-white/20 text-[#111111]/60 uppercase tracking-widest text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-3">Title & Partner</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Cost</th>
                    <th className="py-3 px-3">Stock</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/10 dark:divide-white/10">
                  {redemptionOptions.map((opt) => (
                    <tr key={opt.id} className="hover:bg-[#FDFBF7] dark:hover:bg-[#1A1A1A]">
                      <td className="py-3.5 px-3">
                        <div>
                          <p className="font-bold text-[#111111] dark:text-[#F7F4EC]">{opt.title}</p>
                          {opt.partnerName && (
                            <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#F7F4EC]/60">{opt.partnerName}</p>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#F7F4EC] dark:bg-[#1E1E1E] text-[#111111] dark:text-[#F7F4EC] border border-[#111111]/15">
                          {opt.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-serif font-bold text-base text-[#111111] dark:text-[#FFD21C]">
                        {opt.creditCost.toFixed(1)} cr
                      </td>

                      <td className="py-3.5 px-3 font-mono font-semibold text-[#111111]/70 dark:text-[#F7F4EC]/70">
                        {opt.quantityRemaining} units
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                          opt.status === 'ACTIVE'
                            ? 'bg-[#FFD21C] text-[#111111] border-[#111111]/30'
                            : 'bg-neutral-200 text-neutral-800 border-neutral-300'
                        }`}>
                          {opt.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setEditingPerk(opt);
                              setPerkForm({
                                title: opt.title,
                                description: opt.description,
                                category: opt.category,
                                creditCost: opt.creditCost,
                                quantityRemaining: opt.quantityRemaining,
                                partnerName: opt.partnerName || '',
                                expiryDate: opt.expiryDate ? opt.expiryDate.split('T')[0] : ''
                              });
                              setShowPerkModal(true);
                            }}
                            className="p-1.5 bg-[#FAF8F3] dark:bg-[#1E1E1E] border border-[#111111]/20 hover:bg-[#111111] hover:text-white transition"
                            title="Edit Perk"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleTogglePerkPause(opt)}
                            className="p-1.5 bg-[#FAF8F3] dark:bg-[#1E1E1E] border border-[#111111]/20 hover:bg-[#FFD21C] hover:text-[#111111] transition"
                            title={opt.status === 'ACTIVE' ? 'Pause Perk' : 'Activate Perk'}
                          >
                            {opt.status === 'ACTIVE' ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleDeletePerk(opt.id)}
                            className="p-1.5 bg-[#FAF8F3] dark:bg-[#1E1E1E] border border-[#111111]/20 hover:bg-red-600 hover:text-white transition"
                            title="Delete / Pause Perk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMMUNITY POOL MANAGEMENT */}
      {activeTab === 'pool' && (
        <div className="space-y-8">
          {/* Top Banner */}
          <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 sm:p-8 border border-[#E5E0D8] dark:border-[#222222] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 dark:text-[#F7F4EC]/50 block mb-1">
                Solidarity Fund Reserve
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#111111] dark:text-[#F7F4EC]">
                Community Credit Pool Manager.
              </h2>
              <p className="text-xs text-[#111111]/60 dark:text-[#F7F4EC]/60 mt-1 max-w-xl">
                Distribute surplus hours to student emergencies or newcomer support with audited justification.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#111111]/50 dark:text-[#F7F4EC]/50">
                  Current Pool Reserve
                </div>
                <div className="font-serif text-3xl font-bold text-[#111111] dark:text-[#FFD21C]">
                  {(pool?.currentBalance ?? 0).toFixed(1)} Credits
                </div>
              </div>

              <button
                onClick={() => setShowAllocateModal(true)}
                className="px-5 py-3 bg-[#FFD21C] text-[#111111] border border-[#111111] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#FFE066] transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Allocate Grant</span>
              </button>
            </div>
          </div>

          {/* Grid: Donations & Allocations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donations Feed */}
            <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#222222] space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-[#F7F4EC] border-b border-[#111111]/10 pb-3">
                Member Surplus Donations
              </h3>

              <div className="space-y-3">
                {!pool?.recentDonations || pool.recentDonations.length === 0 ? (
                  <p className="text-xs text-[#111111]/40 text-center py-6">No donations recorded yet.</p>
                ) : (
                  pool.recentDonations.map((d) => (
                    <div key={d.id} className="p-3.5 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/15 dark:border-white/15 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#111111] dark:text-[#F7F4EC]">
                          {d.user?.profile?.fullName || d.user?.email}
                        </p>
                        {d.note && <p className="text-[11px] font-serif italic text-[#111111]/60">"{d.note}"</p>}
                        <p className="text-[10px] font-mono text-[#111111]/40 mt-1">{new Date(d.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="font-serif font-bold text-base text-[#123D32] dark:text-emerald-400">
                        +{d.amount.toFixed(1)} cr
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Allocations Feed */}
            <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#222222] space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-[#F7F4EC] border-b border-[#111111]/10 pb-3">
                Audited Grant Allocations
              </h3>

              <div className="space-y-3">
                {!pool?.recentAllocations || pool.recentAllocations.length === 0 ? (
                  <p className="text-xs text-[#111111]/40 text-center py-6">No allocations recorded yet.</p>
                ) : (
                  pool.recentAllocations.map((a) => (
                    <div key={a.id} className="p-3.5 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/15 dark:border-white/15 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111111] dark:text-[#F7F4EC]">
                          Recipient: {a.recipient?.profile?.fullName || a.recipient?.email}
                        </span>
                        <span className="font-serif font-bold text-base text-[#111111] dark:text-[#FFD21C]">
                          +{a.amount.toFixed(1)} cr
                        </span>
                      </div>
                      <p className="text-[#111111]/70 dark:text-[#F7F4EC]/70 bg-[#FAF8F3] dark:bg-[#141414] p-2.5 border border-[#111111]/10 text-[11px] leading-relaxed">
                        <strong>Audit Justification: </strong>{a.reason}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#111111]/50">
                        <span>Admin: {a.admin?.profile?.fullName || 'Campus Admin'}</span>
                        <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MULTIPLIER GOVERNANCE & AUDIT TRAIL */}
      {activeTab === 'governance' && (
        <div className="space-y-8">
          {/* Top 4 Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#222222]">
              <span className="text-[10px] font-bold text-[#111111]/60 uppercase tracking-widest block mb-2">Categories</span>
              <p className="font-serif text-3xl font-bold text-[#111111] dark:text-[#F7F4EC]">{categories.length}</p>
              <span className="text-[11px] font-mono text-[#111111]/50 mt-2 block">Active Service Sectors</span>
            </div>

            <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#222222]">
              <span className="text-[10px] font-bold text-[#111111]/60 uppercase tracking-widest block mb-2">Max Multiplier Cap</span>
              <p className="font-serif text-3xl font-bold text-[#111111] dark:text-[#FFD21C]">1.5×</p>
              <span className="text-[11px] font-mono text-[#111111]/50 mt-2 block">Platform Hard Ceiling</span>
            </div>

            <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#222222]">
              <span className="text-[10px] font-bold text-[#111111]/60 uppercase tracking-widest block mb-2">Audit Records</span>
              <p className="font-serif text-3xl font-bold text-[#111111] dark:text-[#F7F4EC]">{auditLogs.length}</p>
              <span className="text-[11px] font-mono text-[#111111]/50 mt-2 block">Immutable Ledger Logs</span>
            </div>

            <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 border border-[#E5E0D8] dark:border-[#222222]">
              <span className="text-[10px] font-bold text-[#111111]/60 uppercase tracking-widest block mb-2">Fairness Anchor</span>
              <p className="font-serif text-2xl font-bold text-[#123D32] dark:text-emerald-400">1 hr = 1 base</p>
              <span className="text-[11px] font-mono text-[#111111]/50 mt-2 block">Universal Equal Worth</span>
            </div>
          </div>

          {/* Section 1: Category Multiplier Configuration Table */}
          <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 sm:p-8 border border-[#E5E0D8] dark:border-[#222222] space-y-4">
            <div className="border-b border-[#111111]/10 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 block">Multiplier Governance</span>
              <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
                Category Complexity Caps & Eligibility.
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#111111]/20 text-[#111111]/60 uppercase tracking-wider text-[10px] font-bold">
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Eligibility</th>
                    <th className="pb-3">Max Cap</th>
                    <th className="pb-3">Allowed Presets</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/10">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#FDFBF7]">
                      <td className="py-3.5">
                        <span className="font-bold text-[#111111] dark:text-[#F7F4EC] block">{cat.name}</span>
                        <span className="text-[11px] text-[#111111]/60">{cat.description || 'General category'}</span>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold border ${
                          cat.multiplierEligible !== false
                            ? 'bg-[#FFD21C] text-[#111111] border-[#111111]/30'
                            : 'bg-neutral-200 text-neutral-700 border-neutral-300'
                        }`}>
                          {cat.multiplierEligible !== false ? 'Eligible' : 'Fixed 1.0×'}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono font-bold text-[#111111] dark:text-[#F7F4EC]">
                        {cat.maxMultiplier || 1.5}× Max
                      </td>
                      <td className="py-3.5">
                        <div className="flex gap-1.5 flex-wrap font-mono text-[10px]">
                          <span className="px-1.5 py-0.5 bg-[#F7F4EC] border border-[#111111]/20">1.0×</span>
                          {(cat.maxMultiplier || 1.5) >= 1.25 && cat.multiplierEligible !== false && (
                            <span className="px-1.5 py-0.5 bg-[#FFD21C]/40 border border-[#111111]/20 font-bold">1.25×</span>
                          )}
                          {(cat.maxMultiplier || 1.5) >= 1.5 && cat.multiplierEligible !== false && (
                            <span className="px-1.5 py-0.5 bg-[#FFD21C] border border-[#111111]/30 font-bold">1.5×</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setCategoryForm({
                              multiplierEligible: cat.multiplierEligible !== false,
                              maxMultiplier: cat.maxMultiplier || 1.5,
                              reason: `Updated policy rules for ${cat.name}`
                            });
                          }}
                          className="px-3 py-1.5 bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold uppercase tracking-wider transition border border-[#111111]"
                        >
                          Configure Cap
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Log Multiplier Decision / Override Form */}
          <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 sm:p-8 border border-[#E5E0D8] dark:border-[#222222] space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-[#F7F4EC]">
              Log Administrative Multiplier Decision.
            </h3>
            <p className="text-xs text-[#111111]/60 leading-relaxed">
              Fairness Governance: Every multiplier adjustment or category policy update requires mandatory written audit justification.
            </p>

            <form onSubmit={handleLogManualAudit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] mb-1">
                  Action Type
                </label>
                <select
                  value={manualAuditForm.action}
                  onChange={(e) => setManualAuditForm({ ...manualAuditForm, action: e.target.value })}
                  className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none"
                >
                  <option value="AUDIT_POLICY_REVIEW">Audit Policy Review</option>
                  <option value="APPROVE_MULTIPLIER">Approve Multiplier Exception</option>
                  <option value="REJECT_MULTIPLIER">Reject Multiplier Request</option>
                  <option value="OVERRIDE_LISTING_MULTIPLIER">Override Listing Multiplier</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] mb-1">
                  Approved Multiplier Rate
                </label>
                <select
                  value={manualAuditForm.multiplier}
                  onChange={(e) => setManualAuditForm({ ...manualAuditForm, multiplier: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none font-mono"
                >
                  <option value={1.0}>1.0× (Standard)</option>
                  <option value={1.25}>1.25× (Intermediate)</option>
                  <option value={1.5}>1.5× (Advanced Cap)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] mb-1">
                  Mandatory Audit Justification
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={manualAuditForm.reason}
                    onChange={(e) => setManualAuditForm({ ...manualAuditForm, reason: e.target.value })}
                    placeholder="e.g. Certified technician tools and hazard safety review completed."
                    className="flex-1 px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none text-xs"
                  />
                  <button
                    type="submit"
                    disabled={submittingGov}
                    className="px-4 py-2 bg-[#FFD21C] text-[#111111] border border-[#111111] font-bold uppercase tracking-wider hover:bg-yellow-400 shrink-0 transition"
                  >
                    {submittingGov ? 'Saving...' : 'Record'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Section 3: Immutable Admin Audit Log Table */}
          <div className="bg-[#FAF8F3] dark:bg-[#151515] p-6 sm:p-8 border border-[#E5E0D8] dark:border-[#222222] space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-[#F7F4EC]">
              Immutable Audit Trail ({auditLogs.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#111111]/20 text-[#111111]/60 uppercase tracking-widest text-[10px] font-bold">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Administrator</th>
                    <th className="pb-3">Action</th>
                    <th className="pb-3">Target</th>
                    <th className="pb-3">Rate</th>
                    <th className="pb-3">Audit Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/10">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-[#111111]/40">
                        No audit logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#FDFBF7]">
                        <td className="py-3 font-mono text-[11px] text-[#111111]/50 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 font-bold text-[#111111] dark:text-[#F7F4EC] whitespace-nowrap">
                          {log.admin?.profile?.fullName || log.admin?.email || 'Admin'}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 bg-[#FFD21C]/30 text-[#111111] border border-[#111111]/20 text-[10px] font-mono font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-[11px] text-[#111111]/60">
                          {log.targetType}: {log.targetId ? `${log.targetId.slice(0, 8)}...` : 'GENERAL'}
                        </td>
                        <td className="py-3 font-mono font-bold text-[#111111] dark:text-[#FFD21C]">
                          {log.newValue ? `${log.newValue}×` : '-'}
                        </td>
                        <td className="py-3 text-[#111111]/80 max-w-xs font-serif italic">
                          {log.reason}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONFIGURE CATEGORY MULTIPLIER */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F3] dark:bg-[#151515] w-full max-w-md p-6 border-2 border-[#111111] shadow-[8px_8px_0px_0px_#111111] space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-[#F7F4EC]">
              Configure Multipliers: {editingCategory.name}
            </h3>

            <form onSubmit={handleUpdateCategoryConfig} className="space-y-4 text-xs">
              <div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#111111] dark:text-[#F7F4EC]">
                  <input
                    type="checkbox"
                    checked={categoryForm.multiplierEligible}
                    onChange={(e) => setCategoryForm({ ...categoryForm, multiplierEligible: e.target.checked })}
                    className="w-4 h-4 accent-[#111111]"
                  />
                  <span>Allow Skill Complexity Multipliers</span>
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Maximum Multiplier Cap
                </label>
                <select
                  value={categoryForm.maxMultiplier}
                  onChange={(e) => setCategoryForm({ ...categoryForm, maxMultiplier: parseFloat(e.target.value) })}
                  disabled={!categoryForm.multiplierEligible}
                  className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none font-mono"
                >
                  <option value={1.0}>1.0× (Standard Only)</option>
                  <option value={1.25}>1.25× (Up to Intermediate)</option>
                  <option value={1.5}>1.5× (Full Complexity Cap - MVP Limit)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] mb-1">
                  Mandatory Audit Reason
                </label>
                <textarea
                  rows={3}
                  required
                  value={categoryForm.reason}
                  onChange={(e) => setCategoryForm({ ...categoryForm, reason: e.target.value })}
                  placeholder="e.g. Technical repairs require specialized toolkits and warranty liability."
                  className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  disabled={submittingGov}
                  className="flex-1 py-2.5 border border-[#111111]/20 text-[#111111] font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGov}
                  className="flex-1 py-2.5 bg-[#111111] text-white font-bold uppercase tracking-wider border border-[#111111]"
                >
                  {submittingGov ? 'Saving...' : 'Save & Record Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PERK */}
      {showPerkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F3] dark:bg-[#151515] w-full max-w-lg p-6 border-2 border-[#111111] shadow-[8px_8px_0px_0px_#111111] space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-[#F7F4EC]">
              {editingPerk ? 'Edit Redemption Perk' : 'Create New Redemption Perk'}
            </h3>

            <form onSubmit={handleSavePerk} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">Perk Title</label>
                <input
                  type="text"
                  required
                  value={perkForm.title}
                  onChange={(e) => setPerkForm({ ...perkForm, title: e.target.value })}
                  placeholder="e.g., Campus Film Festival VIP Pass"
                  className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">Category</label>
                  <select
                    value={perkForm.category}
                    onChange={(e) => setPerkForm({ ...perkForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none"
                  >
                    <option value="COMMUNITY_EVENT_PASS">Event Pass</option>
                    <option value="PARTNER_DISCOUNT">Partner Discount</option>
                    <option value="CAMPUS_VOUCHER">Campus Voucher</option>
                    <option value="DONATED_GOODS">Donated Goods</option>
                    <option value="LOCAL_SERVICE">Local Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">Credit Cost</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={perkForm.creditCost}
                    onChange={(e) => setPerkForm({ ...perkForm, creditCost: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">Partner / Organization</label>
                  <input
                    type="text"
                    value={perkForm.partnerName}
                    onChange={(e) => setPerkForm({ ...perkForm, partnerName: e.target.value })}
                    placeholder="e.g. Student Sustainability Club"
                    className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">Quantity Stock</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={perkForm.quantityRemaining}
                    onChange={(e) => setPerkForm({ ...perkForm, quantityRemaining: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={perkForm.description}
                  onChange={(e) => setPerkForm({ ...perkForm, description: e.target.value })}
                  placeholder="Terms, redemption location, and conditions..."
                  className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPerkModal(false)}
                  className="flex-1 py-2.5 border border-[#111111]/20 text-[#111111] font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FFD21C] text-[#111111] font-bold uppercase tracking-wider border border-[#111111]"
                >
                  Save Perk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALLOCATE FROM POOL MODAL */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F3] dark:bg-[#151515] w-full max-w-md p-6 border-2 border-[#111111] shadow-[8px_8px_0px_0px_#111111] space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-[#F7F4EC]">
              Allocate Surplus Pool Credits
            </h3>

            <form onSubmit={handleAllocatePoolCredits} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">Recipient Member</label>
                <select
                  value={allocateRecipientId}
                  onChange={(e) => setAllocateRecipientId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none"
                  required
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.profile?.fullName || u.email} ({u.creditBalance.toFixed(1)} cr)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Credits to Grant (Max: {(pool?.currentBalance ?? 0).toFixed(1)})
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max={pool?.currentBalance ?? 100}
                  required
                  value={allocateAmount}
                  onChange={(e) => setAllocateAmount(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Mandatory Audit Justification
                </label>
                <textarea
                  rows={3}
                  required
                  value={allocateReason}
                  onChange={(e) => setAllocateReason(e.target.value)}
                  placeholder="e.g. Winter term student emergency tutoring grant; verified by Student Services."
                  className="w-full px-3 py-2 border border-[#111111]/20 bg-[#FAF8F3] dark:bg-[#1A1A1A] rounded-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  disabled={allocating}
                  className="flex-1 py-2.5 border border-[#111111]/20 text-[#111111] font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={allocating}
                  className="flex-1 py-2.5 bg-[#FFD21C] text-[#111111] font-bold uppercase tracking-wider border border-[#111111]"
                >
                  {allocating ? 'Allocating...' : 'Confirm Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credit Adjustment Modal */}
      {adjustUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F3] dark:bg-[#151515] w-full max-w-md p-6 border-2 border-[#111111] shadow-[8px_8px_0px_0px_#111111] space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-[#F7F4EC]">Adjust User Credits (Audit Logged)</h3>
            <form onSubmit={handleAdjustCredits} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">Credit Amount (+ or -)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2 bg-[#FAF8F3] dark:bg-[#1A1A1A] border border-[#111111]/20 rounded-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">Reason for Audit Log</label>
                <textarea
                  required
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF8F3] dark:bg-[#1A1A1A] border border-[#111111]/20 rounded-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustUserId(null)}
                  className="flex-1 py-2.5 border border-[#111111]/20 text-[#111111] font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FFD21C] text-[#111111] font-bold uppercase tracking-wider border border-[#111111]"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Resolution Modal */}
      {resolvingReportId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F3] dark:bg-[#151515] w-full max-w-md p-6 border-2 border-[#111111] shadow-[8px_8px_0px_0px_#111111] space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-[#F7F4EC]">Resolve Dispute Report</h3>
            <form onSubmit={handleResolveReport} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">Resolution Status</label>
                <select
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF8F3] dark:bg-[#1A1A1A] border border-[#111111]/20 rounded-none"
                >
                  <option value="RESOLVED">RESOLVED (Closed / Action Taken)</option>
                  <option value="DISMISSED">DISMISSED (Invalid / No Action)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">Admin Resolution Notes</label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF8F3] dark:bg-[#1A1A1A] border border-[#111111]/20 rounded-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setResolvingReportId(null)}
                  className="flex-1 py-2.5 border border-[#111111]/20 text-[#111111] font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FFD21C] text-[#111111] font-bold uppercase tracking-wider border border-[#111111]"
                >
                  Save Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
