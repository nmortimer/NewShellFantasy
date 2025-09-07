/**
 * mascot.ts
 * - Rule-based mapping (fast, safe)
 * - Ranked suggestions (rule hits + learned overrides merged)
 * - Simple normalizer so prompts stay clean
 */

export type Confidence = "high" | "medium" | "low";

export type MascotSuggestion = {
  mascot: string;         // e.g., "lion head", "waffle icon"
  confidence: Confidence; // ranking hint
  source: "rule" | "learned";
  reason?: string;
};

const STOPWORDS = [
  "the","and","of","fc","sc","afc","cf","club","city","town","united",
  "team","ballers","squad","crew","league","fantasy","football",
  "sports","athletic","athletics","athletico","real","de","la","los","las",
  "new","old","boys","girls","ladies","mens",
];

const PLURAL_EXCEPTIONS: Record<string, string> = {
  wolves: "wolf", geese: "goose", mice: "mouse", teeth: "tooth", feet: "foot",
  oxen: "ox", leaves: "leaf", knives: "knife", wives: "wife", lives: "life",
};

const ANIMALS = [
  "wolf","fox","bear","lion","tiger","panther","jaguar","leopard","cougar",
  "eagle","hawk","falcon","owl","raven","phoenix","dragon","griffin",
  "bull","bison","buffalo","ram","goat","stag","deer","moose","horse","mustang",
  "unicorn","rhino","boar","hog","dog","hound","husky","coyote",
  "shark","marlin","piranha","orca","dolphin","turtle","cobra","viper","python",
  "scorpion","spider","hornet","wasp","bee","ant","raptor","bobcat","lynx","puma",
];

const OBJECT_MAP: Record<string, string> = {
  bombshells: "bomb explosion icon", bombers: "bomb explosion icon", bomb: "bomb explosion icon",
  rockets: "rocket icon", waffle: "waffle icon", waffles: "waffle icon", pancake: "pancake icon",
  pancakes: "pancake icon", donut: "donut icon", donuts: "donut icon", lightning: "lightning bolt icon",
  storm: "storm cloud lightning icon", cyclones: "cyclone icon", hurricanes: "hurricane icon",
  tornado: "tornado icon", tornadoes: "tornado icon", stallions: "mustang head", broncos: "mustang head",
  patriots: "eagle head", rebels: "eagle head", yeti: "yeti head", vikings: "viking helmet icon",
  knights: "knight helmet icon", raiders: "pirate skull icon", pirates: "pirate skull icon",
  buccaneers: "pirate skull icon", ninjas: "ninja mask icon", samurai: "samurai helmet icon",
  wizards: "wizard hat icon", magicians: "wizard hat icon", warriors: "spartan helmet icon",
  spartans: "spartan helmet icon",
};

const DIRECT: Record<string, string> = {
  wolves: "wolf head", wolf: "wolf head", foxes: "fox head", fox: "fox head",
  lions: "lion head", lion: "lion head", tigers: "tiger head", tiger: "tiger head",
  bears: "bear head", bear: "bear head", eagles: "eagle head", eagle: "eagle head",
  hawks: "hawk head", hawk: "hawk head", falcons: "falcon head", falcon: "falcon head",
  owls: "owl head", owl: "owl head", ravens: "raven head", raven: "raven head",
  phoenix: "phoenix head", dragon: "dragon head", dragons: "dragon head",
  unicorns: "unicorn head", unicorn: "unicorn head",
  stallions: "mustang head", mustangs: "mustang head", broncos: "mustang head",
  horses: "horse head", horse: "horse head",
  jaguars: "jaguar head", jaguar: "jaguar head", panthers: "panther head", panther: "panther head",
  cougars: "cougar head", cougar: "cougar head", bobcats: "bobcat head", bobcat: "bobcat head",
  pumas: "puma head", puma: "puma head", lynx: "lynx head",
  bulls: "bull head", bull: "bull head", bison: "bison head", buffalo: "bison head",
  rams: "ram head", ram: "ram head", goats: "goat head", goat: "goat head",
  sharks: "shark head", shark: "shark head", marlin: "marlin icon",
  dolphins: "dolphin head", dolphin: "dolphin head",
  coyotes: "coyote head", coyote: "coyote head", huskies: "husky head", husky: "husky head",
  raptors: "raptor head", raptor: "raptor head", yeti: "yeti head",
  waffles: "waffle icon", waffle: "waffle icon",
};

function singularize(t: string) {
  if (PLURAL_EXCEPTIONS[t]) return PLURAL_EXCEPTIONS[t];
  if (t.endsWith("es")) return t.slice(0, -2);
  if (t.endsWith("s")) return t.slice(0, -1);
  return t;
}

function tokens(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean).filter(t => !STOPWORDS.includes(t));
}

export function normalizeMascot(mascot: string) {
  return mascot
    .replace(/\s+/g, " ")
    .replace(/\b(head|icon)\b/gi, (m) => m.toLowerCase())
    .trim();
}

/** RULE ENGINE: get best single mascot */
export function deriveMascot(name: string): { mascot: string; confidence: Confidence } {
  const ts = tokens(name);

  for (const t of ts) {
    if (DIRECT[t]) return { mascot: normalizeMascot(DIRECT[t]), confidence: "high" };
    const s = singularize(t);
    if (DIRECT[s]) return { mascot: normalizeMascot(DIRECT[s]), confidence: "high" };
  }

  for (const t of ts) {
    if (OBJECT_MAP[t]) return { mascot: normalizeMascot(OBJECT_MAP[t]), confidence: "medium" };
    const s = singularize(t);
    if (OBJECT_MAP[s]) return { mascot: normalizeMascot(OBJECT_MAP[s]), confidence: "medium" };
  }

  for (const t of ts) {
    const s = singularize(t);
    if (ANIMALS.includes(s)) return { mascot: normalizeMascot(`${s} head`), confidence: "medium" };
  }

  for (const t of ts) {
    if (t.endsWith("hawks")) return { mascot: "hawk head", confidence: "low" };
    if (t.endsWith("cats")) return { mascot: "wildcat head", confidence: "low" };
    if (t.endsWith("birds")) return { mascot: "eagle head", confidence: "low" };
  }

  return { mascot: "lion head", confidence: "low" };
}

/** Merge learned suggestions + rules and return TOP-N ranked */
export function suggestMascots(
  name: string,
  learned: MascotSuggestion[] = [],
  limit = 3
): MascotSuggestion[] {
  const set = new Map<string, MascotSuggestion>();

  // learned first (strongest)
  for (const s of learned) {
    const key = normalizeMascot(s.mascot);
    if (!set.has(key)) set.set(key, { ...s, mascot: key, source: "learned" });
  }

  // rule-based candidates
  const primary = deriveMascot(name);
  const rulePack: MascotSuggestion[] = [
    { mascot: primary.mascot, confidence: primary.confidence, source: "rule", reason: "rule-derive" },
  ];

  for (const r of rulePack) {
    const key = normalizeMascot(r.mascot);
    if (!set.has(key)) set.set(key, { ...r, mascot: key });
  }

  // rank: learned > rule(high) > rule(med) > rule(low)
  const rankScore = (c: Confidence, src: MascotSuggestion["source"]) =>
    (src === "learned" ? 3 : 0) + (c === "high" ? 2 : c === "medium" ? 1 : 0);

  return Array.from(set.values())
    .sort((a, b) => rankScore(b.confidence, b.source) - rankScore(a.confidence, a.source))
    .slice(0, limit);
}
