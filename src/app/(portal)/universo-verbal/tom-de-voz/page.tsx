import { tomDeVoz } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

export default function TomDeVozPage() {
  return (
    <div>
      <PageTitle title={tomDeVoz.title} />

      <SectionCard>
        <p>{tomDeVoz.resumo}</p>
      </SectionCard>

      <div className="my-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tomDeVoz.vozE.map((v) => (
          <div
            key={v}
            className="rounded-xl bg-bruma px-4 py-3 text-center text-sm font-medium text-petroleo"
          >
            {v}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SectionCard title={tomDeVoz.como.title}>
          <ul className="list-disc space-y-1.5 pl-4">
            {tomDeVoz.como.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title={tomDeVoz.naoFala.title}>
          <ul className="list-disc space-y-1.5 pl-4">
            {tomDeVoz.naoFala.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
