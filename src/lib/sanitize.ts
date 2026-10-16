import sanitize from "sanitize-html";

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

// Pure-JS sanitizer: jsdom/DOMPurify breaks in Vercel's serverless runtime.
export function sanitizeHtml(html: string): string {
  return sanitize(html ?? "", {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {},
  });
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
