import { useState, useEffect } from "react";
import { pairs, defaultPairId } from "./data/index.js";

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

export default function App() {
const [activePairId, setActivePairId] = useState(defaultPairId);
const [active, setActive]             = useState(null);
const [flipped, setFlipped]           = useState({});
const [search, setSearch]             = useState("");
const online = useOnline();

const pair       = pairs.find((p) => p.meta.id === activePairId) ?? pairs[0];
const categories = pair.categories;
const activeId   = active ?? categories[0]?.id;
const current    = categories.find((c) => c.id === activeId);
const uiDir      = pair.meta.uiDir;

const toggle = (key) => setFlipped((p) => ({ ...p, [key]: !p[key] }));

// Reset active category when pair changes
const switchPair = (id) => {
  setActivePairId(id);
  setActive(null);
  setFlipped({});
  setSearch("");
};

const filtered = search.trim()
  ? categories.flatMap((cat) =>
      cat.phrases
        .filter(
          (p) =>
            p.source.includes(search) ||
            p.target.toLowerCase().includes(search.toLowerCase()) ||
            p.pronounce.includes(search)
        )
        .map((p) => ({ ...p, catTitle: cat.title, catColor: cat.color, catIcon: cat.icon }))
    )
  : null;

return (
<div style={{
  minHeight: "100dvh",
  background: "#0f0f13",
  color: "#f1f1f5",
  fontFamily: "'Segoe UI', Tahoma, sans-serif",
  direction: uiDir,
}}>

  {/* ── Offline banner ──────────────────────────────────────────────────── */}
  {!online && (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 9999,
      background: "linear-gradient(90deg, #dc2626, #b91c1c)",
      color: "#fff",
      textAlign: "center",
      fontSize: 13,
      fontWeight: 600,
      padding: "8px 16px",
      paddingTop: "max(8px, calc(env(safe-area-inset-top) + 4px))",
      letterSpacing: 0.3,
      boxShadow: "0 2px 12px rgba(220,38,38,0.5)",
    }}>
      📵 آفلاین هستید — اطلاعات از حافظه بارگذاری شد
    </div>
  )}

  {/* ── Header — iOS Liquid Glass ────────────────────────────────────────── */}
  <div style={{
    position: "sticky",
    top: 0,
    zIndex: 100,
    paddingTop: online
      ? "max(20px, env(safe-area-inset-top))"
      : "max(44px, calc(env(safe-area-inset-top) + 36px))",
    paddingBottom: 16,
    paddingLeft:  "max(20px, env(safe-area-inset-left))",
    paddingRight: "max(20px, env(safe-area-inset-right))",
    textAlign: "center",
    backdropFilter: "blur(24px) saturate(200%) brightness(0.9)",
    WebkitBackdropFilter: "blur(24px) saturate(200%) brightness(0.9)",
    background: "rgba(10, 12, 24, 0.72)",
    borderBottom: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.4)",
    transition: "padding-top 0.3s ease",
  }}>

    {/* Language pair switcher (visible only when >1 pair registered) */}
    {pairs.length > 1 && (
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 8,
        marginBottom: 10,
        flexWrap: "wrap",
      }}>
        {pairs.map((p) => {
          const isActive = p.meta.id === activePairId;
          return (
            <button
              key={p.meta.id}
              onClick={() => switchPair(p.meta.id)}
              style={{
                padding: "5px 12px",
                borderRadius: 16,
                border: isActive ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.1)",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                color: isActive ? "#fff" : "#64748b",
                fontSize: 12,
                fontWeight: isActive ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {p.meta.sourceLang.flag} → {p.meta.targetLang.flag} {p.meta.name}
            </button>
          );
        })}
      </div>
    )}

    <div style={{ fontSize: 28, marginBottom: 4, lineHeight: 1 }}>
      {pair.meta.sourceLang.flag} → {pair.meta.targetLang.flag}
    </div>
    <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>
      {pair.meta.name}
    </h1>
    <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: 12 }}>
      {pair.meta.description}
    </p>

    {/* Search */}
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="🔍 جستجو..."
      style={{
        marginTop: 14,
        width: "100%",
        maxWidth: 400,
        padding: "10px 14px",
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "#fff",
        fontSize: 14,
        outline: "none",
        textAlign: uiDir === "rtl" ? "right" : "left",
        boxSizing: "border-box",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        transition: "border-color 0.2s",
      }}
    />
  </div>

  {/* ── Search Results ───────────────────────────────────────────────────── */}
  {filtered ? (
    <div style={{ padding: "16px 16px", paddingBottom: "max(32px, calc(env(safe-area-inset-bottom) + 20px))" }}>
      <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
        {filtered.length} نتیجه پیدا شد
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((p, i) => (
          <PhraseRow key={i} p={p} color={p.catColor} label={`${p.catIcon} ${p.catTitle}`} />
        ))}
      </div>
    </div>
  ) : (
    <>
      {/* ── Category Tabs ─────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        gap: 8,
        padding: "14px 14px 0",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActive(cat.id); setFlipped({}); }}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeId === cat.id ? 700 : 400,
              background: activeId === cat.id ? cat.color : "#ffffff12",
              color: activeId === cat.id ? "#fff" : "#94a3b8",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {cat.icon} {cat.title}
          </button>
        ))}
      </div>

      {/* ── Phrase Cards ──────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 14px", paddingBottom: "max(40px, calc(env(safe-area-inset-bottom) + 24px))" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {current.phrases.map((p, i) => (
            <FlipCard
              key={i}
              p={p}
              color={current.color}
              isFlipped={!!flipped[`${activeId}-${i}`]}
              onToggle={() => toggle(`${activeId}-${i}`)}
            />
          ))}
        </div>
      </div>

      {/* Tip box — driven by category data */}
      {current.tip && <TipBox color={current.color} text={current.tip} />}
    </>
  )}
</div>
);
}

function FlipCard({ p, color, isFlipped, onToggle }) {
return (
<div
  onClick={onToggle}
  style={{
    background: isFlipped
      ? `linear-gradient(135deg, ${color}22, ${color}11)`
      : "#1e1e2e",
    border: `1px solid ${isFlipped ? color + "55" : "#ffffff12"}`,
    borderRadius: 14,
    padding: "14px 16px",
    cursor: "pointer",
    transition: "all 0.25s",
    userSelect: "none",
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
          marginTop: 10,
          padding: "8px 12px",
          background: `${color}22`,
          borderRadius: 8,
          borderRight: `3px solid ${color}`,
        }}>
          <span style={{ fontSize: 11, color: color, fontWeight: 600 }}>تلفظ: </span>
          <span style={{ fontSize: 14, color: "#fde68a", fontWeight: 600 }}>{p.pronounce}</span>
        </div>
      )}
    </div>
    <div style={{
      marginRight: 12,
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: isFlipped ? color : "#ffffff15",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      flexShrink: 0,
    }}>
      {isFlipped ? "✓" : "👁"}
    </div>
  </div>
</div>
);
}

function PhraseRow({ p, color, label }) {
const [show, setShow] = useState(false);
return (
<div
  onClick={() => setShow(!show)}
  style={{
    background: show ? `${color}15` : "#1e1e2e",
    border: `1px solid ${show ? color + "44" : "#ffffff10"}`,
    borderRadius: 12,
    padding: "12px 14px",
    cursor: "pointer",
  }}
>
  <div style={{ fontSize: 11, color: color, marginBottom: 4 }}>{label}</div>
  <div style={{ fontSize: 15, fontWeight: 700 }}>{p.source}</div>
  <div style={{ fontSize: 13, color: "#94a3b8" }}>{p.target}</div>
  {show && (
    <div style={{ marginTop: 8, padding: "6px 10px", background: `${color}20`, borderRadius: 6, borderRight: `2px solid ${color}` }}>
      <span style={{ fontSize: 11, color: color }}>تلفظ: </span>
      <span style={{ fontSize: 13, color: "#fde68a", fontWeight: 600 }}>{p.pronounce}</span>
    </div>
  )}
</div>
);
}

function TipBox({ color, text }) {
return (
<div style={{
  margin: "0 14px 20px",
  padding: "12px 14px",
  background: `${color}15`,
  border: `1px solid ${color}33`,
  borderRadius: 12,
  fontSize: 13,
  color: "#cbd5e1",
  lineHeight: 1.7,
}}>
  {text}
</div>
);
}
