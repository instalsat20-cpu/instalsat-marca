"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Check, ChevronDown, TriangleAlert } from "lucide-react";

type GoogleFont = { family: string; category: string };

const MAX_RESULTS = 50;
const DEBOUNCE_MS = 150;

export function FontPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (family: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef(false);

  // Load the full font list exactly once, on mount — never re-fetched per keystroke.
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
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
  }, []);

  // Debounce the search term as an extra layer of protection against filtering on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

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
    const q = debouncedQuery.trim().toLowerCase();
    const list = q ? fonts.filter((f) => f.family.toLowerCase().includes(q)) : fonts;
    return list.slice(0, MAX_RESULTS);
  }, [fonts, debouncedQuery]);

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
          {!error && (
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
          )}

          <div ref={listRef} className="max-h-72 overflow-y-auto py-1">
            {loading && (
              <p className="px-4 py-3 text-sm font-light text-bruma-light/40">Carregando fontes...</p>
            )}
            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3">
                <TriangleAlert size={16} className="mt-0.5 shrink-0 text-brasa" />
                <p className="text-sm font-light text-bruma-light/70">{error}</p>
              </div>
            )}
            {!loading &&
              !error &&
              results.map((font) => (
                <FontOption
                  key={font.family}
                  font={font}
                  active={font.family === value}
                  scrollRoot={listRef}
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
  scrollRoot,
}: {
  font: GoogleFont;
  active: boolean;
  onSelect: () => void;
  scrollRoot: React.RefObject<HTMLDivElement | null>;
}) {
  const itemRef = useRef<HTMLButtonElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Lazily load the font's stylesheet only once the option scrolls into view.
  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { root: scrollRoot.current, rootMargin: "80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollRoot]);

  const href = `https://fonts.googleapis.com/css2?family=${font.family.replace(/\s+/g, "+")}&display=swap`;

  return (
    <button
      ref={itemRef}
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition hover:bg-bruma-light/5"
    >
      {shouldLoad && <link rel="stylesheet" href={href} />}
      <span
        className="truncate text-sm text-bruma-light"
        style={shouldLoad ? { fontFamily: `'${font.family}', sans-serif` } : undefined}
      >
        {font.family}
      </span>
      {active && <Check size={15} className="shrink-0 text-brasa" />}
    </button>
  );
}
