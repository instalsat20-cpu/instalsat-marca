import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { PageTitle } from "@/components/page-title";

export default async function AdminDashboardPage() {
  const user = await getSessionUser();

  const cards = [
    { title: "Usuários", href: "/admin/usuarios", roles: ["STUDIO", "CLIENT_ADMIN"] },
    { title: "Logos", href: "/admin/visual/logos", roles: ["STUDIO"] },
    { title: "Grafismos", href: "/admin/visual/grafismos", roles: ["STUDIO"] },
    { title: "Cores", href: "/admin/visual/cores", roles: ["STUDIO"] },
    { title: "Tipografia", href: "/admin/visual/tipografia", roles: ["STUDIO"] },
    { title: "Documentos", href: "/admin/documentos", roles: ["STUDIO"] },
    { title: "Conteúdo", href: "/admin/conteudo", roles: ["STUDIO"] },
    { title: "Configurações", href: "/admin/configuracoes", roles: ["STUDIO"] },
  ].filter((c) => c.roles.includes(user?.role ?? ""));

  return (
    <div>
      <PageTitle title="Painel" subtitle="Gerencie usuários e conteúdo da biblioteca de marca." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-6 transition hover:border-brasa/40"
          >
            <h2 className="text-base font-medium text-bruma-light">
              {card.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
