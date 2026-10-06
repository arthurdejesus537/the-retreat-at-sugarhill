import styles from "@/styles/BackgroundGrid.module.css";

// Grade decorativa fixa atrás das seções creme da home (.home-page__background-grid do original).
export function BackgroundGrid() {
  return <div className={styles.grid} aria-hidden="true" />;
}
