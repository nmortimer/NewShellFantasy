"use client";

import { create } from "zustand";

/* ---------- Types ---------- */
export type StyleKey = "modern" | "retro" | "futuristic" | "simple";

export type Team = {
  id: string;
  name: string;
  manager: string;
  logo: string;
  primary: string;
  secondary: string;
  stylePack?: StyleKey;
  mascot?: string;
  finalized?: boolean;
  avatar?: string;
};

type ImportedLeague = {
  platform: "sleeper";
  leagueId: string;
  leagueName: string;
  teams: Team[];
};

type State = {
  leagueId?: string;
  leagueName?: string;
  teams: Team[];
  finalizedCount: number;

  /* actions */
  loadMockLeague: () => Promise<void>;
  setLeagueFromImport: (payload: ImportedLeague) => void;
  updateTeam: (id: string, patch: Partial<Team>) => void;
  generateTeam: (id: string) => void;
  finalizeTeam: (id: string) => void;
};

/* ---------- Helpers ---------- */
function pollinationsLogoUrl(opts: {
  mascot: string;
  primary: string;
  secondary: string;
  style: StyleKey;
}) {
  const { mascot, primary, secondary, style } = opts;
  const stylePhrase =
    style === "modern"
      ? "modern professional sports logo, sleek bold lines, neon edge"
      : style === "retro"
      ? "retro vintage sports logo, flat emblem 80s style"
      : style === "futuristic"
      ? "futuristic sci-fi sports logo, cyberpunk glow"
      : "minimal flat icon sports logo, bold silhouette";

  const prompt = [
    "Premium sports team logo, centered emblem",
    `mascot: ${mascot}`,
    stylePhrase,
    "esports / NBA alternate logo aesthetic",
    "no text, transparent or flat background",
    `primary color ${primary}, secondary color ${secondary}`,
    "holographic trading card vibe, subtle neon glow",
  ]
    .join(", ")
    .replace(/\s+/g, " ");

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
}

/* Simple seeded mock to keep UI alive without API */
function mockTeams(): Team[] {
  const names = [
    "Silverhawks",
    "Neon Wolves",
    "Crimson Tide",
    "Retro Rockets",
    "Cyber Knights",
    "Golden Bears",
    "Phantom Foxes",
    "Aqua Storm",
    "Violet Vipers",
    "Iron Giants",
    "Night Owls",
    "Scarlet Sharks",
  ];
  return names.map((n, i) => {
    const id = `t${i + 1}`;
    const primary = ["#00E0FF", "#FFD700", "#FF3B3B", "#9B30FF"][i % 4];
    const secondary = ["#181818", "#0D0D0D", "#ffffff", "#111111"][i % 4];
    const stylePack: StyleKey = (["modern", "retro", "futuristic", "simple"] as const)[i % 4];
    const mascot = n;
    return {
      id,
      name: n,
      manager: `Manager ${i + 1}`,
      primary,
      secondary,
      stylePack,
      mascot,
      finalized: false,
      logo: pollinationsLogoUrl({ mascot, primary, secondary, style: stylePack }),
    };
  });
}

/* ---------- Store ---------- */
export const useLeagueStore = create<State>()((set, get) => ({
  leagueId: undefined,
  leagueName: undefined,
  teams: [],
  finalizedCount: 0,

  async loadMockLeague() {
    const teams = mockTeams();
    set({
      leagueId: "mock",
      leagueName: "Mock League",
      teams,
      finalizedCount: teams.filter((t) => t.finalized).length,
    });
  },

  setLeagueFromImport(payload) {
    const teams = (payload.teams || []).map((t) => ({
      ...t,
      finalized: !!t.finalized,
    }));
    set({
      leagueId: payload.leagueId,
      leagueName: payload.leagueName,
      teams,
      finalizedCount: teams.filter((t) => t.finalized).length,
    });
  },

  updateTeam(id, patch) {
    const teams = get().teams.map((t) => (t.id === id ? { ...t, ...patch } : t));
    set({ teams });
  },

  generateTeam(id) {
    const state = get();
    const teams = state.teams.map((t) => {
      if (t.id !== id) return t;
      const mascot = (t.mascot ?? t.name).trim();
      const style: StyleKey = t.stylePack ?? "modern";
      const primary = t.primary ?? "#00E0FF";
      const secondary = t.secondary ?? "#181818";
      const logo = pollinationsLogoUrl({ mascot, primary, secondary, style });
      return { ...t, logo };
    });
    set({ teams });
  },

  finalizeTeam(id) {
    const teams = get().teams.map((t) => (t.id === id ? { ...t, finalized: true } : t));
    set({ teams, finalizedCount: teams.filter((t) => t.finalized).length });
  },
}));
