import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Search, 
  Bell, 
  Coins, 
  MessageSquare, 
  Sun, 
  Moon, 
  Bot, 
  Calendar, 
  Gift, 
  CheckCheck,
  Star,
  Layers,
  X 
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      icon: Calendar,
      title: 'Booking Accepted',
      description: 'Bob Smith accepted your computer assistance session for Saturday.',
      time: '2 min ago',
      read: false,
      link: '/bookings'
    },
    {
      id: '2',
      icon: Gift,
      title: 'Welcome Allowance Granted',
      description: 'You received +3.0 Time Credits upon membership activation.',
      time: '1 hour ago',
      read: false,
      link: '/wallet'
    },
    {
      id: '3',
      icon: Layers,
      title: 'AI Match Suggested',
      description: 'Carlos Mendez is available for Garden & Yard Assistance this Sunday.',
      time: '3 hours ago',
      read: false,
      link: '/find-help'
    },
    {
      id: '4',
      icon: Star,
      title: 'Service Rating Recorded',
      description: 'Alice Johnson submitted a verified 5-star service review.',
      time: '1 day ago',
      read: true,
      link: '/profile'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markSingleRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header className="h-14 bg-[#F7F4EC] dark:bg-[#141414] border-b border-[#E5E0D8] dark:border-[#262626] px-6 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#6B6B6B] dark:text-[#8E8E8E] absolute left-3 top-2.5" />
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/find-help?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
              }
            }}
            placeholder="Search skills, listings, or community members..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-[#FDFBF7] dark:bg-[#1C1C1C] border border-[#E5E0D8] dark:border-[#2A2A2A] rounded-none text-xs text-[#111111] dark:text-[#F7F4EC] placeholder-[#8E8E8E] focus:outline-none focus:border-[#111111] dark:focus:border-white transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Wallet Credit Indicator */}
        <Link
          to="/wallet"
          className="flex items-center gap-2 px-3 py-1 rounded-none bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-[#E5E0D8] dark:border-[#2A2A2A] text-[#111111] dark:text-[#F7F4EC] hover:border-[#111111] transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-[#FFD21C]"></span>
          <span className="text-xs font-bold font-mono">
            {user?.creditBalance !== undefined ? user.creditBalance.toFixed(1) : '4.0'}
          </span>
          <span className="text-[11px] font-medium text-[#6B6B6B] dark:text-[#8E8E8E]">Credits</span>
        </Link>

        {/* Messages */}
        <Link
          to="/messages"
          className="p-1.5 rounded-none text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white hover:bg-[#EFECE3] dark:hover:bg-[#1C1C1C] transition-colors"
          title="Messages"
        >
          <MessageSquare className="w-4 h-4" />
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="p-1.5 rounded-none text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white hover:bg-[#EFECE3] dark:hover:bg-[#1C1C1C] relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-3.5 h-3.5 rounded-full bg-[#111111] text-white text-[9px] font-bold flex items-center justify-center absolute top-0.5 right-0.5">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-[#E5E0D8] dark:border-[#2A2A2A] rounded-none shadow-[2px_2px_0px_0px_#111111] dark:shadow-[2px_2px_0px_0px_#000000] overflow-hidden z-50">
              <div className="p-3 border-b border-[#E5E0D8] dark:border-[#2A2A2A] flex items-center justify-between bg-[#F7F4EC] dark:bg-[#141414]">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-sm text-[#111111] dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-none bg-[#FFD21C] text-[#111111] text-[10px] font-semibold">
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-[#111111] dark:text-[#E7E2D6] hover:underline font-medium flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E0D8] dark:divide-[#2A2A2A]">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markSingleRead(notif.id);
                        setNotificationOpen(false);
                        navigate(notif.link);
                      }}
                      className={`p-3 flex items-start gap-3 hover:bg-[#F7F4EC] dark:hover:bg-[#252525] cursor-pointer transition-colors ${
                        !notif.read ? 'bg-[#FAF8F3] dark:bg-[#1A1A1A]' : ''
                      }`}
                    >
                      <div className="w-7 h-7 rounded-none bg-[#EFECE3] dark:bg-[#252525] text-[#111111] dark:text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-xs text-[#111111] dark:text-white truncate">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-[#8E8E8E] shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-[#4A4A4A] dark:text-[#A0A0A0] mt-0.5 leading-snug">
                          {notif.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-none text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white hover:bg-[#EFECE3] dark:hover:bg-[#1C1C1C] transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
