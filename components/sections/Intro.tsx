import { site } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { SurgeLinhas } from "@/components/ui/SurgeLinhas";
import { TextLink } from "@/components/ui/TextLink";
import { paginaLink } from "@/lib/site";
import styles from "@/styles/Intro.module.css";

// Seção 4 — Intro / Story (Manifesto do modelo): por que o lugar é diferente, em texto grande.
export function Intro() {
  const { texto } = site.secoes.historia;
  // com a página The Venue ligada, o link vai para ela ("Our Story →" do §4); senão, o CTA
  const link = paginaLink("the_venue") ?? site.secoes.historia.link;
  return (
    <section id="the-venue" className={`container ${styles.intro}`}>
      <SectionGuide id="historia" />
      <SurgeLinhas className={`t-lead ${styles.text}`}>{texto}</SurgeLinhas>
      <p className={styles.link}>
        <TextLink href={link.href}>{link.label}</TextLink>
      </p>
    </section>
  );
}
