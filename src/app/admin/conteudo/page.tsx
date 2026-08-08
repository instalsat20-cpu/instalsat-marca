import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { ContentSectionEditor } from "@/components/admin/content-section-editor";
import { EDITABLE_SECTIONS } from "@/lib/content-sections";

export default async function AdminConteudoPage() {
  const records = await prisma.content.findMany({
    where: { section: { in: EDITABLE_SECTIONS.map((s) => s.key) } },
  });
  const bySection = new Map(records.map((r) => [r.section, r]));

  return (
    <div>
      <PageTitle
        title="Conteúdo"
        subtitle="Edite os textos exibidos em cada seção da biblioteca."
      />

      <div className="space-y-3">
        {EDITABLE_SECTIONS.map((s) => {
          const record = bySection.get(s.key);
          return (
            <ContentSectionEditor
              key={s.key}
              section={s.key}
              groupLabel={s.label}
              initialTitle={record?.title ?? s.label.split(" — ")[1]}
              initialBody={record?.body ?? ""}
            />
          );
        })}
      </div>
    </div>
  );
}
