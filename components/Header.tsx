"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy } from "lucide-react";
import type { Route } from "next";

const nav = [
  { label: "Home", href: "/" as Route },
  { label: "Creation Hub", href: "/creation" as Route },
  { label: "Content", href: "/content" as Route },
  { label: "Gallery", href: "/gallery" as Route },
] satisfies ReadonlyArray<{ label: string; href: Route }>;

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur-md bg-black/40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href={"/" as Route} className="flex items-center gap-2">
          <Trophy className="text-yellow-400" size={18} />
          <span className="font-semibold">LEAGUE STUDIO</span>
        </Link>

        <nav className="flex items-center gap-2">
          {nav.map((n) => {
            const isActive =
              pathname === n.href || (n.href !== ("/" as Route) && pathname?.startsWith(String(n.href)));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  isActive
                    ? "border-foil-cyan/50 bg-foil-cyan/10"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                {n.label}
              </Link>
            );
          })}

          <Link
            href={"/complete" as Route}
            className="ml-2 px-3 py-1.5 rounded-lg border border-purple-400/40 bg-purple-500/10 hover:bg-purple-500/20 transition flex items-center gap-1"
          >
            <span role="img" aria-label="lock">🔒</span> Finalize
          </Link>
        </nav>
      </div>
    </header>
  );
}
