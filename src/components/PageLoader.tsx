'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLoadingAnimation = () => {
    setVisible(true);
    setLoading(true);
    setProgress(20);

    // Hard failsafe: Never stay loading longer than 800ms
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    safetyTimeoutRef.current = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setVisible(false), 200);
      }, 100);
    }, 800);
  };

  // Listen to global click events on internal links for snappy feedback
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

    setProgress(100);

    const finishTimer = setTimeout(() => {
      setLoading(false);
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 250);
      return () => clearTimeout(hideTimer);
    }, 150);

    return () => clearTimeout(finishTimer);
  }, [pathname, searchParams]);

  // Smooth fake progress tick while loading
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[999999] h-[3px] pointer-events-none overflow-hidden select-none"
    >
      {/* Top glowing laser line */}
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-200 ease-out relative shadow-[0_0_12px_rgba(34,211,238,0.9),0_0_20px_rgba(168,85,247,0.7)]"
        style={{
          width: `${progress}%`,
          opacity: loading ? 1 : 0,
          transition: progress === 100 ? 'width 150ms ease-out, opacity 250ms ease-out' : 'width 200ms ease-out'
        }}
      >
        {/* Leading bright light point */}
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/80 blur-[2px] shadow-[0_0_8px_#ffffff]" />
      </div>
    </div>
  );
}
