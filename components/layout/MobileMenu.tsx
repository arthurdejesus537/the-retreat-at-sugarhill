import Link from "next/link";
import { site, type Link as NavLink } from "@/content/site";
import { Button } from "@/components/ui/Button";
import styles from "@/styles/MobileMenu.module.css";

// Menu em tela cheia abaixo de 992px (.mobile-menu do original): seções + CTA + Text us.
export function MobileMenu({
  id,
  open,
  links,
  current,
  sms,
  onNavigate,
}: {
  id: string;
  open: boolean;
  links: NavLink[];
  // pathname da página aberta: o link dela fica marcado
  current: string;
  sms: string;
  onNavigate: () => void;
}) {
  return (
    <nav id={id} className={styles.menu} data-open={open || undefined} inert={!open} aria-label={site.secoes.header.menu}>
      <ul>
        {links.map((item) => (
          <li key={item.href} className={styles.item}>
            <Link href={item.href} className={styles.trigger} aria-current={item.href === current ? "page" : undefined} onClick={onNavigate}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <Button href={site.cta.href} theme="black" size="l" fullWidth onClick={onNavigate}>
          {site.cta.label}
        </Button>
        <a href={sms} className={`t-nav ${styles.textUs}`}>
          {site.secoes.header.text_us}
        </a>
      </div>
    </nav>
  );
}
