import type { Metadata } from "next";
import { Geist_Mono, Inter_Tight, Newsreader } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";
import { TopGuide } from "@/components/guide/TopGuide";
import { TourProvider } from "@/components/tour/TourProvider";
import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { site, type PaginaId } from "@/content/site";
import { scriptAbertura } from "@/lib/abertura";
import { isOn, paginaOn, siteUrl, val } from "@/lib/site";
import "./globals.css";

// As variáveis abaixo alimentam --f-sans / --f-mono / --f-serif em styles/tokens.css.
const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
});

// Newsreader: largura e cor mais próximas da GT Alpina (medido na Fase 2).
const serif = Newsreader({
  variable: "--font-serif",
  axes: ["opsz"],
  // itálico: 2ª linha do H1 do hero
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
});

const nome = val(site.identidade.nome);
const cidade = val(site.identidade.cidade);
const estado = val(site.identidade.estado);

const url = siteUrl();

// abertura animada: decidida antes da 1ª pintura (lib/abertura.ts)
const abertura = scriptAbertura({
  home: isOn("abertura"),
  internas: isOn("abertura") ? (Object.keys(site.paginas) as PaginaId[]).filter(paginaOn).map((id) => site.paginas[id].href) : [],
});

export const metadata: Metadata = {
  // canonical e breadcrumbs das páginas saem deste domínio (seo.url ou identidade.site)
  metadataBase: url ?? undefined,
  // SEO local (VENUE-TEMPLATE.md §5)
  title: `${nome} | ${site.idioma.titulo_seo} ${cidade}, ${estado}`,
  description: site.seo.descricao,
  // template e demos de venda sempre com noindex (site.seo.noindex)
  robots: site.seo.noindex ? { index: false, follow: false } : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.idioma.lang}
      // rolagem suave só dentro da página: na troca de rota o Next rola instantâneo (Next 16)
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
      // o script da abertura marca o <html> (data-abertura / data-entrada) antes do React
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: abertura }} />
      </head>
      <body>
        {/* modo guia das seções do topo, no fluxo: o header é fixo e cobriria as faixas */}
        <TopGuide anuncio={isOn("anuncio")} />
        <AnnouncementBar />
        {/* o header fixo começa aqui e sobe junto com a página até o topo (Header.tsx) */}
        <div id="header-anchor" />
        <Header />
        {children}
        <Footer />
        {site.secoes.barra_mobile.enabled && <MobileStickyBar />}
        {/* card Schedule a Tour: todo link /?tour do site abre ele (components/tour/) */}
        <TourProvider />
      </body>
    </html>
  );
}
