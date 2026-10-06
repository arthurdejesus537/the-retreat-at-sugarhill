"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { EVENTO_CLIPE, HERO_MOBILE_QUERY, reduzirMovimento, semVideo } from "@/lib/hero";

// Sequência de clipes do hero (VENUE-TEMPLATE §2): cada clipe toca uma vez e, no fim, corta seco
// para o próximo (já pré-carregado e parado no 1º quadro); depois do último volta ao primeiro.
// Só a entrada do 1º clipe sobre o poster tem fade.
// O poster do clipe 1 é um <picture> renderizado no servidor (LCP); este componente só cuida
// dos vídeos, que nascem no cliente, depois do load da página, e só no conjunto certo
// (desktop 16:9 ou mobile 9:16), então o navegador nunca baixa o outro conjunto.
// Sem vídeo (fica só o poster): reduzir movimento, Save-Data ou conexão lenta.
// Com a abertura da home (data-abertura="on", lib/abertura.ts): o clipe 1 começa a baixar e a
// tocar na hora, embaixo da cortina, para já estar tocando quando a janela se abre; a janela é
// um recorte deste mesmo elemento, então ao crescer até a tela cheia não há emenda nem recomeço.
// A cada troca avisa o índice do clipe da frente (EVENTO_CLIPE) para a legenda do hero.

const PRELOAD_S = 2; // quanto antes do fim começa a baixar o próximo clipe

type Par<T> = [T, T];

const com = <T,>(par: Par<T>, i: number, v: T): Par<T> => (i === 0 ? [v, par[1]] : [par[0], v]);

export function HeroSequence({ clipes, className }: { clipes: string[]; className?: string }) {
  // conjunto (desktop/mobile) e extensão decididos no cliente; null = sem vídeo
  const [fonte, setFonte] = useState<{ base: string; ext: string } | null>(null);
  // dois <video> que se revezam: slot = índice do clipe carregado; ativo = o da frente
  const [slots, setSlots] = useState<Par<number | null>>([0, null]);
  const [visivel, setVisivel] = useState<Par<boolean>>([false, false]);
  const [ativo, setAtivo] = useState(0);
  // depois da 1ª troca, sem fade: corte seco
  const [corte, setCorte] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);
  const v0 = useRef<HTMLVideoElement>(null);
  const v1 = useRef<HTMLVideoElement>(null);
  const video = (i: number) => (i === 0 ? v0 : v1).current;

  // decide depois do load (o poster já está na tela e o vídeo não disputa banda com ele);
  // com a abertura, na hora: a janela da abertura mostra este clipe já tocando
  useEffect(() => {
    if (semVideo()) return;
    const abertura = document.documentElement.dataset.abertura === "on";
    const iniciar = () => {
      const webm = document.createElement("video").canPlayType('video/webm; codecs="vp9"') === "probably";
      setFonte({ base: window.matchMedia(HERO_MOBILE_QUERY).matches ? "mobile" : "desktop", ext: webm ? "webm" : "mp4" });
    };
    if (abertura || document.readyState === "complete") {
      const t = setTimeout(iniciar, 0);
      return () => clearTimeout(t);
    }
    window.addEventListener("load", iniciar, { once: true });
    return () => window.removeEventListener("load", iniciar);
  }, []);

  // janela mudou de celular para desktop (ou o contrário): troca o conjunto, no clipe em que está
  useEffect(() => {
    if (!fonte) return;
    const q = window.matchMedia(HERO_MOBILE_QUERY);
    const trocar = () => setFonte((f) => f && { ...f, base: q.matches ? "mobile" : "desktop" });
    q.addEventListener("change", trocar);
    return () => q.removeEventListener("change", trocar);
  }, [fonte]);

  // reduzir movimento ligado no meio da visita: some o vídeo, fica o poster
  useEffect(() => {
    const q = reduzirMovimento();
    const parar = () => q.matches && setFonte(null);
    q.addEventListener("change", parar);
    return () => q.removeEventListener("change", parar);
  }, []);

  // pausa fora da tela ou com a aba oculta; volta a tocar o da frente
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    let naTela = true;
    const sync = () => {
      const v = video(ativo);
      if (!v?.src) return;
      if (naTela && !document.hidden) void v.play().catch(() => {});
      else {
        v.pause();
        video(1 - ativo)?.pause();
      }
    };
    const io = new IntersectionObserver(([e]) => {
      naTela = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ativo, fonte]);

  // perto do fim: carrega o próximo no outro <video>; no fim, corte seco para ele
  const avancar = (i: number, v: HTMLVideoElement) => {
    if (i !== ativo || !v.duration || clipes.length < 2) return;
    const outro = 1 - i;
    const proximo = ((slots[i] ?? 0) + 1) % clipes.length;
    if (v.duration - v.currentTime < PRELOAD_S && slots[outro] !== proximo) setSlots((s) => com(s, outro, proximo));
    const n = video(outro);
    if (!v.ended || !n || slots[outro] !== proximo) return;
    n.currentTime = 0;
    void n.play().catch(() => {});
    setCorte(true);
    setVisivel(outro === 0 ? [true, false] : [false, true]);
    setAtivo(outro);
    window.dispatchEvent(new CustomEvent<number>(EVENTO_CLIPE, { detail: proximo }));
  };

  if (!fonte || clipes.length === 0) return null;

  const render = (i: number, ref: RefObject<HTMLVideoElement | null>) => {
    const slot = slots[i];
    return (
      <video
        ref={ref}
        src={slot === null ? undefined : `/video/hero/${fonte.base}/${clipes[slot]}.${fonte.ext}`}
        muted
        playsInline
        // autoplay só no 1º clipe; os seguintes são pré-carregados parados e tocam no crossfade
        autoPlay={i === 0 && slot === 0 && ativo === 0}
        preload={slot === null ? "none" : "auto"}
        tabIndex={-1}
        disablePictureInPicture
        // o da frente fica por cima
        style={{ zIndex: i === ativo ? 1 : 0 }}
        data-visivel={visivel[i] || undefined}
        // 1º clipe: aparece com fade quando começa a tocar
        onPlaying={() => i === ativo && !visivel[i] && setVisivel((vis) => com(vis, i, true))}
        onTimeUpdate={(e) => avancar(i, e.currentTarget)}
        onEnded={(e) => avancar(i, e.currentTarget)}
      />
    );
  };

  return (
    <div ref={caixa} className={className} data-corte={corte || undefined} aria-hidden="true">
      {render(0, v0)}
      {render(1, v1)}
    </div>
  );
}
