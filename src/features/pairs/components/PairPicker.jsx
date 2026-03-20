import { ArrowRight, Check } from "lucide-react";
import { useTranslation } from "../../../shared/hooks/useTranslation.js";
import styles from "./PairPicker.module.css";

export function PairPicker({ manifest, activePairId, onSelect, onClose }) {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.sheet}>
        <div className={styles.handle} />
        <p className={styles.title}>{t("pairPicker.title")}</p>

        <div className={styles.list}>
          {manifest.map(({ meta }) => {
            const isActive = meta.id === activePairId;
            return (
              <button
                key={meta.id}
                onClick={() => onSelect(meta.id)}
                className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
              >
                <span className={styles.flag}>{meta.sourceLang.flag}</span>
                <ArrowRight size={16} color="#475569" />
                <span className={styles.flag}>{meta.targetLang.flag}</span>

                <div className={styles.textBlock}>
                  <div className={`${styles.name} ${isActive ? styles.nameActive : ""}`}>
                    {meta.name}
                  </div>
                  <div className={styles.desc}>{t("app.description")}</div>
                </div>

                {isActive && (
                  <div className={styles.checkmark}>
                    <Check size={14} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
