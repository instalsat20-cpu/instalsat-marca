import Link from "next/link";
import { home } from "@/lib/content";
import { PageTitle } from "@/components/page-title";
import { HomeAsk } from "@/components/home-ask";
import { NAV_ICONS } from "@/components/nav-icons";

export default function IntroducaoPage() {
  return (
    <div>
      <PageTitle title={home.title} subtitle={home.subtitle} />

      <HomeAsk placeholder={home.searchPlaceholder} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {home.cards.map((card) => {
          const Icon = NAV_ICONS[card.href] ?? NAV_ICONS[card.title];
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group flex items-center gap-4 rounded-2xl border border-bruma-light/10 bg-bruma-light/[0.04] p-4 transition hover:border-brasa/40 hover:bg-bruma-light/[0.06]"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brasa/15 text-brasa">
                {Icon && <Icon size={20} strokeWidth={1.75} />}
              </div>
              <h2 className="text-sm font-medium text-bruma-light">
                {card.title}
              </h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
