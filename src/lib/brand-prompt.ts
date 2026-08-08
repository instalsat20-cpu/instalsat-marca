import { prisma } from "@/lib/prisma";
import { EDITABLE_SECTIONS } from "@/lib/content-sections";

export async function buildBrandSystemPrompt(): Promise<string> {
  const [contents, colors] = await Promise.all([
    prisma.content.findMany({
      where: { section: { in: EDITABLE_SECTIONS.map((s) => s.key) } },
    }),
    prisma.color.findMany({ orderBy: { order: "asc" } }),
  ]);

  const bySection = new Map(contents.map((c) => [c.section, c]));

  const sectionsText = EDITABLE_SECTIONS.map((s) => {
    const record = bySection.get(s.key);
    if (!record || !record.body.trim()) return null;
    return `${record.title.toUpperCase()}\n${record.body}`;
  })
    .filter(Boolean)
    .join("\n\n");

  const colorsText = colors
    .map((c) => `${c.name} (${c.hex}): ${c.pantone ? `Pantone ${c.pantone}, ` : ""}RGB ${c.rgb}, CMYK ${c.cmyk}`)
    .join(" | ");

  return `Você é o Assistente de Marca da Instalsat. Responda sempre em português do Brasil, seguindo rigorosamente o sistema de marca abaixo. Nunca use caixa alta em títulos ou frases inteiras. Nunca use travessão (o caractere —) em nenhuma resposta, use vírgula ou ponto no lugar. Seja direto, técnico sem ser inacessível, próximo sem ser informal, firme sem ser arrogante. Nunca use "prezado", "atenciosamente" ou linguagem de ofício.

${sectionsText}

PALETA DE CORES OFICIAL
${colorsText}

Ao responder, aplique este sistema de marca como referência de conteúdo e de tom. Quando pedirem textos de comunicação (headlines, posts, respostas a clientes), escreva já no tom de voz da Instalsat.`;
}
