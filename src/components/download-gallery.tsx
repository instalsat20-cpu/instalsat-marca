"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger";

export type GalleryItem = {
  id: string;
  name: string;
  group: string;
  format: string;
  colorProfile: string;
  subtitle?: string;
  previewUrl: string | null;
  downloadUrl: string;
};

export function DownloadGallery({
  items,
  groupLabel,
}: {
  items: GalleryItem[];
  groupLabel: string;
}) {
  const [group, setGroup] = useState("all");
  const [format, setFormat] = useState("all");

  const groups = useMemo(
    () => Array.from(new Set(items.map((i) => i.group))),
    [items]
  );
  const formats = useMemo(
    () => Array.from(new Set(items.map((i) => i.format))),
    [items]
  );

  const filtered = items.filter(
    (i) =>
      (group === "all" || i.group === group) &&
      (format === "all" || i.format === format)
  );

  return (
    <div>
      {(groups.length > 1 || formats.length > 1) && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {groups.length > 1 && (
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2 text-sm text-bruma-light outline-none"
            >
              <option value="all">Todas as {groupLabel.toLowerCase()}</option>
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          )}
          {formats.length > 1 && (
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2 text-sm text-bruma-light outline-none"
            >
              <option value="all">Todos os formatos</option>
              {formats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm font-light text-bruma-light/40">
          Nenhum item disponível para os filtros selecionados.
        </p>
      ) : (
        <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <StaggerItem
              key={item.id}
              className="overflow-hidden rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04]"
            >
              <div className="flex h-32 items-center justify-center bg-bruma-light/[0.03]">
                {item.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs font-light text-bruma-light/30">
                    Sem preview
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-bruma-light">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs font-light text-bruma-light/45">
                  {item.group}
                  {item.subtitle ? ` · ${item.subtitle}` : ""}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full border border-bruma-light/10 px-2 py-0.5 text-[11px] font-medium text-bruma-light/60">
                    {item.format}
                  </span>
                  <span className="rounded-full border border-bruma-light/10 px-2 py-0.5 text-[11px] font-medium text-bruma-light/60">
                    {item.colorProfile}
                  </span>
                </div>
                <a
                  href={item.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brasa px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90"
                >
                  <Download size={16} />
                  Baixar
                </a>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </div>
  );
}
