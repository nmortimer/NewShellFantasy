"use client";

import Link from "next/link";
import { useLeagueStore } from "@/lib/store";

export default function Home() {
  const { loadMockLeague } = useLeagueStore();

  return (
    <main className="px-6 py-16">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="font-poster text-6xl md:text-7xl mb-4">
          FANTASY LEAGUE <span className="text-foil-cyan">STUDIO</span>
        </h1>
        <p className="text-white/70 max-w-3xl mx-auto">
          Premium matchup posters, recaps, and power rankings — generated
          automatically for your league.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/creation"
            className="px-5 py-2.5 rounded-lg border border-foil-cyan/50 bg-foil-cyan/10 hover:bg-foil-cyan/20 transition"
          >
            Go to Creation Hub
          </Link>
          <button
            onClick={async () => {
              await loadMockLeague();
              location.assign("/creation");
            }}
            className="px-5 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition"
          >
            Try Mock League
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard title="Export PNG/ZIP" body="Download poster packs or share a public gallery." />
          <FeatureCard title="Holo Trading Cards" body="Foil frames, neon glows, tilt and confetti." />
          <FeatureCard title="Finalize Flow" body="Lock in logos before content unlocks." />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 card-foil relative overflow-hidden">
      <div className="card-foil-inner pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative z-10 text-left">
        <div className="font-semibold">{title}</div>
        <div className="text-white/70 text-sm mt-1">{body}</div>
      </div>
    </div>
  );
}
