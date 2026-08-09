import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { LockedCard } from "@/components/locked-card";
import { PageTitle } from "@/components/page-title";
import { ColorGrid } from "@/components/color-grid";

const SECTION = "visual_cores";
const TITLE = "Cores";

export default async function CoresPage() {
  const user = await getSessionUser();
  if (!hasPermission(user, SECTION)) return <LockedCard title={TITLE} />;

  const [content, colors] = await Promise.all([
    prisma.content.findUnique({ where: { section: SECTION } }),
    prisma.color.findMany({ orderBy: { order: "asc" }, include: { category: true } }),
  ]);

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

      {colors.length > 0 ? (
        <ColorGrid colors={colors} />
      ) : (
        <p className="text-sm font-light text-bruma-light/40">
          Nenhuma cor cadastrada ainda.
        </p>
      )}
    </div>
  );
}
