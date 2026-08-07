import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { publico } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { SectionCard } from "@/components/section-card";

const ALLOWED_ROLES = ["STUDIO", "CLIENT_ADMIN"];

export default async function PublicoPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    redirect("/");
  }

  return (
    <div>
      <PageTitle title={publico.title} />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {publico.prioritario.map((p) => (
          <SectionCard key={p.name} title={p.name}>
            <p>{p.text}</p>
          </SectionCard>
        ))}
      </div>

      <SectionCard eyebrow={publico.naoAceita.title}>
        <ul className="list-disc space-y-1 pl-4">
          {publico.naoAceita.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
