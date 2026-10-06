"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { Button } from "@/components/ui/Button";
import { smsHref, val } from "@/lib/site";
import styles from "@/styles/MobileStickyBar.module.css";

const sms = smsHref(val(site.identidade.telefone));

// Barra fixa no rodapé do celular (< 768px): aparece depois do hero e some quando o
// a chamada final (#check-your-date) chega na tela — daí para baixo o CTA já está à vista.
export function MobileStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("check-your-date");
    const update = () => {
      const h = window.innerHeight;
      const passouHero = window.scrollY > h * 0.8;
      const formNaTela = form ? form.getBoundingClientRect().top < h : false;
      setVisible(passouHero && !formNaTela);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={styles.bar} data-visible={visible || undefined} inert={!visible}>
      <SectionGuide id="barra_mobile" overlay className={styles.guide} />
      <Button href={site.cta.href} theme="black" fullWidth className={styles.button}>
        {site.cta.label}
      </Button>
      <Button href={sms} theme="black" variant="outline" fullWidth className={styles.button}>
        {site.secoes.barra_mobile.text_us}
      </Button>
    </div>
  );
}
