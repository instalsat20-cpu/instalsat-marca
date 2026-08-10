import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { Providers } from "@/components/providers";
import { prisma } from "@/lib/prisma";
import { googleFontsStylesheetHref } from "@/lib/font-weights";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Biblioteca de Marca Instalsat",
  description: "Sistema de marca da Instalsat.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await prisma.settings.findFirst().catch(() => null);
  const customFont =
    settings?.fontFamily && settings.fontFamily !== "Rubik" ? settings.fontFamily : null;

  return (
    <html
      lang="pt-BR"
      className={`${rubik.variable} h-full antialiased`}
      style={
        customFont
          ? ({ "--font-sans": `'${customFont}', var(--font-rubik), sans-serif` } as React.CSSProperties)
          : undefined
      }
    >
      <body className="min-h-full bg-petroleo text-bruma-light">
        {customFont && <link rel="stylesheet" href={googleFontsStylesheetHref(customFont)} />}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
