import { proposito } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

export default function PropositoPage() {
  return (
    <div>
      <PageTitle title={proposito.title} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {proposito.items.map((item) => (
          <SectionCard key={item.label} eyebrow={item.label}>
            <p>{item.text}</p>
          </SectionCard>
        ))}
      </div>

      <div className="mt-4 rounded-3xl bg-brasa p-7">
        <p className="text-lg font-medium text-bruma-light">
          {proposito.sintese}
        </p>
      </div>
    </div>
  );
}
