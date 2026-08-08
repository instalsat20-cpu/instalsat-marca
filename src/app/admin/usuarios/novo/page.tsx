import { getSessionUser } from "@/lib/session";
import { PageTitle } from "@/components/page-title";
import { UserForm } from "@/components/admin/user-form";

export default async function NovoUsuarioPage() {
  const user = await getSessionUser();

  return (
    <div>
      <PageTitle title="Novo usuário" />
      <UserForm currentUserRole={user!.role} />
    </div>
  );
}
