import { getSessionUser } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { LockedCard } from "@/components/locked-card";
import { AssistantChat } from "@/components/assistant-chat";

export default async function AssistentePage() {
  const user = await getSessionUser();
  if (!hasPermission(user, "assistente_ia")) {
    return <LockedCard title="Assistente de Marca" />;
  }

  return <AssistantChat />;
}
