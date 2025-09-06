"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLeagueStore } from "@/lib/store";
import RotaryKnob from "@/components/RotaryKnob";

export default function TeamEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const { teams, updateTeam, finalizeTeam, regenerateTeam } = useLeagueStore();
  const team = useMemo(() => teams.find((t) => t.id === id), [teams, id]);

  if (!team) {
    return (
      <main className="p-8">
        <div className="text-white/80">Team not found.</div>
      </main>
    );
  }

  const styleOptions: Array<"modern" | "retro" | "futuristic" | "simple"> = [
    "modern",
    "retro",
    "futuristic",
    "simple",
  ];

  return (
    <main className="p-6">
      {/* ...top content omitted for brevity... */}

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr,0.8fr] gap-6">
        {/* LEFT preview card ... */}

        {/* RIGHT controls */}
        <section className="space-y-6">
          {/* Mascot card ... */}

          <div className="card-foil">
            <div className="card-foil-inner p-5">
              <div className="text-white/80 mb-3">Style</div>
              <RotaryKnob
                value={styleOptions.indexOf(team.stylePack ?? "modern")}
                onChange={(idx) => {
                  const next = styleOptions[idx] ?? "modern";
                  updateTeam(team.id, { stylePack: next });
                }}
                labels={["Modern", "Retro", "Futuristic", "Simple"]}
              />
              <div className="mt-2 text-white/70 text-sm">
                Selected: {capitalize(team.stylePack ?? "modern")}
              </div>
            </div>
          </div>

          {/* Colors card, buttons, etc ... */}
        </section>
      </div>
    </main>
  );
}

function capitalize(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}
