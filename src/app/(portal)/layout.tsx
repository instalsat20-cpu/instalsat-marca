import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/page-transition";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const settings = await prisma.settings.findFirst();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        role={user.role}
        permissions={user.permissions}
        logoUrlDark={settings?.logoUrlDark ?? null}
        brandName={settings?.brandName ?? "Instalsat"}
        version={settings?.version ?? "V. 1.0"}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar
          userName={user.name ?? user.email ?? "Usuário"}
          role={user.role}
        />
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <div className="mx-auto max-w-4xl">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
