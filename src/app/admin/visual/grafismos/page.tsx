import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { ElementsManager } from "@/components/admin/elements-manager";

export default async function AdminGrafismosPage() {
  const elements = await prisma.graphicElement.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageTitle title="Grafismos" />
      <ElementsManager elements={elements} />
    </div>
  );
}
