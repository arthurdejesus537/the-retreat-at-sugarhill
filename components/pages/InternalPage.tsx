import Image from "next/image";
import Link from "next/link";
import { site, type PaginaId } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { BackgroundGrid } from "@/components/layout/BackgroundGrid";
import { BreadcrumbJsonLd } from "@/components/layout/JsonLd";
import { CheckYourDate } from "@/components/sections/CheckYourDate";
import { EntradaTitulo } from "@/components/ui/EntradaTitulo";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Placeholder } from "@/components/ui/Placeholder";
import { QUALIDADE, sizesCobrindo } from "@/lib/imagem";
import { isOn, val } from "@/lib/site";
import styles from "@/styles/InternalPage.module.css";

// Página interna (The Venue, Packages, Stay) na estrutura da página About do modelo:
// hero com H1 curto (1 frase, só na sans) sobre a foto · breadcrumb · subtítulo grande · apresentação · 3 legendas em mono ·
// bloco da página (children: a seção da home + os detalhes) · prova social · Check Your Date.
export function InternalPage({ id, children }: { id: PaginaId; children: React.ReactNode }) {
  return (
    <main className="stack-sections">
      <BreadcrumbJsonLd id={id} />
      <BackgroundGrid />
      <PageHero id={id} />
      <PageStory id={id} />
      {children}
      <PageProof id={id} />
      {isOn("checar_data") && <CheckYourDate />}
    </main>
  );
}

// page-hero do modelo: foto em tela cheia com o H1 no centro; breadcrumb e subtítulo abaixo
function PageHero({ id }: { id: PaginaId }) {
  const p = site.paginas[id];
  const foto = val(p.foto);
  return (
    <div className="flush-after">
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {foto ? (
            // LCP da página
            <Image src={foto} alt={p.foto.alt} fill priority sizes={sizesCobrindo(foto, "(min-width: 992px) 100vw, 100vw", [1.6, 0.46])} quality={QUALIDADE} className={styles.heroImage} />
          ) : (
            <MediaPlaceholder spec={p.foto.placeholder} tone="dark" className={styles.heroPlaceholder} />
          )}
        </div>
        <h1 className={`t-hero ${styles.title}`}>
          {/* entra de baixo para cima a cada visita (abertura animada, sem cortina) */}
          {isOn("abertura") ? (
            <EntradaTitulo className={styles.entrada}>
              <Placeholder as="span">{p.titulo}</Placeholder>
            </EntradaTitulo>
          ) : (
            <Placeholder as="span">{p.titulo}</Placeholder>
          )}
        </h1>
      </section>
      <div className={`container ${styles.intro}`}>
        <nav aria-label={site.ui.breadcrumb} className={styles.breadcrumb}>
          <ol className="t-meta">
            <li>
              <Link href="/" className={styles.crumbLink}>
                {site.ui.breadcrumb_home}
              </Link>
            </li>
            <li aria-current="page">{p.nome}</li>
          </ol>
        </nav>
        <Placeholder className={`t-lead ${styles.subtitle}`}>{p.subtitulo}</Placeholder>
      </div>
    </div>
  );
}

// text-media-scroller do modelo: título + ~120 palavras, depois 3 legendas curtas em mono
function PageStory({ id }: { id: PaginaId }) {
  const { apresentacao, legendas } = site.paginas[id];
  return (
    <section className={`has-guide ${styles.story}`}>
      <SectionGuide id="pag_apresentacao" />
      <div className={`container ${styles.about}`}>
        <div className={styles.aboutHead}>
          <p className="t-meta">{apresentacao.eyebrow}</p>
          <Placeholder as="h2" className="t-display">{apresentacao.titulo}</Placeholder>
        </div>
        <div className={styles.aboutText}>
          {apresentacao.texto.map((paragrafo, i) => (
            <Placeholder key={i}>{paragrafo}</Placeholder>
          ))}
        </div>
      </div>

      {legendas.length > 0 && (
        <div className={`container ${styles.captions}`}>
          <SectionGuide id="pag_fotos" />
          <ol className={styles.captionList}>
            {legendas.map((legenda, i) => (
              <li key={i} className={styles.caption}>
                <span className={styles.captionNumber}>{String(i + 1).padStart(2, "0")}</span>
                <Placeholder as="span">{legenda}</Placeholder>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

// press-coverages do modelo: selos ("As featured in", só os nomes) + 1 depoimento da página
function PageProof({ id }: { id: PaginaId }) {
  const { depoimento } = site.paginas[id];
  const selos = site.secoes.footer.imprensa.enabled ? site.imprensa : [];
  const d = depoimento !== null ? site.depoimentos[depoimento] : undefined;
  if (selos.length === 0 && !d) return null;

  return (
    <section className={`container has-guide ${styles.proof}`}>
      <SectionGuide id="pag_prova" />
      {selos.length > 0 && (
        <div className={styles.press}>
          <h2 className="t-display">{site.secoes.footer.imprensa.label}</h2>
          <ul className={styles.pressList}>
            {selos.map((s, i) => (
              <li key={`${s.nome}-${i}`} className={`t-h3 ${styles.pressItem}`}>
                {s.link ? <a href={s.link}>{s.nome}</a> : <Placeholder as="span">{s.nome}</Placeholder>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {d && (
        <figure className={styles.quote}>
          <blockquote className={styles.quoteText}>
            <Placeholder as="span">{`“${d.texto}”`}</Placeholder>
          </blockquote>
          <figcaption className="t-meta">{[d.nome, d.data].filter(Boolean).join(" · ")}</figcaption>
        </figure>
      )}
    </section>
  );
}
