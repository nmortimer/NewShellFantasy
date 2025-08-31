
"use client";

export default function GalleryGrid({ teams, week }: { teams: any[]; week: number }) {
  const tiles = [];
  for (let i = 0; i < teams.length; i += 2) {
    if (teams[i + 1]) {
      tiles.push({ a: teams[i], b: teams[i + 1] });
    }
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tiles.map((m, idx) => (
        <div key={idx} className="rounded-xl overflow-hidden border border-white/10">
          <div className="grid grid-cols-2">
            <GallerySide team={m.a} />
            <GallerySide team={m.b} />
          </div>
          <div className="px-4 py-2 text-xs text-white/60 bg-base-800 border-t border-white/10">WEEK {week} SHOWDOWN</div>
        </div>
      ))}
    </div>
  );
}

function GallerySide({ team }: { team: any }) {
  return (
    <div className="p-5 flex items-center justify-center" style={{ background: team.primary }}>
      <img src={team.logo} className="w-20 h-20" />
    </div>
  );
}
