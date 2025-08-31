
"use client";

import { useEffect } from "react";
import GalleryGrid from "@/components/GalleryGrid";
import { useParams } from "next/navigation";
import { useLeagueStore } from "@/lib/store";

export default function GalleryPage() {
  const params = useParams<{ leagueId: string; n: string }>();
  const { loadMockLeague, teams } = useLeagueStore();

  useEffect(() => {
    if (!teams.length) loadMockLeague();
  }, [teams.length, loadMockLeague]);

  return (
    <section className="px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-poster text-4xl">Week {params.n} Gallery</h1>
        <p className="text-white/60">League: {params.leagueId}</p>
        <div className="mt-6">
          <GalleryGrid teams={teams} week={parseInt(params.n)} />
        </div>
      </div>
    </section>
  );
}
