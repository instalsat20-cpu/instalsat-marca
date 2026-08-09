"use client";

import { useState } from "react";
import { UploadField } from "@/components/admin/upload-field";

type ExistingElement = {
  id: string;
  name: string;
  type: string;
  description: string;
  format: string;
  colorProfile: string;
  previewUrl: string | null;
  downloadUrl: string;
  permission: string;
};

export function ElementForm({
  existing,
  onSuccess,
}: {
  existing?: ExistingElement;
  onSuccess: () => void;
}) {
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? "");
  const [type, setType] = useState(existing?.type ?? "arco-atmosfera");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [format, setFormat] = useState(existing?.format ?? "PNG");
  const [colorProfile, setColorProfile] = useState(existing?.colorProfile ?? "RGB");
  const [previewUrl, setPreviewUrl] = useState(existing?.previewUrl ?? "");
  const [downloadUrl, setDownloadUrl] = useState(existing?.downloadUrl ?? "");
  const [permission, setPermission] = useState(existing?.permission ?? "elements_basic");
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
        isEdit ? `/api/admin/elements/${existing!.id}` : "/api/admin/elements",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            type,
            description,
            format,
            colorProfile,
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
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          >
            <option value="arco-atmosfera">Arco-Atmosfera</option>
            <option value="arco-mascara">Arco-Máscara</option>
            <option value="quadrado-frame">Quadrado-Frame</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-bruma-light/70">Descrição</label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Formato</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          >
            {["AI", "SVG", "PNG", "PDF", "EPS"].map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Perfil de cor</label>
          <select
            value={colorProfile}
            onChange={(e) => setColorProfile(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          >
            <option value="RGB">RGB</option>
            <option value="CMYK">CMYK</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Permissão</label>
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          >
            <option value="elements_basic">Básico (PNG, PDF)</option>
            <option value="elements_advanced">Avançado (AI, SVG, EPS)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UploadField label="Preview" value={previewUrl} onChange={setPreviewUrl} />
        <UploadField label="Arquivo para download" value={downloadUrl} onChange={setDownloadUrl} />
      </div>

      {error && <p className="text-sm font-medium text-brasa">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-brasa px-5 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar elemento"}
      </button>
    </form>
  );
}
