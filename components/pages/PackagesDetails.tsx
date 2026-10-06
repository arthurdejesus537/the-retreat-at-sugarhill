import { site, type Pergunta } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { Faq } from "@/components/sections/Faq";
import { Packages } from "@/components/sections/Packages";
import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { val } from "@/lib/site";
import styles from "@/styles/PackagesDetails.module.css";

const { adicionais: adicionaisTitulo, pagina } = site.secoes.pacotes;

// Bloco da página Packages: oferta em destaque (só se existir) · todos os pacotes com a lista completa · adicionais com preço + o que não está incluído ·
// perguntas de preço, bebida e capacidade do FAQ (pelo tema).
export function PackagesDetails() {
  const oferta = val(site.oferta.valor);
  const validade = val(site.oferta.validade);
  const naoInclusos = site.nao_inclusos.map((c) => val(c)).filter((c): c is string => !!c);
  const perguntas = pagina.faq_temas
    .map((t) => site.faq.find((q) => q.tema === t))
    .filter((q): q is Pergunta => !!q);

  return (
    <>
      {oferta && (
        <section className="container">
          <div className={styles.offer}>
            <div>
              <p className={`t-meta ${styles.offerLabel}`}>{pagina.oferta}</p>
              <Placeholder as="p" className={`t-display ${styles.offerText}`}>{oferta}</Placeholder>
              {validade && <p className={`t-meta ${styles.offerDate}`}>{validade}</p>}
            </div>
            <Button href={site.secoes.anuncio.link.href} theme="black">
              {site.secoes.anuncio.link.label}
            </Button>
          </div>
        </section>
      )}

      <Packages completo titulo={pagina.completo} id="package-details" />

      {(site.adicionais.length > 0 || naoInclusos.length > 0) && (
        <section className={`container has-guide ${styles.details}`}>
          <SectionGuide id="pacotes_detalhes" />
          {site.adicionais.length > 0 && (
            <div className={styles.addons}>
              <h2 className={`t-h3 ${styles.heading}`}>{adicionaisTitulo}</h2>
              <ul className={styles.rows}>
                {site.adicionais.map((a, i) => (
                  <li key={`${a.item}-${i}`} className={styles.row}>
                    <Placeholder as="span" className="t-body">{a.item}</Placeholder>
                    {a.preco && <Placeholder as="span" className={styles.price}>{a.preco}</Placeholder>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {naoInclusos.length > 0 && (
            <div className={styles.excluded}>
              <h2 className={`t-h3 ${styles.heading}`}>{pagina.nao_incluso}</h2>
              <ul className={styles.rows}>
                {naoInclusos.map((item) => (
                  <li key={item} className={styles.row}>
                    <Placeholder as="span" className="t-body">{item}</Placeholder>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {perguntas.length > 0 && <Faq itens={perguntas} titulo={pagina.faq_titulo} id="package-questions" />}
    </>
  );
}
