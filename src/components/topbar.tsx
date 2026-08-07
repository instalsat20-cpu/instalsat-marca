"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

const ROLE_LABEL: Record<string, string> = {
  STUDIO: "Studio",
  CLIENT_ADMIN: "Administrador",
  CLIENT_USER: "Usuário",
  PARTNER: "Parceiro",
};

export function Topbar({
  userName,
  role,
}: {
  userName: string;
  role: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/assistente?q=${encodeURIComponent(query.trim())}`);
    }
  }

  const initial = (userName || "U").trim().charAt(0).toUpperCase();

  return (
    <header className="flex items-center gap-4 border-b border-bruma-light/10 bg-petroleo px-6 py-6 md:px-10">
      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pergunte sobre a marca"
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-4 py-2.5 text-sm text-bruma-light outline-none transition placeholder:text-bruma-light/35 focus:border-bruma-light/25"
          />
        </div>
      </form>

      <div className="flex items-center gap-4">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-bruma-light">{userName}</p>
          <p className="text-xs font-light text-bruma-light/45">
            {ROLE_LABEL[role] ?? role}
          </p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-full bg-brasa text-sm font-medium text-bruma-light">
          {initial}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-xl border border-bruma-light/10 px-3 py-2 text-xs font-medium text-bruma-light/60 transition hover:bg-bruma-light/5 hover:text-bruma-light"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
