// Abertura "A Janela" (VENUE-TEMPLATE §2): na 1ª visita da sessão à home, o nome do venue em
// papel se abre ao meio e uma janela entre as palavras mostra o clipe 1 do hero já tocando; a
// janela cresce até a tela cheia e vira o próprio hero. Nas páginas internas, só a entrada do
// título. Quem decide é o script inline do <head> (app/layout.tsx), antes da 1ª pintura: ele marca
// o <html> com data-abertura="on" (home) ou data-entrada="on" (páginas internas) e o CSS já
// mostra a cortina e esconde a mídia do hero, então nada pisca. O componente Abertura (cliente)
// conduz a sequência; o HeroSequence só toca o clipe 1 o quanto antes, embaixo da cortina.

import type { AnimationPlaybackControlsWithThen } from "framer-motion";
import { TOUR_PARAM } from "@/lib/tour";

export const ABERTURA_VISTA = "abertura-vista"; // chave no sessionStorage

// sem o JS assumir até aqui (bundle que não carregou ou quebrou), o script libera a página
const RESGATE_MS = 3000;

export function scriptAbertura({ home, internas }: { home: boolean; internas: string[] }) {
  return `(function(){try{
var d=document.documentElement,p=location.pathname;
if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
if(/[?&]${TOUR_PARAM}(=|&|$)/.test(location.search))return;
if(p==="/"){if(${home}&&!sessionStorage.getItem("${ABERTURA_VISTA}")){sessionStorage.setItem("${ABERTURA_VISTA}","1");d.dataset.abertura="on"}}
else if(${JSON.stringify(internas)}.indexOf(p)>-1)d.dataset.entrada="on";
setTimeout(function(){if(!d.dataset.aberturaJs){delete d.dataset.abertura;delete d.dataset.entrada}},${RESGATE_MS})
}catch(e){}})()`;
}

// o JS assumiu: o resgate do script não mexe mais
export const assumir = () => {
  document.documentElement.dataset.aberturaJs = "";
};

// --ease do projeto (tokens.css) como curva do Framer Motion
const CURVAS: Record<string, [number, number, number, number]> = {
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  linear: [0, 0, 1, 1],
};

const token = (nome: string) => getComputedStyle(document.documentElement).getPropertyValue(nome).trim();

// curva de um token de movimento (padrão --ease)
export function curva(nome = "--ease"): [number, number, number, number] {
  const v = token(nome);
  const bezier = v.match(/cubic-bezier\(([^)]+)\)/);
  if (bezier) return bezier[1].split(",").map(Number) as [number, number, number, number];
  return CURVAS[v] ?? CURVAS.ease;
}

// duração de um token ("0.9s" ou "900ms") em segundos
export function tempo(nome: string): number {
  const v = token(nome);
  return v.endsWith("ms") ? parseFloat(v) / 1000 : parseFloat(v) || 0;
}

// número puro de um token (ex.: --abertura-ritmo: .85)
export const numero = (nome: string, padrao = 1) => parseFloat(token(nome)) || padrao;

// nome da abertura dividido em duas partes: `divisao` é o começo do nome (ex.: "Willow"
// em "Willow Creek"); sem ele (ou se não for o começo), divide na palavra do meio, e um
// nome de uma palavra só divide no meio das letras
export function dividirNome(nome: string, divisao: string | null): [string, string] {
  const n = nome.trim();
  if (divisao && n.startsWith(divisao.trim()) && n.length > divisao.trim().length) {
    const a = divisao.trim();
    return [a, n.slice(a.length).trim()];
  }
  const palavras = n.split(/\s+/);
  if (palavras.length > 1) {
    const meio = Math.ceil(palavras.length / 2);
    return [palavras.slice(0, meio).join(" "), palavras.slice(meio).join(" ")];
  }
  const meio = Math.ceil(n.length / 2);
  return [n.slice(0, meio), n.slice(meio)];
}

// linha do título subindo de baixo para cima atrás de uma máscara fixa: o recorte (clip-path)
// anda junto com o deslocamento, então só aparece o que já passou da borda de baixo da linha.
// Os -20% / -10% deixam sobrar espaço para acentos, descendentes e o itálico da serif.
export const LINHA = {
  y: ["100%", "0%"],
  clipPath: ["inset(-20% -10% 100% -10%)", "inset(-20% -10% -20% -10%)"],
};
export const BLOCO = { opacity: [0, 1], y: ["0.4em", "0em"] };
// header (e faixa de anúncio) descem do topo
export const HEADER = { opacity: [0, 1], y: ["-100%", "0%"] };

// põe o 1º quadro no style na hora (o Framer, com delay, só aplicaria quando começasse)
export function primeiroQuadro(els: Iterable<HTMLElement>, quadros: { opacity?: number[]; y?: string[]; clipPath?: string[] }) {
  for (const el of els) {
    if (quadros.opacity) el.style.opacity = String(quadros.opacity[0]);
    if (quadros.y) el.style.transform = `translateY(${quadros.y[0]})`;
    if (quadros.clipPath) el.style.clipPath = quadros.clipPath[0];
  }
}

// tira o que o Framer deixou no style: o elemento volta ao CSS do componente
export function limpar(els: Iterable<HTMLElement>) {
  for (const el of els) ["opacity", "transform", "clip-path"].forEach((p) => el.style.removeProperty(p));
}

export const pararTodos = (cs: AnimationPlaybackControlsWithThen[]) => cs.forEach((c) => c.stop());
