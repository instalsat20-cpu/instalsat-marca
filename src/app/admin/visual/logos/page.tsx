import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminLogosPage() {
  const logos = await prisma.logoFile.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <PageTitle title="Logos" />
        <Link
          href="/admin/visual/logos/novo"
          className="flex items-center gap-2 rounded-xl bg-brasa px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90"
        >
          <Plus size={16} />
          Novo arquivo
        </Link>
      </div>

      <div className="space-y-3">
        {logos.map((l) => (
          <div
            key={l.id}
            className="flex items-center gap-4 rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04] p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-bruma-light">{l.name}</p>
              <p className="text-xs font-light text-bruma-light/45">
                {l.variation} · {l.format} · {l.colorProfile} · {l.permission}
              </p>
            </div>
            <Link
              href={`/admin/visual/logos/${l.id}`}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-bruma-light/50 transition hover:bg-bruma-light/10 hover:text-bruma-light"
            >
              <Pencil size={16} />
            </Link>
            <DeleteButton url={`/api/admin/logos/${l.id}`} confirmLabel="Excluir?" />
          </div>
        ))}
      </div>

      {logos.length === 0 && (
        <p className="text-sm font-light text-bruma-light/40">Nenhum logo cadastrado.</p>
      )}
    </div>
  );
}
