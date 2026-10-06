// Textos do modo guia (?guide=1): faixa no topo de cada seção com número, nome,
// trabalho (o que ela vende) e a regra de copy principal. Fonte: docs/VENUE-TEMPLATE.md §4.
import { placeholders as P, type PaginaId, type SecaoId } from "@/content/site";

// preencher: o placeholder da §4 inteiro (no site ele aparece dividido entre os campos)
export type Guia = { numero: string; nome: string; trabalho: string; regra: string; preencher?: string };

// faixas das páginas internas: uma por página (no topo, com o header) + as partes comuns
export type GuiaId = SecaoId | PaginaId | "pag_apresentacao" | "pag_fotos" | "pag_prova" | "pacotes_detalhes";

const hero = `Hero da página: breadcrumb, H1 ${P.paginaTitulo} Subtítulo: ${P.paginaSubtitulo}`;

export const guide: Record<GuiaId, Guia> = {
  anuncio: {
    numero: "0",
    nome: "Announcement bar",
    trabalho: "urgência real (datas com desconto, open house).",
    regra: "máx. 60 caracteres. Só usar oferta que existe no site do venue.",
    preencher: P.oferta,
  },
  header: {
    numero: "1",
    nome: "Header",
    trabalho: "navegação + CTA sempre à mão.",
    regra: "The Venue · Packages · Stay · FAQ + Text us + Schedule a Tour. Sem logo, nome em texto na serif.",
    preencher: P.header,
  },
  abertura: {
    numero: "2a",
    nome: "Abertura (A Janela)",
    trabalho: "um instante de marca que termina no próprio hero, sem atrasar o site.",
    regra:
      "só na 1ª visita da sessão (e só na home): nome grande na serif em papel (0,6s), ele se abre no ponto de divisão e entre as partes surge uma janela 4:5 com o clipe 1 já tocando (sem vídeo a tempo, o poster); pausa com a janela crescendo 10%, e ela vai até a tela cheia enquanto as palavras saem pelos lados e vira o hero, sem recomeçar o vídeo. Depois header desce e o H1 entra linha por linha. ~4s no desktop, 15% mais rápida e com o nome empilhado no celular. Clique, rolagem ou tecla pulam; reduzir movimento = sem abertura. Páginas internas: só a entrada do título. Campos: secoes.abertura.nome e .divisao; desligar: secoes.abertura.enabled.",
    preencher: P.aberturaNome,
  },
  hero: {
    numero: "2",
    nome: "Hero",
    trabalho: "em 3 segundos dizer o quê + onde + por que este.",
    regra: 'H1 = 1 frase elegante na serif, com a busca do casal dentro (casamento + tipo de lugar + cidade + estado), para o SEO. Foto pura, sem scrim. Não usar "dream wedding", "magical", "perfect day".',
    preencher: `${P.heroTitulo} ${P.heroSubtitulo} ${P.heroVideos} ${P.heroLegenda}`,
  },
  fatos: {
    numero: "3",
    nome: "Facts strip",
    trabalho: 'responder "cabe? é sério?" com números, sem ler.',
    regra: "só números com fonte. Nunca arredondar para cima.",
    preencher: P.fatos,
  },
  historia: {
    numero: "4",
    nome: "Intro / Story",
    trabalho: "criar conexão emocional e dizer por que o lugar é diferente.",
    regra: "história real + diferencial concreto. Tom editorial, sem clichês. Termina puxando para o CTA.",
    preencher: P.historia,
  },
  espacos: {
    numero: "5",
    nome: "The Spaces",
    trabalho: "mostrar onde cada momento acontece (cerimônia, recepção, fotos, arrumação).",
    regra: "selo do espaço-herói = o diferencial nº 1 do venue.",
    preencher: `${P.espacosTitulo} Card: ${P.espacoCard}`,
  },
  fim_de_semana: {
    numero: "6",
    nome: "Your Wedding Weekend",
    trabalho: 'vender a experiência completa (não só o sábado) e reduzir o medo de "dá trabalho".',
    regra: 'só itens que existem em inclusos. Nada de "brunch" se o venue não oferece.',
    preencher: P.fimDeSemana,
  },
  pacotes: {
    numero: "7",
    nome: "Packages",
    trabalho: "ancorar preço e mostrar que é simples escolher.",
    regra: '"From $X" ou "Pricing on your tour" — nunca inventar número. MOST CHOSEN só se o venue disser.',
    preencher: `${P.pacotesTitulo} Card: ${P.pacoteCard}`,
  },
  hospedagem: {
    numero: "8",
    nome: "Stay On Site",
    trabalho: 'diferencial enorme nos EUA ("wedding weekend"). Resolve "onde a família fica".',
    regra: 'separar "no local" de "próximo" se o dado disser. Sem hospedagem, a seção some.',
    preencher: P.hospedagem,
  },
  depoimentos: {
    numero: "9",
    nome: "Love Notes",
    trabalho: 'prova social. Fundo escuro para criar "capítulo".',
    regra: "pode cortar o depoimento, nunca reescrever palavras.",
    preencher: P.depoimento,
  },
  processo: {
    numero: "10",
    nome: "How It Works",
    trabalho: "tirar o medo do próximo passo.",
    regra: "3 passos numerados; dizer quem responde e em quanto tempo.",
    preencher: P.processo,
  },
  faq: {
    numero: "11",
    nome: "FAQ",
    trabalho: "responder objeções antes que virem motivo para não ligar.",
    regra: "resposta em 1–3 frases, com o número exato quando existir.",
    preencher: P.faq,
  },
  como_chegar: {
    numero: "11b",
    nome: "Getting Here",
    trabalho: 'responder "fica longe? onde meus convidados ficam?" com tempos de carro reais.',
    regra: "só tempos medidos (Google Maps, a partir do endereço) e hotéis que o venue cita. Nunca arredondar para baixo.",
    preencher: `${P.comoChegar} ${P.comoChegarHospedagem}`,
  },
  galeria: {
    numero: "12",
    nome: "Gallery",
    trabalho: '"quero me ver ali".',
    regra: "8–12 fotos reais do venue. Nada de banco de imagens.",
    preencher: P.galeria,
  },
  checar_data: {
    numero: "13",
    nome: "Check Your Date",
    trabalho: "última chamada para o tour.",
    regra: "H2 + 1 frase + botão Schedule a Tour, que abre o card. Prazo de resposta só se for verdade.",
    preencher: `${P.checarTitulo} ${P.checarApoio}`,
  },
  tour: {
    numero: "13b",
    nome: "Schedule a Tour (card)",
    trabalho: "capturar o lead em 3 passos curtos: quando + convidados · contato · obrigado.",
    regra: 'todo CTA abre este card. 3 fotos ao lado (só de 768px para cima) em loop de 4s com tracinhos, cada uma com um título diferente de quem quer receber o casal, máx. 6 palavras. Convidados numa barra deslizante com as faixas até numeros.capacidade_max, rótulos sempre visíveis; "Check This Date" marca a faixa do pacote (pacotes[].convidados). Obrigado honesto: nunca "booked" ou "confirmed".',
    preencher: `Títulos das fotos: ${P.tourFotoTitulo} Obrigado: ${P.tourObrigado} Quem responde (identidade.quem_responde): ${P.tourQuemResponde}`,
  },
  footer: {
    numero: "14",
    nome: "Footer",
    trabalho: "contato completo + CTA repetido.",
    regra: 'repetir Schedule a Tour + "Website by [SUA MARCA]".',
  },
  the_venue: {
    numero: "P1",
    nome: "Página The Venue",
    trabalho: 'responder "é o nosso estilo? onde acontece cada momento?" com todos os espaços e os números.',
    regra: "hero · apresentação · 3 legendas · faixa de números + todos os espaços com a descrição completa · selos + 1 depoimento · Check Your Date.",
    preencher: hero,
  },
  packages: {
    numero: "P2",
    nome: "Página Packages",
    trabalho: 'responder "quanto custa e o que vem incluído?" sem precisar ligar.',
    regra: "oferta só se existir, pacotes com a lista completa, adicionais com preço, o que não está incluído e as perguntas de preço, bebida e capacidade. Nunca inventar número.",
    preencher: hero,
  },
  stay: {
    numero: "P3",
    nome: "Página Stay",
    trabalho: 'responder "onde a gente e a família dormem? como chegam?" e vender o fim de semana inteiro.',
    regra: "hero · apresentação · 3 legendas · todas as hospedagens (no local separado de próximo, se o dado disser) + linha do tempo do fim de semana + Getting Here.",
    preencher: hero,
  },
  pag_apresentacao: {
    numero: "P·a",
    nome: "Apresentação",
    trabalho: "dizer em ~120 palavras por que este venue, no assunto da página.",
    regra: "só fatos do venue.json. Tom editorial, sem clichês. Termina puxando para o tour.",
    preencher: `${P.paginaApresentacaoTitulo} ${P.paginaApresentacao}`,
  },
  pag_fotos: {
    numero: "P·b",
    nome: "3 legendas",
    trabalho: "3 fatos rápidos do assunto da página, lidos em 5 segundos.",
    regra: "sem foto. Mono, 10–20 palavras cada, 1 fato real com fonte por legenda.",
    preencher: P.paginaLegenda,
  },
  pag_prova: {
    numero: "P·c",
    nome: "Prova social",
    trabalho: "confiança logo antes da chamada final.",
    regra: 'selos "As featured in" (só nomes, sem logos de terceiros) + 1 depoimento escolhido para o assunto da página, cortado, nunca reescrito.',
    preencher: P.depoimento,
  },
  pacotes_detalhes: {
    numero: "P2·d",
    nome: "Oferta, adicionais e não incluso",
    trabalho: 'tirar a surpresa de preço: o que custa à parte e o que o casal providencia.',
    regra: "oferta com prazo real (some sem oferta) · adicionais com preço exato · não incluso só com fonte.",
  },
  barra_mobile: {
    numero: "—",
    nome: "Mobile sticky bar",
    trabalho: "CTA fixo no celular depois do hero.",
    regra: "Schedule a Tour (sólido) · Text Us (sms:). Some quando a chamada final (Check Your Date) está na tela.",
  },
};
