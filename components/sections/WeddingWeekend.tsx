import { site } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { CardCollection } from "@/components/ui/CardCollection";
import { Carousel } from "@/components/ui/Carousel";
import { midiaLabel, val } from "@/lib/site";
import styles from "@/styles/WeddingWeekend.module.css";

const { titulo, cards, final } = site.secoes.fim_de_semana;

// Seção 6 — Your Wedding Weekend (Curated Collections do modelo): antes · o dia · depois,
// com os itens reais incluídos, + card final para os pacotes.
// finalHref: destino do card final fora da home (página Stay → página Packages)
export function WeddingWeekend({ finalHref = final.href }: { finalHref?: string }) {
  return (
    <section id="wedding-weekend" className={styles.weekend}>
      <SectionGuide id="fim_de_semana" />
      <Carousel
        label={titulo}
        heading={<h2 className="t-display">{titulo}</h2>}
        perView={{ mobile: 1.3, tablet: 2.5, desktop: 3 }}
      >
        {cards.map((c, i) => (
          <CardCollection
            key={c.momento}
            href={finalHref}
            top={[c.momento, String(i + 1).padStart(2, "0")]}
            title={c.titulo}
            text={c.frase}
            items={c.itens}
            image={val(c.foto)}
            video={c.video?.nome}
            imageLabel={midiaLabel(c.foto.placeholder)}
          />
        ))}
        <CardCollection href={finalHref} title={final.label} final />
      </Carousel>
    </section>
  );
}
