import { useState, useEffect, useRef, useCallback } from "react";
import { pairManifest, defaultPairId } from "../../../data/index.js";

export function usePairLoader() {
  const [activePairId, setActivePairId] = useState(defaultPairId);
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
    setActivePairId(id);
    return true;
  }, [activePairId]);

  return {
    activePairId,
    pairData,
    loading,
    switchPair,
    pairManifest,
  };
}
