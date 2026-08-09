import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { canAccessAdmin } from "@/lib/permissions";
import { AdminSidebar } from "@/components/admin-sidebar";
import { PageTransition } from "@/components/page-transition";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) redirect("/login");
  if (!canAccessAdmin(user.role)) redirect("/");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar role={user.role} userName={user.name ?? user.email ?? "Usuário"} />
      <main className="flex-1 px-6 py-10 md:px-10">
        <div className="mx-auto max-w-5xl">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
