import { site, type Hospedagem } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { CardDestination } from "@/components/ui/CardDestination";
import { Carousel } from "@/components/ui/Carousel";
import { Placeholder } from "@/components/ui/Placeholder";
import { TextLink } from "@/components/ui/TextLink";
import { midiaLabel, paginaLink, val } from "@/lib/site";
import styles from "@/styles/StayOnSite.module.css";

const { titulo, texto, dorme, grupos, reservar } = site.secoes.hospedagem;

function Card({ h, size, badge }: { h: Hospedagem; size?: "m" | "l"; badge?: string | null }) {
  return (
    <CardDestination
      meta={h.dorme ? `${dorme} ${h.dorme}` : ""}
      name={h.nome}
      description={h.descricao}
      image={val(h.foto)}
      imageLabel={h.foto ? midiaLabel(h.foto.placeholder) : ""}
      href={h.link_reserva}
      viewLabel={reservar}
      badge={badge}
      size={size}
    />
  );
}

// Seção 8 — Stay On Site (Alpine Destinations do modelo): 2 cards grandes + cards menores,
// separando "no local" de "próximo" quando o dado diz (no_local true / false / null).
// completo: página Stay — os cards menores em grade (todos à vista), sem carrossel.
export function StayOnSite({ completo = false }: { completo?: boolean }) {
  const noLocal = site.hospedagem.filter((h) => h.no_local === true);
  const semDado = site.hospedagem.filter((h) => h.no_local === null);
  const proximo = site.hospedagem.filter((h) => h.no_local === false);
  // grandes: as 2 primeiras no local (sem nenhuma confirmada, as 2 primeiras sem dado)
  const base = noLocal.length > 0 ? noLocal : semDado;
  const grandes = base.slice(0, 2);
  const menores = [
    { label: grupos.no_local, itens: noLocal.length > 0 ? noLocal.slice(2) : [] },
    { label: grupos.sem_dado, itens: noLocal.length > 0 ? semDado : semDado.slice(2) },
    { label: grupos.proximo, itens: proximo },
  ].filter((g) => g.itens.length > 0);
  const selo = val(site.hospedagem_selo);
  const pagina = completo ? null : paginaLink("stay");

  return (
    <section id="stay" className={styles.stay}>
      <SectionGuide id="hospedagem" />
      <header className={`container ${styles.head}`}>
        <Placeholder as="h2" className={`t-display ${styles.title}`}>{titulo}</Placeholder>
        <div className={styles.text}>
          <Placeholder className="t-body">{texto}</Placeholder>
          {pagina && <TextLink href={pagina.href}>{pagina.label}</TextLink>}
        </div>
      </header>

      {grandes.length > 0 && (
        <div className={`container ${styles.large}`}>
          {grandes.map((h, i) => (
            <Card key={`${h.nome}-${i}`} h={h} size="l" badge={i === 0 ? selo : null} />
          ))}
        </div>
      )}

      {completo &&
        menores.map((g) => (
          <div key={g.label} className={`container ${styles.group}`}>
            <h3 className={`t-meta ${styles.groupTitle}`}>{g.label}</h3>
            <div className={styles.grid}>
              {g.itens.map((h, i) => (
                <Card key={`${h.nome}-${i}`} h={h} />
              ))}
            </div>
          </div>
        ))}

      {!completo && menores.map((g) => (
        <div key={g.label} className={styles.group}>
          <Carousel
            label={g.label}
            heading={<h3 className="t-meta">{g.label}</h3>}
            perView={{ mobile: 1.2, tablet: 2.5, desktop: 4 }}
            gap="var(--col-gap)"
          >
            {g.itens.map((h, i) => (
              <Card key={`${h.nome}-${i}`} h={h} />
            ))}
          </Carousel>
        </div>
      ))}
    </section>
  );
}
