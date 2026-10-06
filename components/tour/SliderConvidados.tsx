"use client";

import styles from "@/styles/Tour.module.css";

type Opcao = { id: string; label: string };

// "How many guests?" em barra deslizante: range nativo de faixa em faixa (setas, Home, End e
// arraste de graça), trilho preenchido até o puxador, uma marca por faixa e o rótulo de cada
// faixa sempre visível embaixo (clicar no rótulo escolhe). Sem resposta ainda, o puxador fica
// apagado no início e qualquer toque ou tecla no slider já grava a faixa.
export function SliderConvidados({
  id,
  pergunta,
  sufixo,
  opcoes,
  valor,
  onEscolher,
}: {
  id: string;
  pergunta: string;
  // "guests": vai no aria-valuetext ("100–150 guests")
  sufixo: string;
  opcoes: Opcao[];
  valor: string | null;
  onEscolher: (id: string) => void;
}) {
  const n = opcoes.length;
  const indice = valor ? opcoes.findIndex((o) => o.id === valor) : -1;
  const vazio = indice < 0;
  const pos = Math.max(indice, 0);
  const escolher = (i: number) => onEscolher(opcoes[i].id);
  // posição do puxador de 0 a 1: o preenchimento e as marcas usam a mesma conta
  const p = (i: number) => (n > 1 ? i / (n - 1) : 0);

  return (
    <div className={styles.grupo} data-vazio={vazio || undefined} style={{ "--p": p(pos) } as React.CSSProperties}>
      <p id={`${id}-convidados`} className={`t-h3 ${styles.pergunta}`}>
        {pergunta}
      </p>
      <input
        type="range"
        className={styles.range}
        min={0}
        max={n - 1}
        step={1}
        value={pos}
        aria-labelledby={`${id}-convidados`}
        aria-valuetext={vazio ? undefined : `${opcoes[pos].label} ${sufixo}`}
        onChange={(e) => escolher(Number(e.target.value))}
        // clique no puxador parado na 1ª faixa (não gera change) ou tecla sem mudança de valor
        onPointerUp={(e) => vazio && escolher(Number(e.currentTarget.value))}
        onKeyUp={(e) => vazio && ["ArrowLeft", "ArrowDown", "Home", " ", "Enter"].includes(e.key) && escolher(Number(e.currentTarget.value))}
      />
      <div className={styles.marcas} aria-hidden="true">
        {opcoes.map((o, i) => (
          <span key={o.id} className={styles.marca} style={{ "--i": p(i) } as React.CSSProperties} />
        ))}
        {opcoes.map((o, i) => (
          <button
            key={o.id}
            type="button"
            tabIndex={-1}
            className={`t-button-s ${styles.rotuloFaixa}`}
            data-ativa={i === indice || undefined}
            data-ponta={i === 0 ? "inicio" : i === n - 1 ? "fim" : undefined}
            style={{ "--i": p(i) } as React.CSSProperties}
            onClick={() => escolher(i)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
