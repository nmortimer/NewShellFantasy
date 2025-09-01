"use client";

import type { Team } from "@/lib/store";

/**
 * TeamHero
 * - Big, dominant logo
 * - Clear facts: Manager, Mascot
 * - Palette row: color swatches + hex
 * - Style chip (title case)
 * - No watermark, no IDs
 * - Responsive: stacks gracefully under ~1024px
 */
export default function TeamHero({ team }: { team: Team }) {
  const mascot = team.mascot ?? team.name;

  return (
    <div className="relative h-full min-h-[420px] rounded-2xl overflow-hidden">
      {/* Background: subtle team-colored fog + dark base */}
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

      {/* Content grid */}
      <div className="relative z-10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-8 items-center">
          {/* BIG LOGO */}
          <div className="flex items-center justify-center md:justify-start">
            <div
              className="rounded-2xl border border-white/10 bg-black/20 shadow-inner flex items-center justify-center"
              style={{
                width: "min(420px, 46vw)",
                height: "min(420px, 46vw)"
              }}
            >
              <img
                src={team.logo}
                alt={`${team.name} logo`}
                className="object-contain"
                style={{
                  width: "75%",
                  height: "75%",
                  filter: "drop-shadow(0 0 32px rgba(0,224,255,0.35))"
                }}
              />
            </div>
          </div>

          {/* INFO PANEL */}
          <div className="min-w-0">
            {/* Header facts */}
            <div className="space-y-3">
              <div>
                <div className="text-sm text-white/60">Manager</div>
                <div className="text-xl font-semibold">{team.manager}</div>
              </div>
              <div>
                <div className="text-sm text-white/60">Mascot</div>
                <div className="text-base font-medium truncate">{mascot}</div>
              </div>
            </div>

            {/* Palette row */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PaletteChip label="Primary" color={team.primary} />
              <PaletteChip label="Secondary" color={team.secondary} />
            </div>

            {/* Style chip */}
            {team.stylePack && (
              <div className="mt-4">
                <span className="text-sm text-white/60 mr-2">Style</span>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/10 border border-white/10">
                  {capitalize(team.stylePack)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Frame */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" />
    </div>
  );
}

/* ========== Subcomponents ========== */

function PaletteChip({ label, color }: { label: string; color: string }) {
  const safe = normalizeHex(color);

  return (
    <div className="flex items-center gap-3">
      <span
        className="inline-block w-8 h-8 rounded-md border border-white/10"
        style={{ background: safe }}
        aria-label={`${label} swatch`}
        title={`${label} ${safe}`}
      />
      <div className="text-sm">
        <div className="text-white/60">{label}</div>
        <div className="px-2 py-1 rounded bg-white/10 border border-white/10 font-mono">
          {safe}
        </div>
      </div>
    </div>
  );
}

/* ========== Helpers ========== */

function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function normalizeHex(h: string) {
  if (!h) return "#000000";
  let v = h.startsWith("#") ? h : `#${h}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(v)) {
    const r = v[1],
      g = v[2],
      b = v[3];
    v = `#${r}${r}${g}${g}${b}${b}`;
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(v)) return "#000000";
  return v.toUpperCase();
}

/** convert #RRGGBB to rgba with alpha (0..1) */
function hexWithAlpha(hex: string, alpha: number) {
  try {
    const v = normalizeHex(hex);
    const r = parseInt(v.slice(1, 3), 16);
    const g = parseInt(v.slice(3, 5), 16);
    const b = parseInt(v.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return `rgba(0,0,0,${alpha})`;
  }
}
