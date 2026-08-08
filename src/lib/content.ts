import type { Role } from "@/generated/prisma/client";

export type NavLeaf = {
  label: string;
  href: string;
  roles: Role[];
};

export type NavGroup = {
  label: string;
  href?: string;
  roles: Role[];
  children?: NavLeaf[];
};

const ALL_ROLES: Role[] = [
  "STUDIO",
  "CLIENT_ADMIN",
  "CLIENT_USER",
  "PARTNER",
];

const NUCLEO_ROLES: Role[] = ["STUDIO", "CLIENT_ADMIN", "CLIENT_USER"];
const PUBLICO_ROLES: Role[] = ["STUDIO", "CLIENT_ADMIN"];
const VERBAL_VISUAL_ROLES: Role[] = ALL_ROLES;
const STUDIO_CLIENT_ROLES: Role[] = ["STUDIO", "CLIENT_ADMIN", "CLIENT_USER"];

export const NAV: NavGroup[] = [
  { label: "Introdução", href: "/", roles: ALL_ROLES },
  {
    label: "Núcleo da Marca",
    roles: NUCLEO_ROLES,
    children: [
      { label: "Posicionamento", href: "/nucleo-da-marca/posicionamento", roles: NUCLEO_ROLES },
      { label: "Propósito", href: "/nucleo-da-marca/proposito", roles: NUCLEO_ROLES },
      { label: "Arquétipos", href: "/nucleo-da-marca/arquetipos", roles: NUCLEO_ROLES },
      { label: "Valores e Bandeiras", href: "/nucleo-da-marca/valores-e-bandeiras", roles: NUCLEO_ROLES },
      { label: "Público", href: "/nucleo-da-marca/publico", roles: PUBLICO_ROLES },
    ],
  },
  {
    label: "Universo Verbal",
    roles: VERBAL_VISUAL_ROLES,
    children: [
      { label: "Manifesto", href: "/universo-verbal/manifesto", roles: VERBAL_VISUAL_ROLES },
      { label: "Tom de Voz", href: "/universo-verbal/tom-de-voz", roles: VERBAL_VISUAL_ROLES },
      { label: "Vocabulário", href: "/universo-verbal/vocabulario", roles: VERBAL_VISUAL_ROLES },
    ],
  },
  {
    label: "Universo Visual",
    roles: VERBAL_VISUAL_ROLES,
    children: [
      { label: "Símbolo e Logotipo", href: "/universo-visual/simbolo-e-logotipo", roles: VERBAL_VISUAL_ROLES },
      { label: "Cores", href: "/universo-visual/cores", roles: VERBAL_VISUAL_ROLES },
      { label: "Tipografia", href: "/universo-visual/tipografia", roles: VERBAL_VISUAL_ROLES },
      { label: "Grafismos", href: "/universo-visual/grafismos", roles: VERBAL_VISUAL_ROLES },
      { label: "Diretrizes fotográficas", href: "/universo-visual/diretrizes-fotograficas", roles: VERBAL_VISUAL_ROLES },
    ],
  },
  { label: "Downloads", href: "/downloads", roles: STUDIO_CLIENT_ROLES },
  { label: "Assistente de Marca (IA)", href: "/assistente", roles: STUDIO_CLIENT_ROLES },
];

export function canAccess(pathname: string, role: Role): boolean {
  if (pathname === "/") return true;
  for (const group of NAV) {
    if (group.href && group.href === pathname) return group.roles.includes(role);
    if (group.children) {
      for (const child of group.children) {
        if (child.href === pathname) return child.roles.includes(role);
      }
      if (pathname.startsWith(groupPrefix(group))) {
        return group.roles.includes(role);
      }
    }
  }
  return true;
}

function groupPrefix(group: NavGroup): string {
  const first = group.children?.[0]?.href ?? "";
  const segments = first.split("/").filter(Boolean);
  return segments.length ? `/${segments[0]}` : "//";
}

export const home = {
  title: "Sistema de Marca",
  subtitle: "Tudo o que define a Instalsat, em um só lugar.",
  searchPlaceholder: "Pergunte sobre a marca",
  cards: [
    {
      title: "Núcleo da Marca",
      description: "Posicionamento, propósito, arquétipos, valores e público.",
      href: "/nucleo-da-marca/posicionamento",
    },
    {
      title: "Universo Verbal",
      description: "Manifesto, tom de voz e vocabulário da Instalsat.",
      href: "/universo-verbal/manifesto",
    },
    {
      title: "Universo Visual",
      description: "Símbolo, logotipo, cores, tipografia, grafismos e fotografia.",
      href: "/universo-visual/simbolo-e-logotipo",
    },
    {
      title: "Downloads",
      description: "Arquivos oficiais da identidade visual para uso imediato.",
      href: "/downloads",
    },
    {
      title: "Assistente de Marca",
      description: "Tire dúvidas sobre a marca com a inteligência artificial.",
      href: "/assistente",
    },
  ],
};

export const posicionamento = {
  title: "Posicionamento",
  paragraphs: [
    "A Instalsat se posiciona como Parceiro Estruturado, uma empresa B2B de segurança eletrônica e manutenção elétrica que opera onde o mercado falha: presença contínua, responsabilidade integral e atendimento sem dependência de uma única pessoa.",
    "O território que a Instalsat ocupa é a interseção entre infraestrutura elétrica e segurança eletrônica. Nenhum concorrente direto ocupa esse espaço de forma integrada.",
    "Público-alvo prioritário: síndicos profissionais, administradoras de condomínios e construtoras.",
    "O que nos diferencia não é um serviço ou um preço. É a permanência.",
  ],
  desafioVisual: {
    title: "O desafio visual resolvido",
    text: "O setor de segurança eletrônica comunica de forma previsível: azul corporativo, vermelho de urgência, cadeados, escudos, raios, câmeras estilizadas. A identidade da Instalsat precisava resolver duas tensões: maturidade suficiente para passar credibilidade a uma administradora exigente, e proximidade suficiente para o síndico ligar no sábado. E ainda abandonar os códigos genéricos do setor para ocupar um território visual vazio.",
  },
};

export const proposito = {
  title: "Propósito",
  items: [
    { label: "Por quê", text: "Garantir que o que precisa funcionar, funcione, para que o cliente nunca pare." },
    { label: "Como", text: "Presença contínua, diagnóstico antes da falha, resposta quando acontece, manutenção ao longo do tempo." },
    { label: "O quê", text: "Segurança eletrônica, instalações e manutenção elétrica. Desde 1998." },
  ],
  sintese: "Para que o essencial nunca pare.",
};

export const arquetipos = {
  title: "Arquétipos",
  intro: "A Instalsat é definida por dois arquétipos em proporções diferentes.",
  cards: [
    {
      label: "Cuidador",
      tag: "dominante",
      text: "Envolve, protege, permanece. É o arco do símbolo. Está na manutenção recorrente, no atendimento que não some, no técnico que tira o sapato antes de entrar.",
    },
    {
      label: "Governante",
      tag: "estruturante",
      text: "Ordena, organiza, responsabiliza. É o quadrado do símbolo. Está na documentação completa, no orçamento detalhado, na operação que não depende de uma pessoa.",
    },
  ],
  closing: "Como os arquétipos se manifestam: o Cuidador fala, o Governante sustenta. A comunicação é próxima e humana (Cuidador), mas o que a empresa entrega é estrutura e previsibilidade (Governante).",
  balanco: "A Instalsat opera com dois arquétipos em proporções diferentes: 65 a 70% Prestativo (Cuidador) e 30 a 35% Governante. O resultado é uma marca que não é afetuosa demais para sentar à mesa com uma construtora, nem fria demais para o síndico ligar quatro anos depois. Próxima, estruturada e madura.",
  comoSeManifesta: {
    title: "Como cada arquétipo se manifesta na prática",
    prestativo: {
      label: "Prestativo",
      items: [
        "Manutenção recorrente",
        "Atendimento que não some",
        "Técnico que tira o sapato antes de entrar",
        "Ligação antes do cliente ligar",
      ],
    },
    governante: {
      label: "Governante",
      items: [
        "Documentação completa",
        "Orçamento detalhado",
        "Operação que não depende de uma única pessoa",
        "Responsabilidade civil e fiscal como condição de operação (não como diferencial de marketing)",
      ],
    },
  },
};

export const valoresEBandeiras = {
  title: "Valores e Bandeiras",
  central: {
    label: "Valor central",
    name: "Presença",
    text: "Estar ali. Não como discurso, como prática. Manutenção contínua é presença. Atendimento recorrente é presença. Responder o telefone no sábado é presença. Se não puder estar presente, não promete.",
  },
  sustentacao: {
    label: "Valor de sustentação",
    name: "Responsabilidade",
    text: "Responder pelo que faz. Civil, ambiental, legal, fiscal, trabalhista. Num mercado onde o informal é regra, operar com responsabilidade integral é posicionamento.",
  },
  outros: [
    {
      name: "Honestidade técnica",
      text: "Não vender medo. Não inflar orçamento. Diagnosticar o que precisa, apresentar com clareza, executar conforme o combinado. Se algo não precisa ser feito, a empresa diz isso.",
    },
    {
      name: "Cuidado",
      text: "Tratar o projeto do cliente como se fosse o próprio. O funcionário tira o sapato. O carro está limpo. O orçamento está bem formatado. O fio está organizado. Cuidado é atenção ao que parece detalhe mas define percepção.",
    },
    {
      name: "Consistência",
      text: "Entregar o mesmo nível hoje, amanhã e daqui a cinco anos. É o que permite à administradora indicar de olho fechado. É o valor mais raro do mercado.",
    },
  ],
};

export const publico = {
  title: "Público",
  prioritario: [
    {
      name: "Síndicos profissionais",
      text: "Gestores de múltiplos condomínios. Decidem por confiabilidade, documentação e resposta rápida. Não toleram dependência de pessoa física.",
    },
    {
      name: "Administradoras de condomínios",
      text: "Indicam fornecedores para toda a carteira. Uma boa experiência se multiplica. Uma má experiência elimina o fornecedor de toda a base.",
    },
    {
      name: "Construtoras",
      text: "Projetos de maior porte, ticket elevado, exigência técnica alta.",
    },
  ],
  naoAceita: {
    title: "O que esse público não aceita",
    items: [
      "Fornecedor que some após a entrega",
      "Dependência do dono para qualquer decisão",
      "Informalidade no processo",
    ],
  },
};

export const manifesto = {
  title: "Manifesto",
  paragraphs: [
    "Tem uma camada do seu mundo que você nunca pensa.",
    "É o portão que abre quando você aperta o botão. A câmera que grava enquanto você dorme. A luz que acende quando você chega.",
    "Você não pensa nisso porque funciona. E funciona porque alguém cuida.",
    "Não alguém que apareceu uma vez, instalou e desapareceu. Alguém que voltou na semana seguinte. Que ligou antes de você ligar. Que trocou antes de queimar.",
    "Nós somos esse alguém.",
    "Não somos a empresa que vende medo. Não somos a empresa que vende pacote. Não somos a empresa que some depois da nota fiscal.",
    "Somos a empresa que fica.",
    "Há quase trinta anos, fazemos a mesma coisa: garantir que o que precisa funcionar, funcione. Sem alarme falso. Sem promessa vazia. Sem faz de conta.",
    "Para que o essencial nunca pare.",
    "Instalsat.",
  ],
};

export const tomDeVoz = {
  title: "Tom de Voz",
  resumo: "A Instalsat fala como um parceiro técnico que você respeita e com quem se sente à vontade. Não é o amigo que manda áudio de 3 minutos. Não é a corporação que manda e-mail com \"prezado senhor\". É o profissional que te chama pelo nome, explica o problema com clareza, resolve no prazo que prometeu e te avisa quando terminou.",
  vozE: ["Direta sem ser seca", "Técnica sem ser inacessível", "Próxima sem ser informal", "Firme sem ser arrogante"],
  como: {
    title: "Como a Instalsat fala",
    items: [
      "Frases curtas. Ideias completas.",
      "Nunca usa jargão para impressionar.",
      "Nunca usa diminutivo para parecer simpática.",
      "Assume quando não sabe, resolve quando pode.",
      "Confirma o que foi combinado. Avisa quando algo muda.",
    ],
  },
  naoFala: {
    title: "Como a Instalsat não fala",
    items: [
      "Sem \"prezado\", \"atenciosamente\", linguagem de ofício.",
      "Sem termos técnicos sem explicação.",
      "Sem promessas que não pode cumprir.",
      "Sem \"qualidade\" como resposta para qualquer pergunta.",
    ],
  },
};

export const vocabulario = {
  title: "Vocabulário",
  pertence: {
    title: "Palavras que pertencem à marca",
    items: ["Presença", "Continuidade", "Cuidado", "Estrutura", "Manutenção", "Diagnóstico", "Permanência", "Responsabilidade", "Recorrente", "Técnico"],
  },
  evita: {
    title: "Palavras que a marca evita",
    items: [
      "Urgente (sem contexto real)",
      "Garantido (sem evidência)",
      "Premium (como adjetivo vazio)",
      "Qualidade (isolada)",
      "Parceria (sem entrega concreta)",
      "Inovação (como buzzword)",
    ],
  },
  fixos: [
    { label: "A verdade", text: "A empresa que fica." },
    { label: "Propósito", text: "Para que o essencial nunca pare." },
    { label: "Posicionamento", text: "Parceiro Estruturado." },
  ],
  nota: "Esses três termos são fixos. Não são variações criativas. Não se adaptam por contexto.",
};

export const simboloELogotipo = {
  title: "Símbolo e Logotipo",
  conceitoCentral: "Permanência.",
  conceito: {
    title: "O símbolo",
    text: "Um arco que envolve sem se fechar, porque a relação também não se fecha. Um quadrado no centro, porque tudo se organiza em torno de quem é atendido. São dois arquétipos em tensão: o Cuidador e o Governante, traduzidos em forma antes de qualquer cor ou fonte.",
  },
  oArco: {
    title: "O arco",
    text: "Formas circulares e côncavas pertencem ao arquétipo do Cuidador: envolvem, acolhem, protegem por fora. O arco abraça o quadrado sem se fechar, é o cuidado que continua.",
  },
  oQuadrado: {
    title: "O quadrado",
    text: "Formas sólidas, simétricas e estáticas afirmam ordem, estrutura, controle. Está ancorado no centro, fixo, imóvel. Tudo na Instalsat se organiza em torno do cliente, e ele é o quadrado.",
  },
  detalhe: {
    title: "O detalhe que torna o símbolo proprietário",
    text: "O topo do quadrado se alinha com exatidão à abertura do arco. As terminações do arco são chapadas, com cortes geométricos limpos. É onde Cuidador e Governante param de ser arquétipos separados e viram um único gesto.",
  },
  logotipia: {
    title: "Logotipia",
    text: "Baseada na Nortica Grotesk Semibold com modificações exclusivas: terminações chapadas nas letras de curvatura (principalmente 's' e 'a'), ligatura entre 's' e 't' que representa conexão (Cuidador), ajustes de kerning letra a letra. A versão Instalsat não existe em nenhuma fonte de prateleira. A Nortica original existe no mercado. A versão Instalsat não.",
  },
  versoes: {
    title: "Versões",
    items: [
      {
        name: "Horizontal",
        text: "Símbolo à esquerda, logotipia à direita. Configuração padrão para espaços largos.",
      },
      {
        name: "Vertical",
        text: "Símbolo acima, logotipia abaixo. Configuração de exceção para espaços altos e estreitos.",
      },
    ],
  },
  regras: {
    title: "Regras de uso",
    items: [
      "Nunca distorcer ou redimensionar de forma não proporcional.",
      "Nunca aplicar sobre fundos que comprometam o contraste.",
      "Nunca recriar o logotipo em outras fontes.",
      "Versão principal: símbolo + logotipia. Versão reduzida: símbolo isolado.",
    ],
  },
  nota: "Arquivos disponíveis para download na seção Downloads.",
};

export const cores = {
  title: "Cores",
  contexto: "O sistema cromático foi construído para resolver duas tarefas: descolar a marca de um setor dominado por azul corporativo, vermelho de urgência e verde industrial, e traduzir o arquétipo Parceiro Estruturado em cor.",
  paleta: [
    {
      name: "Petróleo",
      hex: "#003841",
      text: "Cor primária. Fundos, headers, elementos de maior peso visual.",
      justificativa: "Carrega o Governante. Estabilidade, maturidade, presença sólida. É o fundo institucional, a atmosfera onde a Instalsat aparece em contextos controlados.",
      swatch: "petroleo",
    },
    {
      name: "Brasa",
      hex: "#E05829",
      text: "Cor de destaque. Pontos de atenção, o ponto final nos títulos, elementos de ação. Nunca usar como fundo de seção.",
      justificativa: "Carrega o Prestativo. Calor humano, presença próxima. É a temperatura que impede a marca de soar fria. Aparece pontualmente: no símbolo, em destaques, no ponto final dos títulos. Nunca como fundo dominante.",
      swatch: "brasa",
    },
    {
      name: "Bruma",
      hex: "#DCE3EC",
      text: "Superfícies secundárias, backgrounds de cards, divisórias.",
      justificativa: "É o ambiente onde Petróleo e Brasa respiram. Substitui o branco puro, cria atmosfera, não esterilidade. Respira a mesma família cromática das outras duas. É o que une o sistema.",
      swatch: "bruma",
    },
    {
      name: "Bruma Light",
      hex: "#EEF5FF",
      text: "Backgrounds principais em aplicações claras.",
      justificativa: "Versão mais clara da Bruma. Usada em backgrounds principais em aplicações digitais claras.",
      swatch: "bruma-light",
    },
    {
      name: "Branco",
      hex: "#FFFFFF",
      text: "Fallback técnico apenas. Não faz parte da paleta oficial.",
      justificativa: null as string | null,
      swatch: "branco",
    },
  ],
  regras: {
    title: "Regras de cor",
    items: [
      "Brasa nunca é fundo de seção.",
      "Todo título de comunicação leva ponto final em Brasa.",
      "Sobre fundo Petróleo, textos em Bruma ou Bruma Light, nunca em branco puro.",
    ],
  },
};

export const tipografia = {
  title: "Tipografia",
  nortica: { title: "Nortica Grotesk", text: "Exclusiva para o logotipo. Não usar em nenhum outro contexto." },
  rubik: {
    title: "Rubik (apoio)",
    text: "Tipografia institucional em todos os pontos de contato.",
    justificativa: "Uma sans-serif de estrutura geométrica e terminações arredondadas. Disciplinada o suficiente para sustentar a maturidade institucional, humana o suficiente para não soar corporativa distante. A estrutura geométrica carrega o Governante. As terminações arredondadas carregam o Prestativo.",
  },
  porQueNaoNortica: {
    title: "Por que não a Nortica no corpo do texto",
    text: "Por ser diferente do logotipo, que opera com terminações chapadas exclusivas, a Rubik mantém o logo único em sua aplicação. Assinatura de um lado, voz cotidiana do outro.",
  },
  pesos: [
    { name: "Light", uso: "Textos longos, legendas, textos secundários." },
    { name: "Regular", uso: "Corpo de texto padrão." },
    { name: "Medium", uso: "Subtítulos, destaques internos." },
    { name: "Semibold", uso: "Títulos, headlines." },
  ],
  foraDoSistema: "Bold e acima: fora do sistema.",
  regras: {
    title: "Regras de tipografia",
    items: [
      "Títulos, subtítulos e slogans sempre em caixa mista. Nunca caixa alta.",
      "Em fundos escuros (Petróleo), descer um peso para compensar expansão óptica.",
    ],
  },
  expansaoOptica: {
    title: "Regra de expansão óptica",
    text: "Em fundos escuros (Petróleo), textos em Brasa ou Bruma sofrem expansão óptica, a cor clara sobre fundo escuro faz a fonte parecer mais grossa do que é. Por isso, em fundos escuros, cada elemento desce um peso. Pesos Bold e acima ficam fora do sistema.",
  },
};

export const grafismos = {
  title: "Grafismos",
  principio: "O sistema gráfico nasce do próprio símbolo, não é ornamento externo. O arco e o quadrado, ampliados, recortados ou tonalizados, viram ferramentas de design. Toda vez que um elemento aparece, o conceito do símbolo é reafirmado. A identidade não precisa explicar o que é, ela se mostra.",
  itens: [
    {
      name: "Arco-Atmosfera",
      text: "Em variação tonal sobre Petróleo, o arco vira moldura de fundo em superfícies grandes: hero de site, capa de proposta, slide de apresentação. Dá atmosfera sem prender o conteúdo. A abertura define onde o layout respira.",
    },
    {
      name: "Arco-Máscara",
      text: "Em escala ampliada sobre fotografias, o arco recorta a imagem. O que fica dentro do arco é o que a marca envolve. Funciona como recurso narrativo em imagens de equipe, pessoas, instalações ou espaços atendidos: a marca literalmente abraça o conteúdo.",
    },
    {
      name: "Quadrado-Frame",
      text: "Em Brasa, o quadrado do símbolo vira frame para fotografias, notadamente em crachás de técnicos. O profissional da Instalsat aparece dentro da estrutura da marca. Quem trabalha sob a marca, trabalha dentro dela.",
    },
  ],
  regra: "Os grafismos derivam do símbolo. Nunca criar elementos gráficos que não tenham origem no arco ou no quadrado.",
};

export const diretrizesFotograficas = {
  title: "Diretrizes fotográficas",
  comunica: {
    title: "O que a fotografia da Instalsat comunica",
    text: "Competência técnica visível, ambientes sofisticados, presença humana sem informalidade excessiva.",
  },
  locacoes: {
    title: "Locações",
    text: "Sempre lidas como ambientes brasileiros sofisticados e urbanos. Nunca genéricas ou europeias.",
  },
  evitar: {
    title: "O que evitar",
    items: [
      "Fotos de banco genéricas",
      "Fundos brancos de estúdio para contexto institucional",
      "Imagens que remetam a MEI ou trabalho informal",
    ],
  },
  paleta: {
    title: "Paleta fotográfica",
    text: "Tons quentes-neutros, luz natural controlada, ambientes com acabamento premium (ACM, porcelana, vegetação tropical, gates eletrônicos).",
  },
};

export const downloads = {
  title: "Downloads",
  categorias: [
    { name: "Logotipo", formatos: "SVG, PNG, PDF, AI", href: null as string | null },
    { name: "Manual de Marca", formatos: "PDF", href: null as string | null },
    { name: "Logotipo Animado", formatos: "MP4", href: null as string | null },
    { name: "Certificado de Registro da Identidade Visual", formatos: "PDF", href: null as string | null },
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

export function buildBrandSystemPrompt(): string {
  return `Você é o Assistente de Marca da Instalsat. Responda sempre em português do Brasil, seguindo rigorosamente o sistema de marca abaixo. Nunca use caixa alta em títulos ou frases inteiras. Nunca use travessão (o caractere —) em nenhuma resposta, use vírgula ou ponto no lugar. Seja direto, técnico sem ser inacessível, próximo sem ser informal, firme sem ser arrogante. Nunca use "prezado", "atenciosamente" ou linguagem de ofício.

POSICIONAMENTO
${posicionamento.paragraphs.join(" ")} ${posicionamento.desafioVisual.text}

PROPÓSITO
${proposito.items.map((i) => `${i.label}: ${i.text}`).join(" ")} Síntese: ${proposito.sintese}

ARQUÉTIPOS
${arquetipos.intro} Cuidador (dominante): ${arquetipos.cards[0].text} Governante (estruturante): ${arquetipos.cards[1].text} ${arquetipos.closing} ${arquetipos.balanco} Como o Prestativo se manifesta: ${arquetipos.comoSeManifesta.prestativo.items.join(", ")}. Como o Governante se manifesta: ${arquetipos.comoSeManifesta.governante.items.join(", ")}.

VALORES
Presença (central): ${valoresEBandeiras.central.text} Responsabilidade (sustentação): ${valoresEBandeiras.sustentacao.text} ${valoresEBandeiras.outros.map((v) => `${v.name}: ${v.text}`).join(" ")}

PÚBLICO PRIORITÁRIO
${publico.prioritario.map((p) => `${p.name}: ${p.text}`).join(" ")} Não aceita: ${publico.naoAceita.items.join(", ")}.

MANIFESTO
${manifesto.paragraphs.join(" ")}

TOM DE VOZ
${tomDeVoz.resumo} A voz é: ${tomDeVoz.vozE.join(", ")}. Como fala: ${tomDeVoz.como.items.join(" ")} Como não fala: ${tomDeVoz.naoFala.items.join(" ")}

VOCABULÁRIO
Palavras que pertencem à marca: ${vocabulario.pertence.items.join(", ")}. Palavras que a marca evita: ${vocabulario.evita.items.join(", ")}. Termos fixos e não variáveis: ${vocabulario.fixos.map((f) => `${f.label}: "${f.text}"`).join(", ")}.

IDENTIDADE VISUAL
Conceito central do símbolo: ${simboloELogotipo.conceitoCentral} ${simboloELogotipo.conceito.text} ${simboloELogotipo.oArco.text} ${simboloELogotipo.oQuadrado.text} ${simboloELogotipo.detalhe.text} ${simboloELogotipo.logotipia.text}
Cores: ${cores.contexto} Petróleo #003841 (primária): ${cores.paleta[0].justificativa} Brasa #E05829 (destaque, nunca fundo de seção): ${cores.paleta[1].justificativa} Bruma #DCE3EC: ${cores.paleta[2].justificativa} Bruma Light #EEF5FF: ${cores.paleta[3].justificativa}
Tipografia: Rubik, pesos Light/Regular/Medium/Semibold, nunca Bold, nunca caixa alta. ${tipografia.rubik.justificativa} ${tipografia.porQueNaoNortica.text} ${tipografia.expansaoOptica.text}
Grafismos: ${grafismos.principio} ${grafismos.itens.map((g) => `${g.name}: ${g.text}`).join(" ")}

Ao responder, aplique este sistema de marca como referência de conteúdo e de tom. Quando pedirem textos de comunicação (headlines, posts, respostas a clientes), escreva já no tom de voz da Instalsat.`;
}
