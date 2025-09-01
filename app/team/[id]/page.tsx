"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Palette, CheckCircle2, Wand2, Rocket } from "lucide-react";
import RotaryKnob from "@/components/RotaryKnob";
import ColorPicker from "@/components/ColorPicker";
import { useLeagueStore } from "@/lib/store";

const STYLE_KEYS = ["modern", "retro", "futuristic", "simple"] as const;
type StyleKey = typeof STYLE_KEYS[number];
const STYLE_LABEL: Record<StyleKey, string> = {
  modern: "Modern",
  retro: "Retro",
  futuristic: "Futuristic",
  simple: "Simple"
};

export default function TeamEditor() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { teams, updateTeam, finalizeTeam, generateTeam } = useLeagueStore();
  const team = useMemo(() => teams.find((t) => t.id === id), [teams, id]);

  if (!team) {
    return (
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">Team not found.</div>
      </section>
    );
  }

  const currentStyle = (team.stylePack as StyleKey) ?? "modern";
  const styleIndex = Math.max(0, STYLE_KEYS.indexOf(currentStyle));
  const styleLabel = STYLE_LABEL[currentStyle];

  return (
    <section className="px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-poster text-4xl tracking-tight mb-4">{team.name} Editor</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Info — compact and auto-height */}
          <div className="lg:col-span-2 card-foil">
            <div className="card-foil-inner p-6 relative">
              {team.finalized && <div className="psa-badge z-30">FINALIZED</div>}

              <div className="grid grid-cols-[auto,1fr] gap-6 items-start">
                {/* Logo */}
                <div
                  className="w-36 h-36 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: team.primary, boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.06)" }}
                >
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-28 h-28 object-contain drop-shadow-[0_0_25px_rgba(0,224,255,0.4)]"
                  />
                </div>

                {/* Facts */}
                <div className="min-w-0">
                  <div className="text-sm text-white/60">Manager</div>
                  <div className="text-xl font-semibold">{team.manager}</div>

                  <div className="mt-3">
                    <div className="text-sm text-white/60">Mascot</div>
                    <div className="text-base font-medium truncate">{team.mascot ?? team.name}</div>
                  </div>

                  {/* One-line badges; scroll if tight */}
                  <div className="mt-4 flex gap-3 text-sm whitespace-nowrap overflow-x-auto no-scrollbar pr-1">
                    <span className="px-2 py-1 rounded bg-white/10 border border-white/10">
                      Primary <span className="ml-1" style={{ color: team.primary }}>{team.primary}</span>
                    </span>
                    <span className="px-2 py-1 rounded bg-white/10 border border-white/10">
                      Secondary <span className="ml-1" style={{ color: team.secondary }}>{team.secondary}</span>
                    </span>
                    <span className="px-2 py-1 rounded bg-white/10 border border-white/10">
                      Style: {styleLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* No extra spacer; holo layer is absolute and doesn't affect height */}
              <div className="holo-anim absolute inset-0 opacity-10 z-0 rounded-2xl pointer-events-none" />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Mascot */}
            <div className="card-foil">
              <div className="card-foil-inner p-5">
                <div className="text-white/80 mb-2">Mascot</div>
                <input
                  value={team.mascot ?? team.name}
                  onChange={(e) => updateTeam(team.id, { mascot: e.target.value })}
                  placeholder="E.g., Bandits, Silverhawks, Wizards"
                  className="w-full px-3 py-2 rounded bg-base-700 border border-white/10"
                />
                <div className="text-xs text-white/50 mt-1">
                  Used by AI when generating logos and styles.
                </div>
              </div>
            </div>

            {/* Style Dial (analog, single selected chip handled inside component) */}
            <div className="card-foil">
              <div className="card-foil-inner p-5">
                <div className="flex items-center gap-2 text-white/80 mb-3">
                  <Wand2 size={16} /> Style
                </div>
                <RotaryKnob
                  value={styleIndex}
                  onChange={(idx) => {
                    const next = STYLE_KEYS[idx as 0 | 1 | 2 | 3];
                    updateTeam(team.id, { stylePack: next });
                  }}
                />
              </div>
            </div>

            {/* Colors */}
            <div className="card-foil">
              <div className="card-foil-inner p-5">
                <div className="flex items-center gap-2 text-white/80 mb-3">
                  <Palette size={16} /> Colors
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                  <ColorPicker
                    label="Primary"
                    color={team.primary}
                    onChange={(c) => updateTeam(team.id, { primary: c })}
                  />
                  <ColorPicker
                    label="Secondary"
                    color={team.secondary}
                    onChange={(c) => updateTeam(team.id, { secondary: c })}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                Back
              </button>

              <button
                onClick={() => generateTeam(team.id)}
                className="px-4 py-2 rounded-lg bg-foil-cyan/20 border border-foil-cyan/50 hover:shadow-neon-cyan transition flex items-center gap-2"
                title="Apply changes and refresh previews"
              >
                <Rocket size={18} /> Generate
              </button>

              <button
                onClick={() => finalizeTeam(team.id)}
                className="px-4 py-2 rounded-lg bg-foil-gold/20 border border-foil-gold/50 hover:shadow-foil-gold transition flex items-center gap-2"
              >
                <CheckCircle2 size={18} /> Finalize
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
