import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildPollinationsLogoUrl, type LogoStyle } from "@/lib/image";

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
  seed?: string; // optional, stabilize generations
};

type State = {
  leagueId?: string;
  leagueName?: string;
  teams: Team[];
  finalizedCount: number;
  setLeagueFromImport: (payload: {
    leagueId: string;
    leagueName: string;
    teams: Team[];
  }) => void;
  updateTeam: (id: string, patch: Partial<Team>) => void;
  finalizeTeam: (id: string) => void;
  regenerateTeam: (id: string) => Promise<void>;
};

function computeFinalizedCount(teams: Team[]) {
  return teams.filter((t) => t.finalized).length;
}

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

      updateTeam: (id, patch) => {
        const teams = get().teams.map((t) => (t.id === id ? { ...t, ...patch } : t));
        set({ teams, finalizedCount: computeFinalizedCount(teams) });
      },

      finalizeTeam: (id) => {
        const teams = get().teams.map((t) => (t.id === id ? { ...t, finalized: true } : t));
        set({ teams, finalizedCount: computeFinalizedCount(teams) });
      },

      regenerateTeam: async (id) => {
        const team = get().teams.find((t) => t.id === id);
        if (!team) return;

        const style = team.stylePack ?? "modern";
        const seed = team.seed ?? team.id; // stable but customizable
        const url = buildPollinationsLogoUrl({
          mascot: team.mascot || team.name,
          primary: team.primary,
          secondary: team.secondary,
          style,
          seed,
        });

        // optimistic update to show something immediately
        set({
          teams: get().teams.map((t) =>
            t.id === id ? { ...t, logo: url } : t
          ),
        });

        // Optional lightweight retry to dodge transient 404/429
        try {
          const res = await fetch(url, { method: "HEAD", cache: "no-store" });
          if (!res.ok) {
            const retryUrl = new URL(url);
            retryUrl.searchParams.set("seed", `${seed}-${Date.now()}`);
            set({
              teams: get().teams.map((t) =>
                t.id === id ? { ...t, logo: retryUrl.toString(), seed: retryUrl.searchParams.get("seed") || seed } : t
              ),
            });
          }
        } catch {
          /* network hiccup: we keep optimistic URL; browser will retry when visible */
        }
      },
    }),
    {
      name: "league-studio",
      partialize: (s) => s,
    }
  )
);
