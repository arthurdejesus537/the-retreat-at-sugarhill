"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { Carousel } from "@/components/ui/Carousel";
import { Lightbox } from "@/components/ui/Lightbox";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { QUALIDADE, sizesCobrindo } from "@/lib/imagem";
import { midiaLabel, midiaRatio, val } from "@/lib/site";
import links from "@/styles/SectionLinks.module.css";
import styles from "@/styles/Gallery.module.css";

// largura de cada foto na faixa (medida) e proporção do quadro (desktop, celular), pelo formato
const GALERIA = {
  horizontal: ["(min-width: 992px) 43vw, 91vw", [1.5, 1.22]],
  vertical: ["(min-width: 992px) 19vw, 49vw", [0.67, 0.67]],
  quadrada: ["(min-width: 992px) 29vw, 66vw", [1, 1]],
} as const satisfies Record<string, readonly [string, readonly number[]]>;

const { titulo, link } = site.secoes.galeria;
// a faixa mostra até 12 fotos (o §4 pede 8–12); com mais, o link abre a galeria inteira
const MAX_FAIXA = 12;

// Seção 12 — Gallery (nova): "quero me ver ali". Faixa horizontal com scroll-snap,
// fotos da mesma altura e larguras pelo formato de cada uma. Toque numa foto abre a lightbox.
export function Gallery() {
  const fotos = site.galeria.fotos;
  const faixa = fotos.slice(0, MAX_FAIXA);
  const [aberta, setAberta] = useState<number | null>(null);
  const verTudo = fotos.length > MAX_FAIXA && (
    <button type="button" className={`t-link ${styles.more}`} onClick={() => setAberta(0)}>
      {link}
    </button>
  );

  return (
    <section id="gallery" className={styles.gallery}>
      <SectionGuide id="galeria" />
      <Carousel
        label={titulo}
        autoWidth
        gap="var(--col-gap)"
        heading={
          <div className={styles.headline}>
            <h2 className="t-display">{titulo}</h2>
            {verTudo && <span className={links.desktop}>{verTudo}</span>}
          </div>
        }
      >
        {faixa.map((f, i) => {
          const src = val(f);
          return (
            <button
              key={i}
              type="button"
              className={styles.photo}
              style={{ aspectRatio: midiaRatio(f.placeholder.formato) }}
              onClick={() => setAberta(i)}
              aria-label={`${titulo} ${i + 1} ${site.ui.slide} ${fotos.length}${f.alt ? ` — ${f.alt}` : ""}`}
            >
              {src ? (
                <Image
                  src={src}
                  alt={f.alt}
                  fill
                  sizes={sizesCobrindo(src, GALERIA[f.placeholder.formato][0], GALERIA[f.placeholder.formato][1])}
                  quality={QUALIDADE}
                  className={styles.image}
                  draggable={false}
                />
              ) : (
                <MediaPlaceholder spec={f.placeholder} />
              )}
            </button>
          );
        })}
      </Carousel>
      {verTudo && <p className={links.mobile}>{verTudo}</p>}
      <Lightbox
        label={titulo}
        index={aberta}
        onChange={setAberta}
        items={fotos.map((f) => ({ src: val(f), alt: f.alt, label: midiaLabel(f.placeholder), ratio: midiaRatio(f.placeholder.formato) }))}
      />
    </section>
  );
}
