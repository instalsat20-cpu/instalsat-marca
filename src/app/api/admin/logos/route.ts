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
  const logos = await prisma.logoFile.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json({ logos });
}

export async function POST(req: Request) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const body = await req.json();
  const { name, description, categoryId, colorMode, format, colorProfile, previewUrl, downloadUrl, permission } = body;
  if (!name || !colorMode || !format || !colorProfile || !downloadUrl) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const logo = await prisma.logoFile.create({
    data: {
      name,
      description: description ? sanitizeHtml(description) : null,
      categoryId: categoryId || null,
      colorMode,
      format,
      colorProfile,
      previewUrl: previewUrl || null,
      downloadUrl,
      permission: permission || "logo_basic",
    },
  });
  return NextResponse.json({ logo });
}
