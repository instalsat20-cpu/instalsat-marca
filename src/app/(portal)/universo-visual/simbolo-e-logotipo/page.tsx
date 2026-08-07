import { simboloELogotipo } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

export default function SimboloELogotipoPage() {
  return (
    <div>
      <PageTitle title={simboloELogotipo.title} />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SectionCard title={simboloELogotipo.conceito.title}>
          <p>{simboloELogotipo.conceito.text}</p>
        </SectionCard>
        <SectionCard title={simboloELogotipo.logotipia.title}>
          <p>{simboloELogotipo.logotipia.text}</p>
        </SectionCard>
      </div>

      <SectionCard title={simboloELogotipo.regras.title}>
        <ul className="list-disc space-y-1.5 pl-4">
          {simboloELogotipo.regras.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="pt-2 text-xs font-light text-petroleo/60">
          {simboloELogotipo.nota}
        </p>
      </SectionCard>
    </div>
  );
}
