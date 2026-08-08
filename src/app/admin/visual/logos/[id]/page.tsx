import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { LogoForm } from "@/components/admin/logo-form";

export default async function EditarLogoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const logo = await prisma.logoFile.findUnique({ where: { id } });
  if (!logo) notFound();

  return (
    <div>
      <PageTitle title={`Editar ${logo.name}`} />
      <LogoForm existing={logo} />
    </div>
  );
}
