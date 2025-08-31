
"use client";

import { useEffect, useState } from "react";
import Confetti from "@/components/Confetti";
import { useLeagueStore } from "@/lib/store";
import { downloadAllLogosZip } from "@/lib/export";

export default function CompletePage() {
  const { teams } = useLeagueStore();
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    setCelebrate(true);
  }, []);

  return (
    <section className="px-6 py-16">
      {celebrate && <Confetti />}
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="font-poster text-5xl">Logos Finalized!</h1>
        <p className="text-white/70 mt-3">Your content hub is unlocked. Download all logos as a ZIP, or jump into posters.</p>
        <div className="mt-8 flex gap-3 justify-center">
          <button
            onClick={() => downloadAllLogosZip(teams)}
            className="px-6 py-3 rounded-lg bg-foil-cyan/20 border border-foil-cyan/40 hover:shadow-neon-cyan transition"
          >
            Download All Logos (ZIP)
          </button>
          <a
            href="/content"
            className="px-6 py-3 rounded-lg bg-foil-purple/20 border border-foil-purple/50 hover:shadow-neon-purple transition"
          >
            Go to Content Hub
          </a>
        </div>
      </div>
    </section>
  );
}
