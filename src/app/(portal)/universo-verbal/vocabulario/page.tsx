import { vocabulario } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

export default function VocabularioPage() {
  return (
    <div>
      <PageTitle title={vocabulario.title} />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SectionCard title={vocabulario.pertence.title}>
          <div className="flex flex-wrap gap-2">
            {vocabulario.pertence.items.map((word) => (
              <span
                key={word}
                className="rounded-full border border-bruma-light/10 bg-bruma-light/5 px-3 py-1 text-xs font-medium text-bruma-light/80"
              >
                {word}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={vocabulario.evita.title}>
          <ul className="list-disc space-y-1.5 pl-4">
            {vocabulario.evita.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard>
        <div className="space-y-3">
          {vocabulario.fixos.map((f) => (
            <div key={f.label}>
              <p className="text-xs font-medium tracking-wide text-brasa">
                {f.label}
              </p>
              <p className="text-base font-medium text-bruma-light">
                {f.text}
              </p>
            </div>
          ))}
        </div>
        <p className="pt-2 text-xs font-light text-bruma-light/45">
          {vocabulario.nota}
        </p>
      </SectionCard>
    </div>
  );
}
