"use client";

type TeamSide = {
  id?: string;
  name?: string;
  logo?: string;
  primary?: string;
  secondary?: string;
  record?: string;
  score?: number;
};

export type Matchup = {
  home?: TeamSide;
  away?: TeamSide;
};

export default function MatchupPoster({
  m,
  week,
  leagueName,
}: {
  m: Matchup;
  week: number;
  leagueName: string;
}) {
  const home = m?.home ?? {};
  const away = m?.away ?? {};

  return (
    <div className="absolute inset-0 text-white">
      {/* Split background */}
      <div className="absolute inset-0 grid grid-cols-2">
        <div
          className="h-full"
          style={{ background: home.primary ?? "#121212" }}
        />
        <div
          className="h-full"
          style={{ background: away.primary ?? "#181818" }}
        />
      </div>

      {/* Foil overlay */}
      <div className="absolute inset-0 bg-holo-gradient opacity-20 mix-blend-screen" />

      {/* Title */}
      <div className="absolute top-5 left-5 right-5 text-center">
        <div className="font-poster text-3xl tracking-wide">
          WEEK {week} SHOWDOWN
        </div>
        <div className="text-sm opacity-75">{leagueName}</div>
      </div>

      {/* Center bolt divider */}
      <div className="absolute inset-y-10 left-1/2 -translate-x-1/2 w-1 bg-white/30 rounded-full" />
      <div className="absolute inset-y-10 left-1/2 -translate-x-1/2 w-1">
        <div className="w-1 h-full bg-gradient-to-b from-white/60 via-white/20 to-transparent blur-[2px]" />
      </div>

      {/* Teams row */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 grid grid-cols-2 items-center px-6 gap-4">
        {/* Home */}
        <SideBox align="end" team={home} />
        {/* Away */}
        <SideBox align="start" team={away} flip />
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs opacity-80">
        <span>{home.record ?? "0-0"}</span>
        <span>{away.record ?? "0-0"}</span>
      </div>
    </div>
  );
}

function SideBox({
  team,
  align,
  flip = false,
}: {
  team: TeamSide;
  align: "start" | "end";
  flip?: boolean;
}) {
  return (
    <div className={`flex ${align === "end" ? "justify-end" : "justify-start"}`}>
      <div className="w-[88%] max-w-[360px]">
        <div
          className="rounded-xl border border-white/15 bg-black/30 shadow-inner p-4 grid grid-cols-[auto,1fr] gap-4 items-center"
          style={{
            boxShadow: "0 0 40px rgba(255,255,255,0.06) inset",
          }}
        >
          <div className="rounded-lg border border-white/10 bg-white/5 grid place-items-center w-24 h-24 overflow-hidden">
            {team.logo ? (
              <img
                src={team.logo}
                alt={team.name ?? "team"}
                className="object-contain w-[85%] h-[85%]"
                style={{ filter: "drop-shadow(0 0 14px rgba(255,255,255,0.25))" }}
              />
            ) : (
              <div className="text-xs opacity-60">Logo</div>
            )}
          </div>
          <div className={`${flip ? "" : "text-right"} truncate`}>
            <div className="font-poster text-2xl leading-none truncate">
              {team.name ?? "Team"}
            </div>
            <div className="mt-1 flex items-center gap-2 justify-end">
              <Swatch color={team.primary ?? "#00E0FF"} />
              <Swatch color={team.secondary ?? "#181818"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-4 h-4 rounded border border-white/20"
      style={{ background: color }}
      title={color}
    />
  );
}
