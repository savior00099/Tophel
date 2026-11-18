import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { MessageSquare, Send, Sparkles, Flame, Shield, Users, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_SEED_MESSAGES = [
  {
    id: 'msg_seed_1',
    senderName: 'Tophel Architect',
    senderEmail: 'architect@tophel.system',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badge: 'Architect',
    text: 'Welcome to Tophel! Whether you are grinding commerce, creative arts, engineering, science, or marketing — keep the 85% clearance rule locked in. Checkpoint deadlines wait for no one!',
    timestamp: '10:15 AM',
    streak: 42
  },
  {
    id: 'msg_seed_2',
    senderName: 'Elena Rostova',
    senderEmail: 'elena@creative.studio',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=elena',
    badge: 'Creative Arts',
    text: 'Finished rendering my 3-minute commercial edit showcase today! Sector 02 portfolio deadline is looking solid.',
    timestamp: '11:40 AM',
    streak: 19
  },
  {
    id: 'msg_seed_3',
    senderName: 'Marcus Vance',
    senderEmail: 'marcus@finance.io',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=marcus',
    badge: 'Commerce & Finance',
    text: 'Locked in 4 hours on financial modeling & DCF valuation drills. Anyone else taking the CPA or CFA this season?',
    timestamp: '1:10 PM',
    streak: 26
  },
  {
    id: 'msg_seed_4',
    senderName: 'Dr. Tariq K.',
    senderEmail: 'tariq@medlab.edu',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tariq',
    badge: 'Science & Lab',
    text: 'Pre-med problem sets cleared for today. 85% rule really prevents procrastination.',
    timestamp: '2:25 PM',
    streak: 14
  }
];

export default function CommunityChatPage() {
  const { user, isAdmin, isFirebaseConfigured } = useAuth();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('tophel_community_chat');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return DEFAULT_SEED_MESSAGES;
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  // Real-time Firestore subscription
  useEffect(() => {
    if (db && isFirebaseConfigured) {
      try {
        const q = query(collection(db, 'community_chat'), orderBy('createdAt', 'asc'), limit(80));
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            if (!snapshot.empty) {
              const liveMsgs = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                  id: docSnap.id,
                  senderName: data.senderName || 'Challenger',
                  senderEmail: data.senderEmail || 'user@tophel.dev',
                  avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.senderEmail || 'user'}`,
                  badge: data.badge || 'Challenger',
                  text: data.text || '',
                  timestamp: data.createdAt?.toDate
                    ? data.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  streak: data.streak || 7
                };
              });

              // Combine seed messages with live messages
              setMessages([...DEFAULT_SEED_MESSAGES, ...liveMsgs]);
            }
          },
          (err) => {
            console.warn('Firestore live chat notice (using local cache):', err.message);
          }
        );

        return () => unsubscribe();
      } catch (err) {
        console.warn('Live chat stream initialization notice:', err.message);
      }
    }
  }, [isFirebaseConfigured]);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    try {
      localStorage.setItem('tophel_community_chat', JSON.stringify(messages));
    } catch (e) { }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    const newMsg = {
      senderName: user?.displayName || 'Challenger',
      senderEmail: user?.email || 'user@tophel.dev',
      avatar: user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || 'user'}`,
      badge: isAdmin ? 'Architect' : 'Challenger',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      streak: 7
    };

    // Try posting to Firestore
    let savedToFirestore = false;
    if (db && isFirebaseConfigured) {
      try {
        await addDoc(collection(db, 'community_chat'), {
          ...newMsg,
          createdAt: serverTimestamp()
        });
        savedToFirestore = true;
      } catch (err) {
        console.warn('Firestore chat write notice:', err.message);
      }
    }

    // If Firestore was offline or in preview mode, save locally
    if (!savedToFirestore) {
      setMessages((prev) => [...prev, { id: `msg_${Date.now()}`, ...newMsg }]);
    }

    setIsSending(false);
    toast.success('Message posted to Community!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Chat Header ─────────────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-orange-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping inline-block" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Live Community Lounge
            </span>
            <span className="text-slate-400 dark:text-dark-500">•</span>
            <span className="text-xs font-mono text-slate-500 dark:text-dark-400">Global Challenger Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-900 dark:text-white tracking-tight">
            Challengers Live Chat
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 font-body mt-1">
            Connect with fellow grinders across commerce, design, science, engineering, and marketing. Share progress, celebrate milestones, and ask questions!
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-dark-900 border border-orange-200 dark:border-dark-700 text-slate-700 dark:text-dark-300 shrink-0">
          <Users className="w-4 h-4 text-orange-500" />
          <span>Active Challengers Online</span>
        </div>
      </div>

      {/* ── Chat Box ────────────────────────────────────────── */}
      <div className="glass-card flex flex-col h-[520px] sm:h-[600px] overflow-hidden border border-orange-500/20">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderEmail === user?.email;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <img
                  src={msg.avatar}
                  alt={msg.senderName}
                  className="w-9 h-9 rounded-full ring-2 ring-orange-500/30 object-cover shrink-0 bg-slate-100 dark:bg-dark-800"
                />

                <div className={`space-y-1 ${isMe ? 'items-end text-right' : ''}`}>
                  <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                      {msg.senderName}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        msg.badge === 'Architect'
                          ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/40 font-bold'
                          : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-dark-300 border-slate-200 dark:border-dark-700'
                      }`}
                    >
                      {msg.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-dark-500">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm font-body leading-relaxed inline-block ${
                      isMe
                        ? 'bg-orange-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-100 dark:bg-dark-900 text-slate-800 dark:text-dark-200 border border-slate-200 dark:border-dark-800 rounded-tl-none'
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

        {/* Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 bg-slate-50 dark:bg-dark-950/80 border-t border-slate-200 dark:border-dark-800 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Share daily win, question, or motivation with the community..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isSending}
            className="input-field text-xs sm:text-sm flex-1 bg-white dark:bg-dark-900"
          />

          <button
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="btn-primary text-xs flex items-center gap-2 py-2.5 px-4 shrink-0 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
