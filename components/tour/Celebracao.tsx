"use client";

import { useEffect, useRef } from "react";
import styles from "@/styles/Tour.module.css";

// Celebração da página 3 do card Schedule a Tour: sai de trás do card (camada entre o fundo
// escurecido e o card) — confetes delicados que escapam pelas bordas e alguns foguetes finos que
// sobem e abrem em faíscas pequenas. Canvas próprio, uma vez, ~2,5s, sem capturar cliques.
// Cores dos tokens --c-celebra-*; quem chama não monta com reduzir movimento.

const DURACAO = 2.5; // s
const CONFETES = 70;
const FOGUETES = 4;
const FAISCAS = 26;
const GRAVIDADE = 520; // px/s²

type Confete = { x: number; y: number; vx: number; vy: number; w: number; h: number; giro: number; vgiro: number; cor: string };
type Foguete = { x: number; y: number; alvo: number; vy: number; inicio: number; cor: string; estourou: boolean };
type Faisca = { x: number; y: number; vx: number; vy: number; nasce: number; vida: number; cor: string };

const entre = (a: number, b: number) => a + Math.random() * (b - a);
const sorteia = <T,>(l: T[]) => l[Math.floor(Math.random() * l.length)];

export function Celebracao({ card }: { card: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const r = card.current?.getBoundingClientRect();
    if (!canvas || !ctx || !r) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const css = getComputedStyle(document.documentElement);
    const cores = ["--c-celebra-creme", "--c-celebra-ouro", "--c-celebra-acento", "--c-celebra-quente"]
      .map((n) => css.getPropertyValue(n).trim())
      .filter(Boolean);
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    // confetes: nascem logo dentro das bordas do card e saem para fora, a partir do centro
    const confetes: Confete[] = Array.from({ length: CONFETES }, () => {
      const lado = Math.random();
      const x = lado < 0.5 ? entre(r.left, r.right) : Math.random() < 0.5 ? r.left + 8 : r.right - 8;
      const y = lado < 0.5 ? (Math.random() < 0.7 ? r.top + 8 : r.bottom - 8) : entre(r.top, r.bottom);
      const ang = Math.atan2(y - cy, x - cx) + entre(-0.35, 0.35);
      const v = entre(260, 560);
      return { x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - entre(120, 260), w: entre(3, 5), h: entre(6, 9), giro: entre(0, Math.PI * 2), vgiro: entre(-9, 9), cor: sorteia(cores) };
    });

    // foguetes: saem de trás do card, sobem acima da borda de cima e estouram
    const topo = Math.max(24, r.top);
    const foguetes: Foguete[] = Array.from({ length: FOGUETES }, (_, i) => {
      const fatia = r.width / FOGUETES;
      return {
        x: r.left + fatia * (i + 0.5) + entre(-fatia / 4, fatia / 4),
        y: r.top + r.height * 0.4,
        alvo: entre(topo * 0.25, topo * 0.8),
        vy: 0,
        inicio: 0.1 + i * 0.18 + entre(0, 0.1),
        cor: sorteia(cores),
        estourou: false,
      };
    });
    const faiscas: Faisca[] = [];

    let raf = 0;
    let antes = performance.now();
    const t0 = antes;
    const quadro = (agora: number) => {
      const dt = Math.min((agora - antes) / 1000, 1 / 30);
      antes = agora;
      const t = (agora - t0) / 1000;
      ctx.clearRect(0, 0, W, H);

      for (const c of confetes) {
        c.vx *= 0.985;
        c.vy = c.vy * 0.985 + GRAVIDADE * 0.6 * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.giro += c.vgiro * dt;
        ctx.globalAlpha = Math.max(0, Math.min(1, (DURACAO - t) / 0.8));
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.giro);
        ctx.scale(1, Math.cos(c.giro * 1.7)); // vira no ar
        ctx.fillStyle = c.cor;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }

      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      for (const f of foguetes) {
        if (t < f.inicio || f.estourou) continue;
        // sobe desacelerando até o alvo (~.6s)
        const p = Math.min(1, (t - f.inicio) / 0.6);
        const facil = 1 - (1 - p) ** 3;
        const inicioY = r.top + r.height * 0.4;
        const y = inicioY + (f.alvo - inicioY) * facil;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = f.cor;
        ctx.beginPath();
        ctx.moveTo(f.x, y + 28 * (1 - facil) + 6);
        ctx.lineTo(f.x, y);
        ctx.stroke();
        if (p >= 1) {
          f.estourou = true;
          for (let i = 0; i < FAISCAS; i++) {
            const ang = (i / FAISCAS) * Math.PI * 2 + entre(-0.1, 0.1);
            const v = entre(70, 150);
            faiscas.push({ x: f.x, y: f.alvo, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, nasce: t, vida: entre(0.7, 1.0), cor: Math.random() < 0.7 ? f.cor : sorteia(cores) });
          }
        }
      }

      for (const s of faiscas) {
        const idade = (t - s.nasce) / s.vida;
        if (idade >= 1) continue;
        s.vx *= 0.95;
        s.vy = s.vy * 0.95 + GRAVIDADE * 0.15 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        ctx.globalAlpha = 1 - idade;
        ctx.fillStyle = s.cor;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      if (t < DURACAO) raf = requestAnimationFrame(quadro);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(quadro);
    return () => cancelAnimationFrame(raf);
  }, [card]);

  return <canvas ref={ref} className={styles.celebracao} aria-hidden="true" />;
}
