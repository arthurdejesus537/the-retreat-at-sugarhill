import Image from "next/image";
import { QUALIDADE, sizesCobrindo } from "@/lib/imagem";
import styles from "@/styles/Media.module.css";

type Props = {
  src: string | null;
  alt?: string;
  // texto do placeholder, ex. "[FOTO — espaço, vertical, mín. 1600px]"
  label: string;
  sizes: string;
  // proporção do quadro (largura / altura) para cada entrada de `sizes`: com ela o arquivo baixado
  // cobre o recorte da foto, não só a largura (lib/imagem.ts)
  quadro?: number | number[];
  // "dark" quando há texto branco por cima (o placeholder claro não teria contraste)
  tone?: "light" | "dark";
  className?: string;
};

// Imagem que preenche o container (object-fit: cover) ou placeholder no lugar dela.
// O container define o tamanho: aspect-ratio ou altura explícita.
export function Media({ src, alt = "", label, sizes, quadro, tone = "light", className = "" }: Props) {
  return (
    <div className={`${styles.media} ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizesCobrindo(src, sizes, quadro)} quality={QUALIDADE} className={styles.image} />
      ) : (
        <div className={`${styles.placeholder} ${styles[tone]}`} aria-hidden="true">
          <span className="t-meta">{label}</span>
        </div>
      )}
    </div>
  );
}
