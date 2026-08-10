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
  const { title, body: text, imageUrl, order } = body;

  const guideline = await prisma.guideLine.update({
    where: { id },
    data: {
      title,
      body: sanitizeHtml(text),
      imageUrl: imageUrl || null,
      order,
    },
  });
  return NextResponse.json({ guideline });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const { id } = await params;
  await prisma.guideLine.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
