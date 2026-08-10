import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { sanitizeHtml } from "@/lib/sanitize";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDIO") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { section } = await params;
  const body = await req.json();
  const { title, content: text } = body as { title?: string; content?: string };

  if (!title) {
    return NextResponse.json({ error: "Título é obrigatório." }, { status: 400 });
  }

  const sanitized = sanitizeHtml(text ?? "");

  const content = await prisma.content.upsert({
    where: { section },
    update: { title, body: sanitized },
    create: { section, title, body: sanitized },
  });

  return NextResponse.json({ content });
}
