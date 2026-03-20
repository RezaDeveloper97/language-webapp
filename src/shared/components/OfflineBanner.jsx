import { WifiOff } from "lucide-react";
import styles from "./OfflineBanner.module.css";

export function OfflineBanner() {
  return (
    <div className={styles.banner}>
      <WifiOff size={16} className={styles.icon} />
      {" آفلاین هستید — اطلاعات از حافظه بارگذاری شد"}
    </div>
  );
}
