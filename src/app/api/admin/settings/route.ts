import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDIO") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = await req.json();
  const { brandName, primaryColor, accentColor, bgLight, bgMedium, logoUrl, fontFamily } = body;

  const existing = await prisma.settings.findFirst();

  const settings = existing
    ? await prisma.settings.update({
        where: { id: existing.id },
        data: { brandName, primaryColor, accentColor, bgLight, bgMedium, logoUrl: logoUrl || null, fontFamily },
      })
    : await prisma.settings.create({
        data: { brandName, primaryColor, accentColor, bgLight, bgMedium, logoUrl: logoUrl || null, fontFamily },
      });

  return NextResponse.json({ settings });
}
