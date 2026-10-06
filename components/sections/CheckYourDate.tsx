import { site } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { Placeholder } from "@/components/ui/Placeholder";
import { midiaLabel, val } from "@/lib/site";
import styles from "@/styles/CheckYourDate.module.css";

const { titulo, apoio, foto } = site.secoes.checar_data;

// Seção 13 — Check Your Date (Destino em destaque do modelo): foto full-bleed de fundo e card
// claro com H2 + 1 frase + o botão que abre o card Schedule a Tour (components/tour/). O depoimento
// de destaque fica ao lado (§1: prova social perto do CTA).
export function CheckYourDate() {
  const depoimento = site.depoimentos.find((d) => d.destaque);
  return (
    <section id="check-your-date" className={styles.section}>
      <SectionGuide id="checar_data" />
      <div className={styles.banner}>
        <Media src={val(foto)} alt={foto.alt} label={midiaLabel(foto.placeholder)} sizes="(min-width: 992px) 100vw, 100vw" quadro={[1.6, 0.37]} tone="dark" className={styles.background} />
        {depoimento && (
          <figure className={styles.quote}>
            <blockquote className="t-h3-serif">
              <Placeholder as="span">{`“${depoimento.texto}”`}</Placeholder>
            </blockquote>
            <figcaption className={`t-meta ${styles.caption}`}>
              {[depoimento.nome, depoimento.data].filter(Boolean).join(" · ")}
            </figcaption>
          </figure>
        )}
        <div className={styles.card}>
          <Placeholder as="h2" className={`t-display ${styles.title}`}>{titulo}</Placeholder>
          <Placeholder className={`t-body ${styles.support}`}>{apoio}</Placeholder>
          <Button href={site.cta.href} theme="black" size="l" fullWidth>
            {site.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
