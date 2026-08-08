"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadField } from "@/components/admin/upload-field";

type ExistingFont = {
  id: string;
  name: string;
  type: string;
  googleFont: string | null;
  description: string;
  weights: string | null;
  downloadUrl: string | null;
  order: number;
};

export function TypographyForm({ existing }: { existing?: ExistingFont }) {
  const router = useRouter();
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? "");
  const [type, setType] = useState(existing?.type ?? "support");
  const [googleFont, setGoogleFont] = useState(existing?.googleFont ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [weights, setWeights] = useState(existing?.weights ?? "");
  const [downloadUrl, setDownloadUrl] = useState(existing?.downloadUrl ?? "");
  const [order, setOrder] = useState(existing?.order ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        isEdit ? `/api/admin/typography/${existing!.id}` : "/api/admin/typography",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            type,
            googleFont,
            description,
            weights,
            downloadUrl,
            order: Number(order),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar.");
        return;
      }
      router.push("/admin/visual/tipografia");
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
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          >
            <option value="primary">Primária (logotipo)</option>
            <option value="support">Apoio</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-bruma-light/70">
          Nome no Google Fonts (opcional)
        </label>
        <input
          value={googleFont}
          onChange={(e) => setGoogleFont(e.target.value)}
          placeholder="Ex: Rubik"
          className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-bruma-light/70">Descrição</label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">Pesos</label>
          <input
            value={weights}
            onChange={(e) => setWeights(e.target.value)}
            placeholder="Light, Regular, Medium, Semibold"
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

      <UploadField
        label="Arquivo para download (opcional)"
        value={downloadUrl}
        onChange={setDownloadUrl}
      />

      {error && <p className="text-sm font-medium text-brasa">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-brasa px-5 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar tipografia"}
      </button>
    </form>
  );
}
