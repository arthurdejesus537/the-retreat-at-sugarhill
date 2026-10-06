"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { Celebracao } from "@/components/tour/Celebracao";
import { FotosTour, fotosTour } from "@/components/tour/FotosTour";
import { SliderConvidados } from "@/components/tour/SliderConvidados";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { SmoothInput } from "@/components/ui/SmoothInput";
import { smsHref, val } from "@/lib/site";
import {
  emailValido,
  faixaDe,
  faixasConvidados,
  lerEstado,
  opcoesQuando,
  salvarEstado,
  submitTour,
  telefoneValido,
  type TourEstado,
} from "@/lib/tour";
import styles from "@/styles/Tour.module.css";

const t = site.secoes.tour;
const telefone = val(site.identidade.telefone);
const quemResponde = val(site.identidade.quem_responde);
const faixas = faixasConvidados(val(site.numeros.capacidade_max), t.abaixo);

// Movimento (VENUE-TEMPLATE §4, "Schedule a Tour"): card entra com fade + leve subida, sai mais
// rápido; páginas trocam com fade + deslocamento curto na direção do passo; a barra anda suave.
// Reduzir movimento: tudo instantâneo.
const EASE = [0.22, 1, 0.36, 1] as const;
const ENTRA = { duration: 0.32, ease: EASE };
const SAI = { duration: 0.2, ease: EASE };
const PAGINA = { duration: 0.24, ease: EASE };
const ALTURA = { duration: 0.32, ease: EASE };
const BARRA = { duration: 0.4, ease: EASE };
const SOBE = 16;
const DESLIZA = 12;
const NADA = { duration: 0 };

// item que surge na sequência (Tour.module.css, .card [data-surge]); n = posição
const surge = (n: number) => ({ "data-surge": "", style: { "--surge-i": n } as React.CSSProperties });

const FOCAVEIS = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

// ordem do Tab dentro do card: de cada grupo de rádios entra só o marcado (ou o 1º, sem marcado)
function ordemTab(raiz: HTMLElement) {
  const lista = [...raiz.querySelectorAll<HTMLElement>(FOCAVEIS)].filter((el) => el.getClientRects().length > 0);
  return lista.filter((el) => {
    if (!(el instanceof HTMLInputElement) || el.type !== "radio") return true;
    const grupo = lista.filter((o): o is HTMLInputElement => o instanceof HTMLInputElement && o.type === "radio" && o.name === el.name);
    const marcado = grupo.find((o) => o.checked);
    return marcado ? el === marcado : el === grupo[0];
  });
}

// onSaiu: depois da animação de saída, quando o site já não está inerte (o foco pode voltar)
type Props = { aberto: boolean; convidados: number | null; vez: number; onFechar: () => void; onSaiu: () => void };

export function TourCard({ aberto, convidados, vez, onFechar, onSaiu }: Props) {
  const reduzir = useReducedMotion() ?? false;
  return (
    <AnimatePresence onExitComplete={onSaiu}>
      {aberto && (
        <motion.div
          key="tour"
          className={styles.raiz}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: reduzir ? NADA : ENTRA }}
          exit={{ opacity: 0, transition: reduzir ? NADA : SAI }}
          // clique fora do card fecha
          onClick={(e) => e.target === e.currentTarget && onFechar()}
        >
          <Painel key={vez} convidados={convidados} reduzir={reduzir} onFechar={onFechar} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Painel({ convidados, reduzir, onFechar }: { convidados: number | null; reduzir: boolean; onFechar: () => void }) {
  const id = useId();
  const dialogo = useRef<HTMLDivElement>(null);
  const conteudo = useRef<HTMLDivElement>(null);
  const [altura, setAltura] = useState<number | "auto">("auto");
  // direção da troca de página: 1 = avança, -1 = volta
  const [direcao, setDirecao] = useState(1);
  // celebração ao chegar na página 3 pelo envio (conta os envios: cada um toca de novo)
  const [festa, setFesta] = useState(0);
  const quando = useMemo(() => opcoesQuando(new Date(), { estacoes: t.estacoes, flexivel: t.flexivel }), []);

  // estado da sessão; aberto por "Check This Date", a faixa do pacote vem marcada
  const [estado, setEstado] = useState<TourEstado>(() => {
    const s = lerEstado();
    // mês que já passou desde a última visita: desmarca
    if (s.quando && !quando.some((o) => o.id === s.quando)) s.quando = null;
    if (s.faixa && !faixas.some((f) => f.id === s.faixa)) s.faixa = null;
    const faixa = convidados !== null ? faixaDe(faixas, convidados) : null;
    return faixa && s.pagina !== 3 ? { ...s, faixa } : s;
  });
  const { pagina } = estado;

  useEffect(() => salvarEstado(estado), [estado]);

  const irPara = (p: TourEstado["pagina"]) => {
    setDirecao(p > pagina ? 1 : -1);
    setEstado((s) => ({ ...s, pagina: p }));
  };

  // rolagem da página travada e o resto do site inerte enquanto o card existe (layout: a limpeza
  // roda junto com a desmontagem, antes de o foco voltar ao botão de origem)
  useLayoutEffect(() => {
    const html = document.documentElement;
    const raiz = dialogo.current?.parentElement;
    // os que já estavam inertes (barra mobile escondida) ficam como estão
    const fora = ([...document.body.children] as HTMLElement[]).filter((el) => el !== raiz && !el.inert);
    // a barra de rolagem some: o body ganha a largura dela à direita e a página não pula
    // (o fundo escuro cobre essa faixa; com scrollbar-gutter ela ficaria clara)
    const barra = window.innerWidth - html.clientWidth;
    const antes = { overflow: html.style.overflow, padding: document.body.style.paddingRight };
    html.style.overflow = "hidden";
    if (barra > 0) document.body.style.paddingRight = `${barra}px`;
    fora.forEach((el) => (el.inert = true));
    return () => {
      html.style.overflow = antes.overflow;
      document.body.style.paddingRight = antes.padding;
      fora.forEach((el) => (el.inert = false));
    };
  }, []);

  // Esc fecha; Tab e Shift+Tab ficam dentro do card
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onFechar();
        return;
      }
      if (e.key !== "Tab" || !dialogo.current) return;
      const lista = ordemTab(dialogo.current);
      const primeiro = lista[0];
      const ultimo = lista[lista.length - 1];
      if (!primeiro) return;
      const ativo = document.activeElement;
      if (e.shiftKey && (ativo === primeiro || !dialogo.current.contains(ativo))) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (ativo === ultimo || !dialogo.current.contains(ativo))) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onFechar]);

  // altura do card acompanha a página (sem salto entre páginas de tamanhos diferentes)
  useLayoutEffect(() => {
    const el = conteudo.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setAltura(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const deslize = reduzir ? 0 : DESLIZA;
  const transicaoPagina = reduzir ? NADA : PAGINA;

  return (
    <>
    {/* atrás do card, acima do fundo escurecido */}
    {festa > 0 && !reduzir && <Celebracao key={festa} card={dialogo} />}
    <motion.div
      ref={dialogo}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-titulo`}
      className={styles.card}
      data-foto={fotosTour.length > 0 ? "" : undefined}
      initial={{ opacity: 0, y: reduzir ? 0 : SOBE }}
      animate={{ opacity: 1, y: 0, transition: reduzir ? NADA : ENTRA }}
      exit={{ opacity: 0, y: reduzir ? 0 : SOBE / 2, transition: reduzir ? NADA : SAI }}
    >
      <div className={styles.coluna}>
        <div className={styles.rolagem}>
          <SectionGuide id="tour" className={styles.guia} />
          <div className={styles.topo} {...surge(0)}>
            <p id={`${id}-titulo`} className={`t-meta ${styles.eyebrow}`}>
              {t.titulo}
            </p>
            <button type="button" className={styles.fechar} onClick={onFechar} aria-label={t.rotulo_fechar}>
              <Icon name="close" />
            </button>
          </div>

          <motion.div className={styles.corpo} animate={{ height: altura }} transition={reduzir ? NADA : ALTURA} initial={false}>
            <div ref={conteudo}>
              <AnimatePresence mode="wait" initial={false} custom={direcao}>
                <motion.div
                  key={pagina}
                  custom={direcao}
                  variants={{
                    entra: (d: number) => ({ opacity: 0, x: d * deslize }),
                    parado: { opacity: 1, x: 0 },
                    sai: (d: number) => ({ opacity: 0, x: -d * deslize }),
                  }}
                  initial="entra"
                  animate="parado"
                  exit="sai"
                  transition={transicaoPagina}
                >
                  <FocoInicial />
                {pagina === 1 && <PaginaQuando id={id} quando={quando} estado={estado} setEstado={setEstado} onContinuar={() => irPara(2)} />}
                  {pagina === 2 && <PaginaContato id={id} quando={quando} estado={estado} setEstado={setEstado} onVoltar={() => irPara(1)} onEnviado={() => {
                        setFesta((n) => n + 1);
                        irPara(3);
                      }} />}
                  {pagina === 3 && (
                    <PaginaObrigado
                      quando={quando}
                      estado={estado}
                      onFechar={onFechar}
                      onRecomecar={() => {
                        setDirecao(-1);
                        setEstado((s) => ({ ...s, pagina: 1, quando: null, faixa: null }));
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* barra de status: 50% na página 1, 100% depois */}
        <div
          className={styles.barra}
          role="progressbar"
          aria-label={t.progresso}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pagina === 1 ? 50 : 100}
        >
          <motion.span className={styles.barraCheia} initial={false} animate={{ scaleX: pagina === 1 ? 0.5 : 1 }} transition={reduzir ? NADA : BARRA} />
        </div>
      </div>

      {/* fotos ao lado (768px ou mais), em loop com tracinhos */}
      {fotosTour.length > 0 && <FotosTour reduzir={reduzir} />}
    </motion.div>
    </>
  );
}

// foco no 1º controle da página quando ela entra (a nova só monta depois da saída da anterior)
function FocoInicial() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    ref.current?.parentElement?.querySelector<HTMLElement>("[data-foco]")?.focus({ preventScroll: true });
  }, []);
  return <span ref={ref} hidden />;
}

type PaginaProps = {
  id: string;
  quando: ReturnType<typeof opcoesQuando>;
  estado: TourEstado;
  setEstado: React.Dispatch<React.SetStateAction<TourEstado>>;
};

// Página 1: quando em chips (rádios nativos: as setas trocam a opção) e convidados na barra deslizante
function PaginaQuando({ id, quando, estado, setEstado, onContinuar }: PaginaProps & { onContinuar: () => void }) {
  return (
    <div className={styles.pagina}>
      <fieldset className={styles.grupo}>
        <legend className={`t-h3 ${styles.pergunta}`} {...surge(1)}>
          {t.quando}
        </legend>
        <div className={styles.chips} {...surge(2)}>
          {quando.map((o, i) => {
            const marcado = estado.quando === o.id;
            // foco inicial: a opção marcada ou a 1ª
            const foco = marcado || (!estado.quando && i === 0);
            return (
              <label key={o.id} className={styles.chip}>
                <input
                  type="radio"
                  name={`${id}-quando`}
                  value={o.id}
                  checked={marcado}
                  onChange={() => setEstado((s) => ({ ...s, quando: o.id }))}
                  data-foco={foco || undefined}
                />
                <span className="t-button-s">{o.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div {...surge(3)}>
        <SliderConvidados
          id={id}
          pergunta={t.convidados}
          sufixo={t.obrigado.convidados}
          opcoes={faixas}
          valor={estado.faixa}
          onEscolher={(faixa) => setEstado((s) => ({ ...s, faixa }))}
        />
      </div>
      <div {...surge(4)}>
        <Button theme="black" size="l" fullWidth onClick={onContinuar} disabled={!estado.quando || !estado.faixa}>
          {t.continuar}
        </Button>
      </div>
    </div>
  );
}

type Erros = Partial<Record<"nome" | "email" | "telefone" | "envio", string>>;

function validar(s: TourEstado): Erros {
  const e: Erros = {};
  if (!s.nome.trim()) e.nome = t.erros.nome;
  if (!emailValido(s.email)) e.email = t.erros.email;
  if (!telefoneValido(s.telefone)) e.telefone = t.erros.telefone;
  return e;
}

// Página 2: contato
function PaginaContato({ id, quando, estado, setEstado, onVoltar, onEnviado }: PaginaProps & { onVoltar: () => void; onEnviado: () => void }) {
  const [erros, setErros] = useState<Erros>({});
  // depois da 1ª tentativa, os erros se atualizam enquanto a pessoa corrige
  const [tentou, setTentou] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const campos = [
    { nome: "nome", tipo: "text", auto: "name", modo: "text", enter: "next" },
    { nome: "email", tipo: "email", auto: "email", modo: "email", enter: "next" },
    { nome: "telefone", tipo: "tel", auto: "tel", modo: "tel", enter: "send" },
  ] as const;

  const mudar = (nome: (typeof campos)[number]["nome"], v: string) => {
    const novo = { ...estado, [nome]: v };
    setEstado(novo);
    if (tentou) setErros(validar(novo));
  };

  return (
    <form
      ref={form}
      className={styles.pagina}
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        setTentou(true);
        const achados = validar(estado);
        setErros(achados);
        const primeiro = campos.find((c) => achados[c.nome]);
        if (primeiro) {
          form.current?.querySelector<HTMLInputElement>(`[name="${primeiro.nome}"]`)?.focus();
          return;
        }
        setEnviando(true);
        const r = await submitTour({
          quando: estado.quando,
          faixa: estado.faixa,
          nome: estado.nome.trim(),
          email: estado.email.trim(),
          telefone: estado.telefone.trim(),
          quandoLabel: quando.find((o) => o.id === estado.quando)?.resumo ?? "",
          faixaLabel: faixas.find((f) => f.id === estado.faixa)?.resumo ?? "",
        }).catch(() => ({ ok: false }));
        setEnviando(false);
        if (r.ok) onEnviado();
        else setErros({ envio: t.erros.envio });
      }}
    >
      <div className={styles.cabeca} {...surge(1)}>
        <button type="button" className={`t-meta ${styles.voltar}`} onClick={onVoltar}>
          <span aria-hidden="true">←</span> {t.voltar}
        </button>
        <h2 className={`t-h3 ${styles.pergunta}`}>{t.contato}</h2>
      </div>
      <div className={styles.campos}>
        {campos.map((c, i) => {
          const erro = erros[c.nome];
          return (
            <div key={c.nome} className={styles.campo} {...surge(2 + i)}>
              <label htmlFor={`${id}-${c.nome}`} className={`t-meta ${styles.rotulo}`}>
                {t.campos[c.nome]}
              </label>
              <SmoothInput
                wrapperClassName={styles.inputRaiz}
                id={`${id}-${c.nome}`}
                name={c.nome}
                type={c.tipo}
                autoComplete={c.auto}
                inputMode={c.modo}
                enterKeyHint={c.enter}
                required
                value={estado[c.nome]}
                onChange={(e) => mudar(c.nome, e.target.value)}
                aria-invalid={erro ? true : undefined}
                aria-describedby={erro ? `${id}-${c.nome}-erro` : undefined}
                className={styles.input}
                data-foco={i === 0 || undefined}
              />
              {erro && (
                <p id={`${id}-${c.nome}-erro`} className={styles.erro}>
                  {erro}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div {...surge(5)}>
        <Button type="submit" theme="black" size="l" fullWidth disabled={enviando}>
          {enviando ? t.enviando : t.enviar}
        </Button>
        <p className={styles.erro} role="alert">
          {erros.envio ?? ""}
        </p>
      </div>
    </form>
  );
}

// Página 3: obrigado. Honesto: recebemos e vamos responder — nunca "booked".
function PaginaObrigado({ quando, estado, onFechar, onRecomecar }: { quando: ReturnType<typeof opcoesQuando>; estado: TourEstado; onFechar: () => void; onRecomecar: () => void }) {
  const primeiroNome = estado.nome.trim().split(/\s+/)[0] ?? "";
  const faixa = faixas.find((f) => f.id === estado.faixa);
  // resumo em 1 linha: "October 2026 · 100–150 guests"
  const resumo = [quando.find((o) => o.id === estado.quando)?.resumo, faixa && `${faixa.label} ${t.obrigado.convidados}`].filter(Boolean).join(" · ");
  const retorno = quemResponde ? `${quemResponde.charAt(0).toUpperCase()}${quemResponde.slice(1)} ${t.obrigado.retorno}` : t.obrigado.retorno_sem_nome;
  const sms = smsHref(telefone);
  return (
    <div className={styles.pagina}>
      <div className={styles.obrigado}>
        <h2 className={`t-display ${styles.titulo}`} tabIndex={-1} data-foco {...surge(1)}>
          {t.obrigado.titulo.replace("{nome}", primeiroNome).replace(/,\s*\./, ".")}
        </h2>
        {resumo && (
          <p className={`t-meta ${styles.resumo}`} {...surge(2)}>
            {resumo}
          </p>
        )}
        <div className={styles.obrigadoTexto} {...surge(3)}>
          <Placeholder className={`t-body ${styles.texto}`}>{t.obrigado.texto}</Placeholder>
          <p className="t-body">
            {retorno}
            {telefone && sms !== "#" && (
              <>
                {" "}
                {t.obrigado.mensagem}{" "}
                <a href={sms} className={styles.link}>
                  {telefone}
                </a>
                .
              </>
            )}
          </p>
        </div>
      </div>
      <div className={styles.acoes} {...surge(4)}>
        <Button theme="black" size="l" fullWidth onClick={onFechar}>
          {t.fechar}
        </Button>
        <button type="button" className={`t-meta ${styles.voltar}`} onClick={onRecomecar}>
          {t.recomecar}
        </button>
      </div>
    </div>
  );
}
