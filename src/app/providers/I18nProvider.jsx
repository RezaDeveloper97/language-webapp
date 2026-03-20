import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSettings } from "./SettingsProvider.jsx";
import { I18nContext } from "../../shared/hooks/useTranslation.js";
import { SUPPORTED_LOCALES } from "../../data/locales/supported.js";
import faMessages from "../../data/locales/fa.json";

const LOCALE_LOADERS = {
  fa: () => faMessages,
  en: () => import("../../data/locales/en.json"),
};

const dirMap = Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l.id, l.dir]));

export function I18nProvider({ children }) {
  const { settings } = useSettings();
  const locale = settings.locale || "fa";
  const dir = dirMap[locale] ?? "rtl";
  const [messages, setMessages] = useState(faMessages);
  const cacheRef = useRef({ fa: faMessages });

  /* Sync <html lang="..." dir="..."> with selected locale */
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  useEffect(() => {
    if (cacheRef.current[locale]) {
      setMessages(cacheRef.current[locale]);
      return;
    }

    const loader = LOCALE_LOADERS[locale];
    if (!loader) return;

    const result = loader();
    if (result instanceof Promise) {
      result.then((mod) => {
        const data = mod.default || mod;
        cacheRef.current[locale] = data;
        setMessages(data);
      });
    } else {
      cacheRef.current[locale] = result;
      setMessages(result);
    }
  }, [locale]);

  const t = useCallback(
    (key, params) => {
      let str = messages[key] ?? key;
      if (params) {
        str = str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? "");
      }
      return str;
    },
    [messages],
  );

  const value = useMemo(() => ({ t, locale, dir }), [t, locale, dir]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}
