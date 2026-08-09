import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

async function requireStudio() {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDIO") return null;
  return user;
}

export async function GET() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json({ documents });
}

export async function POST(req: Request) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const body = await req.json();
  const { name, categoryId, description, previewUrl, downloadUrl, permission } = body;
  if (!name || !downloadUrl) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const document = await prisma.document.create({
    data: {
      name,
      categoryId: categoryId || null,
      description: description || null,
      previewUrl: previewUrl || null,
      downloadUrl,
      permission: permission || "docs_basic",
    },
  });
  return NextResponse.json({ document });
}
