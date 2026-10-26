import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Check, 
  Search, 
  X,
  ArrowRight
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  mode: string;
  host: string;
  attendees: number;
  description: string;
  creditsEarned: string;
}

export const CommunityEvents: React.FC = () => {
  const [joinedEvents, setJoinedEvents] = useState<string[]>(['1']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Tech & Computers');
  const [newDate, setNewDate] = useState('May 10, 2026 • 3:00 PM');
  const [newMode, setNewMode] = useState('Online (Zoom)');
  const [newDescription, setNewDescription] = useState('');
  const [newCredits, setNewCredits] = useState('+1 Time Credit');

  const [events, setEvents] = useState<EventItem[]>([
    {
      id: '1',
      title: 'Digital Skills for All: Basic Tech Workshop',
      category: 'Tech & Computers',
      date: 'Apr 20, 2026 • 4:00 PM',
      mode: 'Online (Zoom Room)',
      host: 'Bob Smith (Tech Lead)',
      attendees: 18,
      description: 'A community workshop covering internet safety, cloud storage, password hygiene, and smartphone productivity.',
      creditsEarned: '+1.0 Cr'
    },
    {
      id: '2',
      title: 'English Conversation Circle & Language Cafe',
      category: 'Languages & Tutoring',
      date: 'Apr 25, 2026 • 5:00 PM',
      mode: 'In-person • Campus Library Pod B',
      host: 'Neha Patil',
      attendees: 14,
      description: 'Practice speaking English in a relaxed, supportive circle with international students and neighbors.',
      creditsEarned: '+1.0 Cr'
    },
    {
      id: '3',
      title: 'Spring Community Garden & Balcony Planting',
      category: 'Gardening & Outdoors',
      date: 'May 3, 2026 • 9:00 AM',
      mode: 'In-person • Westside Community Garden',
      host: 'Carlos Mendez',
      attendees: 24,
      description: 'Help plant seasonal herbs, prune community fruit bushes, and prepare soil for organic vegetable beds.',
      creditsEarned: '+2.0 Cr'
    },
    {
      id: '4',
      title: 'Python for Beginners: Build Practical Scripts',
      category: 'Tech & Computers',
      date: 'May 8, 2026 • 6:00 PM',
      mode: 'Online (Discord / Google Meet)',
      host: 'Bob Smith',
      attendees: 21,
      description: 'Hands-on beginner workshop writing practical automation scripts to organize files and process data.',
      creditsEarned: '+1.0 Cr'
    },
    {
      id: '5',
      title: 'Visual Design & Portfolio Principles',
      category: 'Creative & Design',
      date: 'May 12, 2026 • 4:30 PM',
      mode: 'Hybrid • Media Lab & Online',
      host: 'Sneha Desai',
      attendees: 16,
      description: 'Learn visual hierarchy, typography pairings, and layout composition for resumes, flyers, and portfolios.',
      creditsEarned: '+1.0 Cr'
    },
    {
      id: '6',
      title: 'Community Bicycle Repair & Maintenance Clinic',
      category: 'Home Repair & DIY',
      date: 'May 16, 2026 • 10:00 AM',
      mode: 'In-person • Campus Bike Shed',
      host: 'Carlos Mendez',
      attendees: 19,
      description: 'Bring your bike for basic tune-ups, brake adjustments, chain oiling, and flat tire patch demonstrations.',
      creditsEarned: '+2.0 Cr'
    }
  ]);

  const handleToggleJoin = (id: string) => {
    if (joinedEvents.includes(id)) {
      setJoinedEvents(joinedEvents.filter(eId => eId !== id));
    } else {
      setJoinedEvents([...joinedEvents, id]);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: EventItem = {
      id: String(Date.now()),
      title: newTitle,
      category: newCategory,
      date: newDate,
      mode: newMode,
      host: 'Alice Johnson',
      attendees: 1,
      description: newDescription,
      creditsEarned: newCredits
    };

    setEvents([created, ...events]);
    setJoinedEvents([...joinedEvents, created.id]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const categories = ['All', 'Tech & Computers', 'Languages & Tutoring', 'Gardening & Outdoors', 'Creative & Design', 'Home Repair & DIY'];

  const filteredEvents = events.filter((ev) => {
    const matchesCat = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesSearch = !searchQuery || ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 border-b border-[#E5E0D8] dark:border-[#262626] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-4 bg-[#FFD21C] inline-block" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]/70 dark:text-white/70">
              Civic Workshops & Cohorts
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-white">
            Community Workshops
          </h1>
          <p className="text-sm sm:text-base text-[#111111]/70 dark:text-[#E5E0D8]/70 mt-1 max-w-2xl leading-relaxed">
            Attend group workshops or volunteer drives to learn skills and earn community time credits together.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-[#FFD21C] hover:bg-[#F4C400] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-black shadow-[2px_2px_0px_0px_#111111] transition-transform hover:-translate-y-0.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Host a Workshop</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#262626] p-5 space-y-4 rounded-none">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#111111]/40 dark:text-white/40 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search community workshops by topic or mentor..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-xs text-[#111111] dark:text-white placeholder-[#111111]/40 focus:outline-hidden focus:border-black rounded-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-white border border-black'
                    : 'bg-[#F7F4EC] dark:bg-[#222] text-[#111111] dark:text-white border border-[#E5E0D8] dark:border-[#333] hover:bg-[#FAF8F3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((ev) => {
          const isJoined = joinedEvents.includes(ev.id);

          return (
            <div key={ev.id} className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#262626] p-6 flex flex-col justify-between space-y-4 rounded-none hover:border-black transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#111111] dark:text-white px-2 py-0.5 bg-[#F7F4EC] dark:bg-[#222] border border-[#E5E0D8] dark:border-[#333]">
                    {ev.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FFD21C] text-black border border-black">
                    {ev.creditsEarned}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-white leading-snug">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-[#111111]/70 dark:text-white/70 line-clamp-3 mt-1.5 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-[#111111]/70 dark:text-white/70 pt-3 border-t border-[#E5E0D8] dark:border-[#262626]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#111111]/50" />
                    <span className="font-medium text-[#111111] dark:text-white">{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#111111]/50" />
                    <span>{ev.mode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#111111]/50" />
                    <span>{ev.attendees + (isJoined ? 1 : 0)} Participants Attending</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E0D8] dark:border-[#262626] flex items-center justify-between">
                <span className="text-[11px] text-[#111111]/60 dark:text-white/60">
                  Host: <strong className="text-[#111111] dark:text-white">{ev.host}</strong>
                </span>

                <button
                  onClick={() => handleToggleJoin(ev.id)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isJoined
                      ? 'bg-[#123D32] text-white border border-[#123D32]'
                      : 'bg-[#111111] hover:bg-black text-white border border-black'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#FFD21C]" />
                      <span>RSVP Confirmed</span>
                    </>
                  ) : (
                    <span>Register</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FAF8F3] dark:bg-[#151515] border-2 border-black dark:border-[#333] shadow-[8px_8px_0px_0px_#111111] w-full max-w-lg p-6 sm:p-8 space-y-5 rounded-none">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] dark:border-[#262626] pb-3">
              <h3 className="font-serif font-bold text-2xl text-[#111111] dark:text-white">
                Host a Community Workshop
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#111111]/60 hover:text-black p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
                  Workshop Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Basic Data Analysis with Spreadsheets"
                  className="w-full px-3 py-2 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-xs text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-xs text-[#111111] dark:text-white rounded-none"
                >
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. May 20, 2026 • 4:00 PM"
                    className="w-full px-3 py-2 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-xs text-[#111111] dark:text-white rounded-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
                    Mode / Location
                  </label>
                  <input
                    type="text"
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value)}
                    placeholder="e.g. Online (Zoom) or Campus Center"
                    className="w-full px-3 py-2 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-xs text-[#111111] dark:text-white rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe session goals, skill prerequisites, and schedule..."
                  className="w-full px-3 py-2 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-xs text-[#111111] dark:text-white rounded-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 border border-[#E5E0D8] dark:border-[#333] text-xs font-bold uppercase tracking-wider hover:bg-[#F7F4EC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FFD21C] hover:bg-[#F4C400] text-black font-bold text-xs uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_#111111] cursor-pointer"
                >
                  Publish Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

