
import JSZip from "jszip";

type T = {
  id: string;
  name: string;
  logo: string;
  primary: string;
  secondary: string;
};

export async function downloadAllLogosZip(teams: T[]) {
  const zip = new JSZip();

  teams.forEach((t) => {
    zip.file(`logos/${t.id}.svg`, fetchPublic(t.logo));
    const meta = {
      id: t.id,
      name: t.name,
      primary: t.primary,
      secondary: t.secondary
    };
    zip.file(`logos/${t.id}.json`, JSON.stringify(meta, null, 2));
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "league_logos.zip";
  a.click();
  URL.revokeObjectURL(a.href);
}

function fetchPublic(path: string) {
  return fetch(path).then((r) => r.text());
}
