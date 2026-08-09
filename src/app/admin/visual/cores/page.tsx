import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { ColorsManager } from "@/components/admin/colors-manager";

export default async function AdminCoresPage() {
  const colors = await prisma.color.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageTitle title="Cores" />
      <ColorsManager colors={colors} />
    </div>
  );
}
