import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { LockedCard } from "@/components/locked-card";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";
import { RichText } from "@/components/rich-text";
import { FontSpecimen } from "@/components/font-specimen";
import { DownloadAllFontsButton } from "@/components/download-all-fonts-button";
import { parseWeightNames, firstParagraphText } from "@/lib/font-weights";

const SECTION = "visual_tipografia";
const TITLE = "Tipografia";

const MANIFESTO_FALLBACK =
  "A empresa que fica, para que o essencial nunca pare.";

export default async function TipografiaPage() {
  const user = await getSessionUser();
  if (!hasPermission(user, SECTION)) return <LockedCard title={TITLE} />;

  const [content, fonts, manifesto] = await Promise.all([
    prisma.content.findUnique({ where: { section: SECTION } }),
    prisma.typography.findMany({
      orderBy: { order: "asc" },
      include: { applications: { orderBy: { order: "asc" } } },
    }),
    prisma.content.findUnique({ where: { section: "verbal_manifesto" } }),
  ]);

  const manifestoExcerpt = firstParagraphText(manifesto?.body, MANIFESTO_FALLBACK);

  const primaryFonts = fonts.filter((f) => f.type === "primary");
  const supportFonts = fonts.filter((f) => f.type === "support");
  const downloadableSupportFonts = supportFonts
    .filter((f) => f.downloadUrl)
    .map((f) => ({ name: f.name, downloadUrl: f.downloadUrl! }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <PageTitle title={content?.title ?? TITLE} />
        <DownloadAllFontsButton fonts={downloadableSupportFonts} />
      </div>

      {content?.body && (
        <div className="mb-6 rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-7 text-sm">
          <RichText html={content.body} />
        </div>
      )}

      <div className="space-y-4">
        {primaryFonts.map((font) => (
          <SectionCard key={font.id} title={font.name}>
            <RichText html={font.description} />
            {font.weights && (
              <p className="text-xs font-medium tracking-wide text-bruma-light/40">
                Pesos: {font.weights}
              </p>
            )}
            <p className="rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-4 py-3 text-sm font-light text-bruma-light/50">
              Esta fonte é exclusiva do logotipo e não está disponível para download.
            </p>
          </SectionCard>
        ))}

        {supportFonts.map((font, i) => (
          <div key={font.id}>
            {i > 0 && <div className="my-8 h-px bg-bruma-light/10" />}
            <SectionCard title={font.name}>
              <RichText html={font.description} />
              <FontSpecimen
                family={font.googleFont!}
                weightNames={parseWeightNames(font.weights)}
                manifestoExcerpt={manifestoExcerpt}
                applications={font.applications}
              />
            </SectionCard>
          </div>
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
