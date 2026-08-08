import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { authOptions } from "@/lib/auth";
import { r2, R2_BUCKET_NAME, publicUrlFor } from "@/lib/r2";

const ALLOWED_ROLES = ["STUDIO", "CLIENT_ADMIN"];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "";
  const key = `uploads/${randomUUID()}${extension ? `.${extension}` : ""}`;

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    );

    return NextResponse.json({ url: publicUrlFor(key) });
  } catch (err) {
    console.error("R2 upload error", err);
    return NextResponse.json(
      { error: "Falha ao enviar o arquivo." },
      { status: 502 }
    );
  }
}
