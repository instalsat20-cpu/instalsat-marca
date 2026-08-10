import { prisma } from "@/lib/prisma";

export async function getBrandAssistantContext() {
  const [contents, colors, typography, settings] = await Promise.all([
    prisma.content.findMany({ orderBy: { section: "asc" } }),
    prisma.color.findMany({ orderBy: { order: "asc" } }),
    prisma.typography.findMany({ orderBy: { order: "asc" } }),
    prisma.settings.findFirst({
      select: { brandName: true, geminiApiKey: true },
    }),
  ]);

  return {
    hasContent: contents.length > 0,
    apiKey: settings?.geminiApiKey?.trim() || process.env.GEMINI_API_KEY,
    systemInstruction: JSON.stringify({
      brandName: settings?.brandName ?? null,
      content: contents.map(({ section, title, body }) => ({ section, title, body })),
      colors: colors.map(({ name, hex, rgb, cmyk, pantone }) => ({
        name,
        hex,
        rgb,
        cmyk,
        pantone,
      })),
      typography: typography.map(({ name, description, weights, type }) => ({
        name,
        description,
        weights,
        type,
      })),
    }),
  };
}
