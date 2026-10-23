import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// Helper: parse ISO 8601 duration e.g. PT28S, PT27M49S
function parseDuration(pt?: string): { formatted: string; seconds: number; isShort: boolean } {
  if (!pt) return { formatted: '0:28', seconds: 28, isShort: true };
  const match = pt.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return { formatted: '0:28', seconds: 28, isShort: true };
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const formatted = hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
  // YouTube shorts are under 3 minutes, typically <= 60s
  const isShort = totalSeconds <= 180;
  return { formatted, seconds: totalSeconds, isShort };
}

// Fallback Shorts from @FloorFrost
const FALLBACK_SHORTS = [
  {
    id: "0hD5rlnc0Wo",
    title: "The Secret To Ultra Graphics In Minecraft 🤫",
    description: "Insane ultra graphics trick in Minecraft with realistic shaders.",
    publishedAt: "Uploaded Today",
    rawPublishedAt: "2026-10-01T07:30:00Z",
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
    description: "Side by side comparison of default vanilla Minecraft vs ultra realistic shaders.",
    publishedAt: "1 day ago",
    rawPublishedAt: "2026-09-30T07:30:00Z",
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
    rawPublishedAt: "2026-09-29T07:30:26Z",
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
    rawPublishedAt: "2026-09-28T07:30:17Z",
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
    rawPublishedAt: "2026-09-27T07:30:15Z",
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
    rawPublishedAt: "2026-09-26T07:30:38Z",
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
    rawPublishedAt: "2026-09-25T07:30:33Z",
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
    rawPublishedAt: "2026-09-23T07:30:31Z",
    thumbnail: "https://i.ytimg.com/vi/hh0FgSVHVKk/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=hh0FgSVHVKk",
    embedUrl: "https://www.youtube.com/embed/hh0FgSVHVKk",
    duration: "0:28",
    durationSeconds: 28,
    isShort: true,
    type: "short"
  }
];

// Fallback Long / Full-Length Videos & Series from @FloorFrost
const FALLBACK_LONG_VIDEOS = [
  {
    id: "15jYDYxiqTM",
    title: "I Bought the McLaren Senna in Forza Horizon 5... Is It Worth It? 🏎️💸",
    description: "Testing the McLaren Senna with maximum upgrades and extreme high-speed highway testing in Forza Horizon 5 Hindi gameplay.",
    publishedAt: "Featured Gameplay",
    rawPublishedAt: "2026-09-10T12:00:00Z",
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
    rawPublishedAt: "2026-09-08T12:00:00Z",
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
    rawPublishedAt: "2026-09-05T12:00:00Z",
    thumbnail: "https://i.ytimg.com/vi/iCT_nI2IY4s/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=iCT_nI2IY4s",
    embedUrl: "https://www.youtube.com/embed/iCT_nI2IY4s",
    duration: "18:32",
    durationSeconds: 1112,
    isShort: false,
    type: "video"
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

// Pure YouTube Community Posts ONLY (Exact real channel posts, max 5)
const FALLBACK_YOUTUBE_POSTS = [
  {
    id: 'UgkxRPQlM736iJJSwhVuc6qXTkGyyo5twn5P',
    source: 'youtube' as const,
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
    source: 'youtube' as const,
    author: 'Floor Frost',
    avatar: '/logo.png',
    content: `🏎️💥 GET READY FOR THE ULTIMATE SPEED TEST! 💥🏎️\n\nAaj shaam 7:00 baje ek aisi racing game ki video aane wali hai jiske graphics aur high-octane action tumhare hosh uda denge! ⚡🔥\n\nCan you guess which monster track and machine we're pushing to the absolute limit today? 👇 Comment karke batao apni guessing skills!\n\nSet your reminders for 7:00 PM! Channel par milte hain! 🚀🎮`,
    publishedAt: '1 month ago',
    likes: '2 Likes',
    image: 'https://yt3.ggpht.com/frvYv5AzI66stTvuzVZJbHcWtarH4YojVfj0o7JWoGHdjX8rdYsjOVmVvEd8QyPUn4dvwDfOsguUnw=s800-c-fcrop64=1,12000000edffffff-rw-nd-v1',
    url: 'https://www.youtube.com/post/Ugkxkd7WvgLgaBvnyzgDdPjzH5xx1iomoIHv'
  }
];

// In-Memory Server Cache to strictly protect YouTube API Quota (10,000 units/day)
// Cache for 5 minutes (300,000ms): At most 288 calls to YouTube API in 24 hours (only ~864 units/day out of 10,000!)
let cachedVideoResponse: any = null;
let lastVideoFetchTime = 0;
const VIDEOS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const apiKey = process.env.YOUTUBE_API_KEY || 'AIzaSyBUsCHTIIfcuUOG1FIFbNLZSfKVimEsqJM';
  const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UCRmkfvlZjgkCOZUqJenJC3A';

  const nowMs = Date.now();

  // If cached data is still fresh (under 5 mins), return immediately with ZERO quota usage
  if (cachedVideoResponse && (nowMs - lastVideoFetchTime) < VIDEOS_CACHE_DURATION) {
    return NextResponse.json({
      ...cachedVideoResponse,
      cached: true,
      cacheRemainingSeconds: Math.round((VIDEOS_CACHE_DURATION - (nowMs - lastVideoFetchTime)) / 1000)
    }, {
      headers: NO_CACHE_HEADERS
    });
  }

  const searchParams = request.nextUrl.searchParams;
  const limitParam = searchParams.get('limit');
  const maxResults = limitParam ? Math.min(50, Math.max(1, parseInt(limitParam))) : 50;

  // Convert Channel ID (UC...) to Uploads Playlist ID (UU...)
  const uploadsPlaylistId = channelId.replace(/^UC/, 'UU');

  try {
    const now = new Date();
    const tenDaysMs = 10 * 24 * 60 * 60 * 1000;

    // 1. Fetch channel uploads playlist items
    let allVideos: any[] = [];
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&key=${apiKey}&maxResults=${maxResults}`,
      { cache: 'no-store' }
    );

    if (videosRes.ok) {
      const vData = await videosRes.json();
      const items = vData.items || [];
      const videoIds = items.map((i: any) => i.contentDetails?.videoId || i.snippet?.resourceId?.videoId).filter(Boolean);

      // Fetch video details (duration, statistics)
      const detailsMap = new Map<string, any>();
      if (videoIds.length > 0) {
        try {
          const detRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(',')}&key=${apiKey}`,
            { cache: 'no-store' }
          );
          if (detRes.ok) {
            const detData = await detRes.json();
            for (const item of detData.items || []) {
              detailsMap.set(item.id, item);
            }
          }
        } catch (e) {
          console.error("Failed to fetch video details:", e);
        }
      }

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

        const videoDetail = detailsMap.get(videoId);
        const durationISO = videoDetail?.contentDetails?.duration;
        const durInfo = parseDuration(durationISO);

        const titleText = snippet.title || 'Floor Frost Video';
        const isShort = durInfo.isShort || titleText.toLowerCase().includes('#short') || durInfo.seconds <= 180;

        return {
          id: videoId,
          title: titleText,
          description: snippet.description || '',
          publishedAt: relativeTime,
          rawPublishedAt: snippet.publishedAt,
          diffDays: diffDays,
          isWithin10Days: diffMs <= tenDaysMs,
          thumbnail: thumbnailUrl,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          duration: durInfo.formatted,
          durationSeconds: durInfo.seconds,
          isShort: isShort,
          type: isShort ? 'short' : 'video'
        };
      });
    }

    if (allVideos.length === 0) {
      allVideos = [...FALLBACK_SHORTS, ...FALLBACK_LONG_VIDEOS];
    }

    // Separate into Shorts and Long Videos
    let shorts = allVideos.filter(v => v.isShort);
    let longVideos = allVideos.filter(v => !v.isShort);

    // If channel mostly has shorts recently, supplement long videos with fallback long videos
    if (longVideos.length === 0) {
      longVideos = FALLBACK_LONG_VIDEOS;
    } else {
      // Ensure key series like Forza and Minecraft survival are also accessible if missing
      for (const fv of FALLBACK_LONG_VIDEOS) {
        if (!longVideos.some(lv => lv.id === fv.id)) {
          longVideos.push(fv);
        }
      }
    }

    if (shorts.length === 0) {
      shorts = FALLBACK_SHORTS;
    }

    let last10DaysVideos = allVideos.filter(v => v.isWithin10Days);
    if (last10DaysVideos.length === 0) {
      last10DaysVideos = allVideos.slice(0, 10);
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

    // 3. Fetch YouTube Community Posts ONLY (Max 5)
    const fetchedPosts: any[] = [];
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
                likes: post.voteCount?.simpleText ? `${post.voteCount.simpleText} Likes` : 'Community',
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

    const finalPosts = (fetchedPosts.length > 0 ? fetchedPosts : FALLBACK_YOUTUBE_POSTS).slice(0, 5);

    const responseData = {
      latestVideo: allVideos[0] || FALLBACK_SHORTS[0],
      videos: allVideos,
      shorts: shorts,
      longVideos: longVideos,
      last10DaysVideos: last10DaysVideos,
      playlists: playlists,
      posts: finalPosts
    };

    cachedVideoResponse = responseData;
    lastVideoFetchTime = now.getTime();

    return NextResponse.json(responseData, {
      headers: NO_CACHE_HEADERS
    });
  } catch (error: any) {
    console.error("Failed to fetch videos and ecosystem data:", error);
    if (cachedVideoResponse) {
      return NextResponse.json({ ...cachedVideoResponse, fromFallback: true }, { status: 200, headers: NO_CACHE_HEADERS });
    }
    return NextResponse.json({
      latestVideo: FALLBACK_SHORTS[0],
      videos: [...FALLBACK_SHORTS, ...FALLBACK_LONG_VIDEOS],
      shorts: FALLBACK_SHORTS,
      longVideos: FALLBACK_LONG_VIDEOS,
      last10DaysVideos: FALLBACK_SHORTS,
      playlists: FALLBACK_PLAYLISTS,
      posts: FALLBACK_YOUTUBE_POSTS.slice(0, 5),
      error: error.message || "Using fallback videos data"
    }, {
      status: 200,
      headers: NO_CACHE_HEADERS
    });
  }
}
