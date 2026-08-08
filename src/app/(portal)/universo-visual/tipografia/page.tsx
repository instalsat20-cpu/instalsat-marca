import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { LockedCard } from "@/components/locked-card";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

const SECTION = "visual_tipografia";
const TITLE = "Tipografia";

function googleFontsHref(family: string) {
  const encoded = family.trim().replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600&display=swap`;
}

function googleFontsSpecimenUrl(family: string) {
  const encoded = family.trim().replace(/\s+/g, "+");
  return `https://fonts.google.com/specimen/${encoded}`;
}

export default async function TipografiaPage() {
  const user = await getSessionUser();
  if (!hasPermission(user, SECTION)) return <LockedCard title={TITLE} />;

  const [content, fonts] = await Promise.all([
    prisma.content.findUnique({ where: { section: SECTION } }),
    prisma.typography.findMany({ orderBy: { order: "asc" } }),
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

      <div className="space-y-4">
        {fonts.map((font) => (
          <SectionCard key={font.id} title={font.name}>
            <p>{font.description}</p>
            {font.weights && (
              <p className="text-xs font-medium tracking-wide text-bruma-light/40">
                Pesos: {font.weights}
              </p>
            )}

            {font.googleFont && (
              <>
                <link rel="stylesheet" href={googleFontsHref(font.googleFont)} />
                <div
                  className="rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-5 py-6 text-3xl text-bruma-light"
                  style={{ fontFamily: `'${font.googleFont}', sans-serif` }}
                >
                  Aa Instalsat
                </div>
                <a
                  href={googleFontsSpecimenUrl(font.googleFont)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-medium text-brasa"
                >
                  Ver no Google Fonts →
                </a>
              </>
            )}

            {font.downloadUrl && (
              <a
                href={font.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl bg-brasa px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90"
              >
                Baixar fonte
              </a>
            )}
          </SectionCard>
        ))}

        {fonts.length === 0 && (
          <p className="text-sm font-light text-bruma-light/40">
            Nenhuma tipografia cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}
