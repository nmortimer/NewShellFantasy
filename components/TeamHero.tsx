"use client";

import type { Team } from "@/lib/store";
import { motion } from "framer-motion";

export default function TeamHero({ team }: { team: Team }) {
  const mascot = (team.mascot ?? team.name).toUpperCase();

  return (
    <div className="relative h-full min-h-[380px] rounded-2xl overflow-hidden">
      {/* Background: subtle foil + team color glows */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 0% 0%, ${hexWithAlpha(
            team.primary,
            0.18
          )} 0%, transparent 45%),
                       radial-gradient(120% 120% at 100% 100%, ${hexWithAlpha(
                         team.secondary,
                         0.18
                       )} 0%, transparent 45%),
                       linear-gradient(140deg, #0D0D0D 10%, #121212 55%, #181818 100%)`
        }}
      />
      <div className="absolute inset-0 holo-anim opacity-[0.08] pointer-events-none" />

      {/* Content */}
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
              <div className="text-base font-medium truncate">
                {team.mascot ?? team.name}
              </div>
            </div>

            <div className="mt-3 flex gap-3 text-sm whitespace-nowrap overflow-x-auto no-scrollbar pr-1">
              <span className="px-2 py-1 rounded bg-white/10 border border-white/10">
                Primary{" "}
                <span className="ml-1" style={{ color: team.primary }}>
                  {team.primary}
                </span>
              </span>
              <span className="px-2 py-1 rounded bg-white/10 border border-white/10">
                Secondary{" "}
                <span className="ml-1" style={{ color: team.secondary }}>
                  {team.secondary}
                </span>
              </span>
              {team.stylePack && (
                <span className="px-2 py-1 rounded bg-white/10 border border-white/10">
                  Style: {capitalize(team.stylePack)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Faint mascot/team watermark (no duplicate logo, no #id) */}
      <motion.div
        initial={{ opacity: 0.04, scale: 0.98 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ color: team.primary }}
      >
        <span className="font-poster text-[140px] leading-none tracking-wide uppercase">
          {mascot}
        </span>
      </motion.div>

      {/* Bottom left lockup: team name only */}
      <div className="absolute left-0 bottom-0 p-6">
        <span className="font-poster text-3xl leading-none tracking-wide">
          {team.name}
        </span>
      </div>

      {/* Frame */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" />
    </div>
  );
}

/* helpers */
function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

/** convert #RRGGBB to rgba with alpha (0..1) */
function hexWithAlpha(hex: string, alpha: number) {
  try {
    const h = hex.replace("#", "");
    if (h.length !== 6) return `rgba(0,0,0,${alpha})`;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return `rgba(0,0,0,${alpha})`;
  }
}
