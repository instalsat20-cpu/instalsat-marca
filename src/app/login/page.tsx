"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function FloatingField({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-4 pt-2.5 pb-2 transition focus-within:border-brasa/60 focus-within:bg-bruma-light/[0.07]">
      <label className="block text-[11px] font-medium tracking-wide text-bruma-light/40">
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full bg-transparent text-sm font-medium text-bruma-light outline-none"
      />
    </div>
  );
}

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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <Image
            src="/logo-horizontal.svg"
            alt="Instalsat"
            width={181}
            height={60}
            className="h-auto w-[150px]"
            priority
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04] p-8"
        >
          <h1 className="mb-6 text-2xl font-medium text-bruma-light">
            Entrar na
            <br />
            Biblioteca de marca<span className="text-brasa">.</span>
          </h1>

          <div className="space-y-3">
            <FloatingField
              label="E-mail"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <FloatingField
              label="Senha"
              type="password"
              value={password}
              onChange={setPassword}
            />
          </div>

          {error && (
            <p className="mt-4 text-sm font-medium text-brasa">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-brasa py-3 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </motion.div>
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
