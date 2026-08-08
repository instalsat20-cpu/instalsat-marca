import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { canAccessAdmin } from "@/lib/permissions";

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user || !canAccessAdmin(user.role)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = await req.json();
  const { name, email, image, currentPassword, newPassword } = body as {
    name?: string;
    email?: string;
    image?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  const data: Record<string, unknown> = {};
  if (name) data.name = name;
  if (email) data.email = email.toLowerCase().trim();
  if (typeof image === "string") data.image = image || null;

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Informe a senha atual." }, { status: 400 });
    }
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }
    const valid = await bcrypt.compare(currentPassword, dbUser.password);
    if (!valid) {
      return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
    }
    data.password = await bcrypt.hash(newPassword, 10);
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data });

  return NextResponse.json({
    user: { id: updated.id, name: updated.name, email: updated.email, image: updated.image },
  });
}
