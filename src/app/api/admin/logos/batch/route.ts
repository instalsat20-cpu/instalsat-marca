import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

type BatchFile = {
  name?: string;
  variation?: string;
  format?: string;
  colorMode?: string;
  colorProfile?: string;
  permission?: string;
  downloadUrl?: string;
  previewUrl?: string | null;
};

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDIO") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = (await req.json()) as { files?: BatchFile[] };
  if (!Array.isArray(body.files) || body.files.length === 0 || body.files.length > 100) {
    return NextResponse.json({ error: "Envie entre 1 e 100 arquivos." }, { status: 400 });
  }
  if (body.files.some((file) => !file.name?.trim() || !file.downloadUrl || !file.format)) {
    return NextResponse.json({ error: "Há arquivos com campos obrigatórios ausentes." }, { status: 400 });
  }

  const result = await prisma.logoFile.createMany({
    data: body.files.map((file) => ({
      name: file.name!.trim(),
      variation: file.variation || "Outro",
      colorMode: file.colorMode || "colorido",
      format: file.format!,
      colorProfile: file.colorProfile || "RGB",
      permission: file.permission || "logo_basic",
      downloadUrl: file.downloadUrl!,
      previewUrl: file.previewUrl || null,
    })),
  });

  return NextResponse.json({ count: result.count }, { status: 201 });
}
