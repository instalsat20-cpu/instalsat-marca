import { sanitizeHtml } from "@/lib/sanitize";

export function RichText({ html, className }: { html: string; className?: string }) {
  if (!html?.trim()) return null;
  const clean = sanitizeHtml(html);
  return (
    <div
      className={`prose-instalsat ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
