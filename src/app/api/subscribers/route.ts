import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

const FALLBACK_STATS = {
  subscriberCount: "1530",
  viewCount: "538072",
  videoCount: "96",
  isLive: true,
  demoMode: false,
};

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY || 'AIzaSyBUsCHTIIfcuUOG1FIFbNLZSfKVimEsqJM';
  const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UCRmkfvlZjgkCOZUqJenJC3A';

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`,
      { cache: 'no-store', next: { revalidate: 0 } }
    );

    if (!res.ok) {
      throw new Error(`YouTube API responded with status ${res.status}`);
    }

    const data = await res.json();
    const stats = data.items?.[0]?.statistics;

    if (!stats) {
      return NextResponse.json(
        { ...FALLBACK_STATS, lastUpdated: new Date().toISOString() },
        { status: 200, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json({
      subscriberCount: stats.subscriberCount,
      viewCount: stats.viewCount,
      videoCount: stats.videoCount,
      isLive: true,
      demoMode: false,
      lastUpdated: new Date().toISOString()
    }, {
      headers: NO_CACHE_HEADERS
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ...FALLBACK_STATS,
        lastUpdated: new Date().toISOString(),
        error: error.message || "Failed to fetch YouTube statistics"
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  }
}
