import { diretrizesFotograficas as d } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

export default function DiretrizesFotograficasPage() {
  return (
    <div>
      <PageTitle title={d.title} />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SectionCard title={d.comunica.title}>
          <p>{d.comunica.text}</p>
        </SectionCard>
        <SectionCard title={d.locacoes.title}>
          <p>{d.locacoes.text}</p>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SectionCard title={d.evitar.title}>
          <ul className="list-disc space-y-1.5 pl-4">
            {d.evitar.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title={d.paleta.title}>
          <p>{d.paleta.text}</p>
        </SectionCard>
      </div>
    </div>
  );
}
