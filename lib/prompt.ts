// lib/prompt.ts

export type LogoStyle = "modern" | "retro" | "futuristic" | "simple";

export function buildLogoPrompt(
  teamName: string,
  mascot: string,
  primary: string,
  secondary: string,
  style: LogoStyle
): string {
  return `
    Professional esports-style logo design.
    Focused on the mascot: ${mascot}.
    Style: ${style}.
    Use these team colors prominently: primary ${primary}, secondary ${secondary}.
    Clean, bold vector look with strong outlines and contrast.
    No text, no words, no team name in the design.
    Just the mascot illustration, centered, suitable for sports branding.
    Vary composition slightly (pose, angle, expression) for uniqueness.
  `.trim();
}
