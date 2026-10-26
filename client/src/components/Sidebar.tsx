import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Search, 
  HandHeart, 
  HelpCircle, 
  CalendarDays, 
  User, 
  Wallet, 
  MessageSquare, 
  Users, 
  Bot, 
  ShieldCheck, 
  LogOut, 
  Gift,
  HeartHandshake
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Help', path: '/find-help', icon: Search },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Bot },
    { name: 'Offer Help', path: '/my-listings?tab=offer', icon: HandHeart },
    { name: 'My Requests', path: '/my-listings?tab=request', icon: HelpCircle },
    { name: 'My Bookings', path: '/bookings', icon: CalendarDays },
    { name: 'Redeem Perks', path: '/redeem', icon: Gift },
    { name: 'Community Pool', path: '/community-pool', icon: HeartHandshake },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Community Events', path: '/community', icon: Users },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'My Wallet', path: '/wallet', icon: Wallet },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Admin Console', path: '/admin', icon: ShieldCheck });
  }

  const initial = (user?.profile?.fullName || user?.email || 'M').charAt(0).toUpperCase();

  return (
    <aside className="w-56 bg-[#F7F4EC] dark:bg-[#141414] border-r border-[#E5E0D8] dark:border-[#262626] min-h-screen flex flex-col shrink-0 transition-colors select-none">
      {/* Editorial Brand Header */}
      <div className="p-4 border-b border-[#E5E0D8] dark:border-[#262626] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#111111] dark:bg-[#FAF8F3] text-[#FAF8F3] dark:text-[#111111] flex items-center justify-center rounded-none font-serif font-bold text-xs">
            ⌛
          </div>
          <div className="flex items-baseline">
            <span className="font-serif text-lg font-bold text-[#111111] dark:text-[#F7F4EC] tracking-tight">TimeBank</span>
            <span className="font-serif italic text-base text-[#111111] dark:text-[#F7F4EC] ml-0.5">AI</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="p-2.5 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-none text-xs transition-colors ${
                active
                  ? 'bg-[#FFD21C] text-[#111111] font-semibold'
                  : 'text-[#4A4A4A] dark:text-[#A0A0A0] hover:text-[#111111] dark:hover:text-white hover:bg-[#EFECE3] dark:hover:bg-[#1F1F1F] font-medium'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#111111]' : 'text-[#6B6B6B] dark:text-[#8E8E8E]'}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Editorial Member Footer in Sidebar */}
      <div className="p-3 border-t border-[#E5E0D8] dark:border-[#262626]">
        <div className="flex items-center justify-between p-2 rounded-none bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-[#E5E0D8] dark:border-[#2A2A2A]">
          <div className="flex items-center gap-2 min-w-0 pr-1">
            <div className="w-7 h-7 rounded-full bg-[#FFD21C] text-[#111111] font-serif font-bold text-xs flex items-center justify-center shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#111111] dark:text-[#F7F4EC] truncate leading-tight">
                {user?.profile?.fullName || user?.email?.split('@')[0] || 'Alice Johnson'}
              </p>
              <p className="text-[10px] text-[#6B6B6B] dark:text-[#8E8E8E] truncate">
                {user?.role === 'ADMIN' ? 'Administrator' : 'Member'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white hover:bg-[#EFECE3] dark:hover:bg-[#2A2A2A] transition-colors"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

