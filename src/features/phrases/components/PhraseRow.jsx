import { useSettings } from "../../../app/providers/SettingsProvider.jsx";
import styles from "./PhraseRow.module.css";

export function PhraseRow({ p, color, label, onNavigate }) {
  const { settings } = useSettings();
  const isTargetFirst = settings.cardOrder === "target-first";

  return (
    <div onClick={onNavigate} className={styles.row} style={{ "--accent": color }}>
      <div className={styles.label}>{label}</div>
      <div className={styles.source}>{isTargetFirst ? p.target : p.source}</div>
      <div className={styles.target}>{isTargetFirst ? p.source : p.target}</div>
    </div>
  );
}
