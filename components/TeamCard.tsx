"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Pen, RefreshCcw, CheckCircle2 } from "lucide-react";
import type { Team } from "@/lib/store"; // ✅ type-only import
import { useLeagueStore } from "@/lib/store";

export default function TeamCard({ team }: { team: Team }) {
  const router = useRouter();
  const { randomizeTeamStyle, finalizeTeam } = useLeagueStore();

  return (
    <motion.div
      className="card-foil group"
      whileHover={{ rotateX: -3, rotateY: 3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="card-foil-inner p-4 relative">
        {team.finalized && <div className="psa-badge">FINALIZED</div>}
        <div
          className="rounded-xl p-4 flex items-center justify-center"
          style={{ background: team.primary, border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <img
            src={team.logo}
            alt={team.name}
            className="w-28 h-28 object-contain drop-shadow-[0_0_25px_rgba(0,224,255,0.35)]"
          />
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold">{team.name}</div>
          <div className="text-xs text-white/60">Mgr: {team.manager}</div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => router.push(`/team/${team.id}`)}
            className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm flex items-center justify-center gap-2"
          >
            <Pen size={14} /> Edit
          </button>
          <button
            onClick={() => randomizeTeamStyle(team.id)}
            className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm flex items-center justify-center gap-2"
          >
            <RefreshCcw size={14} /> Regenerate
          </button>
          <button
            onClick={() => finalizeTeam(team.id)}
            className="flex-1 px-3 py-2 rounded bg-foil-gold/20 border border-foil-gold/50 hover:shadow-foil-gold transition text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={14} /> Finalize
          </button>
        </div>
        <div className="holo-anim absolute inset-0 opacity-10 rounded-2xl" />
      </div>
    </motion.div>
  );
}
