import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { ColorForm } from "@/components/admin/color-form";

export default async function EditarCorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const color = await prisma.color.findUnique({ where: { id } });
  if (!color) notFound();

  return (
    <div>
      <PageTitle title={`Editar ${color.name}`} />
      <ColorForm existing={color} />
    </div>
  );
}
