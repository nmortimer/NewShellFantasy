"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Palette, CheckCircle2, Wand2, Rocket } from "lucide-react";
import RotaryKnob from "@/components/RotaryKnob";
import ColorPicker from "@/components/ColorPicker";
import TeamHero from "@/components/TeamHero";
import { useLeagueStore } from "@/lib/store";

const STYLE_KEYS = ["modern", "retro", "futuristic", "simple"] as const;
type StyleKey = typeof STYLE_KEYS[number];

export default function TeamEditor() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { teams, updateTeam, finalizeTeam, generateTeam } = useLeagueStore();
  const team = useMemo(() => teams.find((t) => t.id === id), [teams, id]);

  if (!team) {
    return (
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">Team not found.</div>
      </section>
    );
  }

  const styleKey: StyleKey = (team.stylePack as StyleKey) ?? "modern";
  const styleIndex = Math.max(0, STYLE_KEYS.indexOf(styleKey));

  return (
    <section className="px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-poster text-4xl tracking-tight mb-4">{team.name} Editor</h1>

        {/* Two columns. Right side stacks; left is a full-bleed Team Card that fills the column height. */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 items-stretch">
          {/* LEFT: full card */}
          <div className="card-foil h-full">
            <div className="card-foil-inner relative p-0 h-full">
              {team.finalized && <div className="psa-badge z-30">FINALIZED</div>}
              <TeamHero team={team} />
            </div>
          </div>

          {/* RIGHT: controls stack */}
          <div className="flex flex-col gap-6">
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
                <div className="text-xs text-white/50 mt-1">Used by AI for logo/style generation.</div>
              </div>
            </div>

            {/* Style */}
            <div className="card-foil">
              <div className="card-foil-inner p-5">
                <div className="flex items-center gap-2 text-white/80 mb-3">
                  <Wand2 size={16} /> Style
                </div>
                <RotaryKnob
                  value={styleIndex}
                  onChange={(idx) => updateTeam(team.id, { stylePack: STYLE_KEYS[idx as 0 | 1 | 2 | 3] })}
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
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80"><path fill="currentColor" d="M12 3v3l4-4l-4-4v3C6.48 1 2 5.48 2 11h2a8 8 0 0 1 8-8m8 8h2c0 5.52-4.48 10-10 10v3l-4-4l4-4v3a8 8 0 0 0 8-8"/></svg>
                Generate
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
