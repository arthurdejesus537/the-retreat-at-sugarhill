import Image, { getImageProps } from "next/image";
import { site } from "@/content/site";
import { Abertura } from "@/components/ui/Abertura";
import { Button } from "@/components/ui/Button";
import { HeroLegenda } from "@/components/ui/HeroLegenda";
import { HeroSequence } from "@/components/ui/HeroSequence";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Placeholder } from "@/components/ui/Placeholder";
import { dividirNome } from "@/lib/abertura";
import { HERO_MOBILE_QUERY } from "@/lib/hero";
import { QUALIDADE, sizesCobrindo } from "@/lib/imagem";
import { isOn, isPlaceholder, val } from "@/lib/site";
import styles from "@/styles/Hero.module.css";

const { hero, identidade, numeros } = site;

// Seção 2 — Hero: o quê + onde + por que este, em 3 segundos.
// Foto (ou sequência de vídeos) em tela cheia e pura (sem scrim), H1 de 1 frase na serif, elegante e com a
// busca do casal (casamento + tipo de lugar + cidade + estado), subtítulo opcional, 2 botões e legenda do local.
// Na 1ª visita da sessão entra pela abertura "A Janela" (Abertura); data-entra marca o que entra
// depois dela, mas todo o texto já está no HTML. Com vídeo, a legenda do canto troca a cada clipe.
export function Hero() {
  const titulo = val(hero.titulo) ?? "";
  const subtitulo = val(hero.subtitulo);
  const foto = val(hero.foto);
  const clipes = hero.videos;
  const local = [val(identidade.cidade), val(identidade.estado)].filter(Boolean).join(" — ");
  const legenda = [local, val(hero.regiao), val(numeros.distancia_cidade)].filter(Boolean).map(String);
  const legendasClipes = clipes.map((c) => c.legenda ?? null);
  const { abertura } = site.secoes;
  const nomeAbertura = abertura.nome ?? val(identidade.nome_logo) ?? val(identidade.nome) ?? "";

  return (
    <section className={styles.hero}>
      <div className={styles.media} data-hero-midia>
        {clipes.length > 0 ? (
          <>
            <Poster clipe={clipes[0].nome} alt={clipes[0].alt} />
            <HeroSequence clipes={clipes.map((c) => c.nome)} className={styles.sequence} />
          </>
        ) : foto ? (
          // LCP da página: carrega com prioridade (VENUE-TEMPLATE §1, item 7)
          <Image src={foto} alt={hero.foto.alt} fill priority sizes={sizesCobrindo(foto, "(min-width: 992px) 100vw, 100vw", [1.6, 0.46])} quality={QUALIDADE} className={styles.image} />
        ) : (
          // escuro: o título e os botões são brancos por cima
          <MediaPlaceholder spec={hero.foto.placeholder} tone="dark" className={styles.placeholder} />
        )}
      </div>

      <div className={styles.headline}>
        <h1 className={`t-hero ${styles.title}`}>
          <Linha className={styles.line1} texto={titulo} />
        </h1>
        {subtitulo && (
          <Placeholder className={styles.subtitle} entra="bloco">
            {subtitulo}
          </Placeholder>
        )}
      </div>

      <div className={styles.bottom}>
        <div className={styles.links} data-entra="bloco">
          <Button href={site.cta.href} variant="solid">
            {site.cta.label}
          </Button>
          <Button href={site.secoes.hero.secundario.href} variant="glass">
            {site.secoes.hero.secundario.label}
          </Button>
        </div>
        {(legenda.length > 0 || legendasClipes.some(Boolean)) && (
          <div className={`t-meta-hero ${styles.annotation}`} data-entra="bloco">
            {legendasClipes.some(Boolean) && <HeroLegenda legendas={legendasClipes} className={styles.clipe} />}
            {legenda.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        )}
      </div>

      {isOn("abertura") && nomeAbertura && <Abertura partes={dividirNome(nomeAbertura, abertura.divisao)} />}
    </section>
  );
}

// Linha do H1: cada palavra num <span> (data-entra="palavra"), para a abertura agrupar as
// palavras pela linha em que caíram na tela e fazer cada linha real subir atrás da máscara
function Linha({ className, texto }: { className: string; texto: string }) {
  const palavras = texto.split(/\s+/).filter(Boolean);
  return (
    <span className={className} data-placeholder={isPlaceholder(texto) || undefined}>
      {palavras.map((p, i) => (
        <span key={i}>
          <span className={styles.palavra} data-entra="palavra">
            {p}
          </span>
          {i < palavras.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

// Poster do clipe 1: a imagem principal da página (LCP). O <picture> escolhe desktop 16:9 ou
// mobile 9:16 pela mesma media query do HeroSequence, então só um dos dois é baixado.
function Poster({ clipe, alt }: { clipe: string; alt: string }) {
  const common = { alt, sizes: "100vw", quality: QUALIDADE, fetchPriority: "high" as const, loading: "eager" as const };
  const {
    props: { srcSet: mobile },
  } = getImageProps({ ...common, src: `/video/hero/mobile/${clipe}-poster.jpg`, width: 720, height: 1280 });
  const { props: desktop } = getImageProps({ ...common, src: `/video/hero/desktop/${clipe}-poster.jpg`, width: 1280, height: 720 });
  return (
    <picture className={styles.poster}>
      <source media={HERO_MOBILE_QUERY} srcSet={mobile} />
      <img {...desktop} alt={alt} />
    </picture>
  );
}
