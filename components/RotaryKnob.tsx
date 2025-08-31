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
  const label = useMemo(() => LABELS[OPTIONS[clamp(value, 0, 3)]], [value]);

  useEffect(() => {
    setAngle(indexToAngle(value));
  }, [value]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ev.clientX - cx;
      const dy = ev.clientY - cy;
      const theta = Math.atan2(dy, dx); // -PI..PI
      const deg = (theta * 180) / Math.PI + 90; // rotate so top is 0
      const normalized = ((deg + 360) % 360); // 0..359
      // snap to 4 quadrants: 0,90,180,270
      const snap = Math.round(normalized / 90) * 90;
      setAngle(snap);
      onChange(angleToIndex(snap));
    };
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
        className="relative w-28 h-28 rounded-full bg-base-700 border border-white/10 shadow-neon-cyan grid place-items-center select-none cursor-grab active:cursor-grabbing"
        aria-label="Style dial"
      >
        {/* needle */}
        <div
          className="absolute top-1/2 left-1/2 w-1 h-10 bg-foil-cyan origin-bottom rounded-sm"
          style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
        />
        <div className="text-xs text-white/70">Style</div>
      </div>

      <div className="min-w-[8rem]">
        <div className="text-xs text-white/60 mb-1">Selected</div>
        <div className="px-2 py-1 rounded bg-white/5 border border-white/10 font-medium">{label}</div>
        <div className="mt-2 text-[11px] text-white/50">Drag the dial or click around the circle</div>
      </div>
    </div>
  );
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function indexToAngle(i: number) {
  const idx = clamp(i, 0, 3);
  return idx * 90;
}
function angleToIndex(deg: number) {
  const d = ((Math.round(deg / 90) % 4) + 4) % 4;
  return d;
}
