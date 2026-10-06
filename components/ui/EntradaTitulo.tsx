"use client";

import { animate } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import { LINHA, assumir, curva, limpar, primeiroQuadro, tempo } from "@/lib/abertura";
import { reduzirMovimento } from "@/lib/hero";

// Entrada do título das páginas internas (VENUE-TEMPLATE §2, abertura animada): a linha sobe
// de baixo para cima atrás de uma máscara, a cada visita, sem cortina. Na 1ª pintura o script
// do <head> já marcou data-entrada="on" e o CSS esconde o título (InternalPage.module.css);
// vindo de outra página pelo menu, o 1º quadro é posto aqui, antes da pintura.
export function EntradaTitulo({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!el) return;
    assumir();
    if (reduzirMovimento().matches) {
      delete root.dataset.entrada;
      return;
    }
    primeiroQuadro([el], LINHA);
    delete root.dataset.entrada;
    const fim = () => limpar([el]);
    const c = animate(el, LINHA, { duration: tempo("--abertura-texto"), ease: curva() });
    c.then(fim, fim);
    return () => c.stop();
  }, []);

  return (
    <span ref={ref} className={className} data-entra="titulo">
      {children}
    </span>
  );
}
