import { manifesto } from "@/lib/content";
import { PageTitle } from "@/components/page-title";

export default function ManifestoPage() {
  return (
    <div>
      <PageTitle title={manifesto.title} />
      <div className="rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-8 sm:p-12">
        <div className="space-y-4">
          {manifesto.paragraphs.map((p, i) => (
            <p
              key={i}
              className={
                p === "Instalsat."
                  ? "text-xl font-medium text-brasa"
                  : "text-base font-light leading-relaxed text-bruma-light"
              }
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
