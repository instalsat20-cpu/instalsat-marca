import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { sanitizeHtml } from "@/lib/sanitize";

async function requireStudio() {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDIO") return null;
  return user;
}

export async function GET() {
  const guidelines = await prisma.guideLine.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ guidelines });
}

export async function POST(req: Request) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const body = await req.json();
  const { title, body: text, imageUrl, order } = body;
  if (!title || !text) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const guideline = await prisma.guideLine.create({
    data: {
      title,
      body: sanitizeHtml(text),
      imageUrl: imageUrl || null,
      order: order ?? 0,
    },
  });
  return NextResponse.json({ guideline });
}
