"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/content";
import type { Role } from "@/generated/prisma/client";

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-bruma bg-white px-5 py-6 md:flex">
      <div className="mb-8 px-1">
        <p className="text-xs font-medium tracking-wide text-petroleo/60">
          Instalsat
        </p>
        <p className="text-base font-semibold text-petroleo">
          Biblioteca de marca<span className="text-brasa">.</span>
        </p>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto">
        {NAV.filter((group) => group.roles.includes(role)).map((group) => {
          if (!group.children) {
            const active = pathname === group.href;
            return (
              <Link
                key={group.label}
                href={group.href!}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-petroleo text-bruma-light"
                    : "text-petroleo/80 hover:bg-bruma-light"
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
              <p className="mb-1.5 px-3 text-xs font-medium tracking-wide text-petroleo/45">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {children.map((child) => {
                  const active = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-petroleo text-bruma-light"
                          : "text-petroleo/80 hover:bg-bruma-light"
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
    </aside>
  );
}
