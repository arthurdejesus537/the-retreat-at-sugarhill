"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import styles from "@/styles/Carousel.module.css";

type Props = {
  // cabeçalho à esquerda das setas (normalmente o H2 da seção)
  heading: React.ReactNode;
  label: string;
  // slides visíveis por tela: número único ou por breakpoint (<768 · 768–991 · ≥992)
  perView?: number | { mobile: number; tablet: number; desktop: number };
  // espaço entre slides (as coleções usam 16px fixos; Journal e destinos, 1.6rem)
  gap?: string;
  showBar?: boolean;
  theme?: "light" | "dark";
  // slides com a largura do próprio conteúdo (galeria: alturas iguais, larguras variadas)
  autoWidth?: boolean;
  children: React.ReactNode;
};

// Carrossel com scroll nativo + snap, no lugar do Swiper do original: setas, barra de
// progresso arrastável e arraste com o mouse. Toque e trackpad usam o scroll nativo.
export function Carousel({ heading, label, perView = 3, gap, showBar = true, theme = "light", autoWidth = false, children }: Props) {
  const views = typeof perView === "number" ? { mobile: perView, tablet: perView, desktop: perView } : perView;
  const viewport = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ progress: 0, ratio: 1, atStart: true, atEnd: false });

  const update = useCallback(() => {
    const el = viewport.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // como o Swiper: proporção visível sem as margens laterais do trilho (gutter dos dois lados)
    const track = el.firstElementChild as HTMLElement;
    const pad = parseFloat(getComputedStyle(track).paddingLeft) * 2;
    setState({
      progress: max > 0 ? el.scrollLeft / max : 0,
      ratio: (el.clientWidth - pad) / (el.scrollWidth - pad),
      atStart: el.scrollLeft <= 1,
      atEnd: el.scrollLeft >= max - 1,
    });
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const behavior = (): ScrollBehavior =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  // avança um slide (largura do slide + gap)
  const step = (dir: 1 | -1) => {
    const el = viewport.current;
    const slide = el?.querySelector("li");
    if (!el || !slide) return;
    const gap = parseFloat(getComputedStyle(slide.parentElement!).columnGap) || 0;
    el.scrollBy({ left: dir * (slide.getBoundingClientRect().width + gap), behavior: behavior() });
  };

  // arrastar os slides com o mouse (como o Swiper)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: viewport.current!.scrollLeft, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < 5) return;
      // só captura depois que o arraste começa, senão o clique no link se perde
      d.moved = true;
      viewport.current!.setPointerCapture(e.pointerId);
      viewport.current!.dataset.dragging = "";
    }
    viewport.current!.scrollLeft = d.left - dx;
  };

  const onPointerUp = () => {
    delete viewport.current!.dataset.dragging; // devolve o snap, que alinha no slide mais próximo
    // mantém drag.current até o click, para cancelar o clique depois de arrastar
    setTimeout(() => (drag.current = null), 0);
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // arrastar o polegar da barra
  const onThumbDown = (e: React.PointerEvent) => {
    const el = viewport.current;
    const track = bar.current;
    if (!el || !track) return;
    e.preventDefault();
    const startX = e.clientX;
    const startLeft = el.scrollLeft;
    const scale = (el.scrollWidth - el.clientWidth) / (track.clientWidth * (1 - state.ratio));
    el.dataset.dragging = "";
    const move = (ev: PointerEvent) => (el.scrollLeft = startLeft + (ev.clientX - startX) * scale);
    const up = () => {
      delete el.dataset.dragging;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const slides = Children.toArray(children);
  const scrollable = state.ratio < 0.999;

  return (
    <div
      className={`${styles.carousel} ${styles[theme]} ${autoWidth ? styles.auto : ""}`}
      style={
        {
          "--per-view-m": views.mobile,
          "--per-view-t": views.tablet,
          "--per-view-d": views.desktop,
          ...(gap && { "--slide-gap": gap }),
        } as React.CSSProperties
      }
      role="region"
      aria-roledescription={site.ui.carrossel}
      aria-label={label}
    >
      <div className={styles.headline}>
        {heading}
        {scrollable && (
          <div className={styles.nav}>
            <button type="button" className={styles.arrow} onClick={() => step(-1)} disabled={state.atStart} aria-label={site.ui.anterior}>
              <Icon name="arrow-left" />
            </button>
            <button type="button" className={styles.arrow} onClick={() => step(1)} disabled={state.atEnd} aria-label={site.ui.proximo}>
              <Icon name="arrow-right" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={viewport}
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
      >
        <ul className={styles.track}>
          {slides.map((slide, i) => (
            <li key={i} className={styles.slide} aria-roledescription="slide" aria-label={`${i + 1} ${site.ui.slide} ${slides.length}`}>
              {slide}
            </li>
          ))}
        </ul>
      </div>

      {showBar && scrollable && (
        <div ref={bar} className={styles.bar} aria-hidden="true">
          <div
            className={styles.thumb}
            onPointerDown={onThumbDown}
            style={{
              width: `${state.ratio * 100}%`,
              transform: `translateX(${(state.progress * (1 - state.ratio) * 100) / state.ratio}%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}
