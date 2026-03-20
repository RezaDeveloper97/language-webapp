import { useState, useEffect, useRef, useCallback } from "react";
import { pairManifest } from "../../../data/index.js";
import { useSettings } from "../../../app/providers/SettingsProvider.jsx";

export function usePairLoader() {
  const { settings, updateSetting } = useSettings();
  const activePairId = settings.activePairId;
  const [pairData, setPairData] = useState(null);
  const [loading, setLoading] = useState(true);
  const cache = useRef({});

  useEffect(() => {
    if (cache.current[activePairId]) {
      setPairData(cache.current[activePairId]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const entry = pairManifest.find((p) => p.meta.id === activePairId);
    entry.load().then((mod) => {
      cache.current[activePairId] = mod.default;
      setPairData(mod.default);
      setLoading(false);
    });
  }, [activePairId]);

  const switchPair = useCallback((id) => {
    if (id === activePairId) return false;
    updateSetting("activePairId", id);
    return true;
  }, [activePairId, updateSetting]);

  return {
    activePairId,
    pairData,
    loading,
    switchPair,
    pairManifest,
  };
}
