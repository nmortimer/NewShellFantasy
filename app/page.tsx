
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, ShieldCheck, UploadCloud } from "lucide-react";
import { useLeagueStore } from "@/lib/store";

export default function Landing() {
  const router = useRouter();
  const [leagueId, setLeagueId] = useState("");
  const { loadMockLeague, setLeagueId: setId } = useLeagueStore();

  const goDashboard = async () => {
    setId(leagueId || "MOCK");
    if (!leagueId || leagueId === "MOCK") {
      await loadMockLeague();
    } else {
      await fetch(`/api/league?leagueId=${encodeURIComponent(leagueId)}`).then(() => {});
    }
    router.push("/dashboard");
  };

  const loadMock = async () => {
    setId("MOCK");
    await loadMockLeague();
    router.push("/dashboard");
  };

  return (
    <section className="relative px-6 pb-16 pt-24 bg-base-900">
      <div className="absolute inset-0 bg-holo-gradient opacity-30 pointer-events-none" />
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="font-poster text-6xl md:text-7xl tracking-tight">
          Fantasy League <span className="text-foil-cyan">Studio</span>
        </h1>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
          Premium matchup posters, last week’s recaps, and power rankings — automatically. Feels like NBA 2K MyTeam meets Sleeper UI.
        </p>

        <div className="mt-10 flex flex-col md:flex-row gap-3 justify-center">
          <input
            className="px-4 py-3 rounded-lg bg-base-700 border border-white/10 focus-visible:glow w-full md:w-96"
            placeholder="Enter Sleeper League ID (or leave blank for mock)"
            value={leagueId}
            onChange={(e) => setLeagueId(e.target.value)}
          />
          <button
            onClick={goDashboard}
            className="px-6 py-3 rounded-lg bg-foil-cyan/20 border border-foil-cyan/40 hover:shadow-neon-cyan transition"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={18} /> Load League
            </div>
          </button>
          <button
            onClick={loadMock}
            className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} /> Try Mock League
            </div>
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature icon={<UploadCloud />} title="Export PNG/ZIP" text="Download poster packs or share your public gallery." />
          <Feature icon={<Sparkles />} title="Holo Trading Cards" text="Foil frames, neon glows, tilt and confetti unlocks." />
          <Feature icon={<ShieldCheck />} title="Finalize Flow" text="Lock in logos with a PSA-style badge before content unlocks." />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="card-foil">
      <div className="card-foil-inner p-6">
        <div className="text-foil-cyan">{icon}</div>
        <h3 className="mt-3 font-semibold">{title}</h3>
        <p className="text-sm text-white/70 mt-1">{text}</p>
      </div>
      <div className="holo-anim absolute inset-0 rounded-2xl opacity-10" />
    </div>
  );
}
