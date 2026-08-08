import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { LockedCard } from "@/components/locked-card";
import { ContentBody } from "@/components/content-body";

const SECTION = "verbal_tomdevoz";
const TITLE = "Tom de Voz";

export default async function TomDeVozPage() {
  const user = await getSessionUser();
  if (!hasPermission(user, SECTION)) return <LockedCard title={TITLE} />;

  const content = await prisma.content.findUnique({ where: { section: SECTION } });
  return <ContentBody title={content?.title ?? TITLE} body={content?.body ?? ""} />;
}
