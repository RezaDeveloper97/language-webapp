import { WifiOff } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation.js";
import styles from "./OfflineBanner.module.css";

export function OfflineBanner() {
  const { t } = useTranslation();
  return (
    <div className={styles.banner}>
      <WifiOff size={16} className={styles.icon} />
      {" "}{t("offline.message")}
    </div>
  );
}
