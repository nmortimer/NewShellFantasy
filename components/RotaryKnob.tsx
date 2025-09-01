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

// Geometry
const WRAP = 180;          // outer wrapper (room for labels)
const KNOB = 124;          // knob diameter
const RING_INSET = 10;     // inner ring inset inside knob
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
  const current = useMemo(() => OPTIONS[idx], [idx]);

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
    const degRaw = (theta * 180) / Math.PI + 90;   // 0 at top
    const deg = ((degRaw + 360) % 360);
    const snap = nearestSnap(deg);
    setAngle(snap);
    onChange(angleToIndex(snap));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setFromPointer(e.clientX, e.clientY);
    const move = (ev: PointerEvent) => setFromPointer(ev.clientX, ev.clientY);
    const up = () => {
      (e.target as Element).releasePointerCapture(e.pointerId);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // Precompute radii
  const center = WRAP / 2;
  const knobR = KNOB / 2;
  const ringR = knobR - RING_INSET;     // tick/needle radius
  const labelR = knobR + 20;            // labels just outside the knob edge

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        className="relative select-none cursor-grab active:cursor-grabbing"
        style={{ width: WRAP, height: WRAP }}
        aria-label="Style dial"
      >
        {/* Knob container centered inside wrapper */}
        <div
          className="absolute rounded-full bg-base-800 border border-white/10 shadow-[0_0_30px_rgba(0,224,255,0.12)]"
          style={{
            left: center - knobR,
            top: center - knobR,
            width: KNOB,
            height: KNOB
          }}
        >
          {/* inner ring */}
          <div
            className="absolute rounded-full border border-white/10"
            style={{
              left: RING_INSET,
              top: RING_INSET,
              width: KNOB - RING_INSET * 2,
              height: KNOB - RING_INSET * 2
            }}
          />

          {/* ticks */}
          {SNAP_DEGS.map((d, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 bg-white/50 origin-bottom"
              style={{
                width: 2,
                height: 10,
                transform: `translate(-50%,-${ringR - 2}px) rotate(${d}deg)`
              }}
            />
          ))}

          {/* needle */}
          <div
            className="absolute left-1/2 top-1/2 bg-foil-cyan origin-bottom rounded-sm transition-transform"
            style={{
              width: 3,
              height: ringR - 6,
              transform: `translate(-50%,-100%) rotate(${angle}deg)`
            }}
          />

          {/* center cap */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-base-900 border border-white/10 shadow-inner grid place-items-center text-[11px] text-white/70">
            {LABELS[current]}
          </div>
        </div>

        {/* labels around the knob (clickable) */}
        {OPTIONS.map((opt, i) => {
          const deg = SNAP_DEGS[i];
          const rad = (deg - 90) * (Math.PI / 180);
          const x = center + Math.cos(rad) * labelR;
          const y = center + Math.sin(rad) * labelR;
          const active = current === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => { setAngle(SNAP_DEGS[i]); onChange(i); }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 text-[11px] px-1.5 py-0.5 rounded border ${
                active ? "bg-foil-cyan/20 border-foil-cyan/50" : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
              style={{ left: x, top: y }}
            >
              {LABELS[opt]}
            </button>
          );
        })}
      </div>
      {/* Single selected chip */}
      <div className="text-sm">
        <span className="px-2 py-1 rounded bg-white/5 border border-white/10">{LABELS[current]}</span>
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
