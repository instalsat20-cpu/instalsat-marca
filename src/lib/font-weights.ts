const WEIGHT_VALUES: Record<string, number> = {
  thin: 100,
  extralight: 200,
  "extra light": 200,
  light: 300,
  regular: 400,
  normal: 400,
  medium: 500,
  semibold: 600,
  "semi bold": 600,
  bold: 700,
  extrabold: 800,
  "extra bold": 800,
  black: 900,
};

export function weightValue(name: string): number {
  const key = name.trim().toLowerCase();
  return WEIGHT_VALUES[key] ?? 400;
}

export function parseWeightNames(weights: string | null | undefined): string[] {
  if (!weights) return [];
  return weights
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);
}

export function googleFontsStylesheetHref(family: string): string {
  const encoded = family.trim().replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600&display=swap`;
}

export function firstParagraphText(html: string | null | undefined, fallback: string): string {
  if (!html) return fallback;
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const source = match ? match[1] : html;
  const text = source.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text || fallback;
}
