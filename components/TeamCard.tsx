"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Pen, RefreshCcw, CheckCircle2 } from "lucide-react";
import type { Team } from "@/lib/store"; // type-only import
import { useLeagueStore } from "@/lib/store";

export default function TeamCard({ team }: { team: Team }) {
  const router = useRouter();
  const { randomizeTeamStyle, finalizeTeam } = useLeagueStore();

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        className="card-foil group"
        whileHover={{ rotateX: -3, rotateY: 3, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="card-foil-inner relative p-4 flex flex-col overflow-hidden min-h-[340px]">
          {/* PSA badge ABOVE everything */}
          {team.finalized && <div className="psa-badge z-30">FINALIZED</div>}

          {/* LOGO BLOCK */}
          <div
            className="rounded-xl grid place-items-center border border-white/8 overflow-hidden"
            style={{ background: team.primary }}
          >
            <div className="w-full h-40 sm:h-44 md:h-48 px-3 grid place-items-center">
              <img
                src={team.logo}
                alt={team.name}
                className="w-full h-full object-contain drop-shadow-[0_0_26px_rgba(0,224,255,0.35)]"
                loading="lazy"
              />
            </div>
          </div>

          {/* TEXT */}
          <div className="mt-4">
            <div className="text-lg font-semibold truncate" title={team.name}>
              {team.name}
            </div>
            <div className="text-xs text-white/60 truncate" title={`Mgr: ${team.manager}`}>
              Mgr: {team.manager}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-1 rounded bg-white/7 border border-white/10">
                <span className="opacity-70">Primary</span>{" "}
                <span style={{ color: team.primary }}>{team.primary}</span>
              </span>
              <span className="px-2 py-1 rounded bg-white/7 border border-white/10">
                <span className="opacity-70">Secondary</span>{" "}
                <span style={{ color: team.secondary }}>{team.secondary}</span>
              </span>
              <span className="px-2 py-1 rounded bg-white/7 border border-white/10">
                Style: {team.stylePack}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-auto pt-4">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => router.push(`/team/${team.id}`)}
                className="px-3 py-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm flex items-center justify-center gap-2"
              >
                <Pen size={14} /> Edit
              </button>
              <button
                onClick={() => randomizeTeamStyle(team.id)}
                className="px-3 py-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm flex items-center justify-center gap-2"
              >
                <RefreshCcw size={14} /> Regen
              </button>
              <button
                onClick={() => finalizeTeam(team.id)}
                className="px-3 py-2 rounded bg-foil-gold/20 border border-foil-gold/50 hover:shadow-foil-gold transition text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={14} /> Finalize
              </button>
            </div>
          </div>

          {/* Holo sweep BEHIND content */}
          <div className="holo-anim absolute inset-0 opacity-10 rounded-2xl pointer-events-none z-0" />
        </div>
      </motion.div>
    </div>
  );
}
