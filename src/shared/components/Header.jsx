import { ArrowLeftRight, ChevronDown } from "lucide-react";
import styles from "./Header.module.css";

export function Header({ meta, online, onOpenPicker }) {
  return (
    <div className={`${styles.header} ${online ? styles.headerOnline : styles.headerOffline}`}>
      <p className={styles.description}>{meta.description}</p>

      <button className={styles.pairButton} onClick={onOpenPicker}>
        <span className={styles.flag}>{meta.sourceLang.flag}</span>
        <ArrowLeftRight size={14} color="#64748b" />
        <span className={styles.flag}>{meta.targetLang.flag}</span>
        <ChevronDown size={12} color="#64748b" />
      </button>
    </div>
  );
}
