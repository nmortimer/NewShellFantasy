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
        {/* MEDIA: fixed 16:9 area so every card top is identical */}
        <div className="relative w-full pt-[56.25%] bg-gradient-to-br from-base-800/70 to-base-900/70">
          {team.finalized && (
            <div className="psa-badge z-20 absolute right-2 top-2">FINALIZED</div>
          )}
          <div className="absolute inset-0 grid place-items-center">
            <div className="w-[78%] h-[78%] rounded-xl grid place-items-center border border-white/10 bg-black/30 shadow-inner">
              <img
                src={team.logo}
                alt={team.name}
                className="max-w-[82%] max-h-[82%] object-contain drop-shadow-[0_0_22px_rgba(0,224,255,0.28)]"
              />
            </div>
          </div>
        </div>

        {/* BODY (flex-1 keeps heights equal regardless of names) */}
        <div className="flex-1 px-4 pt-3 pb-2">
          <h3 className="font-semibold leading-tight truncate">{team.name}</h3>
          <p className="text-xs text-white/60 -mt-0.5 truncate">Mgr: {team.manager}</p>

          {/* Meta – force single line with ellipsis */}
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

        {/* FOOTER (fixed height; buttons never wrap the card) */}
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
