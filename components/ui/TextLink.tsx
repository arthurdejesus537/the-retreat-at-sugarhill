import Link from "next/link";
import styles from "@/styles/TextLink.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  // "swap": traço sai pela direita e outro entra pela esquerda (Discover more)
  // "single": sem traço em repouso; cresce da esquerda no hover e recolhe para a direita (footer)
  variant?: "swap" | "single";
  className?: string;
};

// Links de texto com sublinhado animado — multianimline do original (SITE-MESTRE.md §8).
export function TextLink({ href, children, variant = "swap", className = "t-link" }: Props) {
  return (
    <Link href={href} className={`${className} ${styles.link} ${styles[variant]}`}>
      {children}
    </Link>
  );
}
