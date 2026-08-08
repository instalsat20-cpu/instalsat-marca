"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  url,
  confirmLabel,
}: {
  url: string;
  confirmLabel: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(url, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-light text-bruma-light/60">
          {confirmLabel}
        </span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-brasa px-2.5 py-1 text-xs font-medium text-bruma-light disabled:opacity-50"
        >
          {loading ? "..." : "Confirmar"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-bruma-light/10 px-2.5 py-1 text-xs font-medium text-bruma-light/60"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label="Excluir"
      className="flex size-8 items-center justify-center rounded-lg text-bruma-light/50 transition hover:bg-brasa/15 hover:text-brasa"
    >
      <Trash2 size={16} />
    </button>
  );
}
