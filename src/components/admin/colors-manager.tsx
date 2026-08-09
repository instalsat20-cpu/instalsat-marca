"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Modal } from "@/components/admin/modal";
import { ColorForm } from "@/components/admin/color-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger";
import type { CategoryItem } from "@/components/admin/category-manager";

type ColorItem = {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
  pantone: string | null;
  order: number;
  categoryId: string | null;
  category: { name: string } | null;
};

export function ColorsManager({
  colors,
  categories,
}: {
  colors: ColorItem[];
  categories: CategoryItem[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ColorItem | "new" | null>(null);

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
          Nova cor
        </button>
      </div>

      <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {colors.map((c) => (
          <StaggerItem
            key={c.id}
            hover={false}
            className="flex items-center gap-4 rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04] p-4"
          >
            <div
              className="size-14 shrink-0 rounded-xl"
              style={{ backgroundColor: c.hex }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-bruma-light">{c.name}</p>
              <p className="text-xs font-light text-bruma-light/45">
                {c.hex}
                {c.category ? ` · ${c.category.name}` : ""}
              </p>
            </div>
            <button
              onClick={() => setEditing(c)}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-bruma-light/50 transition hover:bg-bruma-light/10 hover:text-bruma-light"
            >
              <Pencil size={16} />
            </button>
            <DeleteButton url={`/api/admin/colors/${c.id}`} confirmLabel="Excluir?" />
          </StaggerItem>
        ))}
      </StaggerGrid>

      {colors.length === 0 && (
        <p className="text-sm font-light text-bruma-light/40">Nenhuma cor cadastrada.</p>
      )}

      <Modal
        open={editing !== null}
        title={editing === "new" ? "Nova cor" : editing ? `Editar ${editing.name}` : ""}
        onClose={close}
      >
        {editing && (
          <ColorForm
            existing={editing === "new" ? undefined : editing}
            categories={categories}
            onSuccess={handleSuccess}
          />
        )}
      </Modal>
    </>
  );
}
