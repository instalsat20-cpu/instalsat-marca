import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

async function requireStudio() {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDIO") return null;
  return user;
}

export async function GET() {
  const logos = await prisma.logoFile.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ logos });
}

export async function POST(req: Request) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const body = await req.json();
  const { name, variation, colorMode, format, colorProfile, previewUrl, downloadUrl, permission } = body;
  if (!name || !variation || !colorMode || !format || !colorProfile || !downloadUrl) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const logo = await prisma.logoFile.create({
    data: {
      name,
      variation,
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
