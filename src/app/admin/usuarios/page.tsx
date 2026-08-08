import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { PageTitle } from "@/components/page-title";
import { DeleteButton } from "@/components/admin/delete-button";

const ROLE_LABEL: Record<string, string> = {
  STUDIO: "Studio",
  CLIENT_ADMIN: "Admin",
  CLIENT_USER: "Usuário",
  PARTNER: "Parceiro",
};

export default async function UsuariosPage() {
  const user = await getSessionUser();
  const restricted = user?.role === "CLIENT_ADMIN";

  const users = await prisma.user.findMany({
    where: restricted ? { role: { in: ["CLIENT_USER", "PARTNER"] } } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <PageTitle title="Usuários" />
        <Link
          href="/admin/usuarios/novo"
          className="flex items-center gap-2 rounded-xl bg-brasa px-4 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90"
        >
          <Plus size={16} />
          Novo usuário
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-bruma-light/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bruma-light/10 bg-bruma-light/[0.04] text-left text-xs font-medium tracking-wide text-bruma-light/45">
              <th className="px-5 py-3">Nome</th>
              <th className="px-5 py-3">E-mail</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Criado em</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-bruma-light/5 last:border-0">
                <td className="px-5 py-3 font-medium text-bruma-light">{u.name}</td>
                <td className="px-5 py-3 text-bruma-light/70">{u.email}</td>
                <td className="px-5 py-3 text-bruma-light/70">{ROLE_LABEL[u.role] ?? u.role}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      u.active
                        ? "bg-brasa/15 text-brasa"
                        : "bg-bruma-light/10 text-bruma-light/45"
                    }`}
                  >
                    {u.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-5 py-3 text-bruma-light/50">
                  {new Intl.DateTimeFormat("pt-BR").format(u.createdAt)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/usuarios/${u.id}`}
                      className="flex size-8 items-center justify-center rounded-lg text-bruma-light/50 transition hover:bg-bruma-light/10 hover:text-bruma-light"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteButton
                      url={`/api/admin/users/${u.id}`}
                      confirmLabel="Excluir usuário?"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="px-5 py-8 text-center text-sm font-light text-bruma-light/40">
            Nenhum usuário cadastrado.
          </p>
        )}
      </div>
    </div>
  );
}
