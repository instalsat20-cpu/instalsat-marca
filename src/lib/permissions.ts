export const PERMISSION_GROUPS = {
  "Núcleo da Marca": [
    { key: "nucleo_posicionamento", label: "Posicionamento" },
    { key: "nucleo_proposito", label: "Propósito" },
    { key: "nucleo_arquetipos", label: "Arquétipos" },
    { key: "nucleo_valores", label: "Valores e Bandeiras" },
    { key: "nucleo_publico", label: "Público" },
  ],
  "Universo Verbal": [
    { key: "verbal_manifesto", label: "Manifesto" },
    { key: "verbal_tomdevoz", label: "Tom de Voz" },
    { key: "verbal_vocabulario", label: "Vocabulário" },
  ],
  "Universo Visual": [
    { key: "visual_simbolo", label: "Símbolo e Logotipo" },
    { key: "visual_cores", label: "Cores" },
    { key: "visual_tipografia", label: "Tipografia" },
    { key: "visual_grafismos", label: "Grafismos" },
    { key: "visual_fotografia", label: "Diretrizes fotográficas" },
  ],
  "Downloads de logo": [
    { key: "logo_basic", label: "Logo básico (PNG, PDF)" },
    { key: "logo_advanced", label: "Logo avançado (AI, SVG, EPS)" },
  ],
  "Downloads de grafismos": [
    { key: "elements_basic", label: "Grafismos básico (PNG, PDF)" },
    { key: "elements_advanced", label: "Grafismos avançado (AI, SVG, EPS)" },
  ],
  Documentos: [{ key: "docs_basic", label: "Manual e certificado" }],
  Outros: [{ key: "assistente_ia", label: "Assistente de Marca (IA)" }],
} as const;

export const ALL_PERMISSIONS: string[] = Object.values(PERMISSION_GROUPS)
  .flat()
  .map((p) => p.key);

export type SessionUserLike = {
  role: string;
  permissions?: unknown;
};

function permissionsArray(permissions: unknown): string[] {
  if (Array.isArray(permissions)) return permissions as string[];
  return [];
}

/** Server-side and client-side safe: pass the session user (role + permissions). */
export function hasPermission(
  user: SessionUserLike | null | undefined,
  key: string
): boolean {
  if (!user) return false;
  if (user.role === "STUDIO") return true;
  if (user.role === "CLIENT_ADMIN") return true;
  return permissionsArray(user.permissions).includes(key);
}

export function hasAnyPermission(
  user: SessionUserLike | null | undefined,
  keys: string[]
): boolean {
  return keys.some((k) => hasPermission(user, k));
}

export const ADMIN_ROLES = ["STUDIO", "CLIENT_ADMIN"];

export function canAccessAdmin(role: string | undefined | null): boolean {
  return !!role && ADMIN_ROLES.includes(role);
}
