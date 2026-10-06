import { site } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { TypeText } from "@/components/ui/TypeText";
import { isPlaceholder, val } from "@/lib/site";
import styles from "@/styles/FactsStrip.module.css";

const MAX = 5;

// nº de hospedagens: o número manual (numeros.hospedagens) vence; sem ele, conta as no local.
// No template (nomes ainda placeholder) mostra "[N]"
function hospedagens() {
  const manual = val(site.numeros.hospedagens);
  if (manual !== null) return String(manual);
  const noLocal = site.hospedagem.filter((h) => h.no_local === true);
  if (noLocal.some((h) => isPlaceholder(h.nome))) return "[N]";
  return noLocal.length > 0 ? String(noLocal.length) : null;
}

// Seção 3 — Facts strip: "cabe? é sério?" em números, sem ler. Só números com valor (e fonte).
// Os números aparecem digitados quando a faixa entra na tela (TypeText).
export function FactsStrip() {
  const { numeros } = site;
  const r = site.secoes.fatos.rotulos;
  const fatos = [
    { valor: val(numeros.capacidade_max), rotulo: r.capacidade_max },
    { valor: val(numeros.capacidade_sentados), rotulo: r.capacidade_sentados },
    { valor: val(numeros.acres), rotulo: r.acres },
    { valor: val(numeros.ano_fundacao), rotulo: r.ano_fundacao },
    { valor: hospedagens(), rotulo: r.hospedagens },
    { valor: val(numeros.distancia_cidade), rotulo: r.distancia_cidade },
  ]
    .filter((f) => f.valor !== null)
    .slice(0, MAX);

  if (fatos.length === 0) return null;

  return (
    <section className={`has-guide ${styles.facts}`} aria-label={site.ui.fatos}>
      <SectionGuide id="fatos" />
      <dl className={styles.list}>
        {fatos.map((f, i) => (
          <div key={f.rotulo} className={styles.item}>
            <dt className={`t-meta ${styles.label}`}>{f.rotulo}</dt>
            <dd className={styles.value} data-placeholder={isPlaceholder(String(f.valor)) || undefined}>
              <TypeText text={String(f.valor)} ordem={i} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
