"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, LayoutGrid } from "lucide-react";
import { NAV } from "@/lib/content";
import { NAV_ICONS } from "@/components/nav-icons";
import { hasPermission, canAccessAdmin } from "@/lib/permissions";

export function Sidebar({
  role,
  permissions,
}: {
  role: string;
  permissions: string[];
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const user = { role, permissions };

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-bruma-light/10 bg-petroleo py-8 transition-[width] duration-200 md:flex ${
        collapsed ? "w-20 px-3" : "w-64 px-5"
      }`}
    >
      <div
        className={`mb-10 flex items-center ${collapsed ? "flex-col gap-4 px-0" : "justify-between px-2"}`}
      >
        {collapsed ? (
          <Image src="/simbolo.svg" alt="Instalsat" width={32} height={32} priority />
        ) : (
          <div>
            <Image
              src="/logo-horizontal.svg"
              alt="Instalsat"
              width={181}
              height={60}
              className="h-auto w-[150px]"
              priority
            />
            <p className="mt-2 text-xs font-light text-bruma-light/45">
              Biblioteca de marca<span className="text-brasa">.</span>
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-bruma-light/10 text-bruma-light/60 transition hover:bg-bruma-light/5 hover:text-bruma-light"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto">
        {canAccessAdmin(role) && (
          <Link
            href="/admin"
            title={collapsed ? "Painel" : undefined}
            className={`flex items-center gap-3 rounded-xl border border-bruma-light/10 px-3 py-2.5 text-sm font-medium text-bruma-light transition hover:bg-bruma-light/5 ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <LayoutGrid size={20} strokeWidth={1.75} className="shrink-0" />
            {!collapsed && "Painel"}
          </Link>
        )}

        {NAV.map((group) => {
          if (!group.children) {
            const Icon = NAV_ICONS[group.href!];
            const active = pathname === group.href;
            return (
              <Link
                key={group.label}
                href={group.href!}
                title={collapsed ? group.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  collapsed ? "justify-center px-0" : ""
                } ${
                  active
                    ? "bg-black/15 text-brasa"
                    : "text-bruma-light/65 hover:bg-bruma-light/5 hover:text-bruma-light"
                }`}
              >
                {Icon && <Icon size={20} strokeWidth={1.75} className="shrink-0" />}
                {!collapsed && group.label}
              </Link>
            );
          }

          const GroupIcon = NAV_ICONS[group.label];
          const groupActive = group.children.some((c) => c.href === pathname);

          return (
            <div key={group.label}>
              <Link
                href={group.children[0].href}
                title={collapsed ? group.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium tracking-wide transition ${
                  collapsed ? "justify-center px-0" : ""
                } ${
                  collapsed && groupActive
                    ? "text-brasa"
                    : "text-bruma-light/35 hover:text-bruma-light/60"
                }`}
              >
                {GroupIcon && (
                  <GroupIcon size={18} strokeWidth={1.75} className="shrink-0" />
                )}
                {!collapsed && group.label}
              </Link>
              {!collapsed && (
                <div className="mt-1 space-y-0.5">
                  {group.children.map((child) => {
                    const active = pathname === child.href;
                    const locked = child.permission && !hasPermission(user, child.permission);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          active
                            ? "bg-black/15 text-brasa"
                            : locked
                              ? "text-bruma-light/30"
                              : "text-bruma-light/65 hover:bg-bruma-light/5 hover:text-bruma-light"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {!collapsed && hasPermission(user, "assistente_ia") && (
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
