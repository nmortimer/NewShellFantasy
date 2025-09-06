import JSZip from "jszip";

/** Simple slug for filenames */
function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

/**
 * Download all team logos as a ZIP.
 * Accepts items with a required `logo: string` (caller can filter/assert),
 * and includes an optional league id for naming.
 */
export async function downloadAllLogosZip(
  teams: Array<{ id: string; name: string; logo: string }>,
  leagueId?: string
) {
  const zip = new JSZip();

  for (const t of teams) {
    try {
      const res = await fetch(t.logo, { cache: "no-store", mode: "cors" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const arrayBuf = await blob.arrayBuffer();
      const filename = `${slug(t.name || t.id)}.png`;
      zip.file(filename, arrayBuf);
    } catch {
      // skip any individual failure; continue zipping others
    }
  }

  const out = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(out);
  a.download = `logos_${leagueId || "league"}.zip`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * Zip already-captured PNG data URLs (if you have them).
 */
export async function downloadPngDataUrlsZip(
  items: Array<{ id: string; name: string; dataUrl: string }>,
  bundleName = "posters"
) {
  const zip = new JSZip();
  for (const it of items) {
    const base64 = it.dataUrl.split(",")[1] || "";
    zip.file(`${slug(it.name || it.id)}.png`, base64, { base64: true });
  }
  const out = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(out);
  a.download = `${bundleName}.zip`;
  a.click();
  URL.revokeObjectURL(a.href);
}
