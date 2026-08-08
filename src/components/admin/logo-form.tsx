"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadField } from "@/components/admin/upload-field";

type ExistingLogo = {
  id: string;
  name: string;
  variation: string;
  colorMode: string;
  format: string;
  colorProfile: string;
  previewUrl: string | null;
  downloadUrl: string;
  permission: string;
};

export function LogoForm({ existing }: { existing?: ExistingLogo }) {
  const router = useRouter();
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? "");
  const [variation, setVariation] = useState(existing?.variation ?? "");
  const [colorMode, setColorMode] = useState(existing?.colorMode ?? "colorido");
  const [format, setFormat] = useState(existing?.format ?? "PNG");
  const [colorProfile, setColorProfile] = useState(existing?.colorProfile ?? "RGB");
  const [previewUrl, setPreviewUrl] = useState(existing?.previewUrl ?? "");
  const [downloadUrl, setDownloadUrl] = useState(existing?.downloadUrl ?? "");
  const [permission, setPermission] = useState(existing?.permission ?? "logo_basic");
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
        isEdit ? `/api/admin/logos/${existing!.id}` : "/api/admin/logos",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            variation,
            colorMode,
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
      router.push("/admin/visual/logos");
      router.refresh();
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
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Variação</label>
          <input
            required
            value={variation}
            onChange={(e) => setVariation(e.target.value)}
            placeholder="Horizontal, Vertical, Símbolo isolado..."
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Modo de cor</label>
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          >
            <option value="colorido">Colorido</option>
            <option value="monocromático">Monocromático</option>
            <option value="negativo">Negativo</option>
          </select>
        </div>
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
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-bruma-light/70">
          Permissão necessária
        </label>
        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none sm:w-64"
        >
          <option value="logo_basic">Básico (PNG, PDF)</option>
          <option value="logo_advanced">Avançado (AI, SVG, EPS)</option>
        </select>
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
        {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar logo"}
      </button>
    </form>
  );
}
