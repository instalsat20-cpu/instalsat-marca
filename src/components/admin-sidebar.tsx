"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Shapes,
  Palette,
  Type,
  FileText,
  FileEdit,
  Settings,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { NavHover } from "@/components/motion/nav-hover";

type AdminNavItem = {
  label: string;
  href: string;
  icon: typeof Users;
};

export function AdminSidebar({
  role,
  userName,
  logoUrlDark,
  brandName,
}: {
  role: string;
  userName: string;
  logoUrlDark: string | null;
  brandName: string;
}) {
  const pathname = usePathname();

  const items: AdminNavItem[] = [
    { label: "Usuários", href: "/admin/usuarios", icon: Users },
  ];

  if (role === "STUDIO") {
    items.push(
      { label: "Logos", href: "/admin/visual/logos", icon: Shapes },
      { label: "Grafismos", href: "/admin/visual/grafismos", icon: Shapes },
      { label: "Cores", href: "/admin/visual/cores", icon: Palette },
      { label: "Tipografia", href: "/admin/visual/tipografia", icon: Type },
      { label: "Diretrizes de Uso", href: "/admin/visual/diretrizes", icon: BookOpen },
      { label: "Documentos", href: "/admin/documentos", icon: FileText },
      { label: "Conteúdo", href: "/admin/conteudo", icon: FileEdit },
      { label: "Configurações", href: "/admin/configuracoes", icon: Settings }
    );
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-bruma-light/10 bg-petroleo px-5 py-8 md:flex">
      <div className="mb-6 px-2">
        <a href="/" target="_blank" rel="noopener noreferrer">
          {logoUrlDark ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrlDark} alt={brandName} className="h-auto max-h-[60px] w-auto max-w-[150px]" />
          ) : (
            <p className="text-xl font-medium text-bruma-light">{brandName}</p>
          )}
        </a>
        <p className="mt-2 text-xs font-light text-bruma-light/45">Painel</p>
      </div>

      <NavHover>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-bruma-light/65 transition-colors hover:bg-bruma-light/5 hover:text-bruma-light"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          Biblioteca
        </a>
      </NavHover>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <NavHover key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-black/15 text-brasa"
                    : "text-bruma-light/65 hover:bg-bruma-light/5 hover:text-bruma-light"
                }`}
              >
                <Icon size={18} strokeWidth={1.75} />
                {item.label}
              </Link>
            </NavHover>
          );
        })}
      </nav>

      <div className="mt-6 shrink-0 space-y-3 border-t border-bruma-light/10 pt-5">
        <NavHover>
          <Link
            href="/admin/perfil"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/admin/perfil"
                ? "bg-black/15 text-brasa"
                : "text-bruma-light/65 hover:bg-bruma-light/5 hover:text-bruma-light"
            }`}
          >
            <div className="flex size-7 items-center justify-center rounded-full bg-brasa text-xs font-medium text-bruma-light">
              {userName.trim().charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{userName}</span>
          </Link>
        </NavHover>
      </div>
    </aside>
  );
}
