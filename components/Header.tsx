"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy } from "lucide-react";

// --- Strong route typing compatible with typedRoutes ---
type AppRoute = "/" | "/creation" | "/content" | "/gallery" | "/complete";
// Next.js' Route type is internal; we cast via this helper to satisfy <Link>.
const asRoute = (r: AppRoute) => r as unknown as import("next").Route;

const NAV: ReadonlyArray<{ label: string; href: AppRoute }> = [
  { label: "Home",          href: "/" },
  { label: "Creation Hub",  href: "/creation" },
  { label: "Content",       href: "/content" },
  { label: "Gallery",       href: "/gallery" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur-md bg-black/40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href={asRoute("/")} className="flex items-center gap-2">
          <Trophy className="text-yellow-400" size={18} />
          <span className="font-semibold">LEAGUE STUDIO</span>
        </Link>

        <nav className="flex items-center gap-2">
          {NAV.map((n) => {
            const active =
              pathname === n.href || (n.href !== "/" && (pathname?.startsWith(n.href) ?? false));

            return (
              <Link
                key={n.href}
                href={asRoute(n.href)} // <-- cast to Next's Route so typedRoutes is satisfied
                className={`px-3 py-1.5 rounded-lg border transition ${
                  active
                    ? "border-foil-cyan/50 bg-foil-cyan/10"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                {n.label}
              </Link>
            );
          })}

          <Link
            href={asRoute("/complete")}
            className="ml-2 px-3 py-1.5 rounded-lg border border-purple-400/40 bg-purple-500/10 hover:bg-purple-500/20 transition flex items-center gap-1"
          >
            <span role="img" aria-label="lock">🔒</span> Finalize
          </Link>
        </nav>
      </div>
    </header>
  );
}
