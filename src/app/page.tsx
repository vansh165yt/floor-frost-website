'use client';

import React, { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiscordAnnouncements from '@/components/DiscordAnnouncements';

const Frost3DScene = dynamic(() => import('@/components/Frost3DScene'), {
  ssr: false,
});

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
  const parseTarget = (val: string | number): number => {
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(/,/g, '').replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const numericTarget = parseTarget(value);
  const [displayValue, setDisplayValue] = useState<number>(numericTarget);
  const [isFinished, setIsFinished] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);

  const elementRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const currentValRef = useRef<number>(numericTarget);
  const hasStartedRef = useRef(false);
  const prevTargetRef = useRef<number>(numericTarget);

  currentValRef.current = displayValue;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const animateTo = (from: number, to: number, animDuration: number, isSubsequent = false) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (from === to) {
        setDisplayValue(to);
        setIsFinished(true);
        return;
      }

      const startTime = performance.now();
      const diff = to - from;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / animDuration);
        const easeOut = 1 - Math.pow(2, -10 * progress);
        const nextVal = from + diff * easeOut;

        setDisplayValue(nextVal);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          setDisplayValue(to);
          setIsFinished(true);
          rafRef.current = null;
          if (isSubsequent) {
            setHasUpdated(true);
            setTimeout(() => setHasUpdated(false), 2000);
          }
        }
      };

      rafRef.current = requestAnimationFrame(step);
    };

    if (!hasStartedRef.current) {
      const triggerStart = () => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;
        setDisplayValue(0);
        animateTo(0, numericTarget, duration, false);
      };

      if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0]?.isIntersecting) {
            triggerStart();
            observer.disconnect();
          }
        }, { threshold: 0.05 });

        observer.observe(el);
        const timer = setTimeout(triggerStart, 250);

        return () => {
          observer.disconnect();
          clearTimeout(timer);
          if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
          }
        };
      } else {
        triggerStart();
        return () => {
          if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
          }
        };
      }
    } else {
      if (prevTargetRef.current !== numericTarget) {
        prevTargetRef.current = numericTarget;
        animateTo(currentValRef.current, numericTarget, 800, true);
      }
      return () => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }
  }, [numericTarget, duration]);

  const formattedDisplay = numericTarget % 1 !== 0
    ? displayValue.toFixed(1)
    : Math.round(displayValue).toLocaleString();

  return (
    <span 
      ref={elementRef} 
      className={`inline-block font-mono tracking-tight transition-all duration-300 ${
        isFinished ? 'animate-counter-finish' : ''
      } ${hasUpdated ? 'text-lime-300 scale-105 drop-shadow-[0_0_12px_rgba(163,230,53,0.8)]' : ''}`}
    >
      {formattedDisplay}{suffix}
    </span>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnContainerRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  // Dedicated Preloader and Image References
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedImagesRef = useRef<Set<number>>(new Set());
  const loadedCountRef = useRef(0);
  const renderFrameRef = useRef<((frameIndex?: number) => boolean) | null>(null);
  const hasDrawnInitialRef = useRef(false);
  const currentFrameRef = useRef(1);

  const [displayPercent, setDisplayPercent] = useState(0);

  // Both server and client start with identical initial state to eliminate hydration mismatch
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);

  // Immediate check on mount to ensure return visits never display the loader
  useEffect(() => {
    try {
      if (sessionStorage.getItem('frost_home_visited') === 'true') {
        setIsLoading(false);
        setIsLoaderVisible(false);
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    } catch (e) {}
  }, []);

  // Live YouTube Subscribers State (Real-time count for Floor Frost)
  const [subStats, setSubStats] = useState({
    subscriberCount: "1,530",
    viewCount: "538K",
    videoCount: "96",
    demoMode: false
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
              videoCount: data.videoCount,
              demoMode: data.demoMode
            });
          }
        }
      } catch (e) {
        console.error("Subscribers fetch error:", e);
      }
    };

    fetchSubscribers();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      fetchSubscribers();
    }, 45000);

    const handleFocus = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchSubscribers();
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  // Live Discord Stats State (Real-time online count for Floor Frost Discord)
  const [discordStats, setDiscordStats] = useState({
    onlineCount: 13,
    memberCount: 27,
    isLive: false,
  });

  useEffect(() => {
    const fetchDiscordStats = async () => {
      try {
        const res = await fetch(`/api/discord-stats?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.onlineCount === 'number') {
            setDiscordStats({
              onlineCount: data.onlineCount,
              memberCount: data.memberCount || 27,
              isLive: Boolean(data.isLive),
            });
          }
        }
      } catch (e) {
        console.error("Discord stats fetch error:", e);
      }
    };

    fetchDiscordStats();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      fetchDiscordStats();
    }, 45000);

    const handleFocus = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchDiscordStats();
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  // Live YouTube Videos State (Fetched automatically from @FloorFrost channel)
  const [videoList, setVideoList] = useState<any[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<any>(null);
  const [isPlayingFeatured, setIsPlayingFeatured] = useState(false);
  const [shortsList, setShortsList] = useState<any[]>([]);
  const [longVideosList, setLongVideosList] = useState<any[]>([]);
  const [playlistsList, setPlaylistsList] = useState<any[]>([]);
  const [activeMediaFilter, setActiveMediaFilter] = useState<'shorts' | 'videos' | 'playlists'>('shorts');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`/api/videos?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.videos && data.videos.length > 0) {
            setVideoList(data.videos);
            setFeaturedVideo(data.latestVideo || data.videos[0]);
          }
          if (data.shorts && data.shorts.length > 0) {
            setShortsList(data.shorts);
          }
          if (data.longVideos && data.longVideos.length > 0) {
            setLongVideosList(data.longVideos);
          }
          if (data.playlists && data.playlists.length > 0) {
            setPlaylistsList(data.playlists);
          }
        }
      } catch (e) {
        console.error("Videos fetch error:", e);
      }
    };

    fetchVideos();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      fetchVideos();
    }, 60000);

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchVideos();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Smooth Instant-Response Auto-Scroll to Welcome Text when returning from other pages
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('scroll') === 'end') {
      let animationFrameId: number;

      const startGlide = () => {
        if (!containerRef.current) return;
        const targetY = containerRef.current.offsetHeight - window.innerHeight;
        const startY = window.scrollY || window.pageYOffset;
        const distance = targetY - startY;
        if (Math.abs(distance) <= 10) return;

        // Temporarily bypass CSS smooth scroll conflict during programmatic RAF glide
        const prevScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';

        const duration = 2000; // 2.0s responsive cinematic glide
        let startTime: number | null = null;

        // Immediate forward glide from frame 1 (Zero initial freeze/lag, smooth natural deceleration)
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

        const stopOnUserAction = () => {
          cancelAnimationFrame(animationFrameId);
          document.documentElement.style.scrollBehavior = prevScrollBehavior;
          window.removeEventListener('wheel', stopOnUserAction);
          window.removeEventListener('touchmove', stopOnUserAction);
        };

        window.addEventListener('wheel', stopOnUserAction, { passive: true, once: true });
        window.addEventListener('touchmove', stopOnUserAction, { passive: true, once: true });

        const animateScroll = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          const easeProgress = easeOutCubic(progress);

          window.scrollTo(0, startY + distance * easeProgress);

          if (timeElapsed < duration) {
            animationFrameId = requestAnimationFrame(animateScroll);
          } else {
            document.documentElement.style.scrollBehavior = prevScrollBehavior;
            window.removeEventListener('wheel', stopOnUserAction);
            window.removeEventListener('touchmove', stopOnUserAction);
            // Clean up URL search param after scroll finishes
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        };

        animationFrameId = requestAnimationFrame(animateScroll);
      };

      // Start on next tick (20ms) as soon as container dimensions are mounted
      const timer = setTimeout(startGlide, 20);

      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, []);

  // Logo Marquee Data
  const topLogos = [
    { name: "MINECRAFT", icon: "🟩" },
    { name: "GENSHIN IMPACT", icon: "✨" },
    { name: "ELDEN RING", icon: "💍" },
    { name: "CYBERPUNK 2077", icon: "⚡" },
    { name: "UNREAL ENGINE 5", icon: "⚙️" },
    { name: "NVIDIA RTX", icon: "🟢" },
    { name: "VALORANT", icon: "🎯" },
    { name: "TWITCH GAMING", icon: "🟣" }
  ];

  const bottomLogos = [
    { name: "YOUTUBE GAMING", icon: "▶️" },
    { name: "DISCORD LEGION", icon: "💬" },
    { name: "RAZER CHROMA", icon: "🐍" },
    { name: "PLAYSTATION 5", icon: "🎮" },
    { name: "XBOX SERIES X", icon: "❎" },
    { name: "STEAM VR", icon: "🥽" },
    { name: "NINTENDO", icon: "🍄" },
    { name: "FLOOR FROST HQ", icon: "❄️" }
  ];

  // 1. Unconditional Immediate Preload of all 150 Frames with Frame 1 Priority
  useEffect(() => {
    const frameCount = 150;
    let count = 0;

    // Prioritize frame 1 for instant initial background paint
    const img1 = new window.Image();
    img1.src = '/frames/frame_001.webp';
    img1.decode?.().catch(() => {});
    img1.onload = () => {
      loadedImagesRef.current.add(1);
      count++;
      loadedCountRef.current = count;
      renderFrameRef.current?.(1);
    };
    img1.onerror = () => {
      count++;
      loadedCountRef.current = count;
    };
    if (img1.complete && img1.naturalWidth > 0) {
      loadedImagesRef.current.add(1);
      count++;
      loadedCountRef.current = count;
      renderFrameRef.current?.(1);
    }
    imagesRef.current[1] = img1;

    for (let i = 2; i <= frameCount; i++) {
      const paddedIndex = String(i).padStart(3, '0');
      const img = new window.Image();
      img.src = `/frames/frame_${paddedIndex}.webp`;
      img.decode?.().catch(() => {});

      img.onload = () => {
        loadedImagesRef.current.add(i);
        count++;
        loadedCountRef.current = count;

        if (!hasDrawnInitialRef.current || Math.round(currentFrameRef.current) === i) {
          renderFrameRef.current?.();
        }
      };

      img.onerror = () => {
        count++;
        loadedCountRef.current = count;
      };

      if (img.complete && img.naturalWidth > 0) {
        loadedImagesRef.current.add(i);
        count++;
        loadedCountRef.current = count;
      }

      imagesRef.current[i] = img;
    }
  }, []);

  // 2. Smooth Guaranteed Visual Loader Controller
  useEffect(() => {
    if (!isLoading) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      return;
    }

    // Lock scroll on both html and body
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const startTime = Date.now();
    const minVisualTime = 2000; // 2 seconds minimum visual display for buttery-smooth experience

    // Guaranteed failsafe: never block screen longer than 3.5s under slow network
    const maxSafetyTimeout = setTimeout(() => {
      setDisplayPercent(100);
      setIsLoading(false);
      try {
        sessionStorage.setItem('frost_home_visited', 'true');
      } catch (e) {}
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      setIsLoaderVisible(false);
      renderFrameRef.current?.(1);
    }, 3500);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeRatio = Math.min(1, elapsed / minVisualTime);
      const realRatio = loadedCountRef.current / 150;

      // Pacing calculation: waits for real network downloads, but smooths fast/cached loads over 2s
      const targetPercent = Math.min(
        100,
        Math.floor(Math.min(realRatio, timeRatio) * 100)
      );

      setDisplayPercent((prev) => Math.max(prev, targetPercent));

      // ONLY finish when all 150 frames are fully downloaded AND minimum 2s visual animation complete
      if (loadedCountRef.current >= 150 && elapsed >= minVisualTime) {
        clearTimeout(maxSafetyTimeout);
        setDisplayPercent(100);
        clearInterval(interval);

        setTimeout(() => {
          setIsLoading(false);
          try {
            sessionStorage.setItem('frost_home_visited', 'true');
          } catch (e) {}
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';

          // Force instant canvas frame render when loader disappears
          renderFrameRef.current?.(1);

          setTimeout(() => {
            setIsLoaderVisible(false);
            renderFrameRef.current?.(1);
          }, 700);
        }, 450);
      }
    }, 30);

    return () => {
      clearTimeout(maxSafetyTimeout);
      clearInterval(interval);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  // 3. Canvas Scroll Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameCount = 150;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let targetFrame = 1;
    let currentFrame = 1;
    let animationFrameId: number;

    const drawImageCover = (img: HTMLImageElement): boolean => {
      if (!ctx || !canvas) return false;
      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return false;

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      if (!imgWidth || !imgHeight) return false;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = cw / ch;

      let drawWidth = cw;
      let drawHeight = ch;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = cw / imgRatio;
        offsetY = (ch - drawHeight) / 2;
      } else {
        drawWidth = ch * imgRatio;
        offsetX = (cw - drawWidth) / 2;
      }

      // Subtle 4% canvas zoom to naturally crop out corner watermarks seamlessly
      const zoom = 1.04;
      drawWidth *= zoom;
      drawHeight *= zoom;
      offsetX = (cw - drawWidth) / 2;
      offsetY = (ch - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      hasDrawnInitialRef.current = true;
      return true;
    };

    const renderFrame = (frameIndex: number): boolean => {
      const imgIndex = Math.min(frameCount, Math.max(1, Math.round(frameIndex)));
      const img = imagesRef.current[imgIndex];

      if (img && img.complete && img.naturalWidth > 0) {
        return drawImageCover(img);
      }

      let nearest = -1;
      let minDiff = Infinity;
      loadedImagesRef.current.forEach((idx) => {
        const diff = Math.abs(idx - imgIndex);
        if (diff < minDiff) {
          minDiff = diff;
          nearest = idx;
        }
      });

      if (nearest !== -1 && imagesRef.current[nearest]) {
        return drawImageCover(imagesRef.current[nearest]);
      }

      return false;
    };

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      renderFrame(currentFrame);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let lastRenderedFrameIndex = -1;
    let isLoopRunning = false;

    renderFrameRef.current = (frameIndex?: number) => {
      const f = frameIndex ?? currentFrame;
      const drawn = renderFrame(f);
      if (drawn) {
        lastRenderedFrameIndex = Math.round(f);
      }
      return drawn;
    };

    // Intelligent animation loop with adaptive dynamic lerp (Zero latency on fast scroll, buttery deceleration)
    const loop = () => {
      if (prefersReducedMotion) {
        currentFrame = targetFrame;
      } else {
        const diff = targetFrame - currentFrame;
        const speed = Math.abs(diff);
        // Responsive dynamic lerp: snappier tracking during fast scrolls (0.16), buttery deceleration when settling (0.095)
        const lerpFactor = speed > 3 ? 0.16 : 0.095;
        currentFrame += diff * lerpFactor;
      }
      currentFrameRef.current = currentFrame;

      const roundedFrame = Math.round(currentFrame);
      if (roundedFrame !== lastRenderedFrameIndex || !hasDrawnInitialRef.current) {
        const drawn = renderFrame(currentFrame);
        if (drawn) {
          lastRenderedFrameIndex = roundedFrame;
        }
      }

      if (Math.abs(targetFrame - currentFrame) > 0.01 || !hasDrawnInitialRef.current) {
        animationFrameId = requestAnimationFrame(loop);
      } else {
        isLoopRunning = false;
      }
    };

    const startLoop = () => {
      if (!isLoopRunning && !document.hidden) {
        isLoopRunning = true;
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

    const updateHeroDOM = (progress: number) => {
      const headerOpacity = clamp((progress - 0.65) / 0.25, 0, 1);
      const headerTranslateY = -(1 - headerOpacity) * 30;

      const subheadOpacity = clamp((progress - 0.55) / 0.25, 0, 1);
      const subheadScale = 0.85 + subheadOpacity * 0.15;
      const subheadTranslateY = (1 - subheadOpacity) * 20;

      const titleOpacity = clamp((progress - 0.65) / 0.25, 0, 1);
      const titleScale = 0.9 + titleOpacity * 0.1;
      const titleTranslateY = (1 - titleOpacity) * 35;

      const descOpacity = clamp((progress - 0.75) / 0.20, 0, 1);
      const descTranslateY = (1 - descOpacity) * 20;

      const btnOpacity = clamp((progress - 0.82) / 0.18, 0, 1);
      const btnScale = 0.85 + btnOpacity * 0.15;

      const scrollHintOpacity = clamp((0.15 - progress) / 0.15, 0, 1);

      if (headerWrapperRef.current) {
        headerWrapperRef.current.style.opacity = `${headerOpacity}`;
        headerWrapperRef.current.style.transform = `translateY(${headerTranslateY}px)`;
        headerWrapperRef.current.style.pointerEvents = headerOpacity > 0.5 ? 'auto' : 'none';
      }
      if (subheadRef.current) {
        subheadRef.current.style.opacity = `${subheadOpacity}`;
        subheadRef.current.style.transform = `translateY(${subheadTranslateY}px) scale(${subheadScale})`;
      }
      if (titleRef.current) {
        titleRef.current.style.opacity = `${titleOpacity}`;
        titleRef.current.style.transform = `translateY(${titleTranslateY}px) scale(${titleScale})`;
      }
      if (descRef.current) {
        descRef.current.style.opacity = `${descOpacity}`;
        descRef.current.style.transform = `translateY(${descTranslateY}px)`;
      }
      if (btnContainerRef.current) {
        btnContainerRef.current.style.opacity = `${btnOpacity}`;
        btnContainerRef.current.style.transform = `scale(${btnScale})`;
        btnContainerRef.current.style.pointerEvents = btnOpacity > 0.5 ? 'auto' : 'none';
      }
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = `${scrollHintOpacity}`;
      }
    };

    const updateScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // If hero container is completely scrolled past above viewport, skip frame computation
      if (rect.bottom < 0) return;

      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(1, Math.max(0, currentScroll / totalScrollable));

      targetFrame = 1 + progress * (frameCount - 1);
      updateHeroDOM(progress);
      startLoop();
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        lastRenderedFrameIndex = -1;
        renderFrame(currentFrame);
        startLoop();
      } else {
        cancelAnimationFrame(animationFrameId);
        isLoopRunning = false;
      }
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    updateScroll();
    updateHeroDOM(0);
    startLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
      renderFrameRef.current = null;
    };
  }, []);

  let loadingStatus = 'INITIALIZING FROST GRAPHICS CORE...';
  if (displayPercent >= 100) {
    loadingStatus = 'SYSTEM READY // 150/150 FRAMES LOADED';
  } else if (displayPercent > 75) {
    loadingStatus = 'FINALIZING 60FPS VIEWPORT PIPELINE...';
  } else if (displayPercent > 45) {
    loadingStatus = 'SYNCHRONIZING CINEMATIC SCROLL FRAMES...';
  } else if (displayPercent > 10) {
    loadingStatus = 'STREAMING HIGH-RES ASSET BUFFER...';
  }

  return (
    <div className="bg-[#07040d] text-white selection:bg-purple-500/30 font-sans min-h-screen relative">
      
      {/* Dynamic 3D Models Scene (Rendered on PC / Desktop Only) */}
      <Frost3DScene />

      {/* 0. INITIAL FRAME PRELOADER WITH REAL-TIME PROGRESS BAR */}
      {isLoaderVisible && (
        <div
          className={`fixed inset-0 z-[99999999] flex flex-col items-center justify-center p-6 bg-[#07040d] transition-all duration-700 ease-out select-none ${
            isLoading ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 99999999 }}
        >
          {/* Ambient Glowing Cosmic Nebula */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-purple-600/30 rounded-full blur-[150px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-pink-600/25 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none" />

          {/* Cyber Grid Lines Overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Main Centered Glass Card */}
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-8 sm:px-10 sm:py-10 text-center max-w-lg w-full bg-black/60 border border-purple-500/30 rounded-3xl backdrop-blur-2xl shadow-[0_0_60px_rgba(168,85,247,0.25)]">
            
            {/* Top Micro-badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/30 bg-purple-950/60 text-[10px] sm:text-xs font-mono tracking-widest text-purple-200 uppercase backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>FLOOR FROST ENGINE // ASSET BUFFER</span>
            </div>

            {/* Concentric Spinning Cyber Rings around Logo */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center my-1">
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-pink-500 border-b-cyan-400 animate-spin duration-1000 shadow-[0_0_25px_rgba(168,85,247,0.5)]" />
              <div
                className="absolute inset-[-8px] rounded-full border border-dashed border-purple-400/40 opacity-75"
                style={{ animation: 'spin 3.5s linear infinite reverse' }}
              />
              <div className="absolute inset-2 bg-gradient-to-tr from-purple-600/40 via-pink-600/40 to-cyan-500/40 rounded-full blur-md animate-pulse" />

              {/* Center Logo Avatar */}
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/80 shadow-2xl relative z-10">
                <NextImage
                  src="/logo.png"
                  alt="Floor Frost Logo"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Orbiting Particle Dot */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ animation: 'spin 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
              >
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] -top-1.5 left-1/2 -translate-x-1/2 absolute" />
              </div>
            </div>

            {/* Brand Title & Dynamic Phase */}
            <div className="flex flex-col items-center gap-1.5">
              <h2 className="text-3xl sm:text-4xl font-black tracking-widest uppercase bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                FLOOR FROST
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-purple-300/80 uppercase">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                <span>{loadingStatus}</span>
              </div>
            </div>

            {/* PROGRESS BAR SECTION - PROMINENT & CENTERED */}
            <div className="w-full flex flex-col items-center gap-3 pt-2">
              
              {/* Progress Bar Container */}
              <div className="w-full h-3.5 sm:h-4 rounded-full bg-white/10 border border-white/20 overflow-hidden relative backdrop-blur-md shadow-inner p-0.5">
                {/* Glowing Dynamic Fill */}
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 rounded-full transition-all duration-150 ease-out relative shadow-[0_0_20px_rgba(236,72,153,0.9)]"
                  style={{ width: `${displayPercent}%` }}
                >
                  {/* Laser Leading Light */}
                  {displayPercent > 0 && (
                    <div className="absolute right-0 top-0 bottom-0 w-3 bg-white shadow-[0_0_12px_#ffffff] rounded-full" />
                  )}
                </div>
              </div>

              {/* Indicator Details */}
              <div className="flex justify-between items-center w-full px-1 text-[11px] sm:text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-zinc-300 font-medium">
                    {displayPercent >= 100 ? 'FRAMES SYNCHRONIZED' : 'BUFFERING SCROLL FRAMES'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400 font-mono">
                    {Math.round((displayPercent / 100) * 150)} / 150
                  </span>
                  <span className="text-cyan-300 font-bold tracking-widest">{displayPercent}%</span>
                </div>
              </div>

              {/* Equalizer Spectrum Bars */}
              <div className="flex items-end justify-center gap-1.5 h-5 pt-1">
                {[0.3, 0.6, 1.0, 0.5, 0.8, 0.4, 0.9, 0.7, 0.3].map((height, idx) => (
                  <div
                    key={idx}
                    className="w-1 rounded-full bg-gradient-to-t from-purple-500 to-pink-400 animate-pulse"
                    style={{
                      height: `${height * 100}%`,
                      animationDelay: `${idx * 0.1}s`,
                      animationDuration: '0.6s'
                    }}
                  />
                ))}
              </div>

            </div>

          </div>
        </div>
      )}
      
      {/* 1. HERO SECTION WITH CANVAS SCROLL SEQUENCE */}
      <div ref={containerRef} className="relative h-[280vh] md:h-[400vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
          {/* Instant First Frame Fallback (Zero delay while canvas initializes) */}
          <NextImage
            src="/frames/frame_001.webp"
            alt="Floor Frost Hero Background"
            fill
            priority
            sizes="100vw"
            className="object-cover scale-[1.04] pointer-events-none select-none z-0"
          />

          {/* Canvas for Scroll-linked Image Sequence */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-100 object-cover"
          />

          {/* Minimal dark gradient overlays */}
          <div className="absolute inset-0 bg-black/15 pointer-events-none z-[2]" />
          <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-[#07040d] via-[#07040d]/60 to-transparent pointer-events-none z-10" />

          {/* Glass Header with 3 Parallel Lines Hamburger Menu */}
          <div 
            ref={headerWrapperRef}
            className="absolute top-0 left-0 right-0 z-50 transition-all duration-150 ease-out"
            style={{ opacity: 0, transform: 'translateY(-30px)', pointerEvents: 'none' }}
          >
            <Header activePage="home" />
          </div>

          {/* Hero Content */}
          <main className="relative z-30 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6">
            <h3 
              ref={subheadRef}
              className="text-lg sm:text-2xl md:text-3xl font-bold tracking-[0.2em] sm:tracking-[0.25em] text-white/95 uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] transition-all duration-150 ease-out"
              style={{
                opacity: 0,
                transform: 'translateY(20px) scale(0.85)'
              }}
            >
              WELCOME TO THE
            </h3>

            <h1 
              ref={titleRef}
              className="font-serif text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-normal uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-purple-200 to-indigo-200 drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)] leading-tight transition-all duration-150 ease-out animate-chromatic-shimmer"
              style={{
                opacity: 0,
                transform: 'translateY(35px) scale(0.9)'
              }}
            >
              WORLD OF GAMES
            </h1>

            <p 
              ref={descRef}
              className="max-w-xl text-xs sm:text-sm md:text-base text-white/90 font-normal leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mt-0.5 sm:mt-1 px-2 transition-all duration-150 ease-out"
              style={{
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              High-skill gameplay, epic walkthroughs, secret strategies, and funny gaming moments with Floor Frost.
            </p>

            <div
              ref={btnContainerRef}
              className="transition-all duration-150 ease-out mt-1 sm:mt-3"
              style={{
                opacity: 0,
                transform: 'scale(0.85)',
                pointerEvents: 'none'
              }}
            >
              <a href="#videos" className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3 sm:px-9 sm:py-4 font-medium text-sm sm:text-base text-white transition-all duration-300 rounded-full bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 hover:scale-[1.05] shadow-[0_0_25px_rgba(219,39,119,0.7)] hover:shadow-[0_0_40px_rgba(219,39,119,1)] border border-pink-400/50 backdrop-blur-md active:scale-95 neon-glow-btn magnetic-btn">
                <span>Explore Content</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </a>
            </div>

          </main>

          {/* Scroll Down Indicator */}
          <div 
            ref={scrollHintRef}
            className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-none transition-opacity duration-300"
            style={{ opacity: 1 }}
          >
            <span className="text-[9px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-pink-200/90 animate-pulse drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Scroll Down
            </span>
            <div className="w-4 h-7 sm:w-5 sm:h-9 rounded-full border-2 border-pink-300/50 flex items-start justify-center p-1 backdrop-blur-sm bg-black/30 shadow-lg">
              <div className="w-1 sm:w-1.5 h-1.5 sm:h-2 rounded-full bg-pink-400 animate-float" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. INFINITE LOGO CAROUSEL WITH FULL-WIDTH PERSPECTIVE RIBBON & VERTICAL DIVIDERS */}
      <section id="marquee" className="relative py-12 sm:py-20 bg-[#050308] overflow-hidden border-t border-purple-900/30 scroll-fade-up">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-purple-900/10 rounded-full blur-[180px] pointer-events-none" />

        {/* Edge Fade Gradients */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-48 bg-gradient-to-r from-[#050308] via-[#050308]/80 to-transparent pointer-events-none z-30" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-48 bg-gradient-to-l from-[#050308] via-[#050308]/80 to-transparent pointer-events-none z-30" />

        <div className="w-full relative z-30">
          
          {/* Perspective 3D Carousel Strip Container (3D perspective on PC, ultra-clean flat on mobile) */}
          <div className="w-full overflow-hidden md:[perspective:1400px]">
            <div className="flex flex-col gap-3.5 sm:gap-6 md:[transform:rotateY(-4deg)_rotateX(2deg)] transform-none transition-transform duration-500 hover:[transform:rotateY(0deg)_rotateX(0deg)]">
              
              {/* Top Row Marquee */}
              <div className="relative py-2.5 sm:py-4 border-y border-purple-500/20 bg-[#080411]/90 overflow-hidden flex shadow-lg">
                <div className="animate-marquee flex items-center">
                  {[...topLogos, ...topLogos, ...topLogos, ...topLogos].map((logo, idx) => (
                    <div key={idx} className="flex items-center shrink-0">
                      <div className="px-5 sm:px-12 py-1.5 sm:py-2 rounded-xl group cursor-pointer flex flex-col justify-center marquee-item">
                        <span className="font-sans font-black tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-lg text-zinc-100 uppercase group-hover:text-purple-300 transition-colors">
                          {logo.name}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
                          OFFICIAL ECOSYSTEM
                        </span>
                      </div>
                      {/* Vertical Divider Line from Reference Image */}
                      <div className="h-8 sm:h-12 w-[1px] bg-white/20 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row Marquee */}
              <div className="relative py-2.5 sm:py-4 border-y border-purple-500/20 bg-[#080411]/90 overflow-hidden flex shadow-lg">
                <div className="animate-marquee-reverse flex items-center">
                  {[...bottomLogos, ...bottomLogos, ...bottomLogos, ...bottomLogos].map((logo, idx) => (
                    <div key={idx} className="flex items-center shrink-0">
                      <div className="px-5 sm:px-12 py-1.5 sm:py-2 rounded-xl group cursor-pointer flex flex-col justify-center marquee-item">
                        <span className="font-sans font-black tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-lg text-zinc-100 uppercase group-hover:text-pink-300 transition-colors">
                          {logo.name}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
                          FLOOR FROST HQ
                        </span>
                      </div>
                      {/* Vertical Divider Line from Reference Image */}
                      <div className="h-8 sm:h-12 w-[1px] bg-white/20 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. BENTO GRID SECTION WITH ENHANCED FROSTED GLASSMORPHISM */}
      <section className="relative py-16 sm:py-28 px-4 sm:px-12 lg:px-20 bg-[#06030a] overflow-hidden border-t border-purple-900/20 content-auto">
        <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-pink-600/20 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12 relative z-30">
          <div className="flex flex-col items-start gap-2 sm:gap-3 scroll-fade-up">
            <span className="text-pink-400 font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold">
              Ecosystem & Metrics ~
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black uppercase tracking-tight">
              NEXT-GEN GAMING ARCHITECTURE
            </h2>
            <p className="max-w-xl text-xs sm:text-base text-zinc-400 font-light leading-relaxed">
              Explore the technology, community impact, and content universe driving Floor Frost.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
            {/* Bento Card 1: 4K Broadcast Tech */}
            <div 
              data-reveal-delay="100" 
              className="md:col-span-2 order-2 md:order-1 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/20 backdrop-blur-2xl p-5 sm:p-8 md:p-10 flex flex-col justify-between gap-6 sm:gap-8 relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] group hover:border-purple-400/70 hover:shadow-[0_0_55px_rgba(168,85,247,0.35)] hover-lift shimmer-hover transition-all duration-300 tilt-card scroll-scale-in border-beam-card"
            >
              <div className="tilt-glare" />
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/35 transition-all pointer-events-none" />
              
              <div className="flex justify-between items-start z-10">
                <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  01 / BROADCAST TECH
                </span>
                <span className="text-xl sm:text-2xl">📡</span>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 z-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-white group-hover:text-purple-200 transition-colors">
                  4K 60FPS IMMERSIVE BROADCASTING
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300/90 leading-relaxed font-light max-w-lg">
                  Streamed with ultra-low latency, custom RTX ray-tracing shaders, and spatial audio processing for the ultimate viewer experience.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.06] border border-white/20 backdrop-blur-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 z-10 shadow-lg">
                <div className="flex items-center gap-3">
                  {/* Dynamic Realistic Equalizer Bars */}
                  <div className="flex items-end gap-1.5 h-7 sm:h-8">
                    <div className="w-1.5 bg-pink-400 rounded-full animate-eq-1 shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
                    <div className="w-1.5 bg-purple-400 rounded-full animate-eq-2 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                    <div className="w-1.5 bg-cyan-400 rounded-full animate-eq-3 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    <div className="w-1.5 bg-indigo-400 rounded-full animate-eq-4 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    <div className="w-1.5 bg-fuchsia-400 rounded-full animate-eq-2 shadow-[0_0_8px_rgba(232,121,249,0.8)]" />
                    <div className="w-1.5 bg-pink-500 rounded-full animate-eq-1 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                  </div>
                  <span className="text-xs font-mono text-zinc-200 font-semibold">Live Stream Output</span>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4 text-[11px] sm:text-xs font-mono text-zinc-300">
                  <span>Bitrate: <strong className="text-lime-400">45.8 Mbps</strong></span>
                  <span>Res: <strong className="text-cyan-300">3840x2160</strong></span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Live Subscriber Count (Order 1 on mobile: Hero metric comes first!) */}
            <div 
              data-reveal-delay="200"
              className="order-1 md:order-2 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/20 backdrop-blur-2xl p-5 sm:p-8 flex flex-col justify-between gap-5 sm:gap-6 relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] group hover:border-pink-400/70 hover:shadow-[0_0_55px_rgba(236,72,153,0.35)] hover-lift shimmer-hover transition-all duration-300 tilt-card scroll-scale-in"
            >
              <div className="tilt-glare" />
              <div className="absolute -top-10 -left-10 w-44 h-44 bg-pink-500/15 rounded-full blur-2xl group-hover:bg-pink-500/30 transition-all pointer-events-none" />

              <div className="flex justify-between items-start z-10">
                <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  02 / AUDIENCE
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-600/30 border border-red-500/50 text-red-400 text-[10px] font-mono font-bold animate-pulse flex items-center gap-1 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  LIVE SUBSCRIBERS
                </span>
              </div>

              <div className="flex flex-col gap-1.5 sm:gap-2 my-auto z-10">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-mono drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">
                  <AnimatedCounter value={subStats.subscriberCount} />
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">COMMUNITY LEGION</h4>
                <p className="text-xs text-zinc-300/90 leading-relaxed font-light">
                  Real-time @FloorFrost YouTube subscribers updating live every 15s.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3.5 sm:pt-4 border-t border-white/15 z-10">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-purple-400 relative shadow-md shrink-0">
                  <NextImage src="/logo.png" alt="Floor Frost" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">@FloorFrost</p>
                  <p className="text-[10px] font-mono text-purple-300">Verified YouTube Creator</p>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Supported Platforms */}
            <div 
              data-reveal-delay="300"
              className="order-3 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/20 backdrop-blur-2xl p-5 sm:p-8 flex flex-col justify-between gap-5 sm:gap-6 relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] group hover:border-indigo-400/70 hover:shadow-[0_0_55px_rgba(129,140,248,0.35)] hover-lift shimmer-hover transition-all duration-300 tilt-card scroll-scale-in"
            >
              <div className="tilt-glare" />
              <div className="flex justify-between items-start z-10">
                <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  03 / ECOSYSTEM
                </span>
                <span className="text-xl sm:text-2xl">🕹️</span>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 z-10">
                <h4 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">SUPPORTED PLATFORMS</h4>
                <p className="text-xs text-zinc-300/90 leading-relaxed font-light">
                  Multi-platform content optimization across top gaming devices.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 sm:pt-2 z-10">
                {["PC Master Race", "PlayStation 5", "Steam Deck", "Mobile 4K", "Telegram Web3"].map((platform) => (
                  <span 
                    key={platform}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/[0.08] border border-white/15 text-[11px] sm:text-xs font-mono text-zinc-200 font-medium hover:border-pink-400/60 hover:bg-white/15 hover:scale-105 transition-all backdrop-blur-md shadow-sm"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            {/* Bento Card 4: Vision & Legion Call to Action */}
            <div 
              data-reveal-delay="400"
              className="md:col-span-2 order-4 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/20 backdrop-blur-2xl p-5 sm:p-8 md:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 sm:gap-6 relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] group hover:border-pink-400/70 hover:shadow-[0_0_55px_rgba(236,72,153,0.35)] hover-lift shimmer-hover transition-all duration-300 tilt-card scroll-scale-in"
            >
              <div className="tilt-glare" />
              <div className="flex flex-col gap-2 sm:gap-3 max-w-lg z-10">
                <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider self-start backdrop-blur-md">
                  04 / VISION
                </span>
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                  FLOOR FROST CONTENT REVOLUTION
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300/90 leading-relaxed font-light">
                  Combining high-skill gameplay, cinematic storytelling, and interactive fan rewards into one unified gaming destination.
                </p>
              </div>

              <a 
                href="https://discord.gg/aN5CCRT6CS" 
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 font-bold text-xs sm:text-sm text-white shadow-[0_0_30px_rgba(219,39,119,0.5)] hover:scale-105 active:scale-95 transition-all shrink-0 border border-pink-400/40 z-10 magnetic-btn"
              >
                Join The Legion →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT CREATOR SECTION WITH REAL CHANNEL BIO & DISCORD */}
      <section id="about" className="relative py-16 sm:py-28 px-4 sm:px-12 lg:px-20 bg-[#06030a] overflow-hidden border-t border-purple-900/20 content-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center relative z-30">
          
          <div className="relative flex flex-col items-center justify-center scroll-slide-left w-full">
            <div className="absolute w-72 sm:w-80 h-72 sm:h-80 bg-purple-600/30 rounded-full blur-3xl animate-pulse pointer-events-none" />
            
            {/* Mobile-only Quick Status Badges above Avatar (Prevents side-overflow on narrow phones) */}
            <div className="flex sm:hidden items-center justify-between gap-2 w-full max-w-[280px] mb-3 z-20">
              <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-purple-500/40 backdrop-blur-xl text-[10px] flex items-center gap-1.5 shadow-md">
                <span>🎮</span>
                <span className="text-lime-400 font-bold">Pro Walkthroughs</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-purple-500/40 backdrop-blur-xl text-[10px] flex items-center gap-1.5 shadow-md">
                <span>🔥</span>
                <span className="text-purple-300 font-bold">Frost Legion</span>
              </div>
            </div>

            <div className="relative z-10 w-full max-w-[280px] sm:w-80 md:w-96 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.4)] bg-gradient-to-b from-purple-950 to-zinc-950 p-3 sm:p-4 tilt-card">
              <div className="tilt-glare" />
              <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden border border-purple-400/30">
                <NextImage 
                  src="/logo.png" 
                  alt="Floor Frost Avatar" 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="mt-3 sm:mt-4 flex justify-between items-center px-1 sm:px-2 font-mono">
                <div>
                  <h4 className="font-bold text-base sm:text-lg text-white">FLOOR FROST</h4>
                  <p className="text-[11px] sm:text-xs text-purple-400">@FloorFrost</p>
                </div>
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-red-600/30 border border-red-500/50 text-red-400 text-[10px] sm:text-xs font-bold">
                  LIVE CREATOR
                </span>
              </div>
            </div>

            {/* Desktop Floating Badges (Identical on sm screens and above) */}
            <div className="hidden sm:flex absolute top-6 -left-4 sm:-left-6 z-20 px-4 py-3 rounded-2xl bg-zinc-900/90 border border-purple-500/40 backdrop-blur-xl shadow-2xl text-xs items-center gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <p className="text-zinc-400 text-[10px] uppercase font-mono">Gaming Content</p>
                <p className="text-lime-400 font-bold">Pro Walkthroughs</p>
              </div>
            </div>

            <div className="hidden sm:flex absolute bottom-6 -right-4 sm:-right-6 z-20 px-4 py-3 rounded-2xl bg-zinc-900/90 border border-purple-500/40 backdrop-blur-xl shadow-2xl text-xs items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-zinc-400 text-[10px] uppercase font-mono">Community</p>
                <p className="text-purple-300 font-bold">Frost Legion</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 sm:gap-6 scroll-slide-right">
            <span className="text-purple-400 font-mono text-xs sm:text-sm tracking-wider uppercase font-bold">
              Meet The Creator ~
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight sm:leading-[1.05]">
              CRAFTING UNFORGETTABLE<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">GAMING STORIES</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light max-w-lg">
              Namaste Gamers! Swagat hai <span className="text-white font-bold">Floor Frost</span> par! 🎮 Main hoon Floor Frost aur is channel par hum top-tier epic games ke adrenaline-pumping walkthroughs, secret hacks, strategies aur funny moments explore karte hain.
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-6 w-full max-w-lg mt-1 sm:mt-2 pt-4 sm:pt-6 border-t border-purple-900/40 p-3 sm:p-0 rounded-2xl sm:rounded-none bg-white/[0.03] sm:bg-transparent border sm:border-t sm:border-x-0 sm:border-b-0 border-white/10">
              <div className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-black text-white">
                  <AnimatedCounter value={subStats.subscriberCount} />
                </p>
                <p className="text-[10px] sm:text-xs text-zinc-400 font-mono uppercase mt-0.5 sm:mt-1">Live Subscribers</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-black text-pink-400">
                  <AnimatedCounter value={100} suffix="%" />
                </p>
                <p className="text-[10px] sm:text-xs text-zinc-400 font-mono uppercase mt-0.5 sm:mt-1">Pure Gameplay</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-black text-purple-400">
                  <AnimatedCounter value={4} suffix="K" />
                </p>
                <p className="text-[10px] sm:text-xs text-zinc-400 font-mono uppercase mt-0.5 sm:mt-1">Ultra Quality</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FEATURED LATEST YOUTUBE VIDEOS & SPOTLIGHT PLAYER */}
      <section id="videos" className="relative py-16 sm:py-28 px-4 sm:px-12 lg:px-20 bg-[#07040d] overflow-hidden border-t border-purple-900/20 content-auto">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-8 sm:gap-10 relative z-30">
          
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 scroll-fade-up">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-red-400 font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-red-950/60 border border-red-500/30 px-3 py-1 rounded-full">
                  LIVE YOUTUBE FEED
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                LATEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-purple-400">UPLOADS</span>
              </h2>
            </div>

            <a
              href="https://youtube.com/@floorfrost"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto justify-center text-center px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] magnetic-btn"
            >
              <span>Visit @FloorFrost YouTube</span>
              <span>↗</span>
            </a>
          </div>

          {/* Featured Spotlight Video Card (Latest Uploaded Video) */}
          {featuredVideo && (
            <div className="relative w-full group scroll-scale-in">
              {/* Ambient Theater Backlight Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600/30 via-purple-600/30 to-pink-600/30 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

              <div className="w-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#140b24] to-[#0c0817] border-2 border-purple-500/40 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col lg:flex-row group-hover:border-pink-400/80 transition-all duration-300 border-beam-card fluid-energy-border">
                
                {/* Left Video Player Container */}
                <div className="lg:w-3/5 relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  {isPlayingFeatured ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${featuredVideo.id}?autoplay=1`}
                      title={featuredVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div 
                      onClick={() => setIsPlayingFeatured(true)}
                      data-cursor="play"
                      className="relative w-full h-full cursor-pointer group/thumb flex items-center justify-center"
                    >
                      {/* Thumbnail */}
                      <img 
                        src={featuredVideo.thumbnail} 
                        alt={featuredVideo.title} 
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 brightness-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Big Glowing Play Button */}
                      <div className="absolute w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-red-600/90 border-2 border-white text-white flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.8)] group-hover/thumb:scale-110 group-hover/thumb:bg-red-500 transition-all">
                        <span className="text-2xl sm:text-3xl ml-0.5 sm:ml-1">▶</span>
                      </div>

                      <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-black/80 text-white font-mono text-[10px] sm:text-xs font-bold border border-white/20">
                        CLICK TO PLAY LIVE
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Video Information */}
                <div className="lg:w-2/5 p-4 sm:p-7 md:p-8 flex flex-col justify-between gap-4 sm:gap-6">
                  <div className="flex flex-col gap-2.5 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400" />
                        LATEST UPLOAD
                      </span>
                      <span className="text-[11px] sm:text-xs font-mono text-zinc-400">
                        {featuredVideo.publishedAt}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug group-hover:text-purple-200 transition-colors">
                      {featuredVideo.title}
                    </h3>

                    {featuredVideo.description && (
                      <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed font-light">
                        {featuredVideo.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 pt-3.5 sm:pt-4 border-t border-white/10">
                    <a
                      href={featuredVideo.url || `https://www.youtube.com/watch?v=${featuredVideo.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 sm:py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-all shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 magnetic-btn"
                    >
                      <span>Watch on YouTube</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Media Tabs: Shorts, Long Videos, and Playlists (No Endless Scroll) */}
          <div className="w-full flex flex-col gap-4 sm:gap-6 mt-2 sm:mt-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#120a22]/80 border border-purple-500/30 backdrop-blur-md">
              <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
                {/* Shorts Button */}
                <button
                  type="button"
                  onClick={() => setActiveMediaFilter('shorts')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 ${
                    activeMediaFilter === 'shorts'
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] border border-red-400'
                      : 'bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>⚡ Shorts</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] sm:text-[10px]">
                    {shortsList.length > 0 ? shortsList.length : '8'}
                  </span>
                </button>

                {/* Long Videos Button */}
                <button
                  type="button"
                  onClick={() => setActiveMediaFilter('videos')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 ${
                    activeMediaFilter === 'videos'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] border border-purple-400'
                      : 'bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>🎬 Long Videos</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] sm:text-[10px]">
                    {longVideosList.length > 0 ? longVideosList.length : '3'}
                  </span>
                </button>

                {/* Playlists Button */}
                <button
                  type="button"
                  onClick={() => setActiveMediaFilter('playlists')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 ${
                    activeMediaFilter === 'playlists'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] border border-indigo-400'
                      : 'bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>📁 Playlists</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] sm:text-[10px]">
                    {playlistsList.length > 0 ? playlistsList.length : '2'}
                  </span>
                </button>
              </div>

              <a
                href="/videos"
                className="text-xs font-mono text-purple-300 hover:text-white px-3 py-1.5 rounded-lg sm:rounded-xl bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/30 transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Full Videos Hub ↗</span>
              </a>
            </div>

            {/* Content view depending on activeMediaFilter */}
            {/* REARRANGED FOR MOBILE: 2-COLUMN YOUTUBE APP STYLE ON MOBILE SCREENS */}
            {activeMediaFilter === 'shorts' && (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5 w-full animate-portal-fade">
                {(shortsList.length > 0 
                  ? shortsList.slice(0, 8) 
                  : [
                    { id: '0hD5rlnc0Wo', title: 'The Secret To Ultra Graphics In Minecraft 🤫', publishedAt: 'Today', duration: '0:28', thumbnail: 'https://img.youtube.com/vi/0hD5rlnc0Wo/hqdefault.jpg' },
                    { id: '8HODRJZltSQ', title: 'Vanilla vs Ultra Shaders in Minecraft — The Difference Is Insane 😱', publishedAt: '1 day ago', duration: '0:28', thumbnail: 'https://img.youtube.com/vi/8HODRJZltSQ/hqdefault.jpg' },
                    { id: 'Ms4_Smdr5Gw', title: 'I Tested 50+ Minecraft Shaders — These Are INSANE ✨', publishedAt: '2 days ago', duration: '0:28', thumbnail: 'https://img.youtube.com/vi/Ms4_Smdr5Gw/hqdefault.jpg' },
                    { id: 'E0W9b_ROk14', title: 'Minecraft Shaders Make the Game 100x Better 🤯', publishedAt: '3 days ago', duration: '0:28', thumbnail: 'https://img.youtube.com/vi/E0W9b_ROk14/hqdefault.jpg' },
                    { id: '8ru4SjK_UiY', title: 'Which Shader Is The Best Part 77! #minecraft', publishedAt: '4 days ago', duration: '0:28', thumbnail: 'https://img.youtube.com/vi/8ru4SjK_UiY/hqdefault.jpg' },
                    { id: 'J1InW-aepkY', title: 'I Transformed My Minecraft World With This 1 Shader 😱', publishedAt: '5 days ago', duration: '0:28', thumbnail: 'https://img.youtube.com/vi/J1InW-aepkY/hqdefault.jpg' },
                    { id: 'hX8G4eoiVFc', title: 'I Found The Most Realistic Minecraft Shader 2026', publishedAt: '6 days ago', duration: '0:28', thumbnail: 'https://img.youtube.com/vi/hX8G4eoiVFc/hqdefault.jpg' },
                    { id: 'hh0FgSVHVKk', title: 'I Tested The Best Minecraft Shaders 😲 #1 Will Surprise You', publishedAt: '7 days ago', duration: '0:28', thumbnail: 'https://img.youtube.com/vi/hh0FgSVHVKk/hqdefault.jpg' }
                  ]
                ).map((short: any, idx: number) => (
                  <div
                    key={short.id}
                    data-reveal-delay={String(Math.min(500, (idx + 1) * 75))}
                    data-cursor="play"
                    onClick={() => {
                      setFeaturedVideo(short);
                      setIsPlayingFeatured(true);
                      window.scrollTo({ top: (document.getElementById('videos')?.offsetTop || 0) + 100, behavior: 'smooth' });
                    }}
                    className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-950 border border-red-950/60 hover:border-red-500/80 hover:shadow-[0_0_30px_rgba(239,68,68,0.35)] hover-lift transition-all duration-300 shadow-xl flex flex-col cursor-pointer tilt-card scroll-fade-up shimmer-glass-card"
                  >
                    <div className="tilt-glare" />
                    <div className="h-40 sm:h-48 w-full relative overflow-hidden bg-black">
                      <img
                        src={short.thumbnail}
                        alt={short.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.8)] group-hover:scale-110 transition-transform">
                          <span className="text-sm sm:text-xl ml-0.5">▶</span>
                        </div>
                      </div>

                      <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
                        <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full bg-red-600 text-white text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider shadow-md border border-red-400/40">
                          ⚡ SHORT
                        </span>
                      </div>

                      <span className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded bg-black/85 text-[9px] sm:text-[10px] font-mono text-red-300 border border-red-500/30">
                        {short.duration || '0:28'}
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3.5 flex flex-col gap-1.5 sm:gap-2">
                      <h4 className="text-[11px] sm:text-xs font-bold text-white group-hover:text-red-300 transition-colors line-clamp-2 leading-tight">
                        {short.title}
                      </h4>
                      
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-red-400 font-semibold pt-1 border-t border-white/10">
                        <span>Click to Play</span>
                        <span>▶</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeMediaFilter === 'videos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 w-full animate-portal-fade">
                {(longVideosList.length > 0 
                  ? longVideosList 
                  : [
                    { id: '15jYDYxiqTM', title: 'I Bought the McLaren Senna in Forza Horizon 5... Is It Worth It? 🏎️💸', duration: '27:49', publishedAt: 'Featured Gameplay', thumbnail: 'https://img.youtube.com/vi/15jYDYxiqTM/maxresdefault.jpg' },
                    { id: 'c52GnSm2uI0', title: 'I Tried Forza Horizon 5 For The First Time! 🏎️ Ep 1 Hindi', duration: '22:15', publishedAt: 'Episode 1', thumbnail: 'https://img.youtube.com/vi/c52GnSm2uI0/maxresdefault.jpg' },
                    { id: 'iCT_nI2IY4s', title: 'Minecraft Survival Hindi 🪓🏠 | First House + Tools Setup ⚒️✨', duration: '18:32', publishedAt: 'Survival Series', thumbnail: 'https://img.youtube.com/vi/iCT_nI2IY4s/maxresdefault.jpg' }
                  ]
                ).map((video: any, idx: number) => (
                  <div
                    key={video.id}
                    data-reveal-delay={String(Math.min(500, (idx + 1) * 75))}
                    data-cursor="play"
                    onClick={() => {
                      setFeaturedVideo(video);
                      setIsPlayingFeatured(true);
                      window.scrollTo({ top: (document.getElementById('videos')?.offsetTop || 0) + 100, behavior: 'smooth' });
                    }}
                    className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-950 border border-purple-900/40 hover:border-purple-400/80 hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] hover-lift transition-all duration-300 shadow-xl flex flex-col cursor-pointer tilt-card scroll-fade-up shimmer-glass-card"
                  >
                    <div className="tilt-glare" />
                    <div className="h-40 sm:h-44 w-full relative overflow-hidden bg-black">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.8)] group-hover:scale-110 transition-transform">
                          <span className="text-base sm:text-xl ml-0.5">▶</span>
                        </div>
                      </div>

                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md border border-purple-400/40">
                          🎬 FULL VIDEO
                        </span>
                      </div>

                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono text-purple-300 border border-purple-500/30">
                        ⏱️ {video.duration || '20:00+'}
                      </span>
                    </div>

                    <div className="p-3.5 sm:p-4 flex flex-col gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-relaxed">
                        {video.title}
                      </h4>
                      
                      <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 font-semibold pt-1 border-t border-white/10">
                        <span>Click to Play</span>
                        <span>▶</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeMediaFilter === 'playlists' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6 w-full animate-portal-fade">
                {(playlistsList.length > 0
                  ? playlistsList
                  : [
                    { id: 'PLH2CdBxERGq8', title: 'Forza Horizon 5: The Hindi Racing Journey 🚗💨', itemCount: 2, url: 'https://www.youtube.com/playlist?list=PLH2CdBxERGq8', thumbnail: 'https://i.ytimg.com/vi/15jYDYxiqTM/mqdefault.jpg', description: 'High-speed Hindi gameplay and track runs in Forza Horizon 5 with Floor Frost.' },
                    { id: 'PLWzRHC_PVfI0', title: 'Minecraft Survival Hindi Series 🪓🏠⚒️', itemCount: 1, url: 'https://www.youtube.com/playlist?list=PLWzRHC_PVfI0', thumbnail: 'https://i.ytimg.com/vi/iCT_nI2IY4s/mqdefault.jpg', description: 'Epic Minecraft survival series with hyper-realistic shaders and architecture.' }
                  ]
                ).map((playlist: any) => (
                  <a
                    key={playlist.id}
                    href={playlist.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[#120a24] to-[#080512] border-2 border-indigo-500/30 hover:border-indigo-400 p-3.5 sm:p-5 flex flex-col sm:flex-row gap-3 sm:gap-4 shadow-[0_10px_35px_rgba(99,102,241,0.15)] hover:shadow-[0_0_40px_rgba(99,102,241,0.35)] transition-all duration-300 hover-lift"
                  >
                    <div className="w-full sm:w-36 h-28 sm:h-auto rounded-lg sm:rounded-xl overflow-hidden relative bg-black shrink-0 border border-indigo-500/30">
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-indigo-900/90 text-[10px] font-mono text-indigo-200">
                        📁 {playlist.itemCount} Videos
                      </span>
                    </div>

                    <div className="flex flex-col justify-between gap-2 grow">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {playlist.title}
                      </h4>
                      {playlist.description && (
                        <p className="text-[11px] sm:text-xs text-zinc-300 line-clamp-2 font-light">
                          {playlist.description}
                        </p>
                      )}
                      <span className="text-[11px] sm:text-xs font-mono font-bold text-indigo-400 group-hover:text-indigo-300 pt-1 flex items-center justify-between">
                        <span>Open Playlist</span>
                        <span>↗</span>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 5.5 LIVE DISCORD ANNOUNCEMENTS */}
      <DiscordAnnouncements />

      {/* 6. COMMUNITY & DISCORD BANNER WITH REAL LINKS */}
      <section id="community" className="relative py-16 sm:py-24 px-4 sm:px-12 lg:px-20 bg-[#06030a] border-t border-purple-900/20 content-auto">
        <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-zinc-950 border border-purple-500/30 p-6 sm:p-10 md:p-16 relative overflow-hidden flex flex-col items-center text-center gap-6 sm:gap-8 shadow-[0_0_60px_rgba(147,51,234,0.3)] z-30 tilt-card scroll-scale-in border-beam-card">
          <div className="tilt-glare" />
          <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Cyber Status Badges (Desktop) */}
          <div className="hidden lg:flex absolute top-10 left-10 px-4 py-2 rounded-2xl bg-black/60 border border-purple-400/40 backdrop-blur-md items-center gap-2 text-xs font-mono text-purple-200 animate-float shadow-lg pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>DISCORD // {discordStats.onlineCount} ONLINE</span>
          </div>
          <div className="hidden lg:flex absolute bottom-10 right-10 px-4 py-2 rounded-2xl bg-black/60 border border-pink-400/40 backdrop-blur-md items-center gap-2 text-xs font-mono text-pink-200 animate-float-slow shadow-lg pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>YOUTUBE // 4K 60FPS</span>
          </div>

          {/* Mobile-only status pill (Ensures mobile users get real-time status without desktop off-screen clutter) */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-black/60 border border-purple-400/40 text-[10px] font-mono text-purple-200 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>DISCORD: {discordStats.onlineCount} ONLINE</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/60 border border-pink-400/40 text-[10px] font-mono text-pink-200 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              <span>YOUTUBE: 4K 60FPS</span>
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4 max-w-2xl">
            {/* Spinning Cyber Avatar Rings */}
            <div className="relative mb-1 sm:mb-2 flex items-center justify-center">
              <div className="absolute -inset-2.5 rounded-full border border-dashed border-purple-500/50 animate-[spin_8s_linear_infinite]" />
              <div className="absolute -inset-5 rounded-full border border-pink-500/30 animate-[spin_15s_linear_infinite_reverse]" />
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.5)] relative">
                <NextImage src="/logo.png" alt="Floor Frost Logo" fill className="object-cover" />
              </div>
            </div>

            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pink-300 font-bold">
              JOIN THE FROST LEGION
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight animate-chromatic-shimmer">
              NEVER MISS A GAMING ADVENTURE
            </h2>
            <p className="text-xs sm:text-base text-zinc-300 font-light leading-relaxed">
              Subscribe to @FloorFrost for Minecraft and gaming walkthroughs, and join our official Discord server to connect with Floor Frost!
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center w-full sm:w-auto">
            <a 
              href="https://youtube.com/@floorfrost" 
              target="_blank" 
              rel="noreferrer"
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 font-bold text-xs sm:text-sm text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_45px_rgba(220,38,38,0.8)] transition-all flex items-center justify-center gap-2.5 sm:gap-3 magnetic-btn border border-red-400/40 text-center"
            >
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center text-xs group-hover:scale-110 transition-transform">▶</span>
              <span>Subscribe (<AnimatedCounter value={subStats.subscriberCount} />)</span>
            </a>
            <a 
              href="https://discord.gg/aN5CCRT6CS" 
              target="_blank" 
              rel="noreferrer"
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-xs sm:text-sm text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:shadow-[0_0_45px_rgba(79,70,229,0.8)] transition-all flex items-center justify-center gap-2.5 sm:gap-3 magnetic-btn border border-indigo-400/40 text-center"
            >
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center text-xs group-hover:scale-110 transition-transform">💬</span>
              <span>Join Official Discord</span>
            </a>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
