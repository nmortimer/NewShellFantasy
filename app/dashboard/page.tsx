
"use client";

import { useEffect } from "react";
import TeamCard from "@/components/TeamCard";
import ProgressBar from "@/components/ProgressBar";
import { useLeagueStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { teams, finalizedCount, loadMockLeague, leagueId } = useLeagueStore();
  const router = useRouter();

  useEffect(() => {
    if (!teams.length) {
      loadMockLeague();
    }
  }, [teams.length, loadMockLeague]);

  return (
    <section className="px-6 py-8 bg-base-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-poster text-4xl tracking-tight">
            League Dashboard <span className="text-white/50 text-base align-middle">({leagueId || "MOCK"})</span>
          </h1>
          <button
            onClick={() => router.push("/content")}
            className="px-4 py-2 rounded-lg bg-foil-purple/20 border border-foil-purple/50 hover:shadow-neon-purple transition disabled:opacity-40"
            disabled={finalizedCount < 12}
            title={finalizedCount < 12 ? "Finalize all 12 teams to unlock Content Hub" : "Open Content Hub"}
          >
            Open Content Hub
          </button>
        </div>

        <div className="mt-6">
          <ProgressBar />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teams.map((t) => (
            <TeamCard key={t.id} team={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
