import { Lock } from "lucide-react";
import { PageTitle } from "@/components/page-title";

export function LockedCard({ title }: { title?: string }) {
  return (
    <div>
      {title && <PageTitle title={title} />}
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] px-8 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-bruma-light/10 text-bruma-light/50">
          <Lock size={22} strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-base font-medium text-bruma-light">
            Acesso restrito
          </p>
          <p className="mt-1 text-sm font-light text-bruma-light/50">
            Solicite acesso ao administrador.
          </p>
        </div>
      </div>
    </div>
  );
}
