"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Modal } from "@/components/admin/modal";
import { TypographyForm } from "@/components/admin/typography-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger";
import type { TypographyApplicationInput } from "@/components/admin/typography-form";

type FontItem = {
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

export function TypographyManager({ fonts }: { fonts: FontItem[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<FontItem | "new" | null>(null);

  function close() {
    setEditing(null);
  }

  function handleSuccess() {
    close();
    router.refresh();
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-end">
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-2 rounded-xl bg-brasa px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90"
        >
          <Plus size={16} />
          Nova tipografia
        </button>
      </div>

      <StaggerGrid className="space-y-3">
        {fonts.map((f) => (
          <StaggerItem
            key={f.id}
            hover={false}
            className="flex items-center gap-4 rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04] p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-bruma-light">{f.name}</p>
              <p className="text-xs font-light text-bruma-light/45">
                {f.type === "primary" ? "Primária" : "Apoio"}
                {f.googleFont ? ` · Google Fonts: ${f.googleFont}` : ""}
              </p>
            </div>
            <button
              onClick={() => setEditing(f)}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-bruma-light/50 transition hover:bg-bruma-light/10 hover:text-bruma-light"
            >
              <Pencil size={16} />
            </button>
            <DeleteButton url={`/api/admin/typography/${f.id}`} confirmLabel="Excluir?" />
          </StaggerItem>
        ))}
      </StaggerGrid>

      {fonts.length === 0 && (
        <p className="text-sm font-light text-bruma-light/40">Nenhuma tipografia cadastrada.</p>
      )}

      <Modal
        open={editing !== null}
        title={editing === "new" ? "Nova tipografia" : editing ? `Editar ${editing.name}` : ""}
        onClose={close}
      >
        {editing && (
          <TypographyForm
            existing={editing === "new" ? undefined : editing}
            onSuccess={handleSuccess}
          />
        )}
      </Modal>
    </>
  );
}
