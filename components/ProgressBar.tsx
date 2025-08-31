
"use client";

import { useLeagueStore } from "@/lib/store";

export default function ProgressBar() {
  const { finalizedCount } = useLeagueStore();
  const pct = Math.round((finalizedCount / 12) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="text-white/80">Finalize Progress</div>
        <div className="text-white/60 text-sm">{finalizedCount}/12</div>
      </div>
      <div className="mt-2 h-3 rounded-full bg-base-700 overflow-hidden">
        <div
          className="h-full bg-foil-cyan transition-all"
          style={{ width: `${pct}%`, boxShadow: "0 0 16px rgba(0, 224, 255, 0.6)" }}
        />
      </div>
    </div>
  );
}
