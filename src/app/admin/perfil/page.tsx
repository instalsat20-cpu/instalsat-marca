import { getSessionUser } from "@/lib/session";
import { PageTitle } from "@/components/page-title";
import { ProfileForm } from "@/components/admin/profile-form";

export default async function AdminPerfilPage() {
  const user = await getSessionUser();

  return (
    <div>
      <PageTitle title="Perfil" />
      <ProfileForm
        name={user?.name ?? ""}
        email={user?.email ?? ""}
        image={user?.image ?? null}
      />
    </div>
  );
}
