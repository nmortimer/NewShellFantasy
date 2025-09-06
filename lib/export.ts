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
 * Accepts teams with an optional `logo` and skips any that don't have one yet.
 */
export async function downloadAllLogosZip(
  teams: Array<{ id: string; name: string; logo?: string }>,
  leagueId?: string
) {
  const zip = new JSZip();
  const valid = teams.filter((t) => !!t.logo);

  for (const t of valid) {
    try {
      const res = await fetch(t.logo as string, { cache: "no-store", mode: "cors" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();

      const arrayBuf = await blob.arrayBuffer();
      const filename = `${slug(t.name || t.id)}.png`;
      zip.file(filename, arrayBuf);
    } catch (err) {
      // Skip on failure; continue bundling others
      // You could also add a small text file with errors if desired
      // zip.file(`${slug(t.name || t.id)}.txt`, String(err));
      // but keeping it silent is nicer UX here.
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
 * Utility to zip DOM nodes rendered on the page (e.g., posters).
 * Pass an array of element ids; each will be captured using html2canvas-like PNG dataURLs you computed externally.
 * Kept here in case you referenced it elsewhere.
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
