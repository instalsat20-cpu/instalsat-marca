"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Modal } from "@/components/admin/modal";
import { ElementForm } from "@/components/admin/element-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger";
import type { CategoryItem } from "@/components/admin/category-manager";

type ElementItem = {
  id: string;
  name: string;
  categoryId: string | null;
  category: { name: string } | null;
  description: string;
  format: string;
  colorProfile: string;
  previewUrl: string | null;
  downloadUrl: string;
  permission: string;
};

export function ElementsManager({
  elements,
  categories,
}: {
  elements: ElementItem[];
  categories: CategoryItem[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ElementItem | "new" | null>(null);

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
          Novo elemento
        </button>
      </div>

      <StaggerGrid className="space-y-3">
        {elements.map((el) => (
          <StaggerItem
            key={el.id}
            hover={false}
            className="flex items-center gap-4 rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04] p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-bruma-light">{el.name}</p>
              <p className="text-xs font-light text-bruma-light/45">
                {el.category?.name ?? "Sem categoria"} · {el.format} · {el.colorProfile} · {el.permission}
              </p>
            </div>
            <button
              onClick={() => setEditing(el)}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-bruma-light/50 transition hover:bg-bruma-light/10 hover:text-bruma-light"
            >
              <Pencil size={16} />
            </button>
            <DeleteButton url={`/api/admin/elements/${el.id}`} confirmLabel="Excluir?" />
          </StaggerItem>
        ))}
      </StaggerGrid>

      {elements.length === 0 && (
        <p className="text-sm font-light text-bruma-light/40">Nenhum grafismo cadastrado.</p>
      )}

      <Modal
        open={editing !== null}
        title={editing === "new" ? "Novo elemento gráfico" : editing ? `Editar ${editing.name}` : ""}
        onClose={close}
      >
        {editing && (
          <ElementForm
            existing={editing === "new" ? undefined : editing}
            categories={categories}
            onSuccess={handleSuccess}
          />
        )}
      </Modal>
    </>
  );
}
