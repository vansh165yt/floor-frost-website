'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';

interface Video {
  id: string;
  title: string;
  description?: string;
  publishedAt: string;
  rawPublishedAt?: string;
  diffDays?: number;
  isWithin10Days?: boolean;
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
  source: 'youtube' | 'discord';
  author: string;
  avatar: string;
  content: string;
  publishedAt: string;
  likes?: string;
  image?: string | null;
  url: string;
}

export default function VideosPage() {
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [last10DaysVideos, setLast10DaysVideos] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [isPlayingFeatured, setIsPlayingFeatured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | '10days' | 'playlists' | 'posts'>('all');

  useEffect(() => {
    const fetchVideosData = async () => {
      try {
        const res = await fetch(`/api/videos?limit=50&t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.videos && data.videos.length > 0) {
            setVideoList(data.videos);
            setFeaturedVideo(data.latestVideo || data.videos[0]);
          }
          if (data.last10DaysVideos) {
            setLast10DaysVideos(data.last10DaysVideos);
          }
          if (data.playlists) {
            setPlaylists(data.playlists);
          }
          if (data.posts) {
            setPosts(data.posts);
          }
        }
      } catch (e) {
        console.error("Failed to load videos page data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchVideosData();
    const interval = setInterval(fetchVideosData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectVideo = (video: Video) => {
    setFeaturedVideo(video);
    setIsPlayingFeatured(true);
    const playerEl = document.getElementById('spotlight-player');
    if (playerEl) {
      const topOffset = playerEl.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
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
      <div className="absolute top-[28%] right-[-10%] w-[45rem] h-[45rem] bg-pink-900/20 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute top-[60%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-950/35 rounded-full blur-[220px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-[50rem] h-[50rem] bg-purple-950/30 rounded-full blur-[200px] pointer-events-none" />

      {/* Subtle Background Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Navigation Header */}
      <Header activePage="videos" />

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 relative z-10 flex flex-col gap-12">

        {/* Hero Section Banner */}
        <div className="relative rounded-[2.5rem] bg-white/[0.03] border border-white/20 backdrop-blur-2xl p-8 sm:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex flex-col items-start gap-5 overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-red-600/30 via-pink-600/20 to-purple-500/25 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              LIVE YOUTUBE HUB
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md">
              ⚡ {last10DaysVideos.length} NEW IN LAST 10 DAYS
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md">
              📁 {playlists.length} PLAYLISTS
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md">
              💬 {posts.length} RECENT POSTS
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            FLOOR FROST <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-300 to-purple-300">MEDIA & VIDEOS</span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Watch the latest 10-day video releases, explore all channel series & playlists, and check the newest community posts directly from Floor Frost!
          </p>

          {/* Quick Jump Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => { setActiveTab('10days'); scrollToSection('last-10-days'); }}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 hover:border-amber-400 text-amber-200 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center gap-2"
            >
              <span>⚡ Last 10 Days Videos</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/40 text-[10px]">{last10DaysVideos.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('playlists'); scrollToSection('all-playlists'); }}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/40 hover:border-purple-400 text-purple-200 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.2)] flex items-center gap-2"
            >
              <span>📁 All Playlists</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-500/40 text-[10px]">{playlists.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('posts'); scrollToSection('posts-area'); }}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-400/40 hover:border-pink-400 text-pink-200 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(236,72,153,0.2)] flex items-center gap-2"
            >
              <span>💬 Posts Area (Last 5)</span>
              <span className="px-1.5 py-0.5 rounded bg-pink-500/40 text-[10px]">{posts.length}</span>
            </button>

            <a
              href="https://youtube.com/@floorfrost"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(239,68,68,0.5)] flex items-center gap-1.5"
            >
              <span>YouTube ↗</span>
            </a>
          </div>
        </div>

        {/* FEATURED SPOTLIGHT VIDEO PLAYER */}
        {featuredVideo && (
          <div id="spotlight-player" className="relative w-full group scroll-mt-28">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600/30 via-purple-600/30 to-pink-600/30 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

            <div className="w-full rounded-3xl bg-gradient-to-b from-[#140b24] to-[#0c0817] border-2 border-purple-500/40 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col lg:flex-row group-hover:border-pink-400/80 transition-all duration-300">
              
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
                    className="relative w-full h-full cursor-pointer group/thumb flex items-center justify-center"
                  >
                    <img 
                      src={featuredVideo.thumbnail} 
                      alt={featuredVideo.title} 
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                    <div className="absolute w-20 h-20 rounded-full bg-red-600/90 border-2 border-white text-white flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.8)] group-hover/thumb:scale-110 group-hover/thumb:bg-red-500 transition-all">
                      <span className="text-3xl ml-1">▶</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-md bg-black/80 text-white font-mono text-xs font-bold border border-white/20 backdrop-blur-md">
                        CLICK TO WATCH NOW
                      </span>
                      {featuredVideo.isWithin10Days && (
                        <span className="px-2.5 py-1 rounded-md bg-amber-500/90 text-black font-mono text-[11px] font-black border border-amber-300 uppercase shadow-lg">
                          ⚡ LAST 10 DAYS
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Video Information */}
              <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      FEATURED VIDEO
                    </span>
                    <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      {featuredVideo.publishedAt}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-purple-200 transition-colors">
                    {featuredVideo.title}
                  </h3>

                  {featuredVideo.description && (
                    <p className="text-xs text-zinc-300 line-clamp-4 leading-relaxed font-light">
                      {featuredVideo.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setIsPlayingFeatured(!isPlayingFeatured)}
                    className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-all shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>{isPlayingFeatured ? 'Reload Player' : 'Play Here'}</span>
                    <span>▶</span>
                  </button>

                  <a
                    href={featuredVideo.url || `https://www.youtube.com/watch?v=${featuredVideo.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider text-center transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    <span>YouTube</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 1: LAST 10 DAYS VIDEOS */}
        <section id="last-10-days" className="flex flex-col gap-6 w-full scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 rounded-xl bg-amber-500/20 border border-amber-500/40">⚡</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-amber-200 font-sans flex items-center gap-2.5">
                  <span>LAST 10 DAYS VIDEOS</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/50 text-amber-200 font-mono font-bold">
                    {last10DaysVideos.length} RECENT RELEASES
                  </span>
                </h2>
                <p className="text-xs text-amber-200/70 font-light mt-0.5">
                  Exclusive latest videos uploaded to Floor Frost YouTube channel within the past 10 days
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">Filter: 10 Days Window</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/10 h-64 animate-pulse" />
              ))}
            </div>
          ) : last10DaysVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {last10DaysVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className={`group relative rounded-2xl overflow-hidden bg-zinc-950 border transition-all duration-300 shadow-xl flex flex-col cursor-pointer hover-lift ${
                    featuredVideo?.id === video.id
                      ? 'border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/50'
                      : 'border-amber-500/30 hover:border-amber-400/80 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]'
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
                      <div className="w-12 h-12 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.8)] group-hover:scale-110 transition-transform">
                        <span className="text-xl ml-0.5">▶</span>
                      </div>
                    </div>

                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-mono font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                        LAST 10 DAYS
                      </span>
                    </div>

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono text-amber-200 border border-amber-500/30 backdrop-blur-md">
                      {video.publishedAt}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col justify-between gap-3 grow bg-gradient-to-b from-zinc-950 to-[#0e091b]">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-2 leading-relaxed">
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 font-semibold pt-2 border-t border-white/10">
                      <span className="flex items-center gap-1">
                        <span>▶</span>
                        <span>Click to Play in Spotlight</span>
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
          ) : (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-zinc-400 font-mono text-xs">
              NO VIDEOS DETECTED IN THE LAST 10 DAYS WINDOW. CHECK ALL VIDEOS SECTION BELOW!
            </div>
          )}
        </section>

        {/* SECTION 2: ALL PLAYLISTS */}
        <section id="all-playlists" className="flex flex-col gap-6 w-full scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-900/15 border border-purple-500/30 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 rounded-xl bg-purple-500/20 border border-purple-500/40">📁</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-purple-200 font-sans flex items-center gap-2.5">
                  <span>ALL PLAYLISTS & SERIES</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/50 text-purple-200 font-mono font-bold">
                    {playlists.length} PLAYLISTS
                  </span>
                </h2>
                <p className="text-xs text-purple-200/70 font-light mt-0.5">
                  Binge-watch complete gaming series, Minecraft survival sagas, and Forza Horizon racing journeys
                </p>
              </div>
            </div>

            <a
              href="https://www.youtube.com/@floorfrost/playlists"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-purple-300 hover:text-white px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/30 transition-all flex items-center gap-1 shrink-0 w-fit"
            >
              <span>View All on YouTube</span>
              <span>↗</span>
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/10 h-56 animate-pulse" />
              ))}
            </div>
          ) : playlists.length > 0 ? (
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

                  {/* Playlist Content */}
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
          ) : (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-zinc-400 font-mono text-xs">
              NO PLAYLISTS FOUND.
            </div>
          )}
        </section>

        {/* SECTION 3: POSTS AREA (LAST 5 POSTS) */}
        <section id="posts-area" className="flex flex-col gap-6 w-full scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-pink-950/20 border border-pink-500/30 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 rounded-xl bg-pink-500/20 border border-pink-500/40">💬</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-pink-200 font-sans flex items-center gap-2.5">
                  <span>POSTS AREA</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/30 border border-pink-400/50 text-pink-200 font-mono font-bold">
                    LAST 5 POSTS
                  </span>
                </h2>
                <p className="text-xs text-pink-200/70 font-light mt-0.5">
                  Official community updates, milestones, announcements, and direct broadcasts from Floor Frost
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://www.youtube.com/@floorfrost/posts"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-pink-300 hover:text-white px-3 py-1.5 rounded-lg bg-pink-500/20 border border-pink-400/30 hover:bg-pink-500/30 transition-all flex items-center gap-1 shrink-0"
              >
                <span>YouTube Posts Tab ↗</span>
              </a>
              <a
                href="https://discord.gg/aN5CCRT6CS"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-indigo-300 hover:text-white px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 hover:bg-indigo-500/30 transition-all flex items-center gap-1 shrink-0"
              >
                <span>Discord ↗</span>
              </a>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col gap-5 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl bg-white/[0.03] border border-white/10 p-8 h-48 animate-pulse" />
              ))}
            </div>
          ) : posts.length > 0 ? (
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
                          <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold" title="Verified Creator">
                            ✓
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            post.source === 'youtube'
                              ? 'bg-red-600/30 border border-red-500/40 text-red-300'
                              : 'bg-indigo-600/30 border border-indigo-500/40 text-indigo-300'
                          }`}>
                            {post.source === 'youtube' ? 'YouTube Community Post' : 'Discord Legion Broadcast'}
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
                        alt="Community post attachment"
                        className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Post Footer Action */}
                  <div className="pt-3 border-t border-white/10 z-10 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                      FLOOR FROST OFFICIAL COMMUNITY FEED
                    </span>

                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-300 hover:text-white transition-colors px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20"
                    >
                      <span>View Official Post</span>
                      <span>↗</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-zinc-400 font-mono text-xs">
              NO POSTS FOUND.
            </div>
          )}
        </section>

        {/* SECTION 4: FULL VIDEO ARCHIVE / ALL VIDEOS */}
        <section id="all-videos" className="flex flex-col gap-6 w-full mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
            <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
              <span>ALL CHANNEL VIDEOS & SHADER GUIDES</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-300 font-mono">
                {videoList.length} UPLOADS
              </span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">
              CLICK ANY VIDEO TO PLAY IN SPOTLIGHT PLAYER ABOVE
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/10 h-56 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {videoList.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className={`group relative rounded-2xl overflow-hidden bg-zinc-950 border transition-all duration-300 shadow-xl flex flex-col cursor-pointer hover-lift ${
                    featuredVideo?.id === video.id
                      ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] ring-2 ring-pink-500/50'
                      : 'border-purple-900/40 hover:border-purple-400/80 hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]'
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
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.7)] group-hover:scale-110 transition-transform">
                        <span className="text-xl ml-0.5">▶</span>
                      </div>
                    </div>

                    {video.isWithin10Days && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-mono font-black uppercase">
                        ⚡ &lt; 10 DAYS
                      </span>
                    )}

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-300">
                      {video.publishedAt}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col justify-between gap-3 grow">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-relaxed">
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 font-semibold pt-2 border-t border-white/10">
                      <span>Click to Play</span>
                      <span>▶</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer Signature */}
        <div className="text-center pt-8 text-xs font-mono tracking-widest text-zinc-500 uppercase border-t border-white/5">
          FLOOR FROST VIDEOS, PLAYLISTS & COMMUNITY ECOSYSTEM // {new Date().getFullYear()}
        </div>

      </div>
    </div>
  );
}
