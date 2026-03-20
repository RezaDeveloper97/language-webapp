import { useState, useEffect, useCallback, useRef } from "react";
import { useSettings } from "./SettingsProvider.jsx";
import { I18nContext } from "../../shared/hooks/useTranslation.js";
import faMessages from "../../data/locales/fa.json";

const LOCALE_LOADERS = {
  fa: () => faMessages,
  en: () => import("../../data/locales/en.json"),
};

export function I18nProvider({ children }) {
  const { settings } = useSettings();
  const locale = settings.locale || "fa";
  const [messages, setMessages] = useState(faMessages);
  const cacheRef = useRef({ fa: faMessages });

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

  return (
    <I18nContext.Provider value={{ t, locale }}>
      {children}
    </I18nContext.Provider>
  );
}
