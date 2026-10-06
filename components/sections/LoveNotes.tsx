import { site } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { CardQuote } from "@/components/ui/CardQuote";
import { Carousel } from "@/components/ui/Carousel";

const { titulo } = site.secoes.depoimentos;

// Seção 9 — Love Notes (Journal do modelo, fundo escuro): prova social em 3–4 citações curtas.
export function LoveNotes() {
  return (
    <section id="love-notes" className="section--dark">
      <SectionGuide id="depoimentos" />
      <Carousel
        label={titulo}
        theme="dark"
        perView={{ mobile: 1.2, tablet: 2.2, desktop: Math.min(site.depoimentos.length, 4) }}
        gap="var(--col-gap)"
        heading={<h2 className="t-display">{titulo}</h2>}
      >
        {site.depoimentos.map((d, i) => (
          <CardQuote key={`${d.nome}-${i}`} depoimento={d} />
        ))}
      </Carousel>
    </section>
  );
}
