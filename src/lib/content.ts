export type NavLeaf = {
  label: string;
  href: string;
  permission?: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  permission?: string;
  children?: NavLeaf[];
};

export const NAV: NavGroup[] = [
  { label: "Introdução", href: "/" },
  {
    label: "Núcleo da Marca",
    children: [
      { label: "Posicionamento", href: "/nucleo-da-marca/posicionamento", permission: "nucleo_posicionamento" },
      { label: "Propósito", href: "/nucleo-da-marca/proposito", permission: "nucleo_proposito" },
      { label: "Arquétipos", href: "/nucleo-da-marca/arquetipos", permission: "nucleo_arquetipos" },
      { label: "Valores e Bandeiras", href: "/nucleo-da-marca/valores-e-bandeiras", permission: "nucleo_valores" },
      { label: "Público", href: "/nucleo-da-marca/publico", permission: "nucleo_publico" },
    ],
  },
  {
    label: "Universo Verbal",
    children: [
      { label: "Manifesto", href: "/universo-verbal/manifesto", permission: "verbal_manifesto" },
      { label: "Tom de Voz", href: "/universo-verbal/tom-de-voz", permission: "verbal_tomdevoz" },
      { label: "Vocabulário", href: "/universo-verbal/vocabulario", permission: "verbal_vocabulario" },
    ],
  },
  {
    label: "Universo Visual",
    children: [
      { label: "Símbolo e Logotipo", href: "/universo-visual/simbolo-e-logotipo", permission: "visual_simbolo" },
      { label: "Cores", href: "/universo-visual/cores", permission: "visual_cores" },
      { label: "Tipografia", href: "/universo-visual/tipografia", permission: "visual_tipografia" },
      { label: "Grafismos", href: "/universo-visual/grafismos", permission: "visual_grafismos" },
      { label: "Diretrizes fotográficas", href: "/universo-visual/diretrizes-fotograficas", permission: "visual_fotografia" },
      { label: "Diretrizes de Uso", href: "/universo-visual/diretrizes", permission: "visual_diretrizes" },
    ],
  },
  { label: "Documentos", href: "/documentos" },
  { label: "Assistente de Marca (IA)", href: "/assistente", permission: "assistente_ia" },
];

export const home = {
  title: "Sistema de Marca",
  subtitle: "Tudo o que define a Instalsat, em um só lugar.",
  searchPlaceholder: "Pergunte sobre a marca",
  cards: [
    { title: "Núcleo da Marca", href: "/nucleo-da-marca/posicionamento" },
    { title: "Universo Verbal", href: "/universo-verbal/manifesto" },
    { title: "Universo Visual", href: "/universo-visual/simbolo-e-logotipo" },
    { title: "Documentos", href: "/documentos" },
    { title: "Assistente de Marca", href: "/assistente" },
  ],
};

export const assistente = {
  title: "Assistente de Marca",
  intro: "Converse com a inteligência artificial da Instalsat sobre posicionamento, tom de voz, identidade visual e uso da marca.",
  exemplos: [
    "Sugira 3 variações de headline para um post sobre manutenção preventiva",
    "Essa frase está no tom de voz da marca?",
    "Como a Instalsat responderia a uma reclamação de prazo?",
    "Quem é o público prioritário da Instalsat?",
  ],
};
