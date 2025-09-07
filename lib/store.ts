import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildPollinationsLogoUrl, type LogoStyle } from "@/lib/image";
import { deriveMascot } from "@/lib/mascot";

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

  setLeagueFromImport: (payload: ImportPayload) => void;
  loadMockLeague: () => Promise<void>;
  updateTeam: (id: string, patch: Partial<Team>) => void;
  finalizeTeam: (id: string) => void;
  regenerateTeam: (id: string) => Promise<void>;
};

function computeFinalizedCount(teams: Team[]) {
  return teams.filter((t) => t.finalized).length;
}

function buildTeamFromRaw(m: any): Team {
  const style: LogoStyle = (m.stylePack ?? "modern") as LogoStyle;
  const name: string = String(m.name);
  const mascot = String(m.mascot ?? deriveMascot(name).mascot);
  const primary = String(m.primary);
  const secondary = String(m.secondary);
  const seed = String(m.seed ?? m.id);

  const logo =
    m.logo ??
    buildPollinationsLogoUrl({
      mascot,
      primary,
      secondary,
      style,
      seed,
    });

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
    logo,
    avatar: m.avatar,
  };
}

export const useLeagueStore = create<State>()(
  persist(
    (set, get) => ({
      leagueId: undefined,
      leagueName: undefined,
      teams: [],
      finalizedCount: 0,

      setLeagueFromImport: ({ leagueId, leagueName, teams }) => {
        const normalized = teams.map(buildTeamFromRaw);
        set({
          leagueId,
          leagueName,
          teams: normalized,
          finalizedCount: computeFinalizedCount(normalized),
        });
      },

      loadMockLeague: async () => {
        const raw: any = (await import("@/data/mockLeague.json")).default;
        const leagueId: string = raw?.leagueId ?? "MOCK";
        const leagueName: string = raw?.leagueName ?? "FTFL Premium Mock";
        const list: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.teams) ? raw.teams : [];
        const teams: Team[] = list.map(buildTeamFromRaw);
        set({ leagueId, leagueName, teams, finalizedCount: computeFinalizedCount(teams) });
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
        const seed = team.seed ?? team.id;
        const url = buildPollinationsLogoUrl({
          mascot: team.mascot,
          primary: team.primary,
          secondary: team.secondary,
          style,
          seed,
        });

        set({ teams: get().teams.map((t) => (t.id === id ? { ...t, logo: url } : t)) });

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
          /* ignore transient */
        }
      },
    }),
    { name: "league-studio" }
  )
);
