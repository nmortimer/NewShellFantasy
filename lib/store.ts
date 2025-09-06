import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildPollinationsLogoUrl, type LogoStyle } from "@/lib/image";

/** ---------- Types ---------- */
export type Team = {
  id: string;
  name: string;
  manager: string;
  mascot: string;
  primary: string;
  secondary: string;
  stylePack?: LogoStyle;
  finalized?: boolean;
  logo?: string;
  avatar?: string;
  seed?: string;
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

  /* mutations */
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

/** ---------- Store ---------- */
export const useLeagueStore = create<State>()(
  persist(
    (set, get) => ({
      leagueId: undefined,
      leagueName: undefined,
      teams: [],
      finalizedCount: 0,

      setLeagueFromImport: ({ leagueId, leagueName, teams }) => {
        set({
          leagueId,
          leagueName,
          teams,
          finalizedCount: computeFinalizedCount(teams),
        });
      },

      /** Load the bundled mock league (12 teams). */
      loadMockLeague: async () => {
        // dynamic import keeps things simple even if resolveJsonModule isn't set
        const mock = (await import("@/data/mockLeague.json")).default as Array<{
          id: string;
          name: string;
          manager: string;
          primary: string;
          secondary: string;
          stylePack?: LogoStyle;
        }>;

        const teams: Team[] = mock.map((m) => {
          const style = (m.stylePack ?? "modern") as LogoStyle;
          const mascot = m.name;
          return {
            id: m.id,
            name: m.name,
            manager: m.manager,
            mascot,
            primary: m.primary,
            secondary: m.secondary,
            stylePack: style,
            finalized: false,
            seed: m.id,
            logo: buildPollinationsLogoUrl({
              mascot,
              primary: m.primary,
              secondary: m.secondary,
              style,
              seed: m.id,
            }),
          };
        });

        set({
          leagueId: "MOCK",
          leagueName: "FTFL Premium Mock",
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

      /** Regenerate the logo via Pollinations (stable seed, retry-friendly). */
      regenerateTeam: async (id) => {
        const team = get().teams.find((t) => t.id === id);
        if (!team) return;

        const style = team.stylePack ?? "modern";
        const seed = team.seed ?? team.id;
        const url = buildPollinationsLogoUrl({
          mascot: team.mascot || team.name,
          primary: team.primary,
          secondary: team.secondary,
          style,
          seed,
        });

        // optimistic update
        set({
          teams: get().teams.map((t) => (t.id === id ? { ...t, logo: url } : t)),
        });

        // lightweight HEAD probe; if fails, tweak seed once
        try {
          const res = await fetch(url, { method: "HEAD", cache: "no-store" });
          if (!res.ok) {
            const retry = new URL(url);
            retry.searchParams.set("seed", `${seed}-${Date.now()}`);
            set({
              teams: get().teams.map((t) =>
                t.id === id
                  ? { ...t, logo: retry.toString(), seed: retry.searchParams.get("seed") || seed }
                  : t
              ),
            });
          }
        } catch {
          /* ignore network errors – browser will retry when visible */
        }
      },
    }),
    {
      name: "league-studio",
      partialize: (s) => s, // persist everything; you can narrow later
    }
  )
);
