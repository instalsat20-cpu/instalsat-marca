"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

export function UploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Falha ao enviar.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Falha ao enviar.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-bruma-light/70">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:border-bruma-light/25">
          <UploadCloud size={16} />
          {loading ? "Enviando..." : "Selecionar arquivo"}
          <input type="file" className="hidden" onChange={handleFile} disabled={loading} />
        </label>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-xs font-light text-brasa underline"
          >
            arquivo enviado
          </a>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-brasa">{error}</p>}
    </div>
  );
}
