import { arquetipos } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

export default function ArquetiposPage() {
  return (
    <div>
      <PageTitle title={arquetipos.title} subtitle={arquetipos.intro} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {arquetipos.cards.map((card) => (
          <SectionCard key={card.label} eyebrow={card.tag} title={card.label}>
            <p>{card.text}</p>
          </SectionCard>
        ))}
      </div>

      <div className="mt-4 rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-7">
        <p className="text-sm font-light leading-relaxed text-bruma-light/65">
          {arquetipos.closing}
        </p>
      </div>
    </div>
  );
}
