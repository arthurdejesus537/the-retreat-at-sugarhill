# PROGRESS.md — execução autônoma do checklist (Etapas 2–19)

Registro por etapa: o que foi feito, decisões tomadas sem consulta e dúvidas para revisão.
Screenshots de QA em `qa/etapa-NN/` (1440 e 375, com e sem `?guide=1`; `-full` = página
inteira, `-section` = recorte da seção). A pasta `qa/` está no `.gitignore` (só no disco).

---

## Etapa 2 (revisão) — `content/site.ts` com os campos do `venue.json`

**Feito**
- `content/site.ts` reescrito com os mesmos nomes e formato de `~/Documents/Sites-Docs/venue.json`:
  cada campo é `{ valor, fonte, confianca }`; listas (`espacos`, `pacotes`, `hospedagem`,
  `faq`, `depoimentos`…) são itens planos com `fonte`, como em `strawberry-creek.json`
  (usado só como referência de formato; nenhum dado da Strawberry entrou).
- Entraram também os campos que a Strawberry tem e o venue.json ainda não (`slug`, `oferta`,
  `hero`, `preco_a_partir_de`, `adicionais`, `hospedagem_selo`, `processo`,
  `identidade.contato_preferido`, `identidade.logo`).
- Copy de seção que não é dado do venue (títulos, rótulos de botão, campos do form) fica em
  `site.secoes.<seção>`, junto do `enabled`. CTA primário em `site.cta`.
- `lib/site.ts`: helpers de leitura (`val`, `isPlaceholder`, `midiaLabel`, `smsHref`, `telHref`).
- Modo guia ganhou a linha "Preencher" com o placeholder inteiro da §4.

**Decisões**
- Regra de renderização: campo com `valor: null` não aparece (segue o "sem fonte = null" do venue.json).
- Placeholders da §4 que cobrem vários campos (card de espaço, card de pacote, hospedagem,
  depoimento…) foram divididos entre os campos; o texto inteiro fica no modo guia.
- H1 do hero no template: `[Tipo de venue]` / `[o diferencial único]` em vez da instrução
  inteira — a instrução tem 27 palavras e, no tamanho do H1, ocupa a tela e quebra as
  proporções que o próprio §2 pede para manter. A instrução completa está no guia.
- Fotos: `Foto = Campo<string> + { alt, placeholder: { descricao, formato, minimo } }`;
  a skill só precisa escrever `valor` (caminho da imagem).
- `servicos_extras` (citado no §4) não existe no venue.json; usei `adicionais`, que existe.
- `site.modelo` continua temporário, só com o conteúdo das seções ainda não adaptadas.

**Para revisar**
- Confirmar se a skill de preenchimento deve escrever também em `site.secoes.*` (copy de seção)
  ou só nos campos do venue.json.

---

## Etapa 3 — Seção 0: Announcement bar

**Feito**
- `components/sections/AnnouncementBar.tsx`: faixa `--c-signal`, mono uppercase, texto de
  `oferta.valor` (+ `· validade` quando houver), link "Check your date →" à direita
  (no mobile, abaixo do texto). Some com `enabled: false` ou `oferta.valor = null`.
- A faixa fica no fluxo, acima do header fixo. O header acompanha a faixa até ela sair da tela
  (`--header-offset`, medido no scroll a partir de `#header-anchor`); o menu mobile também.
- O hero desconta a altura real da faixa (`--announce-offset`, medida no Header.tsx), para os
  botões continuarem na primeira dobra.
- Modo guia: as faixas de 0 · Announcement, 1 · Header e 2 · Hero ficam no fluxo, no topo da
  página (sobrepostas elas ficariam atrás do header fixo).

**Decisões**
- Token novo `--announce-h: clamp(36px, 4.4rem, 40px)`: o §4 pede 36–40px e nenhum token existente
  dava essa altura. Fica num bloco "template de venue" no fim do `tokens.css`.
- Link da faixa aponta para o formulário final (`#check-your-date`), o CTA secundário do §1.
- O texto não é cortado com reticências: com a oferta real (≤ 60 caracteres) ocupa 1 linha no
  desktop e 2 no celular; o placeholder de instrução é mais longo e quebra em 3 linhas no celular.

**Para revisar**
- Nada pendente.

---

## Etapa 4 — Seção 1: Header

**Feito**
- Desktop: `The Venue · Packages · Stay · FAQ` à esquerda, nome/logo no centro, `Text us`
  (link `sms:`) + botão `Schedule a Tour` à direita. O botão é branco sobre o hero e preto
  quando o header fica sólido.
- Mobile: `Text us` à esquerda, nome no centro, hambúrguer à direita; barra de atalhos com as
  4 seções; menu em tela cheia com as seções + `Schedule a Tour` + `Text us`.
- `Logo`: usa `identidade.logo` quando existir; senão o nome em serif (`--t-h3-serif`).
- Cada link do menu some junto com a seção (`lib/site.ts → isOn / navLinks`), por exemplo
  `Stay` some se `hospedagem` estiver vazia ou desligada.
- `site.cta` é o CTA único do site (§1).

**Decisões**
- No mobile, `Text us` ocupou o lugar da busca do modelo (canto esquerdo), para o CTA de
  contato ficar sempre à mão, como o §1 pede.
- Botão do header no tamanho S do sistema (3.2rem), para caber no header de 4.8rem.
- No mobile o nome usa `--t-link` e quebra em até 2 linhas no centro, para nomes longos
  (ex.: 30+ caracteres) não encostarem nos ícones.
- A troca logo completo → logo mini do modelo saiu: com o nome em texto não há versão mini.
- `Button` com `href` passou a repassar `onClick` (fechar o menu ao tocar no CTA).

**Para revisar**
- Com logo em arquivo, a altura é `--logo-h` (1.8rem desktop). Conferir com o primeiro logo real.

---

## Etapa 5 — Seção 2: Hero

**Feito**
- Hero do modelo com `hero.foto` (`next/image` com `priority`, é o LCP), ou `hero.video` se
  existir, ou placeholder de mídia.
- H1 em 2 linhas: `hero.titulo[0]` em sans, `hero.titulo[1]` em Newsreader itálico (o `next/font`
  agora carrega o estilo itálico). Subtítulo (`hero.subtitulo`) abaixo, em `--t-footer-link`.
- Botões `Schedule a Tour` (sólido) + `See Packages` (vidro). Legenda em mono:
  `CIDADE — UF` / região / distância da cidade (esta só se houver valor).

**Decisões**
- Placeholder do hero em grafite (tom escuro do `MediaPlaceholder`) em vez de `--c-line`: o
  título, os botões e o header são brancos por cima e ficariam ilegíveis no cinza-claro.
  O mesmo vale para as outras seções com texto branco sobre a mídia.
- Nova variante `glass` no `Button` (fundo `--c-chip-dark` + `--blur-glass`), pedida pelo §4; as
  variantes existentes não mudaram.
- A legenda continua escondida abaixo de 992px, como no modelo; no celular o "onde" fica no
  subtítulo.
- Campo novo `hero.video` (opcional, null no template).

**Para revisar**
- O vídeo do hero não tem versão mobile separada (o modelo tinha 16:9 + 9:16). Se algum venue
  mandar vídeo, avaliar se vale ter os dois.

---

## Etapa 6 — Seção 3: Facts strip

**Feito**
- `components/sections/FactsStrip.tsx`: faixa entre o hero e a Intro, com até 5 números de
  `numeros.*` + nº de hospedagens no local (calculado de `hospedagem`). Valor em mono
  (`--t-h3`), rótulo em `t-meta`, divisórias `--c-line`. Número com `valor: null` não aparece;
  sem nenhum número, a seção some.
- Mobile: grade de 2 colunas; com número ímpar de itens, o último ocupa a linha inteira.
- Modo guia: a faixa do guia agora entra **no fluxo** no topo de cada seção (a seção cresce só
  com `?guide=1`, nada fica coberto). Só as seções em linha (The Spaces e Check Your Date)
  usam a faixa sobreposta (`overlay`).

**Decisões**
- Ordem dos números: capacidade → sentados → acres → fundação → hospedagens → distância (a do
  placeholder do §4), cortando no 5º.
- Rótulos em inglês em `site.secoes.fatos.rotulos` ("Guests", "Acres", "Established",
  "Stays on site", "From downtown").
- `capacidade_sentados` é null no template (o §4 cita só "capacidade"); aparece se a skill preencher.

**Para revisar**
- "From downtown" é genérico; se a distância for de outra referência (aeroporto, cidade
  vizinha), o rótulo precisa mudar junto. Talvez valha um campo de rótulo por venue.

---

## Etapa 7 — Seção 4: Intro / Story

**Feito**
- `Manifesto` virou `Intro` (`components/sections/Intro.tsx`, `styles/Intro.module.css`), com
  `id="the-venue"` (destino do link "The Venue"). Texto `--t-lead` de `secoes.historia.texto`,
  em ~8 de 12 colunas no desktop (largura toda abaixo de 992px), + link.
- Âncoras do site param abaixo do header fixo (`scroll-margin-top`) e rolam suave
  (desligado com `prefers-reduced-motion`, regra que já existia).

**Decisões**
- Link da Intro = `Schedule a Tour →` (o template não tem página "Our Story"; o §4 manda usar o
  CTA nesse caso).
- O parágrafo é copy (`secoes.historia.texto`); os dados brutos ficam em `historia.origem /
  diferencial / donos` para a skill escrever o texto a partir deles.

**Para revisar**
- Nada pendente.

---

## Etapa 8 — Seção 5: The Spaces

**Feito**
- `SelectedStays` virou `Spaces` (`id="the-spaces"`). O 1º item de `espacos` é o espaço-herói
  (mídia alta, sticky, nome por cima, selo amarelo com `selo`); os demais viram cards
  (`CardStay`) com uso em mono, nome, 2 frases e tags (capacidade primeiro).
- Cabeçalho: eyebrow `THE SPACES`, H2 de `secoes.espacos.titulo`, link para o CTA.
- `CardStay`: rótulo do hover e do placeholder vêm de fora (inglês / formato do §2); layout igual.

**Decisões**
- Os espaços não têm página própria: card e espaço-herói levam ao formulário (`site.cta`), com
  o rótulo de hover "Tour it".
- Campos `capacidade`, `tags`, `selo` e `foto` são opcionais no item de `espacos` (não existem na
  captura da Strawberry); sem eles, o card mostra só o que houver.
- Placeholder do espaço-herói em grafite (nome branco por cima), cards em `--c-line`.

**Para revisar**
- Com muitos espaços (a Strawberry tem 8), a coluna da direita fica longa enquanto o
  espaço-herói fica preso. Se incomodar, limitar a lista (ex.: 4) e mandar o resto para a galeria.

---

## Etapa 9 — Seção 6: Your Wedding Weekend

**Feito**
- `CuratedCollections` virou `WeddingWeekend` (`id="wedding-weekend"`), no carrossel do modelo:
  3 cards de mídia (`Before` · `The Day` · `After`, numerados 01–03) com título curto, 1 frase
  e itens incluídos em mono, + card final escuro "See what's included →" (leva a Packages).
- `CardCollection` passou a receber props genéricas (linha de cima, título, frase, itens,
  mídia, card final); o visual do card é o mesmo. O vídeo de hover do modelo saiu (sem uso).
- `Carousel`: rótulos de acessibilidade em inglês, vindos de `site.ui`.
- `Media`: `--placeholder-pad` para o container posicionar o rótulo do placeholder.

**Decisões**
- Copy dos 3 cards fica em `secoes.fim_de_semana.cards` (é texto escrito a partir de
  `inclusos` + `hospedagem`, não dado bruto). A regra "só itens que existem em `inclusos`"
  fica no guia.
- Rótulos dos momentos em inglês: "Before", "The Day", "After".

**Para revisar**
- Nada pendente.

---

## Etapa 10 — Seção 7: Packages

**Feito**
- `ShopGrid` → `Packages` (`id="packages"`), `CardProduct` → `CardPackage`. Preço de produto,
  imagem, vídeo de hover e link de loja saíram (decisão da Etapa 1).
- Card: nome (`t-h3`), preço em mono (`preco`, ou "Pricing on your tour" quando `null`),
  para quem é, até 6 incluídos + "+N more", botão `Check This Date` (leva ao formulário).
  Selo `MOST CHOSEN` só com `destaque: true` (false no template).
- Grade com uma coluna por pacote (até 4) no desktop; 2 no tablet; 1 no celular.
- Abaixo da grade: "Add-ons: …" (de `adicionais[].item`) + link.
- Ordem da página já segue o §3 até aqui: Hero → Facts → Intro → Spaces → Weekend → Packages.

**Decisões**
- Card sem imagem: o §4 lista só texto + botão. Filete `--c-ink` no topo no lugar da mídia,
  para manter a linha de 4 colunas do modelo.
- Botão sólido no pacote em destaque, contorno nos outros (hierarquia sem cor nova).
- H2 do template = placeholder exato do §4; `preco_a_partir_de` fica como dado para a skill
  escrever o título ("Packages from $X").

**Para revisar**
- O link "See all add-ons →" aponta para `#faq`, porque o template não tem página de adicionais.
  Definir se cada cliente terá uma página/PDF de adicionais.

---

## Etapa 11 — Seção 8: Stay On Site

**Feito**
- `Destinations` → `StayOnSite` (`id="stay"`): título + 1 frase, 2 cards grandes (foto 4:3) e,
  abaixo, carrosséis de cards menores (proporção do card de destino do modelo) por grupo.
- Grupos pelo `no_local`: `true` → "Also on site"; `false` → "Nearby"; `null` → "More places
  to stay" (o dado não diz; não afirmo que é no local). Sem hospedagem, a seção some.
- `CardDestination` virou card genérico (meta em mono "SLEEPS X", nome, 1 frase, selo
  opcional, link opcional para `link_reserva` com hover "Book"). O estado "em breve" do
  modelo saiu.
- `hospedagem_selo` (se houver) vira selo amarelo no 1º card grande.

**Decisões**
- Cards grandes = as 2 primeiras com `no_local: true`; se nenhuma estiver confirmada, as 2
  primeiras sem dado.
- Token novo `--stay-large-ratio: 4 / 3` (cards grandes). Placeholder da foto de hospedagem
  pede "horizontal, mín. 1600px"; nos cards menores ela é recortada na vertical.
- Hospedagem sem `link_reserva` não é link (sem página de detalhe no template).

**Para revisar**
- Na Strawberry, quase todas as hospedagens têm `no_local: null`; elas vão cair em "More places
  to stay". Vale confirmar o dado na captura antes de montar o cliente.

---

## Etapa 12 — Seção 9: Love Notes

**Feito**
- `Journal` → `LoveNotes` (`id="love-notes"`), fundo preto do modelo, carrossel com até 4 por
  tela no desktop. `CardArticle` → `CardQuote`: filete, citação em serif com aspas,
  nome + data ("MARRIED MÊS ANO") em mono.
- A seção some com menos de 2 depoimentos (`isOn`).

**Decisões**
- Fundo `--c-black` (o do Journal do modelo); o §4 cita `--c-ink`, mas o modelo usa preto e a
  instrução geral é manter o visual do modelo.
- Citação em `--t-h3-serif` (2.8rem): com até 35 palavras em 1/3 da tela, o `--t-lead` passaria
  de 10 linhas.
- Sem imagem nos cards (o §4 não pede foto de casal aqui).

**Para revisar**
- Sem foto, a seção fica mais baixa que o Journal do modelo. Se quiser mais peso, dá para usar
  a citação de destaque (`destaque: true`) em tamanho maior acima do carrossel.

---

## Etapa 13 — Seção 10: How It Works

**Feito**
- `PassesBanner` → `HowItWorks` (`id="how-it-works"`): foto full-bleed (`secoes.processo.foto`),
  rótulo "How It Works" no alto como a categoria do modelo e, no lugar do vídeo central, um
  card claro com H2, 3 passos `01 02 03` em mono (de `processo[]`) e o botão do CTA.
- `processo: null` (ou vazio) → fallback "Inquire → Tour → Book".
- Correção no header mobile: a barra de cima agora sobe pela altura medida (o nome do venue
  pode quebrar em 2 linhas e a barra ficava meio escondida).

**Decisões**
- H2 fixo em inglês ("Three steps to your date", em `secoes.processo.titulo`), porque o §4 não
  dá placeholder de título para esta seção.
- A ficha técnica do canto (annotation do modelo) saiu: os dados do venue já estão na Facts strip.
- Botão do card = CTA primário ("Schedule a Tour"), para o passo 1 virar ação.

**Para revisar**
- Nada pendente.

---

## Etapa 14 — Seção 11: FAQ

**Feito**
- `components/sections/Faq.tsx` (`id="faq"`): 2 colunas no desktop — H2 "Good to know" + botão
  `Schedule a Tour` à esquerda (sticky), acordeão à direita; 1 coluna abaixo de 992px.
- Acordeão com `<details>/<summary>` nativo (acessível e sem JS); abre com altura animada
  onde há suporte (`::details-content` + `interpolate-size`), no ritmo `--dur-fast` do sistema.
- Template com 8 perguntas na ordem do §4 (capacidade → preço → bebida → chuva → horário →
  fornecedores → pets → estacionamento).

**Decisões**
- Pergunta em sans `--w-display` no tamanho `--t-footer-link` (2rem); resposta em `--t-body`,
  porque o `--t-small` citado no §4 não existe nos tokens (regra: só tokens existentes).
- Várias respostas podem ficar abertas ao mesmo tempo (sem `name` exclusivo no `<details>`).
- O JSON-LD `FAQPage` entra na Etapa 19 (SEO).

**Para revisar**
- `politicas.*` não vira pergunta automaticamente: a skill de preenchimento escreve o `faq[]`
  a partir das políticas. Confirmar se é isso que você quer.

---

## Etapa 15 — Seção 12: Gallery

**Feito**
- `components/sections/Gallery.tsx` (`id="gallery"`): faixa horizontal com o `Carousel` do modelo
  (scroll-snap nativo, setas, barra de progresso, arraste com o mouse), fotos com a mesma altura
  (`--gallery-h`) e largura pelo formato de cada foto (horizontal 3:2, vertical 2:3, quadrada
  1:1). Link "See the full gallery →" junto das setas (desktop) ou abaixo (mobile).
- `Carousel` ganhou `autoWidth` (slides na largura do próprio conteúdo).
- Template com 10 fotos de placeholder (cerimônia, recepção à noite, detalhes, casal, espaço
  vazio de dia…).

**Decisões**
- Token novo `--gallery-h` (48rem desktop / 32rem abaixo de 992px).
- No celular, foto horizontal é recortada para caber na tela (largura máx. = tela − gutters).
- H2 "Gallery" (o §4 não pede título; mantive o cabeçalho dos carrosséis do modelo).
- `galeria.mapa` (do venue.json) continua no `site.ts`; as fotos da página ficam em `galeria.fotos`.

**Para revisar**
- O link "See the full gallery →" aponta para `#`: não existe página de galeria no template.

---

## Etapa 16 — Seção 13: Check Your Date

**Feito**
- `FeaturedDestination` → `CheckYourDate` (`id="check-your-date"`, destino de todos os CTAs):
  foto full-bleed escurecida, card claro à direita (5/12) com H2, frase de apoio e formulário;
  no celular o card ocupa a largura toda.
- `components/ui/CheckDateForm.tsx`: Names · Email · Phone · Wedding date (com opção
  "Season / flexible", que troca a data por texto) · Estimated guests · Preferred contact
  (Text / Call / Email, em chips) · How did you hear about us (opcional). Botão `Check My Date`.
  Valida no navegador (campos obrigatórios, e-mail, nº ≥ 1), mostra erro e, com tudo certo,
  troca o formulário pela mensagem de sucesso. Nada é enviado (sem backend, como pede o §4).
- Depoimento com `destaque: true` aparece sobre a foto, ao lado do formulário (§1, princípio 4).
- A página agora segue exatamente a ordem do §3.

**Decisões**
- Campos em linha única com borda inferior (sem caixas arredondadas, no tom seco do modelo);
  rótulos em mono.
- Mensagem de sucesso: título fixo "Thank you — we got it." + texto de placeholder sobre quem
  responde e em quanto tempo (só se for verdade).
- O título grande sobreposto à mídia do modelo saiu; o H2 foi para o card, junto do formulário.

**Para revisar**
- Integração do formulário (e-mail, CRM ou planilha) fica para depois — é decisão de negócio.

---

## Etapa 17 — Seção 14: Footer

**Feito**
- Newsletter do footer removida (componente e CSS apagados — decisão da Etapa 1).
- No lugar dela: nome do venue + botão `Schedule a Tour` (CTA repetido).
- Links grandes = as seções ligadas (The Venue · Packages · Stay · FAQ · Check Your Date).
- Colunas: Visit (nome + endereço), Contact (telefone `tel:`, Text us `sms:`, e-mail
  `mailto:`), Follow (Instagram, Facebook). Cada item/coluna só aparece com dado.
- Base: logo/nome + "© ano nome", bloco opcional "As featured in" (liga em
  `secoes.footer.imprensa.enabled`, some com `imprensa` vazia) e "Website by [SUA MARCA]".
- `site.modelo` acabou: nenhum conteúdo do site modelo sobrou em `content/site.ts`.

**Decisões**
- "As featured in" mostra o **nome** das publicações em mono, não logos: logo de terceiros
  só com autorização (regra do CLAUDE.md). Com `link`, o nome vira link.
- Colunas de Legal (privacidade, cookies) saíram: o §4 não pede e o template não tem essas
  páginas.
- Ano do copyright calculado no build.

**Para revisar**
- "Website by [SUA MARCA]": definir o texto e o link do seu crédito (`secoes.footer.credito`).
- Páginas legais (privacidade) podem ser exigidas quando o formulário tiver backend.

---

## Etapa 18 — Mobile sticky bar

**Feito**
- `components/layout/MobileStickyBar.tsx`: barra fixa no rodapé abaixo de 768px, com
  `Schedule a Tour` (sólido, coluna mais larga) + `Text Us` (contorno, link `sms:`).
- Entra de baixo (`--dur-fast`) depois de rolar ~80% da primeira tela (fim do hero) e some
  quando o formulário final (`#check-your-date`) entra na tela — e continua escondida daí
  para baixo, onde o formulário e o CTA do footer já estão à vista.
- Respeita a área segura do iPhone (`env(safe-area-inset-bottom)`); `inert` quando escondida.
- Modo guia: a faixa "— · Mobile sticky bar" aparece logo acima da barra.

**Decisões**
- Colunas 3:2 e padding menor nos botões da barra: com 50/50 e o padding do botão M,
  "Schedule a Tour" era cortado em 375px.
- `enabled` da barra fica em `secoes.barra_mobile` (o §3 diz que não desliga, mas deixei o
  interruptor para casos especiais).

**Para revisar**
- Nada pendente.

---

## Etapa 19 — Revisão geral

**Feito**
- **SEO local (§5):** `<title>` "[Nome] | Wedding Venue in [Cidade], [UF]" a partir de
  `identidade` (corrigido: desde a revisão da Etapa 2 ele saía como `[object Object]`);
  meta description em `site.seo.descricao`; JSON-LD `EventVenue` (nome, endereço, telefone,
  e-mail, capacidade máx., redes) + `FAQPage` a partir do FAQ (`components/layout/JsonLd.tsx`,
  com `<` escapado como no guia do Next); `noindex` controlado por `site.seo.noindex` (true).
- **LCP:** foto do hero com `priority`; `next.config.ts` serve AVIF/WebP. Sem vídeo no template.
- **Responsivo:** conferido em 375, 390, 768, 820, 1024, 1440 e 1920 — sem rolagem horizontal
  da página. Corrigido um estouro de 7px no cabeçalho do The Spaces entre 768 e 991px.
- **Tokens órfãos:** 110 tokens removidos do `tokens.css` (sobras de mega-menu, menu More,
  busca, newsletter, modal, carrinho e dos cards de produto/destino/artigo), em passes até
  não sobrar nenhum; também o bloco de tablet que ficou vazio. 195 tokens restantes, todos em uso.
- **Código morto:** `site.modelo` zerado, `NewsletterForm` apagado, ícone `close` removido,
  rótulos de interface sem uso removidos, comentários que citavam menus/newsletter atualizados.
  Todo texto de interface (inclusive `aria-label`) vem de `content/site.ts`.
- **Checklist §6 do VENUE-TEMPLATE (o que dá para garantir no template):** CTA
  "Schedule a Tour" no header, hero, barra mobile, How It Works, FAQ, footer e formulário final
  (`#check-your-date`); página com `noindex`. Os demais itens (nenhum `[PLACEHOLDER]`, números
  confirmados, depoimentos só cortados, LCP < 2,5s no Lighthouse) valem na montagem de cada cliente.
- CLAUDE.md: árvore de pastas atualizada e um parágrafo "Como montar um cliente".

**Decisões**
- `--s-10` e `--s-11` (fim da escala de espaço) também saíram: não eram usados em lugar nenhum
  e a instrução foi remover todos os órfãos. Se um dia precisar, voltam.
- `app/specimen` (QA tipográfico da Fase 2) ficou: é interno, com `noindex`, e ainda serve
  para conferir a escala. Ele ainda tem textos de exemplo do site modelo.
- No template, o JSON-LD sai com os placeholders (o site é `noindex`); num cliente, ele sai
  com os dados reais automaticamente.

**Para revisar**
- Rodar Lighthouse (mobile) no primeiro cliente com fotos reais: o LCP depende da foto do hero.
- Apagar `app/specimen` se não for mais útil.

---

## Ajustes finais (depois da Etapa 19)

**Feito**
1. **The Spaces (desktop):** conferido — o bloco da esquerda já é sticky (fica a `--header-h`
   do topo enquanto os cards da direita rolam). O CSS é idêntico ao `SelectedStays` do
   `~/site-build` (comparado por diff, sem rodar nada lá). Sem mudança.
2. **Packages (< 768px):** a grade vira faixa horizontal com scroll-snap, cards de 28.5rem
   (`--stay-card-w-m`, a mesma largura dos cards do The Spaces), sangrando até a borda da tela.
3. **Footer:** laterais = `--gutter` (antes 17.5rem no desktop, herdado do modelo); o conteúdo
   alinha com as outras seções (34px em 1440, 17px em 375).
4. **Faixa creme antes do footer:** era o `margin-top: --section-y` do footer do modelo. Some
   quando a última seção é o Check Your Date (foto full-bleed); se ela for desligada, o
   respiro volta.
5. **Adicionais:** "See all add-ons" virou acordeão (`<details>`) na própria seção, com a lista
   completa (item + preço em mono). A linha de resumo mostra os 3 primeiros. Template com 5
   adicionais de placeholder.
6. **Galeria:** toque/clique numa foto abre a lightbox (`components/ui/Lightbox.tsx`: `<dialog>`
   nativo em tela cheia, setas na tela e no teclado, Esc e clique fora fecham, contador, página
   travada por trás). A faixa mostra até 12 fotos; "See the full gallery →" só aparece com mais
   de 12 e abre a lightbox com todas. Testado com 14 fotos (conteúdo de teste revertido).
7. **`app/specimen`** apagado (página e CSS). Nenhum token ficou órfão com isso.

**Decisões**
- Na lightbox, as setas ficam nas laterais no desktop e embaixo no celular (a foto ocupa a
  largura toda).
- O link da galeria virou botão com a cara do link sublinhado (não navega, abre a lightbox).

**Para revisar**
- Nada pendente.

---

## v2.1-venue-default — melhorias do cliente strawberry-creek (2026-09-28)

Estado: tudo commitado e com push; tag `v2.1-venue-default`.

**Pronto nesta sessão**
- `docs/comandos/` (retomar.md e salvar.md) commitado.
- Entrou todo o sistema das 38 linhas do MELHORIAS-TEMPLATE.md do cliente: scrim, logo claro e em texto,
  Getting Here, `tools/look` + `npm run look`, páginas internas, hero em vídeo + `tools/hero-video`,
  abertura "A Janela", loops de seção (`tools/loops`), fotos nítidas, Wedding Weekend com legenda,
  números digitados, card Schedule a Tour completo (slider, loop de fotos, SmoothInput, surgimento,
  celebração), regras de dev no CLAUDE.md, `.gitignore` e `.vercelignore`.
- `content/site.ts`: campos novos como placeholder ou `null` (`hero.videos: []`, loops `null`,
  `como_chegar`, `secoes.tour`, `secoes.abertura`, `paginas.*` via `paginaTemplate`); helper `foto()`
  exportado para os clientes, `semFoto()` para os placeholders. `lib/fotos.json` começa `{}`.
- Ficou de fora (é do cliente): textos, fotos, vídeos, `docs/venue.json`, REVISAR, FOTOS-LOOK,
  PROGRESS, MELHORIAS e a porta 3002. Exemplos com o nome do cliente trocados por genéricos.
- Build e lint sem erros; `next start` com `/`, `/the-venue`, `/packages`, `/stay`, `/?tour` e `?guide=1`
  em 200, com placeholders e nenhum texto do cliente.

**Em andamento**
- Nada.

**Pendente**
- Screenshots de QA em 1440 e 375, com e sem `?guide=1` (a extensão do Chrome estava desconectada).
- `npm run look` sem `media/originais/` não grava `lib/fotos.json`; o `{}` commitado cobre o template.
