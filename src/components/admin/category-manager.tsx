"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Pencil, Plus, X } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";

export type CategoryItem = {
  id: string;
  name: string;
  order: number;
};

export function CategoryManager({
  type,
  categories,
}: {
  type: "logo" | "graphic" | "color" | "document";
  categories: CategoryItem[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startCreate() {
    setEditingId(null);
    setName("");
    setError(null);
  }

  function startEdit(cat: CategoryItem) {
    setEditingId(cat.id);
    setName(cat.name);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, type, order: categories.length }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar.");
        return;
      }
      setName("");
      setEditingId(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-bruma-light">
          Categorias
          <span className="ml-2 text-xs font-light text-bruma-light/40">
            {categories.length}
          </span>
        </span>
        <ChevronDown
          size={18}
          className={`text-bruma-light/40 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-bruma-light/10 px-5 py-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-1.5 rounded-full border border-bruma-light/10 bg-bruma-light/5 py-1 pl-3 pr-1.5 text-xs font-medium text-bruma-light/75"
              >
                {cat.name}
                <button
                  onClick={() => startEdit(cat)}
                  className="flex size-5 items-center justify-center rounded-full text-bruma-light/40 transition hover:bg-bruma-light/10 hover:text-bruma-light"
                >
                  <Pencil size={11} />
                </button>
                <DeleteButton
                  url={`/api/admin/categories/${cat.id}`}
                  confirmLabel="Excluir?"
                />
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-xs font-light text-bruma-light/40">
                Nenhuma categoria cadastrada ainda.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={editingId ? "Renomear categoria" : "Nova categoria"}
              required
              className="w-full max-w-xs rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2 text-sm text-bruma-light outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-brasa px-3.5 py-2 text-xs font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50"
            >
              <Plus size={14} />
              {editingId ? "Salvar" : "Adicionar"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={startCreate}
                className="flex size-8 items-center justify-center rounded-xl border border-bruma-light/10 text-bruma-light/50 transition hover:text-bruma-light"
              >
                <X size={14} />
              </button>
            )}
          </form>
          {error && (
            <p className="mt-2 text-xs font-medium text-brasa">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
