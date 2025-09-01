"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StyleKey = "modern" | "retro" | "futuristic" | "simple";
const OPTIONS: StyleKey[] = ["modern", "retro", "futuristic", "simple"];
const LABELS: Record<StyleKey, string> = {
  modern: "Modern",
  retro: "Retro",
  futuristic: "Futuristic",
  simple: "Simple"
};
const SNAP_DEGS = [0, 90, 180, 270]; // top, right, bottom, left

export default function RotaryKnob({
  value,
  onChange
}: {
  /** index 0..3 */
  value: number;
  onChange: (index: number) => void;
}) {
  const [angle, setAngle] = useState(indexToAngle(value));
  const ref = useRef<HTMLDivElement | null>(null);
  const idx = clamp(value, 0, 3);
  const label = useMemo(() => LABELS[OPTIONS[idx]], [idx]);

  useEffect(() => {
    setAngle(indexToAngle(value));
  }, [value]);

  const setFromPointer = (clientX: number, clientY: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const theta = Math.atan2(dy, dx);
    const degRaw = (theta * 180) / Math.PI + 90;
    const deg = ((degRaw + 360) % 360);
    const snap = nearestSnap(deg);
    setAngle(snap);
    onChange(angleToIndex(snap));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setFromPointer(e.clientX, e.clientY);
    const move = (ev: PointerEvent) => setFromPointer(ev.clientX, ev.clientY);
    const up = (ev: PointerEvent) => {
      (e.target as Element).releasePointerCapture(e.pointerId);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div className="flex items-center gap-4">
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        className="relative w-36 h-36 rounded-full bg-base-800 border border-white/10 shadow-[0_0_30px_rgba(0,224,255,0.12)] select-none cursor-grab active:cursor-grabbing"
        aria-label="Style dial"
      >
        {/* Outer ring */}
        <div className="absolute inset-2 rounded-full border border-white/10" />

        {/* Ticks */}
        {SNAP_DEGS.map((d, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 w-0.5 h-3 bg-white/40 origin-bottom"
            style={{ transform: `translate(-50%,-100%) rotate(${d}deg)` }}
          />
        ))}

        {/* Needle */}
        <div
          className="absolute left-1/2 top-1/2 w-1 h-14 bg-foil-cyan origin-bottom rounded-sm transition-transform"
          style={{ transform: `translate(-50%,-100%) rotate(${angle}deg)` }}
        />

        {/* Center cap */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-base-900 border border-white/10 shadow-inner grid place-items-center text-[11px] text-white/70">
          {label}
        </div>

        {/* Labels around the dial */}
        {OPTIONS.map((opt, i) => {
            const deg = SNAP_DEGS[i];
            const rad = (deg - 90) * (Math.PI / 180); // position text just outside ring
            const r = 84 / 2; // radius in px relative to 36 size
            const x = 72/2 + Math.cos(rad) * (r + 6);
            const y = 72/2 + Math.sin(rad) * (r + 6);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => { setAngle(SNAP_DEGS[i]); onChange(i); }}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-[11px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 hover:bg-white/10"
                style={{ left: x, top: y }}
              >
                {LABELS[opt]}
              </button>
            );
          })}
      </div>
    </div>
  );
}

/* helpers */
function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)); }
function indexToAngle(i: number) { return SNAP_DEGS[clamp(i, 0, 3)]; }
function angleToIndex(deg: number) {
  const snap = nearestSnap(deg);
  return SNAP_DEGS.indexOf(snap);
}
function nearestSnap(deg: number) {
  let best = SNAP_DEGS[0], min = 1e9;
  for (const d of SNAP_DEGS) {
    const delta = Math.min(Math.abs(d - deg), 360 - Math.abs(d - deg));
    if (delta < min) { min = delta; best = d; }
  }
  return best;
}
