import { site } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { Placeholder } from "@/components/ui/Placeholder";
import { TextLink } from "@/components/ui/TextLink";
import { isOn, val } from "@/lib/site";
import styles from "@/styles/GettingHere.module.css";

const s = site.secoes.como_chegar;

// Seção 11b — Getting Here (nova, opcional): "fica longe? onde meus convidados ficam?".
// Desktop: eyebrow, título, tempos de carro em mono e endereço à esquerda; mapa à direita.
// Embaixo, "Where guests stay". O mapa (iframe sem chave) só carrega quando a seção entra na tela.
// linkHospedagem = false na página Stay (o link levaria para a própria página)
export function GettingHere({ linkHospedagem = true }: { linkHospedagem?: boolean }) {
  const endereco = val(site.identidade.endereco) ?? "";
  const busca = encodeURIComponent([val(site.identidade.nome), endereco].filter(Boolean).join(", "));
  const { destinos, proximos } = site.como_chegar;
  const perto = proximos.map((p) => val(p)).filter((p): p is string => !!p);

  return (
    <section id="getting-here" className={`container ${styles.here}`}>
      <SectionGuide id="como_chegar" />
      <div className={styles.grid}>
        <div className={styles.info}>
          <p className={`t-meta ${styles.eyebrow}`}>{s.eyebrow}</p>
          <Placeholder as="h2" className={`t-display ${styles.title}`}>{s.titulo}</Placeholder>
          <Placeholder className={`t-body ${styles.text}`}>{s.texto}</Placeholder>

          {destinos.length > 0 && (
            <ul className={styles.times}>
              {destinos.map((d, i) => (
                <li key={`${d.destino}-${i}`} className={styles.time}>
                  <Placeholder as="span" className={styles.value}>{d.tempo}</Placeholder>
                  <span className={styles.dot} aria-hidden="true">·</span>
                  <Placeholder as="span">{d.destino}</Placeholder>
                </li>
              ))}
            </ul>
          )}

          <address className={`t-body ${styles.address}`}>
            <Placeholder as="span">{endereco}</Placeholder>
          </address>
          <TextLink href={`https://www.google.com/maps/search/?api=1&query=${busca}`}>{s.mapa_link}</TextLink>
        </div>

        <MapEmbed src={`https://maps.google.com/maps?q=${busca}&z=11&output=embed`} title={`${s.mapa_titulo} — ${endereco}`} className={styles.map} />
      </div>

      <div className={styles.stay}>
        <h3 className={`t-h3 ${styles.stayTitle}`}>{s.hospedagem.titulo}</h3>
        <div className={styles.stayBody}>
          <Placeholder className="t-body">{s.hospedagem.texto}</Placeholder>
          {perto.length > 0 && (
            <ul className={`t-meta ${styles.nearby}`}>
              {perto.map((p) => (
                <li key={p}>
                  <Placeholder as="span">{p}</Placeholder>
                </li>
              ))}
            </ul>
          )}
          {linkHospedagem && isOn("hospedagem") && <TextLink href={s.hospedagem.link.href}>{s.hospedagem.link.label}</TextLink>}
        </div>
      </div>
    </section>
  );
}
