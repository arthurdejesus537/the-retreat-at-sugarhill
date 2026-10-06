"use client";

import { useEffect, useRef, useState } from "react";
import { reduzirMovimento, semVideo } from "@/lib/hero";
import styles from "@/styles/LoopVideo.module.css";

// Vídeo curto em loop sobre a foto de um card ou banner (VENUE-TEMPLATE §4, seções 6 e 10).
// Arquivos em public/video/loops/: <nome>.webm (VP9), <nome>.mp4 (H.264) e <nome>-poster.jpg.
// O poster fica embaixo, renderizado no servidor pelo Media (next/image); este componente só põe o
// vídeo por cima: mudo, em loop, playsinline, sem controles, aria-hidden. Só nasce perto da tela
// (não baixa o que ninguém vê), toca na tela e pausa fora dela ou com a aba oculta, e entra com fade
// quando o 1º quadro está pronto. Sem vídeo (fica só o poster): reduzir movimento, Save-Data ou
// conexão lenta (semVideo, o mesmo critério do hero).
export function LoopVideo({ nome, className = "" }: { nome: string; className?: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [pronto, setPronto] = useState(false);

  // cria o vídeo quando a caixa chega perto da tela (uma vez)
  useEffect(() => {
    const el = caixa.current;
    if (!el || semVideo()) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        const webm = document.createElement("video").canPlayType('video/webm; codecs="vp9"') === "probably";
        setSrc(`/video/loops/${nome}.${webm ? "webm" : "mp4"}`);
        obs.disconnect();
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [nome]);

  // toca na tela, pausa fora dela e com a aba oculta; reduzir movimento ligado no meio da visita tira o vídeo
  useEffect(() => {
    const el = caixa.current;
    const v = ref.current;
    if (!el || !v || !src) return;
    let naTela = false;
    const sync = () => (naTela && !document.hidden ? void v.play().catch(() => {}) : v.pause());
    const obs = new IntersectionObserver(([e]) => {
      naTela = e.isIntersecting;
      sync();
    });
    obs.observe(el);
    document.addEventListener("visibilitychange", sync);
    const q = reduzirMovimento();
    const parar = () => q.matches && setSrc(null);
    q.addEventListener("change", parar);
    return () => {
      obs.disconnect();
      document.removeEventListener("visibilitychange", sync);
      q.removeEventListener("change", parar);
    };
  }, [src]);

  return (
    <div ref={caixa} className={`${styles.caixa} ${className}`} aria-hidden="true">
      {src && (
        <video
          ref={ref}
          className={`${styles.video} ${pronto ? styles.pronto : ""}`}
          src={src}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          onLoadedData={() => setPronto(true)}
        />
      )}
    </div>
  );
}
