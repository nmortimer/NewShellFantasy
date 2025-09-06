"use client";

import { useRouter } from "next/navigation";
import { Pen, RefreshCcw, CheckCircle2 } from "lucide-react";
import type { Team } from "@/lib/store";
import { useLeagueStore } from "@/lib/store";

export default function TeamCard({ team }: { team: Team }) {
  const router = useRouter();
  const { regenerateTeam, finalizeTeam } = useLeagueStore();

  return (
    <article className="card-foil h-full relative">
      {/* Finalized badge */}
      {team.finalized && (
        <div className="absolute right-3 top-3 z-20">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-foil-gold/50 bg-foil-gold/20 shadow-sm text-[11px] font-semibold tracking-wide">
            <CheckCircle2 size={14} className="text-yellow-300" />
            FINALIZED
          </span>
        </div>
      )}

      <div className="card-foil-inner p-4 flex flex-col h-full">
        {/* Logo zone */}
        <div className="relative rounded-xl border border-white/10 bg-black/20 overflow-hidden aspect-square grid place-items-center">
          {team.logo ? (
            <img
              src={team.logo}
              alt={`${team.name} logo`}
              className="object-contain w-[88%] h-[88%]"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/placeholders/logo-fallback.svg";
              }}
            />
          ) : (
            <div className="text-white/50 text-sm">No logo yet</div>
          )}
          <div className="absolute inset-0 bg-holo-gradient opacity-10 pointer-events-none" />
        </div>

        {/* Text */}
        <div className="mt-3">
          <div className="font-poster text-xl leading-tight truncate">{team.name}</div>
          <div className="text-xs text-white/60 truncate">Mgr: {team.manager}</div>

          <div className="mt-2 flex items-center gap-3">
            <Swatch label="P" color={team.primary} />
            <Swatch label="S" color={team.secondary} />
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
              {capitalize(team.stylePack ?? "modern")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <button
            onClick={() => router.push(`/team/${team.id}`)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-white/12 bg-white/5 hover:bg-white/10 transition"
            title="Edit"
          >
            <Pen size={14} />
            Edit
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => regenerateTeam(team.id)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-white/12 bg-white/5 hover:bg-white/10 transition"
              title="Regenerate"
            >
              <RefreshCcw size={14} />
              Generate
            </button>

            <button
              onClick={() => {
                finalizeTeam(team.id);
                // take user back to the hub after finalizing from the card
                // (you can remove this redirect if you only want the badge to toggle)
                // router.push("/creation");
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-foil-gold/40 bg-foil-gold/20 hover:shadow-neon-gold transition"
              title="Finalize"
            >
              <CheckCircle2 size={14} />
              Finalize
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px]">
      <span className="inline-block w-3.5 h-3.5 rounded border border-white/20" style={{ background: color }} />
      <span className="text-white/70">{label}</span>
      <span className="font-mono text-white/80">{color}</span>
    </span>
  );
}

function capitalize(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}
