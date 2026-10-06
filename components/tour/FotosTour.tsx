"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { Media } from "@/components/ui/Media";
import { Placeholder } from "@/components/ui/Placeholder";
import { midiaLabel, val } from "@/lib/site";
import styles from "@/styles/Tour.module.css";

export const fotosTour = site.secoes.tour.fotos;

// cada foto fica 4s na tela (o crossfade, --tour-foto-fade, conta dentro dos 4s)
const TOUR_FOTO_MS = 4000;
// proporção da coluna da foto (~412 x 584 no desktop): o arquivo cobre o recorte
const FOTO_QUADRO = 0.7;

// Fotos ao lado do formulário (768px ou mais; no celular ficam ocultas e não baixam): empilhadas,
// a ativa aparece em crossfade com o seu título, trocando a cada 4s e voltando à 1ª; tracinhos na
// base mostram qual está na tela. Parado na 1ª com reduzir movimento; pausa com a aba oculta.
// Decorativo (aria-hidden): fora do Tab e do foco preso.
export function FotosTour({ reduzir }: { reduzir: boolean }) {
  const [ativa, setAtiva] = useState(0);
  const [visivel, setVisivel] = useState(true);
  const total = fotosTour.length;

  useEffect(() => {
    const onVis = () => setVisivel(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (reduzir || !visivel || total < 2) return;
    const t = setTimeout(() => setAtiva((i) => (i + 1) % total), TOUR_FOTO_MS);
    return () => clearTimeout(t);
  }, [ativa, reduzir, visivel, total]);

  return (
    <figure className={styles.foto} aria-hidden="true">
      {fotosTour.map(({ foto, titulo }, i) => (
        <div key={i} className={styles.slide} data-ativa={i === ativa || undefined}>
          <Media src={val(foto)} label={midiaLabel(foto.placeholder)} sizes="(min-width: 768px) 412px, 1px" quadro={FOTO_QUADRO} tone="dark" className={styles.fotoMedia} />
          <Placeholder className={styles.fotoTitulo}>{titulo}</Placeholder>
        </div>
      ))}
      {total > 1 && (
        <div className={styles.tracos}>
          {fotosTour.map((_, i) => (
            <span key={i} className={styles.traco} data-ativa={i === ativa || undefined} />
          ))}
        </div>
      )}
    </figure>
  );
}
