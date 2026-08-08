"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function ContentSectionEditor({
  section,
  groupLabel,
  initialTitle,
  initialBody,
}: {
  section: string;
  groupLabel: string;
  initialTitle: string;
  initialBody: string;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/admin/content/${section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-bruma-light">{groupLabel}</span>
        <ChevronDown
          size={18}
          className={`text-bruma-light/40 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="space-y-3 border-t border-bruma-light/10 px-5 py-5">
          <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-bruma-light/40">
              Título exibido na biblioteca
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-bruma-light/40">
              Corpo do texto
            </label>
            <textarea
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm leading-relaxed text-bruma-light outline-none"
            />
          </div>

          {error && <p className="text-sm font-medium text-brasa">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="rounded-xl bg-brasa px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            {saved && (
              <span className="text-sm font-medium text-brasa">Salvo.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
