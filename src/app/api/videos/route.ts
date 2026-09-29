import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(request: NextRequest) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  const searchParams = request.nextUrl.searchParams;
  const limitParam = searchParams.get('limit');
  const maxResults = limitParam ? Math.min(50, Math.max(1, parseInt(limitParam))) : 25;

  // Convert Channel ID (UC...) to Uploads Playlist ID (UU...)
  const uploadsPlaylistId = channelId ? channelId.replace(/^UC/, 'UU') : null;

  if (!apiKey || !uploadsPlaylistId) {
    // Fallback static videos matching Floor Frost channel if API credentials are not set
    return NextResponse.json({
      latestVideo: {
        id: '8ru4SjK_UiY',
        title: 'Which Shader Is The Best Part 77! #minecraft #shaders',
        publishedAt: 'Uploaded Today',
        thumbnail: 'https://img.youtube.com/vi/8ru4SjK_UiY/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=8ru4SjK_UiY',
        embedUrl: 'https://www.youtube.com/embed/8ru4SjK_UiY'
      },
      videos: [
        { id: '8ru4SjK_UiY', title: 'Which Shader Is The Best Part 77! #minecraft #shaders', publishedAt: 'Uploaded Today', thumbnail: 'https://img.youtube.com/vi/8ru4SjK_UiY/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=8ru4SjK_UiY' },
        { id: 'J1InW-aepkY', title: 'I Transformed My Minecraft World With This 1 Shader 😱', publishedAt: '1 day ago', thumbnail: 'https://img.youtube.com/vi/J1InW-aepkY/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=J1InW-aepkY' },
        { id: 'hX8G4eoiVFc', title: 'I Found The Most Realistic Minecraft Shader 2026', publishedAt: '2 days ago', thumbnail: 'https://img.youtube.com/vi/hX8G4eoiVFc/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=hX8G4eoiVFc' },
        { id: 'EKmMj0sw38E', title: 'Minecraft Shader Comparison Which is Truly Most Realistic ?', publishedAt: '3 days ago', thumbnail: 'https://img.youtube.com/vi/EKmMj0sw38E/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=EKmMj0sw38E' }
      ]
    }, {
      headers: NO_CACHE_HEADERS
    });
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&key=${apiKey}&maxResults=${maxResults}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      throw new Error(`YouTube API responded with status ${res.status}`);
    }

    const data = await res.json();
    const items = data.items || [];

    const formatRelativeTime = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 24) return 'Uploaded Today';
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 30) return `${diffDays} days ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const videos = items.map((item: any) => {
      const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
      const snippet = item.snippet || {};
      const thumbnails = snippet.thumbnails || {};
      const thumbnailUrl = thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.medium?.url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      return {
        id: videoId,
        title: snippet.title,
        description: snippet.description,
        publishedAt: formatRelativeTime(snippet.publishedAt),
        thumbnail: thumbnailUrl,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`
      };
    });

    return NextResponse.json({
      latestVideo: videos[0] || null,
      videos: videos
    }, {
      headers: NO_CACHE_HEADERS
    });
  } catch (error: any) {
    console.error("Failed to fetch YouTube latest videos:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch YouTube videos" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
