import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { UsersManager } from "@/components/admin/users-manager";

export default async function UsuariosPage() {
  const user = await getSessionUser();
  const restricted = user?.role === "CLIENT_ADMIN";

  const users = await prisma.user.findMany({
    where: restricted ? { role: { in: ["CLIENT_USER", "PARTNER"] } } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return <UsersManager users={users} currentUserRole={user!.role} />;
}
