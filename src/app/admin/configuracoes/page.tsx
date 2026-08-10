import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/page-title";
import { SettingsForm } from "@/components/admin/settings-form";
import { IntegrationsForm } from "@/components/admin/integrations-form";

export default async function AdminConfiguracoesPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div>
      <PageTitle
        title="Configurações"
        subtitle="As variáveis visuais da plataforma são derivadas destes valores."
      />
      <SettingsForm
        existing={
          settings ?? {
            brandName: "Instalsat",
            primaryColor: "#003841",
            accentColor: "#E05829",
            bgLight: "#EEF5FF",
            bgMedium: "#DCE3EC",
            logoUrlDark: null,
            logoUrlLight: null,
            fontFamily: "Rubik",
            version: "V. 1.0",
          }
        }
      />
      <IntegrationsForm
        gemini={{
          configured: Boolean(settings?.geminiApiKey?.trim()),
          prefix: settings?.geminiApiKey?.trim().slice(0, 8) || null,
        }}
        googleFonts={{
          configured: Boolean(settings?.googleFontsApiKey?.trim()),
          prefix: settings?.googleFontsApiKey?.trim().slice(0, 8) || null,
        }}
      />
    </div>
  );
}
