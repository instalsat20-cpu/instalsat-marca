import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { CategoryManager } from "@/components/admin/category-manager";
import { ColorsManager } from "@/components/admin/colors-manager";

export default async function AdminCoresPage() {
  const [colors, categories] = await Promise.all([
    prisma.color.findMany({
      orderBy: { order: "asc" },
      include: { category: true },
    }),
    prisma.category.findMany({ where: { type: "color" }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <PageTitle title="Cores" />
      <CategoryManager type="color" categories={categories} />
      <ColorsManager colors={colors} categories={categories} />
    </div>
  );
}
