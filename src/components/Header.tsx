'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  opacity?: number;
  translateY?: number;
  pointerEvents?: 'auto' | 'none';
  activePage?: 'home' | 'projects' | 'community' | 'announcements' | 'videos';
}

export default function Header({
  opacity = 1,
  translateY = 0,
  pointerEvents = 'auto',
  activePage
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subStats, setSubStats] = useState({
    subscriberCount: "1,530"
  });

  // Fetch Live Subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch(`/api/subscribers?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.subscriberCount) {
            const count = Number(data.subscriberCount);
            setSubStats({
              subscriberCount: count.toLocaleString()
            });
          }
        }
      } catch (e) {
        console.error("Header subscriber fetch error:", e);
      }
    };

    fetchSubscribers();
    const interval = setInterval(fetchSubscribers, 15000);

    const handleFocus = () => fetchSubscribers();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Close menu on pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navPages = [
    {
      name: 'Home Page',
      href: '/?scroll=end',
      key: 'home',
      desc: 'Official Homepage & 3D Interactive Showcase'
    },
    {
      name: 'Projects',
      href: '/projects',
      key: 'projects',
      desc: 'Floor Frost Web Apps & Ecosystem'
    },
    {
      name: 'Social Hub',
      href: '/community',
      key: 'community',
      desc: 'YouTube Channel & Discord Legion'
    },
    {
      name: 'Announcements',
      href: '/announcements',
      key: 'announcements',
      desc: 'All Official Discord Community Announcements & News'
    },
    {
      name: 'Videos Gallery',
      href: '/videos',
      key: 'videos',
      desc: 'Watch All Official YouTube Videos & Shader Guides'
    }
  ];

  return (
    <div
      className="sticky top-2 sm:top-6 z-50 w-[95%] sm:w-[92%] md:w-full max-w-5xl mx-auto my-2 sm:my-4 transition-all duration-150 ease-out relative"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents
      }}
    >
      {/* Main Glass Navigation Bar */}
      <header className="w-full px-3.5 sm:px-7 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 rounded-full bg-black/60 border border-white/20 backdrop-blur-xl shadow-2xl text-white relative z-20">
        
        {/* Brand Logo & Title */}
        <Link href="/?scroll=end" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-purple-400 shadow-md relative shrink-0">
            <NextImage src="/logo.png" alt="Floor Frost Logo" fill className="object-cover" />
          </div>
          <span className="font-black tracking-wider text-xs sm:text-sm uppercase text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
            FLOOR FROST
          </span>
        </Link>

        {/* Main Header Navigation Links (Desktop/Tablet Only - Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs sm:text-sm font-medium text-white/90">
          {activePage !== 'home' && (
            <Link href="/?scroll=end" className="px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-purple-300 transition-all duration-200 drop-shadow magnetic-btn">
              Home
            </Link>
          )}
          {activePage !== 'projects' && (
            <Link href="/projects" className="px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-purple-300 transition-all duration-200 drop-shadow magnetic-btn">
              Projects
            </Link>
          )}
          {activePage !== 'community' && (
            <Link href="/community" className="px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-purple-300 transition-all duration-200 drop-shadow magnetic-btn">
              Social
            </Link>
          )}
          {activePage !== 'announcements' && (
            <Link href="/announcements" className="px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-purple-300 transition-all duration-200 drop-shadow magnetic-btn">
              Announcements
            </Link>
          )}
          {activePage !== 'videos' && (
            <Link href="/videos" className="px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-purple-300 transition-all duration-200 drop-shadow magnetic-btn">
              Videos
            </Link>
          )}
        </nav>

        {/* Right Section: Subs Badge + 3 Parallel Lines Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Live Subscriber Badge - Compact on Mobile */}
          <a
            href="https://youtube.com/@floorfrost"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-red-600 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:scale-105 active:scale-95 transition-all text-white shadow-md flex items-center gap-1.5 shrink-0 whitespace-nowrap magnetic-btn"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-ping" />
            <span>{subStats.subscriberCount} Subs</span>
          </a>

          {/* 3 Parallel Lines Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation Menu"
            title="Navigation Menu"
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 border backdrop-blur-md flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 ${
              menuOpen
                ? 'bg-purple-600 text-white border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.7)] rotate-90'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'
            }`}
          >
            {menuOpen ? (
              // Close Icon (X)
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            ) : (
              // 3 Parallel Lines Icon (Hamburger)
              <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
                <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
                <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
              </svg>
            )}
          </button>

        </div>
      </header>

      {/* DROPDOWN MENU BOX SLIDING DOWN VISIBLY FROM MAIN HEADER */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 sm:mt-3 p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0c0719]/98 border-2 border-purple-500/40 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(168,85,247,0.25)] flex flex-col gap-3 sm:gap-4 text-white z-50 animate-slide-down max-h-[80vh] overflow-y-auto">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/10 px-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              PAGES DIRECTORY // FLOOR FROST
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">SELECT PAGE</span>
          </div>

          {/* VERTICAL SINGLE-COLUMN LIST OF OTHER PAGES (EXCLUDES CURRENT ACTIVE PAGE) */}
          <div className="flex flex-col gap-2.5 w-full">
            {navPages
              .filter((page) => page.key !== activePage)
              .map((page) => (
                <Link
                  key={page.key}
                  href={page.href}
                  onClick={() => setMenuOpen(false)}
                  className="p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-200 flex flex-col gap-1 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-bold uppercase text-white group-hover:text-purple-300 group-hover:translate-x-1 transition-all">
                      {page.name}
                    </h3>
                    <span className="text-xs text-purple-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                      →
                    </span>
                  </div>
                  <p className="text-xs font-light text-zinc-300 leading-snug">
                    {page.desc}
                  </p>
                </Link>
              ))}

            {/* Featured App Item (Pingu AI App - No Emojis) */}
            <a
              href="https://pingu.xo.je"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
              className="p-3.5 sm:p-4 rounded-2xl border border-pink-500/40 bg-pink-950/20 hover:border-pink-400 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all flex flex-col gap-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold uppercase text-white group-hover:text-pink-300 group-hover:translate-x-1 transition-all flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md overflow-hidden relative border border-white/20 shrink-0 bg-[#a5b4fc]">
                    <NextImage src="/pingu-logo.png" alt="Pingu AI" fill className="object-cover" />
                  </div>
                  <span>Pingu AI App</span>
                  <span className="text-xs">↗</span>
                </h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 uppercase">
                  LIVE APP
                </span>
              </div>
              <p className="text-xs font-light text-zinc-300 leading-snug">
                Smart interactive AI learning & study assistant (pingu.xo.je)
              </p>
            </a>
          </div>

          {/* Bottom Quick Links Bar */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 px-1">
            <span className="text-[11px] font-mono text-zinc-400">
              OFFICIAL FLOOR FROST NETWORK
            </span>

            <div className="flex items-center gap-3">
              <a
                href="https://youtube.com/@floorfrost"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <span>YouTube Channel ↗</span>
              </a>
              <a
                href="https://discord.gg/aN5CCRT6CS"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-full bg-[#5865f2]/80 hover:bg-[#5865f2] text-white text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <span>Discord Legion ↗</span>
              </a>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
