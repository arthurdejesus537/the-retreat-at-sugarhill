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

export const espaco = (selo: string | null = null): Espaco => ({
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

export const pacote = (): Pacote => ({
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

export const hospedagem = (): Hospedagem => ({
  nome: "[PLACEHOLDER] Nome da hospedagem",
  dorme: "[X]",
  no_local: true,
  descricao: "[PLACEHOLDER] 1 frase de uso (noivas se arrumando, suíte de lua de mel, família).",
  foto: semFoto("hospedagem", "horizontal", "1600px"),
  link_reserva: null,
  fonte: null,
  confianca: null,
});

export const depoimento = (destaque = false): Depoimento => ({
  nome: "[Nome]",
  data: "[MARRIED MÊS ANO]",
  texto: "[PLACEHOLDER] Depoimento real, cortado na frase mais forte (máx. 35 palavras).",
  destaque,
  fonte: null,
});

// ordem das objeções (§4, FAQ): capacidade → preço → bebida → chuva → horário → fornecedores → pets → estacionamento
export const pergunta = (assunto: string, tema: TemaFaq): Pergunta => ({
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

// fonte "site:<página>" = página do site atual do venue (theretreatatsugarhill.com), capturada em 2026-10-08.
// "foto:<arquivo>" = o fato aparece nas fotos publicadas no site (fotos/originais da captura).
const RS = "https://www.theretreatatsugarhill.com";
const F = (n: string) => `fotos/originais/${n}`;

// "What's Already Included" (/weddings) + FAQ, na ordem de valor para o casal
const INCLUI_TODOS = [
  "14-hour rental window, up to 5 hours of ceremony & reception",
  "Up to 150 guests (151–200 for $500)",
  "Lakeside arch or garden gazebo ceremony",
  "Bridal Retreat & Groom's Cabin",
  "Tables, chairs, setup & breakdown by staff",
  "Décor room, photo booth & audio guest book",
];

export const site = {
  slug: "the-retreat-at-sugarhill",

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
    nome: campo("The Retreat at Sugarhill", "site:/", "alta"),
    cidade: campo("Mount Pleasant", "site:rodapé", "alta"),
    estado: campo("TX", "site:rodapé", "alta"),
    site: campo(RS, "site:/", "alta"),
    // o rodapé tem "TheRetreatAtSugarhill..com" e a página de cabanas "thetretreat…" (erros de digitação);
    // o link mailto do header usa este
    email: campo("info@theretreatatsugarhill.com", "site:header (mailto)", "alta"),
    telefone: campo("(903) 921-4320", "site:rodapé, /contact-us", "alta"),
    contato_preferido: campo<string>(null),
    endereco: campo("658 E Farm Road 71, Mount Pleasant, TX 75455", "site:rodapé", "alta"),
    instagram: campo("https://www.instagram.com/theretreatatsugarhill/", "site:rodapé", "alta"),
    facebook: campo("https://www.facebook.com/TheRetreatAtSugarhill", "site:rodapé", "alta"),
    // o logo é largo (galhada + nome em letras finas); a 48px de altura o nome fica ilegível: nome em texto
    logo: campo<string>(null),
    logo_claro: campo<string>(null),
    nome_logo: campo("The Retreat at Sugarhill", "site:/ (logo)", "alta"),
    // o site não diz quem responde
    quem_responde: campo<string>(null),
  },

  // desconto real com período: "Jan/Feb, Jul/Aug Special: $350 off" em todas as tarifas (/weddings)
  oferta: {
    valor: campo("Jan–Feb & Jul–Aug weddings: $350 off", "site:/weddings (Jan/Feb, Jul/Aug Special: $350 off)", "alta"),
    validade: campo<string>(null),
  },

  hero: {
    claim_do_venue: campo("A waterfront wedding venue on 53 acres in Mount Pleasant, Texas", "site:/", "alta"),
    // legenda do canto: CIDADE — UF / região
    regiao: campo("East Texas", "site:/", "alta"),
    foto: foto(
      "aerial-pond-and-venue",
      "The white hall, the lakeside arch and the fire-pit pergola among oaks, seen from across the pond",
      F("052__9d8d5f_878839dedc924d54a0efc00bc826ca00~mv2.jpg"),
      "vista do lago",
      "horizontal",
      "5464px",
    ),
    // celular: o salão e o arco ficam à direita do centro
    foco_mobile: "60% 50%" as string | null,
    videos: [] as ClipeHero[],
    titulo: campo("Lakeside weddings on 53 acres in Mount Pleasant, Texas", "site:/ (waterfront, 53 acres, Mount Pleasant)", "alta"),
    subtitulo: campo<string>(null),
  },

  numeros: {
    capacidade_max: campo<number | string>(200, "site:/, /faq", "alta"),
    capacidade_sentados: campo<number | string>(null),
    acres: campo<number | string>(53, "site:/", "alta"),
    // o venue não informa o ano de abertura; o campo leva a área do salão (rótulo em secoes.fatos)
    ano_fundacao: campo<number | string>("5,250", "site:/faq (Venue 5,250 sq. ft.)", "alta"),
    // o site só dá "1 hr from either Texarkana or Longview" (vai para Getting Here); sem número da cidade
    distancia_cidade: campo<number | string>(null),
    hospedagens: campo<number | string>(3, "site:/ (Yes, 3 cabins are available)", "alta"),
  },

  espacos: [
    {
      nome: "The Reception Hall",
      uso: "Reception",
      descricao:
        "Pine walls, a vaulted ceiling and a wall of windows onto the grounds. The climate-controlled hall is 5,250 sq ft and holds up to 200.",
      capacidade: "Up to 200",
      tags: ["Indoor", "Climate-controlled"],
      selo: "5,250 sq ft",
      foto: foto(
        "reception-hall-tables",
        "The pine-paneled reception hall set with farmhouse tables under a vaulted ceiling",
        F("056__9d8d5f_4854a7711fae44f885847400ec208544~mv2.jpg"),
        "salão",
        "vertical",
        "7009px",
      ),
      descricao_completa:
        "A 5,250 sq ft climate-controlled hall with pine walls, a vaulted ceiling, ceiling fans and tall windows onto the lawn. Tables for up to 200 guests and 200 chairs are included, along with the venue's farmhouse tables and a one-of-a-kind cake table, set up and broken down by the staff.",
      fonte: "site:/, /faq, /weddings (foto: /weddings)",
      confianca: "alta",
    },
    {
      nome: "Lakeside Arch",
      uso: "Ceremony",
      descricao: "A white A-frame arch at the edge of the four-acre lake, with the aisle running down to the water.",
      capacidade: null,
      tags: ["Outdoor", "Waterfront"],
      foto: foto(
        "lakeside-arch-ceremony",
        "Rows of white chairs facing the white A-frame ceremony arch at the edge of the lake",
        F("005__9d8d5f_e97262e2ac19432f9619cf70943bbc4f~mv2.jpg"),
        "arco no lago",
        "horizontal",
        "9311px",
      ),
      descricao_completa:
        "Exchange your vows beneath the ceremony arch overlooking the four-acre lake. In the fall, the color of the trees reflects across the water behind you.",
      fonte: "site:/weddings (The Arch Ceremony, Fall Lakeside Arch), /about-us (four-acre lake)",
      confianca: "alta",
    },
    {
      nome: "Garden Gazebo",
      uso: "Ceremony",
      descricao: "Walk in through the garden doors toward a white gazebo overlooking the lake.",
      capacidade: null,
      tags: ["Outdoor", "Waterfront", "Covered"],
      foto: foto(
        "garden-doors-gazebo",
        "Open white garden doors framing an aisle that leads to the white gazebo by the lake",
        F("026__9d8d5f_e72d661d55534752a04eede81be64b03~mv2.jpg"),
        "gazebo",
        "horizontal",
        "9504px",
      ),
      descricao_completa:
        "Make your entrance through the garden doors and walk toward the gazebo beside the lake. It is the second of the two outdoor ceremony sites.",
      fonte: "site:/weddings (Garden Gazebo, Garden Gazebo Ceremony Entrance)",
      confianca: "alta",
    },
    {
      nome: "The Bridal Retreat",
      uso: "Getting ready",
      descricao: "Hair and makeup stations, comfortable seating and natural light for the bride and her closest friends.",
      capacidade: null,
      tags: ["Indoor", "Vanities", "Natural light"],
      foto: foto(
        "bridal-retreat-vanities",
        "White vanity stations with arched mirrors and a chandelier in the Bridal Retreat",
        F("041__9d8d5f_bbd605be17254dd6b9c40a7593abd35c~mv2.jpg"),
        "bridal retreat",
        "vertical",
        "2252px",
      ),
      descricao_completa:
        "A private space for the bride and her bridal party, with spacious hair and makeup stations, comfortable seating and natural light. Some packages add two hours of early access.",
      fonte: "site:/weddings (The Bridal Retreat; 2-hour Early Bridal Suite Access)",
      confianca: "alta",
    },
    {
      nome: "The Groom's Cabin",
      uso: "Getting ready",
      descricao: "A private cabin with a living room, a full kitchen and a bathroom with a shower.",
      capacidade: null,
      tags: ["Indoor", "Private", "Full kitchen"],
      foto: foto(
        "grooms-cabin-living",
        "Pine walls and floors in the Groom's Cabin, with a sofa, dining table and kitchen",
        F("035__9d8d5f_6247e08e0d364b27850b66f70c5bf7b1~mv2.jpg"),
        "cabana do noivo",
        "vertical",
        "2252px",
      ),
      descricao_completa:
        "A comfortable, private cabin for the groom and groomsmen to relax and get ready, with a living room with TV and fireplace, a full kitchen with dining area and a bathroom with a shower.",
      fonte: "site:/weddings (The Groom's Cabin; legendas das fotos)",
      confianca: "alta",
    },
    {
      nome: "Swing & Fire Pit Patio",
      uso: "Cocktails & evening",
      descricao: "Hanging swings around a fire pit under a white pergola, a few steps from the hall.",
      capacidade: null,
      tags: ["Outdoor", "Fire pit"],
      foto: foto(
        "swing-fire-pit",
        "Hanging swings circling a fire pit under a white pergola, framed by tall grasses",
        F("010__250932_b15e2b7f3d894bc59cf0e662094c70e6~mv2.jpg"),
        "fogueira",
        "horizontal",
        "2048px",
      ),
      descricao_completa:
        "The signature swing-and-fire-pit social patio, with swings hanging from a white pergola around the fire, for cocktail hour and late-night conversations.",
      fonte: "site:/weddings (signature swing-and-firepit + social patio), /about-us",
      confianca: "alta",
    },
    {
      nome: "Cocktail Patio",
      uso: "Cocktail hour",
      descricao: "A stone patio along the side of the hall, looking out to the lake.",
      capacidade: null,
      tags: ["Outdoor", "Patio"],
      foto: foto(
        "stone-patio-hall",
        "A round stone patio beside the hall's tall windows, with the lake behind the trees",
        F("118__250932_c5fe56adb9cc4b87812dd8d1fc960265~mv2.jpg"),
        "pátio",
        "horizontal",
        "2048px",
      ),
      descricao_completa: "Cocktail hour patio space beside the hall, with views toward the water.",
      so_na_pagina: true,
      fonte: "site:/weddings (meta: cocktail hour patio space)",
      confianca: "media",
    },
    {
      nome: "The Chapel (coming soon)",
      uso: "Ceremony",
      descricao: "A new waterside chapel with a cathedral ceiling, now under construction.",
      capacidade: null,
      tags: ["Indoor", "Waterfront", "Coming soon"],
      descricao_completa:
        "Under construction now: a chapel positioned to face the water, with a soaring cathedral ceiling and a 16-foot entry vestibule with sliding doors for the wedding party's entrance.",
      so_na_pagina: true,
      fonte: "site:/weddings (The Chapel - Coming Soon)",
      confianca: "alta",
    },
  ] as Espaco[],

  // /weddings, "Investment": aluguel por dia, janela de 14 h, até 150 convidados
  pacotes: [
    {
      nome: "Weekday",
      preco: "$2,900",
      para_quem: "Monday, Tuesday or Wednesday, with the same venue and inclusions.",
      inclui: INCLUI_TODOS,
      destaque: false,
      convidados: 150,
      fonte: "site:/weddings",
      confianca: "alta",
    },
    {
      nome: "Friday or Sunday",
      preco: "From $3,800",
      para_quem: "Sunday $3,800 · Friday $4,000.",
      inclui: INCLUI_TODOS,
      destaque: false,
      convidados: 150,
      fonte: "site:/weddings",
      confianca: "alta",
    },
    {
      nome: "Saturday",
      preco: "$4,800",
      para_quem: "The classic Saturday wedding.",
      inclui: INCLUI_TODOS,
      destaque: false,
      convidados: 150,
      fonte: "site:/weddings",
      confianca: "alta",
    },
    {
      nome: "Two-Day Weekend",
      preco: "From $5,625",
      para_quem: "Thu–Fri $5,625 · Fri–Sat $7,800. Set up and host the rehearsal dinner the day before.",
      inclui: [
        "Arrive the day before to set up",
        "Host your rehearsal dinner on site",
        "Overnight lodging",
        "Wake up with everything already arranged",
        ...INCLUI_TODOS,
      ],
      // o site chama de "MOST POPULAR ADD-ON"
      destaque: true,
      convidados: 150,
      fonte: "site:/weddings (Turn Your Wedding Into a Two-Day Experience)",
      confianca: "alta",
    },
  ] as Pacote[],
  preco_a_partir_de: campo("$2,900", "site:/weddings", "alta"),
  adicionais: [
    { item: "Guests 151–200", preco: "$500", fonte: "site:/weddings" },
    {
      item: "Simply Sugarhill: rehearsal & ceremony coordination, DJ, bartender, Titus County security",
      preco: null,
      fonte: "site:/weddings",
    },
    {
      item: "The Perfect Beginning: adds month-of + day-of coordination, early bridal suite access, audio guest book, charger plates",
      preco: null,
      fonte: "site:/weddings",
    },
    {
      item: "The Signature Experience: adds décor styling and setup, premium décor and white linens",
      preco: null,
      fonte: "site:/weddings",
    },
    {
      item: "The Grand: multi-day rental and lodging, catered dinner, three-tier cake, florals and the honeymoon suite",
      preco: null,
      fonte: "site:/weddings",
    },
  ] as Adicional[],

  inclusos: [
    campo("14-hour rental window, with up to five hours for the ceremony and reception", "site:/weddings", "alta"),
    campo("Up to 150 guests (151–200 for $500)", "site:/weddings", "alta"),
    campo("Choice of ceremony site: lakeside arch or garden gazebo", "site:/weddings", "alta"),
    campo("Tables for up to 200 guests and 200 chairs, plus farmhouse tables and a cake table", "site:/faq, /weddings", "alta"),
    campo("Custom setup and breakdown by the staff", "site:/weddings", "alta"),
    campo("Access to the décor room at no extra charge", "site:/weddings, /faq", "alta"),
    campo("Bridal Retreat and Groom's Cabin", "site:/weddings", "alta"),
    campo("Photo booth, greenery wall and audio guest book", "site:/weddings", "alta"),
    campo("Sound system with handheld and lavalier microphones", "site:/faq", "alta"),
    campo("A manager on the property on your day", "site:/faq", "alta"),
  ] as Campo[],
  nao_inclusos: [
    campo("TABC-certified, insured bartender and approved security, if you serve alcohol", "site:/faq", "alta"),
    campo("Event liability insurance with host liquor liability coverage", "site:/faq", "alta"),
    campo("Coordination and DJ (included in the all-inclusive packages)", "site:/weddings", "alta"),
    campo("Refundable security deposit", "site:/faq", "alta"),
  ] as Campo[],
  inventario: {
    mesas: campo("Tables for up to 200 guests, farmhouse tables and a cake table", "site:/faq, /weddings", "alta"),
    cadeiras: campo("200 chairs", "site:/faq", "alta"),
    decoracao: campo("Décor room with a large décor collection", "site:/weddings", "alta"),
  },

  politicas: {
    bebida: campo(
      "Alcohol is allowed with an approved TABC-certified, insured professional bartender; approved security and event liability insurance with host liquor liability coverage are required.",
      "site:/faq",
      "alta",
    ),
    horario_fim: campo<string>(null),
    som: campo("Sound system with a handheld and a lavalier microphone for the outdoor ceremony area and the indoor venue", "site:/faq", "alta"),
    plano_chuva: campo<string>(null),
    estacionamento: campo<string>(null),
    fornecedores: campo("You may choose your own vendors without additional fees", "site:/faq", "alta"),
    animais: campo<string>(null),
    decoracao: campo("No nails, staples or anything that would damage the venue", "site:/faq", "alta"),
  },

  // /cabin-rentals-mt-pleasant-tx e /weddings (The Grand)
  hospedagem: [
    {
      nome: "The Bridal Retreat",
      dorme: null,
      no_local: true,
      descricao: "With a two-day booking, the bridal party can stay the night before and wake up where they get ready.",
      foto: foto(
        "bridal-retreat-lounge",
        "The Bridal Retreat's sitting area with a chandelier, a fireplace wall and tall windows",
        F("040__9d8d5f_2871a418f7e04e1ba1ff61e06a490200~mv2.jpg"),
        "bridal retreat",
        "horizontal",
        "2252px",
      ),
      link_reserva: null,
      fonte: "site:/weddings (Overnight Lodging: Bridal Retreat + Groom's Cabin night before)",
      confianca: "alta",
    },
    {
      nome: "The Groom's Cabin",
      dorme: null,
      no_local: true,
      descricao: "Living room with a TV and fireplace, a full kitchen and a bathroom with a shower, for the night before.",
      foto: foto(
        "grooms-cabin-tv-room",
        "The Groom's Cabin living room with a gray sofa, pine walls and a stone fireplace",
        F("037__9d8d5f_34b5350d2e2d4e4d9ea79e6102436da3~mv2.jpg"),
        "cabana do noivo",
        "horizontal",
        "2252px",
      ),
      link_reserva: null,
      fonte: "site:/weddings",
      confianca: "alta",
    },
    {
      nome: "Guest Cabins",
      dorme: null,
      no_local: true,
      descricao: "Three cabins on the property for your guests, with a private BBQ area, a fire pit and stocked ponds.",
      foto: foto(
        "guest-cabin-bedroom",
        "A cabin bedroom with pine walls, a ceiling fan and a red plaid quilt",
        F("084__9d8d5f_16a3ab405dc94fc4af8f47e12aada009~mv2.jpg"),
        "cabana",
        "horizontal",
        "4032px",
      ),
      link_reserva: "https://airbnb.com/h/theretreatatsugarhill",
      fonte: "site:/ (3 cabins), /cabin-rentals-mt-pleasant-tx",
      confianca: "alta",
    },
  ] as Hospedagem[],
  hospedagem_selo: campo<string>(null),

  // Getting Here: os tempos são os que o próprio site informa (FAQ da home)
  como_chegar: {
    destinos: [
      { destino: "Sulphur Springs", tempo: "30 min", fonte: "site:/ (Only 1/2 hour from Sulphur Springs)", confianca: "media" },
      { destino: "Texarkana", tempo: "1 hr", fonte: "site:/ (1 hr from either Texarkana or Longview)", confianca: "alta" },
      { destino: "Longview", tempo: "1 hr", fonte: "site:/ (1 hr from either Texarkana or Longview)", confianca: "alta" },
    ] as Destino[],
    proximos: [campo("Hotels in Mt. Pleasant, close to the highway", "site:/", "alta")] as Campo[],
  },

  processo: [
    campo("Every price is posted. Pick your day, then call (903) 921-4320 or email info@theretreatatsugarhill.com.", "site:/weddings, /contact-us", "alta"),
    campo("Book a tour and walk the hall, both ceremony sites and the cabins.", "site:/contact-us (Schedule Tour)", "alta"),
    campo("On the day, the staff sets up your tables and chairs and a manager stays on the property.", "site:/weddings, /faq", "alta"),
  ] as Campo[] | null,

  faq: [
    {
      pergunta: "How many guests can the venue hold?",
      resposta: "The 5,250 sq ft hall holds up to 200 guests. Rentals include up to 150; 151 to 200 guests is a $500 add-on.",
      tema: "capacidade",
      fonte: "site:/faq, /weddings",
    },
    {
      pergunta: "How much is a wedding?",
      resposta:
        "Weekdays are $2,900, Sundays $3,800, Fridays $4,000 and Saturdays $4,800, each with a 14-hour rental window. Jan/Feb and Jul/Aug dates are $350 off, and there are no hidden fees or gratuity charges.",
      tema: "preco",
      fonte: "site:/weddings",
    },
    {
      pergunta: "Can we serve alcohol?",
      resposta:
        "Yes, with an approved TABC-certified, insured professional bartender. Approved security and event liability insurance with host liquor liability coverage are required.",
      tema: "bebida",
      fonte: "site:/faq",
    },
    {
      pergunta: "When can we set up and clean up?",
      resposta: "Access depends on your package. With the weekend package, setup can begin at 8am Friday and cleanup runs until 3pm Sunday.",
      tema: "horario",
      fonte: "site:/faq",
    },
    {
      pergunta: "Can guests stay overnight?",
      resposta: "Yes. Three cabins are available on the property, and the hotels in Mt. Pleasant are close to the highway.",
      tema: "hospedagem",
      fonte: "site:/",
    },
    {
      pergunta: "Can we bring our own vendors?",
      resposta: "Yes. You may choose your own vendors without being charged additional fees.",
      tema: "fornecedores",
      fonte: "site:/faq",
    },
    {
      pergunta: "Can we decorate?",
      resposta:
        "Decorate as you wish, and use the venue's décor room at no extra charge. Nails, staples or anything that would damage the venue aren't allowed.",
      fonte: "site:/faq",
    },
    {
      pergunta: "Is there a sound system?",
      resposta: "Yes, with a handheld and a lavalier microphone, for both the outdoor ceremony area and the indoor venue.",
      fonte: "site:/faq",
    },
    {
      pergunta: "Is there a security deposit?",
      resposta: "Yes, a refundable security deposit is required.",
      fonte: "site:/faq",
    },
  ] as Pergunta[],

  historia: {
    origem: campo(
      "Family owned and operated; every detail of the property was thought of with the couple's and guests' experience in mind.",
      "site:/about-us",
      "alta",
    ),
    // os donos aparecem por nome nos depoimentos (/gallery: "the owners - Crystal and Sean")
    donos: campo("Crystal and Sean", "site:/gallery, /cabin-rentals-mt-pleasant-tx (depoimentos)", "media"),
    diferencial: campo(
      "Four-acre lake with two outdoor ceremony sites, a climate-controlled hall and cabins on 53 acres.",
      "site:/, /about-us",
      "alta",
    ),
  },

  // depoimentos de casais (/gallery) e de um hóspede das cabanas, cortados sem reescrever
  depoimentos: [
    {
      nome: "Bailey",
      data: null,
      texto:
        "They made the day a million times easier and the venue is just gorgeous! I couldn’t picture a better place to say I Do!",
      destaque: true,
      fonte: "site:/gallery",
    },
    {
      nome: "Lisa Driver, MI",
      data: null,
      texto:
        "…what truly sets this place apart from every other place we spoke to and visited is the owners - Crystal and Sean.",
      fonte: "site:/gallery",
    },
    {
      nome: "Shawn",
      data: null,
      texto: "I couldn't have asked for a more perfect day, the property is gorgeous, the pictures on the website don't do it justice…",
      fonte: "site:/gallery",
    },
    {
      nome: "Carlos, cabin guest",
      data: null,
      texto:
        "My wife and I have traveled to many different locations around the world and never experienced such amazing hospitality. Crystal and Sean go above and beyond.",
      fonte: "site:/cabin-rentals-mt-pleasant-tx",
    },
  ] as Depoimento[],

  imprensa: [] as Imprensa[],

  galeria: {
    mapa: null as string | null,
    fotos: [
      foto("couple-gazebo-kiss", "A bride and groom kissing inside the white gazebo, the lake behind them", F("046__9d8d5f_fa4c3be81e7c4e7d8101bcfb2a037030~mv2.jpg"), "gazebo", "vertical"),
      foto("garden-gazebo-chairs", "White chairs set in rows on the lawn facing the gazebo by the lake", F("053__9d8d5f_4ed3f56dfabd443a875f4215b7d2b60f~mv2.jpg"), "gazebo", "horizontal"),
      foto("couple-fall-lake", "A couple embracing at the lake's edge with fall trees reflected in the water", F("015__9d8d5f_e3b1fc9284d842bcb49b73faa3840d54~mv2.jpg"), "lago no outono", "horizontal"),
      foto("reception-long-tables", "Long tables with white linens and gold chargers in front of the hall's tall windows", F("022__9d8d5f_4dcfb2846937467ca1df7b2566cd8326~mv2.jpg"), "recepção", "horizontal"),
      foto("arch-dress-hanging", "A wedding gown hanging from the white arch over the deck by the lake", F("043__9d8d5f_45df02eb8d7143d18ba94712fdd550f5~mv2.jpg"), "vestido no arco", "vertical"),
      foto("fall-arch-florals", "The ceremony deck in fall, with pampas and pink florals on the arch posts", F("016__9d8d5f_ae38a16d35bc43cf9a05b8b7fc783427~mv2.jpg"), "arco no outono", "horizontal"),
      foto("lantern-table-lake", "A white lantern on a cocktail table under the patio roof, the lake beyond", F("049__9d8d5f_7796c68c884247e08d1ab4b2a5ba1b14~mv2.jpg"), "detalhe", "horizontal"),
      foto("greenery-wall", "The greenery wall with a neon 'You + Me' sign", F("011__250932_02ea1fc8941d4aee8da1565e9dea4d1f~mv2.jpg"), "parede verde", "vertical"),
      foto("couple-sunset-field", "A groom in a cowboy hat dipping his bride for a kiss in a field at sunset", F("048__9d8d5f_74ce02d014124e7e9c567d4f4a45decf~mv2.jpg"), "pôr do sol", "horizontal"),
      foto("audio-guest-book", "A vintage telephone audio guest book on a barrel table", F("055__9d8d5f_b7c4e7fedb304d83adc5e7076f305d6e~mv2.jpg"), "audio guest book", "horizontal"),
      foto("hall-barn-doors", "The white hall with wooden barn doors and a lawn in front", F("081__250932_2539e05bcfbd48dc8a528954b835a0a5~mv2.jpg"), "salão por fora", "horizontal"),
      foto("white-horse-pasture", "A white horse grazing in a pasture under tall trees on the property", F("107__9d8d5f_2cdb8eb5715249ce8b38a16aa159689e~mv2.jpg"), "cavalo", "horizontal"),
    ],
  },

  modulos: {
    outros_eventos: campo<string>(null),
  },

  // =====================  seções: liga/desliga + copy de seção  =====================

  cta: { label: "Schedule a Tour", href: "/?tour" } as Link,

  secoes: {
    anuncio: {
      enabled: true,
      link: { label: "See rates", href: "/packages" } as Link,
    },
    header: {
      enabled: true,
      nav: [
        { label: "The Venue", href: "/#the-venue", secao: "historia", pagina: "the_venue" },
        { label: "Packages", href: "/#packages", secao: "pacotes", pagina: "packages" },
        { label: "Stay", href: "/#stay", secao: "hospedagem", pagina: "stay" },
        { label: "FAQ", href: "/#faq", secao: "faq" },
      ] as { label: string; href: string; secao: string; pagina?: string }[],
      text_us: "Text us",
      menu: "Menu",
      fonte_nome: "serif" as "serif" | "sans",
    },
    abertura: {
      enabled: true,
      nome: "Sugarhill",
      divisao: "Sugar",
    },
    hero: {
      enabled: true,
      secundario: { label: "See Packages", href: "#packages" } as Link,
    },
    fatos: {
      enabled: true,
      rotulos: {
        capacidade_max: "Guests",
        capacidade_sentados: "Seated",
        acres: "Acres",
        ano_fundacao: "Sq ft, climate-controlled hall",
        distancia_cidade: "From Texarkana or Longview",
        hospedagens: "Cabins for guests",
      },
    },
    historia: {
      enabled: true,
      texto:
        "The Retreat at Sugarhill is a family-owned venue on 53 acres outside Mount Pleasant, run by Crystal and Sean. A four-acre lake sits at the center, with a lakeside arch and a garden gazebo for your vows and a 5,250 sq ft climate-controlled hall for up to 200. Every price is posted, with no hidden fees or gratuity, and cabins on the property let your people stay the weekend. Come see it on a tour.",
      link: { label: "Explore the venue →", href: "/the-venue" } as Link,
    },
    espacos: {
      enabled: true,
      eyebrow: "The Spaces",
      titulo: "Two ceremony sites, one lake.",
      link: { label: "Schedule a Tour →", href: "/?tour" } as Link,
      ver: "Tour it",
      todos: "Every space, in detail",
    },
    fim_de_semana: {
      enabled: true,
      titulo: "Your Wedding Weekend",
      cards: [
        {
          momento: "The day before",
          titulo: "Set up and stay",
          frase: "Arrive a day early to set up, host your rehearsal dinner and spend the night on the property.",
          itens: ["Rehearsal dinner space", "Overnight lodging", "Thu–Fri $5,625 · Fri–Sat $7,800"],
          foto: foto("grooms-cabin-sofa", "A sectional sofa in the pine-walled Groom's Cabin, with the kitchen beyond", F("034__9d8d5f_558433ac25bc48cfab3531bec6a39cc5~mv2.jpg"), "cabana", "vertical"),
          video: null as LoopSecao | null,
        },
        {
          momento: "The day",
          titulo: "Vows by the water",
          frase: "Say your vows at the lakeside arch or the garden gazebo, then move into the hall for dinner and dancing.",
          itens: ["14-hour rental window", "Setup & breakdown by staff", "Sound system with mics"],
          foto: foto("couple-fall-lake", "A couple embracing at the lake's edge with fall trees reflected in the water", F("015__9d8d5f_e3b1fc9284d842bcb49b73faa3840d54~mv2.jpg"), "lago no outono", "vertical"),
          video: null as LoopSecao | null,
        },
        {
          momento: "The night",
          titulo: "Golden hour to last dance",
          frase: "Portraits in the field at sunset, the photo booth and the swings around the fire pit.",
          itens: ["Photo booth", "Audio guest book", "Honeymoon suite with The Grand"],
          foto: foto("couple-sunset-field", "A groom in a cowboy hat dipping his bride for a kiss in a field at sunset", F("048__9d8d5f_74ce02d014124e7e9c567d4f4a45decf~mv2.jpg"), "pôr do sol", "vertical"),
          video: null as LoopSecao | null,
        },
      ],
      final: { label: "See the packages →", href: "#packages" } as Link,
    },
    pacotes: {
      enabled: true,
      titulo: "Weddings from $2,900",
      sem_preco: "Pricing on your tour",
      mais: "more",
      botao: "Check This Date",
      selo: "Most popular",
      adicionais: "Add-ons",
      adicionais_abrir: "See all add-ons",
      pagina: {
        oferta: "Seasonal special",
        completo: "Included with every rental",
        nao_incluso: "Not included",
        faq_titulo: "Price, drinks and guest count",
        faq_temas: ["preco", "bebida", "capacidade"] as TemaFaq[],
      },
    },
    hospedagem: {
      enabled: true,
      titulo: "Stay the whole weekend",
      texto:
        "The bridal party and the groomsmen can stay the night before, and three cabins on the property are there for your guests. The Grand package adds a honeymoon suite for your wedding night.",
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
      foto: foto("hall-patio-pergola", "The white hall, the fire-pit pergola and the lakeside arch on a summer day", F("072__9d8d5f_c31da9ec4f424f7d96d24d66a7daafd4~mv2.jpg"), "propriedade", "horizontal", "5464px"),
      video: null as LoopSecao | null,
      fallback: ["Inquire", "Tour", "Book"],
    },
    faq: {
      enabled: true,
      titulo: "Good to know",
    },
    como_chegar: {
      enabled: true,
      eyebrow: "Getting Here",
      titulo: "Between Texarkana and Sulphur Springs",
      texto: "On Farm Road 71 in Mount Pleasant, close to the highway and the town's hotels.",
      mapa_link: "Open in Google Maps",
      mapa_titulo: "Map",
      hospedagem: {
        titulo: "Where guests stay",
        texto: "Three cabins on the property for your guests.",
        link: { label: "See the cabins →", href: "#stay" } as Link,
      },
    },
    galeria: {
      enabled: true,
      titulo: "Gallery",
      link: "See the full gallery →",
    },
    checar_data: {
      enabled: true,
      titulo: "Is your date still open?",
      apoio: "Send your date and guest count, or call (903) 921-4320.",
      foto: foto("chairs-facing-arch", "White chairs on the lawn facing the A-frame arch and the lake", F("024__9d8d5f_77a7fd8af88f4dd28f0f0c7c92c06420~mv2.jpg"), "cerimônia", "horizontal", "7008px"),
    },
    tour: {
      enabled: true,
      titulo: "Schedule a Tour",
      fotos: [
        { foto: foto("couple-gazebo-kiss", "A bride and groom kissing inside the white gazebo, the lake behind them", F("046__9d8d5f_fa4c3be81e7c4e7d8101bcfb2a037030~mv2.jpg"), "gazebo", "vertical"), titulo: "Come walk the lake with us." },
        { foto: foto("garden-doors-florals", "White garden doors with florals opening onto the path to the gazebo", F("029__9d8d5f_6913b32e8dd34c98851c60c0ba6a72bb~mv2.jpg"), "portas do jardim", "vertical"), titulo: "We'd love to show you around." },
        { foto: foto("arch-pampas-aisle", "The white A-frame arch decorated with pampas and roses at the end of a wooden aisle", F("019__9d8d5f_959ef20e90384fabb7e860bbe0079a8e~mv2.jpeg"), "arco", "vertical"), titulo: "See both ceremony sites." },
      ] as { foto: Foto; titulo: string }[],
      quando: "When are you thinking?",
      estacoes: ["Spring", "Summer", "Fall", "Winter"] as [string, string, string, string],
      flexivel: "Still flexible",
      convidados: "How many guests?",
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
      obrigado: {
        titulo: "Thank you, {nome}.",
        texto: "We have your note and will be in touch to set up your tour of The Retreat at Sugarhill.",
        retorno: "will reach out soon.",
        retorno_sem_nome: "We'll reach out soon.",
        mensagem: "For the quickest reply, text",
        convidados: "guests",
      },
      fechar: "Back to the site",
      recomecar: "Start over",
      rotulo_fechar: "Close",
      progresso: "Progress",
    },
    footer: {
      enabled: true,
      checar: { label: "Check Your Date", href: "/?tour" } as Link,
      visite: "Visit",
      contato: "Contact",
      siga: "Follow",
      imprensa: { enabled: false, label: "As featured in" },
      credito: null as Link | null,
      creditos_ui: { label: "Interface components by Skiper UI", href: "https://skiper-ui.com" } as Link | null,
    },
    barra_mobile: {
      enabled: true,
      text_us: "Text Us",
    },
  },

  // =====================  páginas internas  =====================
  paginas: {
    the_venue: {
      enabled: true,
      href: "/the-venue",
      nome: "The Venue",
      link_home: "Explore the venue →",
      titulo: "Built around the lake",
      subtitulo:
        "A 5,250 sq ft climate-controlled hall for up to 200 guests, a lakeside arch and a garden gazebo for the ceremony, a swing-and-fire-pit patio, the Bridal Retreat and the Groom's Cabin, on 53 acres in Mount Pleasant.",
      foto: foto("aerial-lake-property", "Aerial view of the lake, the white hall and the arch among the trees of the 53-acre property", F("116__9d8d5f_38f78f33e78744f6a1be90d072884a08~mv2.jpg"), "vista aérea", "horizontal", "5464px"),
      apresentacao: {
        eyebrow: "The Venue",
        titulo: "Family owned, planned for your guests",
        texto: [
          "The Retreat at Sugarhill is family owned and operated, and every detail of the property was planned with couples and their guests in mind. The four-acre lake is the backdrop for both ceremony sites, and the hall sits a short walk from the water, with tall windows onto the grounds.",
          "The décor room, the farmhouse tables, the photo booth and the audio guest book come with every rental, and the staff sets up and breaks down for you. Come walk it on a tour.",
        ],
      },
      legendas: [
        "The hall measures 5,250 sq ft and holds up to 200 guests, with tables and 200 chairs included.",
        "A sound system with handheld and lavalier mics covers the outdoor ceremony area and the hall.",
        "The Chapel, a waterside ceremony space with a cathedral ceiling, is under construction now.",
      ],
      depoimento: 1,
      seo: {
        titulo: "The Venue",
        descricao: "The Retreat at Sugarhill in Mount Pleasant, TX: a 5,250 sq ft hall for 200 guests and two lakeside ceremony sites on 53 acres.",
      },
    },
    packages: {
      enabled: true,
      href: "/packages",
      nome: "Packages",
      link_home: "See all packages →",
      titulo: "Weddings from $2,900",
      subtitulo:
        "Rent the venue by the day, with a 14-hour window for up to 150 guests: weekdays $2,900, Sundays $3,800, Fridays $4,000 and Saturdays $4,800. Two-day weekends start at $5,625.",
      foto: foto("reception-long-tables", "Long tables with white linens and gold chargers in front of the hall's tall windows", F("022__9d8d5f_4dcfb2846937467ca1df7b2566cd8326~mv2.jpg"), "recepção", "horizontal", "7009px"),
      apresentacao: {
        eyebrow: "Packages",
        titulo: "The price you see is the price you pay",
        texto: [
          "Every rental includes a 14-hour window with up to five hours for the ceremony and reception, for up to 150 guests. The décor room, tables and chairs with setup and breakdown, the Bridal Retreat, the Groom's Cabin, the photo booth and the audio guest book are part of it. No hidden fees, no gratuity charges.",
          "Four all-inclusive packages add coordination, a DJ, bartending and security, up to The Grand with catering, cake, florals and lodging. Ask about them on your tour.",
        ],
      },
      legendas: [
        "Jan/Feb and Jul/Aug dates are $350 off every rate.",
        "Hosting 151 to 200 guests is a $500 add-on.",
        "Most couples spend between $3K and $20K with the venue, depending on dates and services.",
      ],
      depoimento: 0,
      seo: {
        titulo: "Packages",
        descricao: "Wedding prices at The Retreat at Sugarhill, Mount Pleasant, TX: weekdays $2,900, Saturdays $4,800, two-day weekends from $5,625.",
      },
    },
    stay: {
      enabled: true,
      href: "/stay",
      nome: "Stay",
      link_home: "See all stays →",
      titulo: "Stay the weekend",
      subtitulo:
        "The Bridal Retreat and the Groom's Cabin for the night before, a honeymoon suite for the wedding night and three cabins for your guests, on 53 acres with stocked ponds, trails and a fire pit.",
      foto: foto("guest-cabin-exterior", "A small brown cabin with a covered porch at dusk", F("083__9d8d5f_ca76c85adf8a4afbbd37cda946cc77f5~mv2.jpeg"), "cabana", "horizontal", "1920px"),
      apresentacao: {
        eyebrow: "Stay",
        titulo: "Turn the day into a weekend",
        texto: [
          "With a two-day booking you arrive the day before, set up, host your rehearsal dinner and sleep on the property, so the wedding morning starts with everything in place. The Grand package adds the honeymoon suite for the wedding night.",
          "Three cabins are available for guests, booked through Airbnb or by email. Between events there is fishing in the stocked ponds, walking and bike trails, a paddle boat and the fire pit at night.",
        ],
      },
      legendas: [
        "Guest cabins are booked on Airbnb or by emailing the venue for availability.",
        "Stocked ponds for fishing, walking and bike trails, and a paddle boat.",
        "A private BBQ area and fire pit for evenings under the stars.",
      ],
      depoimento: 3,
      seo: {
        titulo: "Stay",
        descricao: "Cabins and overnight stays at The Retreat at Sugarhill in Mount Pleasant, TX: 3 guest cabins plus the Bridal Retreat and Groom's Cabin.",
      },
    },
  } satisfies Record<string, Pagina>,

  seo: {
    url: null as string | null,
    descricao:
      "The Retreat at Sugarhill is a lakeside wedding venue on 53 acres in Mount Pleasant, TX, for up to 200 guests, with cabins on site. From $2,900.",
    noindex: true,
  },

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
