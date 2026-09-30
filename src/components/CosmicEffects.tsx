'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CosmicEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Mouse Tracking for Interactive Ambient Spotlight Glow
  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      setIsPointerDevice(true);
    }

    let rafId: number;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      targetX = -1000;
      targetY = -1000;
    };

    const animateGlow = () => {
      // Smooth lerp interpolation for silky cursor glide
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      setMousePos({ x: Math.round(currentX), y: Math.round(currentY) });
      rafId = requestAnimationFrame(animateGlow);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(animateGlow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 2. Scroll Progress & Back to Top Visibility
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setShowBackToTop(window.scrollY > 450);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Subtle Twinkling Cosmic Micro-Stars Particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool
    const particleCount = Math.min(45, Math.floor(window.innerWidth / 30));
    const colors = [
      'rgba(168, 85, 247, ',  // Purple
      'rgba(236, 72, 153, ',  // Pink
      'rgba(192, 132, 252, ', // Lavender
      'rgba(255, 255, 255, '  // Ice white
    ];

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      alpha: number;
      baseAlpha: number;
      twinkleSpeed: number;
      speedX: number;
      speedY: number;
    }

    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      const baseAlpha = 0.15 + Math.random() * 0.45;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.8 + Math.random() * 1.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: baseAlpha,
        baseAlpha: baseAlpha,
        twinkleSpeed: 0.015 + Math.random() * 0.03,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -0.15 - Math.random() * 0.25
      };
    });

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Soft twinkle sinusoidal wave
        p.alpha = p.baseAlpha + Math.sin(tick * p.twinkleSpeed + i) * 0.2;
        p.alpha = Math.max(0.05, Math.min(0.8, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = `${p.color}0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Ultra-Sleek Top Scroll Progress Neon Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(236,72,153,0.9),0_0_4px_rgba(168,85,247,0.7)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Interactive Ambient Cursor Spotlight (Desktop only, pointer-events-none) */}
      {isPointerDevice && mousePos.x >= 0 && (
        <div
          className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-500 ease-out"
          style={{
            background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.08), rgba(236, 72, 153, 0.03) 40%, transparent 80%)`,
          }}
        />
      )}

      {/* 3. Subtle Twinkling Cosmic Micro-Stars Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-75"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* 4. Floating Back to Top Glass Orb Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to Top"
          title="Back to Top"
          className="fixed bottom-6 right-6 z-50 p-3 sm:p-3.5 rounded-full bg-[#120a24]/85 border-2 border-purple-500/50 hover:border-pink-400 text-white shadow-[0_0_30px_rgba(168,85,247,0.4),0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-xl hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer animate-portal-fade flex items-center justify-center"
        >
          <div className="relative flex items-center justify-center">
            {/* Ambient Aura Ring */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />
            
            {/* Arrow Up SVG */}
            <svg
              className="w-5 h-5 relative z-10 fill-none stroke-current stroke-[2.5] text-purple-200 group-hover:text-white group-hover:-translate-y-0.5 transition-transform"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </button>
      )}
    </>
  );
}
