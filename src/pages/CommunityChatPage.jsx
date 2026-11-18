import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Send, Sparkles, Flame, Shield, Users, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommunityChatPage() {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('tophel_community_chat');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        id: 'msg_1',
        senderName: 'Tophel Architect',
        senderEmail: 'architect@tophel.system',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        badge: 'Architect',
        text: 'Welcome to Tophel! Whether you are grinding commerce, creative arts, engineering, science, or marketing — keep the 85% clearance rule locked in. Checkpoint deadlines wait for no one!',
        timestamp: '10:15 AM',
        streak: 42
      },
      {
        id: 'msg_2',
        senderName: 'Elena Rostova',
        senderEmail: 'elena@creative.studio',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=elena',
        badge: 'Creative Arts',
        text: 'Finished rendering my 3-minute commercial edit showcase today! Sector 02 portfolio deadline is looking solid.',
        timestamp: '11:40 AM',
        streak: 19
      },
      {
        id: 'msg_3',
        senderName: 'Marcus Vance',
        senderEmail: 'marcus@finance.io',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=marcus',
        badge: 'Commerce & Finance',
        text: 'Locked in 4 hours on financial modeling & DCF valuation drills. Anyone else taking the CPA or CFA this season?',
        timestamp: '1:10 PM',
        streak: 26
      },
      {
        id: 'msg_4',
        senderName: 'Dr. Tariq K.',
        senderEmail: 'tariq@medlab.edu',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tariq',
        badge: 'Science & Lab',
        text: 'Pre-med problem sets cleared for today. 85% rule really prevents procrastination.',
        timestamp: '2:25 PM',
        streak: 14
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('tophel_community_chat', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderName: user?.displayName || 'Challenger',
      senderEmail: user?.email || 'user@tophel.dev',
      avatar: user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || 'user'}`,
      badge: isAdmin ? 'Architect' : 'Challenger',
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      streak: 7
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    toast.success('Message posted to Community!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Chat Header ─────────────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-ping inline-block" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400">
              Live Community Lounge
            </span>
            <span className="text-dark-500">•</span>
            <span className="text-xs font-mono text-dark-400">Global Challenger Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">
            Challengers Community Chat
          </h1>
          <p className="text-xs sm:text-sm text-dark-400 font-body mt-1">
            Connect with fellow grinders across commerce, design, science, engineering, and marketing. Share progress, celebrate milestones, and ask questions!
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl bg-dark-900/40 dark:bg-dark-900 border border-dark-700/60 shrink-0">
          <Users className="w-4 h-4 text-lime-500" />
          <span>Active Challengers Online</span>
        </div>
      </div>

      {/* ── Chat Box ────────────────────────────────────────── */}
      <div className="glass-card flex flex-col h-[520px] sm:h-[600px] overflow-hidden border border-dark-700/60">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderEmail === user?.email;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                <img
                  src={msg.avatar}
                  alt={msg.senderName}
                  className="w-9 h-9 rounded-xl object-cover shrink-0 border border-dark-700 shadow-sm"
                />

                <div className={`max-w-[85%] sm:max-w-[70%] space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 text-xs font-mono ${isMe ? 'justify-end' : ''}`}>
                    <span className="font-bold font-sans text-dark-900 dark:text-white">
                      {msg.senderName}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      msg.badge === 'Architect'
                        ? 'bg-lime-500/20 text-lime-600 dark:text-lime-400 border border-lime-500/30'
                        : 'bg-gold-500/20 text-gold-600 dark:text-gold-400 border border-gold-500/30'
                    }`}>
                      {msg.badge}
                    </span>
                    <span className="text-[10px] text-dark-400">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm font-body leading-relaxed inline-block ${
                      isMe
                        ? 'bg-lime-500 text-dark-950 font-medium rounded-tr-none shadow-md shadow-lime-500/20'
                        : 'bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 text-slate-800 dark:text-dark-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 border-t border-slate-200 dark:border-dark-800 bg-white/50 dark:bg-dark-950/80 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your message, win, or question..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="input-field text-xs sm:text-sm py-2.5"
          />
          <button
            type="submit"
            className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
