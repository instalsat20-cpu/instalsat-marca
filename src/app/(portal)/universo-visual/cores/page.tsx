import { cores } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

const SWATCH_CLASS: Record<string, string> = {
  petroleo: "bg-petroleo",
  brasa: "bg-brasa",
  bruma: "bg-bruma",
  "bruma-light": "bg-bruma-light",
  branco: "bg-white",
};

export default function CoresPage() {
  return (
    <div>
      <PageTitle title={cores.title} />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cores.paleta.map((c) => (
          <div
            key={c.name}
            className="overflow-hidden rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04]"
          >
            <div className={`h-24 ${SWATCH_CLASS[c.swatch]}`} />
            <div className="p-5">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="text-base font-medium text-bruma-light">
                  {c.name}
                </h2>
                <span className="text-xs font-medium text-bruma-light/40">
                  {c.hex}
                </span>
              </div>
              <p className="text-sm font-light leading-relaxed text-bruma-light/60">
                {c.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <SectionCard title={cores.regras.title}>
        <ul className="list-disc space-y-1.5 pl-4">
          {cores.regras.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
