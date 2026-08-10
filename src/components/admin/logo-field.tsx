"use client";

import { useState } from "react";
import { UploadCloud, X } from "lucide-react";

export function LogoField({
  label,
  helpText,
  value,
  onChange,
  previewBg = "dark",
}: {
  label: string;
  helpText?: string;
  value: string;
  onChange: (url: string) => void;
  previewBg?: "dark" | "light";
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
      {helpText && (
        <p className="mb-2 text-xs font-light text-bruma-light/45">{helpText}</p>
      )}
      <div className="flex items-center gap-4">
        <div
          className={`flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-bruma-light/10 ${
            previewBg === "light" ? "bg-bruma-light" : "bg-petroleo"
          }`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Logo atual" className="max-h-full max-w-full object-contain" />
          ) : (
            <span
              className={`text-[10px] font-light ${
                previewBg === "light" ? "text-petroleo/40" : "text-bruma-light/30"
              }`}
            >
              Sem logo
            </span>
          )}
        </div>

        <div className="flex flex-col items-start gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:border-bruma-light/25">
            <UploadCloud size={16} />
            {loading ? "Enviando..." : "Enviar novo logo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
              disabled={loading}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1 text-xs font-medium text-brasa"
            >
              <X size={13} />
              Remover logo
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-xs font-medium text-brasa">{error}</p>}
    </div>
  );
}
