import { X } from "lucide-react";
import { useTranslation } from "../../../shared/hooks/useTranslation.js";
import styles from "./SearchBar.module.css";

export function SearchBar({ search, onSearchChange, searchOpen, searchInputRef, onClose, uiDir, online }) {
  const { t } = useTranslation();
  return (
    <div className={`${styles.overlay} ${searchOpen ? styles.overlayVisible : styles.overlayHidden} ${online ? styles.overlayOnline : styles.overlayOffline}`}>
      <div className={styles.container}>
        <input
          ref={searchInputRef}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onBlur={() => { setTimeout(onClose, 150); }}
          placeholder={t("search.placeholder")}
          className={`${styles.input} ${uiDir === "rtl" ? styles.inputRtl : styles.inputLtr}`}
        />
        <button
          onMouseDown={(e) => { e.preventDefault(); onClose(); }}
          className={styles.closeButton}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
