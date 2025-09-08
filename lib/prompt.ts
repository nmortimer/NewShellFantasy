// lib/prompt.ts

export type LogoStyle = "modern" | "retro" | "futuristic" | "simple";

export function buildLogoPrompt(
  mascot: string,
  primary: string,
  secondary: string,
  style: LogoStyle
): string {
  return `
Professional sports team mascot logo.
Mascot subject: ${mascot}.
Composition: centered mascot head emblem only, bold outlines, symmetrical, flat inks.
Style: ${style} esports/sports team patch.
Colors: use ONLY primary ${primary} and secondary ${secondary}. 
Black and white may be used only for outlines and contrast.
BAN: no text, no words, no letters, no numbers, no names, no typography, no wordmark, no labels, no banners, no extra symbols.
Output: mascot head emblem only, no background, no additional elements.
`;
}
