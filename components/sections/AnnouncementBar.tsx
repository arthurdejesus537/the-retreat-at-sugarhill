import Link from "next/link";
import { site } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";
import { val } from "@/lib/site";
import styles from "@/styles/AnnouncementBar.module.css";

// Seção 0 — faixa fina acima do header com a oferta real do venue. Some sem oferta.
export function AnnouncementBar() {
  const { enabled, link } = site.secoes.anuncio;
  const oferta = val(site.oferta.valor);
  if (!enabled || !oferta) return null;
  const validade = val(site.oferta.validade);

  return (
    <aside id="announcement" className={styles.bar} aria-label={site.ui.anuncio} data-entra="header">
      <Placeholder className={`t-meta ${styles.text}`}>{validade ? `${oferta} · ${validade}` : oferta}</Placeholder>
      <Link href={link.href} className={`t-meta ${styles.link}`}>
        {link.label} →
      </Link>
    </aside>
  );
}
