import { tipografia } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

const WEIGHT_CLASS: Record<string, string> = {
  Light: "font-light",
  Regular: "font-normal",
  Medium: "font-medium",
  Semibold: "font-semibold",
};

export default function TipografiaPage() {
  return (
    <div>
      <PageTitle title={tipografia.title} />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SectionCard title={tipografia.nortica.title}>
          <p>{tipografia.nortica.text}</p>
        </SectionCard>
        <SectionCard title={tipografia.rubik.title}>
          <p>{tipografia.rubik.text}</p>
        </SectionCard>
      </div>

      <SectionCard>
        <div className="space-y-4">
          {tipografia.pesos.map((peso) => (
            <div key={peso.name} className="border-b border-bruma pb-4 last:border-0 last:pb-0">
              <p className={`text-2xl text-petroleo ${WEIGHT_CLASS[peso.name]}`}>
                Aa {peso.name}
              </p>
              <p className="mt-1 text-sm font-light text-petroleo/60">
                {peso.uso}
              </p>
            </div>
          ))}
        </div>
        <p className="pt-2 text-xs font-light text-petroleo/60">
          {tipografia.foraDoSistema}
        </p>
      </SectionCard>

      <div className="mt-4">
        <SectionCard title={tipografia.regras.title}>
          <ul className="list-disc space-y-1.5 pl-4">
            {tipografia.regras.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
