"use client";

import { useState } from "react";

type IntegrationState = {
  configured: boolean;
  prefix: string | null;
};

type ApiKeyFieldProps = {
  field: "geminiApiKey" | "googleFontsApiKey";
  label: string;
  initial: IntegrationState;
};

function ApiKeyField({ field, label, initial }: ApiKeyFieldProps) {
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Não foi possível salvar.");
        return;
      }
      const key = field === "geminiApiKey" ? "gemini" : "googleFonts";
      setStatus(data.settings.integrations[key]);
      setValue("");
      setMessage("Salvo.");
    } catch {
      setMessage("Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-bruma-light/10 bg-bruma-light/5 p-4">
      <label className="mb-2 block text-sm font-medium text-bruma-light/70">{label}</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <input
            type={visible ? "text" : "password"}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={status.configured ? `${status.prefix}... (configurada)` : "Insira a chave"}
            autoComplete="new-password"
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 pr-20 text-sm text-bruma-light outline-none"
          />
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            className="absolute inset-y-0 right-3 text-xs font-medium text-bruma-light/60 hover:text-bruma-light"
          >
            {visible ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={loading}
          className="rounded-xl bg-brasa px-5 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
      <p className="mt-2 text-xs text-bruma-light/50">
        Esta chave substitui a variável de ambiente do servidor. Útil para configurar por marca sem alterar o deploy.
      </p>
      {message && <p className="mt-2 text-xs font-medium text-brasa">{message}</p>}
    </div>
  );
}

export function IntegrationsForm({
  gemini,
  googleFonts,
}: {
  gemini: IntegrationState;
  googleFonts: IntegrationState;
}) {
  return (
    <section className="mt-10 border-t border-bruma-light/10 pt-8">
      <h2 className="text-xl font-semibold text-bruma-light">Integrações</h2>
      <div className="mt-4 space-y-4">
        <ApiKeyField
          field="geminiApiKey"
          label="Chave da API Gemini (Assistente de Marca)"
          initial={gemini}
        />
        <ApiKeyField
          field="googleFontsApiKey"
          label="Chave da API Google Fonts (Seletor de fontes)"
          initial={googleFonts}
        />
      </div>
    </section>
  );
}
