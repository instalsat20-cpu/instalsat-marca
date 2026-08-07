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

  return (
    <header className="flex items-center gap-4 border-b border-bruma bg-white px-6 py-4">
      <form onSubmit={handleSearch} className="flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pergunte sobre a marca"
          className="w-full max-w-md rounded-lg border border-bruma bg-bruma-light px-4 py-2 text-sm text-petroleo outline-none placeholder:text-petroleo/40 focus:border-petroleo"
        />
      </form>

      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-petroleo">{userName}</p>
          <p className="text-xs text-petroleo/50">
            {ROLE_LABEL[role] ?? role}
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-lg border border-bruma px-3 py-1.5 text-xs font-medium text-petroleo/70 transition hover:bg-bruma-light"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
