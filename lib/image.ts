// lib/image.ts
export type LogoStyle = "modern" | "retro" | "futuristic" | "simple";

export function buildPollinationsLogoUrl(opts: {
  mascot: string;
  primary: string;
  secondary: string;
  style: LogoStyle;
  seed?: string; // stable seed = stable + cached renders
}) {
  const { mascot, primary, secondary, style, seed } = opts;

  const stylePhrase =
    style === "modern"
      ? "modern professional sports logo, sleek bold lines, neon edge"
      : style === "retro"
      ? "retro vintage sports logo, flat emblem 80s style"
      : style === "futuristic"
      ? "futuristic sci-fi sports logo, cyberpunk glow"
      : "minimal flat icon sports logo, bold silhouette";

  const prompt = [
    "Premium sports team logo, centered emblem",
    `mascot: ${mascot}`,
    stylePhrase,
    "esports / NBA alternate logo aesthetic",
    "no text, transparent or flat background",
    `primary color ${primary}, secondary color ${secondary}`,
    "holographic trading card vibe, subtle neon glow",
  ]
    .join(", ")
    .replace(/\s+/g, " ");

  // Stable, fast renders with consistent sizing and no-text bias
  const params = new URLSearchParams({
    seed: seed || mascot,
    width: "768",
    height: "768",
    nologo: "true",
    enhance: "true",
  });

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?${params.toString()}`;
}
