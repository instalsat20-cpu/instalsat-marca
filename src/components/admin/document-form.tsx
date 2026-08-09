"use client";

import { useState } from "react";
import { UploadField } from "@/components/admin/upload-field";

type ExistingDocument = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  previewUrl: string | null;
  downloadUrl: string;
  permission: string;
};

export function DocumentForm({
  existing,
  onSuccess,
}: {
  existing?: ExistingDocument;
  onSuccess: () => void;
}) {
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? "");
  const [category, setCategory] = useState(existing?.category ?? "manual");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [previewUrl, setPreviewUrl] = useState(existing?.previewUrl ?? "");
  const [downloadUrl, setDownloadUrl] = useState(existing?.downloadUrl ?? "");
  const [permission] = useState(existing?.permission ?? "docs_basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!downloadUrl) {
      setError("Envie o arquivo de download.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        isEdit ? `/api/admin/documents/${existing!.id}` : "/api/admin/documents",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            category,
            description,
            previewUrl,
            downloadUrl,
            permission,
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
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          >
            <option value="manual">Manual</option>
            <option value="certificado">Certificado</option>
            <option value="outros">Outros</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-bruma-light/70">
          Descrição (opcional)
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UploadField label="Preview (opcional)" value={previewUrl} onChange={setPreviewUrl} />
        <UploadField label="Arquivo para download" value={downloadUrl} onChange={setDownloadUrl} />
      </div>

      {error && <p className="text-sm font-medium text-brasa">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-brasa px-5 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar documento"}
      </button>
    </form>
  );
}
