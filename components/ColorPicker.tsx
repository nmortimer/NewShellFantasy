
"use client";

export default function ColorPicker({
  label,
  color,
  onChange
}: {
  label: string;
  color: string;
  onChange: (c: string) => void;
}) {
  return (
    <div>
      <div className="text-sm text-white/70 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded border border-white/10 bg-transparent"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-base-700 border border-white/10"
        />
      </div>
    </div>
  );
}
