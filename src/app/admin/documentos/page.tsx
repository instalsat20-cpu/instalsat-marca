import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { CategoryManager } from "@/components/admin/category-manager";
import { DocumentsManager } from "@/components/admin/documents-manager";

export default async function AdminDocumentosPage() {
  const [documents, categories] = await Promise.all([
    prisma.document.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ where: { type: "document" }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <PageTitle title="Documentos" />
      <CategoryManager type="document" categories={categories} />
      <DocumentsManager documents={documents} categories={categories} />
    </div>
  );
}
