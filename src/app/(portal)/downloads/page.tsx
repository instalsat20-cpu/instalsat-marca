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
            className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm"
          >
            <div>
              <h2 className="text-base font-medium text-petroleo">
                {cat.name}
              </h2>
              <p className="mt-1 text-sm font-light text-petroleo/60">
                {cat.formatos}
              </p>
            </div>

            {cat.href ? (
              <a
                href={cat.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-petroleo px-4 py-2 text-sm font-medium text-bruma-light transition hover:opacity-90"
              >
                Baixar
              </a>
            ) : (
              <span className="rounded-lg bg-bruma px-4 py-2 text-sm font-medium text-petroleo/40">
                Em breve
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
