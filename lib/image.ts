/**
 * Pollinations image helper for team logo generation.
 * Builds a strict, sports-branding prompt with color + style control.
 */

export type LogoStyle = "modern" | "retro" | "futuristic" | "simple";

type BuildArgs = {
  mascot: string;        // e.g., "Silverhawks" or "wolf"
  primary: string;       // hex (#RRGGBB)
  secondary: string;     // hex (#RRGGBB)
  style: LogoStyle;      // one of: modern | retro | futuristic | simple
  seed?: string;         // stable seed per team
  size?: number;         // output size (pollinations supports 1024 well)
};

/** Style-specific descriptors we merge into the core prompt. */
function styleDescriptor(style: LogoStyle): string {
  switch (style) {
    case "modern":
      return "sleek minimal vector, flat colors, contemporary sports branding";
    case "retro":
      return "retro sports logo style, vintage print look, bold flat lines";
    case "futuristic":
      return "futuristic minimal design, neon-inspired, sharp geometric edges";
    case "simple":
      return "extremely minimal flat icon, abstract but recognizable mascot mark";
    default:
      return "sleek minimal vector, flat colors, contemporary sports branding";
  }
}

/**
 * Core prompt template:
 * - Professional sports branding
 * - Flat scalable vector look
 * - Hard constraints: no text, no gradients, no shield/background
 * - Locked palette to primary + secondary
 */
export function buildPrompt({
  mascot,
  primary,
  secondary,
  style,
}: Pick<BuildArgs, "mascot" | "primary" | "secondary" | "style">): string {
  const styleLine = styleDescriptor(style);
  return [
    `Professional sports team logo of ${mascot}, in a bold ${style} vector style.`,
    styleLine + ".",
    "Clean flat design, sharp lines, symmetrical composition.",
    `Use only the team’s colors: ${primary} and ${secondary}.`,
    "No text, no words, no gradients, no shield, no background.",
    "Centered mascot mark, polished and scalable as a logo.",
  ].join(" ");
}

/**
 * Build a Pollinations image URL.
 * We keep the same endpoint pattern your app already uses:
 *   https://image.pollinations.ai/prompt/{encodedPrompt}?seed=...&width=...&height=...
 *
 * Notes:
 * - seed is important for stable per-team results
 * - width/height are square for logos
 */
export function buildPollinationsLogoUrl({
  mascot,
  primary,
  secondary,
  style,
  seed,
  size = 1024,
}: BuildArgs): string {
  const prompt = buildPrompt({ mascot, primary, secondary, style });
  const base = "https://image.pollinations.ai/prompt/";
  const qs = new URLSearchParams();

  if (seed) qs.set("seed", String(seed));
  qs.set("width", String(size));
  qs.set("height", String(size));

  // If you decide to pin a model later, you can add it here:
  // qs.set("model", "flux");

  return `${base}${encodeURIComponent(prompt)}?${qs.toString()}`;
}
