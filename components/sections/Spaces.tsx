import Link from "next/link";
import { site, type Espaco, type Stay } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CardStay } from "@/components/ui/CardStay";
import { Media } from "@/components/ui/Media";
import { Placeholder } from "@/components/ui/Placeholder";
import { TagList } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { midiaLabel, val } from "@/lib/site";
import styles from "@/styles/Spaces.module.css";

const { eyebrow, titulo, link, ver } = site.secoes.espacos;

// espaço → dados do card de stay do modelo (os espaços não têm página: o card leva ao tour)
function toCard(e: Espaco): Stay {
  // capacidade primeiro: é a tag que responde "cabe?" e não pode cair no "+N"
  const tags = [...(e.capacidade ? [e.capacidade] : []), ...(e.tags ?? [])];
  return {
    name: e.nome,
    location: e.uso ?? "",
    description: e.descricao ?? "",
    href: site.cta.href,
    tags: tags.map((label) => ({ label })),
    image: val(e.foto),
    imageLabel: e.foto ? midiaLabel(e.foto.placeholder) : undefined,
  };
}

// Seção 5 — The Spaces (Selected Stays do modelo): split assimétrico. Espaço-herói grande
// com selo à esquerda (sticky) e cabeçalho + cards dos outros espaços à direita.
export function Spaces() {
  // espaços marcados so_na_pagina aparecem só na página The Venue
  const [heroi, ...outros] = site.espacos.filter((e) => !e.so_na_pagina);
  const featured = toCard(heroi);
  return (
    <section id="the-spaces" className={`has-guide ${styles.stays}`}>
      <SectionGuide id="espacos" overlay />
      <div className={styles.featuredWrapper}>
        <div className={styles.featuredBlock}>
          <Link href={featured.href} className={styles.featured}>
            <span className={styles.featuredMediaWrap}>
              <Media
                src={featured.image}
                alt={heroi.foto?.alt}
                label={featured.imageLabel ?? ""}
                sizes="(min-width: 992px) 58vw, 100vw"
                quadro={[0.83, 0.71]}
                tone="dark"
                className={styles.featuredMedia}
              />
              <Placeholder as="span" className={`t-lead ${styles.featuredTitle}`}>{featured.name}</Placeholder>
              <Button size="s" className={styles.view}>{ver}</Button>
              {heroi.selo && <Badge className={styles.badge}>{heroi.selo}</Badge>}
            </span>
            {/* no mobile o nome sai de cima da imagem e vai para baixo dela */}
            <span className={styles.featuredHeadline}>
              <span className={`t-meta ${styles.featuredLocation}`}>{featured.location}</span>
              <span className={`t-h3 ${styles.featuredName}`}>{featured.name}</span>
              <span className={`t-body ${styles.featuredDescription}`}>{featured.description}</span>
            </span>
          </Link>
          {/* chips só no mobile, abaixo do nome */}
          <div className={styles.featuredTags}>
            <TagList tags={featured.tags} />
          </div>
        </div>

        <div className={styles.head}>
          <p className={`t-meta ${styles.eyebrow}`}>{eyebrow}</p>
          <Placeholder as="h2" className={`t-display ${styles.title}`}>{titulo}</Placeholder>
          <TextLink href={link.href}>{link.label}</TextLink>
        </div>
      </div>

      {outros.length > 0 && (
        <div className={styles.list}>
          {outros.map((e, i) => (
            <CardStay key={`${e.nome}-${i}`} stay={toCard(e)} viewLabel={ver} />
          ))}
        </div>
      )}
    </section>
  );
}
