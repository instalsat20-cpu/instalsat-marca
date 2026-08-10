import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedUser() {
  const email = "alison@metacube.me";
  const password = process.env.SEED_STUDIO_PASSWORD ?? "metacube2026";
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: passwordHash, role: "STUDIO", active: true },
    create: {
      email,
      name: "Alison",
      role: "STUDIO",
      password: passwordHash,
      active: true,
      permissions: [],
    },
  });

  console.log(`Usuário seedado: ${user.email} (${user.role})`);
}

async function seedColors() {
  const colors = [
    { name: "Petróleo", hex: "#003841", rgb: "0 56 65", cmyk: "94 62 56 50", pantone: "2217 C", order: 0 },
    { name: "Brasa", hex: "#E05829", rgb: "224 88 41", cmyk: "7 79 98 1", pantone: "7579 C", order: 1 },
    { name: "Bruma", hex: "#DCE3EC", rgb: "220 227 236", cmyk: "12 6 3 0", pantone: "656 C", order: 2 },
    { name: "Bruma Light", hex: "#EEF5FF", rgb: "238 245 255", cmyk: "7 4 0 0", pantone: null, order: 3 },
  ];

  for (const color of colors) {
    const existing = await prisma.color.findFirst({ where: { name: color.name } });
    if (existing) {
      await prisma.color.update({ where: { id: existing.id }, data: color });
    } else {
      await prisma.color.create({ data: color });
    }
  }

  console.log(`Cores seedadas: ${colors.length}`);
}

async function seedCategories() {
  const categories: { name: string; type: string; order: number }[] = [
    { name: "Horizontal", type: "logo", order: 0 },
    { name: "Vertical", type: "logo", order: 1 },
    { name: "Símbolo isolado", type: "logo", order: 2 },
    { name: "Arco-Atmosfera", type: "graphic", order: 0 },
    { name: "Arco-Máscara", type: "graphic", order: 1 },
    { name: "Quadrado-Frame", type: "graphic", order: 2 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { type_name: { type: cat.type, name: cat.name } },
      update: { order: cat.order },
      create: cat,
    });
  }

  // Document categories were renamed to match the new doc_* permission keys.
  // Rename existing rows in place (preserves category links on existing documents)
  // instead of upserting new ones, which would leave orphaned old-named rows.
  const documentCategoryRenames: { from: string; to: string; order: number }[] = [
    { from: "Manual", to: "Manual de Marca", order: 0 },
    { from: "Certificado", to: "Diagnóstico da Marca", order: 1 },
    { from: "Outros", to: "Comprovante de Registro", order: 2 },
  ];

  for (const { from, to, order } of documentCategoryRenames) {
    const existingOld = await prisma.category.findUnique({
      where: { type_name: { type: "document", name: from } },
    });
    if (existingOld) {
      await prisma.category.update({ where: { id: existingOld.id }, data: { name: to, order } });
    } else {
      await prisma.category.upsert({
        where: { type_name: { type: "document", name: to } },
        update: { order },
        create: { name: to, type: "document", order },
      });
    }
  }

  console.log(`Categorias seedadas: ${categories.length + documentCategoryRenames.length}`);
}

async function seedGuidelines() {
  const guidelines = [
    {
      title: "Grid de construção",
      body: "<p>O símbolo é construído sobre um grid modular que define a proporção entre o arco e o quadrado. Todas as reproduções devem respeitar essa proporção, sem distorções.</p>",
      order: 0,
    },
    {
      title: "Margem de segurança",
      body: "<p>Mantenha ao redor do símbolo uma área livre equivalente à altura do quadrado central. Nenhum elemento gráfico, texto ou borda deve invadir essa margem.</p>",
      order: 1,
    },
    {
      title: "Usos corretos",
      body: "<p>Utilize sempre os arquivos oficiais, nas cores e proporções originais, sobre fundos que garantam contraste suficiente.</p>",
      order: 2,
    },
    {
      title: "Usos incorretos",
      body: "<p>Não distorça, rotacione, recorte ou altere as cores do símbolo. Não aplique sombras, contornos ou efeitos que não constem no manual.</p>",
      order: 3,
    },
  ];

  for (const g of guidelines) {
    const existing = await prisma.guideLine.findFirst({ where: { title: g.title } });
    if (existing) {
      await prisma.guideLine.update({ where: { id: existing.id }, data: g });
    } else {
      await prisma.guideLine.create({ data: g });
    }
  }

  console.log(`Diretrizes seedadas: ${guidelines.length}`);
}

async function seedTypography() {
  const fonts = [
    {
      name: "Nortica Grotesk",
      type: "primary",
      googleFont: null,
      description:
        "Tipografia exclusiva do logotipo. Baseada na Nortica Grotesk Semibold com modificações cirúrgicas exclusivas. Não disponível para download.",
      weights: "Semibold modificado",
      downloadUrl: null,
      order: 0,
    },
    {
      name: "Rubik",
      type: "support",
      googleFont: "Rubik",
      description: "Tipografia institucional da Instalsat em todos os pontos de contato.",
      weights: "Light, Regular, Medium, Semibold",
      downloadUrl: null,
      order: 1,
    },
  ];

  for (const font of fonts) {
    const existing = await prisma.typography.findFirst({ where: { name: font.name } });
    if (existing) {
      await prisma.typography.update({ where: { id: existing.id }, data: font });
    } else {
      await prisma.typography.create({ data: font });
    }
  }

  console.log(`Tipografias seedadas: ${fonts.length}`);
}

async function seedSettings() {
  const existing = await prisma.settings.findFirst();
  if (existing) {
    console.log("Settings já existe, mantendo valores atuais (não sobrescrito pelo seed).");
    return;
  }

  await prisma.settings.create({
    data: {
      brandName: "Instalsat",
      primaryColor: "#003841",
      accentColor: "#E05829",
      bgLight: "#EEF5FF",
      bgMedium: "#DCE3EC",
      logoUrl: "/logo-horizontal.svg",
      fontFamily: "Rubik",
    },
  });

  console.log("Settings seedado.");
}

async function seedContent() {
  const sections: { section: string; title: string; body: string }[] = [
    {
      section: "nucleo_posicionamento",
      title: "Posicionamento",
      body: [
        "A Instalsat se posiciona como Parceiro Estruturado, uma empresa B2B de segurança eletrônica e manutenção elétrica que opera onde o mercado falha: presença contínua, responsabilidade integral e atendimento sem dependência de uma única pessoa.",
        "O território que a Instalsat ocupa é a interseção entre infraestrutura elétrica e segurança eletrônica. Nenhum concorrente direto ocupa esse espaço de forma integrada.",
        "Público-alvo prioritário: síndicos profissionais, administradoras de condomínios e construtoras.",
        "O que nos diferencia não é um serviço ou um preço. É a permanência.",
        "O setor de segurança eletrônica comunica de forma previsível: azul corporativo, vermelho de urgência, cadeados, escudos, raios, câmeras estilizadas. A identidade da Instalsat precisava resolver duas tensões: maturidade suficiente para passar credibilidade a uma administradora exigente, e proximidade suficiente para o síndico ligar no sábado. E ainda abandonar os códigos genéricos do setor para ocupar um território visual vazio.",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "nucleo_proposito",
      title: "Propósito",
      body: [
        "Por quê: garantir que o que precisa funcionar, funcione, para que o cliente nunca pare.",
        "Como: presença contínua, diagnóstico antes da falha, resposta quando acontece, manutenção ao longo do tempo.",
        "O quê: segurança eletrônica, instalações e manutenção elétrica. Desde 1998.",
        "Para que o essencial nunca pare.",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "nucleo_arquetipos",
      title: "Arquétipos",
      body: [
        "A Instalsat é definida por dois arquétipos em proporções diferentes.",
        "Cuidador (dominante): envolve, protege, permanece. É o arco do símbolo. Está na manutenção recorrente, no atendimento que não some, no técnico que tira o sapato antes de entrar.",
        "Governante (estruturante): ordena, organiza, responsabiliza. É o quadrado do símbolo. Está na documentação completa, no orçamento detalhado, na operação que não depende de uma pessoa.",
        "Como os arquétipos se manifestam: o Cuidador fala, o Governante sustenta. A comunicação é próxima e humana (Cuidador), mas o que a empresa entrega é estrutura e previsibilidade (Governante).",
        "A Instalsat opera com dois arquétipos em proporções diferentes: 65 a 70% Prestativo (Cuidador) e 30 a 35% Governante. O resultado é uma marca que não é afetuosa demais para sentar à mesa com uma construtora, nem fria demais para o síndico ligar quatro anos depois. Próxima, estruturada e madura.",
        "Como o Prestativo se manifesta: manutenção recorrente, atendimento que não some, técnico que tira o sapato antes de entrar, ligação antes do cliente ligar.",
        "Como o Governante se manifesta: documentação completa, orçamento detalhado, operação que não depende de uma única pessoa, responsabilidade civil e fiscal como condição de operação (não como diferencial de marketing).",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "nucleo_valores",
      title: "Valores e Bandeiras",
      body: [
        "Valor central, Presença: estar ali. Não como discurso, como prática. Manutenção contínua é presença. Atendimento recorrente é presença. Responder o telefone no sábado é presença. Se não puder estar presente, não promete.",
        "Valor de sustentação, Responsabilidade: responder pelo que faz. Civil, ambiental, legal, fiscal, trabalhista. Num mercado onde o informal é regra, operar com responsabilidade integral é posicionamento.",
        "Honestidade técnica: não vender medo. Não inflar orçamento. Diagnosticar o que precisa, apresentar com clareza, executar conforme o combinado. Se algo não precisa ser feito, a empresa diz isso.",
        "Cuidado: tratar o projeto do cliente como se fosse o próprio. O funcionário tira o sapato. O carro está limpo. O orçamento está bem formatado. O fio está organizado. Cuidado é atenção ao que parece detalhe mas define percepção.",
        "Consistência: entregar o mesmo nível hoje, amanhã e daqui a cinco anos. É o que permite à administradora indicar de olho fechado. É o valor mais raro do mercado.",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "nucleo_publico",
      title: "Público",
      body: [
        "Síndicos profissionais: gestores de múltiplos condomínios. Decidem por confiabilidade, documentação e resposta rápida. Não toleram dependência de pessoa física.",
        "Administradoras de condomínios: indicam fornecedores para toda a carteira. Uma boa experiência se multiplica. Uma má experiência elimina o fornecedor de toda a base.",
        "Construtoras: projetos de maior porte, ticket elevado, exigência técnica alta.",
        "O que esse público não aceita: fornecedor que some após a entrega, dependência do dono para qualquer decisão, informalidade no processo.",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "verbal_manifesto",
      title: "Manifesto",
      body: [
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
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "verbal_tomdevoz",
      title: "Tom de Voz",
      body: [
        "A Instalsat fala como um parceiro técnico que você respeita e com quem se sente à vontade. Não é o amigo que manda áudio de 3 minutos. Não é a corporação que manda e-mail com \"prezado senhor\". É o profissional que te chama pelo nome, explica o problema com clareza, resolve no prazo que prometeu e te avisa quando terminou.",
        "A voz é: direta sem ser seca, técnica sem ser inacessível, próxima sem ser informal, firme sem ser arrogante.",
        "Como a Instalsat fala: frases curtas, ideias completas. Nunca usa jargão para impressionar. Nunca usa diminutivo para parecer simpática. Assume quando não sabe, resolve quando pode. Confirma o que foi combinado, avisa quando algo muda.",
        "Como a Instalsat não fala: sem \"prezado\", \"atenciosamente\", linguagem de ofício. Sem termos técnicos sem explicação. Sem promessas que não pode cumprir. Sem \"qualidade\" como resposta para qualquer pergunta.",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "verbal_vocabulario",
      title: "Vocabulário",
      body: [
        "Palavras que pertencem à marca: presença, continuidade, cuidado, estrutura, manutenção, diagnóstico, permanência, responsabilidade, recorrente, técnico.",
        "Palavras que a marca evita: urgente (sem contexto real), garantido (sem evidência), premium (como adjetivo vazio), qualidade (isolada), parceria (sem entrega concreta), inovação (como buzzword).",
        "Termos fixos, não são variações criativas e não se adaptam por contexto: \"A empresa que fica\" (a verdade). \"Para que o essencial nunca pare\" (propósito). \"Parceiro Estruturado\" (posicionamento).",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "visual_simbolo",
      title: "Símbolo e Logotipo",
      body: [
        "Conceito central: Permanência.",
        "O símbolo: um arco que envolve sem se fechar, porque a relação também não se fecha. Um quadrado no centro, porque tudo se organiza em torno de quem é atendido. São dois arquétipos em tensão: o Cuidador e o Governante, traduzidos em forma antes de qualquer cor ou fonte.",
        "O arco: formas circulares e côncavas pertencem ao arquétipo do Cuidador, envolvem, acolhem, protegem por fora. O arco abraça o quadrado sem se fechar, é o cuidado que continua.",
        "O quadrado: formas sólidas, simétricas e estáticas afirmam ordem, estrutura, controle. Está ancorado no centro, fixo, imóvel. Tudo na Instalsat se organiza em torno do cliente, e ele é o quadrado.",
        "O detalhe que torna o símbolo proprietário: o topo do quadrado se alinha com exatidão à abertura do arco. As terminações do arco são chapadas, com cortes geométricos limpos. É onde Cuidador e Governante param de ser arquétipos separados e viram um único gesto.",
        "A logotipia: baseada na Nortica Grotesk Semibold com modificações exclusivas, terminações chapadas nas letras de curvatura (principalmente 's' e 'a'), ligatura entre 's' e 't' que representa conexão (Cuidador), ajustes de kerning letra a letra. A versão Instalsat não existe em nenhuma fonte de prateleira. A Nortica original existe no mercado. A versão Instalsat não.",
        "Versões: horizontal, símbolo à esquerda e logotipia à direita, configuração padrão para espaços largos. Vertical, símbolo acima e logotipia abaixo, configuração de exceção para espaços altos e estreitos.",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "visual_cores",
      title: "Cores",
      body: [
        "O sistema cromático foi construído para resolver duas tarefas: descolar a marca de um setor dominado por azul corporativo, vermelho de urgência e verde industrial, e traduzir o arquétipo Parceiro Estruturado em cor.",
        "Petróleo carrega o Governante: estabilidade, maturidade, presença sólida. É o fundo institucional, a atmosfera onde a Instalsat aparece em contextos controlados.",
        "Brasa carrega o Prestativo: calor humano, presença próxima. É a temperatura que impede a marca de soar fria. Aparece pontualmente, no símbolo, em destaques, no ponto final dos títulos. Nunca como fundo dominante.",
        "Bruma é o ambiente onde Petróleo e Brasa respiram. Substitui o branco puro, cria atmosfera, não esterilidade.",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "visual_tipografia",
      title: "Tipografia",
      body: [
        "Rubik é uma sans-serif de estrutura geométrica e terminações arredondadas. Disciplinada o suficiente para sustentar a maturidade institucional, humana o suficiente para não soar corporativa distante. A estrutura geométrica carrega o Governante, as terminações arredondadas carregam o Prestativo.",
        "Por que não a Nortica no corpo do texto: por ser diferente do logotipo, que opera com terminações chapadas exclusivas, a Rubik mantém o logo único em sua aplicação. Assinatura de um lado, voz cotidiana do outro.",
        "Regra de expansão óptica: em fundos escuros (Petróleo), textos em Brasa ou Bruma sofrem expansão óptica, a cor clara sobre fundo escuro faz a fonte parecer mais grossa do que é. Por isso, em fundos escuros, cada elemento desce um peso. Pesos Bold e acima ficam fora do sistema.",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "visual_grafismos",
      title: "Grafismos",
      body: [
        "O sistema gráfico nasce do próprio símbolo, não é ornamento externo. O arco e o quadrado, ampliados, recortados ou tonalizados, viram ferramentas de design. Toda vez que um elemento aparece, o conceito do símbolo é reafirmado. A identidade não precisa explicar o que é, ela se mostra.",
        "Arco-Atmosfera: em variação tonal sobre Petróleo, o arco vira moldura de fundo em superfícies grandes, hero de site, capa de proposta, slide de apresentação.",
        "Arco-Máscara: em escala ampliada sobre fotografias, o arco recorta a imagem. O que fica dentro do arco é o que a marca envolve.",
        "Quadrado-Frame: em Brasa, o quadrado do símbolo vira frame para fotografias e crachás. Quem trabalha sob a marca, trabalha dentro dela.",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "visual_fotografia",
      title: "Diretrizes fotográficas",
      body: [
        "O que a fotografia da Instalsat comunica: competência técnica visível, ambientes sofisticados, presença humana sem informalidade excessiva.",
        "Locações: sempre lidas como ambientes brasileiros sofisticados e urbanos. Nunca genéricas ou europeias.",
        "O que evitar: fotos de banco genéricas, fundos brancos de estúdio para contexto institucional, imagens que remetam a MEI ou trabalho informal.",
        "Paleta fotográfica: tons quentes-neutros, luz natural controlada, ambientes com acabamento premium (ACM, porcelana, vegetação tropical, gates eletrônicos).",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "visual_diretrizes",
      title: "Diretrizes de Uso",
      body: [
        "Como aplicar corretamente os elementos da identidade visual.",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
    {
      section: "documentos",
      title: "Documentos",
      body: [
        "Arquivos oficiais da identidade visual da Instalsat.",
      ].map((paragraph) => `<p>${paragraph}</p>`).join(""),
    },
  ];

  for (const s of sections) {
    await prisma.content.upsert({
      where: { section: s.section },
      update: { title: s.title, body: s.body },
      create: s,
    });
  }

  console.log(`Content seedado: ${sections.length} seções.`);
}

async function main() {
  await seedUser();
  await seedCategories();
  await seedColors();
  await seedTypography();
  await seedSettings();
  await seedContent();
  await seedGuidelines();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
