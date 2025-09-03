"use client";

import { useId, useRef } from "react";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

import MatchupPoster from "@/components/posters/MatchupPoster";
import RecapPoster from "@/components/posters/RecapPoster";
import PowerPoster from "@/components/posters/PowerPoster";

/* ---------------- Types ---------------- */
type Kind = "matchup" | "recap" | "power";

export type PosterCardProps = {
  /** Optional DOM id, used by callers (e.g., to capture PNG/ZIP externally) */
  id?: string;
  kind: Kind;
  /** Accept any data shape; we normalize below for the specific poster components */
  data: any;
  week?: number;
  leagueName?: string;
  fileName?: string;
};

/* -------------- Normalizers (adapters for your existing data shapes) -------------- */

function toMatchupData(data: any) {
  // Accepts { a, b } or already-normalized { home, away }
  const a = data?.a ?? data?.home ?? {};
  const b = data?.b ?? data?.away ?? {};
  return {
    home: {
      id: a.id,
      name: a.name,
      logo: a.logo,
      primary: a.primary,
      secondary: a.secondary,
      record: a.record,
      score: a.score, // ignored by matchup poster, fine to pass
    },
    away: {
      id: b.id,
      name: b.name,
      logo: b.logo,
      primary: b.primary,
      secondary: b.secondary,
      record: b.record,
      score: b.score,
    },
  };
}

function toRecapData(data: any) {
  // Accepts { a, b, scoreA, scoreB } or normalized { home, away, winner }
  const a = data?.a ?? data?.home ?? {};
  const b = data?.b ?? data?.away ?? {};
  const scoreA = data?.scoreA ?? a?.score ?? 0;
  const scoreB = data?.scoreB ?? b?.score ?? 0;
  const winner = data?.winner ?? (scoreA >= scoreB ? "home" : "away");
  return {
    home: {
      id: a.id,
      name: a.name,
      logo: a.logo,
      primary: a.primary,
      secondary: a.secondary,
      score: scoreA,
    },
    away: {
      id: b.id,
      name: b.name,
      logo: b.logo,
      primary: b.primary,
      secondary: b.secondary,
      score: scoreB,
    },
    winner,
  };
}

function toPowerData(data: any) {
  // Accepts { items: [...] } OR single { rank, team } used by your page
  if (Array.isArray(data?.items)) return { items: data.items };
  const t = data?.team ?? {};
  const rank = data?.rank ?? 1;
  return {
    items: [
      {
        rank,
        name: t.name,
        logo: t.logo,
        primary: t.primary,
      },
    ],
  };
}

/* ---------------- Component ---------------- */

export default function PosterCard(props: PosterCardProps) {
  const { id, kind, data, week, leagueName, fileName } = props;

  // Safe defaults for required child props
  const safeWeek = week ?? 1;
  const safeLeagueName = leagueName ?? "League Studio";

  // If caller didn't pass an id, generate a stable client id for the capture box
  const fallbackId = useId().replace(/:/g, "-");
  const nodeId = id || `poster-${fallbackId}`;

  const ref = useRef<HTMLDivElement>(null);

  async function handleDownload() {
    const node = ref.current;
    if (!node) return;
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

  // Normalize data for specific poster components
  const matchupData = kind === "matchup" ? toMatchupData(data) : null;
  const recapData = kind === "recap" ? toRecapData(data) : null;
  const powerData = kind === "power" ? toPowerData(data) : null;

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
        <div
          id={nodeId}
          ref={ref}
          className="w-full aspect-[4/5] rounded-xl relative overflow-hidden bg-base-700"
        >
          <div className="absolute inset-0 bg-holo-gradient opacity-30" />

          {kind === "matchup" && matchupData && (
            <MatchupPoster m={matchupData} week={safeWeek} leagueName={safeLeagueName} />
          )}

          {kind === "recap" && recapData && (
            <RecapPoster r={recapData} week={safeWeek} leagueName={safeLeagueName} />
          )}

          {kind === "power" && powerData && <PowerPoster p={powerData} />}

          <div className="holo-anim absolute inset-0 opacity-10" />
        </div>
      </div>
    </div>
  );
}
