'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

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
        }
      } catch (e) {
        console.error("Failed to load all announcements:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAnnouncements();
    const interval = setInterval(fetchAllAnnouncements, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#07040d] text-white font-sans selection:bg-purple-500/30 pb-24 relative overflow-hidden animate-portal-fade">
      
      {/* Ambient Cosmic Dark Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] bg-purple-900/25 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[45rem] h-[45rem] bg-pink-900/20 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 left-[-10%] w-[50rem] h-[50rem] bg-indigo-950/35 rounded-full blur-[220px] pointer-events-none" />

      {/* Subtle Background Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Main Glass Navigation Header with 3 Parallel Lines Hamburger Menu */}
      <Header activePage="announcements" />

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 relative z-10 flex flex-col gap-10">

        {/* Hero Section Banner */}
        <div className="relative rounded-2xl sm:rounded-[2.5rem] bg-white/[0.03] border border-white/20 backdrop-blur-2xl p-5 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex flex-col items-start gap-4 overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-indigo-600/30 to-purple-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-[#5865f2]/20 border border-[#5865f2]/40 text-indigo-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md">
              COMMUNITY BROADCASTS
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              {announcements.length} ANNOUNCEMENTS
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            FLOOR FROST <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">ANNOUNCEMENTS</span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Stay updated with all official announcements, live stream alerts, Minecraft shader guides, and community broadcasts posted directly in the Floor Frost Discord server.
          </p>

          <div className="pt-2">
            <a
              href="https://discord.gg/aN5CCRT6CS"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(88,101,242,0.5)]"
            >
              <span>Join Official Discord Server</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* ALL DISCORD ANNOUNCEMENTS FEED LIST */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
              <span>ALL DISCORD ANNOUNCEMENTS</span>
              {isLive && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono">
                  LIVE SYNC
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            // Skeleton Loading State
            <div className="flex flex-col gap-6 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl bg-white/[0.03] border border-white/10 p-8 animate-pulse h-48 flex flex-col justify-between" />
              ))}
            </div>
          ) : announcements.length > 0 ? (
            <div className="flex flex-col gap-6 w-full">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-3xl bg-gradient-to-b from-[#0f0b1f]/95 to-[#080512]/95 border-2 border-indigo-500/30 p-8 flex flex-col gap-6 shadow-[0_10px_35px_rgba(88,101,242,0.15)] hover:border-[#5865f2] hover:shadow-[0_0_55px_rgba(88,101,242,0.4)] hover-lift transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#5865f2]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#5865f2]/20 transition-colors" />

                  {/* Author Header Info */}
                  <div className="flex justify-between items-center z-10 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#5865f2] relative shadow-md">
                        <img src={item.author.avatar} alt={item.author.username} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {item.author.username}
                        </h3>
                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                          Floor Frost Discord Announcement
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-zinc-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
                      {item.publishedAt}
                    </span>
                  </div>

                  {/* Announcement Full Text Content */}
                  <div className="z-10 text-base text-zinc-200 leading-relaxed font-light whitespace-pre-line">
                    {item.content}
                  </div>

                  {/* Attachments / Images if present */}
                  {item.attachments && item.attachments.length > 0 && (
                    <div className="z-10 rounded-2xl overflow-hidden border border-white/15 max-h-96 relative">
                      <img src={item.attachments[0].url} alt="Announcement Attachment" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Direct Discord Action Button */}
                  <div className="pt-4 border-t border-white/10 z-10 flex justify-between items-center">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                      DISCORD ANNOUNCEMENTS CHANNEL
                    </span>
                    <a
                      href={item.url || "https://discord.gg/aN5CCRT6CS"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#5865f2] hover:text-indigo-300 transition-colors px-4 py-2 rounded-full bg-[#5865f2]/10 border border-[#5865f2]/30 hover:bg-[#5865f2]/20"
                    >
                      <span>View Announcement on Discord</span>
                      <span>↗</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-12 text-center text-zinc-400 text-sm font-mono">
              NO ANNOUNCEMENTS FOUND. JOIN OUR DISCORD SERVER TO POST THE FIRST ANNOUNCEMENT!
            </div>
          )}
        </div>

        {/* Footer Signature */}
        <div className="text-center pt-4 text-xs font-mono tracking-widest text-zinc-500 uppercase">
          FLOOR FROST ANNOUNCEMENTS & ECOSYSTEM
        </div>

      </div>
    </div>
  );
}
