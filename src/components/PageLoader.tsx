'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NextImage from 'next/image';

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING FROST REALM...');
  const [visible, setVisible] = useState(false);

  // Status phrases for loading state
  const statusPhrases = [
    'CONNECTING TO FROST NETWORK...',
    'SYNCHRONIZING GRAPHICS CORE...',
    'LOADING COMMUNITY HUB...',
    'POWERING UP ECOSYSTEM...',
    'WELCOME TO FLOOR FROST'
  ];

  const startLoadingAnimation = () => {
    setVisible(true);
    setLoading(true);
    setProgress(0);
    
    // Pick random or path-based status phrase
    const randomPhrase = statusPhrases[Math.floor(Math.random() * statusPhrases.length)];
    setStatusText(randomPhrase);
  };

  // Listen to global click events on internal links for instant trigger
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignore external links, mailto, tel, anchor hashes on same page
      if (
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        target.target === '_blank'
      ) {
        return;
      }

      // Check if navigating to a different page or query
      const currentUrl = window.location.pathname + window.location.search;
      if (href !== currentUrl) {
        startLoadingAnimation();
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // When pathname or searchParams change (Route transition complete)
  useEffect(() => {
    if (!loading && !visible) return;

    // Fast finish progress bar to 100%
    setProgress(100);

    const finishTimer = setTimeout(() => {
      setLoading(false);
      // Wait for fade out transition before unmounting visibility
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 400);
      return () => clearTimeout(hideTimer);
    }, 350);

    return () => clearTimeout(finishTimer);
  }, [pathname, searchParams]);

  // Smooth fake progress tick while loading
  useEffect(() => {
    if (!loading) return;

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 10;
      if (currentProgress >= 90) {
        currentProgress = 90;
        clearInterval(interval);
      }
      setProgress(currentProgress);
    }, 60);

    return () => clearInterval(interval);
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#07040d] transition-all duration-500 ease-out select-none ${
        loading ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
      }`}
    >
      {/* Ambient Cosmic Glowing Orbs Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-purple-600/25 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-[30rem] h-[30rem] bg-pink-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Cyber Grid Lines Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-md w-full">
        
        {/* Double Concentric Spinning Cyber Rings around Logo */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
          
          {/* Outer Glowing Cyber Ring 1 (Clockwise) */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-pink-500 border-b-cyan-400 animate-spin duration-1000 shadow-[0_0_25px_rgba(168,85,247,0.5)]" />
          
          {/* Outer Glowing Cyber Ring 2 (Counter Clockwise) */}
          <div 
            className="absolute inset-[-8px] rounded-full border border-dashed border-purple-400/40 opacity-75"
            style={{ animation: 'spin 3s linear infinite reverse' }}
          />

          {/* Pulsing Backlight Halo */}
          <div className="absolute inset-2 bg-gradient-to-tr from-purple-600/40 via-pink-600/40 to-cyan-500/40 rounded-full blur-md animate-pulse" />

          {/* Center Logo Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/80 shadow-2xl relative z-10 group">
            <NextImage
              src="/logo.png"
              alt="Floor Frost Loader Logo"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Glowing Orbiting Particle Dot */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ animation: 'spin 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
          >
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] -top-1.5 left-1/2 -translate-x-1/2 absolute" />
          </div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-center gap-2 w-full">
          <h2 className="text-2xl sm:text-3xl font-black tracking-widest uppercase bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            FLOOR FROST
          </h2>
          
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-purple-300/80 uppercase">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            <span>{statusText}</span>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full flex flex-col items-center gap-2">
          
          {/* Progress Bar Container */}
          <div className="w-full h-2 rounded-full bg-white/10 border border-white/10 overflow-hidden relative backdrop-blur-md shadow-inner">
            {/* Glowing Fill */}
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 rounded-full transition-all duration-200 ease-out relative shadow-[0_0_15px_rgba(236,72,153,0.8)]"
              style={{ width: `${progress}%` }}
            >
              {/* Laser Leading Light */}
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white shadow-[0_0_10px_#ffffff] rounded-full" />
            </div>
          </div>

          {/* Percentage Indicator */}
          <div className="flex justify-between w-full px-1 text-[11px] font-mono text-zinc-400">
            <span>SYSTEM_STATUS // ONLINE</span>
            <span className="text-cyan-300 font-bold tracking-widest">{progress}%</span>
          </div>
        </div>

        {/* Equalizer Audio Spectrum Animation */}
        <div className="flex items-end justify-center gap-1.5 h-6 pt-2">
          {[0.4, 0.7, 1.0, 0.5, 0.8, 0.3, 0.9].map((height, idx) => (
            <div
              key={idx}
              className="w-1 rounded-full bg-gradient-to-t from-purple-500 to-pink-400 animate-pulse"
              style={{
                height: `${height * 100}%`,
                animationDelay: `${idx * 0.12}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
