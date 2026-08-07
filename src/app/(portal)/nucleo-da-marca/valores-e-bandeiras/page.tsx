import { valoresEBandeiras } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

export default function ValoresEBandeirasPage() {
  return (
    <div>
      <PageTitle title={valoresEBandeiras.title} />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-brasa/30 bg-brasa/10 p-7">
          <p className="mb-1 text-xs font-medium tracking-wide text-brasa">
            {valoresEBandeiras.central.label}
          </p>
          <h2 className="mb-3 text-lg font-medium text-bruma-light">
            {valoresEBandeiras.central.name}
          </h2>
          <p className="text-sm font-light leading-relaxed text-bruma-light/70">
            {valoresEBandeiras.central.text}
          </p>
        </div>

        <SectionCard
          eyebrow={valoresEBandeiras.sustentacao.label}
          title={valoresEBandeiras.sustentacao.name}
        >
          <p>{valoresEBandeiras.sustentacao.text}</p>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {valoresEBandeiras.outros.map((v) => (
          <SectionCard key={v.name} title={v.name}>
            <p>{v.text}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
