
"use client";

import { useEffect, useMemo, useState } from "react";
import Tabs from "@/components/Tabs";
import PosterCard from "@/components/PosterCard";
import { useLeagueStore } from "@/lib/store";
import JSZip from "jszip";
import { toPng } from "html-to-image";

type TabKey = "matchups" | "recaps" | "power";

export default function ContentPage() {
  const { teams, finalizedCount, leagueId } = useLeagueStore();
  const [week, setWeek] = useState<number>(1);
  const [active, setActive] = useState<TabKey>("matchups");

  useEffect(() => {
    if (finalizedCount < 12) {
      console.warn("Finalize all teams for the full experience.");
    }
  }, [finalizedCount]);

  const matchups = useMemo(() => pairMatchups(teams), [teams]);
  const recaps = useMemo(() => matchups.map(m => ({ ...m, scoreA: randScore(), scoreB: randScore() })), [matchups]);
  const power = useMemo(() => {
    const t = [...teams];
    t.sort((a, b) => a.name.localeCompare(b.name));
    return t.slice(0, 6);
  }, [teams]);

  const posters = useMemo(() => {
    if (active === "matchups") return matchups.map((m, i) => ({ kind: "matchup" as const, id: `match-${i}`, data: m }));
    if (active === "recaps") return recaps.map((m, i) => ({ kind: "recap" as const, id: `recap-${i}`, data: m }));
    return power.map((t, i) => ({ kind: "power" as const, id: `power-${i}`, data: { rank: i + 1, team: t } }));
  }, [active, matchups, recaps, power]);

  const downloadAll = async () => {
    const zip = new JSZip();
    for (const p of posters) {
      const node = document.getElementById(p.id);
      if (!node) continue;
      const dataUrl = await toPng(node as HTMLElement, { pixelRatio: 2 });
      const base64 = dataUrl.split(",")[1]!;
      zip.file(`${p.id}.png`, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `posters_${leagueId || "MOCK"}_week${week}_${active}.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-poster text-4xl">Content Hub</h1>
          <div className="flex items-center gap-3">
            <label className="text-white/70 text-sm">Week</label>
            <input
              type="number"
              min={1}
              value={week}
              onChange={(e) => setWeek(parseInt(e.target.value || "1"))}
              className="w-20 px-3 py-2 rounded bg-base-700 border border-white/10"
            />
            <button
              onClick={downloadAll}
              className="px-4 py-2 rounded-lg bg-foil-cyan/20 border border-foil-cyan/40 hover:shadow-neon-cyan transition"
            >
              Download All ({posters.length})
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Tabs
            tabs={[
              { key: "matchups", label: "Matchups" },
              { key: "recaps", label: "Recaps" },
              { key: "power", label: "Power Rankings" }
            ]}
            active={active}
            onChange={(k) => setActive(k as TabKey)}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posters.map((p) => (
            <PosterCard key={p.id} id={p.id} kind={p.kind as any} data={p.data as any} week={week} />
          ))}
        </div>
      </div>
    </section>
  );
}

function pairMatchups<T extends { id: string }>(arr: T[]) {
  const pairs: Array<{ a: T; b: T }> = [];
  for (let i = 0; i < arr.length; i += 2) {
    if (arr[i + 1]) pairs.push({ a: arr[i], b: arr[i + 1] });
  }
  return pairs;
}

function randScore() {
  return 80 + Math.floor(Math.random() * 80);
}
