"use client";

import { useEffect, useState } from "react";
import { EVENTO_CLIPE } from "@/lib/hero";
import styles from "@/styles/Hero.module.css";

// Legenda do hero em vídeo (VENUE-TEMPLATE §2): texto curto em mono do clipe que está na frente
// (hero.videos[].legenda), com o número dele, trocando junto com a sequência (EVENTO_CLIPE do
// HeroSequence). O clipe 1 já vem no HTML; clipe sem legenda deixa a linha vazia.
export function HeroLegenda({ legendas, className }: { legendas: (string | null)[]; className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const trocar = (e: Event) => setI((e as CustomEvent<number>).detail);
    window.addEventListener(EVENTO_CLIPE, trocar);
    return () => window.removeEventListener(EVENTO_CLIPE, trocar);
  }, []);

  const texto = legendas[i];
  const n = (k: number) => String(k).padStart(2, "0");
  return (
    <p className={className}>
      {texto && (
        // key: a linha entra de novo (fade curto) a cada clipe
        <span key={i} className={styles.clipeTexto}>
          <span className={styles.clipeNumero}>
            {n(i + 1)}/{n(legendas.length)}
          </span>
          {texto}
        </span>
      )}
    </p>
  );
}
