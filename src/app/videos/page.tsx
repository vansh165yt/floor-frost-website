'use client';

import React, { useState, useEffect } from 'react';
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

// Initial 10 Videos from the last 10 days
const INITIAL_10_DAYS_VIDEOS: Video[] = [
  {
    id: "Ms4_Smdr5Gw",
    title: "I Tested 50+ Minecraft Shaders — These Are INSANE ✨",
    description: "Testing over 50 Minecraft shaders to find the most visually stunning graphics and realistic lighting in 2026.",
    publishedAt: "Uploaded Today",
    thumbnail: "https://i.ytimg.com/vi/Ms4_Smdr5Gw/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=Ms4_Smdr5Gw",
    embedUrl: "https://www.youtube.com/embed/Ms4_Smdr5Gw"
  },
  {
    id: "E0W9b_ROk14",
    title: "Minecraft Shaders Make the Game 100x Better 🤯",
    description: "Watch how Minecraft visuals change completely with these top-tier ultra realistic shader settings.",
    publishedAt: "1 day ago",
    thumbnail: "https://i.ytimg.com/vi/E0W9b_ROk14/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=E0W9b_ROk14",
    embedUrl: "https://www.youtube.com/embed/E0W9b_ROk14"
  },
  {
    id: "8ru4SjK_UiY",
    title: "Which Shader Is The Best Part 77! #minecraft #shaders",
    description: "Part 77 of our best shader comparison showdown! Which shader wins your vote?",
    publishedAt: "2 days ago",
    thumbnail: "https://i.ytimg.com/vi/8ru4SjK_UiY/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=8ru4SjK_UiY",
    embedUrl: "https://www.youtube.com/embed/8ru4SjK_UiY"
  },
  {
    id: "J1InW-aepkY",
    title: "I Transformed My Minecraft World With This 1 Shader 😱",
    description: "One single shader pack that completely redefines skies, water reflections, and ray-traced shadows.",
    publishedAt: "3 days ago",
    thumbnail: "https://i.ytimg.com/vi/J1InW-aepkY/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=J1InW-aepkY",
    embedUrl: "https://www.youtube.com/embed/J1InW-aepkY"
  },
  {
    id: "hX8G4eoiVFc",
    title: "I Found The Most Realistic Minecraft Shader 2026",
    description: "Insane ray tracing lighting, lush foliage swaying, and water caustics in 4K resolution.",
    publishedAt: "4 days ago",
    thumbnail: "https://i.ytimg.com/vi/hX8G4eoiVFc/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=hX8G4eoiVFc",
    embedUrl: "https://www.youtube.com/embed/hX8G4eoiVFc"
  },
  {
    id: "EKmMj0sw38E",
    title: "Minecraft Shader Comparison Which is Truly Most Realistic ?",
    description: "Head-to-head comparison of the most popular shaders side-by-side with vanilla gameplay.",
    publishedAt: "5 days ago",
    thumbnail: "https://i.ytimg.com/vi/EKmMj0sw38E/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=EKmMj0sw38E",
    embedUrl: "https://www.youtube.com/embed/EKmMj0sw38E"
  },
  {
    id: "hh0FgSVHVKk",
    title: "I Tested The Best Minecraft Shaders 😲 #1 Will Surprise You",
    description: "Surprising ranking of top shader packs tested for both performance FPS and visuals.",
    publishedAt: "6 days ago",
    thumbnail: "https://i.ytimg.com/vi/hh0FgSVHVKk/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=hh0FgSVHVKk",
    embedUrl: "https://www.youtube.com/embed/hh0FgSVHVKk"
  },
  {
    id: "JiFKmveIiIA",
    title: "I Tested 20 ULTRA Shaders So You Don't Have To ⚡😱",
    description: "20 heavy ultra shader packs tested on extreme settings. Which one run smoothest?",
    publishedAt: "7 days ago",
    thumbnail: "https://i.ytimg.com/vi/JiFKmveIiIA/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=JiFKmveIiIA",
    embedUrl: "https://www.youtube.com/embed/JiFKmveIiIA"
  },
  {
    id: "pBPorvvyxds",
    title: "Is This the MOST REALISTIC Shader for Minecraft? 🔥 (Test)",
    description: "In-depth graphics analysis and biome showcase of this realistic shader test.",
    publishedAt: "8 days ago",
    thumbnail: "https://i.ytimg.com/vi/pBPorvvyxds/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=pBPorvvyxds",
    embedUrl: "https://www.youtube.com/embed/pBPorvvyxds"
  },
  {
    id: "4p6T7W9lCkw",
    title: "I tested the most realistic Minecraft shader pack ever 🌄",
    description: "Breathtaking sunset and sunrise lighting showcase with photorealistic clouds.",
    publishedAt: "9 days ago",
    thumbnail: "https://i.ytimg.com/vi/4p6T7W9lCkw/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=4p6T7W9lCkw",
    embedUrl: "https://www.youtube.com/embed/4p6T7W9lCkw"
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

// Initial 5 Pure YouTube Community Posts
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
  },
  {
    id: 'yt-post-3',
    source: 'youtube',
    author: 'Floor Frost',
    avatar: '/logo.png',
    content: `🎮 NEW VIDEO IS LIVE ON YOUTUBE!\n\n"I Tested 50+ Minecraft Shaders — These Are INSANE ✨" is officially out! Shaders ko benchmark kiya hai RTX settings par. Video dekho aur batao kaun sa shader tumhara favourite hai! 🌟`,
    publishedAt: 'Recent',
    likes: 'Official Post',
    image: null,
    url: 'https://www.youtube.com/@floorfrost/posts'
  },
  {
    id: 'yt-post-4',
    source: 'youtube',
    author: 'Floor Frost',
    avatar: '/logo.png',
    content: `⚡ Forza Horizon 5 Hindi Racing Series ka next part jald hi aane wala hai! Ek aisi car aur track choose kiya hai jisme race pure edge-of-seat excitement degi. Stay tuned Floor Frost channel par! 🏎️💨`,
    publishedAt: 'Recent',
    likes: 'Series Update',
    image: null,
    url: 'https://www.youtube.com/@floorfrost/posts'
  },
  {
    id: 'yt-post-5',
    source: 'youtube',
    author: 'Floor Frost',
    avatar: '/logo.png',
    content: `❤️ Dil se shukriya har subscriber aur supporter ka! Hum lagatar daily fresh gameplay aur Minecraft realistic shader guides upload kar rahe hain. Har video ko pura dekhne aur support karne ke liye thank you! 🚀🎮`,
    publishedAt: 'Recent',
    likes: 'Community',
    image: null,
    url: 'https://www.youtube.com/@floorfrost/posts'
  }
];

export default function VideosPage() {
  const [last10DaysVideos, setLast10DaysVideos] = useState<Video[]>(INITIAL_10_DAYS_VIDEOS);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_YOUTUBE_POSTS);
  const [activeVideo, setActiveVideo] = useState<Video>(INITIAL_10_DAYS_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const res = await fetch(`/api/videos?limit=50&t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.last10DaysVideos && data.last10DaysVideos.length > 0) {
            setLast10DaysVideos(data.last10DaysVideos);
            setActiveVideo(data.last10DaysVideos[0]);
          }
          if (data.playlists && data.playlists.length > 0) {
            setPlaylists(data.playlists);
          }
          if (data.posts && data.posts.length > 0) {
            setPosts(data.posts.slice(0, 5));
          }
        }
      } catch (e) {
        console.error("Failed to refresh videos page:", e);
      }
    };

    fetchLatestData();
    const interval = setInterval(fetchLatestData, 60000);
    return () => clearInterval(interval);
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

  const scrollToArea = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07040d] text-white font-sans selection:bg-purple-500/30 pb-28 relative overflow-hidden animate-portal-fade">
      
      {/* Ambient Cosmic Dark Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[55rem] h-[55rem] bg-purple-900/25 rounded-full blur-[220px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[45rem] h-[45rem] bg-pink-900/20 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-10 left-[-10%] w-[50rem] h-[50rem] bg-indigo-950/35 rounded-full blur-[220px] pointer-events-none" />

      {/* Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Header Navigation */}
      <Header activePage="videos" />

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 relative z-10 flex flex-col gap-12">

        {/* Hero Section Banner */}
        <div className="relative rounded-[2.5rem] bg-white/[0.03] border border-white/20 backdrop-blur-2xl p-8 sm:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex flex-col items-start gap-5 overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-red-600/30 via-pink-600/20 to-purple-500/25 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              OFFICIAL YOUTUBE HUB
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-purple-600/25 border border-purple-400/40 text-purple-200 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md">
              ⚡ {last10DaysVideos.length} VIDEOS (LAST 10 DAYS)
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-indigo-600/25 border border-indigo-400/40 text-indigo-200 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md">
              📁 {playlists.length} PLAYLISTS
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-pink-600/25 border border-pink-400/40 text-pink-200 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md">
              💬 {posts.length} YOUTUBE POSTS
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            FLOOR FROST <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-300 to-purple-300">VIDEOS &amp; HUB</span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Watch the latest 10-day video releases, explore all official playlists, and check the newest community posts directly from Floor Frost!
          </p>

          {/* Quick Jump Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => scrollToArea('videos-area')}
              className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-400/40 hover:border-purple-400 text-purple-200 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.2)] flex items-center gap-2 cursor-pointer"
            >
              <span>⚡ Videos (Last 10 Days)</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-500/40 text-[10px] text-white">{last10DaysVideos.length}</span>
            </button>

            <button
              onClick={() => scrollToArea('playlists-area')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-400/40 hover:border-indigo-400 text-indigo-200 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center gap-2 cursor-pointer"
            >
              <span>📁 All Playlists</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/40 text-[10px] text-white">{playlists.length}</span>
            </button>

            <button
              onClick={() => scrollToArea('posts-area')}
              className="px-4 py-2.5 rounded-xl bg-pink-600/20 border border-pink-400/40 hover:border-pink-400 text-pink-200 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(236,72,153,0.2)] flex items-center gap-2 cursor-pointer"
            >
              <span>💬 Posts Area (Last 5)</span>
              <span className="px-1.5 py-0.5 rounded bg-pink-500/40 text-[10px] text-white">{posts.length}</span>
            </button>

            <a
              href="https://youtube.com/@floorfrost"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(239,68,68,0.5)] flex items-center gap-1.5"
            >
              <span>YouTube Channel ↗</span>
            </a>
          </div>
        </div>

        {/* 🎬 SPOTLIGHT CINEMATIC VIDEO PLAYER */}
        <div id="main-video-player" className="relative w-full group scroll-mt-28">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600/30 via-purple-600/30 to-pink-600/30 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

          <div className="w-full rounded-3xl bg-gradient-to-b from-[#140b24] to-[#0c0817] border-2 border-purple-500/40 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col lg:flex-row group-hover:border-pink-400/80 transition-all duration-300">
            
            {/* Left Player */}
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
                  className="relative w-full h-full cursor-pointer group/thumb flex items-center justify-center"
                >
                  <img 
                    src={activeVideo.thumbnail} 
                    alt={activeVideo.title} 
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  <div className="absolute w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.8)] group-hover/thumb:scale-110 group-hover/thumb:bg-red-500 transition-all">
                    <span className="text-3xl ml-1">▶</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-md bg-black/85 text-white font-mono text-xs font-bold border border-white/20 backdrop-blur-md">
                      CLICK TO PLAY
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-red-600 text-white font-mono text-[11px] font-bold uppercase shadow-lg border border-red-400/40">
                      ⚡ LAST 10 DAYS
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Information */}
            <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    PLAYING NOW
                  </span>
                  <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                    {activeVideo.publishedAt}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-purple-200 transition-colors">
                  {activeVideo.title}
                </h3>

                {activeVideo.description && (
                  <p className="text-xs text-zinc-300 line-clamp-4 leading-relaxed font-light">
                    {activeVideo.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-all shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isPlaying ? 'Replay' : 'Play Here'}</span>
                  <span>▶</span>
                </button>

                <a
                  href={activeVideo.url || `https://www.youtube.com/watch?v=${activeVideo.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider text-center transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <span>Watch on YouTube</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 1. VIDEOS AREA (LAST 10 DAYS VIDEOS) - SIGNATURE COSMIC PALETTE */}
        {/* ============================================================ */}
        <section id="videos-area" className="flex flex-col gap-6 w-full scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-gradient-to-r from-red-950/20 via-purple-950/25 to-[#120a24] border-2 border-purple-500/40 backdrop-blur-md shadow-[0_0_35px_rgba(168,85,247,0.18)]">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/40 shadow-inner text-purple-300">⚡</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-sans flex items-center gap-2.5">
                  <span>VIDEOS AREA — LAST 10 DAYS</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-600/30 border border-purple-400/50 text-purple-200 font-mono font-bold">
                    {last10DaysVideos.length} VIDEOS
                  </span>
                </h2>
                <p className="text-xs text-zinc-300 font-light mt-0.5">
                  Ye sabhi videos Floor Frost YouTube channel par pichle 10 dino ke andar upload hui hain
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-purple-300 bg-purple-500/20 px-3 py-1.5 rounded-xl border border-purple-400/30 self-start sm:self-auto">
              CLICK ANY VIDEO TO PLAY ABOVE
            </span>
          </div>

          {/* Grid of 10-Day Videos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {last10DaysVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => handlePlayVideo(video)}
                className={`group relative rounded-2xl overflow-hidden bg-zinc-950 border transition-all duration-300 shadow-xl flex flex-col cursor-pointer hover-lift ${
                  activeVideo.id === video.id
                    ? 'border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.5)] ring-2 ring-purple-400/50'
                    : 'border-purple-900/40 hover:border-pink-500/80 hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]'
                }`}
              >
                <div className="h-48 w-full relative overflow-hidden bg-black">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.8)] group-hover:scale-110 transition-transform">
                      <span className="text-xl ml-0.5">▶</span>
                    </div>
                  </div>

                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md flex items-center gap-1 border border-red-400/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      LAST 10 DAYS
                    </span>
                  </div>

                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono text-zinc-300 border border-white/10 backdrop-blur-md">
                    {video.publishedAt}
                  </span>
                </div>

                <div className="p-4 flex flex-col justify-between gap-3 grow bg-gradient-to-b from-zinc-950 to-[#0e091b]">
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-relaxed">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 font-semibold pt-2 border-t border-white/10">
                    <span className="flex items-center gap-1 group-hover:text-purple-300">
                      <span>▶</span>
                      <span>Click to Play</span>
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
        </section>

        {/* ============================================================ */}
        {/* 2. PLAYLISTS AREA (ALL PLAYLISTS) */}
        {/* ============================================================ */}
        <section id="playlists-area" className="flex flex-col gap-6 w-full scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-purple-900/15 border-2 border-purple-500/40 backdrop-blur-md shadow-[0_0_35px_rgba(168,85,247,0.15)]">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/40 shadow-inner text-purple-300">📁</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-purple-200 font-sans flex items-center gap-2.5">
                  <span>PLAYLISTS AREA — ALL PLAYLISTS</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/50 text-purple-200 font-mono font-bold">
                    {playlists.length} PLAYLISTS
                  </span>
                </h2>
                <p className="text-xs text-purple-200/80 font-light mt-0.5">
                  Floor Frost channel ki sabhi official playlists aur ongoing gaming series
                </p>
              </div>
            </div>

            <a
              href="https://www.youtube.com/@floorfrost/playlists"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-purple-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/30 transition-all flex items-center gap-1 shrink-0 w-fit"
            >
              <span>View On YouTube</span>
              <span>↗</span>
            </a>
          </div>

          {/* Grid of Playlists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {playlists.map((playlist) => (
              <a
                key={playlist.id}
                href={playlist.url}
                target="_blank"
                rel="noreferrer"
                className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#120a24] to-[#080512] border-2 border-purple-500/30 hover:border-purple-400 p-6 flex flex-col sm:flex-row gap-5 shadow-[0_10px_35px_rgba(168,85,247,0.15)] hover:shadow-[0_0_45px_rgba(168,85,247,0.4)] transition-all duration-300 hover-lift"
              >
                {/* Playlist Thumbnail with Overlay */}
                <div className="sm:w-44 h-36 sm:h-auto rounded-2xl overflow-hidden relative bg-black shrink-0 border border-purple-500/30 group-hover:border-purple-400/70 transition-colors">
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-purple-900/90 text-purple-200 border border-purple-400/40 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md">
                    <span>📁</span>
                    <span>{playlist.itemCount} {playlist.itemCount === 1 ? 'Video' : 'Videos'}</span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.8)]">
                      <span className="text-base ml-0.5">▶</span>
                    </div>
                  </div>
                </div>

                {/* Playlist Details */}
                <div className="flex flex-col justify-between gap-3 grow">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30 font-bold">
                        OFFICIAL PLAYLIST
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {playlist.title}
                    </h3>

                    {playlist.description && (
                      <p className="text-xs text-zinc-300 line-clamp-2 font-light leading-relaxed">
                        {playlist.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono font-bold text-purple-400 group-hover:text-purple-300">
                    <span>Open Playlist on YouTube</span>
                    <span className="group-hover:translate-x-1 transition-transform">↗</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. POSTS AREA (LAST 5 YOUTUBE COMMUNITY POSTS ONLY) */}
        {/* ============================================================ */}
        <section id="posts-area" className="flex flex-col gap-6 w-full scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-pink-950/20 border-2 border-pink-500/40 backdrop-blur-md shadow-[0_0_35px_rgba(236,72,153,0.15)]">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2.5 rounded-2xl bg-pink-500/20 border border-pink-500/40 shadow-inner text-pink-300">💬</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-pink-200 font-sans flex items-center gap-2.5">
                  <span>POSTS AREA</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/30 border border-pink-400/50 text-pink-200 font-mono font-bold">
                    LAST 5 POSTS
                  </span>
                </h2>
                <p className="text-xs text-pink-200/80 font-light mt-0.5">
                  Floor Frost official YouTube community tab posts and milestone announcements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://www.youtube.com/@floorfrost/posts"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-pink-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-pink-500/20 border border-pink-400/30 hover:bg-pink-500/30 transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>YouTube Community Tab ↗</span>
              </a>
            </div>
          </div>

          {/* List of Last 5 YouTube Posts */}
          <div className="flex flex-col gap-6 w-full">
            {posts.map((post, idx) => (
              <div
                key={post.id || idx}
                className="group rounded-3xl bg-gradient-to-b from-[#130b24]/95 to-[#090614]/95 border-2 border-pink-500/30 p-6 sm:p-8 flex flex-col gap-5 shadow-[0_10px_35px_rgba(236,72,153,0.15)] hover:border-pink-400 hover:shadow-[0_0_50px_rgba(236,72,153,0.35)] transition-all duration-300 hover-lift relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-600/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:from-pink-600/20 transition-all" />

                {/* Post Author Header */}
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-white/10 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-pink-500 relative shadow-md shrink-0">
                      <img src={post.avatar || '/logo.png'} alt={post.author} className="w-full h-full object-cover" />
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

                {/* Post Text Content */}
                <div className="z-10 text-sm sm:text-base text-zinc-200 leading-relaxed font-light whitespace-pre-line">
                  {post.content}
                </div>

                {/* Attached Image if present */}
                {post.image && (
                  <div className="z-10 rounded-2xl overflow-hidden border border-white/15 max-h-[32rem] bg-black/50 relative shadow-xl">
                    <img
                      src={post.image}
                      alt="YouTube community post graphic"
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Post Footer Action */}
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
        </section>

        {/* Footer Signature */}
        <div className="text-center pt-8 text-xs font-mono tracking-widest text-zinc-500 uppercase border-t border-white/5">
          FLOOR FROST VIDEOS, PLAYLISTS &amp; COMMUNITY // {new Date().getFullYear()}
        </div>

      </div>
    </div>
  );
}
