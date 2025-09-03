"use client";

import { useRouter } from "next/navigation";
import { Pen, RefreshCcw, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLeagueStore } from "@/lib/store";
import type { Team } from "@/lib/store";

export default function TeamCard({ team }: { team: Team }) {
  const router = useRouter();
  const store = useLeagueStore();

  return (
    <article className="card-foil h-full">
      <motion.div
        whileHover={{ y: -2, rotateX: 1.25, rotateY: -1.25 }}
        transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.6 }}
        className="card-foil-inner h-full rounded-2xl overflow-hidden flex flex-col"
      >
        {/* MEDIA: fixed 16:9; now clips all inner visuals so nothing bleeds into the title */}
        <div className="relative w-full pt-[56.25%] overflow-hidden">
          {team.finalized && (
            <div className="psa-badge z-20 absolute right-2 top-2">FINALIZED</div>
          )}

          {/* Centered SQUARE STAGE */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative rounded-xl border border-white/10 bg-black/30 shadow-inner overflow-hidden
                         w-[68%] max-w-[320px] aspect-square grid place-items-center"
            >
              {/* soft color vignettes */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(60% 60% at 30% 30%, ${hexA(
                    team.primary,
                    0.18
                  )} 0%, transparent 70%),
                               radial-gradient(60% 60% at 70% 70%, ${hexA(
                                 team.secondary,
                                 0.18
                               )} 0%, transparent 70%)`,
                }}
              />
              {/* Logo centered & contained */}
              <img
                src={team.logo}
                alt={team.name}
                className="relative z-[1] block w-[80%] h-[80%] object-contain"
                style={{ filter: "drop-shadow(0 0 22px rgba(0,224,255,0.28))" }}
              />
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 px-4 pt-3 pb-2">
          <h3 className="font-semibold leading-tight truncate">{team.name}</h3>
          <p className="text-xs text-white/60 -mt-0.5 truncate">Mgr: {team.manager}</p>
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
              <span>Style: {team.stylePack[0].toUpperCase() + team.stylePack.slice(1)}</span>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-3 pb-3">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => router.push(`/team/${team.id}`)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-white/12 bg-white/5 hover:bg-white/10 transition"
              title="Edit"
            >
              <Pen size={14} className="opacity-80" />
              Edit
            </button>
            <button
              onClick={() => store.generateTeam(team.id)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-white/12 bg-white/5 hover:bg-white/10 transition"
              title="Regenerate"
            >
              <RefreshCcw size={14} className="opacity-80" />
              Regen
            </button>
            <button
              onClick={() => store.finalizeTeam(team.id)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-foil-gold/50 bg-foil-gold/15 hover:bg-foil-gold/25 transition"
              title="Finalize"
            >
              <CheckCircle2 size={14} className="opacity-90" />
              Finalize
            </button>
          </div>
        </div>
      </motion.div>
    </article>
  );
}

/* helpers */
function hexA(hex: string, a: number) {
  const v = hex?.startsWith("#") ? hex.slice(1) : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(v)) return `rgba(0,0,0,${a})`;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
