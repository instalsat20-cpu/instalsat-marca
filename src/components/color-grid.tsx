"use client";

import { useState } from "react";
import { Check, Copy, X } from "lucide-react";

type ColorItem = {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
  pantone: string | null;
};

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable, ignore
    }
  }

  return (
    <button
      onClick={copy}
      className="flex w-full items-center justify-between rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-4 py-3 text-left transition hover:border-bruma-light/25"
    >
      <div>
        <p className="text-xs font-medium tracking-wide text-bruma-light/40">
          {label}
        </p>
        <p className="text-sm font-medium text-bruma-light">{value}</p>
      </div>
      {copied ? (
        <Check size={16} className="text-brasa" />
      ) : (
        <Copy size={16} className="text-bruma-light/40" />
      )}
    </button>
  );
}

export function ColorGrid({ colors }: { colors: ColorItem[] }) {
  const [active, setActive] = useState<ColorItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {colors.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c)}
            className="overflow-hidden rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] text-left transition hover:border-bruma-light/25"
          >
            <div className="h-24" style={{ backgroundColor: c.hex }} />
            <div className="p-4">
              <p className="text-sm font-medium text-bruma-light">{c.name}</p>
              <p className="text-xs font-light text-bruma-light/40">
                {c.hex}
              </p>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-bruma-light/10 bg-petroleo p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="size-10 rounded-xl"
                  style={{ backgroundColor: active.hex }}
                />
                <p className="text-lg font-medium text-bruma-light">
                  {active.name}
                </p>
              </div>
              <button
                onClick={() => setActive(null)}
                aria-label="Fechar"
                className="flex size-8 items-center justify-center rounded-full text-bruma-light/50 transition hover:bg-bruma-light/10 hover:text-bruma-light"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <CopyRow label="Hex" value={active.hex} />
              <CopyRow label="RGB" value={active.rgb} />
              <CopyRow label="CMYK" value={active.cmyk} />
              {active.pantone && (
                <CopyRow label="Pantone" value={active.pantone} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
