import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminCoresPage() {
  const colors = await prisma.color.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <PageTitle title="Cores" />
        <Link
          href="/admin/visual/cores/novo"
          className="flex items-center gap-2 rounded-xl bg-brasa px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90"
        >
          <Plus size={16} />
          Nova cor
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {colors.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-4 rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04] p-4"
          >
            <div
              className="size-14 shrink-0 rounded-xl"
              style={{ backgroundColor: c.hex }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-bruma-light">{c.name}</p>
              <p className="text-xs font-light text-bruma-light/45">{c.hex}</p>
            </div>
            <Link
              href={`/admin/visual/cores/${c.id}`}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-bruma-light/50 transition hover:bg-bruma-light/10 hover:text-bruma-light"
            >
              <Pencil size={16} />
            </Link>
            <DeleteButton url={`/api/admin/colors/${c.id}`} confirmLabel="Excluir?" />
          </div>
        ))}
      </div>

      {colors.length === 0 && (
        <p className="text-sm font-light text-bruma-light/40">Nenhuma cor cadastrada.</p>
      )}
    </div>
  );
}
