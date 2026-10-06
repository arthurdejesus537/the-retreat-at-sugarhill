"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/MapEmbed.module.css";

// Mapa do Google Maps em iframe (sem chave de API). O iframe só é criado quando o bloco chega
// perto da tela, para não pesar o carregamento da página; até lá, o fundo de placeholder.
export function MapEmbed({ src, title, className = "" }: { src: string; title: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${styles.map} ${className}`}>
      {visivel && <iframe src={src} title={title} className={styles.frame} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
    </div>
  );
}
