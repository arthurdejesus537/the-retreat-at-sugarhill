# SITE MESTRE — Blueprint de Construção
**Referência:** https://montamont.com (home) · WordPress + tema próprio `mon` · design/dev: Huangart
**Objetivo:** reconstruir o *sistema visual e estrutural* desse site, trocando marca, conteúdo e mídia pelos nossos.
**Pasta do projeto:** `pedroivo/site-build/`

> **Legenda de confiabilidade**
> ✅ = confirmado (HTML real, meta tags ou catálogo de fontes/cores)
> 🔶 = estimado por padrão de design do site — confirmar com o script da seção 12 antes de fechar tokens

---

## 1. DNA do site (leia antes de tudo)

Montamont é um **guia editorial de luxo** (hotéis + destinos + loja). O design funciona por 5 princípios:

1. **Imagem/vídeo manda, texto acompanha.** Quase toda seção abre com mídia grande (vídeo em loop, foto editorial, ilustração). Texto é esparso e posicionado na área "calma" da imagem.
2. **Contraste de três vozes tipográficas:** Grotesk neutra (UI e texto), Serif elegante (emoção/títulos), Mono (dados, metadados, rótulos técnicos).
3. **Paleta quase monocromática quente** (creme + preto quase puro) com **um único acento amarelo-limão** usado só em selos/labels.
4. **Ritmo claro ↔ escuro:** seções em creme alternam com blocos pretos (Journal, Footer) para dar "respiro" e capítulos.
5. **Tom espirituoso nos detalhes:** estado vazio do carrinho com `¯\_(ツ)_/¯`, busca com SVG animado "idle". Luxo sem ser sisudo.

---

## 2. Paleta de cores ✅ (medido em 2026-09-25)

| Token | HEX | Uso | Variável no site original |
|---|---|---|---|
| `--c-paper` ✅ | `#F9F7F5` | Fundo principal (`html`, também `theme-color`) | `--cd-glacier-light--400` |
| `--c-ink` ✅ | `#1D1D1C` | Títulos, nomes de card, links, texto principal | `--cd-black` |
| `--c-black` ✅ | `#000000` | Fundo das seções escuras (Journal, Footer) | `--black--400` |
| `--c-text` ✅ | `#222222` | Descrição de card | `--black--200` |
| `--c-graphite` ✅ | `#444444` | Cor de texto padrão herdada do `html`/`body` | `--black--100` |
| `--c-stone` ✅ | `#969696` | Meta, eyebrow, localização, labels do footer | `--gray--250` |
| `--c-signal` ✅ | `#FEFA8D` | **Acento único**: selos "Bestseller", "New Alpine Icon" | `--cd-lemon-whisper` |
| `--c-white` ✅ | `#FFFFFF` | Texto sobre mídia e sobre fundo preto; fundo do botão branco | `--white` |
| `--c-chip` ✅ | `#E0DEDC` | Fundo do chip no fundo creme | `--cd-glacier-light--450` |
| `--c-grid-line` ✅ | `#EDEBE9` | Linhas de 1px da grade decorativa de fundo | `--cd-glacier-light--425` |
| `--c-chip-dark` ✅ | `rgba(255,255,255,.15)` | Fundo do chip no fundo preto | `--white-opacity--15` |
| `--c-tag-dark` ✅ | `#757575` | Texto do chip no fundo preto | `--gray--260` |
| `--c-meta-dark` ✅ | `rgba(255,255,255,.85)` | Data do card sobre fundo preto | `--white-opacity--85` |

> Nota: o texto e o fundo dos botões usam `#181818` (`--black--300`), não o `--c-ink`. Na Fase 4 isso virou
> `--c-btn-ink`; os hovers e focos de botão também têm tokens próprios (`--c-btn-hover`, `--c-btn-dark-hover`, `--c-focus-*`).

Derivados ✅ (Fase 15): nenhum overlay de gradiente é usado no original. O texto branco fica direto sobre a mídia, com
`brightness(.8)` quando é preciso contraste. A divisória clara é `--c-line: #DDDDDD` (medida no header). Os derivados
estimados `--c-line-dark` e `--c-overlay` foram descartados.

**Regras de uso**
- 80% creme, ~15% preto, ~5% amarelo. Nunca use o amarelo em textos corridos ou botões grandes — só em selos pequenos (texto preto sobre amarelo).
- Não existe cor "de marca" chamativa: a mídia traz a cor.
- ⚠️ Acessibilidade: o texto meta `#969696` sobre `#F9F7F5` tem contraste de ~2.8:1, abaixo do AA (4.5:1). Herdado do
  original e mantido por fidelidade. Se a marca pedir AA, escurecer `--c-stone` (ex.: `#767676` dá 4.5:1).
- Para adaptar à nossa marca: troque **apenas** `--c-signal` pela cor-assinatura e ajuste `--c-paper` se quiser um off-white de outro matiz. Se mudar `--c-paper`, ajuste junto `--c-chip` e
  `--c-grid-line`, que são a mesma família "glacier" em tons mais escuros. O resto mantém.

---

## 3. Tipografia ✅ (medido em 2026-09-25, 1440×900 e 1680×900; mobile na §9)

### Famílias originais (comerciais — exigem licença)
| Papel | Original | Fundição |
|---|---|---|
| Sans (UI, corpo, navegação) | **ABC Diatype** (servida como `"ATC Diatype"`, pesos 400/700) | Dinamo |
| Mono (dados, labels, datas) | **ABC Diatype Mono** (servida como `"ATC Diatype Mono"` 400/700 + `"ABC Diatype Mono"` 500) | Dinamo |
| Serif (títulos de artigo, fallback do `html`) | **GT Alpina** (usada em peso 300) | Grilli Type |

> ✅ Medido: o `html` declara `font-family: "GT Alpina"; font-weight: 300`, mas **todo texto visível de UI** sobrescreve para Diatype.
> A serif aparece de verdade só nos **títulos dos cards do Journal** (e em conteúdo editorial de artigo).

### Substitutas gratuitas (Google Fonts) — recomendação para o build
| Papel | Substituta 1ª opção | Alternativa |
|---|---|---|
| Sans | `Inter Tight` | `Geist` |
| Mono | `Geist Mono` | `IBM Plex Mono` |
| Serif | **`Newsreader` 400** ✅ (escolhida na Fase 2) | `Instrument Serif` (❌ 25% mais estreita que a GT Alpina) |

```css
--f-sans:  "Inter Tight", "Helvetica Neue", Arial, sans-serif;
--f-mono:  "Geist Mono", "IBM Plex Mono", ui-monospace, monospace;
--f-serif: "Newsreader", "Times New Roman", serif;
```

### Títulos em duas linhas ✅ (corrigido)
Os títulos no HTML têm quebras forçadas: `Rediscovering / the Alps`, `Places worth / the travel`, `Librairie des Alpes / Depuis 1933`.
✅ Medido: **não há troca de voz** — as duas linhas são da mesma família/peso. O espaço duplo é só uma quebra de linha
forçada (`<br>`). Nos cards do Journal a serif vem do **componente inteiro**, não de um `<span>` na segunda linha.

```html
<h2 class="t-display">Places worth<br>the travel</h2>
```

### Escala tipográfica ✅
Todos os tamanhos são em **`rem` com raiz fluida** (ver §4 "Base fluida"): 1rem = 10px em 1680px, 8.571px em 1440px.
Valores confirmados nas duas larguras. Letter-spacing convertido para `em`.

| Token | Uso | Família | Tamanho | Line-height | Letter-spacing | Peso |
|---|---|---|---|---|---|---|
| `--t-hero` ✅ | H1 do hero, H2 de destino em destaque ("Monte Grappa") | sans | `9.6rem` | 0.95 | normal | `--w-display` |
| `--t-lead` ✅ | Parágrafo "About" ("A love letter…"), links grandes do footer | sans | `4.4rem` | 1.15 (footer 1.2) | normal | `--w-display` |
| `--t-display` ✅ | H2 de seção ("Shop our Products") | sans | `4rem` | 1.05 | normal | `--w-display` |
| `--t-h3` ✅ | Nome do card de stay / destino | sans | `2.8rem` | 1.15 | 0.02em | `--w-display` |
| `--t-h3-serif` ✅ | Título do card de Journal | serif | `2.8rem` | 1.15 | normal | 400 (GT Alpina "300" renderiza como regular) |
| `--t-footer-link` ✅ | Links das colunas do footer | sans | `2rem` | 1.4 | 0.01em | `--w-display` |
| `--t-button` ✅ | Label de botão M (hero) | sans | `1.9rem` | 1.0 | normal | `--w-display` |
| `--t-link` ✅ | "Discover more" | sans | `1.8rem` | 1.2 | 0.02em | `--w-display` |
| `--t-body` ✅ | Descrição do card de stay (clamp 2 linhas, cor `#222`) | sans | `1.7rem` | 1.3 | 0.01em | 400 |
| `--t-card` ✅ | Nome e preço do produto | sans | `1.6rem` | 1.0 | 0.02em | `--w-display` |
| `--t-button-s` ✅ | Label de botão S ("View", "read") | sans | `1.5rem` | 1.0 | normal | `--w-display` |
| `--t-meta` ✅ | Eyebrow, localização, data, labels do footer, copyright | mono 500 | `1.4rem` | 1.0 | 0.1em | 500, UPPERCASE |
| `--t-nav` ✅ | Links do header (SHOP, STAYS…) | mono 700 | `1.4rem` | 1.0 | 0.1em | 700, UPPERCASE |
| `--t-meta-hero` ✅ | Localização no hero / dados técnicos do Passes | mono 400 | `1.4rem` | 1.4 | 0.08em | 400, UPPERCASE |
| `--t-tag` ✅ | Texto do chip (HISTORIC, SPA) | mono 700 | `1.3rem` | 1.0 | 0.08em | 700, UPPERCASE |
| `--t-badge` ✅ | Selo amarelo ("NEW ALPINE ICON", "BESTSELLER") | mono 700 | `1.1rem` | 1.0 | 0.02em | 700, UPPERCASE |

**Regras** (corrigidas pela medição)
- ✅ Pesos: a sans é usada em **700** em quase tudo (títulos, links, botões, nome de produto). Só a descrição de card é 400.
  ⚠️ Visualmente o "700" do Diatype lê como um *medium*. Com Inter Tight, 700 fica pesado demais.
  **Decisão (Fase 2):** todo "700" da sans usa `var(--w-display)` = **550**. Com o mesmo texto renderizado nas duas fontes,
  a densidade de tinta do Diatype 700 ficou entre Inter Tight 500 e 600 em todos os tamanhos, quase igual a 550.
  O mono 700 (nav, chip, selo) fica em 700 fixo.
- ✅ A serif aparece só nos títulos do Journal. Não é usada em itálico na home. Substituta: Newsreader 400
  (largura 316px contra 328px da GT Alpina no mesmo texto; Instrument Serif deu 245px).
- ✅ Cores de texto: títulos `#1D1D1C`; descrição `#222222`; meta `#969696`; data sobre fundo preto `rgba(255,255,255,.85)`;
  chip sobre fundo preto `#757575`.
- Eyebrows ("Selected Stays") em `--t-meta`, 1.2rem acima do H2.
- Localização do card ("Wengen", "Lana") em `--t-meta`, 1.2rem acima do nome.
- Dados técnicos do bloco "Passes" (`Elevation: 1.775 m · Length: 19 km`) em `--t-meta-hero`.

---

## 4. Espaçamento e grid ✅ (medido em 2026-09-25)

### Base fluida ✅ — o coração do sistema
O site inteiro (tipo, espaço, raios) é dimensionado em `rem`, e o `rem` escala com o viewport.
Design base: **1680px de largura com 1rem = 10px**. Regras reais do `html`:

```css
html                         { font-size: 2.315458937vw; }      /* < 768px   (1rem = 10px em ~432px) */
@media (min-width: 768px)    { html { font-size: calc(5px + 0.665323vw); } }
@media (min-width: 992px)    { html { font-size: 0.595238vw; } } /* = 10px ÷ 1680px */
@media (min-width: 2500px)   { html { font-size: calc(-3.2px + 0.665323vw); } }
@media (min-width: 3000px)   { html { font-size: calc(-6.6px + 0.665323vw); } }
```
Consequência: **não usar `clamp()` por token** — basta escrever os valores em `rem` do design 1680. A única medida
fixa em px encontrada é a borda de 2px dos botões.

### Escala de espaço ✅ (valores que aparecem de fato, em rem)
```css
--s-0: 0.4rem;  --s-1: 0.8rem;  --s-2: 1.2rem;  --s-3: 1.6rem;  --s-4: 2rem;
--s-5: 2.4rem;  --s-6: 3.2rem;  --s-7: 4rem;    --s-8: 8rem;    --s-9: 12rem;
--s-10: 16rem;  --s-11: 17.5rem;
```

### Tokens de layout ✅
```css
--gutter:       4rem;     /* margem lateral (container-fluid 4rem; row −0.8rem + col 0.8rem) */
--col-gap:      1.6rem;   /* gap entre cards (products, journal, destinos) */
--section-y:    16rem;    /* distância entre módulos da home (fc-module → fc-module) */
--section-dark-top: 8rem; /* padding-top de bloco preto (Journal); bottom = 16rem */
--stack-title:  2.4rem;   /* cabeçalho de seção (H2 + Discover more) → conteúdo */
--header-h:     4.9rem;   /* altura do header fixo (42px em 1440, 49px em 1680) */
--footer-pad:   12rem 17.5rem 8rem; /* top / laterais / bottom */
```
- ✅ **Mecanismo do espaçamento entre módulos**: o container da home é `flex-direction: column; gap: 16rem` (12rem
  no mobile). O módulo hero+manifesto tem `margin-bottom: -16rem` para anular o gap, e o próximo módulo começa logo
  após os 9.6rem do manifesto. O bloco preto do Journal usa `padding-bottom: 16rem` + `margin-bottom: -16rem`, então o
  fundo preto cobre o gap. Implementado em `base.css` com `.stack-sections`, `.flush-after` e `.section--dark`.
- Botão M: padding `1rem 3.2rem`, borda 2px, raio 0.6rem. Botão S: padding `0.8rem 1rem`.
- Link do header: padding `0.6rem 0.8rem`, raio 1rem, gap 0.3rem até o chevron.
- Chip: padding `0.6rem 1rem`, raio 0.6rem, fundo `#E0DEDC`. Selo amarelo: padding `0.4rem 1.2rem`, raio 0.6rem.
- Mídia: raio 0.

### Grid ✅
- **Não é um grid de 12 colunas em CSS Grid.** É Bootstrap (`container-fluid > row > col-12`) + **flex com gap 1.6rem**.
  Linhas de 4 cards (produtos, journal) com largura igual: `(100% − 3 × 1.6rem) / 4`.
- **Full-bleed**: o conteúdo usa a largura toda, só com `--gutter` de 4rem nas laterais.
- **Grade decorativa de fundo** ✅ (`components/layout/BackgroundGrid.tsx`; só ≥ 992px): `position: fixed`, `z-index: -1`,
  linhas de 1px `#EDEBE9`.
  - Verticais: bloco que começa em `left: 11rem` com largura `calc(100% - 23.8rem)`, gradiente repetido a cada **36.1rem**
    e `border-right` (a última linha). Em 1440: x = 94, 404, 713, 1023, 1314.
  - Horizontais: viewport dividido em **3 faixas** (`background-size: auto calc(100% / 3)`).
  Aparece atrás das seções de fundo creme; hero, blocos pretos e imagens a cobrem.
- Mídia **sangra até a borda** no hero, no destino em destaque e no card grande de stay.
- Cabeçalho de seção: **H2 à esquerda + "Discover more" à direita** na mesma linha. Exceção: "Places worth the travel"
  empilha eyebrow → H2 → link numa coluna estreita (38.8rem).
- Selected Stays: **layout sticky**. Card grande à esquerda (83.2rem, imagem 0.83 ≈ 5:6) fica fixo enquanto a coluna
  da direita (cards de ~38.8rem, lidos no screenshot) rola.

### Ritmo interno dos cards ✅ (de cima para baixo)
```
PRODUTO                         JOURNAL (fundo preto)            STAY / DESTINO
[ imagem 3:4 ]                  [ imagem 5:7 ✅ texto recuado 0.8rem ]                   [ imagem ~5:7 (destino 0.715; stay 517:724 ✅) ]
  ↓ 2rem                          ↓ 2.4rem                         ↓ 2.4rem
[ Nome ]  --t-card              [ DATA ]  --t-meta               [ LOCAL ]  --t-meta, #969696
  ↓ 0.4rem                        ↓ 0.8rem                         ↓ 1.2rem
[ Preço ] --t-card              [ Título ] --t-h3-serif          [ Nome ]  --t-h3
                                  ↓ 2rem                           ↓ 2rem
                                [ chip ][ chip ]                 [ descrição ] --t-body, clamp 2
                                                                   ↓ 1.6rem ✅
                                                                 [ chip ][ chip ][ chip ]
```
Selo amarelo ("BESTSELLER", "NEW ALPINE ICON") fica **dentro da imagem**, centralizado embaixo, com largura quase total.

---

## 5. Componentes

### 5.1 Botões ✅ (medido na Fase 4; implementado em `components/ui/Button.tsx`)
O original tem um sistema `button` + tamanho (`button-s`, `button-m`, `button-l`) + tema (`black`, `white`, `grey`, `gold`)
+ variante (`solid`, `outline`).

| Propriedade | Botão M |
|---|---|
| Altura | 3.9rem |
| Padding | 1rem 3.2rem |
| Borda | 2px sólida (transparente quando não há borda visível) |
| Raio | 0.6rem |
| Label | sans 700 (`--w-display`), 1.9rem, lh 1, `font-feature-settings: "case","ordn","dlig"` |
| Transição | 0.3s em tudo |

| Tema / variante | Normal | Hover | Foco |
|---|---|---|---|
| white solid | fundo branco, texto `#181818` | fundo `#F7F7F7`, borda transparente | anel `0 0 0 4px rgba(255,255,255,.3)` |
| white outline | borda branca, texto branco | igual ao solid no hover | idem |
| black solid | fundo `#181818`, texto branco | fundo `#444` | anel `rgba(24,24,24,.3)` |

- Botão S: label 1.5rem (usado nos rótulos de hover "View", "read"). Detalhes quando for implementado.
- **Link de texto** ("Discover more"): ver `multianimline` na §8.

### 5.2 Selos / Labels ✅ (medido na Fase 6; `components/ui/Badge.tsx`)
- Textos vistos: `New`, `New Arrival`, `Bestseller`, `New Alpine Icon`.
- Fundo `--c-signal`, texto `--c-ink`, ícone de estrela de 1.6rem + label `--t-badge` (mono 700, 1.1rem, uppercase), gap 0.3rem,
  padding `0.4rem 1.2rem`, raio 0.6rem.
- Posição: **dentro da imagem, centralizado embaixo** (`bottom: 2.4rem`, largura fixa 30rem no card grande de stay).

### 5.3 Tags / Chips ✅ (medido na Fase 6; `components/ui/Tag.tsx`)
- São links de filtro (`?_characteristic=historic`). **Máximo 3 visíveis + contador `+N`**, que leva à página do item.
- Fundo `#E0DEDC`, padding `0.6rem 1rem`, raio 0.6rem, altura mínima 3.2rem, gap 0.4rem entre chips.
  Label `--t-tag` (mono 700, 1.3rem, 0.08em, uppercase, reticências). Hover: fundo `#CBC8C6` em 0.3s.
- Variante no fundo preto (Journal): fundo `rgba(255,255,255,.15)`, texto `#757575`; hover `rgba(255,255,255,.3)`.

### 5.4 Card de Hospedagem (Stay) ✅ (medido na Fase 6; `components/ui/CardStay.tsx`)
```
[ imagem 517:724 ]          ↓ 2.4rem
  [ LOCAL ]                 --t-meta, #969696          ↓ 1.2rem
  [ Nome ]                  --t-h3                     ↓ 2rem
  [ descrição ]             --t-body, #222, clamp 2    ↓ 1.6rem
  [ chip ][ chip ][ chip ][+N]
```
- O texto fica recuado 0.8rem em relação à imagem; o bloco descrição+chips tem 2rem de respiro à direita.
- O card inteiro é clicável. A imagem e os chips ficam acima, com links próprios.
- Hover na imagem: `brightness(.7)` em 0.3s + rótulo **"View"** (botão S branco) centralizado, que aparece sem transição.

### 5.5 Card de Produto ✅ (medido na Fase 9; `components/ui/CardProduct.tsx`)
- Imagem 388:517, raio 0.2rem, 2rem até o nome. Vídeo por cima da imagem **só no hover** (desktop). Sem filtro de brilho no hover.
- Selo opcional dentro da imagem: centralizado, `bottom: 2.4rem`, largura 80% (máx. 40rem).
- Nome e preço em `--t-card` (sans 700, 1.6rem, lh 1), 0.4rem entre eles; o preço usa `font-variant-numeric: ordinal`.
- Preço promocional: novo + antigo riscado (`69,00 € ~~80,70 €~~`). No drawer do carrinho ganha o botão "Add to cart" (fora do escopo).

### 5.6 Card de Journal ✅ (medido na Fase 10; `components/ui/CardArticle.tsx`)
- Imagem 5:7 com `brightness(.8)` fixo; hover `.7` + rótulo **"read"** (botão S).
- 2.4rem → data (`--t-meta`, branco .85) → 0.8rem → título **serif** (`--t-h3-serif`, branco, quebra forçada) → 2rem → chips.
- Texto recuado 0.8rem. Chips no tema escuro e **sem link** (`pointer-events: none` no original); hover `rgba(255,255,255,.3)` / texto `#6E6E6E`.

### 5.7 Card de Coleção ✅ (medido na Fase 7; `components/ui/CardCollection.tsx`)
- Proporção 523:731, padding `2.4rem 2rem`, flex em coluna com `space-between` e itens centralizados, texto branco.
- Em cima, em linha: marca à esquerda + sufixo à direita (`--t-meta`, branco). No meio, o nome (`--t-display`).
  Embaixo, "Collection" (`--t-meta`).
- Mídia: imagem cover. **Vídeo só aparece no hover** (desktop), por cima da imagem.
- O último card ("More Collections") não tem mídia: fundo `--c-ink`.

### Carrossel ✅ (Fase 7; `components/ui/Carousel.tsx`)
O original usa Swiper. Recriamos com **scroll nativo + `scroll-snap`**, sem dependência nova:
- Cabeçalho: H2 à esquerda + setas à direita (ícone 2.4rem, padding 0.8rem, gap 0.4rem; desativada `#969696`).
  Setas só no desktop no original.
- Slides com gap de **16px fixos** (o `spaceBetween` do Swiper, em px). O trilho começa no gutter e o último slide para
  no gutter; os slides seguintes aparecem cortados na borda direita.
- Barra de progresso: largura máx. 106rem, 2px, 5.6rem abaixo, trilho `rgba(0,0,0,.2)`, polegar `--c-ink`, raio 10px.
  O polegar ocupa a proporção visível (sem o gutter), como no Swiper. Ele pode ser arrastado.
- Arraste com o mouse (o clique no link é cancelado se houve arraste). Toque e trackpad usam o scroll nativo.

### 5.8 Card de Destino ✅ (medido na Fase 11; `components/ui/CardDestination.tsx`)
- Imagem 388:543 (ilustrações no original) → 2.4rem → país (`--t-meta`) → 0.8rem → nome (`--t-h3`) → 2rem.
- Hover (card inteiro): imagem `brightness(.8)`, texto com opacidade `.7`, rótulo **"View destination"** com fade de 0.3s.
- Variação **"Up Next"** (em breve): **mesmo tamanho** dos outros, mas é `div` sem link, com `cursor: no-drop`,
  imagem com raio 0.4rem e selo amarelo "UP NEXT" (`bottom: 2.4rem`, largura 40rem, máx. 100% − 8rem).

---

## 6. Estrutura da Home (ordem exata) ✅

| # | Seção | Fundo | Layout |
|---|---|---|---|
| 0 | **Header** | transparente sobre hero → paper ao rolar | 3 zonas: nav esquerda · logo centro · utilitários direita |
| 1 | **Hero** ✅ | vídeo full-screen (100vh; 100svh no mobile), **sem overlay** | H1 `--t-hero` em `top:50%` com `translate(-50%,-75%)` e largura 100%−8rem; botões M (solid + outline) a 4rem da esquerda e 2.4rem da base, 1.6rem entre eles; legenda `--t-meta-hero` 2.4rem abaixo |
| 2 | **Manifesto/About** ✅ | paper | **Mesmo módulo do hero.** Margem 6.4rem acima e 9.6rem abaixo; parágrafo `--t-lead` em **largura total** (4 linhas em 1440); link `--t-link` com sublinhado animado 2.4rem abaixo. Sem animação de entrada |
| 3 | **Destaque + Selected Stays** ✅ | paper | Flex com gap 1.6rem e padding-right 4rem (o destaque encosta na borda esquerda). **Sticky** (`top: 4.8rem`): destaque de 83.2rem × (100vh − 4.8rem), `brightness(.8)`, nome `--t-lead` branco centralizado (some no hover), selo embaixo; + cabeçalho de 38.8rem, 5.6rem abaixo do topo (eyebrow → 1.2rem → H2 com `text-wrap: balance` → 1.6rem → link). À direita, a coluna de cards rola, com gap de 5.6rem |
| 4 | **Curated Collections** ✅ | paper | H2 `--t-display` (sem eyebrow) + setas; carrossel com 3 visíveis de 4 (3 coleções + "More Collections"); barra de progresso; 4rem extras de margem depois |
| 5 | **Bloco "Passes"** ✅ | imagem full-bleed + vídeo central | Bloco inteiro é link; altura `100vh − 5rem`; imagem cover no fundo; vídeo de 43rem (3:4) centralizado; categoria `--t-meta` branca a 2.4rem do topo; título `--t-hero` centralizado, largura 90%, por cima do vídeo; ficha `--t-meta-hero` a 4rem da esquerda e da base. Sem hover |
| 6 | **Shop our Products** ✅ | paper **opaco** | Fundo creme com `padding: 16rem 0; margin: -16rem 0` (cobre a grade de fundo no gap); H2 + "Discover more" alinhados ao centro, 2.4rem até o grid; grid de 4 colunas com gap 1.6rem |
| 7 | **Stories (Journal)** ✅ | **preto `#000`** | Padding `8rem 0 16rem` + `margin-bottom: -16rem` (o preto cobre o gap); H2 + "Discover more" brancos; **4 cards lado a lado** com gap 1.6rem (o Swiper só rola no mobile) |
| 8 | **Destino em destaque** ✅ | paper + mídia à esquerda | Flex com gap 5.6rem e padding-right 4rem; mídia-link de 83.2rem (832:1200), vídeo `brightness(.8)`, nome `--t-hero` branco a 4rem do canto; à direita, texto `--t-lead` + link (5.6rem abaixo), **sticky** em `top: 10.6rem`, com padding `5.6rem 0 10rem` |
| 9 | **Alpine Destinations** ✅ | paper | H2 + "Discover more"; **5 cards iguais** lado a lado (gap 1.6rem): 2 links + 3 "Up Next". O Swiper só rola no mobile |
| 10 | **Footer** ✅ | **preto `#000`** | 16rem depois do último módulo; flex em coluna com gap 9.6rem, padding `12rem 17.5rem 8rem`. Newsletter (rótulo meta → 3.2rem → campo com borda branca: input 3.3rem + botão "Send" de 14rem, 2.4rem, que fica branco no hover). Menus em `space-between`: 3 links grandes (4.4rem, lh 1.2, gap 0.8rem) · 3 colunas de 25.3rem (Mais · Legal · Social; rótulo meta → 1.6rem → links `--t-footer-link`). Links com sublinhado "single". Base alinhada embaixo: logo 6.2rem + copyright · "Well known from" (logos de 1.2rem, gap 2.4rem) · "Pay secure" (1.8rem, gap 1.9rem) |

### Overlays globais ✅ (medidos na Fase 13)
- **Mega-menu "Explore"** e **dropdown "More"**: ver §7.
- **Busca** (`components/overlays/SearchOverlay.tsx`): véu `rgba(0,0,0,.6)` + `blur(5px)`; modal de vidro centralizado de
  41vw × 80vh (fundo `rgba(255,255,255,.7)`, borda 2px `rgba(255,255,255,.55)`, raio 0.6rem, sombra `0 24px 105px rgba(0,0,0,.12)`,
  `blur(20px)`); entra com opacidade + 4px em 0.1s ease-out. Campo em pílula (borda 2px `#181818`, fundo branco, ícones de 1.8rem,
  texto 1.7rem 700). Estados: "Enter something to search" / "Nothing found ¯\\_(ツ)_/¯" (1.7rem, 7.6rem abaixo) / resultados
  agrupados por tipo (título do grupo mono 700 1.5rem; item com padding 1.2rem, raio 0.8rem, hover de vidro; título 1.8rem 700 +
  subtítulo 1.8rem `rgba(0,0,0,.5)` com clamp 2). O original busca via AJAX; aqui a busca é **local** sobre `/content` (`content/search.ts`).
- **Modal Newsletter** (`components/overlays/NewsletterModal.tsx`): abre por links `#newsletter` (item "Newsletter" do menu More).
  Card de 38.8rem, raio 0.6rem, fundo `--c-paper`; imagem 1:1; corpo com padding 2.4rem: título `--t-h3` → 2.4rem → lista com
  bullets (1.8rem, lh 1.25) → 2.4rem → input (1.8rem 700, borda 1px preta, placeholder `#BBB`) → 1.2rem → botão L preto de
  largura total (4.7rem, `#181818`, hover `#444`). Fechar: × branco 2.2rem no canto. Véu `rgba(0,0,0,.6)`.
- Implementação: os dois são `<dialog>` com `showModal()` (foco preso, Esc e clique fora fecham), e a rolagem da página trava
  enquanto estão abertos. Como no original, a barra de rolagem some e o layout desloca 15px.
- **Carrinho (drawer lateral)**: fora do escopo (sem e-commerce).

---

## 7. Header — especificação detalhada ✅ (medido na Fase 3)

```
|  SHOP   STAYS   EXPLORE ▾            [ LOGO ]            MORE ▾   SEARCH   CART (0) |
```
Implementação: `components/layout/Header.tsx`, `MegaMenu.tsx`, `MoreMenu.tsx`.

**Barra**
- `position: fixed`, altura **4.8rem + 1px de borda** (42px em 1440), padding lateral `--gutter`, `z-index: 1000`.
- Links: `--t-nav` (mono 700, 1.4rem, uppercase, 0.1em), padding `0.6rem 0.8rem`, raio 1rem, gap 1.2rem entre itens,
  chevron de 0.9rem a 0.3rem do texto. Hover e item aberto: fundo `rgba(0,0,0,.07)` com transição de 0.3s.
- Utilitários **em texto**, não ícones: `SEARCH`, `CART (0)`.
- Logo centralizado (absoluto, `translate(-50%,-50%)`): caixa 15.4 × 1.8rem. Com o header sólido vira a versão
  **mini** (círculo de 3.4rem). As trocas de logo são instantâneas.

**Estados**
| Estado | Quando | Visual |
|---|---|---|
| Transparente | scroll ≤ ~10px | texto branco, sem fundo, borda transparente |
| Sólido | scroll > ~10px **ou** Explore aberto | fundo `--c-paper`, texto `--c-ink`, borda 1px `#DDD`; logo mini ao rolar |
- A troca de cor e fundo é **instantânea**: só `transform` tem transição de 0.3s.
- No desktop o header **não se esconde** ao rolar. No mobile (< 992px) ele se esconde ao rolar para baixo (Fase 14).

**Mega-menu "Explore"** (abre por **clique**, fecha com clique fora; nós também fechamos com Esc)
- Painel fixo com largura total logo abaixo da barra, fundo `--c-paper`, padding 4rem, altura 47.1rem (vem dos cards).
- Esquerda (máx. 52.2rem, gap 1.6rem): título 6rem sans 700 lh 1 + descrição 1.7rem 400 lh 1.25, cor `#222`.
- Direita: 3 cards de 28rem, proporção 388:542, gap 1.6rem, título centralizado 2.8rem branco lh 1.1. Hover: `brightness(.85)` em 0.3s.
- Véu `rgba(0,0,0,.6)` sobre a página.
- Movimento **só na abertura** (fecha instantâneo): o painel desce de `translateY(calc(-100% - 10rem))` em 0.3s;
  título, descrição e cards entram com `translateY(-40%/-20%)` + opacidade em 0.6s, com atrasos de .1s/.15s e .1s/.15s/.2s.
- No link "Explore" aberto, o chevron vira ×.

**Menu "More"** (abre por clique, sem transição)
- Posição: `top: calc(100% + 2.3rem)` do link, centralizado sob ele. Largura pelo conteúdo (~20rem).
- Vidro: fundo `rgba(255,255,255,.7)`, borda 1px `rgba(255,255,255,.55)`, `blur(15px)`, sombra `0 2px 10px 2px rgba(0,0,0,.12)`, raio 0.6rem,
  padding `0.8rem 1.2rem`, gap 1rem.
- Itens: mono 700 1.5rem uppercase 0.08em, padding 0.8rem, ícone de 2rem a 0.6rem do texto, hover com fundo branco.

**Mobile** (Fase 14): barra de 6.4rem com busca + logo + carrinho + hambúrguer; linha inferior com links em colunas iguais.

---

## 8. Movimento & interação ✅
- ✅ **Tempos do original**: `ease` padrão do CSS; **0.3s** para hover, fundos e entrada de painéis; **0.6s** para
  conteúdo que entra e para sublinhados; stagger de **0.05s**. Tokens: `--ease`, `--dur-fast`, `--dur`, `--stagger`.
- ✅ **Sublinhado "Discover more"** (`multianimline`): gradiente com dois segmentos em `background-size: 300% 1px`.
  No hover, `background-position` vai de 100% a 0 em 0.6s: um traço sai pela direita e outro entra pela esquerda.
- ✅ **Sublinhado "single"** (links do footer): sem traço em repouso (`background-size: 0 2px` ancorado à direita).
  No hover o gradiente vira para a esquerda e cresce até `200% 2px` em 0.6s; ao sair, recolhe para a direita.
  Implementado em `TextLink variant="single"`.
- ✅ **Vídeos**: `autoplay muted loop playsinline`, 720p, sem poster. O hero **não alterna vídeos**: tem um vídeo para
  desktop (≥ 992px) e outro para mobile. As cenas variaram entre visitas; não confirmado se é sorteio ou montagem 🔶.
- ✅ **Hover em imagens**: **sem zoom**. A imagem escurece (`brightness(.7)`, ou `.8` nos destinos) em 0.3s e aparece o rótulo
  ("View", "read", "View destination"). Detalhes por card na §5.
- ✅ **Reveal no scroll**: **não existe na home do original** (nenhuma classe de animação de entrada nas seções medidas).
  Não implementado. Se a marca quiser, usar os tokens `--dur` e `--ease`.
- ✅ **Links**: ver os dois sublinhados acima ("swap" e "single").
- ✅ `prefers-reduced-motion`: vídeos ficam parados no primeiro quadro (`LoopVideo`) e as transições caem para 0.01ms (`base.css`).

---

## 9. Responsivo ✅ (medido na Fase 14 em 390, 820 e 1440px)
Cortes do original: **768px** e **992px** (mobile-first). A raiz em `rem` muda com a largura (§4). Os valores que mudam
viram overrides de token num `@media (max-width: 991.98px)` no fim do `tokens.css`; a estrutura muda nos módulos CSS.

| Área | < 768 (mobile) | 768–991 (tablet) | ≥ 992 (desktop) |
|---|---|---|---|
| Base | gutter 2rem · gap entre módulos 12rem · H2 3rem · lead 2.6rem · hero 4rem | igual ao mobile | valores da §3/§4 |
| Header | barra de cima (busca · logo 12rem · sacola com contador · hambúrguer 2.2rem, padding 2rem, **esconde 6.4rem ao rolar para baixo**) + barra de atalhos (2 links mono em células, bordas brancas/`#DDD`) | igual | barra única (§7) |
| Menu mobile | painel creme em tela cheia (padding-top 12.1rem): acordeão "Explore" (descrição + 3 cards 179:229) + itens do "More" em 2.6rem com linhas `#DDD` | igual | — (mega-menu + More) |
| Hero | título centralizado (`translate(-50%,-50%)`), botões empilhados em largura total (gap 1.2rem), sem legenda | botões em linha | §6 |
| Selected Stays | cabeçalho (H2 **4rem**) → destaque 517:724 em largura total com local/nome/descrição/chips abaixo → faixa horizontal de cards de 28.5rem (scroll nativo) | destaque 70% (altura 80vh − 4.8rem, nome 4.4rem sobreposto) + cabeçalho 30% (H2 2.6rem); faixa horizontal | sticky (§6) |
| Coleções | carrossel com 1.3 slides, gap 16px, sem setas, barra de 24.4rem a 4rem; card com padding 1.2rem, textos mono 1.2rem, nome 2.6rem | 2.5 slides | 3 slides + setas |
| Passes | altura 100vh, vídeo 30rem, título largura 100% − 2rem, ficha a 2rem/2.4rem | igual | §6 |
| Shop | grid 2 colunas (gap 3.2rem 1.6rem), imagem 179:239, "Discover more" no fim, centralizado (4rem) | igual | 4 colunas |
| Journal | carrossel com 1.2 slides (gap 1.6rem), barra branca, "Discover more" no fim (3.2rem); título serif 2.3rem | 2.5 slides | 4 lado a lado |
| Destino em destaque | mídia em largura total (832:1200) → 6.4rem → texto (sem sticky), título a 3.2rem/2rem | mídia 8:9 | §6 |
| Destinos | carrossel com 1.2 slides; nome 2rem | 2.5 slides | 5 lado a lado |
| Chips | máx. 2 + contador (o 3º some se não for o último, como no original) | igual | 3 + contador |
| Footer | padding `8rem 2rem 12rem`, gap 5.6rem; links grandes 3.2rem; "Mais" em 2 colunas; Social · Legal lado a lado; base empilhada | igual | §6 |
| Busca | tela cheia, fundo `rgba(255,255,255,.85)`, margens 2rem | margens 10.2rem | modal 41vw × 80vh |
| Newsletter | tela cheia | card de 38.8rem | card de 38.8rem |

Posições conferidas contra o original: desktop idêntico; em 390px a página inteira mede 972.8rem contra 974.5rem
(a diferença vem dos textos placeholder); em 820px, 1042.5rem contra 1043.5rem.

---|---|
| `≥1280px` | Layout completo; split 7/5 no Selected Stays; 4 colunas em produtos/journal |
| `768–1279px` | 2–3 colunas; split vira 6/6 |
| `<768px` | 1 coluna; grids de produto/journal viram **carrossel horizontal com scroll-snap**; "Discover more" só no fim da seção; hero com botões empilhados |

---

## 10. Tokens CSS ✅ (fechados na Fase 1, 2026-09-25)

**Fonte da verdade: [`styles/tokens.css`](styles/tokens.css).** Esta seção não duplica os valores, para os dois arquivos
não divergirem. Os valores e a origem de cada um estão nas §2 (cores), §3 (tipo) e §4 (espaço/layout).

Conteúdo do arquivo:
- **Raiz fluida**: as regras de `html { font-size }` da §4 (1rem = 10px em 1680px).
- **Cores**: `--c-*`, todos medidos. Os derivados estimados (`--c-line-dark`, `--c-overlay`) foram removidos na Fase 15: nenhuma seção precisou deles.
- **Fontes**: `--f-sans`, `--f-mono`, `--f-serif`; `--w-display` = 550 (decidido na Fase 2).
- **Tipo**: trios `--t-*` / `--lh-*` / `--ls-*` para cada papel da §3.
- **Espaço**: `--s-0` … `--s-11`; layout `--gutter`, `--col-gap`, `--section-y`, `--section-dark-top`, `--stack-title`,
  `--header-h`, `--footer-pad`, `--grid-bg-*`.
- **Forma**: `--r-btn`, `--r-chip`, `--r-badge`, `--r-nav`, `--r-menu`, `--r-media`, `--bw-btn`; paddings `--pad-*`.
- **Movimento** (Fase 3): `--ease`, `--dur-fast`, `--dur`, `--stagger`.
- **Header** (Fase 3): `--logo-*`, `--nav-*`, `--menu-*`, `--mega-*`, `--z-header`, `--shadow-menu`, `--blur-glass`.

Ficam para depois:
- **Classes utilitárias** (`body`, `.t-meta`, `.section`, `.section--dark`…): vão para `styles/base.css` na Fase 2,
  sempre consumindo os tokens. `.section--dark` usa `--c-black`, não `--c-ink`. Não existe grid de 12 colunas (ver §4).

---

## 11. Estrutura de arquivos ✅ (como ficou no fim da Fase 15)

```
site-build/
├── app/
│   ├── layout.tsx          ← fontes (next/font), Header, Footer, NewsletterModal
│   ├── page.tsx            ← home: ordem das seções da §6
│   ├── globals.css         ← importa tokens.css + base.css
│   └── specimen/page.tsx   ← QA tipográfico interno (noindex)
├── components/
│   ├── layout/    Header, MegaMenu, MoreMenu, MobileMenu, Footer, BackgroundGrid
│   ├── sections/  Hero, Manifesto, SelectedStays, CuratedCollections, PassesBanner,
│   │              ShopGrid, Journal, FeaturedDestination, Destinations
│   ├── ui/        Button, TextLink, Tag/TagList, Badge, Media, LoopVideo, Carousel, Icon, Logo,
│   │              NewsletterForm, CardStay, CardCollection, CardProduct, CardArticle, CardDestination
│   └── overlays/  SearchOverlay, NewsletterModal
├── content/       textos e dados [PLACEHOLDER] por seção + search.ts (índice da busca local)
└── styles/
    ├── tokens.css          ← fonte da verdade (§10), com overrides < 992px no fim
    ├── base.css            ← reset, classes .t-*, layout (.container, .stack-sections, .section--*)
    └── *.module.css        ← um por componente
```

---

## 12. Script para confirmar valores exatos (rode no console do Chrome em montamont.com)

Abra o site → F12 → Console → cole. Ele devolve fontes, tamanhos, cores, paddings e raios reais dos elementos-chave. Atualize os itens 🔶 deste documento com o resultado.

```js
(() => {
  const P = ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','textTransform',
             'color','backgroundColor','padding','margin','borderRadius','border','height','gap'];
  const pick = el => { const s=getComputedStyle(el), o={tag:el.tagName, txt:(el.innerText||'').trim().slice(0,30)};
                       P.forEach(p=>o[p]=s[p]); return o; };
  const q = (sel,n=3) => [...document.querySelectorAll(sel)].filter(e=>e.offsetParent).slice(0,n).map(pick);
  const out = {
    body: q('body',1), header: q('header',1), h1: q('h1'), h2: q('h2'), h3: q('h3'),
    p: q('p',5), links: q('a',8), buttons: q('button, .button, [class*="btn"]',8),
    sections: [...document.querySelectorAll('section, main > div')].slice(0,12)
               .map(e=>({cls:e.className.toString().slice(0,60), pad:getComputedStyle(e).padding,
                         bg:getComputedStyle(e).backgroundColor})),
    fonts: [...new Set([...document.fonts].map(f=>`${f.family} ${f.weight} ${f.style}`))],
  };
  console.log(JSON.stringify(out,null,2)); copy(JSON.stringify(out,null,2));
  return 'Copiado para a área de transferência ✅';
})();
```

---

## 13. O que adaptar (checklist de "moldar para nós")

- [ ] Nome/logo próprios (2 versões SVG: clara e escura)
- [ ] `--c-signal` → cor-assinatura da nossa marca
- [ ] Mapear seções para nosso conteúdo (ex.: Stays → Serviços/Projetos; Shop → Produtos; Journal → Blog; Destinations → Cases/Regiões)
- [ ] Nossos próprios vídeos e fotos (mesma direção: editorial, luz natural, pouca saturação artificial)
- [ ] Textos próprios, mantendo o tom: curto, sensorial, com um toque de humor nos estados vazios
- [x] Decidir: fontes gratuitas (seção 3) ou licenciar as originais → gratuitas: Inter Tight 550, Geist Mono, Newsreader
- [x] Rodar o script da seção 12 e fechar os tokens (Fase 1; estimativas restantes resolvidas até a Fase 15)

## 14. O que NÃO copiar
Logo, nome, fotos, vídeos, ilustrações, textos, logos de imprensa ("Well known from") e os arquivos de fonte comerciais pertencem à Montamont / às fundições. Replicamos **sistema, layout, ritmo e comportamento** — o conteúdo e a identidade são nossos.
