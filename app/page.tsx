"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  PlugZap,
  Info,
  CalendarDays,
  Trophy,
  Download,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { useLeagueStore } from "@/lib/store";

export default function Landing() {
  const router = useRouter();
  const [leagueId, setLeagueId] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const { loadMockLeague, setLeagueId: setId } = useLeagueStore();

  const connectSleeper = async () => {
    const id = leagueId.trim() || "MOCK";
    setId(id);
    if (id === "MOCK") {
      await loadMockLeague();
    } else {
      // ping our route (kept simple; we use mock data in UI)
      await fetch(`/api/league?leagueId=${encodeURIComponent(id)}`).catch(() => {});
    }
    router.push("/dashboard");
  };

  const useDemo = async () => {
    setId("MOCK");
    await loadMockLeague();
    router.push("/dashboard");
  };

  return (
    <section className="relative px-6 pb-20 pt-24 bg-base-900">
      <div className="absolute inset-0 bg-holo-gradient opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center">
          <h1 className="font-poster text-6xl md:text-7xl tracking-tight">
            Run a Better League <span className="text-foil-cyan">— Instantly</span>
          </h1>
          <p className="mt-4 text-white/80 max-w-3xl mx-auto">
            Fantasy League Studio turns your Sleeper league into weekly{" "}
            <span className="font-semibold">matchup posters</span>,{" "}
            <span className="font-semibold">recaps with scores</span>, and{" "}
            <span className="font-semibold">power rankings</span>. No design skills.
            No spreadsheets. Just plug in your league and share.
          </p>

          {/* Connect */}
          <div className="mt-8 flex flex-col md:flex-row gap-3 justify-center">
            <input
              className="px-4 py-3 rounded-lg bg-base-700 border border-white/10 focus-visible:glow w-full md:w-[28rem]"
              placeholder='Paste Sleeper League ID (e.g., "987654321234567890")'
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
            />
            <button
              onClick={connectSleeper}
              className="px-6 py-3 rounded-lg bg-foil-cyan/20 border border-foil-cyan/40 hover:shadow-neon-cyan transition"
              title="Use your real Sleeper league"
            >
              <div className="flex items-center gap-2">
                <PlugZap size={18} /> Connect Sleeper League
              </div>
            </button>
            <button
              onClick={useDemo}
              className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
              title="Explore with a full demo league"
            >
              Try Demo League
            </button>
          </div>

          <button
            onClick={() => setShowHelp((v) => !v)}
            className="mt-3 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white/90"
          >
            <Info size={14} />
            Where do I find my Sleeper League ID?
          </button>

          {showHelp && (
            <div className="mt-3 mx-auto max-w-2xl text-left text-white/75 bg-base-800 border border-white/10 rounded-xl p-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Open your league in the Sleeper app or on web.</li>
                <li>Tap the share icon → “Copy League Link”.</li>
                <li>
                  Paste the link here and grab the long number at the end — that’s the{" "}
                  <strong>League ID</strong>.
                </li>
              </ol>
              <div className="text-xs mt-2 opacity-80">
                Example: <code className="bg-black/30 px-1.5 py-0.5 rounded">https://sleeper.com/leagues/987654321234567890</code> →{" "}
                <code className="bg-black/30 px-1.5 py-0.5 rounded">987654321234567890</code>
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          <HowCard
            icon={<PlugZap />}
            title="1) Connect"
            text="Paste your Sleeper League ID. We pull teams, names, and colors automatically."
          />
          <HowCard
            icon={<Sparkles />}
            title="2) Customize"
            text="Tweak team cards in minutes — colors, styles, and logos. Lock them with a PSA-style badge."
          />
          <HowCard
            icon={<CalendarDays />}
            title="3) Share Weekly"
            text="Auto-generate matchup previews, recaps, and power rankings. Download PNGs or share a public gallery."
          />
        </div>

        {/* What you get */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Benefit
            icon={<Trophy />}
            title="Matchup Posters"
            text="Foil frames, neon glows, and bold titles for every weekly showdown."
          />
          <Benefit
            icon={<ShieldCheck />}
            title="Recaps & Scores"
            text="Highlight winners with a VICTORY stamp and clean final totals."
          />
          <Benefit
            icon={<Sparkles />}
            title="Power Rankings"
            text="Shimmering ranks with chrome badges. Perfect for weekly debates."
          />
          <Benefit
            icon={<Download />}
            title="Export & Gallery"
            text="One-click ZIPs and a public, read-only gallery for your league."
          />
        </div>

        {/* Social proof-ish micro copy */}
        <p className="mt-10 text-center text-sm text-white/60">
          Built for commissioners — fast to start, fun to share, and easy to keep your league engaged all season.
        </p>
      </div>
    </section>
  );
}

function HowCard({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card-foil">
      <div className="card-foil-inner p-6">
        <div className="text-foil-cyan flex items-center gap-2">
          <span className="opacity-90">{icon}</span>
          <span className="font-semibold">{title}</span>
        </div>
        <p className="text-sm text-white/75 mt-2">{text}</p>
      </div>
      <div className="holo-anim absolute inset-0 rounded-2xl opacity-10" />
    </div>
  );
}

function Benefit({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
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
