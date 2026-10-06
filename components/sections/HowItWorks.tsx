import { site } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { Button } from "@/components/ui/Button";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { Media } from "@/components/ui/Media";
import { Placeholder } from "@/components/ui/Placeholder";
import { midiaLabel, posterLoop, val } from "@/lib/site";
import styles from "@/styles/HowItWorks.module.css";

const { eyebrow, titulo, foto, video, fallback } = site.secoes.processo;

// Seção 10 — How It Works (banner "Passes" do modelo): foto full-bleed + card com 3 passos
// numerados em mono. Sem processo do venue, o padrão Inquire → Tour → Book.
export function HowItWorks() {
  const passos = (site.processo?.map((p) => val(p)).filter((p): p is string => !!p) ?? []).slice(0, 3);
  const lista = passos.length > 0 ? passos : fallback;

  return (
    <section id="how-it-works">
      <SectionGuide id="processo" />
      <div className={styles.banner}>
        <Media src={video ? posterLoop(video.nome) : val(foto)} alt={foto.alt} label={midiaLabel(foto.placeholder)} sizes="(min-width: 992px) 100vw, 100vw" quadro={[1.6, 0.46]} tone="dark" className={styles.background} />
        {video && <LoopVideo nome={video.nome} className={styles.background} />}
        <p className={`t-meta ${styles.category}`}>{eyebrow}</p>
        <div className={styles.card}>
          <h2 className={`t-display ${styles.title}`}>{titulo}</h2>
          <ol className={styles.steps}>
            {lista.map((passo, i) => (
              <li key={`${passo}-${i}`} className={styles.step}>
                <span className={`t-meta ${styles.number}`}>{String(i + 1).padStart(2, "0")}</span>
                <Placeholder as="span" className={`t-body ${styles.text}`}>{passo}</Placeholder>
              </li>
            ))}
          </ol>
          <Button href={site.cta.href} theme="black" fullWidth>
            {site.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
