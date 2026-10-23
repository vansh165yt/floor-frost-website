'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const [subCount, setSubCount] = useState<string>('1,530');
  const [discordOnline, setDiscordOnline] = useState<number | null>(null);
  const [discordTotal, setDiscordTotal] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Fetch live subscribers
    const fetchSubscribers = async () => {
      try {
        const res = await fetch(`/api/subscribers?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.subscriberCount) {
            setSubCount(Number(data.subscriberCount).toLocaleString());
          }
        }
      } catch (err) {
        console.error('Footer subscriber fetch error:', err);
      }
    };

    // Fetch live Discord statistics
    const fetchDiscord = async () => {
      try {
        const res = await fetch(`/api/discord-stats?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.onlineCount === 'number') setDiscordOnline(data.onlineCount);
          if (typeof data.memberCount === 'number') setDiscordTotal(data.memberCount);
        }
      } catch (err) {
        console.error('Footer discord stats fetch error:', err);
      }
    };

    fetchSubscribers();
    fetchDiscord();
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyDiscord = async () => {
    try {
      await navigator.clipboard.writeText('https://discord.gg/aN5CCRT6CS');
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  return (
    <footer className="relative mt-20 sm:mt-28 border-t border-purple-500/20 bg-[#04010a]/95 backdrop-blur-2xl text-zinc-400 overflow-hidden z-20">
      {/* Radiant Top Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 via-purple-500/80 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 sm:w-1/2 h-8 bg-gradient-to-b from-cyan-500/10 to-transparent blur-xl pointer-events-none" />

      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 relative z-10">
        
        {/* TOP CALLOUT BANNER / LEGION CTA */}
        <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-12 sm:mb-16 border border-white/10 bg-gradient-to-br from-white/[0.04] via-purple-950/20 to-black/60 shadow-2xl backdrop-blur-md overflow-hidden group">
          {/* Subtle animated light trail inside banner */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-sky-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-700 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 text-center lg:text-left">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium tracking-wider uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                JOIN THE COMMUNITY EXPEDITION
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Ready to Level Up Your <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-400 bg-clip-text text-transparent">Gaming Visuals?</span>
              </h3>
              <p className="text-sm text-zinc-400 mt-2 font-normal leading-relaxed">
                Connect with {subCount} creators and gamers. Discover daily shader updates, custom presets, live discussions, and exclusive community events.
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 w-full sm:w-auto">
              <a
                href="https://youtube.com/@floorfrost?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="group/yt flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-900/30 hover:shadow-red-600/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-4 h-4 fill-current group-hover/yt:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>Subscribe ({subCount})</span>
              </a>

              <a
                href="https://discord.gg/aN5CCRT6CS"
                target="_blank"
                rel="noopener noreferrer"
                className="group/dc flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-950/40 hover:shadow-indigo-600/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-4 h-4 fill-current group-hover/dc:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Join Discord {discordOnline ? `(${discordOnline} Online)` : ''}</span>
              </a>

              <button
                type="button"
                onClick={handleCopyDiscord}
                className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-400/40 text-xs text-zinc-300 font-mono transition-all duration-200"
                title="Copy Discord Server Invite Link"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-emerald-400 font-semibold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Invite</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 4-COLUMN MAIN FOOTER CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-12 sm:pb-16 border-b border-white/[0.06]">
          
          {/* COLUMN 1: BRAND IDENTITY (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/?scroll=end" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-cyan-400/40 group-hover:border-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40">
                <NextImage src="/logo.png" alt="Floor Frost" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-wider group-hover:text-cyan-300 transition-colors">
                  FLOOR FROST
                </span>
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                  GAMING &amp; TECH ECOSYSTEM
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans max-w-sm">
              Official home of hyper-realistic Minecraft shaders, high-octane racing walkthroughs, mod configurations, and an unstoppable creator community.
            </p>

            {/* Server Operational Status Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono font-medium text-emerald-400 uppercase tracking-wider">
                All Systems Operational // v2.5
              </span>
            </div>

            {/* Social Icons row */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://youtube.com/@floorfrost"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-zinc-400 hover:text-red-400 flex items-center justify-center transition-all duration-200 hover:scale-105"
                title="Floor Frost YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              <a
                href="https://discord.gg/aN5CCRT6CS"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/40 text-zinc-400 hover:text-indigo-400 flex items-center justify-center transition-all duration-200 hover:scale-105"
                title="Floor Frost Discord"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* COLUMN 2: PORTALS & NAVIGATION (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-sm bg-cyan-400" />
              Navigation
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm">
              <li>
                <Link href="/?scroll=end" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-1">
                  <span>Home Showcase</span>
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-1">
                  <span>Video Archives</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">NEW</span>
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-1">
                  <span>Social Hub</span>
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-1">
                  <span>Announcements</span>
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-1">
                  <span>Web Projects</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CONTENT & SPECIALTIES (Span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-sm bg-purple-400" />
              Content Highlights
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm">
              <li>
                <Link href="/videos?category=shaders" className="hover:text-purple-300 transition-colors flex items-center gap-2 py-1">
                  <span className="text-purple-400">⚡</span>
                  <span>Ultra Realistic Shaders</span>
                </Link>
              </li>
              <li>
                <Link href="/videos?category=survival" className="hover:text-purple-300 transition-colors flex items-center gap-2 py-1">
                  <span className="text-purple-400">🎮</span>
                  <span>Minecraft Survival Series</span>
                </Link>
              </li>
              <li>
                <Link href="/videos?category=racing" className="hover:text-purple-300 transition-colors flex items-center gap-2 py-1">
                  <span className="text-purple-400">🏎️</span>
                  <span>Forza Horizon 5 Hindi</span>
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-purple-300 transition-colors flex items-center gap-2 py-1">
                  <span className="text-purple-400">💎</span>
                  <span>VIP Discord Roles &amp; Badges</span>
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-purple-300 transition-colors flex items-center gap-2 py-1">
                  <span className="text-purple-400">🛠️</span>
                  <span>Zero-Latency Performance</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: LIVE COMMUNITY PULSE CARD (Span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-3.5">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-sm bg-sky-400" />
              Live Ecosystem Pulse
            </h4>

            {/* YouTube Pulse Card */}
            <a
              href="https://youtube.com/@floorfrost"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-red-500/30 transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-red-400 transition-colors">YouTube Subscribers</div>
                  <div className="text-[11px] font-mono text-zinc-400">{subCount} Creators</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-red-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </a>

            {/* Discord Pulse Card */}
            <a
              href="https://discord.gg/aN5CCRT6CS"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-500/30 transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors">Discord Legion</div>
                  <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{discordOnline !== null ? `${discordOnline} Online` : 'Connected'}</span>
                    {discordTotal && <span className="text-zinc-500">/ {discordTotal} total</span>}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </a>

            <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 px-1">
              <span>LATENCY: &lt;1ms</span>
              <span>•</span>
              <span>REGION: GLOBAL EDGE</span>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & CONTROLS */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span>© {new Date().getFullYear()} FLOOR FROST. All rights reserved.</span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <span className="text-zinc-400 font-sans">Crafted for High Quality Gaming Content &amp; Visuals</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-zinc-600 hidden md:inline">
              TURBOPACK • NEXT.JS 16 • TAILWIND
            </span>

            {/* Back To Top Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-400/40 text-zinc-300 hover:text-cyan-300 text-[11px] font-mono transition-all duration-200 group"
              title="Return to top of page"
            >
              <span>BACK TO TOP</span>
              <svg className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
