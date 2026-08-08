"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/content";
import type { Role } from "@/generated/prisma/client";

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-bruma-light/10 bg-petroleo px-5 py-8 md:flex">
      <div className="mb-10 px-2">
        <Image
          src="/logo-horizontal.svg"
          alt="Instalsat"
          width={181}
          height={60}
          className="h-10 w-auto"
          priority
        />
        <p className="mt-2 text-xs font-light text-bruma-light/45">
          Biblioteca de marca<span className="text-brasa">.</span>
        </p>
      </div>

      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto">
        {NAV.filter((group) => group.roles.includes(role)).map((group) => {
          if (!group.children) {
            const active = pathname === group.href;
            return (
              <Link
                key={group.label}
                href={group.href!}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-black/15 text-brasa"
                    : "text-bruma-light/65 hover:bg-bruma-light/5 hover:text-bruma-light"
                }`}
              >
                {group.label}
              </Link>
            );
          }

          const children = group.children.filter((c) =>
            c.roles.includes(role)
          );
          if (children.length === 0) return null;

          return (
            <div key={group.label}>
              <p className="mb-2 px-3 text-xs font-medium tracking-wide text-bruma-light/35">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {children.map((child) => {
                  const active = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-black/15 text-brasa"
                          : "text-bruma-light/65 hover:bg-bruma-light/5 hover:text-bruma-light"
                      }`}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {["STUDIO", "CLIENT_ADMIN", "CLIENT_USER"].includes(role) && (
        <div className="mt-6 shrink-0 rounded-3xl bg-brasa p-6">
          <p className="text-base font-medium leading-snug text-bruma-light">
            Converse com o assistente de marca
          </p>
          <Link
            href="/assistente"
            className="mt-4 inline-block rounded-xl bg-bruma-light px-4 py-2 text-xs font-medium text-petroleo transition hover:opacity-90"
          >
            Abrir assistente
          </Link>
        </div>
      )}
    </aside>
  );
}
