import { useOutletContext } from "react-router-dom";
import { useSettings } from "../../app/providers/SettingsProvider.jsx";
import { useTranslation } from "../../shared/hooks/useTranslation.js";
import { SUPPORTED_LOCALES } from "../../data/locales/supported.js";
import { Check } from "lucide-react";
import styles from "./SettingsPage.module.css";

export function SettingsPage() {
  const { meta } = useOutletContext();
  const { settings, updateSetting, ACCENT_PRESETS } = useSettings();
  const { t } = useTranslation();

  const fontLabels = {
    small: t("settings.fontSize.small"),
    medium: t("settings.fontSize.medium"),
    large: t("settings.fontSize.large"),
  };

  const sourceName = t(`lang.${meta.sourceLang.code}`);
  const targetName = t(`lang.${meta.targetLang.code}`);

  const cardOrderOptions = [
    { value: "source-first", label: t("settings.cardOrder.sourceFirst", { lang: sourceName }) },
    { value: "target-first", label: t("settings.cardOrder.targetFirst", { lang: targetName }) },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("settings.title")}</h1>
      <p className={styles.subtitle}>{t("settings.subtitle")}</p>

      {/* Appearance */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>{t("settings.appearance")}</p>

        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>{t("settings.fontSize")}</span>
            <div className={styles.fontSizes}>
              {Object.entries(fontLabels).map(([key, label]) => (
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
            <span className={styles.rowLabel}>{t("settings.themeColor")}</span>
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
        <p className={styles.sectionTitle}>{t("settings.learning")}</p>

        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>{t("settings.cardOrder")}</span>
            <div className={styles.toggleGroup}>
              {cardOrderOptions.map((opt) => (
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
        <p className={styles.sectionTitle}>{t("settings.general")}</p>
        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>{t("settings.version")}</span>
            <span className={styles.rowValue}>1.0.0</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>{t("settings.uiLanguage")}</span>
            <select
              value={settings.locale}
              onChange={(e) => updateSetting("locale", e.target.value)}
              className={styles.select}
            >
              {SUPPORTED_LOCALES.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
