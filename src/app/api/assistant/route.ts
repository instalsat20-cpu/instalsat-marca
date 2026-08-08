import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSessionUser } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { buildBrandSystemPrompt } from "@/lib/brand-prompt";

type ChatMessage = { role: "user" | "model"; content: string };

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (!hasPermission(user, "assistente_ia")) {
    return NextResponse.json({ error: "Sem permissão para usar o assistente." }, { status: 403 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY não configurada no servidor." },
      { status: 500 }
    );
  }

  const body = (await req.json()) as {
    message?: string;
    history?: ChatMessage[];
  };

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
  }

  const history = (body.history ?? []).map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  try {
    const systemInstruction = await buildBrandSystemPrompt();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Gemini error", err);
    return NextResponse.json(
      { error: "Não foi possível obter resposta do assistente agora." },
      { status: 502 }
    );
  }
}
