# VENUE-TEMPLATE.md — Template de site para Wedding Venues (EUA)

> Documento de arquitetura do **template default**: o site em branco que serve de base
> para todo venue fechado. Lido pelo Claude Code junto com `CLAUDE.md` e `SITE-MESTRE.md`.
> O **sistema visual** continua sendo o do SITE-MESTRE (tokens, tipografia, componentes
> já construídos). Este arquivo define **quais seções existem, o que cada uma vende e
> como deve ser a copy.** O template não contém dados de nenhum venue real.

---

## 1. O objetivo do site (a regra que decide tudo)

O site tem **um único trabalho: fazer o casal agendar uma visita (tour) ou mandar uma
consulta de data.** Venue não fecha contrato pelo site — fecha na visita. Cada seção
existe para responder uma objeção do casal e empurrar para o CTA.

### A jornada do casal (e a seção que responde cada pergunta)

| Pergunta na cabeça do casal | Seção que responde |
|---|---|
| "Esse lugar é bonito / é o nosso estilo?" | Hero, Espaços, Galeria |
| "Cabe a gente? Fica onde?" | Faixa de números, Getting Here |
| "Quanto custa, mais ou menos?" | Pacotes (preço "a partir de") |
| "O que já vem incluído? Vou ter dor de cabeça?" | Pacotes, O Fim de Semana |
| "Onde a família fica?" | Hospedagem |
| "Outros casais gostaram?" | Depoimentos |
| "Posso levar minha bebida / meu cachorro / e se chover?" | FAQ |
| "Como funciona o próximo passo?" | Como funciona (3 passos) |
| "Minha data está livre?" | Formulário final |

### Princípios de conversão (valem para todas as seções)

1. **Um CTA primário em todo o site: "Schedule a Tour".** Secundário: "Check Your Date"
   / "Check This Date". Os dois abrem o mesmo card suspenso (§4, "Schedule a Tour (card)").
   Nunca mais de dois CTAs por seção.
2. **CTA visível sempre:** botão no header (desktop) + barra fixa no rodapé do celular
   ("Schedule a Tour" · "Text Us"). 70%+ das noivas navegam no celular.
3. **Transparência de preço vence.** Mostrar "Packages from $X" converte mais do que
   "entre em contato". Se o venue não divulga preço, usar "Pricing shared on your tour"
   — nunca inventar número.
4. **Prova social perto do CTA.** Um depoimento curto logo antes de cada bloco de ação.
5. **Objeção respondida = lead mais quente.** FAQ não é rodapé, é seção de venda.
6. **Formulário curto que qualifica:** quando (mês ou estação) e nº de convidados em chips,
   depois nome, e-mail e telefone. Nada além disso na primeira etapa.
7. **Velocidade:** hero com imagem otimizada (AVIF/WebP), vídeo só na sequência do §2 (por clipe: desktop < 2,5 MB, mobile < 1,5 MB, poster como LCP), LCP < 2,5s.

---

## 2. Como o template funciona

- **Todo texto do site vem de um único arquivo: `content/site.ts`.** Nenhum texto fica
  escrito dentro de componente. No template, esse arquivo contém só os placeholders de
  instrução. Para montar um cliente, basta trocar o conteúdo desse arquivo e as imagens.
  A estrutura de `content/site.ts` segue os nomes de campo do `venue.json` da skill de
  captura (os mesmos citados em "Dados" na seção 4), para a skill de preenchimento
  conseguir escrever nele direto depois.
- **Placeholder de instrução:** cada campo de texto do template mostra a instrução do
  que deve ir ali (ex.: "[PLACEHOLDER] Parágrafo de apresentação…"), no mesmo estilo
  tipográfico do texto final, para a página manter as proporções reais.
- **Placeholder de mídia:** bloco com `background: var(--c-line)` no aspect-ratio certo e
  um label em mono (ex.: `[FOTO — cerimônia ao ar livre, horizontal, mín. 2400px]`).
- **Modo guia (`?guide=1`):** com esse parâmetro na URL, cada seção mostra no topo uma
  faixa fina em mono com: número e nome da seção · trabalho (o que ela vende) · regra de
  copy principal. Sem o parâmetro, o site aparece limpo. Os textos do guia ficam em
  `content/guide.ts`.
- **Seções opcionais:** cada seção pode ser desligada em `content/site.ts`
  (`enabled: false`) — para venues sem hospedagem, sem oferta, etc.
- **Regra de copy para clientes:** números, prêmios, preços, nomes e anos só entram se
  existirem no site ou material do venue. Depoimentos podem ser cortados, nunca
  reescritos.
- **Idioma:** UI e copy final em **inglês americano**. Placeholders e guia em português
  (são para você, não para o cliente).
- **SEO:** o template já sai com `noindex`; ao publicar um cliente, remove-se.

---

## 2.1 O que muda em relação ao site modelo

| Site modelo (Montamont) | No template de venue | Ação |
|---|---|---|
| Header com Shop/Stays/Explore, More, search, cart | Header com The Venue · Packages · Stay · FAQ + Text us + botão Schedule a Tour | **Adaptar** |
| Mega-menu Explore | — | **Remover** |
| Dropdown More | — | **Remover** |
| Menu mobile | Menu mobile com os links novos | **Adaptar** |
| Hero | Hero | **Manter** (trocar botões e textos) |
| Manifesto/About | Intro / Story | **Manter** |
| Selected Stays (split) | The Spaces | **Adaptar** |
| Curated Collections | Your Wedding Weekend | **Adaptar** |
| Banner Passes | How It Works (3 passos) | **Adaptar** |
| Shop grid | Packages (sem carrinho, com lista de incluídos) | **Adaptar** |
| Journal (fundo escuro) | Love Notes (depoimentos) | **Adaptar** |
| Destino em destaque | Check Your Date (formulário) | **Adaptar** |
| Alpine Destinations | Stay On Site | **Adaptar** |
| Footer com imprensa e pagamentos | Footer com contato, links, CTA e crédito | **Adaptar** |
| Overlay de busca | — | **Remover** |
| Modal de newsletter | — | **Remover** |
| — | Announcement bar | **Criar** |
| — | Facts strip | **Criar** |
| — | FAQ (acordeão) | **Criar** |
| — | Gallery (faixa horizontal) | **Criar** |
| — | Mobile sticky bar | **Criar** |

Componentes de UI (Button, Tag, Badge, cards, link sublinhado), tokens, fontes e
animações ficam **exatamente como estão**. Código removido é apagado, não comentado.

---

## 3. Mapa de seções (ordem da home)

Cada seção reaproveita um componente já construído no site modelo sempre que possível.

| # | Seção (EN) | Componente de origem | Pode desligar? |
|---|---|---|---|
| 0 | Announcement bar | novo (faixa fina) | sim (sem oferta) |
| 1 | Header | Header | não |
| 2 | Hero | Hero | não |
| 3 | Facts strip | dados mono do "Passes" | sim |
| 4 | Intro / Story | Manifesto | não |
| 5 | The Spaces | Selected Stays (split) | não |
| 6 | Your Wedding Weekend | Curated Collections | sim |
| 7 | Packages | Shop grid | sim (venue sem pacotes) |
| 8 | Stay On Site | Alpine Destinations | sim (sem hospedagem) |
| 9 | Love Notes | Journal (fundo escuro) | sim (< 2 depoimentos) |
| 10 | How It Works | Passes banner (full-bleed) | não |
| 11 | FAQ | novo (acordeão) | não |
| 11b | Getting Here | novo (2 colunas + mapa) | sim (sem endereço) |
| 12 | Gallery | novo (faixa horizontal) | não |
| 13 | Check Your Date | Destino em destaque + chamada | não |
| 13b | Schedule a Tour (card) | novo (card suspenso, 3 páginas) | não (é o CTA do site) |
| 14 | Footer | Footer | não |
| — | Mobile sticky bar | novo | não |

---

## 4. Especificação seção por seção

Formato de cada seção: **Trabalho** (o que ela vende) · **Layout** · **Dados** (o que
precisa coletar do venue) · **Placeholder** (texto exato que aparece no template) ·
**Regras de copy**.

---

### 0. Announcement bar
- **Trabalho:** urgência real (datas com desconto, open house).
- **Layout:** faixa de 36–40px acima do header, fundo `--c-signal`, texto mono uppercase, link à direita.
- **Dados:** `oferta.valor`, `oferta.validade`.
- **Placeholder:** `[PLACEHOLDER] Oferta com prazo real — ex.: "Fall dates from $X · Oct–Nov only". Some se não houver oferta.`
- **Regras:** máx. 60 caracteres. Só usar oferta que existe no site do venue.

### 1. Header
- **Trabalho:** navegação + CTA sempre à mão.
- **Layout:** igual ao modelo. Esquerda: `The Venue · Packages · Stay · FAQ`. Centro: nome/logo. Direita: `Text us` (link `sms:`) + botão **Schedule a Tour**.
- **Links:** The Venue, Packages e Stay levam às páginas internas (ver "Páginas internas"); com a página desligada, voltam para a âncora da home. FAQ leva a `/#faq`. A página aberta fica sublinhada (`aria-current`).
- **Dados:** `identidade.nome`, `identidade.telefone`, `logo` (se `null`, nome em texto na serif).
- **Placeholder:** `[LOGO]` · botão `[Schedule a Tour]`.

### 2. Hero
- **Trabalho:** em 3 segundos dizer **o quê + onde + por que este**.
- **Layout:** Hero do modelo. Foto/vídeo full-screen e **pura (sem scrim)**, H1 de **1 frase só** na **serif**, subtítulo opcional (padrão: sem), 2 botões embaixo à esquerda, legenda de local no canto.
- **Dados:** `hero.titulo` (1 frase), `hero.subtitulo` (opcional; `null` = sem), `hero.foto`, `hero.videos` (opcional), `identidade.cidade/estado`, `numeros.distancia_cidade` (opcional).
- **Vídeo em sequência (opcional):** `hero.videos` = lista de clipes na ordem de exibição (`{ nome, alt, fonte, legenda? }`); `[]` = só a foto.
  - **Especificação:** 4 clipes de 5s, sem áudio. Desktop 16:9 **1280x720 < 2,5 MB** cada; mobile 9:16 **720x1280 < 1,5 MB** cada.
    Cada clipe em **MP4 (H.264) + WebM (VP9) + poster JPG** (1º quadro), nos dois formatos:
    `public/video/hero/desktop/<nome>.mp4|.webm|-poster.jpg` e o mesmo em `public/video/hero/mobile/`.
    Gerar com `tools/hero-video/` (ver o README de lá).
  - **Comportamento:** o `<picture>` do poster do clipe 1 é a imagem principal (LCP, `fetchPriority="high"`);
    a media query `(max-width: 767.98px)` (`lib/hero.ts`, o mesmo corte do layout) escolhe mobile ou desktop
    antes de carregar, e só aquele conjunto é baixado; se a janela passar desse corte, troca de conjunto. Os vídeos nascem depois do `load`; o 1º aparece com fade (`--hero-fade`, 800ms) por
    cima do poster; cada clipe toca uma vez, o próximo é pré-carregado 2s antes do fim e entra em **corte seco**
    (sem transição); depois do último volta ao 1º. `muted`, `autoplay`, `playsinline`, `aria-hidden`. Pausa fora da tela e com a aba oculta.
    Com reduzir movimento, Save-Data ou conexão 2g/3g: só o poster, nenhum vídeo baixado.
  - **Sem scrim:** a mídia do hero fica pura (foto, poster e clipes). Escolher foto/clipes com área escura ou calma atrás do título; o H1 tem só uma sombra difusa no texto (`--hero-title-shadow`).
- **Abertura "A Janela" (opcional, `secoes.abertura.enabled`, ligada por padrão):** só na 1ª visita da sessão à home.
  Ritmo de referência: pamidordesign.co (sem a troca rápida de fotos). Tempos do desktop; no celular tudo
  × `--abertura-ritmo` (0,85, ~15% mais rápida) e o nome **empilhado**, com a janela entre as duas linhas.
  1. **0–0,6s** (`--abertura-nome`, contado desde o início da navegação): papel `--c-paper` com o nome do venue
     grande na serif (`--t-abertura-nome`), centralizado. Nome = `secoes.abertura.nome` (null = `identidade.nome_logo`,
     ou `identidade.nome`). Já está no HTML: aparece na 1ª pintura, sem JS.
  2. **0,6–1,0s** (`--abertura-abre`): o nome se abre no ponto de divisão (`secoes.abertura.divisao` = o começo do
     nome, ex. `"Willow"`; null = na palavra do meio, ou no meio das letras) e entre as partes surge uma janela
     4:5 de `--abertura-janela-h` (14vh) com o **clipe 1 já tocando** (sem vídeo a tempo: o poster do clipe 1; hero
     sem vídeo: a foto). As partes se afastam por igual a partir do ponto de divisão.
  3. **1,0–2,2s** (`--abertura-pausa`): pausa; a janela cresce `--abertura-cresce` (10%) e as palavras acompanham.
  4. **2,2–3,2s** (`--abertura-expande`): a janela se expande (`clip-path`) até cobrir o hero; as palavras saem
     pelos lados (no celular, para cima e para baixo), empurradas pelas bordas da janela.
  5. **3,2–4,0s**: o papel some; header e faixa de anúncio **descem**, o H1 entra **linha por linha** com máscara
     (as palavras são agrupadas pela linha em que caíram na tela), subtítulo, botões e legenda em fade
     (`--abertura-hero-texto` 500ms, `--abertura-stagger` 100ms).
  - **Sem emenda:** a janela não é outro vídeo. É um recorte da própria mídia do hero (`[data-hero-midia]`), que
    durante a abertura fica acima do papel (`--z-abertura` + 1) e começa recortada a nada. O `HeroSequence` começa
    a baixar e tocar o clipe 1 na hora, embaixo do papel; quando o recorte chega ao tamanho do hero, a mídia volta
    ao lugar e o vídeo segue, sem recomeçar e sem baixar outro arquivo.
  - **Código:** Framer Motion (`animate` em motion values), `components/ui/Abertura.tsx`; curvas e tempos em tokens
    (`--abertura-*` em `tokens.css`); `dividirNome()` em `lib/abertura.ts`.
  - **Regras:** a decisão é de um script inline no `<head>` (`lib/abertura.ts` → `app/layout.tsx`), antes da 1ª
    pintura: marca `data-abertura="on"` no `<html>` e grava `abertura-vista` no `sessionStorage`, então quem já viu
    não tem abertura nem piscada. Clique, rolagem ou tecla pulam para o final (o vídeo continua). Com reduzir
    movimento: sem abertura. Se o JS não assumir em 3s, o script tira o papel.
  - **SEO e LCP:** o conteúdo do hero está no HTML e **pintado desde a 1ª pintura, embaixo do papel** (opaco);
    o 1º quadro de cada entrada só é posto quando o papel sai. Esconder o H1 desde o início empurrava
    o LCP para depois da abertura (medido na versão anterior: +1,2s no Lighthouse mobile).
  - **Páginas internas:** sem abertura; só a entrada do H1 (a mesma máscara), a cada visita (`EntradaTitulo`).
- **H1 da home:** na serif (Newsreader 400), `--t-hero-home` (8.8rem no desktop, 4.4rem no celular), `--lh-hero-home` 1.02,
  `--ls-hero-home` -0.015em, largura máxima `--hero-home-title-max` (110rem, 2 linhas equilibradas) e `text-wrap: balance`.
  As páginas internas continuam com o `--t-hero` em sans.
- **Legenda por clipe (opcional):** `hero.videos[].legenda` = texto curto (2 a 5 palavras) do que o clipe mostra; no
  canto do hero, em mono, com o número (`01/04`), troca junto com a sequência (`HeroLegenda`, evento `hero:clipe`
  do `HeroSequence`), acima da legenda de local. Só no desktop, como a legenda de local.
- **Placeholder nome da abertura:** `[PLACEHOLDER] Nome na abertura: curto (1 a 3 palavras, o nome pelo qual o venue é chamado) e onde ele se divide para a janela abrir entre as partes. Sem nome, usa o do logo e divide na palavra do meio.`
- **Placeholder legenda do clipe:** `[PLACEHOLDER] Opcional, por clipe: legenda de 2 a 5 palavras do que o clipe mostra (ex.: "The pavilion at dusk"), em mono no canto do hero enquanto ele toca.`
- **Placeholder vídeo:** `[PLACEHOLDER] Opcional: 4 clipes de 5s do venue (MP4 + WebM + poster), desktop 1280x720 < 2,5 MB e mobile 720x1280 < 1,5 MB, em public/video/hero/desktop e /mobile. Sem vídeo, fica a foto. Gerar com tools/hero-video/.`
- **Placeholder H1:** `[PLACEHOLDER] H1 de 1 frase, na serif: elegante como uma frase de revista, com a busca do casal dentro = casamento/wedding + o tipo de lugar mais específico que for verdade + cidade + estado (ex.: "Barn weddings in the hills of Knoxville, Tennessee" · "Casamentos na fazenda em Atibaia, São Paulo"). 5 a 9 palavras, sem clichê e sem cara de lista de palavras-chave.`
- **Regra do H1 (SEO + elegância):** é o único H1 da home e a frase que o Google lê primeiro, então leva os termos da busca (casamento/wedding, o tipo de lugar — barn, estate, garden, fazenda, sítio… —, cidade e estado, no idioma do site), mas escritos como uma frase que se lê em voz alta, não como "Barn wedding venue in Knoxville, TN". Estado por extenso quando couber. A busca literal fica no `<title>` (`[Nome] | Wedding Venue in [Cidade], [UF]`). O diferencial vai para a Intro e para os números.
- **Placeholder subtítulo (opcional):** `[PLACEHOLDER] Opcional (padrão: sem subtítulo). 1 frase com lugar + capacidade ou área. Ex.: "A 55-acre estate for up to 300 guests, 20 minutes from downtown."`
- **Botões:** `Schedule a Tour` (primário) · `See Packages` (glass).
- **Legenda:** `CIDADE — ESTADO / região` em mono (com vídeo, acima dela a legenda do clipe da frente).
- **Regras:** não usar "dream wedding", "magical", "perfect day" — clichês que todo venue usa.

### 3. Facts strip
- **Trabalho:** responder "cabe? é sério?" com números, sem ler.
- **Layout:** faixa horizontal em mono, 3–5 itens separados por linha fina (`--c-line`), estilo dos dados do bloco "Passes".
- **Dados:** `numeros.*`, `hospedagem.length`.
- **Placeholder:** `[PLACEHOLDER] 3 a 5 números verificáveis: capacidade · acres · ano de fundação · nº de hospedagens · distância da cidade.`
- **Movimento:** cada número é digitado letra a letra (mono, cursor `_` piscando) quando a faixa entra na tela, um item depois do outro (`TypeText`); o texto inteiro fica no HTML e reserva o espaço (sem salto de layout); com reduzir movimento, aparece inteiro.
- **Regras:** só números com `fonte`. Nunca arredondar para cima.

### 4. Intro / Story (a seção da sua captura de tela)
- **Trabalho:** criar conexão emocional e dizer por que o lugar é diferente.
- **Layout:** Manifesto do modelo. Texto grande `--t-lead`, ~8 colunas + link.
- **Dados:** `historia.origem`, `historia.diferencial`, `historia.donos` (opcional).
- **Placeholder:** `[PLACEHOLDER] Parágrafo de apresentação do venue em 3–4 frases: de onde veio o lugar (história real), o que o casal sente ao chegar, e o diferencial concreto. Tom editorial, sem clichês. Termina puxando para o CTA.`
- **Link:** `Explore the venue →` (página The Venue ligada) ou `[Schedule a Tour →]`.

### 5. The Spaces
- **Trabalho:** mostrar onde cada momento acontece (cerimônia, recepção, fotos, arrumação).
- **Layout:** Selected Stays (split assimétrico). Esquerda: espaço-herói grande com selo amarelo. Direita: eyebrow `THE SPACES` + H2 + lista de cards.
- **Dados:** `espacos[]` → `{ nome, uso, descricao, capacidade, foto, tags }`.
- **Placeholder H2:** `[PLACEHOLDER] Título que resume o conjunto — ex.: "One property, every moment."`
- **Placeholder card:** `[PLACEHOLDER] Nome do espaço · USO (CERIMÔNIA / RECEPÇÃO / FOTOS / PREPARAÇÃO) · 2 frases sobre como é estar ali · tags: Indoor, Outdoor, Rain plan, capacidade.`
- **Selo do espaço-herói:** o diferencial nº 1 (ex.: `240-YEAR-OLD CABIN`).

### 6. Your Wedding Weekend
- **Trabalho:** vender a **experiência completa** (não só o sábado) e reduzir o medo de "dá trabalho".
- **Layout:** Curated Collections — 3 cards de foto grande, pura (sem degradê), só com o título por cima; momento + número, frase e itens numa legenda embaixo da foto (texto escuro no fundo do site) + 1 card final escuro só com o título.
- **Dados:** `inclusos[]`, `hospedagem[]`, `servicos_extras[]`.
- **Placeholder:** `[PLACEHOLDER] 3 cards em sequência temporal: Antes (ensaio, arrumação, chegada) · O dia (cerimônia, recepção, equipe) · Depois (noite no local, café, check-out). Cada card: título curto + 1 frase + itens reais incluídos. 4º card: "See what's included →".`
- **Regras:** só itens que existem em `inclusos`. Nada de "brunch" se o venue não oferece.
- **Loop em vídeo (opcional, por card):** `cards[].video: { nome, fonte }` (`LoopSecao`; `null` = só a foto). Arquivos em `public/video/loops/`: `<nome>.webm` (VP9), `<nome>.mp4` (H.264) e `<nome>-poster.jpg`, sem áudio, loop sem emenda, mesma proporção do quadro. O poster entra no lugar da foto (next/image) e o vídeo (`LoopVideo`) toca por cima: `muted autoplay loop playsinline`, `aria-hidden`, sem controles; só nasce perto da tela, pausa fora dela e com a aba oculta, entra com fade (`--hero-fade`). Só o poster com reduzir movimento, Save-Data ou conexão lenta (`semVideo()`, o mesmo critério do hero). Gerados com `tools/loops/` (Kling a partir de uma foto do venue). Tamanho: 720×1008 (5:7), < 1,2 MB. O título branco continua por cima: conferir o contraste sobre o clipe.

### 7. Packages
- **Trabalho:** ancorar preço e mostrar que é simples escolher.
- **Layout:** Shop grid do modelo, 3–4 cards. Cada card: nome, preço ("From $X" / "Pricing on your tour"), para quem é (1 linha), lista de incluídos (máx. 6 visíveis + "+N more"), botão `Check This Date`. O pacote mais completo leva selo `MOST CHOSEN` **só se o venue disser isso**.
- **Dados:** `pacotes[]` → `{ nome, preco, para_quem, inclui[], fonte }`, `adicionais[]`.
- **Placeholder H2:** `[PLACEHOLDER] Título + preço de entrada — ex.: "Packages from $X".`
- **Placeholder card:** `[PLACEHOLDER] Nome do pacote · preço "a partir de" (ou "Pricing on your tour") · para quem é · 4–6 incluídos mais valiosos primeiro.`
- **Abaixo do grid:** linha `Add-ons: heaters, fire pits, farm tables…` com link para lista completa.

### 8. Stay On Site
- **Trabalho:** diferencial enorme nos EUA ("wedding weekend"). Resolve "onde a família fica".
- **Layout:** Alpine Destinations — 2 cards grandes + cards "Also on site" menores.
- **Dados:** `hospedagem[]` → `{ nome, dorme, no_local, foto, link_reserva }`.
- **Placeholder:** `[PLACEHOLDER] Título sobre ficar no local + 1 frase. Cards: nome da hospedagem · "SLEEPS X" em mono · 1 frase de uso (noivas se arrumando, suíte de lua de mel, família).`
- **Regras:** separar "no local" de "próximo" se o dado disser. Se não houver hospedagem, a seção some.

### 9. Love Notes
- **Trabalho:** prova social. Fundo escuro para criar "capítulo".
- **Layout:** Journal do modelo (fundo `--c-ink`). Citação curta em serif grande + nome + data em mono. 3–4 cards.
- **Dados:** `depoimentos[]` → `{ texto, nome, data, destaque }`.
- **Placeholder:** `[PLACEHOLDER] Depoimento real, cortado na frase mais forte (máx. 35 palavras). Nome + "MARRIED MÊS ANO" se houver.`
- **Regras:** pode **cortar** o depoimento, nunca **reescrever** palavras. Priorizar frases que respondem objeções (equipe, preço, facilidade).

### 10. How It Works
- **Trabalho:** tirar o medo do próximo passo.
- **Layout:** Passes banner — foto full-bleed + card com 3 passos numerados em mono (`01 02 03`).
- **Dados:** `processo[]` (fallback padrão se `null`: Inquire → Tour → Book).
- **Loop em vídeo (opcional):** `secoes.processo.video: { nome, fonte }` (`LoopSecao`; `null` = só a foto). Arquivos em `public/video/loops/`: `<nome>.webm` (VP9), `<nome>.mp4` (H.264) e `<nome>-poster.jpg`, sem áudio, loop sem emenda, mesma proporção do quadro. O poster entra no lugar da foto (next/image) e o vídeo (`LoopVideo`) toca por cima: `muted autoplay loop playsinline`, `aria-hidden`, sem controles; só nasce perto da tela, pausa fora dela e com a aba oculta, entra com fade (`--hero-fade`). Só o poster com reduzir movimento, Save-Data ou conexão lenta (`semVideo()`, o mesmo critério do hero). Gerados com `tools/loops/` (Kling a partir de uma foto do venue). A foto é full-bleed: o clipe precisa de pelo menos 1920 px de largura para não ficar mole no desktop.
- **Placeholder:** `[PLACEHOLDER] 3 passos do primeiro contato ao dia: 01 Consulta (quem responde e em quanto tempo) · 02 Visita (presencial/virtual) · 03 O fim de semana.`

### 11. FAQ
- **Trabalho:** responder objeções antes que virem motivo para não ligar.
- **Layout:** novo. 2 colunas no desktop: esquerda H2 `Good to know` + CTA; direita acordeão. Pergunta em sans, resposta em `--t-small`.
- **Dados:** `faq[]` + `politicas.*`. Ordem: capacidade → preço → bebida → chuva → horário → fornecedores → pets → estacionamento.
- **Placeholder:** `[PLACEHOLDER] 6–8 perguntas reais do venue, na ordem das objeções mais comuns. Resposta em 1–3 frases, com o número exato quando existir.`

### 11b. Getting Here
- **Trabalho:** responder "fica longe? onde meus convidados ficam?" — distância é objeção real para quem vem de fora.
- **Layout:** novo, 2 colunas no desktop como o FAQ. Esquerda: eyebrow `GETTING HERE` + H2 curto + 1 frase, lista de tempos de carro em mono (`20 MIN · DOWNTOWN`), endereço completo e link `Open in Google Maps`. Direita: mapa do Google Maps em iframe (sem chave de API), criado só quando a seção chega perto da tela. Embaixo, bloco `Where guests stay`: 1 frase sobre a hospedagem no próprio venue (link para Stay, se a seção estiver ligada) + hotéis ou cidades próximas.
- **Dados:** `identidade.endereco` (obrigatório), `como_chegar.destinos[]` → `{ destino, tempo, fonte, confianca }`, `como_chegar.proximos[]`.
- **Placeholder:** `[PLACEHOLDER] Título curto sobre chegar ao venue + 1 frase. 3 a 5 tempos de carro verificáveis ("20 MIN · DOWNTOWN"), incluindo o aeroporto mais próximo. Endereço completo + link do Google Maps.` · `[PLACEHOLDER] 1 frase sobre a hospedagem no próprio venue + hotéis ou cidades próximas, só se o venue citar.`
- **Regras:** tempos medidos no Google Maps a partir do endereço (confiança média, anotar a data da medição); nunca arredondar para baixo. Hotéis só se o venue citar — se faltar, vira pergunta para a call. Sem endereço, a seção some.

### 12. Gallery
- **Trabalho:** "quero me ver ali".
- **Layout:** faixa horizontal com scroll-snap, fotos de alturas iguais e larguras variadas, link `See the full gallery →`.
- **Dados:** 8–12 fotos do venue, mín. 1200px de largura.
- **Placeholder:** `[PLACEHOLDER] 8–12 fotos reais: cerimônia, recepção à noite, detalhes, casal, espaço vazio de dia. Nada de banco de imagens.`

### 13. Check Your Date (CTA final)
- **Trabalho:** última chamada para o tour.
- **Layout:** Destino em destaque — foto full-bleed de fundo, depoimento de destaque e card claro com H2 + 1 frase + botão `Schedule a Tour`, que abre o card da 13b (não há mais formulário na página).
- **Placeholder H2:** `[PLACEHOLDER] Chamada direta para checar a data — ex.: "Is your date still open?"`
- **Placeholder apoio:** `[PLACEHOLDER] 1 frase sobre quem responde e em quanto tempo (só se for verdade).`
- **Regras:** `id="check-your-date"` fica (a barra mobile some quando a seção chega na tela).

### 13b. Schedule a Tour (card)
- **Trabalho:** capturar o lead em 3 passos curtos, sem tirar a pessoa da página em que ela está.
- **Como abre:** todo link com `href="/?tour"` (`site.cta.href`, `TOUR_HREF` em `lib/tour.ts`) — header, hero, menu, barra mobile, How It Works, FAQ, Spaces, pacotes, footer, seção 13. O `TourProvider` (no `app/layout.tsx`) intercepta o clique antes do next/link. Link direto / sem JS: `/?tour` abre a home com o card aberto (e sem a abertura animada); a URL é limpa.
- **Card:** centralizado sobre o site escurecido e desfocado (`--c-tour-fundo`, `--tour-blur`), largura `--tour-w` (560px) no desktop; no celular o mesmo card com `--tour-margem` (16px) nas laterais. Entra com fade + leve subida, X no canto, Esc e clique fora fecham, foco preso no card e devolvido ao botão de origem, rolagem da página travada e o resto do site `inert`. Tela baixa: o conteúdo rola dentro do card.
- **Fotos ao lado (768px ou mais):** `secoes.tour.fotos` (`{ foto, titulo }[]`, 3 recomendadas; `[]` = card sem foto, 1 = fixa sem tracinhos) à esquerda do formulário (só visual, `order: -1`; no DOM o formulário vem antes), recuadas com moldura de papel `--tour-foto-inset` (8px) e cantos `--tour-foto-r` (8px); card com cantos `--tour-r` (12px) em todas as larguras. Card mais vertical: `--tour-w-foto` 880px × `--tour-h-foto` 600px (mínimo), formulário `--tour-w-form-foto` 460px com as perguntas no meio da altura, foto em retrato (~412 × 584). **Loop:** 4s por foto (`FotosTour`, crossfade `--tour-foto-fade` 0,6s, título troca junto subindo 8px), volta à 1ª, pausa com a aba oculta, parado na 1ª com reduzir movimento; tracinhos na base (`--tour-traco-w` 16px em `--c-traco`, o da foto na tela `--tour-traco-ativo-w` 40px em branco). Cada título em branco no alto (`--t-tour-foto`, peso de título, scrim `--c-scrim` → transparente em `--tour-scrim-h`, contraste ≥ 4.5:1 medido por foto): a vontade do venue de receber o casal, máx. 6 palavras, um diferente por foto. Fotos decorativas (`aria-hidden`), com área escura no alto. **No celular (< 768px) o card fica só com o formulário** (as fotos nem baixam): a página 1 já ocupa ~2/3 da tela.
- **Página 1:** "When are you thinking?" — chips com os próximos 4 meses, as 3 estações seguintes e "Still flexible" (`opcoesQuando()`); "How many guests?" — barra deslizante (`SliderConvidados`, `<input type="range">` nativo de faixa em faixa) com as faixas de 50 em 50 até `numeros.capacidade_max` (`faixasConvidados()`: Under 50 · 50–100 · 100–150 · 150–cap; sem capacidade, "150+"): trilho `--c-trilho` preenchido em `--c-ink` até o puxador (`--tour-puxador` 20px, cantos `--r-chip`), uma marca por faixa (`--tour-marca-h`) e o rótulo de cada faixa sempre visível embaixo (o escolhido em `--c-ink`, clicar no rótulo escolhe); setas, Home e End pelo teclado, `aria-valuetext` "100–150 guests"; sem resposta, puxador apagado no início e qualquer toque ou tecla grava. Os chips do "quando" são rádios nativos (setas trocam a opção). `Continue` só com as duas respostas.
- **Página 2:** Name · Email · Phone, com rótulo visível, `autocomplete`, fonte ≥ 16px (`--t-input-min`), erro por campo (`aria-invalid` + `aria-describedby`) e `Back` discreto.
- **Página 3:** "Thank you, {nome}." · resumo em 1 linha em mono (mês + convidados) · `secoes.tour.obrigado.texto` · "<`identidade.quem_responde`> will reach out soon." (null = "We'll reach out soon.") · "For the quickest reply, text <telefone>" (`sms:`) · `Back to the site` e `Start over`.
- **Barra de status:** `--tour-barra-h`, solta na base da coluna do formulário (alinhada ao conteúdo, pontas arredondadas), 50% na página 1 → 100% na 2 (`role="progressbar"`).
- **"Check This Date" de um pacote:** `pacotes[].convidados` (nº para quem o pacote é feito) marca a faixa que o contém (`data-tour-convidados` no botão). Sem o campo, nada vem marcado.
- **Estado:** `sessionStorage` `tour` (página, respostas, contato); reabrir continua de onde parou; mês que já passou é desmarcado.
- **Envio:** `submitTour()` em `lib/tour.ts` é o único ponto para plugar e-mail/CRM; hoje só valida e mostra a página 3.
- **Movimento:** Framer Motion; páginas trocam com fade + 12px na direção do passo, altura do card acompanha, barra anda em 0,4s. Reduzir movimento: tudo instantâneo.
- **Placeholders:** `[PLACEHOLDER] 1 frase calorosa e honesta depois do envio: recebemos, vamos combinar a visita. Nunca "booked" ou "confirmed".` · `[PLACEHOLDER] Quem responde (ex.: "our Venue Director", "Sarah"), só se for verdade.`
- **Regras:** texto honesto — pedido de visita, nunca "booked"/"confirmed". Faixa 13b no `?guide=1` (dentro do card).

### 14. Footer
- Nome + endereço + telefone + e-mail + redes · links das seções · CTA repetido `Schedule a Tour` · "Website by [SUA MARCA]" (seu crédito = seu marketing).

### Mobile sticky bar
- Fixa no rodapé em telas < 768px, aparece após o hero: `Schedule a Tour` (sólido) · `Text Us` (link `sms:`). Some quando a seção Check Your Date está na tela.

---

## 4.1 Páginas internas (The Venue, Packages, Stay)

Três páginas com a mesma estrutura, copiada da página About do site modelo (montamont.com/about,
medida em 2026-09-27). Componente compartilhado `components/pages/InternalPage.tsx`; conteúdo em
`content/site.ts → paginas.<id>`; rotas `/the-venue`, `/packages`, `/stay`. Cada página pode ser
desligada (`enabled: false`) e some também sem o dado do bloco central (sem espaços, pacotes ou
hospedagem) — aí os links voltam para a âncora da home.

**Ordem (igual nas três):**

| # | Parte | Origem no modelo | Dados |
|---|---|---|---|
| a | Hero: foto em tela cheia com H1 no centro (1 frase curta, só na sans, máx. 5 palavras), breadcrumb `Home / Página` abaixo, subtítulo de ~40 palavras em `--t-lead` | page-hero + intro-text | `titulo`, `subtitulo`, `foto`, `nome` |
| b | Apresentação: eyebrow + título à esquerda, ~120 palavras à direita | text-media-scroller (texto) | `apresentacao.{eyebrow,titulo,texto[]}` |
| c | 3 legendas em mono (01 02 03), 10–20 palavras cada, **sem foto** | legendas do text-media-scroller | `legendas[]` |
| d | Bloco da página (abaixo) | — | dados que já existem |
| e | Prova social: selos `As featured in` (só nomes) + 1 depoimento escolhido para a página | press-coverages | `imprensa[]`, `depoimento` (índice) |
| f | Chamada Check Your Date (a mesma da home; abre o card Schedule a Tour) | default-cta | `secoes.checar_data` |

**Blocos centrais (reusam os componentes da home):**
- **The Venue:** faixa de números + **todos** os espaços (título `secoes.espacos.todos`), cada um
  com `descricao_completa` (ou a `descricao`) e todas as tags. Espaço com `so_na_pagina: true`
  aparece só nessa lista. (A seção The Spaces da home não entra: repetiria os mesmos espaços.)
- **Packages:** oferta em destaque (some sem `oferta.valor`) · todos os pacotes com a lista
  **completa**, sem "+N more" (título `secoes.pacotes.pagina.completo`) · adicionais com preço · o que não está incluído (`nao_inclusos`)
  · as perguntas do FAQ de preço, bebida e capacidade (pelo `tema` de cada pergunta,
  `secoes.pacotes.pagina.faq_temas`).
- **Stay:** todas as hospedagens (cards menores em grade, sem carrossel) + linha do tempo
  Your Wedding Weekend (card final → página Packages) + Getting Here.

**Home:** cada seção correspondente ganha o link para a página: Intro → `Explore the venue →`,
Packages → `See all packages →`, Stay On Site → `See all stays →` (texto em `paginas.<id>.link_home`).

**Placeholders (template):**
- H1: `[PLACEHOLDER] H1 de 1 frase curta, só na sans (sem 2ª linha em serif): o assunto da página com o dado que mais pesa. Máx. 5 palavras.`
- Subtítulo: `[PLACEHOLDER] ~40 palavras sobre o que o casal encontra nesta página, com os números reais do assunto (capacidade, preço de entrada, nº de hospedagens). Sem clichês.`
- Apresentação: `[PLACEHOLDER] Título curto com o argumento central da página.` · `[PLACEHOLDER] ~120 palavras em 2 parágrafos, só com fatos do venue.json (história, diferencial, o que está incluído, como funciona). Tom editorial, sem clichês. Termina puxando para o tour.`
- Legenda: `[PLACEHOLDER] Legenda de 10–20 palavras: 1 fato real e concreto do assunto da página (espaço, item incluído, horário).`
- Meta description: `[PLACEHOLDER] Meta description da página: cidade + assunto + 1 número real. Máx. 155 caracteres.`

**Regras:** as mesmas da home — só fatos com fonte, sem clichês, depoimento cortado e nunca
reescrito, foto do hero real. Modo guia: faixa `P1/P2/P3` no topo de cada página explicando o
trabalho dela, mais as faixas da apresentação, das legendas e da prova social.

**SEO por página:** `<title>` `[seo.titulo] | [Nome]`, meta description (`seo.descricao`),
canonical (`seo.url` ou `identidade.site` + rota) e JSON-LD `BreadcrumbList` (Home → página).
`noindex` vem do layout, como na home.

---

## 5. SEO local (entra em todo venue)
- `<title>`: `[Nome] | Wedding Venue in [Cidade], [UF]` (páginas internas: ver §4.1)
- Meta description com cidade + capacidade + diferencial.
- JSON-LD `EventVenue` (nome, endereço, telefone, capacidade máx.) + `FAQPage` a partir do FAQ.
- Canonical em todas as páginas (`seo.url` ou `identidade.site`; sem domínio válido, sai sem canonical).
- Template e demos de venda sempre com `noindex`.

---

## 6. Checklist ao montar um cliente a partir do template
- [ ] Nenhum `[PLACEHOLDER]` visível no site do cliente
- [ ] Todo número confirmado no site ou material do venue
- [ ] Depoimentos só cortados, nunca reescritos
- [ ] CTA "Schedule a Tour" abre o card em header, hero, mobile bar, pacotes e seção final; `/?tour` abre direto
- [ ] `identidade.quem_responde` e `pacotes[].convidados` preenchidos só com dado real; `submitTour()` ligado ao e-mail/CRM antes de publicar
- [ ] LCP < 2,5s no celular (Lighthouse)
- [ ] Página com `noindex`
