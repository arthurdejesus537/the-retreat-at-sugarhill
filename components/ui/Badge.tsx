import { Icon } from "@/components/ui/Icon";
import styles from "@/styles/Badge.module.css";

// Selo amarelo (SITE-MESTRE.md §5.2): o único uso de --c-signal.
export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`${styles.badge} ${className}`}>
      <span className={styles.icon}>
        <Icon name="star" />
      </span>
      <span className={`t-badge ${styles.label}`}>{children}</span>
    </span>
  );
}
