import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type GoogleFontsResponse = {
  items: { family: string; variants: string[]; category: string }[];
};

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDIO") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const settings = await prisma.settings.findFirst({
    select: { googleFontsApiKey: true },
  });
  const apiKey = settings?.googleFontsApiKey?.trim() || process.env.GOOGLE_FONTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Busca de fontes indisponível: configure a variável GOOGLE_FONTS_API_KEY no servidor para habilitar este recurso.",
      },
      { status: 503 }
    );
  }

  const res = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`,
    { next: { revalidate: 60 * 60 * 24 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Falha ao consultar Google Fonts." }, { status: 502 });
  }

  const data: GoogleFontsResponse = await res.json();
  const fonts = data.items.map((f) => ({ family: f.family, category: f.category }));

  return NextResponse.json({ fonts });
}
