'use client';

import React, { useState, useEffect, useRef } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';

// High-Tech Slot/Roll-up Number Counter with Finish Flash
function AnimatedCounter({ 
  value, 
  duration = 1400, 
  suffix = "" 
}: { 
  value: string | number; 
  duration?: number; 
  suffix?: string;
}) {
  const numericTarget = typeof value === 'number' 
    ? value 
    : parseInt(String(value).replace(/[^0-9]/g, '')) || 0;

  const [displayValue, setDisplayValue] = useState(numericTarget);
  const [isFinished, setIsFinished] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const startRoll = () => {
      if (hasStartedRef.current) {
        setDisplayValue(numericTarget);
        return;
      }
      hasStartedRef.current = true;
      const startTime = performance.now();

      const update = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeOut = 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(easeOut * numericTarget);
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          setDisplayValue(numericTarget);
          setIsFinished(true);
        }
      };

      setDisplayValue(0);
      requestAnimationFrame(update);
    };

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          startRoll();
          observer.disconnect();
        }
      }, { threshold: 0.05 });

      observer.observe(el);
      const fallbackTimer = setTimeout(() => {
        if (!hasStartedRef.current) startRoll();
      }, 250);

      return () => {
        observer.disconnect();
        clearTimeout(fallbackTimer);
      };
    } else {
      startRoll();
    }
  }, [numericTarget, duration]);

  useEffect(() => {
    if (hasStartedRef.current) {
      setDisplayValue(numericTarget);
    }
  }, [numericTarget]);

  return (
    <span 
      ref={elementRef} 
      className={`inline-block font-mono tracking-tight transition-transform duration-300 ${
        isFinished ? 'animate-counter-finish' : ''
      }`}
    >
      {(displayValue || numericTarget).toLocaleString()}{suffix}
    </span>
  );
}

export default function CommunityPage() {
  // Live YouTube Subscribers State
  const [subStats, setSubStats] = useState({
    subscriberCount: "1,520",
    viewCount: "534K",
    videoCount: "95"
  });

  // Fetch Live Subscribers every 15s
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch(`/api/subscribers?t=${Date.now()}`, { cache: 'no-store' });
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
    <div className="min-h-screen bg-[#07040d] text-white font-sans selection:bg-purple-500/30 relative overflow-hidden flex flex-col justify-between items-center animate-portal-fade">
      
      {/* Ambient Cosmic Dark Glow Orbs matching Main Page */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[45rem] h-[45rem] bg-purple-900/20 rounded-full blur-[180px] pointer-events-none z-0 animate-pulse" />
      <div className="absolute top-[35%] right-[-10%] w-[40rem] h-[40rem] bg-pink-900/15 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-[-10%] w-[45rem] h-[45rem] bg-indigo-950/30 rounded-full blur-[200px] pointer-events-none z-0" />

      {/* Glass Pill Navigation Header with 3 Parallel Lines Hamburger Menu */}
      <Header activePage="community" />

      {/* Main Centered Social Hub Card Container */}
      <main className="grow max-w-lg mx-auto px-4 sm:px-6 pt-16 pb-12 w-full flex flex-col items-center justify-center relative z-10">
        
        {/* Obsidian Glass Card with Laser Border Beam */}
        <div className="relative w-full rounded-[2rem] bg-white/[0.04] border border-white/20 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(168,85,247,0.15)] flex flex-col items-center text-center gap-6 mt-12 tilt-card scroll-scale-in border-beam-card">
          <div className="tilt-glare" />
          
          {/* Top Circular Protruding Avatar with Concentric Cyber Rings */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center z-20">
            {/* Outer Spinning Glow Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-pink-500 border-b-cyan-400 animate-spin duration-1000 shadow-[0_0_25px_rgba(168,85,247,0.5)]" />
            <div 
              className="absolute -inset-2 rounded-full border border-dashed border-purple-400/40 opacity-70" 
              style={{ animation: 'spin 4s linear infinite reverse' }} 
            />
            
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#6b117b] to-[#b01e68] p-1 shadow-[0_0_35px_rgba(168,85,247,0.7)] hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-white">
                <NextImage 
                  src="/logo.png" 
                  alt="Floor Frost Avatar" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* Orbiting Cyber Particle */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none" 
              style={{ animation: 'spin 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
            >
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] -top-1.5 left-1/2 -translate-x-1/2 absolute" />
            </div>
          </div>

          {/* Creator Name, Title & Live Status */}
          <div className="flex flex-col items-center gap-1.5 mt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-[11px] font-mono text-purple-200 uppercase tracking-widest backdrop-blur-md mb-1 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              <span>OFFICIAL SOCIAL ECOSYSTEM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase animate-chromatic-shimmer">
              Floor Frost
            </h1>
            <p className="text-xs sm:text-sm font-medium text-zinc-300/90">
              YouTube Gaming Creator & Pro Walkthroughs
            </p>
            <div className="flex items-center gap-1.5 text-xs text-purple-300/80 font-mono mt-0.5">
              <span>📍</span>
              <span>Official YouTube & Discord Legion</span>
            </div>
          </div>

          {/* 4 Statistics Grid with Roll-Up Counter Animation */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full py-5 border-y border-white/10 my-1 bg-white/[0.03] rounded-2xl backdrop-blur-md">
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-black text-white font-mono drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                <AnimatedCounter value={subStats.subscriberCount} />
              </span>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium mt-0.5">Subscribers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-black text-pink-300 font-mono drop-shadow-[0_0_12px_rgba(244,114,182,0.4)]">
                <AnimatedCounter value={subStats.viewCount} suffix={subStats.viewCount.includes('M') ? 'M' : 'K'} />
              </span>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium mt-0.5">Total Views</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-black text-cyan-300 font-mono drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                <AnimatedCounter value={subStats.videoCount} />
              </span>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium mt-0.5">Videos</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-black text-lime-400 font-mono drop-shadow-[0_0_12px_rgba(163,230,53,0.4)]">
                <AnimatedCounter value={100} suffix="%" />
              </span>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium mt-0.5">Gaming</span>
            </div>
          </div>

          {/* High-Energy YouTube & Discord Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-1">
            
            {/* 1. YouTube Official Button */}
            <a
              href="https://youtube.com/@floorfrost"
              target="_blank"
              rel="noreferrer"
              title="Visit Official YouTube Channel"
              className="w-full sm:w-auto grow py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-pink-600 text-white flex items-center justify-center gap-3 text-sm font-bold shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:shadow-[0_0_40px_rgba(239,68,68,0.8)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-red-400/50 magnetic-btn group"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-xs uppercase tracking-wider font-mono opacity-80">SUBSCRIBE</span>
                <span className="block text-sm font-bold font-sans">YouTube Channel ↗</span>
              </div>
            </a>

            {/* 2. Discord Official Button */}
            <a
              href="https://discord.gg/aN5CCRT6CS"
              target="_blank"
              rel="noreferrer"
              title="Join Floor Frost Discord Legion"
              className="w-full sm:w-auto grow py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center gap-3 text-sm font-bold shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_rgba(99,102,241,0.8)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-indigo-400/50 magnetic-btn group"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-xs uppercase tracking-wider font-mono opacity-80">CONNECT</span>
                <span className="block text-sm font-bold font-sans">Discord Legion ↗</span>
              </div>
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
