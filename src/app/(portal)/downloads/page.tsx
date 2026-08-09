import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { PageTitle } from "@/components/page-title";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger";

export default async function DownloadsPage() {
  const user = await getSessionUser();
  const documents = await prisma.document.findMany({
    orderBy: { name: "asc" },
    include: { category: true },
  });
  const visible = documents.filter((d) => hasPermission(user, d.permission));

  return (
    <div>
      <PageTitle
        title="Downloads"
        subtitle="Arquivos oficiais da identidade visual da Instalsat."
      />

      {visible.length === 0 ? (
        <p className="text-sm font-light text-bruma-light/40">Em breve.</p>
      ) : (
        <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visible.map((doc) => (
            <StaggerItem
              key={doc.id}
              className="flex items-center justify-between rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-6"
            >
              <div>
                <p className="text-xs font-medium tracking-wide text-brasa">
                  {doc.category?.name ?? "Sem categoria"}
                </p>
                <h2 className="text-base font-medium text-bruma-light">
                  {doc.name}
                </h2>
                {doc.description && (
                  <p className="mt-1 text-sm font-light text-bruma-light/50">
                    {doc.description}
                  </p>
                )}
              </div>

              <a
                href={doc.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-xl bg-brasa px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90"
              >
                Baixar
              </a>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </div>
  );
}
