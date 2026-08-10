"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, LayoutGrid } from "lucide-react";
import { NAV } from "@/lib/content";
import { NAV_ICONS } from "@/components/nav-icons";
import { hasPermission, canAccessAdmin } from "@/lib/permissions";
import { NavHover } from "@/components/motion/nav-hover";

export function Sidebar({
  role,
  permissions,
  logoUrlDark,
  brandName,
  version,
}: {
  role: string;
  permissions: string[];
  logoUrlDark: string | null;
  brandName: string;
  version: string;
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
          <Image src="/simbolo.svg" alt={brandName} width={32} height={32} priority />
        ) : (
          <div>
            {logoUrlDark ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrlDark} alt={brandName} className="h-auto max-h-[60px] w-auto max-w-[150px]" />
            ) : (
              <p className="text-xl font-medium text-bruma-light">{brandName}</p>
            )}
            <div className="mt-2 flex items-center gap-2 text-xs font-light text-bruma-light/45">
              <span>
                Biblioteca de marca<span className="text-brasa">.</span>
              </span>
              <span className="rounded-full border border-bruma-light/10 px-2 py-0.5 text-[10px] font-medium text-bruma-light/55">
                {version}
              </span>
            </div>
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
          <NavHover>
            <Link
              href="/admin"
              title={collapsed ? "Painel" : undefined}
              className={`flex items-center gap-3 rounded-xl border border-bruma-light/10 px-3 py-2.5 text-sm font-medium text-bruma-light transition-colors hover:bg-bruma-light/5 ${
                collapsed ? "justify-center px-0" : ""
              }`}
            >
              <LayoutGrid size={20} strokeWidth={1.75} className="shrink-0" />
              {!collapsed && "Painel"}
            </Link>
          </NavHover>
        )}

        {NAV.map((group) => {
          if (!group.children) {
            const Icon = NAV_ICONS[group.href!];
            const active = pathname === group.href;
            return (
              <NavHover key={group.label}>
                <Link
                  href={group.href!}
                  title={collapsed ? group.label : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
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
              </NavHover>
            );
          }

          const GroupIcon = NAV_ICONS[group.label];
          const groupActive = group.children.some((c) => c.href === pathname);

          return (
            <div key={group.label}>
              <NavHover>
                <Link
                  href={group.children[0].href}
                  title={collapsed ? group.label : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium tracking-wide transition-colors ${
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
              </NavHover>
              {!collapsed && (
                <div className="mt-1 space-y-0.5">
                  {group.children.map((child) => {
                    const active = pathname === child.href;
                    const locked = child.permission && !hasPermission(user, child.permission);
                    return (
                      <NavHover key={child.href}>
                        <Link
                          href={child.href}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                            active
                              ? "bg-black/15 text-brasa"
                              : locked
                                ? "text-bruma-light/30"
                                : "text-bruma-light/65 hover:bg-bruma-light/5 hover:text-bruma-light"
                          }`}
                        >
                          {child.label}
                        </Link>
                      </NavHover>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

    </aside>
  );
}
