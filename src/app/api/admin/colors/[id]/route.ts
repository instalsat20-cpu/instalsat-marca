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
  const { name, hex, rgb, cmyk, pantone, order, categoryId } = body;

  const color = await prisma.color.update({
    where: { id },
    data: {
      name,
      hex,
      rgb,
      cmyk,
      pantone: pantone || null,
      order,
      categoryId: categoryId || null,
    },
  });
  return NextResponse.json({ color });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const { id } = await params;
  await prisma.color.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
