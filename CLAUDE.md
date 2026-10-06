# CLAUDE.md — Projeto: [NOME DO SITE]

> Este arquivo é lido automaticamente pelo Claude Code no início de cada sessão.
> Referência de design mestre: `SITE-MESTRE.md` (na raiz do repo) — leia-o por completo
> antes de escrever qualquer componente. Ele descreve o sistema visual que estamos
> recriando (baseado em montamont.com), com tokens, tipografia, grid e estrutura de seções.

---

## 0. O que este projeto é

Um site institucional/editorial em **Next.js (App Router)**, com o sistema visual do
`SITE-MESTRE.md`, mas com **marca, conteúdo e mídia próprios**. Sem carrinho, sem
e-commerce funcional, sem backend por enquanto — isso vem depois. O foco agora é
**fidelidade visual e estrutural** ao mestre.

Não copiar: logo, fotos, vídeos, textos e fontes pagas da referência (ver seção 14 do
SITE-MESTRE.md). Copiar: sistema, layout, ritmo, comportamento.

Este projeto é o template default de sites para wedding venues dos EUA. A especificação
de seções, conversão e copy está em `docs/VENUE-TEMPLATE.md`. O site modelo original
está em `~/site-build` e não deve ser alterado.

---

## 1. Stack

- **Next.js 16** (App Router, TypeScript) — consultar `node_modules/next/dist/docs/` antes de escrever código (ver AGENTS.md)
- **CSS puro com tokens (CSS Custom Properties)** — sem Tailwind, sem shadcn, sem
  biblioteca de componentes. O visual do mestre é seco e editorial; frameworks de UI
  padrão puxam para cantos arredondados e sombras que não combinam. Componentes React
  para estrutura, CSS Modules para estilo.
- **Framer Motion** apenas onde o SITE-MESTRE.md pede movimento (reveals, hover, menus).
- Fontes via `next/font/google`: Inter Tight (sans, peso de título `--w-display` = 550), Geist Mono e Newsreader
  (serif). Escolhidas na Fase 2 por medição; ver seção 3 do SITE-MESTRE.md.
- Sem CMS por enquanto: conteúdo em arquivos `.ts`/`.json` locais em `/content`.

---

## 2. Estrutura de pastas

Estrutura real depois da Etapa 19. Seções na ordem do §3 do VENUE-TEMPLATE.md; o nome do
componente de origem no site modelo está no comentário de cada seção.

```
/
├── CLAUDE.md
├── AGENTS.md
├── SITE-MESTRE.md
├── docs/
│   ├── VENUE-TEMPLATE.md
│   └── PROGRESS.md              ← registro das etapas 2–19 (decisões e dúvidas)
├── app/
│   ├── layout.tsx               ← guia do topo, faixa de anúncio, header, footer, barra mobile, SEO
│   ├── page.tsx                 ← home (seções 2–13, cada uma com isOn())
│   ├── the-venue/ packages/ stay/  ← páginas internas (InternalPage + bloco da página)
│   └── globals.css
├── components/
│   ├── layout/        (Header, MobileMenu, Footer, MobileStickyBar, JsonLd, BackgroundGrid)
│   ├── sections/      (AnnouncementBar, Hero, FactsStrip, Intro, Spaces, WeddingWeekend,
│   │                   Packages, StayOnSite, LoveNotes, HowItWorks, Faq, GettingHere, Gallery, CheckYourDate)
│   ├── pages/         (InternalPage, VenueSpaces, PackagesDetails — páginas internas, VENUE-TEMPLATE §4.1)
│   ├── guide/         (SectionGuide, TopGuide, useGuideMode — modo guia ?guide=1)
│   ├── tour/          (TourProvider, TourCard, FotosTour, SliderConvidados, Celebracao — card Schedule a Tour aberto por todo link /?tour)
│   └── ui/            (Button, Tag, Badge, Card* [Stay, Collection, Package, Destination,
│                       Quote], TextLink, Carousel, Icon, Logo, LoopVideo, HeroSequence, TypeText, Media,
│                       Placeholder, MediaPlaceholder, Lightbox, Abertura, EntradaTitulo, HeroLegenda,
│                       MapEmbed, SmoothInput, SurgeLinhas)
├── lib/
│   ├── site.ts         ← leitura do conteúdo: val, isOn, navLinks, midiaLabel, smsHref…
│   ├── hero.ts         ← media query desktop/mobile do hero em vídeo, semVideo()
│   ├── abertura.ts     ← abertura animada: script do <head>, eventos com o HeroSequence, curva/tempos
│   └── tour.ts         ← card Schedule a Tour: opções (meses, faixas), sessionStorage, submitTour()
├── styles/
│   ├── tokens.css      ← tokens do SITE-MESTRE.md + bloco "template de venue" no fim
│   ├── base.css
│   └── *.module.css    (um por componente)
├── content/
│   ├── site.ts         ← todo o texto do site: dados no formato do venue.json
│   │                     ({ valor, fonte, confianca }) + secoes.<id> (enabled + copy) + ui
│   └── guide.ts        ← textos do modo guia (?guide=1), com o placeholder completo da §4
├── qa/                 ← screenshots de QA por etapa (no .gitignore)
└── public/             (vazio; mídia real entra por cliente)
```

**Como montar um cliente:** preencher `content/site.ts` (a skill escreve nos campos do
venue.json e em `secoes.*`), colocar as fotos originais em `media/originais/` e apontar os `valor` das fotos
(`/venue/<nome>.jpg`; `npm run look` gera `public/venue/` tratada, só com as fotos usadas —
ver `tools/look/README.md`),
hero em vídeo opcional (`hero.videos`; clipes gerados com `tools/hero-video/`, ver o README de lá),
desligar seções com `enabled: false`, trocar `seo.noindex` para `false` ao publicar e rodar
o checklist da seção 6 do VENUE-TEMPLATE.md.

---

## 3. Regras de trabalho para o Claude Code

1. **Só tokens existentes.** Usar apenas os tokens que já existem em `tokens.css`;
   não medir mais o site de referência (montamont.com).
2. **Comparação visual obrigatória a cada seção concluída.** Tirar screenshots em
   desktop (1440) e mobile (375), com e sem `?guide=1`, e comparar com o visual das
   seções originais do site modelo para manter o mesmo ritmo (proporção, espaçamento),
   não o conteúdo.
3. **Tokens primeiro, componente depois.** Nenhuma cor, tamanho de fonte ou espaçamento
   hardcoded em componente — tudo via `var(--token)` de `tokens.css`.
4. **Uma seção por vez, nesta ordem** (ver seção 3 do docs/VENUE-TEMPLATE.md):
   Announcement bar → Header → Hero → Facts strip → Intro/Story → The Spaces →
   Your Wedding Weekend → Packages → Stay On Site → Love Notes → How It Works → FAQ →
   Gallery → Check Your Date → Footer → Mobile sticky bar. Não pular à frente sem
   terminar a atual.
5. **Placeholder de mídia.** Enquanto não recebermos vídeos/fotos reais, usar
   `<div>` com `background: var(--c-line)` no aspect-ratio correto e um label discreto
   (`[vídeo hero 16:9]`) — nunca usar imagens de banco de imagens genéricas ou baixar
   assets de terceiros sem autorização.
6. **Sem invenção de conteúdo de marca.** Textos, nome, logo — perguntar ou usar
   `[PLACEHOLDER]` claramente marcado, nunca inventar como se fosse definitivo.
7. **Rodar `npm run build` ao final de cada fase** para garantir que nada quebrou.
8. **Commits pequenos e descritivos**, um por fase concluída.
9. **Em sites de clientes (copiados deste template para `~/venues`), toda mudança é
   classificada.** Conteúdo (textos, fotos, dados) = commit com prefixo `conteudo:`.
   Sistema (componente, CSS, seção, bug, placeholder) = commit separado com prefixo
   `template:` e uma linha em `docs/MELHORIAS-TEMPLATE.md`
   (data · o que mudou · commit · status pendente). Nunca misturar os dois no mesmo commit.

---

## 4. Comandos úteis

```bash
npm run dev        # localhost:3001 (porta fixa no package.json)
npm run build
npm run lint
```

Manter o servidor dev deste projeto rodando na porta fixa do package.json. Depois de cada
mudança, confirmar no navegador que a página atualizou. Sempre informar o endereço ao usuário.

---

## 5. Checklist mestre (marcar conforme avança)

- [x] Etapa 1 — Limpeza (remover mega-menu Explore, dropdown More, busca, newsletter, cart)
- [x] Etapa 2 — Estrutura de conteúdo e guia (`content/site.ts`, `content/guide.ts`, `?guide=1`, `enabled`, `noindex`)
- [x] Etapa 3 — Seção 0: Announcement bar
- [x] Etapa 4 — Seção 1: Header
- [x] Etapa 5 — Seção 2: Hero
- [x] Etapa 6 — Seção 3: Facts strip
- [x] Etapa 7 — Seção 4: Intro / Story
- [x] Etapa 8 — Seção 5: The Spaces
- [x] Etapa 9 — Seção 6: Your Wedding Weekend
- [x] Etapa 10 — Seção 7: Packages (inclui tirar o preço de produto do ShopGrid)
- [x] Etapa 11 — Seção 8: Stay On Site
- [x] Etapa 12 — Seção 9: Love Notes
- [x] Etapa 13 — Seção 10: How It Works
- [x] Etapa 14 — Seção 11: FAQ
- [x] Etapa 15 — Seção 12: Gallery
- [x] Etapa 16 — Seção 13: Check Your Date
- [x] Etapa 17 — Seção 14: Footer (remover a newsletter; logos de imprensa viram o bloco opcional "As featured in")
- [x] Etapa 18 — Mobile sticky bar
- [x] Etapa 19 — Revisão geral (responsivo, SEO local, LCP, checklist da seção 6 do VENUE-TEMPLATE.md; remover tokens órfãos que não são usados em nenhum lugar)

@AGENTS.md
