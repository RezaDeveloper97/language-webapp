import { useTranslation } from "../hooks/useTranslation.js";
import styles from "./LoadingScreen.module.css";

export function LoadingScreen() {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.text}>{t("loading.text")}</p>
    </div>
  );
}
