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
  const fonts = await prisma.typography.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ fonts });
}

export async function POST(req: Request) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const body = await req.json();
  const { name, type, googleFont, description, weights, downloadUrl, order } = body;
  if (!name || !type || !description) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const font = await prisma.typography.create({
    data: {
      name,
      type,
      googleFont: googleFont || null,
      description: sanitizeHtml(description),
      weights: weights || null,
      downloadUrl: downloadUrl || null,
      order: order ?? 0,
    },
  });
  return NextResponse.json({ font });
}
