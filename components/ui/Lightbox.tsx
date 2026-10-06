"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import styles from "@/styles/Lightbox.module.css";
import { QUALIDADE } from "@/lib/imagem";

type Item = { src: string | null; alt: string; label: string; ratio: string };

// Fotos em tela cheia. <dialog> nativo: Esc fecha, o foco fica dentro e a página não rola
// (base.css). Setas na tela e no teclado (← →); clique fora da foto também fecha.
export function Lightbox({
  label,
  items,
  index,
  onChange,
}: {
  label: string;
  items: Item[];
  index: number | null;
  onChange: (i: number | null) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const go = (dir: 1 | -1) => index !== null && onChange((index + dir + items.length) % items.length);
  const item = index !== null ? items[index] : null;

  return (
    <dialog
      ref={ref}
      className={styles.lightbox}
      aria-label={label}
      onClose={() => onChange(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onClick={(e) => e.target === e.currentTarget && onChange(null)}
    >
      {item && (
        <>
          <div className={styles.top}>
            <span className={`t-meta ${styles.count}`}>
              {index! + 1} / {items.length}
            </span>
            <button type="button" className={styles.icon} onClick={() => onChange(null)} aria-label={site.ui.fechar} autoFocus>
              <Icon name="close" />
            </button>
          </div>
          <div className={styles.stage} onClick={(e) => e.target === e.currentTarget && onChange(null)}>
            {item.src ? (
              <div className={styles.frame}>
                <Image src={item.src} alt={item.alt} fill sizes="100vw" quality={QUALIDADE} className={styles.image} />
              </div>
            ) : (
              <div className={styles.placeholder} style={{ aspectRatio: item.ratio }}>
                <span className="t-meta">{item.label}</span>
              </div>
            )}
          </div>
          {items.length > 1 && (
            <>
              <button type="button" className={`${styles.icon} ${styles.prev}`} onClick={() => go(-1)} aria-label={site.ui.anterior}>
                <Icon name="arrow-left" />
              </button>
              <button type="button" className={`${styles.icon} ${styles.next}`} onClick={() => go(1)} aria-label={site.ui.proximo}>
                <Icon name="arrow-right" />
              </button>
            </>
          )}
        </>
      )}
    </dialog>
  );
}
