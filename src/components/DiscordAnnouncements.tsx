'use client';

import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
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
    const interval = setInterval(fetchAnnouncements, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 px-6 sm:px-12 lg:px-20 bg-[#06030a] overflow-hidden border-t border-indigo-900/30">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-600/15 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-10 relative z-10">
        
        {/* Section Header */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5865f2] animate-ping" />
              <span className="text-[#5865f2] font-mono text-xs font-bold tracking-widest uppercase bg-[#5865f2]/15 border border-[#5865f2]/30 px-3.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5">
                💬 {isLive ? 'LIVE DISCORD FEED' : 'DISCORD LEGION ANNOUNCEMENTS'}
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
              COMMUNITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">NEWS & UPDATES</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/announcements"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 hover:border-indigo-400 hover:shadow-[0_0_20px_rgba(88,101,242,0.3)] shrink-0"
            >
              <span>View All Announcements</span>
              <span>→</span>
            </Link>

            <a
              href="https://discord.gg/aN5CCRT6CS"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 shadow-[0_0_25px_rgba(88,101,242,0.5)] shrink-0 hover:scale-105 active:scale-95"
            >
              <span>Join Discord Server</span>
              <span className="text-base">💬</span>
            </a>
          </div>
        </div>

        {/* Announcements List Container (Max 3 Latest Announcements) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {loading ? (
            // Skeleton Loader
            [1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl bg-white/[0.03] border border-white/10 p-6 animate-pulse h-56 flex flex-col justify-between" />
            ))
          ) : announcements.length > 0 ? (
            announcements.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl bg-gradient-to-b from-[#0f0b1f] to-[#080512] border-2 border-indigo-500/30 p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-[0_8px_30px_rgba(88,101,242,0.15)] hover:border-[#5865f2] hover:shadow-[0_0_45px_rgba(88,101,242,0.4)] hover-lift transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#5865f2]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#5865f2]/20 transition-colors" />

                {/* Author Info & Date */}
                <div className="flex justify-between items-center z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#5865f2] relative shadow-md">
                      <img src={item.author.avatar} alt={item.author.username} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {item.author.username}
                      </h4>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                        Official Announcement
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    {item.publishedAt}
                  </span>
                </div>

                {/* Message Content */}
                <div className="z-10 text-sm sm:text-base text-zinc-200 leading-relaxed font-light whitespace-pre-line">
                  {item.content}
                </div>

                {/* Attachments if any */}
                {item.attachments && item.attachments.length > 0 && (
                  <div className="z-10 rounded-2xl overflow-hidden border border-white/15 max-h-60 relative">
                    <img src={item.attachments[0].url} alt="Announcement Attachment" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Action Link */}
                <div className="pt-4 border-t border-white/10 z-10 flex justify-between items-center">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                    FROST DISCORD SERVER
                  </span>
                  <a
                    href={item.url || "https://discord.gg/aN5CCRT6CS"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#5865f2] hover:text-indigo-300 transition-colors"
                  >
                    <span>View on Discord</span>
                    <span>→</span>
                  </a>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full p-8 text-center text-zinc-400 text-sm font-mono">
              NO ANNOUNCEMENTS YET. JOIN OUR DISCORD TO BE THE FIRST TO KNOW!
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
