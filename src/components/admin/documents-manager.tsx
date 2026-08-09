"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Modal } from "@/components/admin/modal";
import { DocumentForm } from "@/components/admin/document-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger";

type DocumentItem = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  previewUrl: string | null;
  downloadUrl: string;
  permission: string;
};

export function DocumentsManager({ documents }: { documents: DocumentItem[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<DocumentItem | "new" | null>(null);

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
          Novo documento
        </button>
      </div>

      <StaggerGrid className="space-y-3">
        {documents.map((doc) => (
          <StaggerItem
            key={doc.id}
            hover={false}
            className="flex items-center gap-4 rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04] p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-bruma-light">{doc.name}</p>
              <p className="text-xs font-light text-bruma-light/45">{doc.category}</p>
            </div>
            <button
              onClick={() => setEditing(doc)}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-bruma-light/50 transition hover:bg-bruma-light/10 hover:text-bruma-light"
            >
              <Pencil size={16} />
            </button>
            <DeleteButton url={`/api/admin/documents/${doc.id}`} confirmLabel="Excluir?" />
          </StaggerItem>
        ))}
      </StaggerGrid>

      {documents.length === 0 && (
        <p className="text-sm font-light text-bruma-light/40">Nenhum documento cadastrado.</p>
      )}

      <Modal
        open={editing !== null}
        title={editing === "new" ? "Novo documento" : editing ? `Editar ${editing.name}` : ""}
        onClose={close}
      >
        {editing && (
          <DocumentForm
            existing={editing === "new" ? undefined : editing}
            onSuccess={handleSuccess}
          />
        )}
      </Modal>
    </>
  );
}
