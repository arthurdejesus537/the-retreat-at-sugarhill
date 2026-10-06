"use client";

/*
 * SmoothInput — campo de texto com cursor que desliza com mola entre as posições.
 * Adaptado de "Smooth Caret Input" (skiper106) da Skiper UI — https://skiper-ui.com/v1/skiper106
 * Interface components by Skiper UI (licença gratuita com crédito; crédito também no rodapé,
 * `secoes.footer.creditos_ui`). Mudanças: sem Tailwind/cn (CSS Module com tokens), sem dialkit
 * (painel da demo; mola fixa nos valores padrão dela), sem o modo senha, cursor nativo com
 * "reduzir movimento".
 */

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import styles from "@/styles/SmoothInput.module.css";

// mola da demo original (stiffness 500, damping 30, mass .5)
const MOLA = { stiffness: 500, damping: 30, mass: 0.5 };

type Props = ComponentPropsWithoutRef<"input"> & { wrapperClassName?: string };

export function SmoothInput({ className, wrapperClassName, onFocus, onBlur, onChange, ...props }: Props) {
  const reduzir = useReducedMotion() ?? false;
  const input = useRef<HTMLInputElement>(null);
  const medida = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const opacidade = useMotionValue(0);
  const xMola = useSpring(x, MOLA);

  // largura do texto antes do cursor, medida num span com a mesma fonte do campo
  const larguraAte = (alvo: HTMLInputElement, texto: string) => {
    const span = medida.current;
    const css = window.getComputedStyle(alvo);
    const pad = parseFloat(css.paddingLeft) || 0;
    if (!span || texto.length === 0) return pad - 1;
    span.style.font = `${css.fontStyle} ${css.fontWeight} ${css.fontSize} ${css.fontFamily}`;
    span.style.letterSpacing = css.letterSpacing;
    span.style.fontFeatureSettings = css.fontFeatureSettings;
    span.textContent = texto;
    return span.offsetWidth + pad;
  };

  const atualizar = (alvo: HTMLInputElement) => {
    const inicio = alvo.selectionStart ?? 0;
    const fim = alvo.selectionEnd ?? 0;
    const indice = inicio === fim || alvo.selectionDirection === "backward" ? inicio : fim;
    const absoluto = larguraAte(alvo, alvo.value.slice(0, indice));
    const css = window.getComputedStyle(alvo);
    const pad = parseFloat(css.paddingLeft) || 0;
    const padDir = parseFloat(css.paddingRight) || 0;
    // mantém o cursor à vista quando o texto passa da largura do campo
    const direita = alvo.scrollLeft + alvo.clientWidth - padDir;
    if (absoluto > direita) alvo.scrollLeft = absoluto - alvo.clientWidth + padDir;
    else if (absoluto < alvo.scrollLeft + pad) alvo.scrollLeft = Math.max(0, absoluto - pad);
    const pos = absoluto - alvo.scrollLeft;
    const max = alvo.clientWidth - padDir;
    x.set(Math.min(pos, max));
    // com seleção, o cursor some (o realce da seleção já mostra onde está)
    opacidade.set(inicio !== fim || pos < pad - 1 || pos > max + 1 ? 0 : 1);
  };

  const atualizarRef = useRef(atualizar);
  useEffect(() => {
    atualizarRef.current = atualizar;
  });

  useEffect(() => {
    const el = input.current;
    if (!el || reduzir) return;
    const seFocado = () => document.activeElement === el && atualizarRef.current(el);
    const onSelecao = () => document.activeElement === el && requestAnimationFrame(seFocado);
    document.addEventListener("selectionchange", onSelecao);
    document.fonts.addEventListener("loadingdone", seFocado);
    el.addEventListener("scroll", seFocado);
    const ro = new ResizeObserver(seFocado);
    ro.observe(el);
    seFocado();
    return () => {
      document.removeEventListener("selectionchange", onSelecao);
      document.fonts.removeEventListener("loadingdone", seFocado);
      el.removeEventListener("scroll", seFocado);
      ro.disconnect();
    };
  }, [reduzir]);

  // reduzir movimento: campo comum, cursor nativo
  if (reduzir) {
    return (
      <div className={`${styles.raiz} ${wrapperClassName ?? ""}`}>
        <input {...props} ref={input} className={className} onFocus={onFocus} onBlur={onBlur} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className={`${styles.raiz} ${wrapperClassName ?? ""}`}>
      <input
        {...props}
        ref={input}
        className={`${styles.campo} ${className ?? ""}`}
        onFocus={(e) => {
          const alvo = e.currentTarget;
          requestAnimationFrame(() => atualizarRef.current(alvo));
          onFocus?.(e);
        }}
        onBlur={(e) => {
          opacidade.set(0);
          onBlur?.(e);
        }}
        onChange={(e) => {
          onChange?.(e);
          const alvo = e.target;
          requestAnimationFrame(() => atualizarRef.current(alvo));
        }}
      />
      <span ref={medida} aria-hidden="true" className={styles.medida} />
      <motion.span aria-hidden="true" className={styles.cursor} style={{ x: xMola, opacity: opacidade }} />
    </div>
  );
}
