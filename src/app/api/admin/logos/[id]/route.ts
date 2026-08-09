import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

async function requireStudio() {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDIO") return null;
  return user;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { name, categoryId, colorMode, format, colorProfile, previewUrl, downloadUrl, permission } = body;

  const logo = await prisma.logoFile.update({
    where: { id },
    data: {
      name,
      categoryId: categoryId || null,
      colorMode,
      format,
      colorProfile,
      previewUrl: previewUrl || null,
      downloadUrl,
      permission,
    },
  });
  return NextResponse.json({ logo });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const { id } = await params;
  await prisma.logoFile.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
