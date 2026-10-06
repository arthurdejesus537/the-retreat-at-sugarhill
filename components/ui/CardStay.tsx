import Link from "next/link";
import type { Stay } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { TagList } from "@/components/ui/Tag";
import styles from "@/styles/CardStay.module.css";

// Card de hospedagem/projeto (SITE-MESTRE.md §5.4). O card inteiro é clicável pelo
// link do título; imagem e chips ficam por cima para ter hover e links próprios.
export function CardStay({ stay, viewLabel }: { stay: Stay; viewLabel: string }) {
  return (
    <article className={styles.card}>
      <Link href={stay.href} className={styles.mediaLink} tabIndex={-1} aria-hidden="true">
        <Media
          src={stay.image}
          label={stay.imageLabel ?? "[FOTO — vertical 517:724]"}
          sizes="(min-width: 992px) 22vw, 70vw"
          quadro={0.71}
          className={styles.media}
        />
        <Button size="s" className={styles.view}>{viewLabel}</Button>
      </Link>
      <div className={styles.headline}>
        <p className={`t-meta ${styles.location}`}>{stay.location}</p>
        <h3 className={`t-h3 ${styles.title}`}>
          <Link href={stay.href} className={styles.titleLink}>
            {stay.name}
          </Link>
        </h3>
        <div className={styles.data}>
          <p className={`t-body ${styles.description}`}>{stay.description}</p>
          <div className={styles.tags}>
            <TagList tags={stay.tags} moreHref={stay.href} />
          </div>
        </div>
      </div>
    </article>
  );
}
