import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { ContentManager } from "@/components/admin/content-manager";
import { EDITABLE_SECTIONS } from "@/lib/content-sections";

export default async function AdminConteudoPage() {
  const records = await prisma.content.findMany({
    where: { section: { in: EDITABLE_SECTIONS.map((s) => s.key) } },
  });
  const bySection = new Map(records.map((r) => [r.section, r]));

  const sections = EDITABLE_SECTIONS.map((s) => {
    const record = bySection.get(s.key);
    return {
      key: s.key,
      groupLabel: s.label,
      title: record?.title ?? s.label.split(" — ")[1],
      body: record?.body ?? "",
    };
  });

  return (
    <div>
      <PageTitle
        title="Conteúdo"
        subtitle="Edite os textos exibidos em cada seção da biblioteca."
      />

      <ContentManager sections={sections} />
    </div>
  );
}
