"use client";

import { useLayoutEffect, useRef, type ElementType } from "react";
import { isPlaceholder } from "@/lib/site";
import styles from "@/styles/SurgeLinhas.module.css";

// Texto que surge linha por linha ao entrar na tela, uma única vez: cada palavra é um span e as
// palavras são agrupadas pela linha em que caíram (o texto quebra conforme a tela); cada linha
// sobe com fade, uma depois da outra (tempos e curva em tokens --surge-*). Sem JS ou com reduzir
// movimento, o texto fica parado e visível. Mesmo contrato do Placeholder (data-placeholder).
export function SurgeLinhas({ as: Tag = "p", className, children }: { as?: ElementType; className?: string; children: string }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const palavras = [...el.querySelectorAll<HTMLElement>(`.${styles.palavra}`)];
    // índice da linha de cada palavra; refeito se a largura mudar antes de entrar
    const medir = () => {
      const tops = [...new Set(palavras.map((p) => Math.round(p.offsetTop)))].sort((a, b) => a - b);
      palavras.forEach((p) => p.style.setProperty("--linha", String(tops.indexOf(Math.round(p.offsetTop)))));
    };
    medir();
    el.dataset.surge = "espera";
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.surge = "entra";
        io.disconnect();
        ro.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  // palavras em spans; os espaços ficam como texto entre eles (a quebra de linha continua natural)
  const partes = children.split(/(\s+)/);
  return (
    <Tag ref={ref} className={`${styles.raiz} ${className ?? ""}`} data-placeholder={isPlaceholder(children) || undefined}>
      {partes.map((p, i) =>
        /^\s+$/.test(p) || p === "" ? (
          p
        ) : (
          <span key={i} className={styles.palavra}>
            {p}
          </span>
        ),
      )}
    </Tag>
  );
}
