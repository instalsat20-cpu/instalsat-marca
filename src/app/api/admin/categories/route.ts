import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

async function requireStudio() {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDIO") return null;
  return user;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const categories = await prisma.category.findMany({
    where: type ? { type } : undefined,
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const user = await requireStudio();
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 403 });

  const body = await req.json();
  const { name, type, order } = body;
  if (!name || !type) {
    return NextResponse.json({ error: "Nome e tipo são obrigatórios." }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({
    where: { type_name: { type, name } },
  });
  if (existing) {
    return NextResponse.json({ error: "Já existe uma categoria com este nome." }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: { name, type, order: order ?? 0 },
  });
  return NextResponse.json({ category });
}
