import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { LogosManager } from "@/components/admin/logos-manager";

export default async function AdminLogosPage() {
  const logos = await prisma.logoFile.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageTitle title="Logos" />
      <LogosManager logos={logos} />
    </div>
  );
}
