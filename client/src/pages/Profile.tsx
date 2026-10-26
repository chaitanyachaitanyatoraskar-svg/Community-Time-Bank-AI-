import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { Category, AvailabilitySlot } from '../types';
import { 
  MapPin, 
  CheckCircle, 
  Trash2, 
  Save, 
  Star, 
  Clock, 
  Languages, 
  Sun, 
  Moon, 
  Camera,
  Plus
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'ABOUT' | 'SKILLS' | 'AVAILABILITY' | 'PREFERENCES' | 'REVIEWS'>('ABOUT');
  
  // Profile state
  const [fullName, setFullName] = useState(user?.profile?.fullName || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [area, setArea] = useState(user?.profile?.area || 'Downtown');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.profile?.avatarUrl || '');
  const [contactPreference, setContactPreference] = useState(user?.profile?.contactPreference || 'IN_APP');

  // Categories & Skills
  const [categories, setCategories] = useState<Category[]>([]);
  const [userSkills, setUserSkills] = useState<{ skillId: string; proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT' }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSkillToAdd, setSelectedSkillToAdd] = useState<string>('');
  const [selectedProficiency, setSelectedProficiency] = useState<'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'>('INTERMEDIATE');

  // Availability schedule
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [newDay, setNewDay] = useState('Saturday');
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('17:00');

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Avatar presets
  const avatarPresets = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  ];

  useEffect(() => {
    if (user) {
      setFullName(user.profile?.fullName || '');
      setBio(user.profile?.bio || '');
      setArea(user.profile?.area || 'Downtown');
      setPhone(user.profile?.phone || '');
      setAvatarUrl(user.profile?.avatarUrl || '');
      setContactPreference(user.profile?.contactPreference || 'IN_APP');
      
      if (user.userSkills) {
        setUserSkills(user.userSkills.map(us => ({
          skillId: us.skillId,
          proficiency: us.proficiency
        })));
      }

      if (user.availability) {
        setAvailability(user.availability);
      }
    }

    api.getCategories().then(cats => {
      setCategories(cats);
      if (cats.length > 0) {
        setSelectedCategory(cats[0].id);
        if (cats[0].skills.length > 0) {
          setSelectedSkillToAdd(cats[0].skills[0].id);
        }
      }
    }).catch(console.error);
  }, [user]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const cat = categories.find(c => c.id === catId);
    if (cat && cat.skills.length > 0) {
      setSelectedSkillToAdd(cat.skills[0].id);
    }
  };

  const handleAddSkill = () => {
    if (!selectedSkillToAdd) return;
    if (userSkills.some(s => s.skillId === selectedSkillToAdd)) return;

    setUserSkills([...userSkills, { skillId: selectedSkillToAdd, proficiency: selectedProficiency }]);
  };

  const handleRemoveSkill = (skillId: string) => {
    setUserSkills(userSkills.filter(s => s.skillId !== skillId));
  };

  const handleAddAvailability = () => {
    setAvailability([...availability, { weekday: newDay, startTime: newStartTime, endTime: newEndTime }]);
  };

  const handleRemoveAvailability = (index: number) => {
    setAvailability(availability.filter((_, idx) => idx !== index));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSuccessMessage(null);
    try {
      await Promise.all([
        api.updateProfile({ fullName, bio, area, phone, avatarUrl, contactPreference }),
        api.updateSkills(userSkills),
        api.updateAvailability(availability)
      ]);
      await refreshUser();
      setSuccessMessage('Profile details successfully updated.');
    } catch (err: any) {
      alert(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const allSkills = categories.flatMap(c => c.skills);
  const currentCategorySkills = categories.find(c => c.id === selectedCategory)?.skills || [];

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8 font-sans">
      {/* Top Editorial Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#111111]/10 dark:border-white/10 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/60 dark:text-[#F7F4EC]/60 block mb-1">
            Member Credentials & Settings
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] dark:text-[#F7F4EC]">
            Community Profile.
          </h1>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-5 py-2.5 bg-[#111111] hover:bg-[#222222] dark:bg-[#F7F4EC] dark:text-[#111111] dark:hover:bg-[#EFECE3] text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all disabled:opacity-50 border border-[#111111] dark:border-white"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#222222] p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#E5E0D8] dark:border-[#222222]">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative group">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-20 h-20 rounded-none object-cover border-2 border-[#111111] dark:border-[#F7F4EC]"
                />
              ) : (
                <div className="w-20 h-20 rounded-none bg-[#111111] text-[#FFD21C] font-serif font-bold text-3xl flex items-center justify-center border-2 border-[#111111] dark:border-white shrink-0">
                  {fullName.charAt(0) || 'U'}
                </div>
              )}
              <button
                onClick={() => setActiveTab('PREFERENCES')}
                className="absolute -bottom-2 -right-2 p-1.5 bg-[#FFD21C] text-[#111111] border border-[#111111] hover:bg-[#FFE066] transition-colors"
                title="Change Photo"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FFD21C] text-[#111111] border border-[#111111]/20">
                  Verified Member
                </span>
                <span className="text-[10px] font-mono text-[#111111]/60 dark:text-[#F7F4EC]/60">
                  ID: #{user?.id?.slice(0, 8) || 'USR-2026'}
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
                {fullName || 'Community Member'}
              </h2>
              <p className="text-xs text-[#111111]/70 dark:text-[#F7F4EC]/70">
                Peer Service Reciprocity • Active Contributor
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#111111]/60 dark:text-[#F7F4EC]/60 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#111111]/40 dark:text-white/40" />
                  <span className="font-medium text-[#111111] dark:text-white">{area}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-[#111111]/40 dark:text-white/40" />
                  <span>English</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-[#111111] dark:text-white">
                  <Star className="w-3.5 h-3.5 fill-[#FFD21C] text-[#111111]" />
                  <span>{(user?.profile?.averageRating || 5.0).toFixed(1)} Rating</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1 bg-[#F7F4EC] dark:bg-[#1E1E1E] p-4 border border-[#E5E0D8] dark:border-[#222222] min-w-[160px]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#111111]/50 dark:text-[#F7F4EC]/50">
              Community Trust
            </span>
            <span className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
              100% Dual-Verified
            </span>
            <span className="text-[11px] text-[#123D32] dark:text-emerald-400 font-medium">
              Zero Unresolved Disputes
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#111111]/15 dark:border-white/15 gap-8 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'ABOUT', name: '01. About Member' },
            { id: 'SKILLS', name: '02. Skills Catalog' },
            { id: 'AVAILABILITY', name: '03. Weekly Availability' },
            { id: 'PREFERENCES', name: '04. Avatar & Theme' },
            { id: 'REVIEWS', name: '05. Verified Reviews' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 transition-colors relative whitespace-nowrap uppercase tracking-wider text-xs ${
                activeTab === tab.id
                  ? 'text-[#111111] dark:text-[#F7F4EC] font-bold border-b-2 border-[#111111] dark:border-[#FFD21C]'
                  : 'text-[#111111]/50 dark:text-[#F7F4EC]/50 hover:text-[#111111] dark:hover:text-[#F7F4EC]'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {successMessage && (
          <div className="p-4 bg-[#FFD21C]/20 border border-[#FFD21C] text-[#111111] text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#111111] shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Tab: About */}
        {activeTab === 'ABOUT' && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-[#F7F4EC] focus:outline-none focus:border-[#111111] dark:focus:border-white rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] mb-1.5">
                  Neighborhood Area / Campus
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-[#F7F4EC] focus:outline-none focus:border-[#111111] dark:focus:border-white rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] mb-1.5">
                  Contact Phone (Optional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-[#F7F4EC] focus:outline-none focus:border-[#111111] dark:focus:border-white rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] mb-1.5">
                  Contact Channel Preference
                </label>
                <select
                  value={contactPreference}
                  onChange={(e) => setContactPreference(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-[#F7F4EC] focus:outline-none focus:border-[#111111] dark:focus:border-white rounded-none"
                >
                  <option value="IN_APP">In-App Secure Messaging</option>
                  <option value="EMAIL">Verified Email Notification</option>
                  <option value="PHONE">Direct Phone / SMS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] mb-1.5">
                Biography & Exchange Focus
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your background, what skills you're eager to exchange, and what kind of support you appreciate..."
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-[#F7F4EC] focus:outline-none focus:border-[#111111] dark:focus:border-white rounded-none leading-relaxed"
              />
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] mb-2.5">
                Current Registered Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {userSkills.map((us) => {
                  const sk = allSkills.find(s => s.id === us.skillId);
                  return (
                    <span 
                      key={us.skillId} 
                      className="px-3 py-1 bg-[#F7F4EC] dark:bg-[#1E1E1E] border border-[#111111]/15 dark:border-white/15 text-[#111111] dark:text-[#F7F4EC] text-xs font-medium"
                    >
                      {sk?.name || 'Skill'} ({us.proficiency.toLowerCase()})
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Skills */}
        {activeTab === 'SKILLS' && (
          <div className="space-y-6 pt-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 dark:text-[#F7F4EC]/50 block mb-1">
                Declared Competencies
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
                Your Verified Skills.
              </h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {userSkills.map((us) => {
                const sk = allSkills.find(s => s.id === us.skillId);
                return (
                  <div 
                    key={us.skillId} 
                    className="px-3.5 py-2 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/20 dark:border-white/20 flex items-center gap-2.5 text-xs"
                  >
                    <span className="font-bold text-[#111111] dark:text-[#F7F4EC]">{sk?.name || 'Skill'}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#FFD21C] text-[#111111] font-mono font-bold uppercase">
                      {us.proficiency}
                    </span>
                    <button 
                      onClick={() => handleRemoveSkill(us.skillId)} 
                      className="text-[#111111]/40 hover:text-red-600 transition-colors ml-1 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
              {userSkills.length === 0 && (
                <p className="text-xs text-[#111111]/60 dark:text-[#F7F4EC]/60 italic">
                  No skills registered yet. Add one below to offer community assistance.
                </p>
              )}
            </div>

            {/* Add Skill Row */}
            <div className="p-5 bg-[#F7F4EC] dark:bg-[#1A1A1A] border border-[#111111]/15 dark:border-white/15 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] block">
                Add Skill To Profile:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-3 py-2 bg-[#FAF8F3] dark:bg-[#141414] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-white rounded-none"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select
                  value={selectedSkillToAdd}
                  onChange={(e) => setSelectedSkillToAdd(e.target.value)}
                  className="px-3 py-2 bg-[#FAF8F3] dark:bg-[#141414] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-white rounded-none"
                >
                  {currentCategorySkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                <select
                  value={selectedProficiency}
                  onChange={(e) => setSelectedProficiency(e.target.value as any)}
                  className="px-3 py-2 bg-[#FAF8F3] dark:bg-[#141414] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-white rounded-none"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="EXPERT">Expert</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="py-2 px-4 bg-[#111111] hover:bg-[#222222] dark:bg-[#FFD21C] dark:text-[#111111] text-white font-bold text-xs uppercase tracking-wider transition-colors border border-[#111111]"
                >
                  + Add Skill
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Availability */}
        {activeTab === 'AVAILABILITY' && (
          <div className="space-y-6 pt-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 dark:text-[#F7F4EC]/50 block mb-1">
                Calendar Constraints
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
                Weekly Availability Schedule.
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availability.map((slot, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/15 dark:border-white/15 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#111111]/40 dark:text-white/40" />
                    <div>
                      <span className="font-bold text-[#111111] dark:text-[#F7F4EC] block">{slot.weekday}</span>
                      <span className="text-[11px] text-[#111111]/60 dark:text-[#F7F4EC]/60">{slot.startTime} – {slot.endTime}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveAvailability(idx)} 
                    className="text-[#111111]/40 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-5 bg-[#F7F4EC] dark:bg-[#1A1A1A] border border-[#111111]/15 dark:border-white/15 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select 
                value={newDay} 
                onChange={(e) => setNewDay(e.target.value)} 
                className="px-3 py-2 bg-[#FAF8F3] dark:bg-[#141414] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-white rounded-none"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input 
                type="time" 
                value={newStartTime} 
                onChange={(e) => setNewStartTime(e.target.value)} 
                className="px-3 py-2 bg-[#FAF8F3] dark:bg-[#141414] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-white rounded-none" 
              />
              <input 
                type="time" 
                value={newEndTime} 
                onChange={(e) => setNewEndTime(e.target.value)} 
                className="px-3 py-2 bg-[#FAF8F3] dark:bg-[#141414] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-white rounded-none" 
              />
              <button 
                type="button" 
                onClick={handleAddAvailability} 
                className="py-2 px-4 bg-[#111111] hover:bg-[#222222] dark:bg-[#FFD21C] dark:text-[#111111] text-white font-bold text-xs uppercase tracking-wider transition-colors border border-[#111111]"
              >
                + Add Slot
              </button>
            </div>
          </div>
        )}

        {/* Tab: Preferences */}
        {activeTab === 'PREFERENCES' && (
          <div className="space-y-6 pt-2">
            <div className="p-5 bg-[#F7F4EC] dark:bg-[#1A1A1A] border border-[#111111]/15 dark:border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-[#111111] dark:text-[#F7F4EC] uppercase tracking-wider">
                    Interface Theme Mode
                  </h3>
                  <p className="text-xs text-[#111111]/60 dark:text-[#F7F4EC]/60 mt-0.5">
                    Currently utilizing <strong className="capitalize">{theme} Palette</strong> (Ivory / Charcoal).
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#FAF8F3] dark:bg-[#111111] p-1 border border-[#111111]/20 dark:border-white/20">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                      theme === 'light'
                        ? 'bg-[#111111] text-[#F7F4EC]'
                        : 'text-[#111111]/60 dark:text-[#F7F4EC]/60 hover:text-[#111111]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Ivory Light</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                      theme === 'dark'
                        ? 'bg-[#FFD21C] text-[#111111]'
                        : 'text-[#111111]/60 dark:text-[#F7F4EC]/60 hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Charcoal Dark</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Avatar Gallery */}
            <div className="p-5 bg-[#F7F4EC] dark:bg-[#1A1A1A] border border-[#111111]/15 dark:border-white/15 space-y-4">
              <div>
                <h3 className="font-bold text-xs text-[#111111] dark:text-[#F7F4EC] uppercase tracking-wider">
                  Select Profile Avatar Preset
                </h3>
                <p className="text-xs text-[#111111]/60 dark:text-[#F7F4EC]/60 mt-0.5">
                  Select a documentary editorial portrait preset or enter a direct image URL.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {avatarPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset)}
                    className={`w-14 h-14 overflow-hidden transition-all border-2 ${
                      avatarUrl === preset
                        ? 'border-[#111111] dark:border-[#FFD21C] scale-105 shadow-[2px_2px_0px_0px_#111111]'
                        : 'border-[#111111]/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt={`Avatar ${idx}`} className="w-full h-full object-cover grayscale contrast-110" />
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#F7F4EC] mb-1.5">
                  Custom Direct Image URL:
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#141414] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-white focus:outline-none focus:border-[#111111] rounded-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Reviews */}
        {activeTab === 'REVIEWS' && (
          <div className="space-y-4 pt-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 dark:text-[#F7F4EC]/50 block mb-1">
                Verified Feedback Ledger
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
                Member Reviews from Dual-Signed Exchanges.
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-5 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/15 dark:border-white/15 space-y-2">
                <div className="flex items-center justify-between border-b border-[#111111]/10 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#111111] text-white font-bold text-xs flex items-center justify-center font-mono">
                      CM
                    </div>
                    <span className="font-bold text-xs text-[#111111] dark:text-[#F7F4EC]">Carlos Mendez</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#FFD21C] text-[#111111] font-mono font-bold">
                      VERIFIED 1.25×
                    </span>
                  </div>
                  <span className="text-[#111111] dark:text-[#F7F4EC] text-xs font-bold">5.0 ★</span>
                </div>
                <p className="text-xs text-[#111111]/80 dark:text-[#F7F4EC]/80 leading-relaxed font-serif italic pt-1 text-sm">
                  "Prompt, patient, and helped troubleshoot computer setup quickly. Verified community exchange partner who explains every step clearly."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
