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
            className="group rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-base font-medium text-petroleo">
              {card.title}
            </h2>
            <p className="mt-2 text-sm font-light leading-relaxed text-petroleo/70">
              {card.description}
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-brasa transition group-hover:translate-x-0.5">
              Ver seção →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
