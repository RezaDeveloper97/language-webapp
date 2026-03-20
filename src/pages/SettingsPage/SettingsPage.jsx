import { useSettings } from "../../app/providers/SettingsProvider.jsx";
import { Check } from "lucide-react";
import styles from "./SettingsPage.module.css";

const FONT_LABELS = {
  small: "کوچک",
  medium: "معمولی",
  large: "بزرگ",
};

const CARD_ORDER_OPTIONS = [
  { value: "source-first", label: "فارسی اول" },
  { value: "target-first", label: "انگلیسی اول" },
];

export function SettingsPage() {
  const { settings, updateSetting, ACCENT_PRESETS } = useSettings();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>تنظیمات</h1>
      <p className={styles.subtitle}>تنظیمات برنامه را از اینجا مدیریت کنید</p>

      {/* Appearance */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>ظاهر</p>

        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>اندازه فونت</span>
            <div className={styles.fontSizes}>
              {Object.entries(FONT_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  className={`${styles.fontBtn} ${settings.fontSize === key ? styles.fontBtnActive : ""}`}
                  onClick={() => updateSetting("fontSize", key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.rowLabel}>رنگ تم</span>
            <div className={styles.colorPicker}>
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  className={styles.colorCircle}
                  style={{ "--swatch": preset.primary }}
                  onClick={() => updateSetting("accentId", preset.id)}
                  aria-label={preset.id}
                >
                  {settings.accentId === preset.id && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>یادگیری</p>

        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>ترتیب نمایش کارت</span>
            <div className={styles.toggleGroup}>
              {CARD_ORDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`${styles.toggleBtn} ${settings.cardOrder === opt.value ? styles.toggleBtnActive : ""}`}
                  onClick={() => updateSetting("cardOrder", opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* General */}
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
