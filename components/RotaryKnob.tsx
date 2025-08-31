
"use client";

import { useState } from "react";

export default function RotaryKnob({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [internal, setInternal] = useState(value);

  const turn = (dir: 1 | -1) => {
    const next = Math.min(2, Math.max(0, internal + dir));
    setInternal(next);
    onChange(next);
  };

  return (
    <div className="flex items-center gap-4">
      <button className="px-3 py-2 rounded bg-white/5 border border-white/10" onClick={() => turn(-1)}>
        ◀
      </button>
      <div className="relative w-24 h-24 rounded-full bg-base-700 border border-white/10 shadow-neon-cyan flex items-center justify-center">
        <div className="text-white/80 text-sm">Pos {internal + 1}</div>
        <div className="absolute inset-0 rounded-full holo-anim opacity-20" />
      </div>
      <button className="px-3 py-2 rounded bg-white/5 border border-white/10" onClick={() => turn(1)}>
        ▶
      </button>
    </div>
  );
}
