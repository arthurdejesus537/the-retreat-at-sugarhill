import type { Depoimento } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";
import styles from "@/styles/CardQuote.module.css";

// Card de depoimento (Love Notes), sobre fundo preto: o card de artigo do Journal do modelo
// sem imagem — citação em serif, nome e data em mono. O texto é cortado, nunca reescrito.
export function CardQuote({ depoimento }: { depoimento: Depoimento }) {
  return (
    <figure className={styles.card}>
      <blockquote className={`t-h3-serif ${styles.quote}`}>
        <Placeholder as="span">{depoimento.texto}</Placeholder>
      </blockquote>
      <figcaption className={styles.caption}>
        <span className={`t-meta ${styles.name}`}>{depoimento.nome}</span>
        {depoimento.data && <span className={`t-meta ${styles.date}`}>{depoimento.data}</span>}
      </figcaption>
    </figure>
  );
}
