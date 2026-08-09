import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { CategoryManager } from "@/components/admin/category-manager";
import { LogosManager } from "@/components/admin/logos-manager";

export default async function AdminLogosPage() {
  const [logos, categories] = await Promise.all([
    prisma.logoFile.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ where: { type: "logo" }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <PageTitle title="Logos" />
      <CategoryManager type="logo" categories={categories} />
      <LogosManager logos={logos} categories={categories} />
    </div>
  );
}
