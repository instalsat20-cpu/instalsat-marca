import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { CategoryManager } from "@/components/admin/category-manager";
import { ElementsManager } from "@/components/admin/elements-manager";

export default async function AdminGrafismosPage() {
  const [elements, categories] = await Promise.all([
    prisma.graphicElement.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ where: { type: "graphic" }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <PageTitle title="Grafismos" />
      <CategoryManager type="graphic" categories={categories} />
      <ElementsManager elements={elements} categories={categories} />
    </div>
  );
}
