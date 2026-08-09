import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { TypographyManager } from "@/components/admin/typography-manager";

export default async function AdminTipografiaPage() {
  const fonts = await prisma.typography.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageTitle title="Tipografia" />
      <TypographyManager fonts={fonts} />
    </div>
  );
}
