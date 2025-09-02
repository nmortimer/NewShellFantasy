"use client";

import { useRouter } from "next/navigation";
import { Pen, RefreshCcw, CheckCircle2 } from "lucide-react";
import { useLeagueStore } from "@/lib/store";
import type { Team } from "@/lib/store";

export default function TeamCard({ team }: { team: Team }) {
  const router = useRouter();
  const store = useLeagueStore(); // <-- no destructuring; avoids stale names

  return (
    <article className="card-foil h-full">
      <div className="card-foil-inner h-full rounded-2xl overflow-hidden flex flex-col">
        {/* MEDIA: fixed 16:9 for consistent heights */}
        <div className="relative w-full pt-[56.25%] bg-black/30">
          {team.finalized && (
            <div className="psa-badge z-20 absolute right-2 top-2">FINALIZED</div>
          )}
          <div className="absolute inset-0 p-4">
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-base-800/70 to-base-900/70 border border-white/10 grid place-items-center">
              <img
                src={team.logo}
                alt={team.name}
                className="max-w-[78%] max-h-[78%] object-contain drop-shadow-[0_0_26px_rgba(0,224,255,0.35)]"
              />
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 px-4 pt-3 pb-2">
          <h3 className="font-semibold leading-tight truncate">{team.name}</h3>
          <p className="text-xs text-white/60 -mt-0.5">Mgr: {team.manager}</p>

          {/* Meta row – single line with ellipsis if cramped */}
          <div className="mt-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="mr-3">
              Primary{" "}
              <span className="font-mono" style={{ color: team.primary }}>
                {team.primary}
              </span>
            </span>
            <span className="mr-3">
              Secondary{" "}
              <span className="font-mono" style={{ color: team.secondary }}>
                {team.secondary}
              </span>
            </span>
            {team.stylePack && (
              <span>
                Style: {team.stylePack[0].toUpperCase() + team.stylePack.slice(1)}
              </span>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS – fixed height */}
        <div className="px-3 pb-3">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => router.push(`/team/${team.id}`)}
              className="btn-subtle"
              title="Edit"
            >
              <Pen size={14} className="opacity-80" />
              <span className="ml-1.5">Edit</span>
            </button>
            <button
              onClick={() => store.generateTeam(team.id)}
              className="btn-subtle"
              title="Regenerate"
            >
              <RefreshCcw size={14} className="opacity-80" />
              <span className="ml-1.5">Regen</span>
            </button>
            <button
              onClick={() => store.finalizeTeam(team.id)}
              className="btn-cta-gold"
              title="Finalize"
            >
              <CheckCircle2 size={14} className="opacity-90" />
              <span className="ml-1.5">Finalize</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
