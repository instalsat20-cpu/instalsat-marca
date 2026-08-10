"use client";

import { Download } from "lucide-react";

export function DownloadAllFontsButton({
  fonts,
}: {
  fonts: { name: string; downloadUrl: string }[];
}) {
  if (fonts.length === 0) return null;

  function handleClick() {
    for (const font of fonts) {
      const a = document.createElement("a");
      a.href = font.downloadUrl;
      a.download = font.name;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 rounded-xl bg-brasa px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90"
    >
      <Download size={16} />
      Baixar todas as fontes de apoio
    </button>
  );
}
