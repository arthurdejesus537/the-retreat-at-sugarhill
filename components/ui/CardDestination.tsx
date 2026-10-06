import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { Placeholder } from "@/components/ui/Placeholder";
import styles from "@/styles/CardDestination.module.css";

type Props = {
  meta: string;
  name: string;
  description?: string | null;
  image: string | null;
  imageLabel: string;
  // sem href o card não é link (hospedagem sem reserva online)
  href?: string | null;
  viewLabel?: string;
  badge?: string | null;
  size?: "m" | "l";
};

// Card de destino do modelo (SITE-MESTRE.md §5.8): imagem, meta em mono, nome e 1 frase.
export function CardDestination({ meta, name, description, image, imageLabel, href, viewLabel, badge, size = "m" }: Props) {
  const content = (
    <>
      <div className={styles.media}>
        <Media
          src={image}
          label={imageLabel}
          sizes={size === "l" ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 992px) 24vw, 80vw"}
          quadro={size === "l" ? 1.33 : 0.71}
          className={`${styles.image} ${size === "l" ? styles.large : ""}`}
        />
        {badge && <Badge className={styles.badge}>{badge}</Badge>}
        {href && viewLabel && (
          <Button size="s" className={styles.view}>
            {viewLabel}
          </Button>
        )}
      </div>
      <div className={styles.body}>
        <Placeholder className={`t-meta ${styles.region}`}>{meta}</Placeholder>
        <Placeholder as="h3" className={`t-h3 ${styles.name}`}>{name}</Placeholder>
        {description && <Placeholder className={`t-body ${styles.description}`}>{description}</Placeholder>}
      </div>
    </>
  );

  if (!href) return <div className={styles.card}>{content}</div>;
  return (
    <Link href={href} className={styles.card} target={href.startsWith("http") ? "_blank" : undefined}>
      {content}
    </Link>
  );
}
