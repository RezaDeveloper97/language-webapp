import { useTranslation } from "../../../shared/hooks/useTranslation.js";
import { FlipCard } from "./FlipCard.jsx";
import { TipBox } from "./TipBox.jsx";
import styles from "./CategoryPanel.module.css";

export function CategoryPanel({ cat }) {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.panel}>
        <div className={styles.list}>
          {cat.phrases.map((p, i) => (
            <FlipCard key={i} p={p} color={cat.color} isFlipped={false} onToggle={() => {}} />
          ))}
        </div>
      </div>
      {cat.tip && <TipBox color={cat.color} text={t(`category.${cat.id}.tip`)} />}
    </>
  );
}
