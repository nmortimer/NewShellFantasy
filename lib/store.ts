
"use client";

import { create } from "zustand";
import mock from "@/data/mockLeague.json";

export type Team = {
  id: string;
  name: string;
  manager: string;
  primary: string;
  secondary: string;
  logo: string;
  stylePack?: "v1" | "v2" | "v3";
  finalized?: boolean;
};

type State = {
  leagueId: string | null;
  leagueName: string;
  teams: Team[];
  finalizedCount: number;
  setLeagueId: (id: string) => void;
  loadMockLeague: () => Promise<void>;
  updateTeam: (id: string, patch: Partial<Team>) => void;
  randomizeTeamStyle: (id: string) => void;
  finalizeTeam: (id: string) => void;
};

export const useLeagueStore = create<State>((set, get) => ({
  leagueId: null,
  leagueName: "Your League",
  teams: [],
  finalizedCount: 0,

  setLeagueId: (id) => set({ leagueId: id }),

  loadMockLeague: async () => {
    const seeded = (mock.teams as Team[]).map((t, idx) => ({
      ...t,
      stylePack: (["v1", "v2", "v3"] as const)[idx % 3],
      finalized: false
    }));
    set({
      teams: seeded,
      leagueId: mock.leagueId,
      leagueName: mock.leagueName,
      finalizedCount: 0
    });
  },

  updateTeam: (id, patch) =>
    set((s) => {
      const teams = s.teams.map((t) => (t.id === id ? { ...t, ...patch } : t));
      const finalizedCount = teams.filter((t) => t.finalized).length;
      return { teams, finalizedCount };
    }),

  randomizeTeamStyle: (id) =>
    set((s) => {
      const packs: Array<"v1" | "v2" | "v3"> = ["v1", "v2", "v3"];
      const teams = s.teams.map((t) =>
        t.id === id
          ? {
              ...t,
              stylePack: packs[(packs.indexOf(t.stylePack || "v1") + 1) % packs.length]
            }
          : t
      );
      return { teams };
    }),

  finalizeTeam: (id) =>
    set((s) => {
      const teams = s.teams.map((t) => (t.id === id ? { ...t, finalized: true } : t));
      const finalizedCount = teams.filter((t) => t.finalized).length;
      return { teams, finalizedCount };
    })
}));
