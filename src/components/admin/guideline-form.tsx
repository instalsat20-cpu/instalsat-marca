"use client";

import { useState } from "react";
import { UploadField } from "@/components/admin/upload-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type ExistingGuideline = {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  order: number;
};

export function GuidelineForm({
  existing,
  onSuccess,
}: {
  existing?: ExistingGuideline;
  onSuccess: () => void;
}) {
  const isEdit = !!existing;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? "");
  const [order, setOrder] = useState(existing?.order ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        isEdit ? `/api/admin/guidelines/${existing!.id}` : "/api/admin/guidelines",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, body, imageUrl, order: Number(order) }),
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
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Título</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Margem de segurança"
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
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

      <div>
        <label className="mb-1 block text-sm font-medium text-bruma-light/70">
          Texto explicativo
        </label>
        <RichTextEditor value={body} onChange={setBody} />
      </div>

      <UploadField label="Imagem de referência (opcional)" value={imageUrl} onChange={setImageUrl} />

      {error && <p className="text-sm font-medium text-brasa">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-brasa px-5 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar diretriz"}
      </button>
    </form>
  );
}
