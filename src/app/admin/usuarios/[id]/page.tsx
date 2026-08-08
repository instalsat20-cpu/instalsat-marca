import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { PageTitle } from "@/components/page-title";
import { UserForm } from "@/components/admin/user-form";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();
  const target = await prisma.user.findUnique({ where: { id } });

  if (!target) notFound();
  if (
    user!.role === "CLIENT_ADMIN" &&
    !["CLIENT_USER", "PARTNER"].includes(target.role)
  ) {
    notFound();
  }

  return (
    <div>
      <PageTitle title={`Editar ${target.name}`} />
      <UserForm
        currentUserRole={user!.role}
        existing={{
          id: target.id,
          name: target.name,
          email: target.email,
          role: target.role,
          active: target.active,
          permissions: target.permissions,
        }}
      />
    </div>
  );
}
