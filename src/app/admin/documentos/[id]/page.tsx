import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { DocumentForm } from "@/components/admin/document-form";

export default async function EditarDocumentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) notFound();

  return (
    <div>
      <PageTitle title={`Editar ${document.name}`} />
      <DocumentForm existing={document} />
    </div>
  );
}
