// Todo o texto do site. Para montar um cliente: trocar este arquivo e as imagens.
//
// Os dados do venue usam os mesmos nomes e o mesmo formato do venue.json da skill de
// captura ({ valor, fonte, confianca } em cada campo; itens de lista planos com fonte),
// para a skill de preenchimento escrever aqui direto. Regra do venue.json: sem fonte = null,
// e campo null não aparece no site.
//
// No template, cada texto é o placeholder de instrução da §4 do docs/VENUE-TEMPLATE.md
// (quando um placeholder da §4 cobre vários campos, ele foi dividido entre eles; o texto
// inteiro aparece no modo guia, em content/guide.ts). Placeholders e guia em português;
// copy final e rótulos de interface em inglês americano.

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type Confianca = "alta" | "media" | "baixa" | null;

// Campo do venue.json
export type Campo<T = string> = { valor: T | null; fonte: string | null; confianca: Confianca };

export type Link = { label: string; href: string };

// Como o placeholder de mídia se descreve: [FOTO — cerimônia ao ar livre, horizontal, mín. 2400px]
export type MidiaSpec = {
  tipo: "foto" | "video";
  descricao: string;
  formato: "horizontal" | "vertical" | "quadrada";
  minimo: string;
};

// Foto = campo do venue.json (valor = caminho da imagem) + alt + como o placeholder se descreve
export type Foto = Campo<string> & { alt: string; placeholder: MidiaSpec };

// Clipe do hero em vídeo: `nome` = arquivo em public/video/hero/{desktop,mobile}/ (<nome>.mp4,
// <nome>.webm e <nome>-poster.jpg nos dois). O alt do 1º clipe descreve o poster (imagem principal).
// legenda: texto curto em mono no canto do hero enquanto o clipe toca (null = sem legenda)
export type ClipeHero = { nome: string; alt: string; fonte: string | null; legenda?: string | null };

// Loop de seção (card do Wedding Weekend, banner do How It Works): `nome` = arquivos em public/video/loops/
// (<nome>.mp4, <nome>.webm e <nome>-poster.jpg). O poster aparece no lugar da foto e o vídeo toca por cima;
// null = só a foto. VENUE-TEMPLATE §4, seções 6 e 10.
export type LoopSecao = { nome: string; fonte: string | null };

export type Espaco = {
  nome: string;
  uso: string | null;
  descricao: string | null;
  capacidade?: string | null;
  tags?: string[];
  // selo amarelo do espaço-herói (o primeiro da lista): o diferencial nº 1
  selo?: string | null;
  foto?: Foto;
  // página The Venue: descrição inteira (na home fica a curta, `descricao`)
  descricao_completa?: string | null;
  // true = só na página The Venue (espaço sem foto boa ou secundário); a home não mostra
  so_na_pagina?: boolean;
  fonte: string | null;
  confianca: Confianca;
};

export type Pacote = {
  nome: string;
  // null = "Pricing on your tour"
  preco: string | null;
  para_quem?: string | null;
  inclui: string[];
  // selo MOST CHOSEN: só se o venue disser isso
  destaque?: boolean;
  // nº de convidados para quem o pacote é feito: "Check This Date" abre o card Schedule a Tour
  // com a faixa que contém esse número já marcada (null = nenhuma marcada)
  convidados?: number | null;
  fonte: string | null;
  confianca: Confianca;
};

export type Adicional = { item: string; preco: string | null; fonte: string | null };

export type Hospedagem = {
  nome: string;
  dorme: string | null;
  // true = no local · false = próxima · null = o dado não diz
  no_local: boolean | null;
  descricao?: string | null;
  foto?: Foto;
  link_reserva?: string | null;
  fonte: string | null;
  confianca: Confianca;
};

// Getting Here: tempo de carro até um destino (cidade, centro, aeroporto)
export type Destino = { destino: string; tempo: string; fonte: string | null; confianca: Confianca };

// tema: a página Packages puxa as perguntas de preço, bebida e capacidade pelo tema
export type TemaFaq = "capacidade" | "preco" | "bebida" | "chuva" | "horario" | "hospedagem" | "fornecedores" | "pets" | "estacionamento";
export type Pergunta = { pergunta: string; resposta: string; tema?: TemaFaq; fonte: string | null };

export type Depoimento = {
  nome: string;
  data: string | null;
  texto: string;
  // o depoimento de destaque também aparece junto da chamada final (Check Your Date)
  destaque?: boolean;
  fonte: string | null;
};

export type Imprensa = { nome: string; logo?: string | null; link?: string | null; fonte: string | null };

// Páginas internas (The Venue, Packages, Stay): mesma estrutura para as três, na ordem da
// página About do modelo — hero · apresentação · 3 legendas · bloco da página (seção da home
// + detalhes) · prova social · Check Your Date. Ver docs/VENUE-TEMPLATE.md, §4.1.
export type Pagina = {
  enabled: boolean;
  href: string;
  // nome no breadcrumb e no menu
  nome: string;
  // link da seção correspondente da home para a página ("Explore the venue →")
  link_home: string;
  // H1: 1 frase curta, só na sans (máx. 5 palavras)
  titulo: string;
  subtitulo: string;
  foto: Foto;
  apresentacao: { eyebrow: string; titulo: string; texto: string[] };
  // 3 legendas curtas em mono (10–20 palavras, 1 fato cada), sem foto
  legendas: string[];
  // índice em depoimentos (null = só os selos)
  depoimento: number | null;
  seo: { titulo: string; descricao: string };
};

// ---------------------------------------------------------------------------
// Helpers do template
// ---------------------------------------------------------------------------

const campo = <T,>(valor: T | null, fonte: string | null = null, confianca: Confianca = null): Campo<T> => ({
  valor,
  fonte,
  confianca,
});

// foto real do venue em public/venue (fonte = arquivo da captura em fotos/originais).
// Exportado: no template nenhuma foto foi escolhida e o helper fica sem uso.
export const foto = (
  arquivo: string,
  alt: string,
  fonte: string,
  descricao: string,
  formato: MidiaSpec["formato"],
  minimo = "1200px",
): Foto => ({
  valor: `/venue/${arquivo}.jpg`,
  fonte,
  confianca: "alta",
  alt,
  placeholder: { tipo: "foto", descricao, formato, minimo },
});

// foto ainda não escolhida: placeholder de mídia no lugar
const semFoto = (descricao: string, formato: MidiaSpec["formato"] = "horizontal", minimo = "2400px"): Foto => ({
  valor: null,
  fonte: null,
  confianca: null,
  alt: "",
  placeholder: { tipo: "foto", descricao, formato, minimo },
});

// Placeholders da §4 do VENUE-TEMPLATE, texto exato. O modo guia mostra o texto inteiro.
export const placeholders = {
  oferta:
    '[PLACEHOLDER] Oferta com prazo real — ex.: "Fall dates from $X · Oct–Nov only". Some se não houver oferta.',
  header: "[LOGO] · botão [Schedule a Tour]",
  heroTitulo:
    "[PLACEHOLDER] H1 de 1 frase, na serif: elegante como uma frase de revista, com a busca do casal dentro = casamento/wedding + o tipo de lugar mais específico que for verdade + cidade + estado (ex.: \"Barn weddings in the hills of Knoxville, Tennessee\" · \"Casamentos na fazenda em Atibaia, São Paulo\"). 5 a 9 palavras, sem clichê e sem cara de lista de palavras-chave.",
  heroVideos:
    "[PLACEHOLDER] Opcional: 4 clipes de 5s do venue (MP4 + WebM + poster), desktop 1280x720 < 2,5 MB e mobile 720x1280 < 1,5 MB, em public/video/hero/desktop e /mobile. Sem vídeo, fica a foto. Gerar com tools/hero-video/.",
  heroLegenda:
    "[PLACEHOLDER] Opcional, por clipe: legenda de 2 a 5 palavras do que o clipe mostra (ex.: \"The pavilion at dusk\"), em mono no canto do hero enquanto ele toca.",
  aberturaNome:
    "[PLACEHOLDER] Nome na abertura: curto (1 a 3 palavras, o nome pelo qual o venue é chamado) e onde ele se divide para a janela abrir entre as partes. Sem nome, usa o do logo e divide na palavra do meio.",
  heroSubtitulo:
    '[PLACEHOLDER] Opcional (padrão: sem subtítulo). 1 frase com lugar + capacidade ou área. Ex.: "A 55-acre estate for up to 300 guests, 20 minutes from downtown."',
  fatos:
    "[PLACEHOLDER] 3 a 5 números verificáveis: capacidade · acres · ano de fundação · nº de hospedagens · distância da cidade.",
  historia:
    "[PLACEHOLDER] Parágrafo de apresentação do venue em 3–4 frases: de onde veio o lugar (história real), o que o casal sente ao chegar, e o diferencial concreto. Tom editorial, sem clichês. Termina puxando para o CTA.",
  espacosTitulo: '[PLACEHOLDER] Título que resume o conjunto — ex.: "One property, every moment."',
  espacoCard:
    "[PLACEHOLDER] Nome do espaço · USO (CERIMÔNIA / RECEPÇÃO / FOTOS / PREPARAÇÃO) · 2 frases sobre como é estar ali · tags: Indoor, Outdoor, Rain plan, capacidade.",
  fimDeSemana:
    '[PLACEHOLDER] 3 cards em sequência temporal: Antes (ensaio, arrumação, chegada) · O dia (cerimônia, recepção, equipe) · Depois (noite no local, café, check-out). Cada card: título curto + 1 frase + itens reais incluídos. 4º card: "See what\'s included →".',
  pacotesTitulo: '[PLACEHOLDER] Título + preço de entrada — ex.: "Packages from $X".',
  pacoteCard:
    '[PLACEHOLDER] Nome do pacote · preço "a partir de" (ou "Pricing on your tour") · para quem é · 4–6 incluídos mais valiosos primeiro.',
  hospedagem:
    '[PLACEHOLDER] Título sobre ficar no local + 1 frase. Cards: nome da hospedagem · "SLEEPS X" em mono · 1 frase de uso (noivas se arrumando, suíte de lua de mel, família).',
  depoimento:
    '[PLACEHOLDER] Depoimento real, cortado na frase mais forte (máx. 35 palavras). Nome + "MARRIED MÊS ANO" se houver.',
  processo:
    "[PLACEHOLDER] 3 passos do primeiro contato ao dia: 01 Consulta (quem responde e em quanto tempo) · 02 Visita (presencial/virtual) · 03 O fim de semana.",
  faq: "[PLACEHOLDER] 6–8 perguntas reais do venue, na ordem das objeções mais comuns. Resposta em 1–3 frases, com o número exato quando existir.",
  galeria:
    "[PLACEHOLDER] 8–12 fotos reais: cerimônia, recepção à noite, detalhes, casal, espaço vazio de dia. Nada de banco de imagens.",
  comoChegar:
    "[PLACEHOLDER] Título curto sobre chegar ao venue + 1 frase. 3 a 5 tempos de carro verificáveis (\"20 MIN · DOWNTOWN\"), incluindo o aeroporto mais próximo. Endereço completo + link do Google Maps.",
  comoChegarHospedagem:
    "[PLACEHOLDER] 1 frase sobre a hospedagem no próprio venue + hotéis ou cidades próximas, só se o venue citar.",
  checarTitulo: '[PLACEHOLDER] Chamada direta para checar a data — ex.: "Is your date still open?"',
  checarApoio: "[PLACEHOLDER] 1 frase sobre quem responde e em quanto tempo (só se for verdade).",
  // card Schedule a Tour
  tourObrigado:
    "[PLACEHOLDER] 1 frase calorosa e honesta depois do envio: recebemos, vamos combinar a visita. Nunca \"booked\" ou \"confirmed\".",
  tourFotoTitulo:
    "[PLACEHOLDER] Título sobre esta foto do card (uma por foto, diferentes entre si): a vontade do venue de receber o casal para a visita, em 2 linhas curtas (máx. 6 palavras). Ex.: \"We'd love to show you around.\"",
  tourQuemResponde: "[PLACEHOLDER] Quem responde (ex.: \"our Venue Director\", \"Sarah\"), só se for verdade.",
  // páginas internas
  paginaTitulo:
    "[PLACEHOLDER] H1 de 1 frase curta, só na sans (sem 2ª linha em serif): o assunto da página com o dado que mais pesa. Máx. 5 palavras.",
  paginaSubtitulo:
    "[PLACEHOLDER] ~40 palavras sobre o que o casal encontra nesta página, com os números reais do assunto (capacidade, preço de entrada, nº de hospedagens). Sem clichês.",
  paginaApresentacaoTitulo: "[PLACEHOLDER] Título curto com o argumento central da página.",
  paginaApresentacao:
    "[PLACEHOLDER] ~120 palavras em 2 parágrafos, só com fatos do venue.json (história, diferencial, o que está incluído, como funciona). Tom editorial, sem clichês. Termina puxando para o tour.",
  paginaLegenda:
    "[PLACEHOLDER] Legenda de 10–20 palavras: 1 fato real e concreto do assunto da página (espaço, item incluído, horário).",
  paginaDescricao:
    "[PLACEHOLDER] Meta description da página: cidade + assunto + 1 número real. Máx. 155 caracteres.",
};

const espaco = (selo: string | null = null): Espaco => ({
  nome: "[PLACEHOLDER] Nome do espaço",
  uso: "[USO: CERIMÔNIA / RECEPÇÃO / FOTOS / PREPARAÇÃO]",
  descricao: "[PLACEHOLDER] 2 frases sobre como é estar ali.",
  capacidade: "[Capacidade]",
  tags: ["[Indoor]", "[Outdoor]", "[Rain plan]"],
  selo,
  foto: semFoto("espaço", "vertical", "1600px"),
  descricao_completa: "[PLACEHOLDER] Página The Venue: descrição inteira do espaço, 2–3 frases com os fatos (uso, capacidade, o que tem).",
  so_na_pagina: false,
  fonte: null,
  confianca: null,
});

const pacote = (): Pacote => ({
  nome: "[PLACEHOLDER] Nome do pacote",
  preco: '[PLACEHOLDER] Preço "a partir de" (ou "Pricing on your tour")',
  para_quem: "[PLACEHOLDER] Para quem é.",
  inclui: [
    "[PLACEHOLDER] Incluído mais valioso",
    "[Incluído 2]",
    "[Incluído 3]",
    "[Incluído 4]",
    "[Incluído 5]",
    "[Incluído 6]",
  ],
  destaque: false,
  convidados: null,
  fonte: null,
  confianca: null,
});

const hospedagem = (): Hospedagem => ({
  nome: "[PLACEHOLDER] Nome da hospedagem",
  dorme: "[X]",
  no_local: true,
  descricao: "[PLACEHOLDER] 1 frase de uso (noivas se arrumando, suíte de lua de mel, família).",
  foto: semFoto("hospedagem", "horizontal", "1600px"),
  link_reserva: null,
  fonte: null,
  confianca: null,
});

const depoimento = (destaque = false): Depoimento => ({
  nome: "[Nome]",
  data: "[MARRIED MÊS ANO]",
  texto: "[PLACEHOLDER] Depoimento real, cortado na frase mais forte (máx. 35 palavras).",
  destaque,
  fonte: null,
});

// ordem das objeções (§4, FAQ): capacidade → preço → bebida → chuva → horário → fornecedores → pets → estacionamento
const pergunta = (assunto: string, tema: TemaFaq): Pergunta => ({
  pergunta: `[PLACEHOLDER] Pergunta real sobre ${assunto}`,
  resposta: "[PLACEHOLDER] Resposta em 1–3 frases, com o número exato quando existir.",
  tema,
  fonte: null,
});

// página interna ainda sem conteúdo: todos os textos são placeholders de instrução.
// Exportado: no cliente as páginas recebem conteúdo e o helper fica sem uso.
export const paginaTemplate = (
  href: string,
  nome: string,
  link_home: string,
  depoimento: number,
  foto: string,
): Pagina => ({
  enabled: true,
  href,
  nome,
  link_home,
  titulo: "[Assunto da página]",
  subtitulo: placeholders.paginaSubtitulo,
  foto: semFoto(foto),
  apresentacao: { eyebrow: nome, titulo: placeholders.paginaApresentacaoTitulo, texto: [placeholders.paginaApresentacao] },
  legendas: [placeholders.paginaLegenda, placeholders.paginaLegenda, placeholders.paginaLegenda],
  depoimento,
  seo: { titulo: nome, descricao: placeholders.paginaDescricao },
});

// ---------------------------------------------------------------------------
// Conteúdo
// ---------------------------------------------------------------------------

export const site = {
  slug: "template",

  // idioma e país do site: <html lang>, datas do card Schedule a Tour, <title> e endereço do JSON-LD.
  // EUA: en-US / US / "Wedding Venue in". Brasil: pt-BR / BR / "Espaço para Casamento em".
  idioma: {
    lang: "en-US",
    pais: "US",
    titulo_seo: "Wedding Venue in",
  },

  // canal do "Text us" (header, menu, barra mobile, footer, card): "sms" = link sms:;
  // "whatsapp" = wa.me com a mensagem abaixo já escrita (null = conversa em branco)
  contato: {
    canal: "sms" as "sms" | "whatsapp",
    mensagem: null as string | null,
  },

  // =====================  dados do venue (venue.json)  =====================

  identidade: {
    nome: campo("[NOME DO VENUE]"),
    cidade: campo("[CIDADE]"),
    estado: campo("[UF]"),
    site: campo<string>(null),
    email: campo("[E-MAIL]"),
    // usado nos links tel: e sms: ("Text us")
    telefone: campo("[TELEFONE]"),
    contato_preferido: campo<string>(null),
    endereco: campo("[ENDEREÇO COMPLETO]"),
    instagram: campo("#"),
    facebook: campo("#"),
    // caminho do logo; null = nome em texto (secoes.header.fonte_nome)
    logo: campo<string>(null),
    // versão clara do logo, para foto ou fundo escuro (header transparente, footer); null = usa o logo
    logo_claro: campo<string>(null),
    // texto do logo quando não há arquivo (ex.: nome curto); null = identidade.nome
    nome_logo: campo<string>(null),
    // quem responde o pedido de visita, na frase "<quem> will reach out soon" do card Schedule a Tour
    // (ex.: "our Venue Director", "Sarah"); null = "We'll reach out soon."
    quem_responde: campo(placeholders.tourQuemResponde),
  },

  oferta: {
    valor: campo(placeholders.oferta),
    validade: campo<string>(null),
  },

  hero: {
    claim_do_venue: campo<string>(null),
    // legenda do canto: CIDADE — UF / região
    regiao: campo("[região]"),
    foto: semFoto("vista principal do venue", "horizontal", "2400px"),
    // clipes em sequência, na ordem (VENUE-TEMPLATE §2); [] = só a foto
    videos: [] as ClipeHero[],
    // H1 da home: 1 frase na serif, elegante, com a busca do casal (casamento + tipo de lugar + cidade + estado). 5 a 9 palavras.
    titulo: campo(placeholders.heroTitulo),
    // opcional: 1 frase abaixo do H1; null = sem subtítulo (padrão, o H1 fica sozinho)
    subtitulo: campo<string>(null),
  },

  numeros: {
    capacidade_max: campo<number | string>("[000]"),
    capacidade_sentados: campo<number | string>(null),
    acres: campo<number | string>("[00]"),
    ano_fundacao: campo<number | string>("[ANO]"),
    distancia_cidade: campo<number | string>("[00 MIN]"),
    // nº de hospedagens para a faixa de números; null = conta as hospedagens no_local
    hospedagens: campo<number | string>(null),
  },

  espacos: [espaco("[DIFERENCIAL Nº 1]"), espaco(), espaco(), espaco()] as Espaco[],

  pacotes: [pacote(), pacote(), pacote()] as Pacote[],
  preco_a_partir_de: campo<string>(null),
  adicionais: [
    { item: "[PLACEHOLDER] Adicional real — ex.: heaters", preco: "[PREÇO]", fonte: null },
    { item: "[Adicional]", preco: "[PREÇO]", fonte: null },
    { item: "[Adicional]", preco: "[PREÇO]", fonte: null },
    { item: "[Adicional]", preco: "[PREÇO]", fonte: null },
    { item: "[Adicional]", preco: null, fonte: null },
  ] as Adicional[],

  inclusos: [] as Campo[],
  nao_inclusos: [] as Campo[],
  inventario: {
    mesas: campo<string>(null),
    cadeiras: campo<string>(null),
    bancos: campo<string>(null),
  },

  politicas: {
    bebida: campo<string>(null),
    horario_fim: campo<string>(null),
    som: campo<string>(null),
    plano_chuva: campo<string>(null),
    estacionamento: campo<string>(null),
    fornecedores: campo<string>(null),
    animais: campo<string>(null),
  },

  hospedagem: [hospedagem(), hospedagem(), hospedagem(), hospedagem()] as Hospedagem[],
  // selo opcional da hospedagem (ex.: prêmio real); null = não aparece
  hospedagem_selo: campo<string>(null),

  // Getting Here: tempos de carro a partir de identidade.endereco (3 a 5, com o aeroporto mais próximo)
  como_chegar: {
    destinos: [
      { destino: "[Centro da cidade]", tempo: "[00 min]", fonte: null, confianca: null },
      { destino: "[Aeroporto mais próximo]", tempo: "[00 min]", fonte: null, confianca: null },
      { destino: "[Cidade ou atração próxima]", tempo: "[00 min]", fonte: null, confianca: null },
    ] as Destino[],
    // hotéis ou cidades próximas que o próprio venue cita; vazio = a linha some
    proximos: [campo("[Hotéis em cidade próxima]")] as Campo[],
  },

  // null = fallback padrão Inquire → Tour → Book (secoes.processo.fallback)
  processo: [
    campo("[PLACEHOLDER] Consulta: quem responde e em quanto tempo."),
    campo("[PLACEHOLDER] Visita: presencial ou virtual."),
    campo("[PLACEHOLDER] O fim de semana."),
  ] as Campo[] | null,

  faq: [
    pergunta("capacidade", "capacidade"),
    pergunta("preço", "preco"),
    pergunta("bebida", "bebida"),
    pergunta("chuva", "chuva"),
    pergunta("horário", "horario"),
    pergunta("fornecedores", "fornecedores"),
    pergunta("pets", "pets"),
    pergunta("estacionamento", "estacionamento"),
  ] as Pergunta[],

  historia: {
    origem: campo<string>(null),
    donos: campo<string>(null),
    diferencial: campo<string>(null),
  },

  depoimentos: [depoimento(true), depoimento(), depoimento()] as Depoimento[],

  imprensa: [
    { nome: "[Publicação]", logo: null, link: null, fonte: null },
    { nome: "[Publicação]", logo: null, link: null, fonte: null },
    { nome: "[Publicação]", logo: null, link: null, fonte: null },
    { nome: "[Publicação]", logo: null, link: null, fonte: null },
  ] as Imprensa[],

  galeria: {
    mapa: null as string | null,
    // alturas iguais, larguras variadas: o formato decide a largura de cada foto
    fotos: [
      semFoto("cerimônia", "horizontal", "1200px"),
      semFoto("detalhe", "vertical", "1200px"),
      semFoto("recepção à noite", "horizontal", "1200px"),
      semFoto("casal", "vertical", "1200px"),
      semFoto("espaço vazio de dia", "horizontal", "1200px"),
      semFoto("detalhe", "quadrada", "1200px"),
      semFoto("mesa posta", "horizontal", "1200px"),
      semFoto("casal", "vertical", "1200px"),
      semFoto("vista do venue", "horizontal", "1200px"),
      semFoto("pista de dança", "quadrada", "1200px"),
    ],
  },

  modulos: {
    outros_eventos: campo<string>(null),
  },

  // =====================  seções: liga/desliga + copy de seção  =====================

  // CTA primário do site inteiro (§1): header, hero, mobile bar, footer. "/?tour" abre o card
  // Schedule a Tour (TourProvider intercepta todo link com esse href; lib/tour.ts, TOUR_HREF)
  cta: { label: "Schedule a Tour", href: "/?tour" } as Link,

  secoes: {
    anuncio: {
      enabled: true,
      link: { label: "Check your date", href: "/?tour" } as Link,
    },
    header: {
      enabled: true,
      // cada link some junto com a seção que ele aponta
      nav: [
        // pagina: com a página interna ligada, o link vai para ela; senão, para a âncora da home
        { label: "The Venue", href: "/#the-venue", secao: "historia", pagina: "the_venue" },
        { label: "Packages", href: "/#packages", secao: "pacotes", pagina: "packages" },
        { label: "Stay", href: "/#stay", secao: "hospedagem", pagina: "stay" },
        { label: "FAQ", href: "/#faq", secao: "faq" },
      ] as { label: string; href: string; secao: string; pagina?: string }[],
      text_us: "Text us",
      menu: "Menu",
      // fonte do nome em texto no lugar do logo: "serif" (padrão) ou "sans"
      fonte_nome: "serif" as "serif" | "sans",
    },
    // abertura "A Janela" da home, na 1ª visita da sessão: o nome se abre ao meio e uma janela
    // com o clipe 1 do hero cresce até virar o hero; nas páginas internas, só a entrada do título
    abertura: {
      enabled: true,
      // nome grande na serif; null = identidade.nome_logo (ou identidade.nome)
      nome: null as string | null,
      // onde o nome se divide: o começo dele (ex.: "Willow" em "Willow Creek");
      // null = na palavra do meio (nome de uma palavra: no meio das letras)
      divisao: null as string | null,
    },
    hero: {
      enabled: true,
      // o primário é o site.cta
      secundario: { label: "See Packages", href: "#packages" } as Link,
    },
    fatos: {
      enabled: true,
      rotulos: {
        capacidade_max: "Guests",
        capacidade_sentados: "Seated",
        acres: "Acres",
        ano_fundacao: "Established",
        distancia_cidade: "From downtown",
        hospedagens: "Stays on site",
      },
    },
    historia: {
      enabled: true,
      texto: placeholders.historia,
      // "Our Story →" se houver página; senão o CTA
      link: { label: "Schedule a Tour →", href: "/?tour" } as Link,
    },
    espacos: {
      enabled: true,
      eyebrow: "The Spaces",
      titulo: placeholders.espacosTitulo,
      link: { label: "Schedule a Tour →", href: "/?tour" } as Link,
      ver: "Tour it",
      // página The Venue: título da lista com todos os espaços, abaixo da seção da home
      todos: "Every space, in detail",
    },
    fim_de_semana: {
      enabled: true,
      titulo: "Your Wedding Weekend",
      cards: [
        {
          momento: "Before",
          titulo: "[PLACEHOLDER] Título curto",
          frase: "[PLACEHOLDER] 1 frase sobre ensaio, arrumação, chegada.",
          itens: ["[Item incluído]", "[Item incluído]", "[Item incluído]"],
          foto: semFoto("arrumação ou ensaio", "vertical", "1600px"),
          // loop por cima da foto (null = só a foto)
          video: null as LoopSecao | null,
        },
        {
          momento: "The Day",
          titulo: "[PLACEHOLDER] Título curto",
          frase: "[PLACEHOLDER] 1 frase sobre cerimônia, recepção, equipe.",
          itens: ["[Item incluído]", "[Item incluído]", "[Item incluído]"],
          foto: semFoto("cerimônia", "vertical", "1600px"),
          // loop por cima da foto (null = só a foto)
          video: null as LoopSecao | null,
        },
        {
          momento: "After",
          titulo: "[PLACEHOLDER] Título curto",
          frase: "[PLACEHOLDER] 1 frase sobre noite no local, café, check-out.",
          itens: ["[Item incluído]", "[Item incluído]", "[Item incluído]"],
          foto: semFoto("manhã seguinte", "vertical", "1600px"),
          // loop por cima da foto (null = só a foto)
          video: null as LoopSecao | null,
        },
      ],
      final: { label: "See what's included →", href: "#packages" } as Link,
    },
    pacotes: {
      enabled: true,
      titulo: placeholders.pacotesTitulo,
      sem_preco: "Pricing on your tour",
      mais: "more",
      botao: "Check This Date",
      selo: "Most chosen",
      adicionais: "Add-ons",
      // acordeão com a lista completa de adicionais, na própria seção
      adicionais_abrir: "See all add-ons",
      // blocos só da página Packages
      pagina: {
        oferta: "Limited offer",
        // título da grade com a lista completa, abaixo da seção da home
        completo: "Everything in each package",
        nao_incluso: "Not included",
        faq_titulo: "Price, drinks and guest count",
        // perguntas do FAQ que a página repete, pelo tema
        faq_temas: ["preco", "bebida", "capacidade"] as TemaFaq[],
      },
    },
    hospedagem: {
      enabled: true,
      titulo: "[PLACEHOLDER] Título sobre ficar no local",
      texto: "[PLACEHOLDER] 1 frase.",
      dorme: "Sleeps",
      grupos: { no_local: "Also on site", proximo: "Nearby", sem_dado: "More places to stay" },
      reservar: "Book",
    },
    depoimentos: {
      enabled: true,
      titulo: "Love Notes",
    },
    processo: {
      enabled: true,
      eyebrow: "How It Works",
      titulo: "Three steps to your date",
      foto: semFoto("venue em luz de fim de tarde", "horizontal", "2400px"),
      // loop por cima da foto (null = só a foto)
      video: null as LoopSecao | null,
      fallback: ["Inquire", "Tour", "Book"],
    },
    faq: {
      enabled: true,
      titulo: "Good to know",
    },
    // opcional; precisa de identidade.endereco
    como_chegar: {
      enabled: true,
      eyebrow: "Getting Here",
      titulo: "[PLACEHOLDER] Título curto sobre chegar ao venue",
      texto: "[PLACEHOLDER] 1 frase: o que fica perto e em quanto tempo.",
      mapa_link: "Open in Google Maps",
      mapa_titulo: "Map",
      hospedagem: {
        titulo: "Where guests stay",
        texto: placeholders.comoChegarHospedagem,
        link: { label: "See places to stay →", href: "#stay" } as Link,
      },
    },
    galeria: {
      enabled: true,
      titulo: "Gallery",
      // abre a lightbox com todas as fotos; só aparece com mais de 12 (a faixa mostra 12)
      link: "See the full gallery →",
    },
    checar_data: {
      enabled: true,
      titulo: placeholders.checarTitulo,
      apoio: placeholders.checarApoio,
      foto: semFoto("venue ao entardecer", "horizontal", "2400px"),
    },
    // card Schedule a Tour (components/tour/): aberto por todo CTA do site, em 3 páginas —
    // quando + convidados · contato · obrigado. É o CTA do site: não desligar.
    tour: {
      enabled: true,
      titulo: "Schedule a Tour",
      // fotos ao lado do formulário (768px ou mais; no celular o card fica só com o formulário),
      // em loop de 4s com tracinhos; cada uma com o seu título em branco por cima.
      // [] = card sem foto; 1 foto = fixa, sem tracinhos
      fotos: [
        { foto: semFoto("interior do venue", "vertical", "1200px"), titulo: placeholders.tourFotoTitulo },
        { foto: semFoto("casal no venue", "vertical", "1200px"), titulo: placeholders.tourFotoTitulo },
        { foto: semFoto("recepção ao entardecer", "vertical", "1200px"), titulo: placeholders.tourFotoTitulo },
      ] as { foto: Foto; titulo: string }[],
      quando: "When are you thinking?",
      // estações depois dos próximos 4 meses: primavera, verão, outono, inverno
      estacoes: ["Spring", "Summer", "Fall", "Winter"] as [string, string, string, string],
      flexivel: "Still flexible",
      convidados: "How many guests?",
      // 1ª faixa: "Under 50"
      abaixo: "Under",
      continuar: "Continue",
      contato: "Where can we reach you?",
      campos: { nome: "Name", email: "Email", telefone: "Phone" },
      erros: {
        nome: "Please add your name.",
        email: "Please check your email address.",
        telefone: "Please add a phone number we can text.",
        envio: "Something went wrong. Please try again, or text us.",
      },
      voltar: "Back",
      enviar: "Send",
      enviando: "Sending…",
      // página 3; {nome} = primeiro nome de quem enviou
      obrigado: {
        titulo: "Thank you, {nome}.",
        texto: placeholders.tourObrigado,
        // "<identidade.quem_responde> will reach out soon." / sem quem_responde:
        retorno: "will reach out soon.",
        retorno_sem_nome: "We'll reach out soon.",
        // + telefone (sms:)
        mensagem: "For the quickest reply, text",
        convidados: "guests",
      },
      fechar: "Back to the site",
      recomecar: "Start over",
      rotulo_fechar: "Close",
      // barra de status na base do card
      progresso: "Progress",
    },
    footer: {
      enabled: true,
      // último link grande: abre o card Schedule a Tour
      checar: { label: "Check Your Date", href: "/?tour" } as Link,
      visite: "Visit",
      contato: "Contact",
      siga: "Follow",
      // bloco opcional; some se imprensa estiver vazia
      imprensa: { enabled: true, label: "As featured in" },
      // null = o crédito some
      credito: { label: "Website by [SUA MARCA]", href: "#" } as Link | null,
      // crédito exigido pela licença gratuita da Skiper UI (cursor dos campos do card); null = some
      creditos_ui: { label: "Interface components by Skiper UI", href: "https://skiper-ui.com" } as Link | null,
    },
    barra_mobile: {
      enabled: true,
      text_us: "Text Us",
    },
  },

  // =====================  páginas internas  =====================
  // hero · apresentação · legendas · bloco da página · prova social · Check Your Date
  paginas: {
    the_venue: paginaTemplate("/the-venue", "The Venue", "Explore the venue →", 0, "o venue inteiro (fachada ou vista aérea)"),
    packages: paginaTemplate("/packages", "Packages", "See all packages →", 1, "recepção montada e cheia"),
    stay: paginaTemplate("/stay", "Stay", "See all stays →", 2, "hospedagem principal por fora"),
  } satisfies Record<string, Pagina>,

  // SEO local (VENUE-TEMPLATE §5). O <title> sai de identidade: "[Nome] | Wedding Venue in [Cidade], [UF]"
  seo: {
    // domínio final do site (canonical e breadcrumbs); null = identidade.site
    url: null as string | null,
    descricao: "[PLACEHOLDER] Meta description com cidade + capacidade + diferencial.",
    // noindex no template e nas demos de venda; false só ao publicar o site do cliente
    noindex: true,
  },

  // rótulos de interface usados por vários componentes
  ui: {
    home: "home",
    breadcrumb: "Breadcrumb",
    breadcrumb_home: "Home",
    nav_principal: "Main",
    nav_atalhos: "Sections",
    nav_footer: "Footer",
    anuncio: "Announcement",
    fatos: "At a glance",
    anterior: "Previous",
    fechar: "Close",
    proximo: "Next",
    carrossel: "carousel",
    slide: "of",
  },
};

export type SecaoId = keyof typeof site.secoes;
export type PaginaId = keyof typeof site.paginas;

// card de stay do modelo, usado pelos espaços (Spaces.tsx converte Espaco → Stay)
export type Stay = {
  name: string;
  location: string;
  description: string;
  href: string;
  tags: { label: string; href?: string }[];
  image: string | null;
  imageLabel?: string;
};
