import { site } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { FactsStrip } from "@/components/sections/FactsStrip";
import { Media } from "@/components/ui/Media";
import { Placeholder } from "@/components/ui/Placeholder";
import { Tag } from "@/components/ui/Tag";
import { isOn, midiaLabel, val } from "@/lib/site";
import styles from "@/styles/VenueSpaces.module.css";

const { eyebrow, todos } = site.secoes.espacos;

// Bloco da página The Venue: faixa de números + TODOS os
// espaços (inclusive os so_na_pagina), cada um com a descrição completa e todas as tags.
// Foto e texto alternam de lado no desktop.
export function VenueSpaces() {
  return (
    <section id="all-spaces" className={`has-guide ${styles.spaces}`}>
      <SectionGuide id="espacos" />
      {isOn("fatos") && <FactsStrip />}
      <header className={`container ${styles.head}`}>
        <p className={`t-meta ${styles.eyebrow}`}>{eyebrow}</p>
        <Placeholder as="h2" className={`t-display ${styles.title}`}>{todos}</Placeholder>
      </header>
      <ul className={styles.list}>
        {site.espacos.map((e, i) => {
          const foto = e.foto;
          const tags = [...(e.capacidade ? [e.capacidade] : []), ...(e.tags ?? [])];
          return (
            <li key={`${e.nome}-${i}`} className={styles.item} data-sem-foto={!foto || undefined}>
              {foto && (
                <Media
                  src={val(foto)}
                  alt={foto.alt}
                  label={midiaLabel(foto.placeholder)}
                  sizes="(min-width: 992px) 58vw, 100vw"
                  quadro={[1.5, 1.33]}
                  className={styles.media}
                />
              )}
              <div className={styles.text}>
                {e.uso && <p className={`t-meta ${styles.uso}`}>{e.uso}</p>}
                <Placeholder as="h3" className={`t-h3 ${styles.name}`}>{e.nome}</Placeholder>
                {(e.descricao_completa ?? e.descricao) && (
                  <Placeholder className={`t-body ${styles.description}`}>{(e.descricao_completa ?? e.descricao)!}</Placeholder>
                )}
                {tags.length > 0 && (
                  <ul className={styles.tags}>
                    {tags.map((t) => (
                      <li key={t}>
                        <Tag>{t}</Tag>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
