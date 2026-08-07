import Link from "next/link";
import { home } from "@/lib/content";
import { PageTitle } from "@/components/page-title";

export default function IntroducaoPage() {
  return (
    <div>
      <PageTitle title={home.title} subtitle={home.subtitle} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {home.cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-6 transition hover:border-brasa/40 hover:bg-bruma-light/[0.06]"
          >
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-bruma-light/10 text-base font-medium text-bruma-light">
              {card.title.charAt(0)}
            </div>
            <h2 className="text-lg font-medium text-bruma-light">
              {card.title}
            </h2>
            <p className="mt-2 text-sm font-light leading-relaxed text-bruma-light/55">
              {card.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brasa transition group-hover:translate-x-0.5">
              Ver seção →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
