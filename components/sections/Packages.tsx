import { site } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { CardPackage } from "@/components/ui/CardPackage";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { TextLink } from "@/components/ui/TextLink";
import { paginaLink } from "@/lib/site";
import styles from "@/styles/Packages.module.css";

const { adicionais, adicionais_abrir } = site.secoes.pacotes;
// na linha de resumo, os 3 primeiros adicionais; a lista inteira fica no acordeão
const RESUMO = 3;

// Seção 7 — Packages (Shop grid do modelo): ancorar preço e mostrar que é simples escolher.
// completo: página Packages — cards com a lista inteira, outro título e id; os adicionais
// ficam no bloco da página.
export function Packages({
  completo = false,
  titulo = site.secoes.pacotes.titulo,
  id = "packages",
}: {
  completo?: boolean;
  titulo?: string;
  id?: string;
}) {
  const lista = completo ? [] : site.adicionais;
  const pagina = completo ? null : paginaLink("packages");
  const resumo = lista.slice(0, RESUMO).map((a) => a.item).join(", ") + (lista.length > RESUMO ? "…" : "");
  return (
    <section id={id} className="section--paper">
      <SectionGuide id="pacotes" />
      <div className="container">
        <header className={styles.head}>
          <Placeholder as="h2" className={`t-display ${styles.title}`}>{titulo}</Placeholder>
        </header>
        <div className={styles.grid} style={{ "--cols": Math.min(site.pacotes.length, 4) } as React.CSSProperties}>
          {site.pacotes.map((p, i) => (
            <CardPackage key={`${p.nome}-${i}`} pacote={p} completo={completo} />
          ))}
        </div>
        {lista.length > 0 && (
          <div className={styles.addons}>
            <p className="t-body">
              <span className={styles.addonsLabel}>{adicionais}: </span>
              <Placeholder as="span">{resumo}</Placeholder>
            </p>
            {/* <details> nativo: abre sem JS, com a mesma animação do FAQ */}
            <details className={styles.addonsDetails}>
              <summary className={`t-link ${styles.addonsSummary}`}>
                {adicionais_abrir}
                <span className={styles.addonsIcon} aria-hidden="true">
                  <Icon name="chevron-down" />
                </span>
              </summary>
              <ul className={styles.addonsList}>
                {lista.map((a, i) => (
                  <li key={`${a.item}-${i}`} className={styles.addonsItem}>
                    <Placeholder as="span" className="t-body">{a.item}</Placeholder>
                    {a.preco && <Placeholder as="span" className={styles.addonsPrice}>{a.preco}</Placeholder>}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}
        {pagina && (
          <p className={styles.more}>
            <TextLink href={pagina.href}>{pagina.label}</TextLink>
          </p>
        )}
      </div>
    </section>
  );
}
