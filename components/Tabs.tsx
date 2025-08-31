
"use client";

export default function Tabs({
  tabs,
  active,
  onChange
}: {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 rounded-lg border transition ${active === t.key ? "bg-foil-cyan/20 border-foil-cyan/50" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
