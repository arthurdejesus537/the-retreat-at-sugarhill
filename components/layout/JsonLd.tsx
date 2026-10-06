import { site, type PaginaId } from "@/content/site";
import { siteUrl, val } from "@/lib/site";

// < escapado: o JSON vai dentro de um <script> (recomendação do guia de JSON-LD do Next)
const json = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

// SEO local (VENUE-TEMPLATE §5): EventVenue (nome, endereço, telefone, capacidade máx.)
// + FAQPage a partir do FAQ. Campo null não entra.
export function JsonLd() {
  const { identidade, numeros } = site;
  const capacidade = Number(val(numeros.capacidade_max));
  const venue = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: val(identidade.nome),
    url: val(identidade.site) ?? undefined,
    telephone: val(identidade.telefone) ?? undefined,
    email: val(identidade.email) ?? undefined,
    image: val(site.hero.foto) ?? undefined,
    address: val(identidade.endereco)
      ? {
          "@type": "PostalAddress",
          streetAddress: val(identidade.endereco),
          addressLocality: val(identidade.cidade) ?? undefined,
          addressRegion: val(identidade.estado) ?? undefined,
          addressCountry: site.idioma.pais,
        }
      : undefined,
    maximumAttendeeCapacity: Number.isFinite(capacidade) && capacidade > 0 ? capacidade : undefined,
    sameAs: [val(identidade.instagram), val(identidade.facebook)].filter((u) => u && u !== "#"),
  };
  const faq = site.secoes.faq.enabled && site.faq.length > 0 && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faq.map((q) => ({
      "@type": "Question",
      name: q.pergunta,
      acceptedAnswer: { "@type": "Answer", text: q.resposta },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={json(venue)} />
      {faq && <script type="application/ld+json" dangerouslySetInnerHTML={json(faq)} />}
    </>
  );
}

// Páginas internas: BreadcrumbList Home → página, com URLs absolutas quando o domínio é conhecido.
export function BreadcrumbJsonLd({ id }: { id: PaginaId }) {
  const base = siteUrl();
  const abs = (path: string) => (base ? new URL(path, base).toString() : path);
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.ui.breadcrumb_home, item: abs("/") },
      { "@type": "ListItem", position: 2, name: site.paginas[id].nome, item: abs(site.paginas[id].href) },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={json(data)} />;
}
