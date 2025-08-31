
"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { useLeagueStore } from "@/lib/store";

type Matchup = { a: any; b: any };
type Recap = { a: any; b: any; scoreA: number; scoreB: number };
type Power = { rank: number; team: any };

export default function PosterCard({
  id,
  kind,
  data,
  week
}: {
  id: string;
  kind: "matchup" | "recap" | "power";
  data: Matchup | Recap | Power;
  week: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { leagueName } = useLeagueStore();

  const download = async () => {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current, { pixelRatio: 2 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${id}.png`;
    a.click();
  };

  return (
    <div className="card-foil">
      <div className="card-foil-inner p-4">
        <div id={id} ref={ref} className="w-full aspect-[4/5] rounded-xl relative overflow-hidden bg-base-700">
          <div className="absolute inset-0 bg-holo-gradient opacity-30" />
          {kind === "matchup" && <MatchupPoster m={data as Matchup} week={week} leagueName={leagueName} />}
          {kind === "recap" && <RecapPoster r={data as Recap} week={week} leagueName={leagueName} />}
          {kind === "power" && <PowerPoster p={data as Power} />}
          <div className="holo-anim absolute inset-0 opacity-10" />
        </div>

        <div className="mt-3">
          <button
            onClick={download}
            className="w-full px-3 py-2 rounded-lg bg-foil-cyan/20 border border-foil-cyan/40 hover:shadow-neon-cyan transition flex items-center justify-center gap-2"
          >
            <Download size={16} /> Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}

function MatchupPoster({ m, week, leagueName }: { m: Matchup; week: number; leagueName: string }) {
  return (
    <div className="absolute inset-0 grid grid-cols-2">
      <Side team={m.a} align="left" headline={`WEEK ${week} SHOWDOWN`} />
      <Side team={m.b} align="right" />
      <Divider />
      <Footer leagueName={leagueName} />
    </div>
  );
}

function RecapPoster({ r, week, leagueName }: { r: Recap; week: number; leagueName: string }) {
  const aWin = r.scoreA >= r.scoreB;
  return (
    <div className="absolute inset-0 grid grid-cols-2">
      <Side team={r.a} align="left" headline={`WEEK ${week} RECAP`} glow={aWin} score={r.scoreA} />
      <Side team={r.b} align="right" glow={!aWin} score={r.scoreB} />
      <Divider />
      <Footer leagueName={leagueName} victorySide={aWin ? "left" : "right"} />
    </div>
  );
}

function PowerPoster({ p }: { p: Power }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="text-sm text-white/70 tracking-widest">POWER RANK</div>
        <div className="font-poster text-8xl">{p.rank}</div>
        <div className="mt-2 px-6 py-4 rounded-xl bg-base-800 border border-white/10 inline-flex items-center gap-3">
          <img src={p.team.logo} className="w-14 h-14" />
          <div>
            <div className="text-xl font-semibold">{p.team.name}</div>
            <div className="text-xs text-white/60">Mgr: {p.team.manager}</div>
          </div>
        </div>
        <div className="mt-4 h-1 w-40 mx-auto rounded bg-foil-cyan/40 animate-pulse" />
      </div>
    </div>
  );
}

function Side({
  team,
  align,
  headline,
  glow,
  score
}: {
  team: any;
  align: "left" | "right";
  headline?: string;
  glow?: boolean;
  score?: number;
}) {
  return (
    <div
      className="relative flex flex-col items-center justify-center p-6"
      style={{ background: align === "left" ? team.primary : team.secondary }}
    >
      {headline && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 font-poster text-2xl tracking-wide drop-shadow">
          {headline}
        </div>
      )}
      <img
        src={team.logo}
        className="w-28 h-28 object-contain"
        style={{ filter: glow ? "drop-shadow(0 0 20px rgba(255,255,255,0.9))" : "drop-shadow(0 0 10px rgba(0,0,0,0.25))" }}
      />
      <div className="font-poster text-2xl mt-2">{team.name}</div>
      {typeof score === "number" && (
        <div className="mt-1 text-4xl font-extrabold">{score}</div>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-white/20">
      <div className="absolute inset-y-0 -left-4 right-0 bg-gradient-to-b from-transparent via-white/20 to-transparent skew-x-6" />
    </div>
  );
}

function Footer({ leagueName, victorySide }: { leagueName: string; victorySide?: "left" | "right" }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
      <div className="text-xs text-white/80">{leagueName || "Fantasy League"}</div>
      {victorySide && (
        <div className="px-3 py-1 rounded bg-white text-black text-xs font-bold tracking-widest">VICTORY</div>
      )}
    </div>
  );
}
