import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { LockedCard } from "@/components/locked-card";
import { PageTitle } from "@/components/page-title";
import { DownloadGallery } from "@/components/download-gallery";

const SECTION = "visual_simbolo";
const TITLE = "Símbolo e Logotipo";

export default async function SimboloELogotipoPage() {
  const user = await getSessionUser();
  if (!hasPermission(user, SECTION)) return <LockedCard title={TITLE} />;

  const [content, logos] = await Promise.all([
    prisma.content.findUnique({ where: { section: SECTION } }),
    prisma.logoFile.findMany({ orderBy: { name: "asc" } }),
  ]);

  const visible = logos.filter((logo) => hasPermission(user, logo.permission));

  const items = visible.map((logo) => ({
    id: logo.id,
    name: logo.name,
    group: logo.variation,
    format: logo.format,
    colorProfile: logo.colorProfile,
    subtitle: logo.colorMode,
    previewUrl: logo.previewUrl,
    downloadUrl: logo.downloadUrl,
  }));

  return (
    <div>
      <PageTitle title={content?.title ?? TITLE} />

      {content?.body && (
        <div className="mb-6 rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-7">
          {content.body.split(/\n\s*\n/).map((p, i) => (
            <p
              key={i}
              className="text-sm font-light leading-relaxed text-bruma-light/70"
            >
              {p.trim()}
            </p>
          ))}
        </div>
      )}

      {items.length > 0 ? (
        <DownloadGallery items={items} groupLabel="Variações" />
      ) : (
        <p className="text-sm font-light text-bruma-light/40">Em breve.</p>
      )}
    </div>
  );
}
