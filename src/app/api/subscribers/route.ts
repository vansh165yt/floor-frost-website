import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  // If API Key or Channel ID is missing, return stable subscriber count matching Floor Frost (~1,390)
  if (!apiKey || !channelId) {
    return NextResponse.json({
      subscriberCount: "1390",
      viewCount: "125000",
      videoCount: "150",
      isLive: true,
      demoMode: true
    });
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`,
      { next: { revalidate: 30 } }
    );

    if (!res.ok) {
      throw new Error(`YouTube API responded with status ${res.status}`);
    }

    const data = await res.json();
    const stats = data.items?.[0]?.statistics;

    if (!stats) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    return NextResponse.json({
      subscriberCount: stats.subscriberCount,
      viewCount: stats.viewCount,
      videoCount: stats.videoCount,
      isLive: true,
      demoMode: false
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch YouTube statistics" },
      { status: 500 }
    );
  }
}
