import { site, type Pergunta } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import styles from "@/styles/Faq.module.css";


// Seção 11 — FAQ (nova): objeções respondidas antes de virar motivo para não ligar.
// Desktop: título + CTA à esquerda (sticky), acordeão à direita. <details> nativo: funciona sem JS.
// Na página Packages: só as perguntas de preço, bebida e capacidade, com outro título e id.
export function Faq({
  itens = site.faq,
  titulo = site.secoes.faq.titulo,
  id = "faq",
}: {
  itens?: Pergunta[];
  titulo?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`container ${styles.faq}`}>
      <SectionGuide id="faq" />
      <div className={styles.grid}>
        <div className={styles.aside}>
          <h2 className={`t-display ${styles.title}`}>{titulo}</h2>
          <Button href={site.cta.href} theme="black">
            {site.cta.label}
          </Button>
        </div>
        <div className={styles.list}>
          {itens.map((item, i) => (
            <details key={`${item.pergunta}-${i}`} className={styles.item}>
              <summary className={styles.question}>
                <Placeholder as="span">{item.pergunta}</Placeholder>
                <span className={styles.icon} aria-hidden="true">
                  <Icon name="chevron-down" />
                </span>
              </summary>
              <Placeholder className={`t-body ${styles.answer}`}>{item.resposta}</Placeholder>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
