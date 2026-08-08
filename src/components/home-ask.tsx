"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";

export function HomeAsk({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/assistente?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-6 transition focus-within:border-bruma-light/25"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-base text-bruma-light outline-none placeholder:text-bruma-light/40"
      />
      <div className="mt-6 flex items-center justify-end">
        <button
          type="submit"
          disabled={!query.trim()}
          aria-label="Enviar"
          className="flex size-10 items-center justify-center rounded-full bg-brasa text-bruma-light transition hover:opacity-90 disabled:opacity-40"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </form>
  );
}
