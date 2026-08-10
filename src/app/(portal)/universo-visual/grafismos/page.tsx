import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { LockedCard } from "@/components/locked-card";
import { PageTitle } from "@/components/page-title";
import { DownloadGallery } from "@/components/download-gallery";
import { RichText } from "@/components/rich-text";
import { stripHtml } from "@/lib/sanitize";

const SECTION = "visual_grafismos";
const TITLE = "Grafismos";

export default async function GrafismosPage() {
  const user = await getSessionUser();
  if (!hasPermission(user, SECTION)) return <LockedCard title={TITLE} />;

  const [content, elements] = await Promise.all([
    prisma.content.findUnique({ where: { section: SECTION } }),
    prisma.graphicElement.findMany({ orderBy: { name: "asc" }, include: { category: true } }),
  ]);

  const visible = elements.filter((el) => hasPermission(user, el.permission));

  const items = visible.map((el) => ({
    id: el.id,
    name: el.name,
    group: el.category?.name ?? "Sem categoria",
    format: el.format,
    colorProfile: el.colorProfile,
    subtitle: stripHtml(el.description),
    previewUrl: el.previewUrl,
    downloadUrl: el.downloadUrl,
  }));

  return (
    <div>
      <PageTitle title={content?.title ?? TITLE} />

      {content?.body && (
        <div className="mb-6 rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-7 text-sm">
          <RichText html={content.body} />
        </div>
      )}

      {items.length > 0 ? (
        <DownloadGallery items={items} groupLabel="Categorias" />
      ) : (
        <p className="text-sm font-light text-bruma-light/40">Em breve.</p>
      )}
    </div>
  );
}
