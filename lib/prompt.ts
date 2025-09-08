// lib/prompt.ts

export type LogoStyle = "modern" | "retro" | "futuristic" | "simple";

/**
 * Maps our 4 style packs to short, *logo-safe* descriptors.
 * These guide the generator without inviting text, badges, or gradients.
 */
function styleDescriptor(style: LogoStyle): string {
  switch (style) {
    case "modern":
      return "modern, clean esports logo, geometric simplification, bold shapes, thick outline";
    case "retro":
      return "retro sports patch style, vintage bold outline, classic emblem feel, flat inks";
    case "futuristic":
      return "sleek angular forms, sci-fi styling, crisp edges, high contrast, no glow";
    case "simple":
      return "minimal flat icon, few shapes, strong silhouette, simplified details";
    default:
      return "modern, clean esports logo, geometric simplification, bold shapes, thick outline";
  }
}

/**
 * Builds a *strict* mascot-logo prompt.
 * - Forces NO TEXT / NO WORDS repeatedly (this helps a lot).
 * - Locks to a 2-color palette (primary/secondary) with only white/black allowed for negative space.
 * - Requests head/face emblem with centered composition for brandable outputs.
 */
export function buildLogoPrompt(
  teamName: string,
  mascot: string,
  primary: string,
  secondary: string,
  style: LogoStyle
): string {
  const styleLine = styleDescriptor(style);

  return [
    `Professional mascot logo for a fantasy football team (team name: "${teamName}" — DO NOT include the name).`,
    `Mascot subject: ${mascot}.`,
    `Composition: centered mascot head/face emblem, strong silhouette, symmetric balance, minimal background.`,
    `Style: ${styleLine}. Vector logo look, solid flat fills, sharp edges, print-ready.`,
    `Color policy: use ONLY these two brand colors — primary ${primary} and secondary ${secondary}.`,
    `You may use white or black only as negative space/outline if absolutely needed. No other colors.`,
    `Absolutely no gradients, no textures, no metallic effects, no drop shadows, no glow.`,
    `Hard constraints: no text, no words, no letters, no numbers, no typography, no banners, no labels, no badges with text, no watermarks.`,
    `Output should look like a professional sports/esports team logo with a unique pose/expression (varied composition allowed).`,
  ].join(" ");
}
