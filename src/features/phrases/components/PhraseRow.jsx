import styles from "./PhraseRow.module.css";

export function PhraseRow({ p, color, label, onNavigate }) {
  return (
    <div onClick={onNavigate} className={styles.row} style={{ "--accent": color }}>
      <div className={styles.label}>{label}</div>
      <div className={styles.source}>{p.source}</div>
      <div className={styles.target}>{p.target}</div>
    </div>
  );
}
