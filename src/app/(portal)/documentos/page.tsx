import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { PageTitle } from "@/components/page-title";
import { RichText } from "@/components/rich-text";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger";

export default async function DocumentosPage() {
  const user = await getSessionUser();
  const documents = await prisma.document.findMany({
    orderBy: { name: "asc" },
    include: { category: true },
  });
  const visible = documents.filter((d) => hasPermission(user, d.permission));

  const groups = new Map<string, typeof visible>();
  for (const doc of visible) {
    const key = doc.category?.name ?? "Sem categoria";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(doc);
  }
  const showHeadings = groups.size > 1;

  return (
    <div>
      <PageTitle
        title="Documentos"
        subtitle="Arquivos oficiais da identidade visual da Instalsat."
      />

      {visible.length === 0 ? (
        <p className="text-sm font-light text-bruma-light/40">Em breve.</p>
      ) : (
        <div className="space-y-8">
          {Array.from(groups.entries()).map(([groupName, groupDocs]) => (
            <div key={groupName}>
              {showHeadings && (
                <p className="mb-3 text-xs font-medium tracking-wide text-brasa">
                  {groupName}
                </p>
              )}
              <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {groupDocs.map((doc) => (
                  <StaggerItem
                    key={doc.id}
                    className="flex items-start justify-between gap-4 rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-6"
                  >
                    <div className="flex min-w-0 gap-3">
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-bruma-light/5 text-brasa">
                        <FileText size={18} strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-base font-medium text-bruma-light">
                          {doc.name}
                        </h2>
                        {doc.description && (
                          <div className="mt-1 text-sm">
                            <RichText html={doc.description} />
                          </div>
                        )}
                      </div>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
