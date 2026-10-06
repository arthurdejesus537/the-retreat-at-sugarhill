"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "@/styles/TypeText.module.css";

// Texto que aparece como se estivesse sendo digitado, letra a letra, com cursor piscando,
// quando entra na tela (uma vez só). O texto inteiro fica no HTML (SEO, leitor de tela e sem JS)
// e reserva o espaço: a parte digitada vai por cima, então nada muda de lugar.
// Com reduzir movimento, aparece inteiro.

const LETRA_MS = 90; // intervalo entre letras
const ATRASO_MS = 220; // defasagem entre itens vizinhos (prop `ordem`)
const CURSOR_MS = 900; // cursor continua piscando um pouco depois de terminar

export function TypeText({ text, ordem = 0 }: { text: string; ordem?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  // null = ainda não animou (mostra o texto inteiro); número = letras visíveis
  const [n, setN] = useState<number | null>(null);
  const [cursor, setCursor] = useState(false);
  // true = escondido esperando entrar na tela
  const [armado, setArmado] = useState(false);

  // esconde antes da pintura, só se houver movimento e o item ainda não estiver na tela
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;
    setN(0);
    setArmado(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !armado) return;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setCursor(true);
        let i = 0;
        const digitar = () => {
          i += 1;
          setN(i);
          if (i < text.length) timer = setTimeout(digitar, LETRA_MS);
          else timer = setTimeout(() => setCursor(false), CURSOR_MS);
        };
        timer = setTimeout(digitar, ordem * ATRASO_MS);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [armado, text, ordem]);

  const digitando = n !== null;
  return (
    <span ref={ref} className={styles.wrap}>
      <span className={digitando ? styles.ghost : undefined}>{text}</span>
      {digitando && (
        <span className={styles.typed} aria-hidden="true">
          {text.slice(0, n)}
          {cursor && <span className={styles.cursor} />}
        </span>
      )}
    </span>
  );
}
