"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Check, ChevronDown } from "lucide-react";

type GoogleFont = { family: string; category: string };

export function FontPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (family: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || fonts.length > 0 || loading) return;
    setLoading(true);
    setError(null);
    fetch("/api/admin/google-fonts")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setFonts(data.fonts ?? []);
      })
      .catch(() => setError("Não foi possível carregar as fontes."))
      .finally(() => setLoading(false));
  }, [open, fonts.length, loading]);

  useEffect(() => {
    function handleClick(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? fonts.filter((f) => f.family.toLowerCase().includes(q)) : fonts;
    return list.slice(0, 40);
  }, [fonts, query]);

  const previewHref = query.trim()
    ? undefined
    : `https://fonts.googleapis.com/css2?family=${value.trim().replace(/\s+/g, "+")}&display=swap`;

  return (
    <div ref={ref} className="relative">
      {previewHref && <link rel="stylesheet" href={previewHref} />}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-left text-sm outline-none transition hover:border-bruma-light/25"
      >
        <span
          className="text-bruma-light"
          style={{ fontFamily: value ? `'${value}', sans-serif` : undefined }}
        >
          {value || "Selecionar fonte"}
        </span>
        <ChevronDown size={16} className="text-bruma-light/40" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-2xl border border-bruma-light/10 bg-surface-elevated shadow-xl">
          <div className="flex items-center gap-2 border-b border-bruma-light/10 px-3 py-2.5">
            <Search size={15} className="text-bruma-light/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar fonte..."
              className="w-full bg-transparent text-sm text-bruma-light outline-none placeholder:text-bruma-light/30"
            />
          </div>

          <div className="max-h-72 overflow-y-auto py-1">
            {loading && (
              <p className="px-4 py-3 text-sm font-light text-bruma-light/40">Carregando fontes...</p>
            )}
            {error && <p className="px-4 py-3 text-sm font-medium text-brasa">{error}</p>}
            {!loading &&
              !error &&
              results.map((font) => (
                <FontOption
                  key={font.family}
                  font={font}
                  active={font.family === value}
                  onSelect={() => {
                    onChange(font.family);
                    setOpen(false);
                    setQuery("");
                  }}
                />
              ))}
            {!loading && !error && results.length === 0 && (
              <p className="px-4 py-3 text-sm font-light text-bruma-light/40">
                Nenhuma fonte encontrada.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FontOption({
  font,
  active,
  onSelect,
}: {
  font: GoogleFont;
  active: boolean;
  onSelect: () => void;
}) {
  const href = `https://fonts.googleapis.com/css2?family=${font.family.replace(/\s+/g, "+")}&display=swap`;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition hover:bg-bruma-light/5"
    >
      <link rel="stylesheet" href={href} />
      <span
        className="truncate text-sm text-bruma-light"
        style={{ fontFamily: `'${font.family}', sans-serif` }}
      >
        {font.family}
      </span>
      {active && <Check size={15} className="shrink-0 text-brasa" />}
    </button>
  );
}
