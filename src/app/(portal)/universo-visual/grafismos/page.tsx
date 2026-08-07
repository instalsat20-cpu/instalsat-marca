import { grafismos } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

export default function GrafismosPage() {
  return (
    <div>
      <PageTitle title={grafismos.title} />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {grafismos.itens.map((item) => (
          <SectionCard key={item.name} title={item.name}>
            <p>{item.text}</p>
          </SectionCard>
        ))}
      </div>

      <div className="rounded-2xl bg-bruma p-6">
        <p className="text-sm font-light leading-relaxed text-petroleo/80">
          {grafismos.regra}
        </p>
      </div>
    </div>
  );
}
