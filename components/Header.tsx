"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, GalleryVerticalEnd } from "lucide-react";
import { useLeagueStore } from "@/lib/store";

export default function Header() {
  const pathname = usePathname();
  const { leagueId } = useLeagueStore();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 bg-base-900/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Trophy className="text-foil-gold" />
          <span className="font-poster text-xl tracking-wide">League Studio</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg border transition ${
              isActive("/") ? "border-foil-cyan/50 bg-foil-cyan/10" : "border-white/10 hover:bg-white/5"
            }`}
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-lg border transition ${
              isActive("/dashboard") ? "border-foil-cyan/50 bg-foil-cyan/10" : "border-white/10 hover:bg-white/5"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/content"
            className={`px-3 py-1.5 rounded-lg border transition ${
              isActive("/content") ? "border-foil-cyan/50 bg-foil-cyan/10" : "border-white/10 hover:bg-white/5"
            }`}
          >
            Content
          </Link>

          {/* Use object form for typed dynamic route */}
          <Link
            href={{
              pathname: "/gallery/[leagueId]/week/[n]",
              query: { leagueId: leagueId || "MOCK", n: "1" }
            }}
            className={`px-3 py-1.5 rounded-lg border transition ${
              pathname.startsWith("/gallery") ? "border-foil-cyan/50 bg-foil-cyan/10" : "border-white/10 hover:bg-white/5"
            }`}
          >
            Gallery
          </Link>

          <Link
            href="/complete"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-foil-purple/50 bg-foil-purple/10 hover:shadow-neon-purple transition"
          >
            <GalleryVerticalEnd size={16} /> Finalize
          </Link>
        </nav>
      </div>
    </header>
  );
}
