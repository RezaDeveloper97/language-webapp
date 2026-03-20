import { forwardRef } from "react";
import { Check, Eye } from "lucide-react";
import styles from "./FlipCard.module.css";

export const FlipCard = forwardRef(function FlipCard({ p, color, isFlipped, onToggle }, ref) {
  return (
    <div
      ref={ref}
      onClick={onToggle}
      className={`${styles.card} ${isFlipped ? styles.cardFlipped : ""}`}
      style={{ "--accent": color }}
    >
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <div className={styles.source}>{p.source}</div>
          <div className={`${styles.target} ${isFlipped ? styles.targetVisible : ""}`}>
            {p.target}
          </div>
          {isFlipped && (
            <div className={styles.pronounceBox}>
              <span className={styles.pronounceLabel}>تلفظ: </span>
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
