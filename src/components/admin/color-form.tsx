"use client";

import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown";
import type { CategoryItem } from "@/components/admin/category-manager";

type ExistingColor = {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
  pantone: string | null;
  order: number;
  categoryId: string | null;
};

export function ColorForm({
  existing,
  categories,
  onSuccess,
}: {
  existing?: ExistingColor;
  categories: CategoryItem[];
  onSuccess: () => void;
}) {
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? "");
  const [hex, setHex] = useState(existing?.hex ?? "#000000");
  const [rgb, setRgb] = useState(existing?.rgb ?? "");
  const [cmyk, setCmyk] = useState(existing?.cmyk ?? "");
  const [pantone, setPantone] = useState(existing?.pantone ?? "");
  const [order, setOrder] = useState(existing?.order ?? 0);
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        isEdit ? `/api/admin/colors/${existing!.id}` : "/api/admin/colors",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            hex,
            rgb,
            cmyk,
            pantone,
            order: Number(order),
            categoryId: categoryId || null,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar.");
        return;
      }
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Nome</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Hex</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="size-10 shrink-0 rounded-lg border border-bruma-light/10 bg-transparent"
            />
            <input
              required
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">RGB</label>
          <input
            required
            placeholder="0 56 65"
            value={rgb}
            onChange={(e) => setRgb(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">CMYK</label>
          <input
            required
            placeholder="94 62 56 50"
            value={cmyk}
            onChange={(e) => setCmyk(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Pantone (opcional)</label>
          <input
            value={pantone}
            onChange={(e) => setPantone(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Categoria</label>
          <Dropdown
            value={categoryId}
            onChange={setCategoryId}
            placeholder="Sem categoria"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Ordem</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          />
        </div>
      </div>

      {error && <p className="text-sm font-medium text-brasa">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-brasa px-5 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar cor"}
      </button>
    </form>
  );
}
