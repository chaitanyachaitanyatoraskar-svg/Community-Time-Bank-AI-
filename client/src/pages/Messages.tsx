import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Search, Clock } from 'lucide-react';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  
  const contacts = [
    {
      id: 'bob',
      name: 'Bob Smith',
      role: 'Tech & Python Expert',
      lastMessage: 'Sure, see you then at 2 PM!',
      time: '2 min ago',
      online: true,
      unread: 0,
      avatar: 'B'
    },
    {
      id: 'neha',
      name: 'Neha Patil',
      role: 'English Tutor',
      lastMessage: 'Let me know what time works best.',
      time: '1 hour ago',
      online: false,
      unread: 1,
      avatar: 'N'
    },
    {
      id: 'carlos',
      name: 'Carlos Mendez',
      role: 'Gardener & DIY',
      lastMessage: 'Yes, that works! I will bring the seed pots.',
      time: '3 hours ago',
      online: true,
      unread: 0,
      avatar: 'C'
    }
  ];

  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [messages, setMessages] = useState<{ sender: 'me' | 'other'; text: string; time: string }[]>([
    { sender: 'other', text: 'Hi! I saw your request for computer & printer setup help. I can assist you this Saturday.', time: '10:30 AM' },
    { sender: 'me', text: 'Great! Can we do this Saturday at 2:00 PM?', time: '10:32 AM' },
    { sender: 'other', text: 'Yes, that works perfectly!', time: '10:33 AM' },
    { sender: 'me', text: 'Perfect, I sent the booking request through TimeBank AI.', time: '10:34 AM' },
    { sender: 'other', text: 'Sure, see you then at 2 PM!', time: '10:35 AM' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      sender: 'me' as const,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'other',
          text: 'Got it! Looking forward to assisting you.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <div className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#262626] h-full flex rounded-none overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-80 border-r border-[#E5E0D8] dark:border-[#262626] bg-[#F7F4EC] dark:bg-[#181818] flex flex-col">
          <div className="p-4 border-b border-[#E5E0D8] dark:border-[#262626] bg-[#FAF8F3] dark:bg-[#151515]">
            <h2 className="font-serif font-bold text-lg text-[#111111] dark:text-white mb-2">Member Messages</h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#111111]/40 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#FDFBF7] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-xs text-[#111111] dark:text-white placeholder-[#111111]/40 focus:outline-hidden focus:border-black rounded-none"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-[#E5E0D8] dark:divide-[#262626]">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                className={`w-full p-4 text-left transition-colors flex items-start gap-3.5 cursor-pointer ${
                  activeContact.id === contact.id
                    ? 'bg-[#FFD21C] text-black'
                    : 'hover:bg-[#FAF8F3] dark:hover:bg-[#202020]'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-9 h-9 border flex items-center justify-center font-bold text-xs ${
                    activeContact.id === contact.id
                      ? 'bg-black text-[#FFD21C] border-black'
                      : 'bg-[#111111] text-white border-black'
                  }`}>
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <span className="w-2 h-2 rounded-full bg-[#123D32] border border-white absolute -bottom-0.5 -right-0.5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs truncate">{contact.name}</span>
                    <span className="text-[10px] opacity-70 font-mono">{contact.time}</span>
                  </div>
                  <p className="text-[11px] truncate mt-0.5 opacity-80">{contact.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 flex flex-col bg-[#FDFBF7] dark:bg-[#121212]">
          {/* Active Contact Header */}
          <div className="p-4 border-b border-[#E5E0D8] dark:border-[#262626] flex items-center justify-between bg-[#FAF8F3] dark:bg-[#151515]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#111111] text-[#FFD21C] font-bold text-xs flex items-center justify-center border border-black">
                {activeContact.avatar}
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#111111] dark:text-white flex items-center gap-2">
                  <span>{activeContact.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#123D32] inline-block" />
                </h3>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#111111]/50 dark:text-white/50">{activeContact.role}</p>
              </div>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-white bg-[#F7F4EC] dark:bg-[#222] px-2.5 py-1 border border-[#E5E0D8] dark:border-[#333] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#111111]/50" />
              <span>Exchange Partner</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAF8F3] dark:bg-[#101010]">
            {messages.map((msg, idx) => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2.5 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#111111] text-white border border-black'
                        : 'bg-[#FDFBF7] dark:bg-[#1c1c1c] text-[#111111] dark:text-white border border-[#E5E0D8] dark:border-[#333]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#111111]/40 dark:text-white/40 mt-1 font-mono">{msg.time}</span>
                </div>
              );
            })}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E5E0D8] dark:border-[#262626] bg-[#FAF8F3] dark:bg-[#151515] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message to your exchange helper..."
              className="flex-1 px-3.5 py-2.5 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-xs text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#111111] hover:bg-black text-white transition-colors cursor-pointer border border-black"
            >
              <Send className="w-3.5 h-3.5 text-[#FFD21C]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

