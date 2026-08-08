import { simboloELogotipo } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

export default function SimboloELogotipoPage() {
  return (
    <div>
      <PageTitle title={simboloELogotipo.title} />

      <div className="mb-4 rounded-3xl bg-brasa p-7">
        <p className="mb-1 text-xs font-medium tracking-wide text-bruma-light/80">
          Conceito central
        </p>
        <p className="text-2xl font-medium text-bruma-light">
          {simboloELogotipo.conceitoCentral}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SectionCard title={simboloELogotipo.conceito.title}>
          <p>{simboloELogotipo.conceito.text}</p>
        </SectionCard>
        <SectionCard title={simboloELogotipo.detalhe.title}>
          <p>{simboloELogotipo.detalhe.text}</p>
        </SectionCard>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SectionCard title={simboloELogotipo.oArco.title}>
          <p>{simboloELogotipo.oArco.text}</p>
        </SectionCard>
        <SectionCard title={simboloELogotipo.oQuadrado.title}>
          <p>{simboloELogotipo.oQuadrado.text}</p>
        </SectionCard>
      </div>

      <div className="mb-4">
        <SectionCard title={simboloELogotipo.logotipia.title}>
          <p>{simboloELogotipo.logotipia.text}</p>
        </SectionCard>
      </div>

      <div className="mb-4">
        <SectionCard title={simboloELogotipo.versoes.title}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {simboloELogotipo.versoes.items.map((v) => (
              <div key={v.name}>
                <p className="mb-1 text-sm font-medium text-bruma-light">
                  {v.name}
                </p>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title={simboloELogotipo.regras.title}>
        <ul className="list-disc space-y-1.5 pl-4">
          {simboloELogotipo.regras.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="pt-2 text-xs font-light text-bruma-light/45">
          {simboloELogotipo.nota}
        </p>
      </SectionCard>
    </div>
  );
}
