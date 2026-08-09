import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { DocumentsManager } from "@/components/admin/documents-manager";

export default async function AdminDocumentosPage() {
  const documents = await prisma.document.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageTitle title="Documentos" />
      <DocumentsManager documents={documents} />
    </div>
  );
}
