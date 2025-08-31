"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Palette, CheckCircle2, Wand2 } from "lucide-react";
import RotaryKnob from "@/components/RotaryKnob";
import ColorPicker from "@/components/ColorPicker";
import { useLeagueStore } from "@/lib/store";

export default function TeamEditor() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { teams, updateTeam, finalizeTeam } = useLeagueStore();
  const team = useMemo(() => teams.find((t) => t.id === id), [teams, id]);

  if (!team) {
    return (
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">Team not found.</div>
      </section>
    );
  }

  return (
    <section className="px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-poster text-4xl tracking-tight mb-4">{team.name} Editor</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview */}
          <div className="lg:col-span-2 card-foil">
            <div className="card-foil-inner p-6 min-h-[360px] relative">
              {team.finalized && <div className="psa-badge">FINALIZED</div>}
              <div className="flex items-center gap-6">
                <div
                  className="w-48 h-48 rounded-xl flex items-center justify-center"
                  style={{ background: team.primary, boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.06)" }}
                >
                  <img src={team.logo} alt={team.name} className="w-36 h-36 object-contain drop-shadow-[0_0_25px_rgba(0,224,255,0.4)]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white/60">Manager</div>
                  <div className="text-xl font-semibold">{team.manager}</div>
                  <div className="mt-4 flex gap-3 text-sm">
                    <span className="px-2 py-1 rounded bg-white/10 border border-white/10">
                      Primary <span className="ml-1" style={{ color: team.primary }}>{team.primary}</span>
                    </span>
                    <span className="px-2 py-1 rounded bg-white/10 border border-white/10">
                      Secondary <span className="ml-1" style={{ color: team.secondary }}>{team.secondary}</span>
                    </span>
                    <span className="px-2 py-1 rounded bg-white/10 border border-white/10">Style: {team.stylePack}</span>
                  </div>
                </div>
              </div>
              <div className="holo-anim absolute inset-0 opacity-10" />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="card-foil">
              <div className="card-foil-inner p-5">
                <div className="flex items-center gap-2 text-white/80 mb-3">
                  <Wand2 size={16} /> Style Dial
                </div>
                <RotaryKnob
                  value={["v1", "v2", "v3"].indexOf(team.stylePack ?? "v1")}
                  onChange={(idx) => {
                    const next = (["v1", "v2", "v3"] as const)[idx];
                    updateTeam(team.id, { stylePack: next });
                  }}
                />
              </div>
            </div>

            <div className="card-foil">
              <div className="card-foil-inner p-5">
                <div className="flex items-center gap-2 text-white/80 mb-3">
                  <Palette size={16} /> Colors
                </div>
                <div className="grid grid-cols-2 gap-4">
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

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                Back
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
