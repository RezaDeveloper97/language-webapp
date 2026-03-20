import { forwardRef } from "react";
import { Check, Eye } from "lucide-react";
import { useSettings } from "../../../app/providers/SettingsProvider.jsx";
import { useTranslation } from "../../../shared/hooks/useTranslation.js";
import styles from "./FlipCard.module.css";

export const FlipCard = forwardRef(function FlipCard({ p, color, isFlipped, onToggle }, ref) {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const isTargetFirst = settings.cardOrder === "target-first";
  const primary = isTargetFirst ? p.target : p.source;
  const secondary = isTargetFirst ? p.source : p.target;

  return (
    <div
      ref={ref}
      onClick={onToggle}
      className={`${styles.card} ${isFlipped ? styles.cardFlipped : ""}`}
      style={{ "--accent": color }}
    >
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <div className={styles.source}>{primary}</div>
          <div className={`${styles.target} ${isFlipped ? styles.targetVisible : ""}`}>
            {secondary}
          </div>
          {isFlipped && (
            <div className={styles.pronounceBox}>
              <span className={styles.pronounceLabel}>{t("flipCard.pronunciation")}</span>
              <span className={styles.pronounceText}>{p.pronounce}</span>
            </div>
          )}
        </div>
        <div className={`${styles.indicator} ${isFlipped ? styles.indicatorActive : ""}`}>
          {isFlipped ? <Check size={15} /> : <Eye size={15} />}
        </div>
      </div>
    </div>
  );
});
