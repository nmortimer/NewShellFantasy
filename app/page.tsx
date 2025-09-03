"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLeagueStore } from "@/lib/store";
import { Trophy, ChevronRight, MousePointerClick, Link2 } from "lucide-react";

type Platform = "sleeper" | "mfl" | "fleaflicker";

export default function Home() {
  const router = useRouter();
  const { loadMockLeague, setLeagueFromImport } = useLeagueStore();
  const [platform, setPlatform] = useState<Platform>("sleeper");
  const [leagueId, setLeagueId] = useState("");
  const [loading, setLoading] = useState<"load" | "mock" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canLoad = platform === "sleeper" && leagueId.trim().length > 0;

  async function handleLoad() {
    setError(null);
    if (platform !== "sleeper") return; // future: support mfl/fleaflicker
    try {
      setLoading("load");
      const res = await fetch(`/api/import/sleeper?leagueId=${encodeURIComponent(leagueId.trim())}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Failed to load league (${res.status})`);
      }
      const data = await res.json();
      setLeagueFromImport(data);
      router.push(`/creation?platform=${platform}&leagueId=${encodeURIComponent(leagueId.trim())}`);
    } catch (e: any) {
      setError(e?.message || "Unable to load league");
    } finally {
      setLoading(null);
    }
  }

  async function handleMock() {
    setError(null);
    try {
      setLoading("mock");
      await loadMockLeague();
      router.push("/creation");
    } catch (e: any) {
      setError(e?.message || "Unable to set up mock league");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 text-white/80 mb-3">
          <Trophy className="text-yellow-400" size={18} />
          <span className="font-semibold tracking-wide">LEAGUE STUDIO</span>
        </div>

        <h1 className="font-poster text-center text-6xl md:text-7xl mb-3">
          FANTASY LEAGUE <span className="text-foil-cyan">STUDIO</span>
        </h1>
        <p className="text-center text-white/70 max-w-3xl mx-auto">
          Auto-generate weekly matchup posters, recaps, and power rankings for your league.
        </p>

        {/* Stepper */}
        <section className="mt-10 grid gap-6">
          {/* Step 1 & 2 container */}
          <div className="rounded-2xl border border-white/10 card-foil overflow-hidden">
            <div className="card-foil-inner p-0">
              {/* Step 1 */}
              <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <StepBadge>1</StepBadge>
                  <div>
                    <div className="text-lg font-semibold">Choose your platform</div>
                    <div className="text-sm text-white/60">Start with Sleeper. (MFL/Fleaflicker soon)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PlatformButton selected={platform === "sleeper"} onClick={() => setPlatform("sleeper")} label="Sleeper" />
                  <PlatformButton selected={platform === "mfl"} onClick={() => setPlatform("mfl")} label="MFL" />
                  <PlatformButton selected={platform === "fleaflicker"} onClick={() => setPlatform("fleaflicker")} label="Fleaflicker" />
                </div>
              </div>

              <Divider />

              {/* Step 2 */}
              <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <StepBadge>2</StepBadge>
                  <div>
                    <div className="text-lg font-semibold">Paste your League ID</div>
                    <div className="text-sm text-white/60">We’ll import teams and owners into your Creation Hub.</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full max-w-xl">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" size={16} />
                    <input
                      value={leagueId}
                      onChange={(e) => setLeagueId(e.target.value)}
                      placeholder="Enter Sleeper League ID (e.g., 123456789012345678)"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-base-700 border border-white/10 focus:outline-none focus:ring-2 focus:ring-foil-cyan/40"
                    />
                  </div>
                  <button
                    onClick={handleLoad}
                    disabled={!canLoad || loading === "load"}
                    className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
                      canLoad
                        ? "border-foil-cyan/50 bg-foil-cyan/10 hover:bg-foil-cyan/20"
                        : "border-white/10 bg-white/5 text-white/50 cursor-not-allowed"
                    }`}
                  >
                    <ChevronRight size={16} />
                    {loading === "load" ? "Loading…" : "Load League"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Or Try Mock League */}
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <MousePointerClick size={18} className="opacity-80" />
              <div>
                <div className="font-semibold">Just want to see it in action?</div>
                <div className="text-sm text-white/60">
                  Try a full 12-team mock league. You can switch to your real league later.
                </div>
              </div>
            </div>
            <button
              onClick={handleMock}
              disabled={loading === "mock"}
              className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/5 transition"
            >
              {loading === "mock" ? "Setting up…" : "Try Mock League"}
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm">
              {error}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ---------- Small UI helpers ---------- */

function StepBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-8 h-8 rounded-full grid place-items-center font-semibold bg-foil-cyan/20 border border-foil-cyan/40">
      {children}
    </span>
  );
}

function PlatformButton({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border transition ${
        selected
          ? "border-foil-cyan/60 bg-foil-cyan/15 shadow-[0_0_0_1px_rgba(0,224,255,0.15)_inset]"
          : "border-white/12 bg-white/5 hover:bg-white/8"
      }`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-white/10" />;
}
