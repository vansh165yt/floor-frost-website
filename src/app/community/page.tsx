'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';

export default function CommunityPage() {
  // Live YouTube Subscribers State
  const [subStats, setSubStats] = useState({
    subscriberCount: "1,490",
    viewCount: "521K",
    videoCount: "92"
  });

  // Fetch Live Subscribers every 15s
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch('/api/subscribers');
        if (res.ok) {
          const data = await res.json();
          if (data.subscriberCount) {
            const count = Number(data.subscriberCount);
            const views = Number(data.viewCount);
            setSubStats({
              subscriberCount: count.toLocaleString(),
              viewCount: views >= 1000000 
                ? (views / 1000000).toFixed(1) + "M" 
                : (views / 1000).toFixed(0) + "K",
              videoCount: data.videoCount
            });
          }
        }
      } catch (e) {
        console.error("Subscribers fetch error:", e);
      }
    };

    fetchSubscribers();
    const interval = setInterval(fetchSubscribers, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#07040d] text-slate-800 font-sans selection:bg-purple-500/30 relative overflow-hidden flex flex-col justify-between items-center animate-portal-fade">
      
      {/* Ambient Cosmic Dark Glow Orbs matching Main Page */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[45rem] h-[45rem] bg-purple-900/20 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="absolute top-[35%] right-[-10%] w-[40rem] h-[40rem] bg-pink-900/15 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-[-10%] w-[45rem] h-[45rem] bg-indigo-950/30 rounded-full blur-[200px] pointer-events-none z-0" />

      {/* Glass Pill Navigation Header with 3 Parallel Lines Hamburger Menu */}
      <Header activePage="community" />

      {/* Main Centered White Card Container */}
      <main className="grow max-w-lg mx-auto px-4 sm:px-6 pt-16 pb-12 w-full flex flex-col items-center justify-center relative z-10">
        
        {/* Solid White Card */}
        <div className="relative w-full rounded-[2rem] bg-white/95 backdrop-blur-md p-8 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.6)] flex flex-col items-center text-center gap-6 mt-10">
          
          {/* Top Circular Protruding Avatar */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#6b117b] to-[#b01e68] p-1 shadow-[0_0_35px_rgba(168,85,247,0.7)] z-20 hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-white">
              <NextImage 
                src="/logo.png" 
                alt="Floor Frost Avatar" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          {/* Creator Name, Title & Location */}
          <div className="flex flex-col items-center gap-1 mt-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#6b117b] tracking-tight font-sans">
              Floor Frost
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              YouTube Gaming Creator & Pro Walkthroughs
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mt-0.5">
              <span>📍</span>
              <span>Official YouTube & Discord Legion</span>
            </div>
          </div>

          {/* 4 Statistics Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full py-4 border-t border-b border-slate-100">
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-bold text-slate-800">{subStats.subscriberCount}</span>
              <span className="text-[11px] text-slate-400 font-medium">Subscribers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-bold text-slate-800">{subStats.viewCount}</span>
              <span className="text-[11px] text-slate-400 font-medium">Total Views</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-bold text-slate-800">{subStats.videoCount}</span>
              <span className="text-[11px] text-slate-400 font-medium">Videos</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-bold text-slate-800">100%</span>
              <span className="text-[11px] text-slate-400 font-medium">Gaming</span>
            </div>
          </div>

          {/* ONLY YouTube & Discord Circular Social Icons */}
          <div className="flex items-center justify-center gap-6 py-2">
            
            {/* 1. YouTube Official Icon */}
            <a
              href="https://youtube.com/@floorfrost"
              target="_blank"
              rel="noreferrer"
              title="YouTube Channel"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#ff0000] text-white flex items-center justify-center text-xl shadow-[0_8px_25px_rgba(255,0,0,0.4)] hover:shadow-[0_0_35px_rgba(255,0,0,0.7)] hover:scale-110 active:scale-95 transition-all duration-300"
            >
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            {/* 2. Discord Official Icon */}
            <a
              href="https://discord.gg/aN5CCRT6CS"
              target="_blank"
              rel="noreferrer"
              title="Discord Legion"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#5865f2] text-white flex items-center justify-center text-xl shadow-[0_8px_25px_rgba(88,101,242,0.4)] hover:shadow-[0_0_35px_rgba(88,101,242,0.7)] hover:scale-110 active:scale-95 transition-all duration-300"
            >
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>

          </div>

        </div>

      </main>

      {/* Footer Signature */}
      <footer className="py-4 text-center text-xs text-white/70 font-sans relative z-10">
        © {new Date().getFullYear()} FLOOR FROST SOCIAL CREATOR HUB
      </footer>
    </div>
  );
}
