import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { GuidelinesManager } from "@/components/admin/guidelines-manager";

export default async function AdminDiretrizesPage() {
  const guidelines = await prisma.guideLine.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageTitle title="Diretrizes de Uso" />
      <GuidelinesManager guidelines={guidelines} />
    </div>
  );
}
