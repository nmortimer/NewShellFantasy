import { NextResponse } from "next/server";
import { buildPollinationsLogoUrl } from "@/lib/image";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/** ---------- utils ---------- */

const SLEEPER_AVATAR = (avatarId: string) =>
  `https://sleepercdn.com/avatars/${avatarId}`;

async function getJson<T>(url: string, timeoutMs = 15000): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

function colorFromId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  const primary = `#${hslToHex(h, 70, 50)}`;
  const secondary = `#${hslToHex((h + 200) % 360, 70, 55)}`;
  return { primary, secondary };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(255 * x).toString(16).padStart(2, "0");
  return `${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

/** ---------- Sleeper types ---------- */
type SleeperLeague = { name?: string };
type SleeperUser = {
  user_id: string;
  display_name: string;
  avatar?: string | null;
  metadata?: { team_name?: string | null } | null;
};

/** ---------- handler ---------- */
export async function GET(req: Request, ctx: { params: { provider: string } }) {
  const provider = (ctx.params?.provider || "").toLowerCase();
  const { searchParams } = new URL(req.url);
  const leagueId = searchParams.get("leagueId")?.trim();

  if (provider !== "sleeper") {
    return NextResponse.json(
      { error: `Unsupported provider "${provider}". Use "sleeper".` },
      { status: 400 }
    );
  }
  if (!leagueId) {
    return NextResponse.json({ error: "Missing leagueId" }, { status: 400 });
  }

  try {
    const [league, users] = await Promise.all([
      getJson<SleeperLeague>(`https://api.sleeper.app/v1/league/${leagueId}`),
      getJson<SleeperUser[]>(`https://api.sleeper.app/v1/league/${leagueId}/users`),
    ]);

    const leagueName = league?.name ?? `Sleeper League ${leagueId}`;

    const teams = (users || []).map((u) => {
      const teamName = u.metadata?.team_name?.trim() || u.display_name;
      const { primary, secondary } = colorFromId(u.user_id);
      const stylePack = "modern" as const;

      return {
        id: u.user_id,
        name: teamName,
        manager: u.display_name,
        avatar: u.avatar ? SLEEPER_AVATAR(u.avatar) : undefined,
        primary,
        secondary,
        stylePack,
        mascot: teamName,
        finalized: false,
        logo: buildPollinationsLogoUrl({
          mascot: teamName,
          primary,
          secondary,
          style: stylePack,
          seed: u.user_id, // stable per-team
        }),
      };
    });

    return NextResponse.json({
      platform: "sleeper",
      leagueId,
      leagueName,
      teams,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch Sleeper league", details: String(err?.message || err) },
      { status: 502 }
    );
  }
}
