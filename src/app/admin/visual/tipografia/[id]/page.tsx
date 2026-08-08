import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { TypographyForm } from "@/components/admin/typography-form";

export default async function EditarTipografiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const font = await prisma.typography.findUnique({ where: { id } });
  if (!font) notFound();

  return (
    <div>
      <PageTitle title={`Editar ${font.name}`} />
      <TypographyForm existing={font} />
    </div>
  );
}
