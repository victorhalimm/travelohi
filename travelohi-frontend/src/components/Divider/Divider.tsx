import styles from "./components.module.scss"

interface IDivider {
  text?: string;
}

export default function Divider({ text }: IDivider) {
  // Conditionally apply a class based on the presence of text
  const dividerClass = text ? `${styles.divider} ${styles.withText}` : styles.divider;

  return (
    <div className={dividerClass}>
      {text && <span className={styles.dividerText}>{text}</span>}
    </div>
  )
}