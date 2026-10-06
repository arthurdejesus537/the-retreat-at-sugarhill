"use client";

import { guide, type GuiaId } from "@/content/guide";
import { useGuideMode } from "@/components/guide/useGuideMode";
import styles from "@/styles/SectionGuide.module.css";

// Faixa fina em mono no topo da seção, só com ?guide=1. Entra no fluxo (a seção cresce só no
// modo guia, nada fica escondido). overlay: sobreposta ao topo da seção, para seções em linha
// (flex-row), onde uma faixa no fluxo viraria uma coluna; a seção precisa de position: relative.
// Aceita várias seções numa faixa só (topo da página: anúncio, header e hero).
export function SectionGuide({ id, overlay = false, className = "" }: { id: GuiaId | GuiaId[]; overlay?: boolean; className?: string }) {
  const on = useGuideMode();
  if (!on) return null;

  const ids = Array.isArray(id) ? id : [id];
  return (
    <div className={`${styles.guide} ${overlay ? styles.overlay : ""} ${className}`}>
      {ids.map((key) => {
        const g = guide[key];
        return (
          <p key={key} className={`t-meta ${styles.strip}`}>
            <span className={styles.name}>
              {g.numero} · {g.nome}
            </span>
            <span>Trabalho: {g.trabalho}</span>
            <span>Regra: {g.regra}</span>
            {g.preencher && <span className={styles.fill}>Preencher: {g.preencher}</span>}
          </p>
        );
      })}
    </div>
  );
}
