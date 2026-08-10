"use client";

import { useState } from "react";
import { UploadField } from "@/components/admin/upload-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Plus, Trash2 } from "lucide-react";

export type TypographyApplicationInput = {
  id?: string;
  category: string;
  weight: string;
  sizePx: number | null;
  lineHeight: string | null;
  exampleText: string;
  order: number;
};

type ExistingFont = {
  id: string;
  name: string;
  type: string;
  googleFont: string | null;
  description: string;
  weights: string | null;
  downloadUrl: string | null;
  order: number;
  applications: TypographyApplicationInput[];
};

export function TypographyForm({
  existing,
  onSuccess,
}: {
  existing?: ExistingFont;
  onSuccess: () => void;
}) {
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? "");
  const [type, setType] = useState(existing?.type ?? "support");
  const [googleFont, setGoogleFont] = useState(existing?.googleFont ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [weights, setWeights] = useState(existing?.weights ?? "");
  const [downloadUrl, setDownloadUrl] = useState(existing?.downloadUrl ?? "");
  const [order, setOrder] = useState(existing?.order ?? 0);
  const [applications, setApplications] = useState<TypographyApplicationInput[]>(
    existing?.applications ?? []
  );
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
            applications: type === "support" ? applications : [],
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
        <RichTextEditor value={description} onChange={setDescription} />
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

      {type === "support" && (
        <div className="space-y-4 border-t border-bruma-light/10 pt-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-bruma-light">Aplicações</h3>
              <p className="mt-1 text-xs text-bruma-light/45">Defina como a fonte será aplicada na biblioteca de marca.</p>
            </div>
            <button
              type="button"
              onClick={() => setApplications((current) => [
                ...current,
                {
                  category: "Título",
                  weight: weights.split(",").map((value) => value.trim()).filter(Boolean)[0] ?? "Regular",
                  sizePx: 16,
                  lineHeight: "1.4",
                  exampleText: "Texto de exemplo",
                  order: current.length,
                },
              ])}
              className="flex items-center gap-2 rounded-xl border border-bruma-light/10 px-3 py-2 text-xs font-medium text-bruma-light transition hover:bg-bruma-light/5"
            >
              <Plus size={14} /> Adicionar aplicação
            </button>
          </div>

          <datalist id="typography-application-categories">
            {["Título", "Subtítulo", "Parágrafo", "Destaque", "Legenda", "Botão", "Caption"].map((category) => <option key={category} value={category} />)}
          </datalist>

          {applications.map((application, index) => {
            const updateApplication = (patch: Partial<TypographyApplicationInput>) => {
              setApplications((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
            };
            const weightOptions = Array.from(new Set([
              ...weights.split(",").map((value) => value.trim()).filter(Boolean),
              "Light", "Regular", "Medium", "Semibold",
            ]));

            return (
              <div key={application.id ?? index} className="rounded-xl border border-bruma-light/10 bg-bruma-light/[0.03] p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <label className="text-xs text-bruma-light/55 lg:col-span-2">Categoria
                    <input required list="typography-application-categories" value={application.category} onChange={(event) => updateApplication({ category: event.target.value })} className="mt-1 w-full rounded-lg border border-bruma-light/10 bg-bruma-light/5 px-3 py-2 text-sm text-bruma-light outline-none" />
                  </label>
                  <label className="text-xs text-bruma-light/55">Peso
                    <select value={application.weight} onChange={(event) => updateApplication({ weight: event.target.value })} className="mt-1 w-full rounded-lg border border-bruma-light/10 bg-petroleo px-3 py-2 text-sm text-bruma-light outline-none">{weightOptions.map((weight) => <option key={weight}>{weight}</option>)}</select>
                  </label>
                  <label className="text-xs text-bruma-light/55">Tamanho (px)
                    <input type="number" min="1" value={application.sizePx ?? ""} onChange={(event) => updateApplication({ sizePx: event.target.value ? Number(event.target.value) : null })} className="mt-1 w-full rounded-lg border border-bruma-light/10 bg-bruma-light/5 px-3 py-2 text-sm text-bruma-light outline-none" />
                  </label>
                  <label className="text-xs text-bruma-light/55">Line height
                    <input value={application.lineHeight ?? ""} onChange={(event) => updateApplication({ lineHeight: event.target.value })} placeholder="1.3" className="mt-1 w-full rounded-lg border border-bruma-light/10 bg-bruma-light/5 px-3 py-2 text-sm text-bruma-light outline-none" />
                  </label>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_100px_auto] sm:items-end">
                  <label className="text-xs text-bruma-light/55">Texto de exemplo
                    <textarea required value={application.exampleText} onChange={(event) => updateApplication({ exampleText: event.target.value })} rows={2} className="mt-1 w-full resize-y rounded-lg border border-bruma-light/10 bg-bruma-light/5 px-3 py-2 text-sm text-bruma-light outline-none" />
                  </label>
                  <label className="text-xs text-bruma-light/55">Ordem
                    <input type="number" value={application.order} onChange={(event) => updateApplication({ order: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-bruma-light/10 bg-bruma-light/5 px-3 py-2 text-sm text-bruma-light outline-none" />
                  </label>
                  <button type="button" aria-label={`Remover aplicação ${application.category}`} onClick={() => setApplications((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="flex size-10 items-center justify-center rounded-lg text-bruma-light/45 hover:bg-bruma-light/5 hover:text-brasa"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}

          {applications.length === 0 && <p className="text-xs text-bruma-light/40">Nenhuma aplicação cadastrada.</p>}
        </div>
      )}

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
