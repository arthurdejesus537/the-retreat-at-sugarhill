import Image from "next/image";
import { site } from "@/content/site";
import { val } from "@/lib/site";
import styles from "@/styles/Logo.module.css";

// Logo do venue (identidade.logo). Sem arquivo, o nome em texto (identidade.nome_logo ou o nome),
// na serif ou na sans (secoes.header.fonte_nome) (VENUE-TEMPLATE §4, Header).
// O nome em texto usa currentColor; o arquivo troca pela versão clara (identidade.logo_claro)
// quando está sobre foto ou fundo escuro (surface="dark").
export function Logo({ className = "", surface = "light" }: { className?: string; surface?: "light" | "dark" }) {
  const nome = val(site.identidade.nome) ?? "";
  const texto = val(site.identidade.nome_logo) ?? nome;
  const escuro = val(site.identidade.logo);
  const src = surface === "dark" ? (val(site.identidade.logo_claro) ?? escuro) : escuro;
  return (
    <span className={`${styles.logo} ${className}`}>
      {src ? (
        <Image src={src} alt="" width={240} height={48} className={styles.image} priority />
      ) : (
        <span className={styles.name} data-fonte={site.secoes.header.fonte_nome} aria-hidden="true">
          {texto}
        </span>
      )}
      <span className="sr-only">{nome} — {site.ui.home}</span>
    </span>
  );
}
