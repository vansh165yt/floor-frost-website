'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CosmicEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Mouse Tracking for Interactive Ambient Spotlight Glow (Idle-Aware, Direct Ref)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(pointer: fine)').matches) {
      setIsPointerDevice(true);
    }

    let rafId: number | null = null;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isMoving = false;

    const animateGlow = () => {
      // Smooth lerp
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      if (spotlightRef.current) {
        if (currentX < 0) {
          spotlightRef.current.style.opacity = '0';
        } else {
          spotlightRef.current.style.opacity = '1';
          spotlightRef.current.style.background = `radial-gradient(550px circle at ${Math.round(currentX)}px ${Math.round(currentY)}px, rgba(168, 85, 247, 0.08), rgba(236, 72, 153, 0.03) 40%, transparent 80%)`;
        }
      }

      // If close enough to target, idle RAF to conserve 100% CPU when mouse is stationary
      if (Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
        rafId = requestAnimationFrame(animateGlow);
      } else {
        isMoving = false;
        rafId = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isMoving) {
        isMoving = true;
        if (!rafId) {
          rafId = requestAnimationFrame(animateGlow);
        }
      }
    };

    const handleMouseLeave = () => {
      targetX = -1000;
      targetY = -1000;
      if (!isMoving) {
        isMoving = true;
        if (!rafId) {
          rafId = requestAnimationFrame(animateGlow);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // 2. Throttled Scroll Progress & Back to Top Visibility & Active Scrolling Tracker
  useEffect(() => {
    let ticking = false;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 750);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (totalScroll > 0) {
            const currentProgress = (window.scrollY / totalScroll) * 100;
            setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
          }
          setShowBackToTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // 3. Automated IntersectionObserver Scroll Reveal Engine (Debounced)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const revealSelectors = '.scroll-fade-up, .scroll-scale-in, .scroll-slide-left, .scroll-slide-right, .scroll-reveal';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll(revealSelectors);
      elements.forEach((el) => {
        if (!el.classList.contains('is-revealed')) {
          observer.observe(el);
        }
      });
    };

    observeElements();

    let debounceTimer: ReturnType<typeof setTimeout>;
    const mutationObserver = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(observeElements, 100);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(debounceTimer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // 4. Interactive 3D Perspective Tilt & Specular Glare (Pointer Devices Only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let targetElement: HTMLElement | null = null;
    let targetRect: DOMRect | null = null;
    let pendingX = 0;
    let pendingY = 0;
    let rafId: number | null = null;

    const updateTilt = () => {
      if (!targetElement || !targetRect) return;

      const x = pendingX - targetRect.left;
      const y = pendingY - targetRect.top;
      const centerX = targetRect.width / 2;
      const centerY = targetRect.height / 2;

      const maxTilt = 6;
      const rotateX = -((y - centerY) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      targetElement.style.setProperty('--mouse-x', `${x}px`);
      targetElement.style.setProperty('--mouse-y', `${y}px`);
      targetElement.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      rafId = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest('.tilt-card, [data-tilt]') as HTMLElement | null;
      if (!target) return;

      if (target !== targetElement) {
        targetElement = target;
        targetRect = target.getBoundingClientRect();
      }

      pendingX = e.clientX;
      pendingY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(updateTilt);
      }
    };

    const handlePointerLeave = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest('.tilt-card, [data-tilt]') as HTMLElement | null;
      if (!target) return;

      target.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (target === targetElement) {
        targetElement = null;
        targetRect = null;
      }
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerout', handlePointerLeave, { passive: true });

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerout', handlePointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // 5. Interactive Magnetic Buttons Effect (Pointer Devices Only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMagneticMove = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement)?.closest('.magnetic-btn, [data-magnetic]') as HTMLElement | null;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      const pullX = Math.max(-6, Math.min(6, x * 0.22));
      const pullY = Math.max(-6, Math.min(6, y * 0.22));

      btn.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.03)`;
    };

    const handleMagneticLeave = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement)?.closest('.magnetic-btn, [data-magnetic]') as HTMLElement | null;
      if (!btn) return;

      btn.style.transform = 'translate(0px, 0px) scale(1)';
    };

    document.addEventListener('mousemove', handleMagneticMove, { passive: true });
    document.addEventListener('mouseout', handleMagneticLeave, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMagneticMove);
      document.removeEventListener('mouseout', handleMagneticLeave);
    };
  }, []);

  // 6. Subtle Twinkling Cosmic Micro-Stars Canvas (Visibility-Aware)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;
    let isTabVisible = !document.hidden;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const particleCount = Math.min(45, Math.floor(window.innerWidth / 30));
    const colors = [
      'rgba(168, 85, 247, ',  // Purple
      'rgba(236, 72, 153, ',  // Pink
      'rgba(192, 132, 252, ', // Lavender
      'rgba(255, 255, 255, '  // Diamond white
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

    // Embers and Micro-Stars
    const emberCount = 12;
    const embers = Array.from({ length: emberCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.5 + Math.random() * 2,
      color: Math.random() > 0.5 ? 'rgba(236, 72, 153, ' : 'rgba(168, 85, 247, ',
      speedY: -0.4 - Math.random() * 0.6,
      swaySpeed: 0.02 + Math.random() * 0.03,
      swayRange: 0.8 + Math.random() * 1.5,
      alpha: 0.3 + Math.random() * 0.5
    }));

    let tick = 0;
    const render = () => {
      if (!isTabVisible) return;
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Render micro-stars
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

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

      // Render glowing floating frost embers
      for (let j = 0; j < embers.length; j++) {
        const em = embers[j];
        em.y += em.speedY;
        em.x += Math.sin(tick * em.swaySpeed + j) * em.swayRange;

        if (em.y < -20) {
          em.y = height + 20;
          em.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(em.x, em.y, em.size, 0, Math.PI * 2);
        ctx.fillStyle = `${em.color}${em.alpha * (0.8 + Math.sin(tick * 0.05 + j) * 0.2)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ec4899';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 7. Interactive Cosmic Stardust Click Burst (All Devices)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      if (!e.clientX && !e.clientY) return;

      const x = e.clientX;
      const y = e.clientY;

      // 1. Expanding Shockwave Ring
      const shockwave = document.createElement('div');
      shockwave.className = 'animate-click-shockwave';
      shockwave.style.left = `${x}px`;
      shockwave.style.top = `${y}px`;
      shockwave.style.width = '36px';
      shockwave.style.height = '36px';
      document.body.appendChild(shockwave);

      // 2. Burst of 6 Diamond Micro-Sparks
      const sparkCount = 6;
      const colors = ['#f43f5e', '#ec4899', '#a855f7', '#22d3ee', '#ffffff'];
      const sparks: HTMLElement[] = [];

      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'animate-spark-particle';
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        const size = Math.random() * 2.5 + 2.5;
        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;
        spark.style.backgroundColor = colors[i % colors.length];
        spark.style.boxShadow = `0 0 8px ${colors[i % colors.length]}`;
        const angle = `${(i * 360) / sparkCount + (Math.random() * 20 - 10)}deg`;
        const dist = `${Math.floor(Math.random() * 22 + 32)}px`;
        spark.style.setProperty('--angle', angle);
        spark.style.setProperty('--dist', dist);
        document.body.appendChild(spark);
        sparks.push(spark);
      }

      setTimeout(() => {
        shockwave.remove();
        sparks.forEach((s) => s.remove());
      }, 650);
    };

    window.addEventListener('click', handleClick, { passive: true });
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Ultra-Sleek Top Scroll Progress Bar with Laser Stream & Comet Supernova Head */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-purple-600 via-pink-500 via-red-500 via-purple-500 to-indigo-500 animate-laser-stream transition-all duration-75 ease-out shadow-[0_0_14px_rgba(236,72,153,0.9),0_0_6px_rgba(168,85,247,0.8)] relative"
          style={{ width: `${scrollProgress}%` }}
        >
          {scrollProgress > 0 && (
            <>
              {/* Outer Shockwave Glow Ring */}
              <div className="absolute right-0 -top-[5px] -bottom-[5px] w-3.5 rounded-full bg-pink-500/50 animate-ping" />
              {/* Core Pulsing Comet Supernova Head */}
              <div className="absolute right-0 -top-[3.5px] -bottom-[3.5px] w-2.5 rounded-full bg-white animate-comet-head" />
              {/* Floating Futuristic HUD Percentage Pill Badge (Visible during active scrolling) */}
              <div
                className={`absolute right-0 top-3 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-950/90 border border-purple-500/40 backdrop-blur-md text-[10px] font-mono font-bold tracking-wider text-pink-300 shadow-[0_4px_16px_rgba(0,0,0,0.7),0_0_10px_rgba(236,72,153,0.4)] transition-all duration-300 ${
                  isScrolling ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                <span>{Math.round(scrollProgress)}%</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Interactive Ambient Cursor Spotlight (Desktop only) */}
      {isPointerDevice && (
        <div
          ref={spotlightRef}
          className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-300 ease-out opacity-0"
        />
      )}

      {/* 3. Cosmic Aurora Ambient Glow Drift in Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-transparent blur-[140px] animate-aurora-drift" />
        <div className="absolute top-[40%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-indigo-900/25 via-purple-900/20 to-transparent blur-[160px] animate-aurora-drift" style={{ animationDirection: 'reverse', animationDuration: '38s' }} />
      </div>

      {/* 4. Subtle Twinkling Cosmic Micro-Stars Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-75"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* 5. Floating Back to Top Glass Orb Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to Top"
          title="Back to Top"
          className="fixed bottom-6 right-6 z-50 p-3 sm:p-3.5 rounded-full bg-[#120a24]/85 border-2 border-purple-500/50 hover:border-pink-400 text-white shadow-[0_0_30px_rgba(168,85,247,0.4),0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-xl hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer animate-portal-fade flex items-center justify-center magnetic-btn"
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />
            
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
