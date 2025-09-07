/**
 * learning.ts
 * Tiny client-side learning repo. Replace with Vercel KV later if desired.
 */

export type LearnedMap = Record<string, string>; // key: normalized team name -> mascot

const STORAGE_KEY = "league-studio-learned-mascots:v1";

function normalizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export const LearningRepo = {
  load(): LearnedMap {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as LearnedMap) : {};
    } catch {
      return {};
    }
  },

  save(map: LearnedMap) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  },

  upsert(teamName: string, mascot: string) {
    const map = this.load();
    map[normalizeName(teamName)] = mascot;
    this.save(map);
  },

  get(teamName: string): string | undefined {
    const map = this.load();
    return map[normalizeName(teamName)];
  },

  toSuggestions(teamName: string) {
    const m = this.get(teamName);
    return m ? [{ mascot: m, confidence: "high", source: "learned" as const }] : [];
  },
};
