"use client";

import { useId, useState, useEffect } from "react";

export default function ColorPicker({
  label,
  color,
  onChange
}: {
  label: string;
  color: string;
  onChange: (hex: string) => void;
}) {
  const id = useId();
  const [hex, setHex] = useState(color || "#000000");

  // keep local state in sync if parent updates
  useEffect(() => {
    if (color && color.toLowerCase() !== hex.toLowerCase()) setHex(color);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  const handleHexInput = (v: string) => {
    // normalize: add leading '#' if missing
    const val = v.startsWith("#") ? v : `#${v}`;
    setHex(val);
    // Only call onChange when it's a valid 3/6/8-digit hex
    const ok = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(val);
    if (ok) onChange(val.toUpperCase());
  };

  const handleSwatch = (v: string) => {
    setHex(v);
    onChange(v.toUpperCase());
  };

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm text-white/80 mb-1">
        {label}
      </label>

      <div className="flex items-center gap-3 min-w-0">
        {/* Swatch (native color input) */}
        <input
          aria-label={`${label} color swatch`}
          type="color"
          value={safeHex(hex)}
          onChange={(e) => handleSwatch(e.target.value)}
          className="w-10 h-10 rounded-lg border border-white/10 p-0 bg-transparent cursor-pointer"
        />

        {/* Hex input */}
        <input
          id={id}
          spellCheck={false}
          value={hex}
          onChange={(e) => handleHexInput(e.target.value.trim())}
          placeholder="#00E0FF"
          className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-base-800 border border-white/10 focus-visible:glow font-mono text-sm"
        />
      </div>
    </div>
  );
}

// Some browsers don't like 3/8-digit for <input type="color">; coerce to 6-digit
function safeHex(h: string) {
  const v = h || "#000000";
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    const r = v[1], g = v[2], b = v[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  // fallback
  return "#000000";
}
