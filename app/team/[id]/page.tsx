"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLeagueStore } from "@/lib/store";
import RotaryKnob from "@/components/RotaryKnob";
import { suggestMascots } from "@/lib/mascot";
import { LearningRepo } from "@/lib/learning";

export default function TeamEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const store = useLeagueStore();
  const team = useMemo(() => store.teams.find((t) => t.id === id), [store.teams, id]);

  const [localMascot, setLocalMascot] = useState(team?.mascot || "");

  if (!team) {
    return (
      <main className="p-8">
        <div className="text-white/80">Team not found.</div>
      </main>
    );
  }

  // learned suggestions + rule suggestion merged, ranked
  const learned = LearningRepo.toSuggestions(team.name);
  const suggestions = suggestMascots(team.name, learned, 3);

  const styleOptions: Array<"modern" | "retro" | "futuristic" | "simple"> = [
    "modern",
    "retro",
    "futuristic",
    "simple",
  ];

  const applyMascot = (m: string) => {
    setLocalMascot(m);
    store.updateTeam(team.id, { mascot: m });
    // learn immediately (cheap, local)
    LearningRepo.upsert(team.name, m);
  };

  return (
    <main className="px-6 py-8">
      <h1 className="font-poster text-3xl mb-5">{team.name} Editor</h1>

      <div className="grid grid-cols-1 xl:grid-cols-[1.25fr,0.75fr] gap-6">
        {/* LEFT: big preview + info */}
        <section className="card-foil">
          <div className="card-foil-inner p-6">
            <div className="grid grid-cols-[minmax(260px,360px),1fr] gap-8 items-start">
              {/* Logo */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 w-full aspect-square grid place-items-center overflow-hidden">
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    className="object-contain w-[92%] h-[92%]"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/placeholders/logo-fallback.svg")}
                  />
                ) : (
                  <div className="text-white/50">No logo yet</div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-4">
                <div>
                  <div className="text-white/70 text-sm">Manager</div>
                  <div className="text-lg">{team.manager}</div>
                </div>

                <div>
                  <div className="text-white/70 text-sm mb-1">Mascot</div>
                  <input
                    value={localMascot}
                    onChange={(e) => setLocalMascot(e.target.value)}
                    onBlur={() => applyMascot(localMascot)}
                    className="w-full px-3 py-2 rounded bg-base-700 border border-white/10"
                    placeholder="e.g., fox head"
                  />
                  {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {suggestions.map((s) => (
                        <button
                          key={`${s.source}-${s.mascot}`}
                          onClick={() => applyMascot(s.mascot)}
                          className="px-2 py-1 rounded-lg border border-white/12 bg-white/5 hover:bg-white/10 text-sm"
                          title={`${s.source} • ${s.confidence}`}
                        >
                          {s.mascot}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-white/50 mt-1">
                    Used by AI when generating logos & styles. Choosing a chip teaches the system.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <ColorChip label="Primary" value={team.primary} />
                  <ColorChip label="Secondary" value={team.secondary} />
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-white/70 text-sm">Style</div>
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                    {capitalize(team.stylePack ?? "modern")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: controls */}
        <section className="space-y-6">
          {/* Style dial */}
          <div className="card-foil">
            <div className="card-foil-inner p-5">
              <div className="text-white/80 mb-3">Style</div>
              <RotaryKnob
                value={styleOptions.indexOf(team.stylePack ?? "modern")}
                onChange={(idx) => {
                  const next = styleOptions[idx] ?? "modern";
                  store.updateTeam(team.id, { stylePack: next });
                }}
                labels={["Modern", "Retro", "Futuristic", "Simple"]}
              />
              <div className="mt-2 text-white/70 text-sm">
                Selected: {capitalize(team.stylePack ?? "modern")}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="card-foil">
            <div className="card-foil-inner p-5">
              <div className="text-white/80 mb-3">Colors</div>
              <div className="grid grid-cols-2 gap-4">
                <ColorInput
                  label="Primary"
                  value={team.primary}
                  onChange={(v) => store.updateTeam(team.id, { primary: v })}
                />
                <ColorInput
                  label="Secondary"
                  value={team.secondary}
                  onChange={(v) => store.updateTeam(team.id, { secondary: v })}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg border border-white/12 bg-white/5 hover:bg-white/10 transition"
            >
              Back
            </button>
            <button
              onClick={() => store.regenerateTeam(team.id)}
              className="px-4 py-2 rounded-lg border border-foil-cyan/40 bg-foil-cyan/15 hover:shadow-neon-cyan transition"
            >
              Generate
            </button>
            <button
              onClick={() => {
                // learn on finalize too (if user typed something custom)
                LearningRepo.upsert(team.name, team.mascot);
                store.finalizeTeam(team.id);
                router.push("/creation");
              }}
              className="px-4 py-2 rounded-lg border border-foil-gold/40 bg-foil-gold/20 hover:shadow-neon-gold transition"
            >
              Finalize
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------- small helpers ---------- */

function ColorChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-block w-4 h-4 rounded border border-white/20" style={{ background: value }} />
      <span className="text-white/70 text-sm">{label}</span>
      <span className="text-white/90 text-sm font-mono">{value}</span>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="text-white/70 text-sm mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded border border-white/10 bg-transparent p-0"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-base-700 border border-white/10 font-mono"
        />
      </div>
    </label>
  );
}

function capitalize(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}
