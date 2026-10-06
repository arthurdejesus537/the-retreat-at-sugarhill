import Link from "next/link";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { Media } from "@/components/ui/Media";
import { Placeholder } from "@/components/ui/Placeholder";
import { posterLoop } from "@/lib/site";
import styles from "@/styles/CardCollection.module.css";

type Props = {
  href: string;
  // linha de cima: esquerda / direita (mono)
  top?: [string, string];
  title: string;
  text?: string;
  items?: string[];
  image?: string | null;
  imageLabel?: string;
  // loop por cima da foto (LoopSecao.nome); o poster dele substitui a foto
  video?: string | null;
  // card final sem mídia, fundo escuro (o "More Collections" do modelo)
  final?: boolean;
};

// Card de coleção (SITE-MESTRE.md §5.7): foto pura (sem degradê) só com o título por cima;
// linha de cima, frase e itens ficam na legenda, embaixo da foto.
export function CardCollection({ href, top, title, text, items = [], image = null, imageLabel = "", video = null, final = false }: Props) {
  return (
    <Link href={href} className={styles.card} draggable={false}>
      <span className={styles.frame}>
        {!final && (
          <span className={styles.media}>
            <Media src={video ? posterLoop(video) : image} label={imageLabel} sizes="(min-width: 992px) 31vw, 80vw" quadro={0.72} tone="dark" className={styles.image} />
            {video && <LoopVideo nome={video} />}
          </span>
        )}
        <Placeholder as="span" className={`t-display ${styles.name}`}>{title}</Placeholder>
      </span>
      {!final && (
        <span className={styles.caption}>
          {top && <span className={`t-meta ${styles.top}`}>{top.join(" · ")}</span>}
          {text && <Placeholder as="span" className={styles.text}>{text}</Placeholder>}
          {items.length > 0 && (
            <span className={`t-meta ${styles.items}`}>
              {items.map((item, i) => (
                <span key={`${item}-${i}`}>{item}</span>
              ))}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
