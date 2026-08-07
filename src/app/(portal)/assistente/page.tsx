"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { assistente } from "@/lib/content";
import { PageTitle } from "@/components/page-title";

type Message = { role: "user" | "model"; content: string };

function AssistantChat() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialQuery = searchParams.get("q");
  const sentInitial = useRef(false);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível obter resposta.");
        return;
      }

      setMessages([...nextMessages, { role: "model", content: data.reply }]);
    } catch {
      setError("Não foi possível conectar ao assistente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery && !sentInitial.current) {
      sentInitial.current = true;
      send(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div>
      <PageTitle title={assistente.title} subtitle={assistente.intro} />

      <div className="flex h-[60vh] flex-col rounded-3xl border border-bruma-light/10 bg-bruma-light/[0.04]">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="space-y-2">
              <p className="mb-3 text-xs font-medium tracking-wide text-bruma-light/40">
                Exemplos
              </p>
              {assistente.exemplos.map((ex) => (
                <button
                  key={ex}
                  onClick={() => send(ex)}
                  className="block w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-4 py-3 text-left text-sm font-light text-bruma-light/75 transition hover:border-brasa/30 hover:bg-bruma-light/10"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-brasa font-normal text-bruma-light"
                      : "border border-bruma-light/10 bg-bruma-light/5 font-light text-bruma-light/85"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-bruma-light/10 bg-bruma-light/5 px-4 py-2.5 text-sm font-light text-bruma-light/50">
                  Digitando...
                </div>
              </div>
            )}
            {error && (
              <p className="text-sm font-medium text-brasa">{error}</p>
            )}
          </div>
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-bruma-light/10 p-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre a marca"
            className="flex-1 rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-4 py-2.5 text-sm text-bruma-light outline-none transition placeholder:text-bruma-light/35 focus:border-bruma-light/25"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-brasa px-5 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AssistentePage() {
  return (
    <Suspense fallback={null}>
      <AssistantChat />
    </Suspense>
  );
}
