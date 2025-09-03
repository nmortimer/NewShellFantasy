"use client";

import { useId, useRef } from "react";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

import MatchupPoster, { type Matchup } from "@/components/posters/MatchupPoster";
import RecapPoster, { type Recap } from "@/components/posters/RecapPoster";
import PowerPoster, { type Power } from "@/components/posters/PowerPoster";

type Kind = "matchup" | "recap" | "power";

type PosterCardProps = {
  kind: Kind;
  data: Matchup | Recap | Power;
  week?: number;
  leagueName?: string; // may be undefined from store
  fileName?: string;
};

export default function PosterCard(props: PosterCardProps) {
  const { kind, data, week, leagueName, fileName } = props;

  // ✅ Safe defaults to satisfy child prop types
  const safeWeek = week ?? 1;
  const safeLeagueName = leagueName ?? "League Studio";

  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  async function handleDownload() {
    if (!ref.current) return;
    const node = ref.current;
    const canvas = await html2canvas(node, {
      backgroundColor: null,
      scale: Math.max(2, Math.min(3, window.devicePixelRatio || 1.5)),
      logging: false,
      useCORS: true,
    });
    const png = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = png;
    a.download = fileName || `${kind}-week-${safeWeek}.png`;
    a.click();
  }

  return (
    <div className="card-foil">
      <div className="card-foil-inner p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-white/70 capitalize">{kind} Poster</div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/12 bg-white/5 hover:bg-white/10 transition"
            title="Download PNG"
          >
            <Download size={16} className="opacity-80" />
            Download
          </button>
        </div>

        {/* Render stage (captures to PNG) */}
        <div id={id} ref={ref} className="w-full aspect-[4/5] rounded-xl relative overflow-hidden bg-base-700">
          <div className="absolute inset-0 bg-holo-gradient opacity-30" />

          {kind === "matchup" && (
            <MatchupPoster
              m={data as Matchup}
              week={safeWeek}
              leagueName={safeLeagueName}
            />
          )}

          {kind === "recap" && (
            <RecapPoster
              r={data as Recap}
              week={safeWeek}
              leagueName={safeLeagueName}
            />
          )}

          {kind === "power" && <PowerPoster p={data as Power} />}

          <div className="holo-anim absolute inset-0 opacity-10" />
        </div>
      </div>
    </div>
  );
}
