"use client";

import { useMemo } from "react";
import { useLeagueStore } from "@/lib/store";
import { downloadAllLogosZip } from "@/lib/export";

export default function CompletePage() {
  const { teams, leagueId, leagueName, finalizedCount } = useLeagueStore();

  // Only include teams that actually have a logo and assert logo as string
  const exportable = useMemo(
    () =>
      teams
        .filter((t) => !!t.logo)
        .map((t) => ({ id: t.id, name: t.name, logo: t.logo as string })),
    [teams]
  );

  const allDone = finalizedCount >= 12;

  return (
    <main className="px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-poster text-4xl mb-2">All Set!</h1>
        <p className="text-white/70">
          {leagueName ? `League: ${leagueName}. ` : ""}
          {allDone
            ? "All teams are finalized — export your assets below."
            : `You’ve finalized ${finalizedCount}/12 teams. You can export current logos now or go back to finish.`}
        </p>

        <div className="mt-8 flex gap-3 justify-center">
          <button
            onClick={() => downloadAllLogosZip(exportable, leagueId)}
            disabled={exportable.length === 0}
            className={`px-6 py-3 rounded-lg border transition ${
              exportable.length === 0
                ? "opacity-50 cursor-not-allowed border-white/10 bg-white/5"
                : "bg-foil-cyan/20 border-foil-cyan/40 hover:shadow-neon-cyan"
            }`}
          >
            Download All Logos (ZIP)
          </button>

          <a
            href="/creation"
            className="px-6 py-3 rounded-lg bg-white/5 border border-white/12 hover:bg-white/10 transition"
          >
            Back to Creation Hub
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teams.map((t) => (
            <div key={t.id} className="card-foil">
              <div className="card-foil-inner p-3">
                <div className="aspect-square rounded-lg border border-white/10 bg-black/20 grid place-items-center overflow-hidden">
                  {t.logo ? (
                    <img
                      src={t.logo}
                      alt={`${t.name} logo`}
                      className="object-contain w-[92%] h-[92%]"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="text-white/50 text-sm">No logo yet</div>
                  )}
                </div>
                <div className="mt-2 text-sm font-medium truncate">{t.name}</div>
                <div className="text-xs text-white/60 truncate">{t.manager}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
