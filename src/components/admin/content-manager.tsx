"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Modal } from "@/components/admin/modal";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type Section = {
  key: string;
  groupLabel: string;
  title: string;
  body: string;
};

export function ContentManager({ sections }: { sections: Section[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Section | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openEditor(section: Section) {
    setEditing(section);
    setTitle(section.title);
    setBody(section.body);
    setError(null);
  }

  function close() {
    setEditing(null);
  }

  async function handleSave() {
    if (!editing) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/content/${editing.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar.");
        return;
      }
      close();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <StaggerGrid className="space-y-3">
        {sections.map((s) => (
          <StaggerItem key={s.key} hover={false}>
            <button
              onClick={() => openEditor(s)}
              className="flex w-full items-center justify-between rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04] px-5 py-4 text-left transition hover:border-brasa/30"
            >
              <div>
                <p className="text-xs font-medium tracking-wide text-brasa">
                  {s.groupLabel}
                </p>
                <p className="text-sm font-medium text-bruma-light">
                  {s.title}
                </p>
              </div>
              <Pencil size={16} className="text-bruma-light/40" />
            </button>
          </StaggerItem>
        ))}
      </StaggerGrid>

      <Modal open={!!editing} title={editing?.groupLabel ?? ""} onClose={close}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-bruma-light/40">
              Título exibido na biblioteca
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-bruma-light/40">
              Corpo do texto
            </label>
            <RichTextEditor
              value={body}
              onChange={setBody}
              placeholder="Escreva o conteúdo desta seção..."
              minHeight={240}
            />
          </div>

          {error && <p className="text-sm font-medium text-brasa">{error}</p>}

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-brasa px-5 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </Modal>
    </>
  );
}
