import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";
import { RichText } from "@/components/rich-text";

export function ContentBody({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const hasBody = !!body?.trim();

  return (
    <div>
      <PageTitle title={title} />
      <SectionCard>
        {hasBody ? (
          <RichText html={body} />
        ) : (
          <p className="text-bruma-light/40">
            Conteúdo ainda não cadastrado para esta seção.
          </p>
        )}
      </SectionCard>
    </div>
  );
}
