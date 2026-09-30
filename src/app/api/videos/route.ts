import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// Fallback 10 videos of the last 10 days from @FloorFrost
const FALLBACK_10_DAYS_VIDEOS = [
  {
    id: "Ms4_Smdr5Gw",
    title: "I Tested 50+ Minecraft Shaders — These Are INSANE ✨",
    description: "Testing over 50 Minecraft shaders to find the most visually stunning graphics and realistic lighting in 2026.",
    publishedAt: "Uploaded Today",
    rawPublishedAt: "2026-09-29T07:30:26Z",
    thumbnail: "https://i.ytimg.com/vi/Ms4_Smdr5Gw/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=Ms4_Smdr5Gw",
    embedUrl: "https://www.youtube.com/embed/Ms4_Smdr5Gw"
  },
  {
    id: "E0W9b_ROk14",
    title: "Minecraft Shaders Make the Game 100x Better 🤯",
    description: "Watch how Minecraft visuals change completely with these top-tier ultra realistic shader settings.",
    publishedAt: "1 day ago",
    rawPublishedAt: "2026-09-28T07:30:17Z",
    thumbnail: "https://i.ytimg.com/vi/E0W9b_ROk14/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=E0W9b_ROk14",
    embedUrl: "https://www.youtube.com/embed/E0W9b_ROk14"
  },
  {
    id: "8ru4SjK_UiY",
    title: "Which Shader Is The Best Part 77! #minecraft #shaders",
    description: "Part 77 of our best shader comparison showdown! Which shader wins your vote?",
    publishedAt: "2 days ago",
    rawPublishedAt: "2026-09-27T07:30:15Z",
    thumbnail: "https://i.ytimg.com/vi/8ru4SjK_UiY/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=8ru4SjK_UiY",
    embedUrl: "https://www.youtube.com/embed/8ru4SjK_UiY"
  },
  {
    id: "J1InW-aepkY",
    title: "I Transformed My Minecraft World With This 1 Shader 😱",
    description: "One single shader pack that completely redefines skies, water reflections, and ray-traced shadows.",
    publishedAt: "3 days ago",
    rawPublishedAt: "2026-09-26T07:30:38Z",
    thumbnail: "https://i.ytimg.com/vi/J1InW-aepkY/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=J1InW-aepkY",
    embedUrl: "https://www.youtube.com/embed/J1InW-aepkY"
  },
  {
    id: "hX8G4eoiVFc",
    title: "I Found The Most Realistic Minecraft Shader 2026",
    description: "Insane ray tracing lighting, lush foliage swaying, and water caustics in 4K resolution.",
    publishedAt: "4 days ago",
    rawPublishedAt: "2026-09-25T07:30:33Z",
    thumbnail: "https://i.ytimg.com/vi/hX8G4eoiVFc/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=hX8G4eoiVFc",
    embedUrl: "https://www.youtube.com/embed/hX8G4eoiVFc"
  },
  {
    id: "EKmMj0sw38E",
    title: "Minecraft Shader Comparison Which is Truly Most Realistic ?",
    description: "Head-to-head comparison of the most popular shaders side-by-side with vanilla gameplay.",
    publishedAt: "5 days ago",
    rawPublishedAt: "2026-09-24T07:30:38Z",
    thumbnail: "https://i.ytimg.com/vi/EKmMj0sw38E/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=EKmMj0sw38E",
    embedUrl: "https://www.youtube.com/embed/EKmMj0sw38E"
  },
  {
    id: "hh0FgSVHVKk",
    title: "I Tested The Best Minecraft Shaders 😲 #1 Will Surprise You",
    description: "Surprising ranking of top shader packs tested for both performance FPS and visuals.",
    publishedAt: "6 days ago",
    rawPublishedAt: "2026-09-23T07:30:31Z",
    thumbnail: "https://i.ytimg.com/vi/hh0FgSVHVKk/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=hh0FgSVHVKk",
    embedUrl: "https://www.youtube.com/embed/hh0FgSVHVKk"
  },
  {
    id: "JiFKmveIiIA",
    title: "I Tested 20 ULTRA Shaders So You Don't Have To ⚡😱",
    description: "20 heavy ultra shader packs tested on extreme settings. Which one run smoothest?",
    publishedAt: "7 days ago",
    rawPublishedAt: "2026-09-22T07:30:19Z",
    thumbnail: "https://i.ytimg.com/vi/JiFKmveIiIA/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=JiFKmveIiIA",
    embedUrl: "https://www.youtube.com/embed/JiFKmveIiIA"
  },
  {
    id: "pBPorvvyxds",
    title: "Is This the MOST REALISTIC Shader for Minecraft? 🔥 (Test)",
    description: "In-depth graphics analysis and biome showcase of this realistic shader test.",
    publishedAt: "8 days ago",
    rawPublishedAt: "2026-09-21T07:30:01Z",
    thumbnail: "https://i.ytimg.com/vi/pBPorvvyxds/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=pBPorvvyxds",
    embedUrl: "https://www.youtube.com/embed/pBPorvvyxds"
  },
  {
    id: "4p6T7W9lCkw",
    title: "I tested the most realistic Minecraft shader pack ever 🌄",
    description: "Breathtaking sunset and sunrise lighting showcase with photorealistic clouds.",
    publishedAt: "9 days ago",
    rawPublishedAt: "2026-09-20T07:30:38Z",
    thumbnail: "https://i.ytimg.com/vi/4p6T7W9lCkw/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=4p6T7W9lCkw",
    embedUrl: "https://www.youtube.com/embed/4p6T7W9lCkw"
  }
];

// Fallback all playlists
const FALLBACK_PLAYLISTS = [
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

// Fallback 5 posts
const FALLBACK_POSTS = [
  {
    id: 'UgkxRPQlM736iJJSwhVuc6qXTkGyyo5twn5P',
    source: 'youtube' as const,
    author: 'Floor Frost',
    avatar: '/logo.png',
    content: `Aakhirkar humne 1k subscribers ka ye milestone hit kar liya! 🎉\n\nZero se shuru kiya tha, aur aaj hum 1,000 Floor Frost family ke members ban chuke hain. Aap sabhi ke support, likes, aur har ek comment ke bina ye bilkul impossible tha.\n\nThank you har ek video ko pura dekhne aur support dikhane ke liye.\n\nYe toh bas shuruaat hai, aage abhi aur bhi crazy videos, epic gameplay, aur next-level content aane wala hai! 🚀\n\nKeep supporting & stay awesome! ❤️🎮\n— Floor Frost`,
    publishedAt: 'Recent',
    likes: '15 Likes',
    image: 'https://yt3.ggpht.com/WrH-vVrHBSpXAK7OU9NKjn_OV2uqiI4KaXBAnir4sS3xFZwhtFJj_n3kjlrjOc5c-xn3CwdyvgPRzg=s800-c-fcrop64=1,00000000ffffffff-rw-nd-v1',
    url: 'https://www.youtube.com/@floorfrost/posts'
  },
  {
    id: 'Ugkxkd7WvgLgaBvnyzgDdPjzH5xx1iomoIHv',
    source: 'youtube' as const,
    author: 'Floor Frost',
    avatar: '/logo.png',
    content: `🏎️💥 GET READY FOR THE ULTIMATE SPEED TEST! 💥🏎️\n\nAaj shaam 7:00 baje ek aisi racing game ki video aane wali hai jiske graphics aur high-octane action tumhare hosh uda denge! ⚡🔥\n\nCan you guess which monster track and machine we're pushing to the absolute limit today? 👇 Comment karke batao apni guessing skills!\n\nSet your reminders for 7:00 PM! Channel par milte hain! 🚀🎮`,
    publishedAt: 'Recent',
    likes: '2 Likes',
    image: 'https://yt3.ggpht.com/frvYv5AzI66stTvuzVZJbHcWtarH4YojVfj0o7JWoGHdjX8rdYsjOVmVvEd8QyPUn4dvwDfOsguUnw=s800-c-fcrop64=1,12000000edffffff-rw-nd-v1',
    url: 'https://www.youtube.com/@floorfrost/posts'
  },
  {
    id: 'discord-post-1',
    source: 'discord' as const,
    author: 'Floor Frost',
    avatar: '/logo.png',
    content: '🔥 WELCOME TO THE OFFICIAL FLOOR FROST DISCORD LEGION! Here you will get first-hand updates, shader pack configs, and direct voice hangouts!',
    publishedAt: 'Recent',
    likes: 'Pinned',
    image: null,
    url: 'https://discord.gg/aN5CCRT6CS'
  },
  {
    id: 'update-post-2',
    source: 'youtube' as const,
    author: 'Floor Frost',
    avatar: '/logo.png',
    content: '✨ New Ultra Realistic Shaders comparison episode is dropping soon! Tested on RTX 40-series cards at smooth 4K 120FPS. Check out the Videos gallery for all 10-day uploads!',
    publishedAt: 'Recent',
    likes: 'Community',
    image: null,
    url: 'https://youtube.com/@floorfrost'
  },
  {
    id: 'update-post-3',
    source: 'discord' as const,
    author: 'Floor Frost',
    avatar: '/logo.png',
    content: "🎮 Thank you all for the tremendous love on our daily Minecraft shader series! Don't forget to share your favorite shader preset in the comments or in our Discord server!",
    publishedAt: 'Recent',
    likes: 'Live',
    image: null,
    url: 'https://discord.gg/aN5CCRT6CS'
  }
];

export async function GET(request: NextRequest) {
  const apiKey = process.env.YOUTUBE_API_KEY || 'AIzaSyBUsCHTIIfcuUOG1FIFbNLZSfKVimEsqJM';
  const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UCRmkfvlZjgkCOZUqJenJC3A';
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const discordChannelId = process.env.DISCORD_CHANNEL_ID;

  const searchParams = request.nextUrl.searchParams;
  const limitParam = searchParams.get('limit');
  const maxResults = limitParam ? Math.min(50, Math.max(1, parseInt(limitParam))) : 50;

  // Convert Channel ID (UC...) to Uploads Playlist ID (UU...)
  const uploadsPlaylistId = channelId.replace(/^UC/, 'UU');

  try {
    const now = new Date();
    const tenDaysMs = 10 * 24 * 60 * 60 * 1000;

    // 1. Fetch channel uploads playlist items
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&key=${apiKey}&maxResults=${maxResults}`,
      { cache: 'no-store' }
    );

    let allVideos: any[] = [];
    if (videosRes.ok) {
      const vData = await videosRes.json();
      const items = vData.items || [];

      allVideos = items.map((item: any) => {
        const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
        const snippet = item.snippet || {};
        const thumbnails = snippet.thumbnails || {};
        const thumbnailUrl =
          thumbnails.maxres?.url ||
          thumbnails.high?.url ||
          thumbnails.medium?.url ||
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        const pubDate = new Date(snippet.publishedAt);
        const diffMs = now.getTime() - pubDate.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        let relativeTime = 'Uploaded Today';
        if (diffHours >= 24 && diffDays === 1) relativeTime = '1 day ago';
        else if (diffDays > 1 && diffDays < 30) relativeTime = `${diffDays} days ago`;
        else if (diffDays >= 30) relativeTime = pubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        return {
          id: videoId,
          title: snippet.title || 'Floor Frost Video',
          description: snippet.description || '',
          publishedAt: relativeTime,
          rawPublishedAt: snippet.publishedAt,
          diffDays: diffDays,
          isWithin10Days: diffMs <= tenDaysMs,
          thumbnail: thumbnailUrl,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          embedUrl: `https://www.youtube.com/embed/${videoId}`
        };
      });
    }

    let last10DaysVideos = allVideos.filter(v => v.isWithin10Days);
    if (last10DaysVideos.length === 0) {
      last10DaysVideos = FALLBACK_10_DAYS_VIDEOS;
    }

    if (allVideos.length === 0) {
      allVideos = FALLBACK_10_DAYS_VIDEOS;
    }

    // 2. Fetch Channel Playlists
    let playlists: any[] = [];
    try {
      const plRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${apiKey}`,
        { cache: 'no-store' }
      );
      if (plRes.ok) {
        const plData = await plRes.json();
        playlists = (plData.items || []).map((p: any) => ({
          id: p.id,
          title: p.snippet?.title || 'Playlist',
          description: p.snippet?.description || '',
          itemCount: p.contentDetails?.itemCount || 0,
          thumbnail:
            p.snippet?.thumbnails?.maxres?.url ||
            p.snippet?.thumbnails?.high?.url ||
            p.snippet?.thumbnails?.medium?.url ||
            p.snippet?.thumbnails?.default?.url ||
            '/logo.png',
          url: `https://www.youtube.com/playlist?list=${p.id}`
        }));
      }
    } catch (e) {
      console.error("Failed to fetch playlists:", e);
    }

    if (playlists.length === 0) {
      playlists = FALLBACK_PLAYLISTS;
    }

    // 3. Fetch Posts (YouTube Community Tab + Discord Announcements)
    const fetchedPosts: any[] = [];

    // Try YouTube community posts scraping
    try {
      const ytPostsRes = await fetch('https://www.youtube.com/@floorfrost/posts', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        cache: 'no-store'
      });

      if (ytPostsRes.ok) {
        const text = await ytPostsRes.text();
        const match = text.match(/var ytInitialData = ({[\s\S]*?});<\/script>/) || text.match(/ytInitialData\s*=\s*({[\s\S]+?});/);
        if (match) {
          const json = JSON.parse(match[1]);
          const tabs = json.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
          const postsTab = tabs.find((t: any) => t.tabRenderer?.title === 'Posts' || t.tabRenderer?.title === 'Community');
          const contents = postsTab?.tabRenderer?.content?.sectionListRenderer?.contents || [];
          const itemContents = contents[0]?.itemSectionRenderer?.contents || [];

          for (const item of itemContents) {
            const post = item.backstagePostThreadRenderer?.post?.backstagePostRenderer;
            if (post) {
              const imgThumbnails = post.backstageAttachment?.backstageImageRenderer?.image?.thumbnails;
              const bestImage = imgThumbnails && imgThumbnails.length > 0 ? imgThumbnails[imgThumbnails.length - 1]?.url : null;
              const postContent = post.contentText?.runs?.map((r: any) => r.text).join('') || '';

              fetchedPosts.push({
                id: post.postId,
                source: 'youtube',
                author: 'Floor Frost',
                avatar: '/logo.png',
                content: postContent,
                publishedAt: post.publishedTimeText?.runs?.[0]?.text || 'Recent',
                likes: post.voteCount?.simpleText || 'Community',
                image: bestImage,
                url: `https://www.youtube.com/post/${post.postId}`
              });
            }
          }
        }
      }
    } catch (e) {
      console.error("YT Community posts fetch error:", e);
    }

    // Try Discord Announcements
    if (botToken && discordChannelId) {
      try {
        const dRes = await fetch(`https://discord.com/api/v10/channels/${discordChannelId}/messages?limit=10`, {
          headers: { Authorization: `Bot ${botToken}` },
          cache: 'no-store'
        });
        if (dRes.ok) {
          const dData = await dRes.json();
          if (Array.isArray(dData)) {
            for (const msg of dData) {
              if (msg.content && msg.content.trim()) {
                const date = new Date(msg.timestamp);
                fetchedPosts.push({
                  id: msg.id,
                  source: 'discord',
                  author: msg.author?.global_name || msg.author?.username || 'Floor Frost',
                  avatar: msg.author?.avatar ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png` : '/logo.png',
                  content: msg.content,
                  publishedAt: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  likes: 'Discord Sync',
                  image: msg.attachments?.[0]?.url || null,
                  url: 'https://discord.gg/aN5CCRT6CS'
                });
              }
            }
          }
        }
      } catch (e) {
        console.error("Discord messages fetch error:", e);
      }
    }

    // Fill up to 5 posts with fallback if needed
    let finalPosts = [...fetchedPosts];
    if (finalPosts.length < 5) {
      for (const fb of FALLBACK_POSTS) {
        if (!finalPosts.some(p => p.id === fb.id) && finalPosts.length < 5) {
          finalPosts.push(fb);
        }
      }
    }
    finalPosts = finalPosts.slice(0, 5);

    return NextResponse.json({
      latestVideo: last10DaysVideos[0] || allVideos[0] || null,
      videos: allVideos,
      last10DaysVideos: last10DaysVideos,
      playlists: playlists,
      posts: finalPosts
    }, {
      headers: NO_CACHE_HEADERS
    });
  } catch (error: any) {
    console.error("Failed to fetch videos and ecosystem data:", error);
    return NextResponse.json({
      latestVideo: FALLBACK_10_DAYS_VIDEOS[0],
      videos: FALLBACK_10_DAYS_VIDEOS,
      last10DaysVideos: FALLBACK_10_DAYS_VIDEOS,
      playlists: FALLBACK_PLAYLISTS,
      posts: FALLBACK_POSTS,
      error: error.message || "Using fallback videos data"
    }, {
      status: 200,
      headers: NO_CACHE_HEADERS
    });
  }
}
