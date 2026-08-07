import { downloads } from "@/lib/content";
import { PageTitle } from "@/components/page-title";

export default function DownloadsPage() {
  return (
    <div>
      <PageTitle
        title={downloads.title}
        subtitle="Arquivos oficiais da identidade visual da Instalsat."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {downloads.categorias.map((cat) => (
          <div
            key={cat.name}
            className="flex items-center justify-between rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-6"
          >
            <div>
              <h2 className="text-base font-medium text-bruma-light">
                {cat.name}
              </h2>
              <p className="mt-1 text-sm font-light text-bruma-light/50">
                {cat.formatos}
              </p>
            </div>

            {cat.href ? (
              <a
                href={cat.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-brasa px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90"
              >
                Baixar
              </a>
            ) : (
              <span className="rounded-xl border border-bruma-light/10 px-4 py-2.5 text-sm font-medium text-bruma-light/35">
                Em breve
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
