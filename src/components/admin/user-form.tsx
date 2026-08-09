"use client";

import { useState } from "react";
import { PERMISSION_GROUPS } from "@/lib/permissions";

type ExistingUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  permissions: unknown;
};

export function UserForm({
  currentUserRole,
  existing,
  onDone,
}: {
  currentUserRole: string;
  existing?: ExistingUser;
  onDone: () => void;
}) {
  const isEdit = !!existing;
  const restricted = currentUserRole === "CLIENT_ADMIN";

  const [name, setName] = useState(existing?.name ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [role, setRole] = useState(existing?.role ?? "CLIENT_USER");
  const [active, setActive] = useState(existing?.active ?? true);
  const [permissions, setPermissions] = useState<string[]>(
    Array.isArray(existing?.permissions) ? (existing.permissions as string[]) : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const availableRoles = restricted
    ? [
        { value: "CLIENT_USER", label: "Usuário" },
        { value: "PARTNER", label: "Parceiro" },
      ]
    : [
        { value: "STUDIO", label: "Studio" },
        { value: "CLIENT_ADMIN", label: "Admin" },
        { value: "CLIENT_USER", label: "Usuário" },
        { value: "PARTNER", label: "Parceiro" },
      ];

  const permissionsIrrelevant = role === "STUDIO" || role === "CLIENT_ADMIN";

  function togglePermission(key: string) {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { name, email, role, active, permissions };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/users/${existing!.id}` : "/api/admin/users",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar.");
        return;
      }

      if (data.tempPassword) {
        setTempPassword(data.tempPassword);
      } else {
        onDone();
      }
    } catch {
      setError("Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!isEdit) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${existing!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetPassword: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível gerar senha.");
        return;
      }
      setTempPassword(data.tempPassword);
    } finally {
      setLoading(false);
    }
  }

  if (tempPassword) {
    return (
      <div className="rounded-3xl border border-brasa/30 bg-brasa/10 p-7">
        <p className="mb-2 text-sm font-medium text-bruma-light">
          Senha temporária gerada. Copie e envie ao usuário, ela não será exibida novamente.
        </p>
        <div className="flex items-center gap-3 rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-4 py-3">
          <code className="text-lg font-medium text-brasa">{tempPassword}</code>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(tempPassword)}
            className="ml-auto rounded-lg border border-bruma-light/10 px-3 py-1.5 text-xs font-medium text-bruma-light/70"
          >
            Copiar
          </button>
        </div>
        <button
          type="button"
          onClick={onDone}
          className="mt-4 rounded-xl bg-petroleo px-4 py-2.5 text-sm font-medium text-bruma-light"
        >
          Concluir
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">
            Nome
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none focus:border-bruma-light/25"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none focus:border-bruma-light/25"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-bruma-light/70">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-3 py-2.5 text-sm text-bruma-light outline-none"
          >
            {availableRoles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm font-medium text-bruma-light/70">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="size-4 accent-brasa"
            />
            Usuário ativo
          </label>
        </div>
      </div>

      {permissionsIrrelevant ? (
        <p className="rounded-xl border border-bruma-light/10 bg-bruma-light/5 px-4 py-3 text-sm font-light text-bruma-light/50">
          Este role tem acesso total a todo o conteúdo automaticamente, não é necessário selecionar permissões.
        </p>
      ) : (
        <div>
          <p className="mb-3 text-sm font-medium text-bruma-light/70">
            Permissões
          </p>
          <div className="space-y-4">
            {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => (
              <div key={group}>
                <p className="mb-1.5 text-xs font-medium tracking-wide text-bruma-light/40">
                  {group}
                </p>
                <div className="flex flex-wrap gap-2">
                  {perms.map((p) => (
                    <label
                      key={p.key}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        permissions.includes(p.key)
                          ? "border-brasa/40 bg-brasa/15 text-brasa"
                          : "border-bruma-light/10 bg-bruma-light/5 text-bruma-light/60"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={permissions.includes(p.key)}
                        onChange={() => togglePermission(p.key)}
                        className="hidden"
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm font-medium text-brasa">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-brasa px-5 py-2.5 text-sm font-medium text-bruma-light transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar usuário"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={loading}
            className="rounded-xl border border-bruma-light/10 px-4 py-2.5 text-sm font-medium text-bruma-light/70"
          >
            Gerar nova senha temporária
          </button>
        )}
      </div>
    </form>
  );
}
