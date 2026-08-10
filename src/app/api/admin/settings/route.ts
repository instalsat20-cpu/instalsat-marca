import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDIO") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = await req.json();
  const { brandName, primaryColor, accentColor, bgLight, bgMedium, logoUrlDark, logoUrlLight, fontFamily, version } = body;

  const existing = await prisma.settings.findFirst();
  const data = {
    brandName,
    primaryColor,
    accentColor,
    bgLight,
    bgMedium,
    logoUrlDark: logoUrlDark || null,
    logoUrlLight: logoUrlLight || null,
    fontFamily,
    version: version || "V. 1.0",
  };

  const settings = existing
    ? await prisma.settings.update({ where: { id: existing.id }, data })
    : await prisma.settings.create({ data });

  return NextResponse.json({ settings });
}
