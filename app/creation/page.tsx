"use client";

import { useEffect } from "react";
import TeamCard from "@/components/TeamCard";
import { useLeagueStore } from "@/lib/store";

export default function CreationHub() {
  const {
    teams,
    finalizedCount,
    loadMockLeague,
    leagueName,
    leagueId,
  } = useLeagueStore();

  useEffect(() => {
    // if nothing loaded yet, load mock league so the page isn't empty
    if (!teams.length) void loadMockLeague();
  }, [teams.length, loadMockLeague]);

  const total = teams.length || 12;
  const pct = total ? Math.round((finalizedCount / total) * 100) : 0;

  return (
    <section className="px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-3">
          <h1 className="font-poster text-4xl tracking-tight">
            Creation Hub{leagueId ? ` (${leagueName})` : ""}
          </h1>
          <button
            onClick={() => location.assign("/content")}
            className="px-3 py-1.5 rounded-lg border border-foil-cyan/40 bg-foil-cyan/10 hover:bg-foil-cyan/20 transition"
          >
            Open Content Hub
          </button>
        </div>

        {/* Progress */}
        <div className="mb-2 text-sm text-white/70">
          Finalize Progress — {finalizedCount}/{total}
        </div>
        <div className="w-full h-2 rounded bg-white/10 overflow-hidden mb-6">
          <div
            className="h-full bg-foil-cyan/60"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((t) => (
            <TeamCard key={t.id} team={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
