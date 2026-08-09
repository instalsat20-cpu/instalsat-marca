import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

async function requireStudio() {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDIO") return null;
  return user;
}

export async function GET() {
  const colors = await prisma.color.findMany({
    orderBy: { order: "asc" },
    include: { category: true },
  });
  return NextResponse.json({ colors });
}

export async function POST(req: Request) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const body = await req.json();
  const { name, hex, rgb, cmyk, pantone, order, categoryId } = body;
  if (!name || !hex || !rgb || !cmyk) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const color = await prisma.color.create({
    data: {
      name,
      hex,
      rgb,
      cmyk,
      pantone: pantone || null,
      order: order ?? 0,
      categoryId: categoryId || null,
    },
  });
  return NextResponse.json({ color });
}
