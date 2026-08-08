"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadField } from "@/components/admin/upload-field";

type ExistingSettings = {
  brandName: string;
  primaryColor: string;
  accentColor: string;
  bgLight: string;
  bgMedium: string;
  logoUrl: string | null;
  fontFamily: string;
};

export function SettingsForm({ existing }: { existing: ExistingSettings }) {
  const router = useRouter();

  const [brandName, setBrandName] = useState(existing.brandName);
  const [primaryColor, setPrimaryColor] = useState(existing.primaryColor);
  const [accentColor, setAccentColor] = useState(existing.accentColor);
  const [bgLight, setBgLight] = useState(existing.bgLight);
  const [bgMedium, setBgMedium] = useState(existing.bgMedium);
  const [logoUrl, setLogoUrl] = useState(existing.logoUrl ?? "");
  const [fontFamily, setFontFamily] = useState(existing.fontFamily);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          primaryColor,
          accentColor,
          bgLight,
          bgMedium,
          logoUrl,
          fontFamily,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar.");
        return;
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  }

  function colorField(
    label: string,
    value: string,
    setValue: (v: string) => void
  ) {
    return (
      <div>
        <label className="mb-1 block text-sm font-medium text-bruma-light/70">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="size-10 shrink-0 rounded-lg border border-bruma-light/10 bg-transparent"
          />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">
            Nome da marca
          </label>
          <input
            required
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">
            Fonte (Google Fonts)
          </label>
          <input
            required
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {colorField("Cor primária", primaryColor, setPrimaryColor)}
        {colorField("Cor de destaque", accentColor, setAccentColor)}
        {colorField("Fundo claro", bgLight, setBgLight)}
        {colorField("Fundo médio", bgMedium, setBgMedium)}
      </div>

      <UploadField label="Logo (opcional)" value={logoUrl} onChange={setLogoUrl} />

      {error && <p className="text-sm font-medium text-brasa">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-brasa px-5 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar configurações"}
        </button>
        {saved && <span className="text-sm font-medium text-brasa">Salvo.</span>}
      </div>
    </form>
  );
}
