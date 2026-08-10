import DOMPurify from "dompurify";

function getPurify() {
  if (typeof window !== "undefined") return DOMPurify(window);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require("jsdom");
  const { window: domWindow } = new JSDOM("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return DOMPurify(domWindow as any);
}

const ALLOWED_TAGS = [
  "p",
  "h2",
  "h3",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "br",
];

export function sanitizeHtml(html: string): string {
  const purify = getPurify();
  return purify.sanitize(html ?? "", { ALLOWED_TAGS, ALLOWED_ATTR: [] });
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
