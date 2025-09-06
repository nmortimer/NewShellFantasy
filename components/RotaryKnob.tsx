"use client";

import { useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";

type Props = {
  value: number; // 0..N-1
  onChange: (index: number) => void;
  /** Optional labels to render around the dial at equal angles */
  labels?: string[];
};

/**
 * Rotary knob with discrete snap positions.
 * - Click anywhere on the ring to jump
 * - Drag to rotate
 * - Optional labels rendered at the snap angles
 */
export default function RotaryKnob({ value, onChange, labels }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const count = useMemo(
    () => (labels && labels.length > 1 ? labels.length : 4),
    [labels]
  );

  const anglePer = 360 / count;
  const clampIndex = (i: number) => ((i % count) + count) % count;

  const handleFromPoint = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const theta = Math.atan2(dy, dx); // -PI..PI
    let deg = (theta * 180) / Math.PI + 90; // 0 at top
    if (deg < 0) deg += 360;
    const idx = clampIndex(Math.round(deg / anglePer) % count);
    onChange(idx);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    handleFromPoint(e.clientX, e.clientY);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    handleFromPoint(e.clientX, e.clientY);
  };
  const onMouseUp = () => setDragging(false);
  const onMouseLeave = () => setDragging(false);

  const needleRotation = value * anglePer;

  return (
    <div className="relative">
      <div
        ref={ref}
        className="relative w-40 h-40 rounded-full bg-black/40 border border-white/10 shadow-inner select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={count - 1}
        aria-valuenow={value}
      >
        {/* ring */}
        <div className="absolute inset-2 rounded-full border border-white/10" />
        {/* needle */}
        <div
          className="absolute left-1/2 top-1/2 h-14 w-[2px] bg-white/80 origin-bottom"
          style={{
            transform: `translate(-50%, -100%) rotate(${needleRotation}deg)`,
          }}
        />
        {/* center cap */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/15 grid place-items-center">
          <Plus className="w-4 h-4 text-white/60" />
        </div>

        {/* labels (optional) */}
        {labels?.map((lab, i) => {
          const a = (i * anglePer - 90) * (Math.PI / 180); // convert to rad, start at top
          const r = 38; // radius for labels
          const x = 80 + r * Math.cos(a);
          const y = 80 + r * Math.sin(a);
          const active = i === value;
          return (
            <div
              key={i}
              className={`absolute text-[11px] px-1.5 py-0.5 rounded border ${
                active
                  ? "bg-foil-cyan/20 border-foil-cyan/40"
                  : "bg-white/5 border-white/10 text-white/70"
              }`}
              style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
            >
              {lab}
            </div>
          );
        })}
      </div>
    </div>
  );
}
