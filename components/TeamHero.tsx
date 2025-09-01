"use client";

import type { Team } from "@/lib/store";
import { motion } from "framer-motion";

export default function TeamHero({ team }: { team: Team }) {
  const mascot = team.mascot ?? team.name;

  return (
    <div className="relative h-full min-h-[380px] rounded-2xl overflow-hidden">
      {/* Foil / gradient background driven by team colors */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 0% 0%, ${team.primary}22 0%, transparent 45%),
                       radial-gradient(120% 120% at 100% 100%, ${team.secondary}22 0%, transparent 45%),
                       linear-gradient(140deg, #0D0D0D 10%, #121212 55%, #181818 100%)`
        }}
      />

      {/* Subtle holo sweep */}
      <div className="absolute inset-0 holo-anim opacity-[0.08] pointer-events-none" />

      {/* Top row: logo + quick facts + badges */}
      <div className="relative z-10 p-6">
        <div className="grid grid-cols-[auto,1fr] gap-6 items-start">
          {/* Logo block */}
          <div
            className="w-36 h-36 rounded-xl grid place-items-center border border-white/10 shadow-inner"
            style={{ background: team.primary }}
          >
            <img
              src={team.logo}
              alt={team.name}
              className="w-28 h-28 object-contain drop-shadow-[0_0_26px_rgba(0,224,255,0.35)]"
            />
          </div>

          {/* Facts + badges */}
          <div className="min-w-0">
            <div className="text-sm text-white/60">Manager</div>
            <div className="text-xl font-semibold">{team.manager}</div>

            <div className="mt-2">
              <div className="text-sm text-white/60">Mascot</div>
              <div className="text-base font-medium truncate">{mascot}</div>
            </div>

            <div className="mt-3 flex gap-3 text-sm whitespace-nowrap overflow-x-auto no-scrollbar pr-1">
              <span className="px-2 py-1 rounded bg-white/10 border border-white/10">
                Primary <span className="ml-1" style={{ color: team.primary }}>{team.primary}</span>
              </span>
              <span className="px-2 py-1 rounded bg-white/10 border border-white/10">
                Secondary <span className="ml-1" style={{ color: team.secondary }}>{team.secondary}</span>
              </span>
              {team.stylePack && (
                <span className="px-2 py-1 rounded bg-white/10 border border-white/10">
                  Style: {team.stylePack[0].toUpperCase() + team.stylePack.slice(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Watermark logo center/back to fill the rest visually */}
      <motion.img
        src={team.logo}
        alt=""
        aria-hidden
        initial={{ scale: 0.9, opacity: 0.08 }}
        animate={{ scale: 1, opacity: 0.12 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[60%] max-h-[60%] object-contain pointer-events-none"
        style={{ filter: "drop-shadow(0 0 30px rgba(0, 224, 255, 0.25))" }}
      />

      {/* Bottom lockup: big team name */}
      <div className="absolute left-0 right-0 bottom-0 p-6">
        <div className="inline-flex flex-col">
          <span className="font-poster text-4xl leading-none tracking-wide">
            {team.name}
          </span>
          <span className="text-white/60 text-sm">#{team.id}</span>
        </div>
      </div>

      {/* Border frame */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" />
    </div>
  );
}
