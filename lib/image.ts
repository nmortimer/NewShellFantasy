/**
 * Pollinations image helper for team logo generation.
 * Stricter prompt: head-only mascot, 2-color palette, no text/badges/gradients.
 */

export type LogoStyle = "modern" | "retro" | "futuristic" | "simple";

type BuildArgs = {
  mascot: string;        // concise subject, e.g. "fox", "eagle", "unicorn"
  primary: string;       // hex (#RRGGBB)
  secondary: string;     // hex (#RRGGBB)
  style: LogoStyle;      // one of: modern | retro | futuristic | simple
  seed?: string;         // stable seed per team
  size?: number;         // output size
};

/** Style-specific descriptors to nudge shape language without adding noise */
function styleDescriptor(style: LogoStyle): string {
  switch (style) {
    case "modern":
      return "sleek minimal vector, bold flat shapes, contemporary sports branding";
    case "retro":
      return "vintage sports logo feel, bold flat lines, limited inks";
    case "futuristic":
      return "sharp geometric edges, sci-fi minimal vector, neon-inspired but flat";
    case "simple":
      return "ultra-minimal flat icon, reductive and abstract yet recognizable";
    default:
      return "sleek minimal vector, bold flat shapes, contemporary sports branding";
  }
}

/**
 * Core prompt:
 * - head-only mark avoids full-body mascots and wordmarks
 * - flat 2-color palette locked to primary + secondary (white allowed as background/negative space)
 * - explicitly bans text, letters, numbers, badges, shields, banners, gradients, shadows, glow
 */
export function buildPrompt({
  mascot,
  primary,
  secondary,
  style,
}: Pick<BuildArgs, "mascot" | "primary" | "secondary" | "style">): string {
  const styleLine = styleDescriptor(style);

  // Important: repeat constraints in different phrasings to reduce drift.
  return [
    // Subject & framing
    `Professional sports team logo: head-only ${mascot}.`,
    // Visual language
    `${styleLine}. Clean flat vector design, sharp lines, symmetrical, centered composition.`,
    // Palette lock
    `Two-color palette ONLY: ${primary} and ${secondary}. Use white ONLY as background/negative space.`,
    // Hard bans (multiple phrasings help)
    "No text, no words, no letters, no typography, no numbers.",
    "No badge, no shield, no crest, no emblem, no banner, no ribbon, no circle backdrop.",
    "No gradients, no shadows, no glow, no 3D, no textures.",
    // Output intent
    "Polished, scalable mark suitable for jerseys and app icons."
  ].join(" ");
}

/**
 * Build Pollinations URL with our prompt.
 * If you want to pin a model, uncomment qs.set('model', 'flux') which often
 * behaves more predictably for flat logos.
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

  // Optional: pin a model that tends to obey flat-vector prompts
  // qs.set("model", "flux");

  return `${base}${encodeURIComponent(prompt)}?${qs.toString()}`;
}
