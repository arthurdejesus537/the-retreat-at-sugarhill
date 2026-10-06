import Link from "next/link";
import styles from "@/styles/Button.module.css";

type Props = {
  children: React.ReactNode;
  href?: string;
  size?: "m" | "s" | "l";
  variant?: "solid" | "outline" | "glass";
  // branco: sobre mídia · preto: sobre fundo claro (cards, formulário, menu mobile)
  theme?: "white" | "black";
  type?: "button" | "submit";
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  // atributos data-* repassados ao link/botão (ex.: data-tour-convidados do "Check This Date")
  dados?: Record<`data-${string}`, string>;
  className?: string;
};

// Botão do original (SITE-MESTRE.md §5.1). Com href vira link; com onClick ou type="submit"
// vira <button>; sem nada vira um rótulo decorativo (o "Ver" que aparece no hover dos cards).
export function Button({
  children,
  href,
  size = "m",
  variant = "solid",
  theme = "white",
  type,
  fullWidth = false,
  onClick,
  disabled,
  dados,
  className = "",
}: Props) {
  const classes = `${styles.button} ${styles[size]} ${styles[variant]} ${styles[theme]} ${fullWidth ? styles.full : ""} ${className}`;
  const label = <span className={styles.label}>{children}</span>;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} {...dados}>
        {label}
      </Link>
    );
  }

  if (onClick || type) {
    return (
      <button type={type ?? "button"} className={classes} onClick={onClick} disabled={disabled} {...dados}>
        {label}
      </button>
    );
  }

  return (
    <span className={classes} aria-hidden="true">
      {label}
    </span>
  );
}
