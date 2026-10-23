import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_GUILD_ID = '1367366420135936010';
const DEFAULT_INVITE = 'https://discord.gg/aN5CCRT6CS';

export async function GET() {
  const guildId = process.env.DISCORD_GUILD_ID || DEFAULT_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  let onlineCount: number | null = null;
  let memberCount: number | null = null;
  let serverName: string = 'Floor Frost';
  let instantInvite: string = DEFAULT_INVITE;
  let isLive = false;

  // Attempt 1: Fetch via Discord Bot API (gives both online & total member counts)
  if (botToken && guildId) {
    try {
      const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 30 },
      });

      if (res.ok) {
        const data = await res.json();
        onlineCount = typeof data.approximate_presence_count === 'number' ? data.approximate_presence_count : null;
        memberCount = typeof data.approximate_member_count === 'number' ? data.approximate_member_count : null;
        if (data.name) serverName = data.name;
        isLive = true;
      }
    } catch {
      // Continue to fallback
    }
  }

  // Attempt 2: Fallback to Public Discord Widget API if Bot API failed or onlineCount not found
  if (onlineCount === null && guildId) {
    try {
      const widgetRes = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`, {
        next: { revalidate: 30 },
      });

      if (widgetRes.ok) {
        const widgetData = await widgetRes.json();
        onlineCount = typeof widgetData.presence_count === 'number' ? widgetData.presence_count : null;
        if (widgetData.name) serverName = widgetData.name;
        if (widgetData.instant_invite) instantInvite = widgetData.instant_invite;
        isLive = true;
      }
    } catch {
      // Continue to final fallback
    }
  }

  // Final fallback values if Discord is unreachable
  if (onlineCount === null) {
    onlineCount = 15;
  }
  if (memberCount === null) {
    memberCount = 30;
  }

  return NextResponse.json(
    {
      onlineCount,
      memberCount,
      serverName,
      instantInvite,
      isLive,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    }
  );
}
