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
  mascot?: string;
  stylePack?: "modern" | "retro" | "futuristic" | "simple";
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

const STYLES: Array<Team["stylePack"]> = ["modern", "retro", "futuristic", "simple"];

export const useLeagueStore = create<State>((set, get) => ({
  leagueId: null,
  leagueName: "Your League",
  teams: [],
  finalizedCount: 0,

  setLeagueId: (id) => set({ leagueId: id }),

  loadMockLeague: async () => {
    const seeded = (mock.teams as Team[]).map((t, idx) => ({
      ...t,
      mascot: t.name,
      stylePack: STYLES[idx % STYLES.length],
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
      const teams = s.teams.map((t) => {
        if (t.id !== id) return t;
        const i = STYLES.indexOf(t.stylePack || "modern");
        const next = STYLES[(i + 1) % STYLES.length];
        return { ...t, stylePack: next };
      });
      return { teams };
    }),

  finalizeTeam: (id) =>
    set((s) => {
      const teams = s.teams.map((t) => (t.id === id ? { ...t, finalized: true } : t));
      const finalizedCount = teams.filter((t) => t.finalized).length;
      return { teams, finalizedCount };
    })
}));
