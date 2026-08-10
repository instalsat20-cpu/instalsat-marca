import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { LockedCard } from "@/components/locked-card";
import { PageTitle } from "@/components/page-title";
import { RichText } from "@/components/rich-text";

const SECTION = "visual_diretrizes";
const TITLE = "Diretrizes de Uso";

export default async function DiretrizesPage() {
  const user = await getSessionUser();
  if (!hasPermission(user, SECTION)) return <LockedCard title={TITLE} />;

  const [content, guidelines] = await Promise.all([
    prisma.content.findUnique({ where: { section: SECTION } }),
    prisma.guideLine.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <PageTitle title={content?.title ?? TITLE} />

      {content?.body && (
        <div className="mb-6 rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-7 text-sm">
          <RichText html={content.body} />
        </div>
      )}

      {guidelines.length === 0 ? (
        <p className="text-sm font-light text-bruma-light/40">
          Nenhuma diretriz cadastrada ainda.
        </p>
      ) : (
        <div className="space-y-14">
          {guidelines.map((g) => (
            <div key={g.id}>
              {g.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={g.imageUrl}
                  alt={g.title}
                  className="mb-5 w-full rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.03] object-contain"
                />
              )}
              <h2 className="mb-2 text-lg font-medium text-bruma-light">{g.title}</h2>
              <RichText html={g.body} className="text-sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
