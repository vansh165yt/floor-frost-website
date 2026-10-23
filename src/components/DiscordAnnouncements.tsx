'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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

export default function DiscordAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Interactive Reaction Counters (Cute community feedback)
  const [reactions, setReactions] = useState<{ [key: string]: { [emoji: string]: number } }>({
    default: { '❤️': 142, '🔥': 288, '🚀': 195, '🎮': 110 }
  });
  const [userReacted, setUserReacted] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`/api/discord-announcements?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.announcements && data.announcements.length > 0) {
            setAnnouncements(data.announcements);
            setIsLive(Boolean(data.isLive));
          }
        }
      } catch (e) {
        console.error("Failed to load Discord announcements:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      fetchAnnouncements();
    }, 60000);

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchAnnouncements();
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

  const primaryAnnouncement = announcements[0];
  const secondaryAnnouncements = announcements.slice(1, 4);

  return (
    <section id="announcements" className="relative py-24 px-6 sm:px-12 lg:px-20 bg-[#06030a] overflow-hidden border-t border-indigo-900/30 content-auto">
      
      {/* Dynamic Cosmic Ambient Glowing Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[48rem] h-[48rem] bg-indigo-600/15 rounded-full blur-[200px] pointer-events-none animate-ambient-breathe" />
      <div className="absolute top-1/3 right-10 w-[36rem] h-[36rem] bg-purple-600/15 rounded-full blur-[180px] pointer-events-none animate-ambient-breathe" style={{ animationDelay: '-3s' }} />

      <div className="max-w-7xl mx-auto flex flex-col gap-10 relative z-30">
        
        {/* Section Header */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 scroll-fade-up">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5865f2] animate-ping" />
              <span className="text-[#5865f2] font-mono text-xs font-bold tracking-widest uppercase bg-[#5865f2]/15 border border-[#5865f2]/40 px-3.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_15px_rgba(88,101,242,0.3)]">
                <span>💬</span>
                <span>{isLive ? 'LIVE DISCORD FEED' : 'DISCORD LEGION BROADCASTS'}</span>
              </span>
              <span className="text-xs font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>500+ ONLINE NOW</span>
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
              COMMUNITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 via-pink-400 to-rose-400 animate-text-shimmer">DISPATCH &amp; ALERTS</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl leading-relaxed">
              Real-time updates, video production schedules, shader drops, aur exclusive announcements seedhe Floor Frost Discord server se!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/announcements"
              className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 hover:border-purple-400 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            >
              <span>All Announcements</span>
              <span>→</span>
            </Link>

            <a
              href="https://discord.gg/aN5CCRT6CS"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#5865f2] to-[#7289da] hover:from-[#4752c4] hover:to-[#5865f2] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 shadow-[0_0_30px_rgba(88,101,242,0.6)] hover:scale-105 active:scale-95 border border-[#5865f2]/50"
            >
              <span>Join Discord Legion</span>
              <span className="text-base">💬</span>
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BALANCED 2-COLUMN COMMAND CENTER (ZERO EMPTY SPACE)          */}
        {/* ============================================================ */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            <div className="lg:col-span-7 rounded-3xl bg-white/[0.02] border border-white/10 p-8 animate-pulse h-96" />
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-6 animate-pulse h-44" />
              <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-6 animate-pulse h-48" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
            
            {/* ======================================================== */}
            {/* LEFT: FEATURED SPOTLIGHT ANNOUNCEMENT (HERO CARD)        */}
            {/* ======================================================== */}
            <div className="lg:col-span-7 flex flex-col">
              {primaryAnnouncement ? (
                <div className="group relative rounded-3xl bg-gradient-to-b from-[#140e2b]/95 via-[#0e081e]/95 to-[#070412]/95 border-2 border-indigo-500/40 hover:border-[#5865f2] p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-[0_15px_45px_rgba(88,101,242,0.2)] hover:shadow-[0_0_55px_rgba(88,101,242,0.45)] transition-all duration-500 hover-lift tilt-card shimmer-glass-card h-full">
                  <div className="tilt-glare" />
                  
                  {/* Glowing Corner Aura */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#5865f2]/20 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-115 transition-transform duration-700" />

                  {/* Header: Author & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 relative z-10">
                    <div className="flex items-center gap-3.5">
                      <div className="w-13 h-13 rounded-2xl overflow-hidden border-2 border-[#5865f2] relative shadow-[0_0_20px_rgba(88,101,242,0.5)] p-0.5 bg-black shrink-0">
                        <img
                          src={primaryAnnouncement.author.avatar || '/logo.png'}
                          alt={primaryAnnouncement.author.username}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-black text-white group-hover:text-indigo-200 transition-colors">
                            {primaryAnnouncement.author.username}
                          </h3>
                          <span className="px-2 py-0.5 rounded-md bg-[#5865f2] text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                            <span>🛡️</span>
                            <span>OFFICIAL</span>
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-indigo-300 flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Floor Frost Discord Legion</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <span>📌</span>
                        <span>PINNED</span>
                      </span>
                      <span className="text-xs font-mono text-zinc-300 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                        {primaryAnnouncement.publishedAt}
                      </span>
                    </div>
                  </div>

                  {/* Styled Message Body with Custom Discord Quote Box */}
                  <div className="relative z-10 flex flex-col gap-3 my-auto">
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#090514]/80 border-l-4 border-indigo-400/90 border-r border-t border-b border-white/5 backdrop-blur-sm shadow-inner">
                      <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-light whitespace-pre-line">
                        {primaryAnnouncement.content}
                      </p>
                    </div>

                    {/* Attachments if present */}
                    {primaryAnnouncement.attachments && primaryAnnouncement.attachments.length > 0 && (
                      <div className="rounded-2xl overflow-hidden border border-white/15 max-h-72 relative bg-black/60 shadow-lg">
                        <img
                          src={primaryAnnouncement.attachments[0].url}
                          alt="Announcement Attachment"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Interactive Reactions Bar & Footer Action */}
                  <div className="pt-4 border-t border-white/10 relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    
                    {/* Cute Interactive Emojis */}
                    <div className="flex flex-wrap items-center gap-2">
                      {['❤️', '🔥', '🚀', '🎮'].map((emoji) => {
                        const count = reactions[primaryAnnouncement.id]?.[emoji] ?? reactions['default'][emoji];
                        const isUserReacted = (userReacted[primaryAnnouncement.id] || []).includes(emoji);

                        return (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(primaryAnnouncement.id, emoji)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-90 ${
                              isUserReacted
                                ? 'bg-indigo-600/40 border border-[#5865f2] text-white shadow-[0_0_15px_rgba(88,101,242,0.6)] scale-105'
                                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white'
                            }`}
                            title={`React with ${emoji}`}
                          >
                            <span className="text-sm">{emoji}</span>
                            <span>{count}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Direct Jump to Discord */}
                    <a
                      href={primaryAnnouncement.url || "https://discord.gg/aN5CCRT6CS"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#5865f2]/20 hover:bg-[#5865f2] border border-[#5865f2]/40 text-[#5865f2] hover:text-white text-xs font-mono font-bold transition-all shadow-[0_0_20px_rgba(88,101,242,0.25)] hover:scale-102"
                    >
                      <span>Open on Discord</span>
                      <span>↗</span>
                    </a>
                  </div>

                </div>
              ) : null}
            </div>

            {/* ======================================================== */}
            {/* RIGHT: SERVER STATUS + COMMUNITY PERKS + RECENT DISPATCH */}
            {/* ======================================================== */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              
              {/* Card 1: Live Discord Legion Server Widget */}
              <div className="rounded-3xl bg-gradient-to-br from-[#120b24] via-[#0d071b] to-[#070412] border-2 border-indigo-500/30 p-6 flex flex-col gap-4 shadow-[0_10px_35px_rgba(88,101,242,0.15)] relative overflow-hidden group hover:border-[#5865f2] transition-colors shimmer-glass-card">
                <div className="tilt-glare" />
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#5865f2] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(88,101,242,0.6)]">
                      💬
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        Floor Frost Official Legion
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Discord Community Verified</span>
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/30 font-bold">
                    OFFICIAL
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-400 uppercase">ONLINE MEMBERS</span>
                    <span className="text-base font-bold text-emerald-300">500+ Active</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-400 uppercase">SERVER ACCESS</span>
                    <span className="text-base font-bold text-indigo-300">Open 24/7</span>
                  </div>
                </div>

                <a
                  href="https://discord.gg/aN5CCRT6CS"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white font-mono text-xs font-bold uppercase tracking-wider text-center transition-all shadow-[0_0_20px_rgba(88,101,242,0.5)] hover:scale-102 flex items-center justify-center gap-2"
                >
                  <span>Join Server Instantly</span>
                  <span>↗</span>
                </a>
              </div>

              {/* Card 2: Discord Server Member Perks (Cute & Engaging) */}
              <div className="rounded-3xl bg-gradient-to-br from-[#100922] via-[#090516] to-[#06030e] border-2 border-purple-500/30 p-6 flex flex-col gap-3.5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>DISCORD LEGION PERKS</span>
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-400">JOIN FREE</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-400/40 transition-colors">
                    <span className="text-lg p-2 rounded-xl bg-red-600/20 text-red-400">📢</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">Instant Video Drop Pings</span>
                      <span className="text-[10px] text-zinc-400">Sabse pehle nayi video ka notification pao</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-400/40 transition-colors">
                    <span className="text-lg p-2 rounded-xl bg-emerald-600/20 text-emerald-400">✨</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">Free Minecraft Shaders Links</span>
                      <span className="text-[10px] text-zinc-400">Direct download links aur installation guides</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-400/40 transition-colors">
                    <span className="text-lg p-2 rounded-xl bg-pink-600/20 text-pink-400">🏎️</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">Forza Track Nights &amp; Gaming</span>
                      <span className="text-[10px] text-zinc-400">Multiplayer gaming sessions and live voice rooms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Secondary Announcements Quick Preview if available */}
              {secondaryAnnouncements.length > 0 && (
                <div className="rounded-3xl bg-gradient-to-br from-[#120a24]/90 to-[#070412]/90 border border-white/10 p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>EARLIER BROADCAST</span>
                    <span>{secondaryAnnouncements[0].publishedAt}</span>
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {secondaryAnnouncements[0].content}
                  </p>
                  <Link
                    href="/announcements"
                    className="text-[11px] font-mono text-indigo-400 hover:text-white flex items-center justify-between pt-1 font-bold"
                  >
                    <span>Read Full Broadcast in Archive</span>
                    <span>→</span>
                  </Link>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
