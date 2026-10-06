import { site, type Link as NavLink } from "@/content/site";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Placeholder } from "@/components/ui/Placeholder";
import { TextLink } from "@/components/ui/TextLink";
import { isOn, navLinks, smsHref, telHref, val } from "@/lib/site";
import styles from "@/styles/Footer.module.css";

const f = site.secoes.footer;
const { identidade } = site;

// colunas da direita: só com o que existir no venue
function columns() {
  const nome = val(identidade.nome);
  const endereco = val(identidade.endereco);
  const telefone = val(identidade.telefone);
  const email = val(identidade.email);
  const redes = [
    { label: "Instagram", href: val(identidade.instagram) },
    { label: "Facebook", href: val(identidade.facebook) },
  ].filter((r): r is NavLink => !!r.href);

  return [
    { title: f.visite, items: [nome, endereco].filter((x): x is string => !!x).map((label) => ({ label })) },
    {
      title: f.contato,
      items: [
        ...(telefone ? [{ label: telefone, href: telHref(telefone) }] : []),
        ...(telefone ? [{ label: site.secoes.header.text_us, href: smsHref(telefone) }] : []),
        ...(email ? [{ label: email, href: `mailto:${email}` }] : []),
      ],
    },
    { title: f.siga, items: redes },
  ].filter((c) => c.items.length > 0) as { title: string; items: { label: string; href?: string }[] }[];
}

// Seção 14 — Footer: nome + endereço + telefone + e-mail + redes · links das seções ·
// CTA repetido · "As featured in" (opcional) · crédito "Website by".
export function Footer() {
  const nome = val(identidade.nome) ?? "";
  const imprensa = f.imprensa.enabled ? site.imprensa : [];
  const links = [...navLinks(), ...(isOn("checar_data") ? [f.checar] : [])];

  return (
    <footer className={styles.footer}>
      <SectionGuide id="footer" />

      {/* no lugar da newsletter do modelo: o CTA repetido */}
      <div className={styles.cta}>
        <Placeholder as="p" className={`t-lead ${styles.ctaName}`}>{nome}</Placeholder>
        <Button href={site.cta.href} size="l">
          {site.cta.label}
        </Button>
      </div>

      <div className={styles.menus}>
        <nav aria-label={site.ui.nav_footer}>
          <ul className={styles.primary}>
            {links.map((l) => (
              <li key={l.href}>
                <TextLink href={l.href} variant="single" className="t-lead">
                  {l.label}
                </TextLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.columns}>
          {columns().map((col) => (
            <div key={col.title} className={styles.column}>
              <p className={`t-meta ${styles.columnTitle}`}>{col.title}</p>
              <ul>
                {col.items.map((item, i) =>
                  item.href ? (
                    <li key={`${item.label}-${i}`}>
                      <TextLink href={item.href} variant="single" className="t-footer-link">
                        {item.label}
                      </TextLink>
                    </li>
                  ) : (
                    <li key={`${item.label}-${i}`} className="t-footer-link">
                      {item.label}
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.copyright}>
          <Logo className={styles.logo} surface="dark" />
          <p className="t-meta">
            © {new Date().getFullYear()} {nome}
          </p>
        </div>
        {imprensa.length > 0 && (
          <div className={`${styles.group} ${styles.pressGroup}`}>
            <p className="t-meta">{f.imprensa.label}</p>
            <ul className={`${styles.logos} ${styles.pressLogos}`}>
              {imprensa.map((p, i) => (
                <li key={`${p.nome}-${i}`} className={`t-meta ${styles.press}`}>
                  {p.link ? <a href={p.link}>{p.nome}</a> : p.nome}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className={`t-meta ${styles.credit}`}>
          {f.credito && <a href={f.credito.href}>{f.credito.label}</a>}
          {f.creditos_ui && (
            <a href={f.creditos_ui.href} className={styles.creditoUi} target="_blank" rel="noopener">
              {f.creditos_ui.label}
            </a>
          )}
        </p>
      </div>
    </footer>
  );
}
