import type { MidiaSpec } from "@/content/site";
import { midiaLabel } from "@/lib/site";
import styles from "@/styles/MediaPlaceholder.module.css";

// Bloco no lugar de foto/vídeo enquanto o venue não manda mídia real (VENUE-TEMPLATE §2).
// O tamanho vem de fora (ratio ou o container); o rótulo diz tipo, formato e tamanho mínimo.
// tone "dark" só onde há texto branco por cima (sem contraste no --c-line).
export function MediaPlaceholder({
  spec,
  ratio,
  tone = "light",
  className = "",
}: {
  spec: MidiaSpec;
  ratio?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={`${styles.placeholder} ${styles[tone]} ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      aria-hidden="true"
    >
      <span className={`t-meta ${styles.label}`}>{midiaLabel(spec)}</span>
    </div>
  );
}
