import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { ElementForm } from "@/components/admin/element-form";

export default async function EditarElementoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const element = await prisma.graphicElement.findUnique({ where: { id } });
  if (!element) notFound();

  return (
    <div>
      <PageTitle title={`Editar ${element.name}`} />
      <ElementForm existing={element} />
    </div>
  );
}
