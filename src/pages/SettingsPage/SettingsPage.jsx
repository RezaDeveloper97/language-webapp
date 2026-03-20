import styles from "./SettingsPage.module.css";

export function SettingsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>تنظیمات</h1>
      <p className={styles.subtitle}>تنظیمات برنامه را از اینجا مدیریت کنید</p>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>عمومی</p>
        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>نسخه</span>
            <span className={styles.rowValue}>1.0.0</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>زبان رابط کاربری</span>
            <span className={styles.rowValue}>فارسی</span>
          </div>
        </div>
      </div>
    </div>
  );
}
