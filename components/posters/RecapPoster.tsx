"use client";

type TeamSide = {
  id?: string;
  name?: string;
  logo?: string;
  primary?: string;
  secondary?: string;
  score?: number;
};

export type Recap = {
  home?: TeamSide;
  away?: TeamSide;
  winner?: "home" | "away";
};

export default function RecapPoster({
  r,
  week,
  leagueName,
}: {
  r: Recap;
  week: number;
  leagueName: string;
}) {
  const home = r?.home ?? {};
  const away = r?.away ?? {};
  const winner = r?.winner ?? (home.score ?? 0) >= (away.score ?? 0) ? "home" : "away";

  return (
    <div className="absolute inset-0 text-white">
      {/* Split background */}
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="h-full" style={{ background: home.primary ?? "#121212" }} />
        <div className="h-full" style={{ background: away.primary ?? "#181818" }} />
      </div>

      {/* Foil overlay */}
      <div className="absolute inset-0 bg-holo-gradient opacity-20 mix-blend-screen" />

      {/* Title */}
      <div className="absolute top-5 left-5 right-5 text-center">
        <div className="font-poster text-3xl tracking-wide">WEEK {week} RECAP</div>
        <div className="text-sm opacity-75">{leagueName}</div>
      </div>

      {/* Center divider */}
      <div className="absolute inset-y-10 left-1/2 -translate-x-1/2 w-1 bg-white/30 rounded-full" />

      {/* Scores */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 grid grid-cols-2 items-center px-6 gap-4">
        <ScoreSide side="home" team={home} highlight={winner === "home"} />
        <ScoreSide side="away" team={away} highlight={winner === "away"} />
      </div>

      {/* Victory stamp */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <span className="px-4 py-1 rounded-lg border border-white/30 bg-white/10 font-poster tracking-wide">
          {winner.toUpperCase()} VICTORY
        </span>
      </div>
    </div>
  );
}

function ScoreSide({
  team,
  side,
  highlight,
}: {
  team: TeamSide;
  side: "home" | "away";
  highlight: boolean;
}) {
  return (
    <div className={`flex ${side === "home" ? "justify-end" : "justify-start"}`}>
      <div className="w-[88%] max-w-[360px]">
        <div
          className={`rounded-xl border p-4 grid grid-cols-[auto,1fr] gap-4 items-center ${
            highlight
              ? "border-foil-cyan/60 bg-foil-cyan/15"
              : "border-white/15 bg-black/30"
          }`}
        >
          <div className="rounded-lg border border-white/10 bg-white/5 grid place-items-center w-24 h-24 overflow-hidden">
            {team.logo ? (
              <img
                src={team.logo}
                alt={team.name ?? "team"}
                className="object-contain w-[85%] h-[85%]"
              />
            ) : (
              <div className="text-xs opacity-60">Logo</div>
            )}
          </div>
          <div className={`${side === "home" ? "text-right" : ""} truncate`}>
            <div className="font-poster text-2xl leading-none truncate">
              {team.name ?? "Team"}
            </div>
            <div className="mt-1 text-3xl font-bold">
              {(team.score ?? 0).toFixed(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
