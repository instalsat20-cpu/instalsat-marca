"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-petroleo px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium tracking-wide text-bruma-light/50">
            Instalsat
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-bruma-light">
            Biblioteca de marca<span className="text-brasa">.</span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-8"
        >
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none transition placeholder:text-bruma-light/30 focus:border-bruma-light/25"
            placeholder="voce@instalsat.com.br"
          />

          <label className="mb-1 block text-sm font-medium text-bruma-light/70">
            Senha
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none transition placeholder:text-bruma-light/30 focus:border-bruma-light/25"
            placeholder="••••••••"
          />

          {error && (
            <p className="mb-4 text-sm font-medium text-brasa">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brasa py-3 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
