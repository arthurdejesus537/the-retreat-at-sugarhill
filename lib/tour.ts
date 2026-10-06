// Card "Schedule a Tour" (components/tour/): opções das duas perguntas, estado da sessão e envio.
// VENUE-TEMPLATE.md §4, "Schedule a Tour (card)".

import { site } from "@/content/site";

// href que abre o card: todo link com ele é interceptado pelo TourProvider; sem JS (ou link direto
// compartilhado) a home abre com o card aberto
export const TOUR_HREF = "/?tour";
export const TOUR_PARAM = "tour";
// atributo do botão "Check This Date": nº de convidados do pacote, pré-seleciona a faixa
export const TOUR_CONVIDADOS = "data-tour-convidados";

export type Opcao = { id: string; label: string; resumo: string };

// ---------- "When are you thinking?": próximos meses, depois estações ----------

const MESES = 4;
const ESTACOES = 3;
// início de cada estação (hemisfério norte): mar, jun, set, dez
const INICIO_ESTACAO = [2, 5, 8, 11];

export function opcoesQuando(hoje: Date, nomes: { estacoes: [string, string, string, string]; flexivel: string }): Opcao[] {
  const mes = (d: Date, month: "short" | "long") => d.toLocaleDateString(site.idioma.lang, { month, year: "numeric" });
  const opcoes: Opcao[] = [];
  // a partir do mês seguinte
  const d = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
  for (let i = 0; i < MESES; i++) {
    opcoes.push({ id: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: mes(d, "short"), resumo: mes(d, "long") });
    d.setMonth(d.getMonth() + 1);
  }
  // estações que começam depois do último mês listado
  let ano = d.getFullYear();
  let e = INICIO_ESTACAO.findIndex((m) => m >= d.getMonth());
  if (e < 0) {
    e = 0;
    ano += 1;
  }
  for (let i = 0; i < ESTACOES; i++) {
    const label = `${nomes.estacoes[e]} ${ano}`;
    opcoes.push({ id: `${ano}-e${e}`, label, resumo: label });
    e = (e + 1) % 4;
    if (e === 0) ano += 1;
  }
  opcoes.push({ id: "flexivel", label: nomes.flexivel, resumo: nomes.flexivel });
  return opcoes;
}

// ---------- "How many guests?": faixas de 50 até a capacidade máxima ----------

const PASSO = 50;
const ULTIMO_LIMITE = 150;

// capacidade: numeros.capacidade_max (null = sem teto conhecido: a última faixa fica "150+")
export function faixasConvidados(capacidade: number | string | null, abaixo: string): (Opcao & { min: number; max: number })[] {
  const cap = typeof capacidade === "number" ? capacidade : parseInt(String(capacidade ?? ""), 10) || null;
  // min/max = limites da faixa (max exclusivo; a última vai até o infinito para caber qualquer pacote)
  const faixas = [{ id: `0-${PASSO}`, label: `${abaixo} ${PASSO}`, min: 0, max: PASSO }];
  for (let min = PASSO; min < ULTIMO_LIMITE && (!cap || min < cap); min += PASSO) {
    const max = cap ? Math.min(min + PASSO, cap) : min + PASSO;
    faixas.push({ id: `${min}-${max}`, label: `${min}–${max}`, min, max });
  }
  if (!cap || cap > ULTIMO_LIMITE) {
    const label = cap ? `${ULTIMO_LIMITE}–${cap}` : `${ULTIMO_LIMITE}+`;
    faixas.push({ id: cap ? `${ULTIMO_LIMITE}-${cap}` : `${ULTIMO_LIMITE}+`, label, min: ULTIMO_LIMITE, max: Infinity });
  }
  faixas[faixas.length - 1].max = Infinity;
  return faixas.map((f) => ({ ...f, resumo: f.label }));
}

// faixa que contém o nº de convidados do pacote ("Check This Date")
export const faixaDe = (faixas: ReturnType<typeof faixasConvidados>, n: number) =>
  faixas.find((f) => n >= f.min && n < f.max)?.id ?? null;

// ---------- estado da sessão ----------

export type TourDados = { quando: string | null; faixa: string | null; nome: string; email: string; telefone: string };
export type TourEstado = TourDados & { pagina: 1 | 2 | 3 };

export const TOUR_VAZIO: TourEstado = { pagina: 1, quando: null, faixa: null, nome: "", email: "", telefone: "" };

const CHAVE = "tour";

export function lerEstado(): TourEstado {
  try {
    const salvo = sessionStorage.getItem(CHAVE);
    return salvo ? { ...TOUR_VAZIO, ...JSON.parse(salvo) } : TOUR_VAZIO;
  } catch {
    return TOUR_VAZIO;
  }
}

export function salvarEstado(estado: TourEstado) {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    // aba anônima / armazenamento bloqueado: o card funciona sem guardar
  }
}

// ---------- validação e envio ----------

export const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const telefoneValido = (v: string) => v.replace(/\D/g, "").length >= 7;

// Único ponto de envio: plugar aqui o e-mail / CRM (fetch para uma rota, webhook…).
// Recebe as respostas já validadas, com os rótulos legíveis, e devolve ok ou erro.
export async function submitTour(dados: TourDados & { quandoLabel: string; faixaLabel: string }): Promise<{ ok: boolean }> {
  if (process.env.NODE_ENV === "development") console.info("[tour] submitTour", dados);
  return { ok: true };
}
