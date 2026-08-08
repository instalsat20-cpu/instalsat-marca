import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminTipografiaPage() {
  const fonts = await prisma.typography.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <PageTitle title="Tipografia" />
        <Link
          href="/admin/visual/tipografia/novo"
          className="flex items-center gap-2 rounded-xl bg-brasa px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90"
        >
          <Plus size={16} />
          Nova tipografia
        </Link>
      </div>

      <div className="space-y-3">
        {fonts.map((f) => (
          <div
            key={f.id}
            className="flex items-center gap-4 rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04] p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-bruma-light">{f.name}</p>
              <p className="text-xs font-light text-bruma-light/45">
                {f.type === "primary" ? "Primária" : "Apoio"}
                {f.googleFont ? ` · Google Fonts: ${f.googleFont}` : ""}
              </p>
            </div>
            <Link
              href={`/admin/visual/tipografia/${f.id}`}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-bruma-light/50 transition hover:bg-bruma-light/10 hover:text-bruma-light"
            >
              <Pencil size={16} />
            </Link>
            <DeleteButton url={`/api/admin/typography/${f.id}`} confirmLabel="Excluir?" />
          </div>
        ))}
      </div>

      {fonts.length === 0 && (
        <p className="text-sm font-light text-bruma-light/40">Nenhuma tipografia cadastrada.</p>
      )}
    </div>
  );
}
