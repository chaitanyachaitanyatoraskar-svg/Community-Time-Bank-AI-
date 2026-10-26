import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Bot, 
  Send, 
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { MatchScoreResult } from '../types';
import { BookingModal } from '../components/BookingModal';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  type?: 'RECOMMENDATION' | 'INFO' | 'GENERAL';
  recommendations?: MatchScoreResult[];
  time: string;
}

export const AiAssistant: React.FC = () => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchScoreResult | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Good day ${user?.profile?.fullName?.split(' ')[0] || 'Member'}, I am your TimeBank Reciprocity & Matching Advisor.\n\nI can assist you in finding peer helpers across campus, explain our Fair Credit Multiplier (1:1 base hours, dual-party signoffs), or guide you through scheduling a verified skill exchange.\n\nWhat would you like to explore today?`,
      type: 'GENERAL',
      time: 'Just now'
    }
  ]);

  const quickPrompts = [
    'Who can help me with Python programming?',
    'How do time credits and 1:1 exchanges work?',
    'Explain the dual-party completion confirmation',
    'What community events are happening this month?',
    'Who is available for Gardening this weekend?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const response = await api.askAiAssistant(query);
      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: response.reply,
        type: response.type,
        recommendations: response.recommendations,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: 'I encountered an issue retrieving that information. Please try asking again or browse our Find Help tab.',
          type: 'INFO',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto h-[calc(100vh-7rem)] flex flex-col space-y-5 font-sans">
      {/* Top Editorial Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#111111]/10 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/60 dark:text-[#F7F4EC]/60">
              Community Governance & Match Assistant
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FFD21C] text-[#111111] border border-[#111111]/20">
              ACTIVE
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] dark:text-[#F7F4EC]">
            Match & Rules Advisor.
          </h1>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="px-3.5 py-2 border border-[#111111]/20 dark:border-white/20 hover:bg-[#111111] hover:text-[#F7F4EC] dark:hover:bg-[#F7F4EC] dark:hover:text-[#111111] text-[#111111] dark:text-[#F7F4EC] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors rounded-none"
          title="Reset conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Transcript</span>
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#222222] flex-1 flex flex-col overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FDFBF7] dark:bg-[#121212]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-4 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Stamp */}
                <div className={`w-8 h-8 rounded-none border border-[#111111] flex items-center justify-center shrink-0 font-bold text-xs ${
                  isUser
                    ? 'bg-[#111111] text-[#FFD21C]'
                    : 'bg-[#FFD21C] text-[#111111]'
                }`}>
                  {isUser ? (user?.profile?.fullName?.charAt(0) || 'U') : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-3">
                  <div className={`p-5 text-xs leading-relaxed border ${
                    isUser
                      ? 'bg-[#111111] text-[#F7F4EC] border-[#111111]'
                      : 'bg-[#FAF8F3] dark:bg-[#1A1A1A] text-[#111111] dark:text-[#F7F4EC] border-[#111111]/15 dark:border-white/15'
                  }`}>
                    <div className="space-y-2.5 font-sans">
                      {msg.text.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="leading-relaxed">{paragraph}</p>
                      ))}
                    </div>

                    <span className={`block text-[10px] font-mono mt-3 uppercase tracking-wider ${
                      isUser ? 'text-[#FFD21C]/80 text-right' : 'text-[#111111]/40 dark:text-[#F7F4EC]/40'
                    }`}>
                      {msg.time}
                    </span>
                  </div>

                  {/* AI Recommendation Cards (if any) */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {msg.recommendations.map((rec) => (
                        <div
                          key={rec.helperId}
                          className="bg-[#FAF8F3] dark:bg-[#1A1A1A] border border-[#111111]/20 dark:border-white/20 p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-[#111111]/10 pb-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 bg-[#111111] text-[#FFD21C] font-bold text-xs flex items-center justify-center font-mono">
                                {rec.helperName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-xs text-[#111111] dark:text-white font-serif">{rec.helperName}</h4>
                                <span className="text-[10px] text-[#111111]/60 font-medium">{rec.averageRating.toFixed(1)} ★ Verified</span>
                              </div>
                            </div>

                            <span className="px-2 py-0.5 bg-[#FFD21C] text-[#111111] text-[10px] font-mono font-bold border border-[#111111]/30">
                              {rec.matchScore}% MATCH
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedMatch(rec);
                              setBookingModalOpen(true);
                            }}
                            className="w-full py-2 bg-[#111111] hover:bg-[#222222] dark:bg-[#FFD21C] dark:text-[#111111] text-white font-bold text-xs tracking-wider uppercase transition-colors border border-[#111111] flex items-center justify-center gap-1.5"
                          >
                            <span>Request Booking</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-4 max-w-md">
              <div className="w-8 h-8 bg-[#FFD21C] text-[#111111] border border-[#111111] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 bg-[#FAF8F3] dark:bg-[#1A1A1A] border border-[#111111]/15 dark:border-white/15 text-xs text-[#111111]/70 dark:text-[#F7F4EC]/70 flex items-center gap-3">
                <span className="w-2 h-2 bg-[#FFD21C] border border-[#111111] animate-ping" />
                <span className="font-serif italic">Consulting verified skills directory & multiplier governance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="p-3 border-t border-[#111111]/10 dark:border-white/10 bg-[#FAF8F3] dark:bg-[#181818] flex gap-2 overflow-x-auto">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 bg-[#FDFBF7] dark:bg-[#202020] hover:bg-[#FFD21C] hover:text-[#111111] text-[#111111] dark:text-[#F7F4EC] text-[11px] whitespace-nowrap transition-colors border border-[#111111]/15 dark:border-white/15 font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-[#FAF8F3] dark:bg-[#151515] border-t border-[#111111]/15 dark:border-white/15 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about helper matching, 1:1 credit rules, or dispute resolution..."
            className="flex-1 px-4 py-2.5 bg-[#FDFBF7] dark:bg-[#1E1E1E] border border-[#111111]/20 dark:border-white/20 text-xs text-[#111111] dark:text-[#F7F4EC] placeholder-[#111111]/40 focus:outline-none focus:border-[#111111] rounded-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="px-5 py-2.5 bg-[#111111] hover:bg-[#222222] dark:bg-[#FFD21C] dark:text-[#111111] disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border border-[#111111]"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Booking Modal */}
      {selectedMatch && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          helperId={selectedMatch.helperId}
          helperName={selectedMatch.helperName}
          onSuccess={() => {
            setMessages(prev => [
              ...prev,
              {
                id: String(Date.now()),
                sender: 'ai',
                text: `Your booking request to ${selectedMatch.helperName} has been submitted! You can review its agreement status and rate formula anytime in My Bookings.`,
                type: 'INFO',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }}
        />
      )}
    </div>
  );
};
