"use client";

export type PowerItem = {
  rank?: number;
  name?: string;
  logo?: string;
  primary?: string;
};

export type Power = {
  items?: PowerItem[]; // top 6 recommended
};

export default function PowerPoster({ p }: { p: Power }) {
  const items = (p?.items ?? []).slice(0, 6);

  return (
    <div className="absolute inset-0 text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#121212] to-[#181818]" />
      <div className="absolute inset-0 bg-holo-gradient opacity-25 mix-blend-screen" />

      <div className="absolute top-6 left-6 right-6">
        <div className="font-poster text-3xl tracking-wide">POWER RANKINGS</div>
        <div className="text-sm opacity-70">Top 6</div>
      </div>

      {/* Grid of mini-cards */}
      <div className="absolute inset-x-6 bottom-6 top-24 grid grid-cols-3 gap-4">
        {items.map((it, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/12 bg-black/30 shadow-inner p-3 relative overflow-hidden"
          >
            {/* Rank badge */}
            <div className="absolute -right-2 -top-2 w-14 h-14 rounded-full border border-white/30 bg-white/10 grid place-items-center font-poster text-xl">
              {it.rank ?? i + 1}
            </div>

            <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
              <div className="w-14 h-14 rounded-md border border-white/10 bg-white/5 grid place-items-center overflow-hidden">
                {it.logo ? (
                  <img
                    src={it.logo}
                    alt={it.name ?? "team"}
                    className="object-contain w-[85%] h-[85%]"
                  />
                ) : (
                  <div className="text-[10px] opacity-60">Logo</div>
                )}
              </div>
              <div className="truncate">
                <div className="font-semibold truncate">{it.name ?? "Team"}</div>
                <div className="mt-1 h-2 rounded bg-white/10 overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.max(30, 100 - i * 10)}%`,
                      background: it.primary ?? "#00E0FF",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* shimmer on #1 */}
            {i === 0 && (
              <div className="absolute inset-0 holo-anim opacity-20 pointer-events-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
