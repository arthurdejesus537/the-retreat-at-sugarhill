"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navLinks, smsHref, val } from "@/lib/site";
import styles from "@/styles/Header.module.css";

// Scroll (px) a partir do qual o header fica sólido. Medido no original: entre 8 e 12px.
const SOLID_AT = 10;
// Movimento mínimo (px) para trocar entre esconder/mostrar a barra de cima no mobile.
const SCROLL_TOLERANCE = 5;

const nav = navLinks();
const { text_us, menu } = site.secoes.header;
const sms = smsHref(val(site.identidade.telefone));

// Seção 1 — Header: The Venue · Packages · Stay · FAQ | nome | Text us + Schedule a Tour.
// O link da página interna aberta fica marcado (aria-current).
export function Header() {
  const path = usePathname();
  const current = (href: string) => (href === path ? ("page" as const) : undefined);
  const [scrolled, setScrolled] = useState(false);
  // no mobile a barra de cima se esconde ao rolar para baixo (headroom do original)
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const anchor = document.getElementById("header-anchor");
    const bar = document.getElementById("announcement");
    const root = document.documentElement;
    // altura real da faixa (no mobile ela quebra em mais linhas): o hero desconta ela
    // altura real da barra de cima do header mobile (o nome pode quebrar em 2 linhas):
    // é quanto o header sobe ao esconder
    const top = document.querySelector<HTMLElement>("[data-header-top]");
    const measure = () => {
      if (bar) root.style.setProperty("--announce-offset", `${bar.offsetHeight}px`);
      if (top) root.style.setProperty("--header-top-h", `${top.offsetHeight}px`);
    };
    measure();
    const onScroll = () => {
      const y = window.scrollY;
      // com a faixa de anúncio (ou o guia) acima, o header desce junto até ela sair da tela
      const offset = Math.max(0, anchor?.getBoundingClientRect().top ?? 0);
      root.style.setProperty("--header-offset", `${offset}px`);
      setScrolled(y > SOLID_AT);
      if (Math.abs(y - lastY) < SCROLL_TOLERANCE) return;
      setHidden(y > SOLID_AT && y > lastY);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      measure();
      onScroll();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // menu mobile: Esc fecha e a página não rola por trás
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKeyDown);
    document.documentElement.dataset.menuOpen = "";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      delete document.documentElement.dataset.menuOpen;
    };
  }, [open, close]);

  const solid = scrolled || open;

  return (
    <>
      {/* data-entra: desce do topo depois da abertura (Abertura.tsx) */}
      <header
        className={styles.header}
        data-solid={solid || undefined}
        data-hidden={(hidden && !open) || undefined}
        data-entra="header"
      >
        <div className={styles.top} data-header-top>
          {/* ---------- desktop: seções à esquerda ---------- */}
          <nav aria-label={site.ui.nav_principal} className={styles.desktop}>
            <ul className={styles.list}>
              {nav.map((link) => (
                <li key={link.href}>
                  <Link className={`t-nav ${styles.label}`} href={link.href} aria-current={current(link.href)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- mobile: Text us à esquerda ---------- */}
          <a href={sms} className={`t-nav ${styles.mobile} ${styles.label} ${styles.mobileLeft}`}>
            {text_us}
          </a>

          <div className={styles.center}>
            <Link href="/" className={styles.logoLink} onClick={close}>
              <Logo surface={solid ? "light" : "dark"} />
            </Link>
          </div>

          {/* ---------- desktop: Text us + CTA ---------- */}
          <div className={`${styles.desktop} ${styles.actions}`}>
            <a href={sms} className={`t-nav ${styles.label}`}>
              {text_us}
            </a>
            <Button href={site.cta.href} size="s" theme={solid ? "black" : "white"}>
              {site.cta.label}
            </Button>
          </div>

          {/* ---------- mobile: hambúrguer ---------- */}
          <div className={`${styles.mobile} ${styles.mobileRight}`}>
            <button
              type="button"
              className={styles.burger}
              aria-label={menu}
              aria-expanded={open}
              aria-controls="menu-mobile"
              data-open={open || undefined}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* ---------- mobile: barra de atalhos ---------- */}
        <nav aria-label={site.ui.nav_atalhos} className={`${styles.mobile} ${styles.bottom}`}>
          {nav.map((link) => (
            <Link key={link.href} href={link.href} className={styles.bottomLink} aria-current={current(link.href)} onClick={close}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <MobileMenu id="menu-mobile" open={open} links={nav} current={path} sms={sms} onNavigate={close} />
    </>
  );
}
