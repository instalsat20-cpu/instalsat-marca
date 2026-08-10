import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

function publicSettings<T extends { geminiApiKey?: string | null; googleFontsApiKey?: string | null }>(settings: T) {
  const { geminiApiKey, googleFontsApiKey, ...safeSettings } = settings;
  return {
    ...safeSettings,
    integrations: {
      gemini: {
        configured: Boolean(geminiApiKey?.trim()),
        prefix: geminiApiKey?.trim().slice(0, 8) || null,
      },
      googleFonts: {
        configured: Boolean(googleFontsApiKey?.trim()),
        prefix: googleFontsApiKey?.trim().slice(0, 8) || null,
      },
    },
  };
}

async function authorize() {
  const user = await getSessionUser();
  return Boolean(user && user.role === "STUDIO");
}

export async function PUT(req: Request) {
  if (!(await authorize())) {
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

  return NextResponse.json({ settings: publicSettings(settings) });
}

export async function PATCH(req: Request) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = (await req.json()) as {
    field?: "geminiApiKey" | "googleFontsApiKey";
    value?: string;
  };
  if (body.field !== "geminiApiKey" && body.field !== "googleFontsApiKey") {
    return NextResponse.json({ error: "Integração inválida." }, { status: 400 });
  }

  const existing = await prisma.settings.findFirst();
  const value = body.value?.trim() || null;
  const settings = existing
    ? await prisma.settings.update({
        where: { id: existing.id },
        data: { [body.field]: value },
      })
    : await prisma.settings.create({ data: { [body.field]: value } });

  return NextResponse.json({ settings: publicSettings(settings) });
}
