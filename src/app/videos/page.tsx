'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';

interface Video {
  id: string;
  title: string;
  description?: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  embedUrl?: string;
}

export default function VideosPage() {
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [isPlayingFeatured, setIsPlayingFeatured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const res = await fetch('/api/videos?limit=25');
        if (res.ok) {
          const data = await res.json();
          if (data.videos && data.videos.length > 0) {
            setVideoList(data.videos);
            setFeaturedVideo(data.latestVideo || data.videos[0]);
          }
        }
      } catch (e) {
        console.error("Failed to load videos gallery:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAllVideos();
    const interval = setInterval(fetchAllVideos, 60000);
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

      {/* Main Glass Navigation Header with 3 Parallel Lines Hamburger Menu */}
      <Header activePage="videos" />

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 relative z-10 flex flex-col gap-10">

        {/* Hero Section Banner */}
        <div className="relative rounded-[2.5rem] bg-white/[0.03] border border-white/20 backdrop-blur-2xl p-8 sm:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex flex-col items-start gap-4 overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-red-600/30 to-purple-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              LIVE YOUTUBE GALLERY
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md">
              {videoList.length} GAMING VIDEOS
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            FLOOR FROST <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-300 to-purple-300">VIDEO GALLERY</span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Explore and watch all official Floor Frost YouTube videos, Minecraft 4K shader testing, pro walkthroughs, and gameplay highlights directly in high quality.
          </p>

          <div className="pt-2">
            <a
              href="https://youtube.com/@floorfrost"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(239,68,68,0.5)]"
            >
              <span>Visit Official @FloorFrost YouTube Channel</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* FEATURED SPOTLIGHT VIDEO PLAYER */}
        {featuredVideo && (
          <div className="relative w-full group">
            {/* Ambient Theater Backlight Glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600/30 via-purple-600/30 to-pink-600/30 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

            <div id="player" className="w-full rounded-3xl bg-gradient-to-b from-[#140b24] to-[#0c0817] border-2 border-purple-500/40 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col lg:flex-row group-hover:border-pink-400/80 transition-all duration-300">
              
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute w-20 h-20 rounded-full bg-red-600/90 border-2 border-white text-white flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.8)] group-hover/thumb:scale-110 group-hover/thumb:bg-red-500 transition-all">
                      <span className="text-3xl ml-1">▶</span>
                    </div>

                    <span className="absolute bottom-4 left-4 px-3 py-1 rounded-md bg-black/80 text-white font-mono text-xs font-bold border border-white/20">
                      CLICK TO WATCH VIDEO
                    </span>
                  </div>
                )}
              </div>

              {/* Right Video Information */}
              <div className="lg:w-2/5 p-8 flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      FEATURED VIDEO
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {featuredVideo.publishedAt}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white leading-snug group-hover:text-purple-200 transition-colors">
                    {featuredVideo.title}
                  </h3>

                  {featuredVideo.description && (
                    <p className="text-xs text-zinc-300 line-clamp-4 leading-relaxed font-light">
                      {featuredVideo.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  <a
                    href={featuredVideo.url || `https://www.youtube.com/watch?v=${featuredVideo.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-all shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Watch Directly on YouTube</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* FULL VIDEOS GALLERY GRID */}
        <div className="flex flex-col gap-6 w-full mt-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
              <span>ALL GAMING VIDEOS</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-300 font-mono">
                {videoList.length} UPLOADS
              </span>
            </h2>
          </div>

          {loading ? (
            // Skeleton Loader
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
                  onClick={() => {
                    setFeaturedVideo(video);
                    setIsPlayingFeatured(true);
                    window.scrollTo({ top: (document.getElementById('player')?.offsetTop || 0) - 100, behavior: 'smooth' });
                  }}
                  className={`group relative rounded-2xl overflow-hidden bg-zinc-950 border transition-all duration-300 shadow-xl flex flex-col cursor-pointer hover-lift ${
                    featuredVideo?.id === video.id
                      ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)]'
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

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-300">
                      {video.publishedAt}
                    </span>
                  </div>


                  <div className="p-4 flex flex-col justify-between gap-3 grow">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-relaxed">
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 font-semibold pt-1 border-t border-white/10">
                      <span>Click to Play</span>
                      <span>▶</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Signature */}
        <div className="text-center pt-4 text-xs font-mono tracking-widest text-zinc-500 uppercase">
          FLOOR FROST VIDEO GALLERY & ECOSYSTEM
        </div>

      </div>
    </div>
  );
}
