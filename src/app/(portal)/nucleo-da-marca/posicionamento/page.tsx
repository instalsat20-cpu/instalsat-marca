import { posicionamento } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

export default function PosicionamentoPage() {
  return (
    <div>
      <PageTitle title={posicionamento.title} />
      <SectionCard>
        {posicionamento.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </SectionCard>
    </div>
  );
}
