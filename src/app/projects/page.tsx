'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';

export default function ProjectsPage() {
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

      {/* Main Glass Pill Header with 3 Parallel Lines Hamburger Menu */}
      <Header activePage="projects" />

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 relative z-10 flex flex-col gap-10">

        {/* Hero Section Banner */}
        <div className="relative rounded-2xl sm:rounded-[2.5rem] bg-white/[0.03] border border-white/20 backdrop-blur-2xl p-5 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex flex-col items-start gap-4 overflow-hidden group scroll-fade-up">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-purple-600/30 to-pink-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md">
              OFFICIAL ECOSYSTEM
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              1 LIVE WEB APP
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            FLOOR FROST <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-200">PROJECTS</span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Explore official web applications and interactive software built by <strong className="text-white font-medium">Floor Frost</strong>. Click on any project card below to launch the live web app directly.
          </p>
        </div>

        {/* Single Featured Project Card: Pingu AI (Direct Link to pingu.xo.je) */}
        <a
          href="https://pingu.xo.je"
          target="_blank"
          rel="noreferrer"
          className="rounded-[2.5rem] bg-gradient-to-b from-[#120b24]/95 to-[#0c0817]/95 border-2 border-purple-500/40 p-8 sm:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-[0_15px_50px_rgba(168,85,247,0.25)] relative overflow-hidden group hover:border-pink-400 hover:shadow-[0_0_65px_rgba(236,72,153,0.45)] hover-lift shimmer-hover transition-all duration-300 cursor-pointer tilt-card scroll-scale-in"
        >
          <div className="tilt-glare" />
          {/* Animated Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-600/20 via-pink-600/15 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col gap-5 max-w-xl z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                FEATURED AI APP
              </span>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                pingu.xo.je 🚀
              </span>
            </div>

            <div className="flex items-center gap-4 mt-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl relative group-hover:scale-110 animate-float transition-transform duration-300 shrink-0 bg-[#a5b4fc]">
                <NextImage
                  src="/pingu-logo.png"
                  alt="Pingu AI Official Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white group-hover:text-pink-300 transition-colors flex items-center gap-3">
                  <span>PINGU AI</span>
                  <span className="text-xl opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">↗</span>
                </h2>
                <p className="text-xs font-mono text-purple-300 uppercase tracking-widest">
                  NEXT-GEN AI LEARNING & STUDY ASSISTANT
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light mt-1">
              Pingu AI is a powerful, interactive AI-powered learning web app designed to help students master subjects, generate instant study guides, solve complex problems, and accelerate learning.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {['AI Tutor', 'Smart Notes', 'Quiz Generator', 'Concept Explainer', 'pingu.xo.je'].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-xs font-mono text-zinc-300 group-hover:border-purple-400/40 group-hover:bg-white/10 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="z-10 w-full md:w-auto shrink-0">
            <div className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 group-hover:from-pink-500 group-hover:to-purple-500 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_35px_rgba(219,39,119,0.6)] group-hover:scale-105 active:scale-95 transition-all duration-300 text-center border border-pink-400/50 flex items-center justify-center gap-2.5 magnetic-btn">
              <span>Launch pingu.xo.je</span>
              <span>🚀</span>
            </div>
          </div>
        </a>

        {/* BEAUTIFUL "MORE PROJECTS COMING SOON" SECTION */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-b from-white/[0.04] to-white/[0.01] border-2 border-dashed border-purple-500/30 p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center gap-6 overflow-hidden backdrop-blur-xl group hover:border-purple-400/60 transition-all duration-500 tilt-card scroll-fade-up">
          <div className="tilt-glare" />
          
          {/* Ambient Glow & Radial Pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-600/15 transition-all duration-700" />
          
          {/* Animated Futuristic Radar / Rocket Badge */}
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-purple-900/60 via-pink-900/50 to-indigo-900/60 border border-purple-400/30 shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">
              ⚡
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500"></span>
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 max-w-2xl">
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 border border-purple-400/30 text-purple-300 text-xs font-mono font-bold tracking-widest uppercase">
              NEXT IN LINE
            </span>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              WE ARE WORKING ON <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300">MORE PROJECTS</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light mt-1">
              Those projects are coming soon! We are actively designing and building new web tools, gaming platforms, and interactive AI applications for the Floor Frost community.
            </p>
          </div>

          {/* Preview Badges / Teasers of upcoming projects */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-4 max-w-3xl">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center gap-2 group-hover:border-purple-500/30 transition-colors">
              <span className="text-2xl">🎮</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Gaming Tools Suite</span>
              <span className="text-[10px] font-mono text-purple-400 uppercase">In Development</span>
            </div>
            
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center gap-2 group-hover:border-purple-500/30 transition-colors">
              <span className="text-2xl">🌐</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Frost Community Hub</span>
              <span className="text-[10px] font-mono text-pink-400 uppercase">Coming Soon</span>
            </div>
            
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center gap-2 group-hover:border-purple-500/30 transition-colors">
              <span className="text-2xl">🤖</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">AI Walkthrough Bot</span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase">Planning Phase</span>
            </div>
          </div>

          {/* Stay Tuned Badge */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-zinc-300 uppercase tracking-widest backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>STAY TUNED FOR FUTURE RELEASES 🔥</span>
            </div>
          </div>

        </div>

        {/* Footer Signature */}
        <div className="text-center pt-4 text-xs font-mono tracking-widest text-zinc-500 uppercase">
          FLOOR FROST PROJECTS & ECOSYSTEM
        </div>

      </div>
    </div>
  );
}
