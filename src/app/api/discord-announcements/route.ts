import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_CHANNEL_ID;

  const searchParams = request.nextUrl.searchParams;
  const limitParam = searchParams.get('limit');
  const maxLimit = limitParam ? Math.min(100, Math.max(1, parseInt(limitParam))) : 50;

  // Fallback demo announcements if botToken or channelId is not provided yet
  if (!botToken || !channelId) {
    return NextResponse.json({
      isLive: false,
      announcements: [
        {
          id: 'demo-1',
          content: '🔥 WELCOME TO THE OFFICIAL FLOOR FROST DISCORD LEGION! Stay tuned here for daily Minecraft shader guides, live stream alerts, and exclusive community events! 🚀',
          author: {
            username: 'Floor Frost',
            avatar: '/logo.png'
          },
          publishedAt: 'Today at 1:30 PM',
          url: 'https://discord.gg/aN5CCRT6CS',
          attachments: []
        },
        {
          id: 'demo-2',
          content: '⚡ NEW VIDEO DROPPED! "Which Shader Is The Best Part 77" is now LIVE on YouTube! Check out the ultimate 4K gameplay test now! 🎮',
          author: {
            username: 'Floor Frost',
            avatar: '/logo.png'
          },
          publishedAt: 'Yesterday at 5:45 PM',
          url: 'https://discord.gg/aN5CCRT6CS',
          attachments: []
        },
        {
          id: 'demo-3',
          content: '🎮 MINECRAFT ULTRA SHADER UPDATE! We just posted our top 20 realistic shader comparison guide. Head over to YouTube or join our Discord discussion!',
          author: {
            username: 'Floor Frost',
            avatar: '/logo.png'
          },
          publishedAt: '2 days ago',
          url: 'https://discord.gg/aN5CCRT6CS',
          attachments: []
        }
      ]
    });
  }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages?limit=50`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 60 } // Cache Discord feed for 60s
      }
    );

    if (!res.ok) {
      throw new Error(`Discord API returned status ${res.status}`);
    }

    const data = await res.json();

    const formatDiscordTime = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 24) {
        return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      }
      if (diffDays === 1) return 'Yesterday';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const announcements = data
      .filter((msg: any) => (msg.content && msg.content.trim().length > 0) || (msg.attachments && msg.attachments.length > 0))
      .slice(0, maxLimit)
      .map((msg: any) => {
        const avatarUrl = msg.author?.avatar
          ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
          : '/logo.png';

        const attachments = (msg.attachments || []).map((att: any) => ({
          url: att.url,
          contentType: att.content_type
        }));

        return {
          id: msg.id,
          content: msg.content,
          author: {
            username: msg.author?.global_name || msg.author?.username || 'Floor Frost',
            avatar: avatarUrl
          },
          publishedAt: formatDiscordTime(msg.timestamp),
          url: `https://discord.com/channels/@me/${channelId}/${msg.id}`,
          attachments: attachments
        };
      });

    return NextResponse.json({
      isLive: true,
      announcements: announcements
    });
  } catch (error: any) {
    console.error("Discord API fetch error:", error);
    return NextResponse.json({
      isLive: false,
      error: error.message || "Failed to fetch Discord announcements",
      announcements: [
        {
          id: 'demo-1',
          content: '🔥 WELCOME TO THE OFFICIAL FLOOR FROST DISCORD LEGION! Join our server for live news, stream alerts, and community chat!',
          author: {
            username: 'Floor Frost',
            avatar: '/logo.png'
          },
          publishedAt: 'Today',
          url: 'https://discord.gg/aN5CCRT6CS',
          attachments: []
        }
      ]
    });
  }
}
