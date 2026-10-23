'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';

interface Video {
  id: string;
  title: string;
  description?: string;
  publishedAt: string;
  rawPublishedAt?: string;
  thumbnail: string;
  url: string;
  embedUrl?: string;
  duration?: string;
  durationSeconds?: number;
  isShort?: boolean;
  type?: 'short' | 'video';
}

interface Playlist {
  id: string;
  title: string;
  description?: string;
  itemCount: number;
  thumbnail: string;
  url: string;
}

interface Post {
  id: string;
  source: 'youtube';
  author: string;
  avatar: string;
  content: string;
  publishedAt: string;
  likes?: string;
  image?: string | null;
  url: string;
}

// Initial High-Impact Fallback Shorts from @FloorFrost
const INITIAL_SHORTS: Video[] = [
  {
    id: "0hD5rlnc0Wo",
    title: "The Secret To Ultra Graphics In Minecraft 🤫",
    description: "Insane ultra graphics trick in Minecraft with realistic shaders and 4K lighting.",
    publishedAt: "Uploaded Today",
    thumbnail: "https://i.ytimg.com/vi/0hD5rlnc0Wo/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=0hD5rlnc0Wo",
    embedUrl: "https://www.youtube.com/embed/0hD5rlnc0Wo",
    duration: "0:28",
    durationSeconds: 28,
    isShort: true,
    type: "short"
  },
  {
    id: "8HODRJZltSQ",
    title: "Vanilla vs Ultra Shaders in Minecraft — The Difference Is Insane 😱",
    description: "Side by side comparison of default vanilla Minecraft graphics vs realistic shaders.",
    publishedAt: "1 day ago",
    thumbnail: "https://i.ytimg.com/vi/8HODRJZltSQ/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=8HODRJZltSQ",
    embedUrl: "https://www.youtube.com/embed/8HODRJZltSQ",
    duration: "0:28",
    durationSeconds: 28,
    isShort: true,
    type: "short"
  },
  {
    id: "Ms4_Smdr5Gw",
    title: "I Tested 50+ Minecraft Shaders — These Are INSANE ✨",
    description: "Testing over 50 Minecraft shaders to find the most visually stunning graphics and realistic lighting in 2026.",
    publishedAt: "2 days ago",
    thumbnail: "https://i.ytimg.com/vi/Ms4_Smdr5Gw/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=Ms4_Smdr5Gw",
    embedUrl: "https://www.youtube.com/embed/Ms4_Smdr5Gw",
    duration: "0:28",
    durationSeconds: 28,
    isShort: true,
    type: "short"
  },
  {
    id: "E0W9b_ROk14",
    title: "Minecraft Shaders Make the Game 100x Better 🤯",
    description: "Watch how Minecraft visuals change completely with these top-tier ultra realistic shader settings.",
    publishedAt: "3 days ago",
    thumbnail: "https://i.ytimg.com/vi/E0W9b_ROk14/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=E0W9b_ROk14",
    embedUrl: "https://www.youtube.com/embed/E0W9b_ROk14",
    duration: "0:28",
    durationSeconds: 28,
    isShort: true,
    type: "short"
  },
  {
    id: "8ru4SjK_UiY",
    title: "Which Shader Is The Best Part 77! #minecraft #shaders",
    description: "Part 77 of our best shader comparison showdown! Which shader wins your vote?",
    publishedAt: "4 days ago",
    thumbnail: "https://i.ytimg.com/vi/8ru4SjK_UiY/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=8ru4SjK_UiY",
    embedUrl: "https://www.youtube.com/embed/8ru4SjK_UiY",
    duration: "0:28",
    durationSeconds: 28,
    isShort: true,
    type: "short"
  },
  {
    id: "J1InW-aepkY",
    title: "I Transformed My Minecraft World With This 1 Shader 😱",
    description: "One single shader pack that completely redefines skies, water reflections, and ray-traced shadows.",
    publishedAt: "5 days ago",
    thumbnail: "https://i.ytimg.com/vi/J1InW-aepkY/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=J1InW-aepkY",
    embedUrl: "https://www.youtube.com/embed/J1InW-aepkY",
    duration: "0:28",
    durationSeconds: 28,
    isShort: true,
    type: "short"
  },
  {
    id: "hX8G4eoiVFc",
    title: "I Found The Most Realistic Minecraft Shader 2026",
    description: "Insane ray tracing lighting, lush foliage swaying, and water caustics in 4K resolution.",
    publishedAt: "6 days ago",
    thumbnail: "https://i.ytimg.com/vi/hX8G4eoiVFc/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=hX8G4eoiVFc",
    embedUrl: "https://www.youtube.com/embed/hX8G4eoiVFc",
    duration: "0:28",
    durationSeconds: 28,
    isShort: true,
    type: "short"
  },
  {
    id: "hh0FgSVHVKk",
    title: "I Tested The Best Minecraft Shaders 😲 #1 Will Surprise You",
    description: "Surprising ranking of top shader packs tested for both performance FPS and visuals.",
    publishedAt: "7 days ago",
    thumbnail: "https://i.ytimg.com/vi/hh0FgSVHVKk/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=hh0FgSVHVKk",
    embedUrl: "https://www.youtube.com/embed/hh0FgSVHVKk",
    duration: "0:28",
    durationSeconds: 28,
    isShort: true,
    type: "short"
  }
];

// Initial Long / Full-Length Series Videos
const INITIAL_LONG_VIDEOS: Video[] = [
  {
    id: "15jYDYxiqTM",
    title: "I Bought the McLaren Senna in Forza Horizon 5... Is It Worth It? 🏎️💸",
    description: "Testing the McLaren Senna with maximum upgrades and extreme high-speed highway testing in Forza Horizon 5 Hindi gameplay.",
    publishedAt: "Featured Long Gameplay",
    thumbnail: "https://i.ytimg.com/vi/15jYDYxiqTM/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=15jYDYxiqTM",
    embedUrl: "https://www.youtube.com/embed/15jYDYxiqTM",
    duration: "27:49",
    durationSeconds: 1669,
    isShort: false,
    type: "video"
  },
  {
    id: "c52GnSm2uI0",
    title: "I Tried Forza Horizon 5 For The First Time! 🏎️ Ep 1 Hindi",
    description: "First time experience in Mexico festival with supercars, off-roading, and extreme high-speed racing in Hindi.",
    publishedAt: "Episode 1",
    thumbnail: "https://i.ytimg.com/vi/c52GnSm2uI0/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=c52GnSm2uI0",
    embedUrl: "https://www.youtube.com/embed/c52GnSm2uI0",
    duration: "22:15",
    durationSeconds: 1335,
    isShort: false,
    type: "video"
  },
  {
    id: "iCT_nI2IY4s",
    title: "Minecraft Survival Hindi 🪓🏠 | First House + Tools Setup ⚒️✨",
    description: "Floor Frost Minecraft survival episode 1 in Hindi. Crafting first stone & iron tools, exploring biomes, and building our base.",
    publishedAt: "Survival Series",
    thumbnail: "https://i.ytimg.com/vi/iCT_nI2IY4s/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=iCT_nI2IY4s",
    embedUrl: "https://www.youtube.com/embed/iCT_nI2IY4s",
    duration: "18:32",
    durationSeconds: 1112,
    isShort: false,
    type: "video"
  }
];

// Initial Playlists
const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'PLH2CdBxERGq8',
    title: 'Forza Horizon 5: The Hindi Racing Journey 🚗💨',
    description: 'High-speed Hindi gameplay and track runs in Forza Horizon 5 with Floor Frost.',
    itemCount: 2,
    thumbnail: 'https://i.ytimg.com/vi/15jYDYxiqTM/mqdefault.jpg',
    url: 'https://www.youtube.com/playlist?list=PLH2CdBxERGq8'
  },
  {
    id: 'PLWzRHC_PVfI0',
    title: 'Minecraft Survival Hindi Series 🪓🏠⚒️',
    description: 'Epic Minecraft survival series with hyper-realistic shaders and architecture.',
    itemCount: 1,
    thumbnail: 'https://i.ytimg.com/vi/iCT_nI2IY4s/mqdefault.jpg',
    url: 'https://www.youtube.com/playlist?list=PLWzRHC_PVfI0'
  }
];

// Initial Community Posts
const INITIAL_YOUTUBE_POSTS: Post[] = [
  {
    id: 'UgkxRPQlM736iJJSwhVuc6qXTkGyyo5twn5P',
    source: 'youtube',
    author: 'Floor Frost',
    avatar: '/logo.png',
    content: `Aakhirkar humne 1k subscribers ka ye milestone hit kar liya! 🎉\n\nZero se shuru kiya tha, aur aaj hum 1,000 Floor Frost family ke members ban chuke hain. Aap sabhi ke support, likes, aur har ek comment ke bina ye bilkul impossible tha.\n\nThank you har ek video ko pura dekhne aur support dikhane ke liye.\n\nYe toh bas shuruaat hai, aage abhi aur bhi crazy videos, epic gameplay, aur next-level content aane wala hai! 🚀\n\nKeep supporting & stay awesome! ❤️🎮\n— Floor Frost`,
    publishedAt: '4 weeks ago',
    likes: '15 Likes',
    image: 'https://yt3.ggpht.com/WrH-vVrHBSpXAK7OU9NKjn_OV2uqiI4KaXBAnir4sS3xFZwhtFJj_n3kjlrjOc5c-xn3CwdyvgPRzg=s800-c-fcrop64=1,00000000ffffffff-rw-nd-v1',
    url: 'https://www.youtube.com/post/UgkxRPQlM736iJJSwhVuc6qXTkGyyo5twn5P'
  },
  {
    id: 'Ugkxkd7WvgLgaBvnyzgDdPjzH5xx1iomoIHv',
    source: 'youtube',
    author: 'Floor Frost',
    avatar: '/logo.png',
    content: `🏎️💥 GET READY FOR THE ULTIMATE SPEED TEST! 💥🏎️\n\nAaj shaam 7:00 baje ek aisi racing game ki video aane wali hai jiske graphics aur high-octane action tumhare hosh uda denge! ⚡🔥\n\nCan you guess which monster track and machine we're pushing to the absolute limit today? 👇 Comment karke batao apni guessing skills!\n\nSet your reminders for 7:00 PM! Channel par milte hain! 🚀🎮`,
    publishedAt: '1 month ago',
    likes: '2 Likes',
    image: 'https://yt3.ggpht.com/frvYv5AzI66stTvuzVZJbHcWtarH4YojVfj0o7JWoGHdjX8rdYsjOVmVvEd8QyPUn4dvwDfOsguUnw=s800-c-fcrop64=1,12000000edffffff-rw-nd-v1',
    url: 'https://www.youtube.com/post/Ugkxkd7WvgLgaBvnyzgDdPjzH5xx1iomoIHv'
  }
];

type TabType = 'shorts' | 'videos' | 'playlists' | 'posts';

export default function VideosPage() {
  const [shorts, setShorts] = useState<Video[]>(INITIAL_SHORTS);
  const [longVideos, setLongVideos] = useState<Video[]>(INITIAL_LONG_VIDEOS);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_YOUTUBE_POSTS);
  
  // Interactive Controls
  const [activeTab, setActiveTab] = useState<TabType>('shorts');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Spotlight Player State
  const [activeVideo, setActiveVideo] = useState<Video>(INITIAL_SHORTS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const res = await fetch(`/api/videos?limit=50&t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.shorts && data.shorts.length > 0) {
            setShorts(data.shorts);
          }
          if (data.longVideos && data.longVideos.length > 0) {
            setLongVideos(data.longVideos);
          }
          if (data.playlists && data.playlists.length > 0) {
            setPlaylists(data.playlists);
          }
          if (data.posts && data.posts.length > 0) {
            setPosts(data.posts.slice(0, 5));
          }
          if (data.latestVideo) {
            setActiveVideo(data.latestVideo);
          }
        }
      } catch (e) {
        console.error("Failed to refresh videos page:", e);
      }
    };

    fetchLatestData();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      fetchLatestData();
    }, 60000);

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchLatestData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const handlePlayVideo = (video: Video) => {
    setActiveVideo(video);
    setIsPlaying(true);
    const playerEl = document.getElementById('main-video-player');
    if (playerEl) {
      const topOffset = playerEl.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const handleSwitchTab = (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery('');
    const targetEl = document.getElementById('tabbed-content-area');
    if (targetEl) {
      const topOffset = targetEl.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const handleShareVideo = (url: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Filtered lists based on search query
  const filteredShorts = useMemo(() => {
    if (!searchQuery.trim()) return shorts;
    const q = searchQuery.toLowerCase();
    return shorts.filter(v => v.title.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q));
  }, [shorts, searchQuery]);

  const filteredLongVideos = useMemo(() => {
    if (!searchQuery.trim()) return longVideos;
    const q = searchQuery.toLowerCase();
    return longVideos.filter(v => v.title.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q));
  }, [longVideos, searchQuery]);

  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return playlists;
    const q = searchQuery.toLowerCase();
    return playlists.filter(p => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
  }, [playlists, searchQuery]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(p => p.content.toLowerCase().includes(q));
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen bg-[#07040d] text-white font-sans selection:bg-purple-500/30 pb-32 relative overflow-hidden animate-portal-fade">
      
      {/* Dynamic Cosmic Ambient Glowing Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[65rem] h-[65rem] bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-transparent rounded-full blur-[240px] pointer-events-none animate-ambient-breathe" />
      <div className="absolute top-[40%] right-[-15%] w-[50rem] h-[50rem] bg-gradient-to-bl from-pink-800/25 via-red-900/15 to-transparent rounded-full blur-[220px] pointer-events-none animate-ambient-breathe" style={{ animationDelay: '-4.5s' }} />
      <div className="absolute bottom-10 left-[-15%] w-[55rem] h-[55rem] bg-indigo-950/40 rounded-full blur-[240px] pointer-events-none animate-ambient-breathe" style={{ animationDelay: '-2.5s' }} />

      {/* Cyber Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Header Navigation */}
      <Header activePage="videos" />

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 relative z-10 flex flex-col gap-10">

        {/* ============================================================ */}
        {/* 1. HERO SECTION BANNER WITH HOLOGRAPHIC ACCENTS */}
        {/* ============================================================ */}
        <div className="relative rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] via-[#10071c]/90 to-[#090412]/95 border-2 border-purple-500/30 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.6)] flex flex-col items-start gap-6 overflow-hidden group scroll-fade-up shimmer-glass-card">
          <div className="tilt-glare" />
          
          {/* Top-Right Decorative Cosmic Sphere */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-red-600/30 via-pink-600/30 to-purple-600/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000 pointer-events-none" />

          {/* Holographic Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                OFFICIAL YOUTUBE HUB
              </span>
              <span className="px-3 py-1.5 rounded-full bg-purple-600/20 border border-purple-400/30 text-purple-200 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase">
                ⚡ {shorts.length} SHORTS
              </span>
              <span className="px-3 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-400/30 text-indigo-200 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase">
                🎬 {longVideos.length} VIDEOS
              </span>
              <span className="px-3 py-1.5 rounded-full bg-cyan-600/20 border border-cyan-400/30 text-cyan-200 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase">
                📁 {playlists.length} PLAYLISTS
              </span>
            </div>

            {/* Live Studio Equalizer Pulse Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">AUDIO //</span>
              <div className="flex items-end gap-1 h-3.5">
                <span className="w-1 bg-red-500 rounded-full animate-eq-1" />
                <span className="w-1 bg-pink-500 rounded-full animate-eq-2" />
                <span className="w-1 bg-purple-500 rounded-full animate-eq-3" />
                <span className="w-1 bg-cyan-400 rounded-full animate-eq-4" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.1]">
              FLOOR FROST <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 via-purple-300 to-cyan-300 animate-text-shimmer">VIDEOS &amp; HUB</span>
            </h1>

            <p className="max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              Explore short clips, full gameplay series, and official playlists with zero unnecessary scrolling. Toggle categories instantly below.
            </p>
          </div>

          {/* Hero Quick Jump & Search Filter Bar */}
          <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2 border-t border-white/10">
            
            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSwitchTab('shorts')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'shorts'
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.7)] border border-red-400'
                    : 'bg-white/5 border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>⚡ Shorts</span>
                <span className="px-1.5 py-0.5 rounded bg-black/40 text-[10px]">{shorts.length}</span>
              </button>

              <button
                onClick={() => handleSwitchTab('videos')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'videos'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_25px_rgba(168,85,247,0.7)] border border-purple-400'
                    : 'bg-white/5 border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🎬 Videos</span>
                <span className="px-1.5 py-0.5 rounded bg-black/40 text-[10px]">{longVideos.length}</span>
              </button>

              <button
                onClick={() => handleSwitchTab('playlists')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'playlists'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.7)] border border-indigo-400'
                    : 'bg-white/5 border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>📁 Playlists</span>
                <span className="px-1.5 py-0.5 rounded bg-black/40 text-[10px]">{playlists.length}</span>
              </button>

              <button
                onClick={() => handleSwitchTab('posts')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'posts'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_25px_rgba(236,72,153,0.7)] border border-pink-400'
                    : 'bg-white/5 border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>💬 Community</span>
                <span className="px-1.5 py-0.5 rounded bg-black/40 text-[10px]">{posts.length}</span>
              </button>
            </div>

            {/* Instant Real-Time Search Bar */}
            <div className="relative min-w-[220px] sm:min-w-[280px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search titles, shaders, series..."
                className="w-full px-4 py-2.5 pl-9 rounded-xl bg-black/60 border border-purple-500/40 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-400 focus:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all font-mono"
              />
              <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">⚡</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-white text-xs cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. SPOTLIGHT CINEMATIC THEATER PLAYER (PREMIUM GLOW EFFECT)  */}
        {/* ============================================================ */}
        <div id="main-video-player" className="relative w-full group scroll-mt-28 scroll-scale-in">
          
          {/* Multi-Layered Pulsing Ambient Theater Backlight Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-red-600/35 via-purple-600/35 to-cyan-500/30 rounded-[3rem] blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10 animate-ambient-breathe" />

          <div className="w-full rounded-3xl bg-gradient-to-b from-[#140b24] via-[#0e071c] to-[#07040e] border-2 border-purple-500/40 overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.3)] flex flex-col lg:flex-row group-hover:border-pink-400/80 transition-all duration-300">
            
            {/* Left Cinema Player */}
            <div className="lg:w-3/5 relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div 
                  onClick={() => setIsPlaying(true)}
                  data-cursor="play"
                  className="relative w-full h-full cursor-pointer group/thumb flex items-center justify-center"
                >
                  <img 
                    src={activeVideo.thumbnail} 
                    alt={activeVideo.title} 
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-700 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Pulsing Glowing Center Play Button */}
                  <div className="absolute w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.9)] group-hover/thumb:scale-115 group-hover/thumb:bg-red-500 transition-all duration-300 border-2 border-white/60 animate-halo-pulse">
                    <span className="text-3xl ml-1">▶</span>
                  </div>

                  {/* Bottom Badges */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-lg bg-black/85 text-white font-mono text-xs font-bold border border-white/20 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      CLICK TO PLAY LIVE
                    </span>
                    <span className={`px-3 py-1.5 rounded-lg text-white font-mono text-[11px] font-bold uppercase shadow-lg border ${
                      activeVideo.isShort ? 'bg-red-600 border-red-400/50' : 'bg-purple-600 border-purple-400/50'
                    }`}>
                      {activeVideo.isShort ? '⚡ YOUTUBE SHORT' : '🎬 FULL VIDEO'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Information Panel */}
            <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between gap-6 bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="flex flex-col gap-4">
                
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    {activeVideo.isShort ? 'NOW SELECTED (SHORT)' : 'NOW SELECTED (VIDEO)'}
                  </span>
                  {activeVideo.duration && (
                    <span className="text-xs font-mono text-white bg-black/70 px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{activeVideo.duration}</span>
                    </span>
                  )}
                  <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                    {activeVideo.publishedAt}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug group-hover:text-purple-200 transition-colors">
                  {activeVideo.title}
                </h3>

                {activeVideo.description && (
                  <p className="text-xs text-zinc-300 line-clamp-4 leading-relaxed font-light">
                    {activeVideo.description}
                  </p>
                )}

                {/* Tech Specs Micro Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400">
                    4K ULTRA HD
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400">
                    60 FPS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400">
                    RAY TRACING
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-all shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isPlaying ? 'Replay Live' : 'Play in Spotlight'}</span>
                  <span>▶</span>
                </button>

                <button
                  onClick={() => handleShareVideo(activeVideo.url || `https://www.youtube.com/watch?v=${activeVideo.id}`, activeVideo.id)}
                  className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider text-center transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer relative"
                  title="Share link"
                >
                  <span>{copiedId === activeVideo.id ? '✓ Copied!' : '🔗 Share'}</span>
                </button>

                <a
                  href={activeVideo.url || `https://www.youtube.com/watch?v=${activeVideo.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <span>YouTube ↗</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. INTERACTIVE CATEGORY TAB BAR (STICKY & ULTRA-COMPACT)      */}
        {/* ============================================================ */}
        <div id="tabbed-content-area" className="w-full flex flex-col gap-6 scroll-mt-24">
          
          <div className="p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-[#120a22]/95 border-2 border-purple-500/40 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-wrap items-center justify-between gap-3 sticky top-20 z-20">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              
              {/* SHORTS TAB */}
              <button
                onClick={() => handleSwitchTab('shorts')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                  activeTab === 'shorts'
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.7)] border border-red-400 scale-[1.02]'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-base sm:text-lg">⚡</span>
                <span>Shorts</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold ${
                  activeTab === 'shorts' ? 'bg-black/50 text-white' : 'bg-white/10 text-zinc-400'
                }`}>
                  {filteredShorts.length}
                </span>
              </button>

              {/* LONG VIDEOS TAB */}
              <button
                onClick={() => handleSwitchTab('videos')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                  activeTab === 'videos'
                    ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.7)] border border-purple-400 scale-[1.02]'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-base sm:text-lg">🎬</span>
                <span>Videos (Long)</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold ${
                  activeTab === 'videos' ? 'bg-black/50 text-white' : 'bg-white/10 text-zinc-400'
                }`}>
                  {filteredLongVideos.length}
                </span>
              </button>

              {/* PLAYLISTS TAB */}
              <button
                onClick={() => handleSwitchTab('playlists')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                  activeTab === 'playlists'
                    ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.7)] border border-indigo-400 scale-[1.02]'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-base sm:text-lg">📁</span>
                <span>Playlists</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold ${
                  activeTab === 'playlists' ? 'bg-black/50 text-white' : 'bg-white/10 text-zinc-400'
                }`}>
                  {filteredPlaylists.length}
                </span>
              </button>

              {/* COMMUNITY POSTS TAB */}
              <button
                onClick={() => handleSwitchTab('posts')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                  activeTab === 'posts'
                    ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white shadow-[0_0_30px_rgba(236,72,153,0.7)] border border-pink-400 scale-[1.02]'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-base sm:text-lg">💬</span>
                <span>Community</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold ${
                  activeTab === 'posts' ? 'bg-black/50 text-white' : 'bg-white/10 text-zinc-400'
                }`}>
                  {filteredPosts.length}
                </span>
              </button>

            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Instant Switch // Zero Clutter</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* TAB 1: SHORTS SHOWCASE AREA                                   */}
          {/* ============================================================ */}
          {activeTab === 'shorts' && (
            <div className="flex flex-col gap-6 animate-portal-fade">
              
              {/* Category Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-gradient-to-r from-red-950/40 via-[#180a1c] to-[#120a24] border-2 border-red-500/40 backdrop-blur-md shadow-[0_0_35px_rgba(239,68,68,0.2)]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2.5 rounded-2xl bg-red-600/20 border border-red-500/40 shadow-inner text-red-400">⚡</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-sans flex items-center gap-2.5">
                      <span>YOUTUBE SHORTS — QUICK HIGHLIGHTS</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-400/50 text-red-200 font-mono font-bold">
                        {filteredShorts.length} SHORTS
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-300 font-light mt-0.5">
                      Viral Minecraft graphics tests, shader face-offs, and quick tips
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.youtube.com/@floorfrost/shorts"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-red-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                >
                  <span>Open Shorts on YouTube ↗</span>
                </a>
              </div>

              {/* Grid of Shorts with 3D Tilt & Glare (2-cols on mobile, 4-cols on desktop) */}
              {filteredShorts.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10 text-zinc-400 font-mono text-xs">
                  No shorts found matching &quot;{searchQuery}&quot;. Try another search keyword!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 w-full">
                  {filteredShorts.map((short, idx) => (
                    <div
                      key={short.id}
                      data-reveal-delay={String(Math.min(500, (idx % 4 + 1) * 75))}
                      onClick={() => handlePlayVideo(short)}
                      className={`group relative rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-950 border transition-all duration-500 shadow-xl flex flex-col cursor-pointer hover-lift tilt-card scroll-fade-up shimmer-glass-card ${
                        activeVideo.id === short.id
                          ? 'border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.6)] ring-2 ring-red-400/60 scale-[1.02]'
                          : 'border-red-950/70 hover:border-red-500/90 hover:shadow-[0_0_35px_rgba(239,68,68,0.4)]'
                      }`}
                    >
                      <div className="tilt-glare" />

                      {/* Thumbnail Container */}
                      <div className="h-44 sm:h-60 w-full relative overflow-hidden bg-black">
                        <img
                          src={short.thumbnail}
                          alt={short.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />
                        
                        {/* Center Hover Play Button with Halo */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,1)] group-hover:scale-110 transition-transform border border-white/50">
                            <span className="text-base sm:text-xl ml-0.5">▶</span>
                          </div>
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-red-600 text-white text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider shadow-md flex items-center gap-1 border border-red-400/50 backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            SHORT
                          </span>
                        </div>

                        {/* Duration Pill */}
                        <span className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded bg-black/85 text-[9px] sm:text-[10px] font-mono text-red-300 border border-red-500/40 backdrop-blur-md font-bold">
                          ⚡ {short.duration || '0:28'}
                        </span>

                        <span className="hidden sm:block absolute bottom-2.5 left-2.5 text-[10px] font-mono text-zinc-400">
                          {short.publishedAt}
                        </span>
                      </div>

                      {/* Content Details */}
                      <div className="p-2.5 sm:p-4 flex flex-col justify-between gap-2 sm:gap-3 grow bg-gradient-to-b from-[#130717] to-[#09040c]">
                        <h3 className="text-[11px] sm:text-sm font-bold text-white group-hover:text-red-300 transition-colors line-clamp-2 leading-tight sm:leading-relaxed">
                          {short.title}
                        </h3>
                        
                        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-red-400 font-semibold pt-1.5 sm:pt-2 border-t border-white/10">
                          <span className="flex items-center gap-1 group-hover:text-red-300 transition-colors">
                            <span>▶</span>
                            <span>Play</span>
                          </span>
                          <a
                            href={short.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-zinc-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
                          >
                            YouTube ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: LONG VIDEOS & FULL GAMEPLAY AREA                      */}
          {/* ============================================================ */}
          {activeTab === 'videos' && (
            <div className="flex flex-col gap-6 animate-portal-fade">
              
              {/* Category Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#140b24] to-[#0f0920] border-2 border-purple-500/40 backdrop-blur-md shadow-[0_0_35px_rgba(168,85,247,0.2)]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/40 shadow-inner text-purple-300">🎬</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-sans flex items-center gap-2.5">
                      <span>LONG VIDEOS &amp; GAMEPLAY SERIES</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-600/30 border border-purple-400/50 text-purple-200 font-mono font-bold">
                        {filteredLongVideos.length} VIDEOS
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-300 font-light mt-0.5">
                      Full-length episodes, comprehensive walkthroughs, and high-speed racing runs
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.youtube.com/@floorfrost/videos"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-purple-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/30 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                >
                  <span>View All on YouTube ↗</span>
                </a>
              </div>

              {/* Grid of Long Videos */}
              {filteredLongVideos.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10 text-zinc-400 font-mono text-xs">
                  No videos found matching &quot;{searchQuery}&quot;. Try another search keyword!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {filteredLongVideos.map((video, idx) => (
                    <div
                      key={video.id}
                      data-reveal-delay={String(Math.min(400, (idx + 1) * 100))}
                      onClick={() => handlePlayVideo(video)}
                      className={`group relative rounded-2xl overflow-hidden bg-zinc-950 border transition-all duration-500 shadow-xl flex flex-col cursor-pointer hover-lift tilt-card scroll-fade-up shimmer-glass-card ${
                        activeVideo.id === video.id
                          ? 'border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.6)] ring-2 ring-purple-400/60 scale-[1.02]'
                          : 'border-purple-900/50 hover:border-purple-400/90 hover:shadow-[0_0_35px_rgba(168,85,247,0.4)]'
                      }`}
                    >
                      <div className="tilt-glare" />

                      {/* Thumbnail Container */}
                      <div className="h-52 w-full relative overflow-hidden bg-black">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="w-14 h-14 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,1)] group-hover:scale-110 transition-transform border border-white/50">
                            <span className="text-xl ml-0.5">▶</span>
                          </div>
                        </div>

                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md flex items-center gap-1 border border-purple-400/40">
                            <span>🎬</span>
                            <span>FULL EPISODE</span>
                          </span>
                        </div>

                        <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded bg-black/85 text-[10px] font-mono text-purple-300 border border-purple-500/40 backdrop-blur-md font-bold">
                          ⏱️ {video.duration || '20:00+'}
                        </span>

                        <span className="absolute bottom-2.5 left-2.5 text-[10px] font-mono text-zinc-400">
                          {video.publishedAt}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col justify-between gap-4 grow bg-gradient-to-b from-[#140b24] to-[#0a0513]">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-relaxed">
                            {video.title}
                          </h3>
                          {video.description && (
                            <p className="text-xs text-zinc-300 line-clamp-2 font-light leading-relaxed">
                              {video.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs font-mono text-purple-400 font-semibold pt-3 border-t border-white/10">
                          <span className="flex items-center gap-1 group-hover:text-purple-300">
                            <span>▶</span>
                            <span>Play in Spotlight</span>
                          </span>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-zinc-400 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 transition-colors"
                          >
                            YouTube ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: PLAYLISTS AREA                                        */}
          {/* ============================================================ */}
          {activeTab === 'playlists' && (
            <div className="flex flex-col gap-6 animate-portal-fade">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-indigo-950/30 border-2 border-indigo-500/40 backdrop-blur-md shadow-[0_0_35px_rgba(99,102,241,0.2)]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 shadow-inner text-indigo-300">📁</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-indigo-200 font-sans flex items-center gap-2.5">
                      <span>OFFICIAL PLAYLISTS &amp; SERIES</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-indigo-200 font-mono font-bold">
                        {filteredPlaylists.length} PLAYLISTS
                      </span>
                    </h2>
                    <p className="text-xs text-indigo-200/80 font-light mt-0.5">
                      Floor Frost channel ki sabhi official playlists aur ongoing gaming series
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.youtube.com/@floorfrost/playlists"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-indigo-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 hover:bg-indigo-500/30 transition-all flex items-center gap-1 shrink-0 self-start sm:self-auto"
                >
                  <span>View On YouTube ↗</span>
                </a>
              </div>

              {filteredPlaylists.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10 text-zinc-400 font-mono text-xs">
                  No playlists found matching &quot;{searchQuery}&quot;. Try another search keyword!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {filteredPlaylists.map((playlist, idx) => (
                    <a
                      key={playlist.id}
                      href={playlist.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#120a24] to-[#080512] border-2 border-indigo-500/30 hover:border-indigo-400 p-6 flex flex-col sm:flex-row gap-5 shadow-[0_10px_35px_rgba(99,102,241,0.15)] hover:shadow-[0_0_45px_rgba(99,102,241,0.4)] transition-all duration-300 hover-lift tilt-card shimmer-glass-card"
                    >
                      <div className="tilt-glare" />

                      {/* Thumbnail Stack Effect */}
                      <div className="sm:w-44 h-36 sm:h-auto rounded-2xl overflow-hidden relative bg-black shrink-0 border border-indigo-500/30 group-hover:border-indigo-400/70 transition-colors">
                        <img
                          src={playlist.thumbnail}
                          alt={playlist.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-indigo-900/90 text-indigo-200 border border-indigo-400/40 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md">
                          <span>📁</span>
                          <span>{playlist.itemCount} {playlist.itemCount === 1 ? 'Video' : 'Videos'}</span>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.9)]">
                            <span className="text-lg ml-0.5">▶</span>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex flex-col justify-between gap-3 grow">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-bold">
                              OFFICIAL PLAYLIST
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                            {playlist.title}
                          </h3>

                          {playlist.description && (
                            <p className="text-xs text-zinc-300 line-clamp-2 font-light leading-relaxed">
                              {playlist.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono font-bold text-indigo-400 group-hover:text-indigo-300">
                          <span>Open Playlist on YouTube</span>
                          <span className="group-hover:translate-x-1.5 transition-transform">↗</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: COMMUNITY POSTS AREA                                  */}
          {/* ============================================================ */}
          {activeTab === 'posts' && (
            <div className="flex flex-col gap-6 animate-portal-fade">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-pink-950/20 border-2 border-pink-500/40 backdrop-blur-md shadow-[0_0_35px_rgba(236,72,153,0.15)]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2.5 rounded-2xl bg-pink-500/20 border border-pink-500/40 shadow-inner text-pink-300">💬</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-pink-200 font-sans flex items-center gap-2.5">
                      <span>COMMUNITY POSTS AREA</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/30 border border-pink-400/50 text-pink-200 font-mono font-bold">
                        {filteredPosts.length} {filteredPosts.length === 1 ? 'POST' : 'POSTS'}
                      </span>
                    </h2>
                    <p className="text-xs text-pink-200/80 font-light mt-0.5">
                      Floor Frost channel par available latest YouTube community posts
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.youtube.com/@floorfrost/posts"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-pink-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-pink-500/20 border border-pink-400/30 hover:bg-pink-500/30 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <span>YouTube Community Tab ↗</span>
                </a>
              </div>

              {/* List of YouTube Posts */}
              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10 text-zinc-400 font-mono text-xs">
                  No community posts found matching &quot;{searchQuery}&quot;.
                </div>
              ) : (
                <div className="flex flex-col gap-6 w-full">
                  {filteredPosts.map((post, idx) => (
                    <div
                      key={post.id || idx}
                      className="group rounded-3xl bg-gradient-to-b from-[#130b24]/95 via-[#0d0718]/95 to-[#090614]/95 border-2 border-pink-500/30 p-6 sm:p-8 flex flex-col gap-5 shadow-[0_10px_35px_rgba(236,72,153,0.15)] hover:border-pink-400 hover:shadow-[0_0_50px_rgba(236,72,153,0.35)] transition-all duration-300 hover-lift relative overflow-hidden tilt-card shimmer-glass-card"
                    >
                      <div className="tilt-glare" />
                      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-600/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:from-pink-600/20 transition-all duration-700" />

                      {/* Header */}
                      <div className="flex justify-between items-start gap-4 pb-4 border-b border-white/10 z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-500 relative shadow-md shrink-0">
                            <img src={post.avatar || '/logo.png'} alt={post.author} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                                {post.author}
                              </h3>
                              <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold" title="Official YouTube Creator">
                                ✓
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-red-600/20 border border-red-500/40 text-red-300">
                                YouTube Community Post
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-mono text-zinc-300 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                            {post.publishedAt}
                          </span>
                          {post.likes && (
                            <span className="text-[10px] font-mono text-pink-300 font-semibold">
                              ❤️ {post.likes}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="z-10 text-sm sm:text-base text-zinc-200 leading-relaxed font-light whitespace-pre-line">
                        {post.content}
                      </div>

                      {/* Image */}
                      {post.image && (
                        <div className="z-10 rounded-2xl overflow-hidden border border-white/15 max-h-[32rem] bg-black/50 relative shadow-xl">
                          <img
                            src={post.image}
                            alt="YouTube community post graphic"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Footer */}
                      <div className="pt-3 border-t border-white/10 z-10 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          FLOOR FROST YOUTUBE COMMUNITY FEED
                        </span>

                        <a
                          href={post.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-300 hover:text-white transition-colors px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20"
                        >
                          <span>View Post on YouTube</span>
                          <span>↗</span>
                        </a>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Signature */}
        <div className="text-center pt-8 text-xs font-mono tracking-widest text-zinc-500 uppercase border-t border-white/5 flex flex-col items-center gap-2">
          <span>FLOOR FROST VIDEOS, SHORTS &amp; PLAYLISTS // {new Date().getFullYear()}</span>
          <span className="text-[10px] text-zinc-600">ENGINEERED FOR ULTRA PERFORMANCE &amp; ZERO-LATENCY PLAYBACK</span>
        </div>

      </div>
    </div>
  );
}
