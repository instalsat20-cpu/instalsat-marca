import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { generateTempPassword } from "@/lib/generate-password";
import type { Role } from "@/generated/prisma/client";

const RESTRICTED_ROLES: Role[] = ["CLIENT_USER", "PARTNER"];

export async function GET() {
  const user = await getSessionUser();
  if (!user || !["STUDIO", "CLIENT_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: user.role === "CLIENT_ADMIN" ? { role: { in: RESTRICTED_ROLES } } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      permissions: true,
    },
  });

  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user || !["STUDIO", "CLIENT_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = await req.json();
  const { name, email, role, active, permissions } = body as {
    name?: string;
    email?: string;
    role?: string;
    active?: boolean;
    permissions?: string[];
  };

  if (!name || !email || !role) {
    return NextResponse.json({ error: "Nome, e-mail e role são obrigatórios." }, { status: 400 });
  }

  if (user.role === "CLIENT_ADMIN" && !RESTRICTED_ROLES.includes(role as Role)) {
    return NextResponse.json(
      { error: "Você só pode criar usuários com role CLIENT_USER ou PARTNER." },
      { status: 403 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) {
    return NextResponse.json({ error: "Já existe um usuário com este e-mail." }, { status: 409 });
  }

  const tempPassword = generateTempPassword();
  const hash = await bcrypt.hash(tempPassword, 10);

  const created = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase().trim(),
      password: hash,
      role: role as Role,
      active: active ?? true,
      permissions: Array.isArray(permissions) ? permissions : [],
    },
  });

  return NextResponse.json({ user: created, tempPassword });
}
