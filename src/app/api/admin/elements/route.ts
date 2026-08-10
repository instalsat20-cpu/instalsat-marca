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
  const elements = await prisma.graphicElement.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json({ elements });
}

export async function POST(req: Request) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const body = await req.json();
  const { name, categoryId, description, format, colorProfile, previewUrl, downloadUrl, permission } = body;
  if (!name || !description || !format || !colorProfile || !downloadUrl) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const element = await prisma.graphicElement.create({
    data: {
      name,
      categoryId: categoryId || null,
      description: sanitizeHtml(description),
      format,
      colorProfile,
      previewUrl: previewUrl || null,
      downloadUrl,
      permission: permission || "elements_basic",
    },
  });
  return NextResponse.json({ element });
}
