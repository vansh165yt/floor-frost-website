'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Announcement {
  id: string;
  content: string;
  author: {
    username: string;
    avatar: string;
  };
  publishedAt: string;
  url: string;
  attachments: Array<{ url: string; contentType?: string }>;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive reaction counters
  const [reactions, setReactions] = useState<{ [key: string]: { [emoji: string]: number } }>({
    default: { '❤️': 142, '🔥': 288, '🚀': 195, '🎮': 110 }
  });
  const [userReacted, setUserReacted] = useState<{ [key: string]: string[] }>({});
  const [discordStats, setDiscordStats] = useState({
    onlineCount: 13,
    memberCount: 27,
  });

  useEffect(() => {
    const fetchAllAnnouncements = async () => {
      try {
        const res = await fetch(`/api/discord-announcements?limit=50&t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.announcements && data.announcements.length > 0) {
            setAnnouncements(data.announcements);
            setIsLive(Boolean(data.isLive));
          }
          if (typeof data.onlineCount === 'number') {
            setDiscordStats({
              onlineCount: data.onlineCount,
              memberCount: data.memberCount || 27,
            });
          }
        }
      } catch (e) {
        console.error("Failed to load all announcements:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAnnouncements();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      fetchAllAnnouncements();
    }, 60000);

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchAllAnnouncements();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const handleToggleReaction = (announcementId: string, emoji: string) => {
    setReactions(prev => {
      const currentAnn = prev[announcementId] || { '❤️': 142, '🔥': 288, '🚀': 195, '🎮': 110 };
      const userList = userReacted[announcementId] || [];
      const hasReacted = userList.includes(emoji);

      const newCount = hasReacted ? Math.max(0, (currentAnn[emoji] || 0) - 1) : (currentAnn[emoji] || 0) + 1;
      
      setUserReacted(uPrev => ({
        ...uPrev,
        [announcementId]: hasReacted
          ? (uPrev[announcementId] || []).filter(e => e !== emoji)
          : [...(uPrev[announcementId] || []), emoji]
      }));

      return {
        ...prev,
        [announcementId]: {
          ...currentAnn,
          [emoji]: newCount
        }
      };
    });
  };

  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery.trim()) return announcements;
    const q = searchQuery.toLowerCase();
    return announcements.filter(a => a.content.toLowerCase().includes(q) || a.author.username.toLowerCase().includes(q));
  }, [announcements, searchQuery]);

  return (
    <div className="min-h-screen bg-[#07040d] text-white font-sans selection:bg-purple-500/30 pb-28 relative overflow-hidden animate-portal-fade">
      
      {/* Ambient Cosmic Dark Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[55rem] h-[55rem] bg-indigo-900/25 rounded-full blur-[220px] pointer-events-none animate-ambient-breathe" />
      <div className="absolute top-[35%] right-[-10%] w-[45rem] h-[45rem] bg-purple-900/20 rounded-full blur-[200px] pointer-events-none animate-ambient-breathe" style={{ animationDelay: '-3.5s' }} />
      <div className="absolute bottom-10 left-[-10%] w-[50rem] h-[50rem] bg-pink-950/30 rounded-full blur-[220px] pointer-events-none animate-ambient-breathe" style={{ animationDelay: '-2s' }} />

      {/* Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Header */}
      <Header activePage="announcements" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 relative z-10 flex flex-col gap-10">

        {/* Hero Section Banner */}
        <div className="relative rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] via-[#100b24]/90 to-[#080514]/95 border-2 border-indigo-500/30 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.6)] flex flex-col items-start gap-6 overflow-hidden group scroll-fade-up shimmer-glass-card">
          <div className="tilt-glare" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-[#5865f2]/30 via-purple-500/25 to-pink-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1.5 rounded-full bg-[#5865f2]/20 border border-[#5865f2]/40 text-indigo-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_15px_rgba(88,101,242,0.3)]">
              <span className="w-2 h-2 rounded-full bg-[#5865f2] animate-ping" />
              COMMUNITY BROADCASTS
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {announcements.length} BROADCASTS LOADED
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>💬 {discordStats.onlineCount} ONLINE NOW</span>
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              FLOOR FROST <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-400 animate-text-shimmer">COMMUNITY ALERTS</span>
            </h1>

            <p className="max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              Official video updates, project announcements, Minecraft shader releases, and voice room gaming events directly synced from the Floor Frost Discord server.
            </p>
          </div>

          {/* Action Row */}
          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://discord.gg/aN5CCRT6CS"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#5865f2] to-[#7289da] hover:from-[#4752c4] hover:to-[#5865f2] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 shadow-[0_0_25px_rgba(88,101,242,0.6)] hover:scale-105 active:scale-95"
              >
                <span>Join Official Discord Server</span>
                <span className="text-base">💬</span>
              </a>

              <a
                href="https://youtube.com/@floorfrost"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105"
              >
                <span>Floor Frost YouTube</span>
                <span>↗</span>
              </a>
            </div>

            {/* Instant Search Bar */}
            <div className="relative min-w-[240px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search announcements..."
                className="w-full px-4 py-2.5 pl-9 rounded-xl bg-black/60 border border-indigo-500/40 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_20px_rgba(88,101,242,0.4)] transition-all font-mono"
              />
              <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">💬</span>
            </div>
          </div>
        </div>

        {/* FEED LIST */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
              <span>BROADCAST FEED</span>
              {isLive && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono">
                  LIVE SYNCED
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col gap-6 w-full">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-3xl bg-white/[0.02] border border-white/10 p-8 animate-pulse h-48" />
              ))}
            </div>
          ) : filteredAnnouncements.length > 0 ? (
            <div className="flex flex-col gap-6 w-full">
              {filteredAnnouncements.map((item, idx) => (
                <div
                  key={item.id}
                  className="group rounded-3xl bg-gradient-to-b from-[#110a24]/95 via-[#0b0617]/95 to-[#06030e]/95 border-2 border-indigo-500/30 p-6 sm:p-8 flex flex-col gap-6 shadow-[0_10px_35px_rgba(88,101,242,0.15)] hover:border-[#5865f2] hover:shadow-[0_0_50px_rgba(88,101,242,0.4)] hover-lift shimmer-glass-card tilt-card transition-all duration-300 relative overflow-hidden"
                >
                  <div className="tilt-glare" />
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#5865f2]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#5865f2]/20 transition-colors" />

                  {/* Author Header Info */}
                  <div className="flex flex-wrap items-center justify-between gap-3 z-10 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#5865f2] relative shadow-md p-0.5 bg-black shrink-0">
                        <img src={item.author.avatar || '/logo.png'} alt={item.author.username} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {item.author.username}
                          </h3>
                          <span className="px-2 py-0.5 rounded bg-[#5865f2] text-white text-[10px] font-mono font-bold tracking-wider uppercase">
                            OFFICIAL
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-indigo-400">
                          Floor Frost Discord Server Broadcast
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
                        {item.publishedAt}
                      </span>
                    </div>
                  </div>

                  {/* Announcement Content Box */}
                  <div className="z-10 p-5 rounded-2xl bg-[#090514]/80 border-l-4 border-indigo-400 border border-white/5 backdrop-blur-sm shadow-inner">
                    <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-light whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>

                  {/* Attachments if any */}
                  {item.attachments && item.attachments.length > 0 && (
                    <div className="z-10 rounded-2xl overflow-hidden border border-white/15 max-h-96 relative bg-black/50">
                      <img src={item.attachments[0].url} alt="Announcement Attachment" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Reaction Buttons & Action Link */}
                  <div className="pt-4 border-t border-white/10 z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {['❤️', '🔥', '🚀', '🎮'].map((emoji) => {
                        const count = reactions[item.id]?.[emoji] ?? reactions['default'][emoji];
                        const isUserReacted = (userReacted[item.id] || []).includes(emoji);

                        return (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(item.id, emoji)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-90 ${
                              isUserReacted
                                ? 'bg-indigo-600/40 border border-[#5865f2] text-white shadow-[0_0_15px_rgba(88,101,242,0.6)] scale-105'
                                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white'
                            }`}
                          >
                            <span className="text-sm">{emoji}</span>
                            <span>{count}</span>
                          </button>
                        );
                      })}
                    </div>

                    <a
                      href={item.url || "https://discord.gg/aN5CCRT6CS"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-xs font-mono font-bold text-white px-5 py-2.5 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] transition-all shadow-[0_0_20px_rgba(88,101,242,0.4)] hover:scale-102"
                    >
                      <span>Open on Discord</span>
                      <span>↗</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-12 text-center text-zinc-400 text-sm font-mono">
              NO ANNOUNCEMENTS FOUND MATCHING YOUR SEARCH.
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
