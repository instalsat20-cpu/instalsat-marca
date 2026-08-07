import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { Providers } from "@/components/providers";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full bg-bruma-light text-petroleo">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
