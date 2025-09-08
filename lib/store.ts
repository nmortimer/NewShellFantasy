// lib/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LogoStyle } from "@/lib/prompt";
import { buildLogoPrompt } from "@/lib/prompt";
import { deriveMascot } from "@/lib/mascot";

/** ---------- Types ---------- */
export type Team = {
  id: string;
  name: string;
  manager: string;
  mascot: string;      // the prompt-friendly subject (e.g., "wolf head", "waffle icon")
  primary: string;     // hex
  secondary: string;   // hex
  stylePack?: LogoStyle;
  finalized?: boolean;
  logo?: string;       // generated image URL
  avatar?: string;
  seed?: string;       // stable per-team seed
};

type ImportPayload = {
  leagueId: string;
  leagueName: string;
  teams: Team[];
};

type State = {
  leagueId?: string;
  leagueName?: string;
  teams: Team[];
  finalizedCount: number;

  setLeagueFromImport: (payload: ImportPayload) => void;
  loadMockLeague: () => Promise<void>;
  updateTeam: (id: string, patch: Partial<Team>) => void;
  finalizeTeam: (id: string) => void;
  regenerateTeam: (id: string) => Promise<void>;
};

/** ---------- Helpers ---------- */

function computeFinalizedCount(teams: Team[]) {
  return teams.filter((t) => t.finalized).length;
}

/** Build a Pollinations URL from a prompt + seed. */
function pollinationsUrl(prompt: string, seed?: string, size = 1024) {
  const base = "https://image.pollinations.ai/prompt/";
  const qs = new URLSearchParams();
  if (seed) qs.set("seed", String(seed));
  qs.set("width", String(size));
  qs.set("height", String(size));
  // If you want to pin a model for flatter logos, uncomment:
  // qs.set("model", "flux");
  return `${base}${encodeURIComponent(prompt)}?${qs.toString()}`;
}

/** Normalizes raw team (from mock/API) into our Team shape and builds logo URL. */
function buildTeamFromRaw(m: any): Team {
  const name: string = String(m.name);
  const style: LogoStyle = (m.stylePack ?? "modern") as LogoStyle;
  const mascot: string = String(m.mascot ?? deriveMascot(name).mascot);
  const primary: string = String(m.primary);
  const secondary: string = String(m.secondary);
  const seed: string = String(m.seed ?? m.id);

  const prompt = buildLogoPrompt(name, mascot, primary, secondary, style);
  const logoUrl =
    m.logo ??
    pollinationsUrl(prompt, seed);

  return {
    id: String(m.id),
    name,
    manager: String(m.manager ?? "Manager"),
    mascot,
    primary,
    secondary,
    stylePack: style,
    finalized: Boolean(m.finalized) || false,
    seed,
    logo: logoUrl,
    avatar: m.avatar,
  };
}

/** ---------- Store ---------- */

export const useLeagueStore = create<State>()(
  persist(
    (set, get) => ({
      leagueId: undefined,
      leagueName: undefined,
      teams: [],
      finalizedCount: 0,

      /** Import from Sleeper/mock payloads (already parsed). */
      setLeagueFromImport: ({ leagueId, leagueName, teams }) => {
        const normalized = teams.map(buildTeamFromRaw);
        set({
          leagueId,
          leagueName,
          teams: normalized,
          finalizedCount: computeFinalizedCount(normalized),
        });
      },

      /** Load bundled mock league (supports object or array shape). */
      loadMockLeague: async () => {
        const raw: any = (await import("@/data/mockLeague.json")).default;
        const leagueId: string = raw?.leagueId ?? "MOCK";
        const leagueName: string = raw?.leagueName ?? "FTFL Premium Mock";
        const list: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.teams) ? raw.teams : [];
        const teams: Team[] = list.map(buildTeamFromRaw);
        set({
          leagueId,
          leagueName,
          teams,
          finalizedCount: computeFinalizedCount(teams),
        });
      },

      updateTeam: (id, patch) => {
        const teams = get().teams.map((t) => (t.id === id ? { ...t, ...patch } : t));
        set({ teams, finalizedCount: computeFinalizedCount(teams) });
      },

      finalizeTeam: (id) => {
        const teams = get().teams.map((t) => (t.id === id ? { ...t, finalized: true } : t));
        set({ teams, finalizedCount: computeFinalizedCount(teams) });
      },

      /** Regenerate logo using the new strict prompt builder. */
      regenerateTeam: async (id) => {
        const state = get();
        const team = state.teams.find((t) => t.id === id);
        if (!team) return;

        const style = team.stylePack ?? "modern";
        const seed = team.seed ?? team.id;

        const prompt = buildLogoPrompt(
          team.name,
          team.mascot,
          team.primary,
          team.secondary,
          style
        );
        const url = pollinationsUrl(prompt, seed);

        // optimistic update
        set({
          teams: state.teams.map((t) => (t.id === id ? { ...t, logo: url } : t)),
        });

        // Optional: probe once; if not ok, tweak seed for a different sample
        try {
          const res = await fetch(url, { method: "HEAD", cache: "no-store" });
          if (!res.ok) {
            const retrySeed = `${seed}-${Date.now()}`;
            const retryUrl = pollinationsUrl(prompt, retrySeed);
            set({
              teams: get().teams.map((t) =>
                t.id === id ? { ...t, logo: retryUrl, seed: retrySeed } : t
              ),
            });
          }
        } catch {
          // ignore transient network errors
        }
      },
    }),
    { name: "league-studio" }
  )
);
