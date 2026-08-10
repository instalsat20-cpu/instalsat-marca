import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { sanitizeHtml } from "@/lib/sanitize";

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
  const { name, type, googleFont, description, weights, downloadUrl, order } = body;

  const font = await prisma.typography.update({
    where: { id },
    data: {
      name,
      type,
      googleFont: googleFont || null,
      description: sanitizeHtml(description),
      weights: weights || null,
      downloadUrl: downloadUrl || null,
      order,
    },
  });
  return NextResponse.json({ font });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const { id } = await params;
  await prisma.typography.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
