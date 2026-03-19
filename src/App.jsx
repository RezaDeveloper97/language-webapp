import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { pairManifest, defaultPairId } from "./data/index.js";
import { WifiOff, ArrowLeftRight, ChevronDown, X, Home, Compass, Search, Bookmark, User, ArrowRight, Check, Eye } from "lucide-react";

/* ── Offline hook ──────────────────────────────────────────────────────────── */
function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}

/* ── Root ──────────────────────────────────────────────────────────────────── */
export default function App() {
  const [activePairId, setActivePairId] = useState(defaultPairId);
  const [pairData, setPairData]         = useState(null);   // { meta, categories }
  const [loading, setLoading]           = useState(true);
  const [pickerOpen, setPickerOpen]     = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [flipped, setFlipped]           = useState({});
  const [search, setSearch]             = useState("");
  const [searchOpen, setSearchOpen]     = useState(false);
  const [swipeOffset, setSwipeOffset]   = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cache = useRef({});  // loaded pairs keyed by id — avoids re-downloading
  const touchRef = useRef({ startX: 0, startY: 0, locked: null });
  const tabsRef = useRef(null);
  const tabBtnRefs = useRef({});
  const phraseRefs = useRef({});
  const searchInputRef = useRef(null);
  const online = useOnline();

  /* Open search: called directly in click handler (iOS needs sync .focus()) */
  const openSearch = useCallback(() => {
    setSearchOpen(true);
    searchInputRef.current?.focus();
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearch("");
  }, []);

  /* Navigate to a phrase from search results: switch tab, close search, scroll & flip */
  const goToPhrase = useCallback((catId, phraseIndex) => {
    // Close search first
    setSearchOpen(false);
    setSearch("");
    // Switch to the category tab
    setActiveCategory(catId);
    // Flip the card open
    setFlipped((prev) => ({ ...prev, [`${catId}-${phraseIndex}`]: true }));
    // Scroll to the card after React re-renders
    setTimeout(() => {
      const el = phraseRefs.current[`${catId}-${phraseIndex}`];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  }, []);

  /* Load pair data on demand */
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

  /* ── Scroll active tab into view + scroll page to top ────────────── */
  useEffect(() => {
    const btn = tabBtnRefs.current[activeCategory];
    if (!btn) return;
    // Small delay to avoid layout thrash during swipe animation
    const t = setTimeout(() => {
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
    return () => clearTimeout(t);
  }, [activeCategory]);

  const switchPair = (id) => {
    if (id === activePairId) { setPickerOpen(false); return; }
    setActivePairId(id);
    setActiveCategory(null);
    setFlipped({});
    setSearch("");
    setPickerOpen(false);
  };

  /* ── Derived data (safe defaults when loading) ───────────────────── */
  const meta       = pairData?.meta;
  const categories = pairData?.categories ?? [];
  const uiDir      = meta?.uiDir ?? "rtl";
  const activeCatId   = activeCategory ?? categories[0]?.id;
  const current       = categories.find((c) => c.id === activeCatId) ?? null;
  const activeCatIndex = categories.findIndex((c) => c.id === activeCatId);

  // Adjacent panels for side-by-side swipe (Telegram-style)
  // "left/right" = visual position in the hidden strip, independent of RTL
  const leftCat = uiDir === "rtl"
    ? (activeCatIndex < categories.length - 1 ? categories[activeCatIndex + 1] : null)
    : (activeCatIndex > 0 ? categories[activeCatIndex - 1] : null);
  const rightCat = uiDir === "rtl"
    ? (activeCatIndex > 0 ? categories[activeCatIndex - 1] : null)
    : (activeCatIndex < categories.length - 1 ? categories[activeCatIndex + 1] : null);

  const filtered = search.trim()
    ? categories.flatMap((cat) =>
        cat.phrases
          .map((p, idx) => ({ p, idx }))
          .filter(
            ({ p }) =>
              p.source.includes(search) ||
              p.target.toLowerCase().includes(search.toLowerCase()) ||
              p.pronounce.includes(search)
          )
          .map(({ p, idx }) => ({ ...p, catId: cat.id, catTitle: cat.title, catColor: cat.color, catIcon: cat.icon, phraseIndex: idx }))
      )
    : null;

  /* ── Swipe handlers ────────────────────────────────────────────── */
  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = useCallback((e) => {
    if (isTransitioning) return;
    const t = e.touches[0];
    touchRef.current = { startX: t.clientX, startY: t.clientY, locked: null };
  }, [isTransitioning]);

  const handleTouchMove = useCallback((e) => {
    if (isTransitioning) return;
    const ref = touchRef.current;
    const t = e.touches[0];
    const deltaX = t.clientX - ref.startX;
    const deltaY = t.clientY - ref.startY;

    if (ref.locked === null) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
        ref.locked = "v";
        return;
      }
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
        ref.locked = "h";
      } else return;
    }
    if (ref.locked === "v") return;

    let offset = deltaX;
    // Rubber band when no adjacent panel
    if (deltaX > 0 && !leftCat) offset = deltaX * 0.25;
    if (deltaX < 0 && !rightCat) offset = deltaX * 0.25;
    setSwipeOffset(offset);
  }, [isTransitioning, leftCat, rightCat]);

  const handleTouchEnd = useCallback(() => {
    const ref = touchRef.current;
    if (ref.locked !== "h") { setSwipeOffset(0); return; }

    const deltaX = swipeOffset;

    if (deltaX > SWIPE_THRESHOLD && leftCat) {
      // Swiped right → reveal left panel
      setIsTransitioning(true);
      setSwipeOffset(window.innerWidth);
      setTimeout(() => {
        setActiveCategory(leftCat.id);
        setFlipped({});
        setSwipeOffset(0);
        setIsTransitioning(false);
      }, 280);
    } else if (deltaX < -SWIPE_THRESHOLD && rightCat) {
      // Swiped left → reveal right panel
      setIsTransitioning(true);
      setSwipeOffset(-window.innerWidth);
      setTimeout(() => {
        setActiveCategory(rightCat.id);
        setFlipped({});
        setSwipeOffset(0);
        setIsTransitioning(false);
      }, 280);
    } else {
      // Snap back
      setIsTransitioning(true);
      setSwipeOffset(0);
      setTimeout(() => setIsTransitioning(false), 280);
    }
  }, [swipeOffset, leftCat, rightCat, setActiveCategory, setFlipped]);

  /* ── Loading screen ───────────────────────────────────────────────── */
  if (loading || !pairData) {
    return (
      <div style={{
        minHeight: "100dvh",
        background: "#0f0f13",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        color: "#94a3b8",
        fontFamily: "'Vazirmatn', 'Segoe UI', Tahoma, sans-serif",
      }}>
        <div style={{
          width: 40, height: 40,
          border: "3px solid #ffffff15",
          borderTopColor: "#6366f1",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ margin: 0, fontSize: 14 }}>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0f0f13",
      color: "#f1f1f5",
      fontFamily: "'Vazirmatn', 'Segoe UI', Tahoma, sans-serif",
      direction: uiDir,
    }}>

      {/* ── Offline banner ────────────────────────────────────────────────── */}
      {!online && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
          background: "linear-gradient(90deg, #dc2626, #b91c1c)",
          color: "#fff", textAlign: "center", fontSize: 13, fontWeight: 600,
          padding: "8px 16px",
          paddingTop: "max(8px, calc(env(safe-area-inset-top) + 4px))",
          letterSpacing: 0.3,
          boxShadow: "0 2px 12px rgba(220,38,38,0.5)",
        }}>
          <WifiOff size={16} style={{ verticalAlign: "middle", marginLeft: 6 }} /> آفلاین هستید — اطلاعات از حافظه بارگذاری شد
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        paddingTop: online
          ? "max(10px, env(safe-area-inset-top))"
          : "max(44px, calc(env(safe-area-inset-top) + 36px))",
        paddingBottom: 10,
        paddingLeft:  "max(16px, env(safe-area-inset-left))",
        paddingRight: "max(16px, env(safe-area-inset-right))",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(24px) saturate(200%) brightness(0.9)",
        WebkitBackdropFilter: "blur(24px) saturate(200%) brightness(0.9)",
        background: "rgba(10, 12, 24, 0.72)",
        borderBottom: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.4)",
        transition: "padding-top 0.3s ease",
      }}>

        {/* Description (right side in RTL) */}
        <p style={{ margin: 0, color: "#94a3b8", fontSize: 12, fontWeight: 500 }}>
          {meta.description}
        </p>

        {/* Flags (left side in RTL) */}
        <button
          onClick={() => setPickerOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.08)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 20 }}>{meta.sourceLang.flag}</span>
          <ArrowLeftRight size={14} color="#64748b" />
          <span style={{ fontSize: 20 }}>{meta.targetLang.flag}</span>
          <ChevronDown size={12} color="#64748b" />
        </button>
      </div>

      {/* ── Language Pair Picker (bottom sheet) ───────────────────────────── */}
      {pickerOpen && (
        <PairPicker
          manifest={pairManifest}
          activePairId={activePairId}
          onSelect={switchPair}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {/* ── Search Results ────────────────────────────────────────────────── */}
      {filtered ? (
        <div style={{ padding: "16px 16px", paddingBottom: "max(100px, calc(env(safe-area-inset-bottom) + 88px))" }}>
          <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
            {filtered.length} نتیجه پیدا شد
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((p, i) => (
              <PhraseRow key={i} p={p} color={p.catColor} label={`${p.catIcon} ${p.catTitle}`}
                onNavigate={() => goToPhrase(p.catId, p.phraseIndex)} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* ── Category Tabs ──────────────────────────────────────────────── */}
          <div ref={tabsRef} style={{
            display: "flex", gap: 8, padding: "14px 14px 0",
            overflowX: "auto", scrollbarWidth: "none",
          }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                ref={(el) => { tabBtnRefs.current[cat.id] = el; }}
                onClick={() => { setActiveCategory(cat.id); setFlipped({}); }}
                style={{
                  flexShrink: 0, padding: "8px 14px", borderRadius: 20, border: "none",
                  cursor: "pointer", fontSize: 13,
                  fontWeight: activeCatId === cat.id ? 700 : 400,
                  background: activeCatId === cat.id ? cat.color : "#ffffff12",
                  color: activeCatId === cat.id ? "#fff" : "#94a3b8",
                  transition: "all 0.2s", whiteSpace: "nowrap",
                }}
              >
                {cat.icon} {cat.title}
              </button>
            ))}
          </div>

          {/* ── Swipeable Panels (side-by-side like Telegram) ──────────────── */}
          <div style={{ overflowX: "clip", touchAction: "pan-y" }}>
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                display: "flex",
                direction: "ltr",
                transform: `translateX(calc(-100vw + ${swipeOffset}px))`,
                transition: isTransitioning ? "transform 0.28s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
                willChange: swipeOffset !== 0 || isTransitioning ? "transform" : "auto",
              }}
            >
              {/* Left panel */}
              <div style={{ width: "100vw", flexShrink: 0, direction: uiDir }}>
                {leftCat && <CategoryPanel cat={leftCat} />}
              </div>

              {/* Current panel */}
              <div style={{ width: "100vw", flexShrink: 0, direction: uiDir }}>
                {current && (
                  <>
                    <div style={{ padding: "16px 14px", paddingBottom: "max(100px, calc(env(safe-area-inset-bottom) + 88px))" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {current.phrases.map((p, i) => (
                          <FlipCard
                            key={i}
                            ref={(el) => { phraseRefs.current[`${activeCatId}-${i}`] = el; }}
                            p={p}
                            color={current.color}
                            isFlipped={!!flipped[`${activeCatId}-${i}`]}
                            onToggle={() => setFlipped((prev) => ({ ...prev, [`${activeCatId}-${i}`]: !prev[`${activeCatId}-${i}`] }))}
                          />
                        ))}
                      </div>
                    </div>
                    {current.tip && <TipBox color={current.color} text={current.tip} />}
                  </>
                )}
              </div>

              {/* Right panel */}
              <div style={{ width: "100vw", flexShrink: 0, direction: uiDir }}>
                {rightCat && <CategoryPanel cat={rightCat} />}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Top Search Bar (slides down from header) ───────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 150,
        paddingTop: online
          ? "calc(max(10px, env(safe-area-inset-top)) + 10px)"
          : "calc(max(44px, calc(env(safe-area-inset-top) + 36px)) + 10px)",
        paddingLeft: "max(14px, env(safe-area-inset-left))",
        paddingRight: "max(14px, env(safe-area-inset-right))",
        paddingBottom: 12,
        transform: searchOpen ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        willChange: "transform",
        background: "linear-gradient(180deg, rgba(15,15,19,0.95) 60%, rgba(15,15,19,0.0) 100%)",
        pointerEvents: searchOpen ? "auto" : "none",
      }}>
        <div style={{
          maxWidth: 480, margin: "0 auto",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3)",
          padding: 4,
          display: "flex", alignItems: "center",
        }}>
          <input
            ref={searchInputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => { setTimeout(closeSearch, 150); }}
            placeholder="جستجو..."
            style={{
              flex: 1, padding: "12px 18px",
              borderRadius: 9999, border: "none",
              background: "transparent",
              color: "#fff", fontSize: 15, outline: "none",
              textAlign: uiDir === "rtl" ? "right" : "left",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
          <button
            onMouseDown={(e) => { e.preventDefault(); closeSearch(); }}
            style={{
              width: 36, height: 36, borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,0.1)", color: "#94a3b8",
              fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, marginLeft: 4, marginRight: 4,
            }}
          ><X size={18} /></button>
        </div>
      </div>

      {/* ── Bottom Navigation Bar (Liquid Glass) ─────────────────────── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        paddingTop: 8,
        paddingLeft: "max(14px, env(safe-area-inset-left))",
        paddingRight: "max(14px, env(safe-area-inset-right))",
        background: "linear-gradient(180deg, rgba(15,15,19,0.0) 0%, rgba(15,15,19,0.92) 35%)",
        pointerEvents: "none",
      }}>
        <div style={{
          maxWidth: 420, margin: "0 auto",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3)",
          padding: "6px 8px",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          pointerEvents: "auto",
        }}>
          {/* Home */}
          <NavBtn icon={<Home size={20} />} active />
          {/* Explore */}
          <NavBtn icon={<Compass size={20} />} />
          {/* Search — circular glass button */}
          <button
            onClick={openSearch}
            style={{
              width: 48, height: 48, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
              color: "#fff", fontSize: 20, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transform: searchOpen ? "scale(0.8)" : "scale(1)",
              opacity: searchOpen ? 0 : 1,
              transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
            }}
          ><Search size={22} /></button>
          {/* Bookmarks */}
          <NavBtn icon={<Bookmark size={20} />} />
          {/* Profile */}
          <NavBtn icon={<User size={20} />} />
        </div>
      </div>
    </div>
  );
}

/* ── Language pair picker (bottom sheet) ───────────────────────────────────── */
function PairPicker({ manifest, activePairId, onSelect, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />

      {/* Sheet */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
        background: "#1a1a2e",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "20px 20px 0 0",
        padding: "20px 20px max(20px, env(safe-area-inset-bottom))",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
      }}>
        {/* Handle */}
        <div style={{
          width: 40, height: 4, background: "rgba(255,255,255,0.2)",
          borderRadius: 2, margin: "0 auto 20px",
        }} />

        <p style={{
          margin: "0 0 16px", fontSize: 16, fontWeight: 700,
          color: "#f1f1f5", textAlign: "center",
        }}>
          انتخاب زبان
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {manifest.map(({ meta }) => {
            const isActive = meta.id === activePairId;
            return (
              <button
                key={meta.id}
                onClick={() => onSelect(meta.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: isActive
                    ? "1px solid rgba(99,102,241,0.6)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: isActive ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                  cursor: "pointer",
                  textAlign: "right",
                  direction: "rtl",
                  transition: "all 0.18s",
                }}
              >
                {/* Flags */}
                <span style={{ fontSize: 28, lineHeight: 1 }}>{meta.sourceLang.flag}</span>
                <ArrowRight size={16} color="#475569" />
                <span style={{ fontSize: 28, lineHeight: 1 }}>{meta.targetLang.flag}</span>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 600,
                    color: isActive ? "#a5b4fc" : "#e2e8f0",
                  }}>
                    {meta.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {meta.description}
                  </div>
                </div>

                {/* Active checkmark */}
                {isActive && (
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "#6366f1",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, flexShrink: 0,
                  }}>
                    <Check size={14} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ── NavBtn (bottom nav bar item) ──────────────────────────────────────────── */
function NavBtn({ icon, active }) {
  return (
    <button style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "10px 14px", border: "none", background: "transparent",
      cursor: "pointer", color: active ? "#fff" : "#64748b",
    }}>
      {icon}
    </button>
  );
}

/* ── CategoryPanel (read-only, for adjacent swipe panels) ──────────────────── */
function CategoryPanel({ cat }) {
  return (
    <>
      <div style={{ padding: "16px 14px", paddingBottom: "max(100px, calc(env(safe-area-inset-bottom) + 88px))" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cat.phrases.map((p, i) => (
            <FlipCard key={i} p={p} color={cat.color} isFlipped={false} onToggle={() => {}} />
          ))}
        </div>
      </div>
      {cat.tip && <TipBox color={cat.color} text={cat.tip} />}
    </>
  );
}

/* ── FlipCard ──────────────────────────────────────────────────────────────── */
const FlipCard = forwardRef(function FlipCard({ p, color, isFlipped, onToggle }, ref) {
  return (
    <div
      ref={ref}
      onClick={onToggle}
      style={{
        background: isFlipped
          ? `linear-gradient(135deg, ${color}22, ${color}11)`
          : "#1e1e2e",
        border: `1px solid ${isFlipped ? color + "55" : "#ffffff12"}`,
        borderRadius: 14, padding: "14px 16px",
        cursor: "pointer", transition: "all 0.25s", userSelect: "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f1f5", marginBottom: 4 }}>
            {p.source}
          </div>
          <div style={{ fontSize: 14, color: isFlipped ? "#e2e8f0" : "#64748b" }}>
            {p.target}
          </div>
          {isFlipped && (
            <div style={{
              marginTop: 10, padding: "8px 12px",
              background: `${color}22`, borderRadius: 8,
              borderRight: `3px solid ${color}`,
            }}>
              <span style={{ fontSize: 11, color, fontWeight: 600 }}>تلفظ: </span>
              <span style={{ fontSize: 14, color: "#fde68a", fontWeight: 600 }}>{p.pronounce}</span>
            </div>
          )}
        </div>
        <div style={{
          marginRight: 12, width: 28, height: 28, borderRadius: "50%",
          background: isFlipped ? color : "#ffffff15",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, flexShrink: 0,
        }}>
          {isFlipped ? <Check size={15} /> : <Eye size={15} />}
        </div>
      </div>
    </div>
  );
});

/* ── PhraseRow (search results) ────────────────────────────────────────────── */
function PhraseRow({ p, color, label, onNavigate }) {
  return (
    <div
      onClick={onNavigate}
      style={{
        background: "#1e1e2e",
        border: `1px solid #ffffff10`,
        borderRadius: 12, padding: "12px 14px", cursor: "pointer",
      }}
    >
      <div style={{ fontSize: 11, color, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{p.source}</div>
      <div style={{ fontSize: 13, color: "#94a3b8" }}>{p.target}</div>
    </div>
  );
}

/* ── TipBox ────────────────────────────────────────────────────────────────── */
function TipBox({ color, text }) {
  return (
    <div style={{
      margin: "0 14px 20px", padding: "12px 14px",
      background: `${color}15`, border: `1px solid ${color}33`,
      borderRadius: 12, fontSize: 13, color: "#cbd5e1", lineHeight: 1.7,
    }}>
      {text}
    </div>
  );
}
