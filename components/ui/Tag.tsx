import Link from "next/link";
import styles from "@/styles/Tag.module.css";

type Theme = "light" | "dark";

// Chip (SITE-MESTRE.md §5.3). Com href é link de filtro; sem href é só rótulo (Journal).
// O tema "dark" é o do Journal (fundo preto).
export function Tag({ href, children, theme = "light" }: { href?: string; children: React.ReactNode; theme?: Theme }) {
  const className = `${styles.tag} ${styles[theme]}`;
  const label = <span className={`t-tag ${styles.label}`}>{children}</span>;
  if (!href) return <span className={className}>{label}</span>;
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

// Até 3 chips + contador "+N" que leva à página do item, como no original.
export function TagList({ tags, moreHref, theme }: { tags: { label: string; href?: string }[]; moreHref?: string; theme?: Theme }) {
  const visible = tags.slice(0, 3);
  const hidden = tags.length - visible.length;
  return (
    <ul className={styles.list}>
      {visible.map((tag) => (
        <li key={tag.label}>
          <Tag href={tag.href} theme={theme}>{tag.label}</Tag>
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <Tag href={moreHref} theme={theme}>+{hidden}</Tag>
        </li>
      )}
    </ul>
  );
}
