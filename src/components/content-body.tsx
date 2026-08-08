import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

export function ContentBody({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div>
      <PageTitle title={title} />
      <SectionCard>
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p className="text-bruma-light/40">
            Conteúdo ainda não cadastrado para esta seção.
          </p>
        )}
      </SectionCard>
    </div>
  );
}
