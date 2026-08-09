"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Modal } from "@/components/admin/modal";
import { LogoForm } from "@/components/admin/logo-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger";
import type { CategoryItem } from "@/components/admin/category-manager";

type LogoItem = {
  id: string;
  name: string;
  categoryId: string | null;
  category: { name: string } | null;
  colorMode: string;
  format: string;
  colorProfile: string;
  previewUrl: string | null;
  downloadUrl: string;
  permission: string;
};

export function LogosManager({
  logos,
  categories,
}: {
  logos: LogoItem[];
  categories: CategoryItem[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<LogoItem | "new" | null>(null);

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
          Novo arquivo
        </button>
      </div>

      <StaggerGrid className="space-y-3">
        {logos.map((l) => (
          <StaggerItem
            key={l.id}
            hover={false}
            className="flex items-center gap-4 rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04] p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-bruma-light">{l.name}</p>
              <p className="text-xs font-light text-bruma-light/45">
                {l.category?.name ?? "Sem categoria"} · {l.format} · {l.colorProfile} · {l.permission}
              </p>
            </div>
            <button
              onClick={() => setEditing(l)}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-bruma-light/50 transition hover:bg-bruma-light/10 hover:text-bruma-light"
            >
              <Pencil size={16} />
            </button>
            <DeleteButton url={`/api/admin/logos/${l.id}`} confirmLabel="Excluir?" />
          </StaggerItem>
        ))}
      </StaggerGrid>

      {logos.length === 0 && (
        <p className="text-sm font-light text-bruma-light/40">Nenhum logo cadastrado.</p>
      )}

      <Modal
        open={editing !== null}
        title={editing === "new" ? "Novo arquivo de logo" : editing ? `Editar ${editing.name}` : ""}
        onClose={close}
      >
        {editing && (
          <LogoForm
            existing={editing === "new" ? undefined : editing}
            categories={categories}
            onSuccess={handleSuccess}
          />
        )}
      </Modal>
    </>
  );
}
