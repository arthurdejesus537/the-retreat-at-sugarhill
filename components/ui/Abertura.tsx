"use client";

import { animate, motionValue, stagger, type AnimationPlaybackControlsWithThen } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  BLOCO,
  HEADER,
  LINHA,
  assumir,
  curva,
  limpar,
  numero,
  pararTodos,
  primeiroQuadro,
  tempo,
} from "@/lib/abertura";
import { HERO_MOBILE_QUERY } from "@/lib/hero";
import styles from "@/styles/Abertura.module.css";

// Abertura "A Janela" da home (VENUE-TEMPLATE §2), só quando o script do <head> marcou
// data-abertura="on". Tempos do desktop (tokens --abertura-*; no celular × --abertura-ritmo):
// 1. 0–0,6s   papel com o nome do venue grande na serif (já está no HTML, sem JS).
// 2. 0,6–1,0s o nome se abre no ponto de divisão e entre as partes surge uma janela 4:5 com o
//             clipe 1 do hero já tocando (ou o poster, se o vídeo ainda não carregou).
// 3. 1,0–2,2s pausa; a janela cresce ~10%.
// 4. 2,2–3,2s a janela se expande até cobrir o hero e as partes saem pelos lados (no celular,
//             nome empilhado: para cima e para baixo).
// 5. 3,2–4,0s header desce, H1 entra linha por linha com máscara, subtítulo e botões em fade.
// A janela não é outro vídeo: é um recorte (clip-path) da própria mídia do hero, que durante a
// abertura fica acima do papel. Quando o recorte chega ao tamanho do hero, o papel some e a mídia
// volta ao lugar dela, então o vídeo continua sem emenda. Clique, rolagem ou tecla pulam para o
// final. O conteúdo do hero está no HTML desde o início, embaixo do papel (SEO e LCP).
export function Abertura({ partes }: { partes: [string, string] }) {
  const cortina = useRef<HTMLDivElement>(null);
  const parteA = useRef<HTMLSpanElement>(null);
  const parteB = useRef<HTMLSpanElement>(null);
  const janela = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const tela = cortina.current;
    const a = parteA.current;
    const b = parteB.current;
    const molde = janela.current;
    const midia = document.querySelector<HTMLElement>("[data-hero-midia]");
    if (root.dataset.abertura !== "on" || !tela || !a || !b || !molde || !midia) return;
    assumir();

    const ritmo = numero("--abertura-ritmo");
    const t = (nome: string) => tempo(nome) * ritmo;

    // 0–1: a janela se abre ao longo do eixo das palavras / 1–cresce: pausa / 0–1: tela cheia
    const abre = motionValue(0);
    const cresce = motionValue(1);
    const expande = motionValue(0);

    // medidas (refeitas se a janela do navegador mudar): centro da janela, tamanho dela
    // (o molde invisível no CSS: altura --abertura-janela-h, 4:5), folga entre ela e as palavras,
    // bordas de dentro das duas partes do nome paradas e o retângulo da mídia do hero
    let m = medir();
    function medir() {
      const vertical = window.matchMedia(HERO_MOBILE_QUERY).matches;
      const j = molde!.getBoundingClientRect();
      const ra = a!.getBoundingClientRect();
      const rb = b!.getBoundingClientRect();
      // borda de dentro de cada parte, sem a translação atual
      const dentroA = (vertical ? ra.bottom : ra.right) - (vertical ? parseY(a!) : parseX(a!));
      const dentroB = (vertical ? rb.top : rb.left) - (vertical ? parseY(b!) : parseX(b!));
      // a janela nasce no ponto de divisão (o nome inteiro está centralizado e as partes têm
      // larguras diferentes), então as duas partes se afastam por igual
      const divisao = (dentroA + dentroB) / 2;
      return {
        vertical,
        cx: vertical ? window.innerWidth / 2 : divisao,
        cy: vertical ? divisao : window.innerHeight / 2,
        w: j.width,
        h: j.height,
        folga: parseFloat(getComputedStyle(molde!).marginLeft) || 0,
        dentroA,
        dentroB,
        midia: midia!.getBoundingClientRect(),
      };
    }

    const desenhar = () => {
      const { vertical, cx, cy, w, h, folga, dentroA, dentroB, midia: r } = m;
      const s = cresce.get();
      const k = abre.get();
      const e = expande.get();
      // janela no tamanho da pausa; no eixo das palavras, aberta pela fração k
      const meiaW = (w * s) / 2;
      const meiaH = (h * s) / 2;
      const lerp = (de: number, para: number) => de + (para - de) * e;
      const esq = lerp(cx - (vertical ? meiaW : meiaW * k), r.left);
      const dir = lerp(cx + (vertical ? meiaW : meiaW * k), r.right);
      const topo = lerp(cy - (vertical ? meiaH * k : meiaH), r.top);
      const base = lerp(cy + (vertical ? meiaH * k : meiaH), r.bottom);
      midia.style.clipPath = `inset(${topo - r.top}px ${r.right - dir}px ${r.bottom - base}px ${esq - r.left}px)`;
      // cada parte encosta na borda da janela inteira (sem a fração k), com a folga; enquanto a
      // janela se abre, sai da posição parada (encostadas uma na outra) para essa posição
      const fora = (parada: number, aberta: number) => parada + (aberta - parada) * k;
      if (vertical) {
        const alvoA = fora(dentroA, lerp(cy - meiaH, r.top) - folga);
        const alvoB = fora(dentroB, lerp(cy + meiaH, r.bottom) + folga);
        a.style.transform = `translateY(${alvoA - dentroA}px)`;
        b.style.transform = `translateY(${alvoB - dentroB}px)`;
      } else {
        const alvoA = fora(dentroA, lerp(cx - meiaW, r.left) - folga);
        const alvoB = fora(dentroB, lerp(cx + meiaW, r.right) + folga);
        a.style.transform = `translateX(${alvoA - dentroA}px)`;
        b.style.transform = `translateX(${alvoB - dentroB}px)`;
      }
    };
    const desliga = [abre, cresce, expande].map((v) => v.on("change", desenhar));
    const aoMudar = () => {
      m = medir();
      desenhar();
    };
    window.addEventListener("resize", aoMudar);

    // o nome fica sozinho até --abertura-nome depois de abrir a página (contado desde o início
    // da navegação: ele já está na tela desde a 1ª pintura); com o JS atrasado, abre na hora
    const espera = Math.max(0, t("--abertura-nome") - performance.now() / 1000);
    const dAbre = t("--abertura-abre");
    const dPausa = t("--abertura-pausa");
    const dExpande = t("--abertura-expande");
    let controles: AnimationPlaybackControlsWithThen[] = [
      animate(abre, 1, { duration: dAbre, delay: espera, ease: curva("--abertura-curva-abre") }),
      animate(cresce, numero("--abertura-cresce"), { duration: dPausa, delay: espera + dAbre, ease: curva("--abertura-curva-pausa") }),
      animate(expande, 1, { duration: dExpande, delay: espera + dAbre + dPausa, ease: curva("--abertura-curva-expande") }),
    ];
    let fase: "janela" | "texto" | "fim" = "janela";

    const header = () => [...document.querySelectorAll<HTMLElement>('[data-entra="header"]')];
    const blocos = () => [...document.querySelectorAll<HTMLElement>('[data-entra="bloco"]')];
    const palavras = () => [...document.querySelectorAll<HTMLElement>('[data-entra="palavra"]')];

    const fim = () => {
      if (fase === "fim") return;
      fase = "fim";
      delete root.dataset.abertura;
      limpar([midia, a, b, ...header(), ...blocos(), ...palavras()]);
      soltar();
    };

    // 5. a janela cobriu o hero: some o papel, a mídia volta ao lugar e o texto entra
    const texto = () => {
      if (fase !== "janela") return;
      fase = "texto";
      const ease = curva("--abertura-curva-texto");
      const dur = t("--abertura-hero-texto");
      const passo = t("--abertura-stagger");
      // palavras do H1 agrupadas pela linha em que caíram (o título quebra conforme a tela):
      // cada linha sobe atrás da máscara, uma depois da outra
      const linhas = new Map<number, HTMLElement[]>();
      for (const p of palavras()) {
        const y = Math.round(p.offsetTop);
        linhas.set(y, [...(linhas.get(y) ?? []), p]);
      }
      const grupos = [...linhas.entries()].sort(([y1], [y2]) => y1 - y2).map(([, ps]) => ps);
      // 1º quadro antes de o papel sair
      primeiroQuadro(header(), HEADER);
      primeiroQuadro(palavras(), LINHA);
      primeiroQuadro(blocos(), BLOCO);
      midia.style.removeProperty("clip-path");
      root.dataset.abertura = "texto";
      controles = [
        animate(header(), HEADER, { duration: dur, ease }),
        ...grupos.map((ps, i) => animate(ps, LINHA, { duration: dur, delay: passo * i, ease })),
        animate(blocos(), BLOCO, { duration: dur, delay: stagger(passo, { startDelay: passo * grupos.length }), ease }),
      ];
      Promise.all(controles).then(fim, fim);
    };
    controles[2].then(texto, () => {});

    // clique, rolagem ou tecla: direto para o final (o vídeo continua de onde está). No texto,
    // cada animação vai para o quadro final (complete, não stop: uma ainda no delay aplicaria o
    // 1º quadro depois) e o Promise.all chama o fim.
    const pular = () => {
      if (fase === "texto") controles.forEach((c) => c.complete());
      else if (fase === "janela") {
        pararTodos(controles);
        fim();
      }
    };

    const eventos = ["pointerdown", "wheel", "touchmove", "keydown"] as const;
    const soltar = () => {
      desliga.forEach((f) => f());
      window.removeEventListener("resize", aoMudar);
      eventos.forEach((ev) => window.removeEventListener(ev, pular, true));
    };
    eventos.forEach((ev) => window.addEventListener(ev, pular, { capture: true, passive: true }));

    return () => {
      pararTodos(controles);
      soltar();
    };
  }, []);

  return (
    <div ref={cortina} className={styles.cortina} aria-hidden="true">
      <p className={styles.nome}>
        <span ref={parteA} className={styles.parte}>
          {partes[0]}
        </span>
        {/* molde da janela: invisível, só dá o tamanho e a folga para o Abertura.tsx medir */}
        <span ref={janela} className={styles.janela} />
        <span ref={parteB} className={styles.parte}>
          {partes[1]}
        </span>
      </p>
    </div>
  );
}

// translação atual (px) posta pelo desenhar, para medir a posição parada
function parseX(el: HTMLElement) {
  return new DOMMatrix(getComputedStyle(el).transform).m41;
}
function parseY(el: HTMLElement) {
  return new DOMMatrix(getComputedStyle(el).transform).m42;
}
