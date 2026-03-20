import { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "app-settings";

const ACCENT_PRESETS = [
  { id: "dark", primary: "#64748b", light: "#94a3b8" },
  { id: "indigo", primary: "#6366f1", light: "#a5b4fc" },
  { id: "blue", primary: "#3b82f6", light: "#93c5fd" },
  { id: "emerald", primary: "#10b981", light: "#6ee7b7" },
  { id: "rose", primary: "#f43f5e", light: "#fda4af" },
  { id: "orange", primary: "#f97316", light: "#fdba74" },
  { id: "pink", primary: "#ec4899", light: "#f9a8d4" },
];

const FONT_SIZES = {
  small: { base: "13px", card: "14px", heading: "18px" },
  medium: { base: "15px", card: "16px", heading: "22px" },
  large: { base: "17px", card: "18px", heading: "26px" },
};

const DEFAULT_SETTINGS = {
  fontSize: "medium",
  accentId: "indigo",
  cardOrder: "source-first",
  locale: "fa",
  activePairId: "fa-en",
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const accent = ACCENT_PRESETS.find((a) => a.id === settings.accentId) ?? ACCENT_PRESETS[0];
    const fs = FONT_SIZES[settings.fontSize] ?? FONT_SIZES.medium;
    const root = document.documentElement;

    root.style.setProperty("--accent-primary", accent.primary);
    root.style.setProperty("--accent-light", accent.light);
    root.style.setProperty("--font-size-base", fs.base);
    root.style.setProperty("--font-size-card", fs.card);
    root.style.setProperty("--font-size-heading", fs.heading);
  }, [settings.accentId, settings.fontSize]);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, ACCENT_PRESETS, FONT_SIZES }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
