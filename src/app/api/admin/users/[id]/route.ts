import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { generateTempPassword } from "@/lib/generate-password";

const RESTRICTED_ROLES = ["CLIENT_USER", "PARTNER"];

async function assertCanManage(requesterRole: string, targetId: string) {
  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target) return { target: null, allowed: false };
  if (requesterRole === "STUDIO") return { target, allowed: true };
  if (requesterRole === "CLIENT_ADMIN") {
    return { target, allowed: RESTRICTED_ROLES.includes(target.role) };
  }
  return { target, allowed: false };
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || !["STUDIO", "CLIENT_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { id } = await params;
  const { target, allowed } = await assertCanManage(user.role, id);
  if (!target || !allowed) {
    return NextResponse.json({ error: "Usuário não encontrado ou sem permissão." }, { status: 404 });
  }

  const body = await req.json();
  const { name, email, role, active, permissions, resetPassword } = body as {
    name?: string;
    email?: string;
    role?: string;
    active?: boolean;
    permissions?: string[];
    resetPassword?: boolean;
  };

  if (user.role === "CLIENT_ADMIN" && role && !RESTRICTED_ROLES.includes(role)) {
    return NextResponse.json(
      { error: "Você só pode atribuir role CLIENT_USER ou PARTNER." },
      { status: 403 }
    );
  }

  let tempPassword: string | undefined;
  const data: Record<string, unknown> = {};
  if (name) data.name = name;
  if (email) data.email = email.toLowerCase().trim();
  if (role) data.role = role;
  if (typeof active === "boolean") data.active = active;
  if (Array.isArray(permissions)) data.permissions = permissions;
  if (resetPassword) {
    tempPassword = generateTempPassword();
    data.password = await bcrypt.hash(tempPassword, 10);
  }

  const updated = await prisma.user.update({ where: { id }, data });

  return NextResponse.json({ user: updated, tempPassword });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || !["STUDIO", "CLIENT_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { id } = await params;
  const { target, allowed } = await assertCanManage(user.role, id);
  if (!target || !allowed) {
    return NextResponse.json({ error: "Usuário não encontrado ou sem permissão." }, { status: 404 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
