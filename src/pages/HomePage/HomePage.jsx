import { useRef, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { FlipCard } from "../../features/phrases/components/FlipCard.jsx";
import { CategoryPanel } from "../../features/phrases/components/CategoryPanel.jsx";
import { PhraseRow } from "../../features/phrases/components/PhraseRow.jsx";
import { TipBox } from "../../features/phrases/components/TipBox.jsx";
import { useSwipe } from "../../features/phrases/hooks/useSwipe.js";
import styles from "./HomePage.module.css";

export function HomePage() {
  const {
    categories, uiDir, filtered,
    activeCategory, setActiveCategory,
    flipped, setFlipped,
    closeSearch,
  } = useOutletContext();

  const tabBtnRefs = useRef({});
  const phraseRefs = useRef({});

  const activeCatId = activeCategory ?? categories[0]?.id;
  const current = categories.find((c) => c.id === activeCatId) ?? null;
  const activeCatIndex = categories.findIndex((c) => c.id === activeCatId);

  const handleChangeCategory = useCallback((catId) => {
    setActiveCategory(catId);
    setFlipped({});
  }, [setActiveCategory, setFlipped]);

  const {
    swipeOffset, isTransitioning, leftCat, rightCat,
    handleTouchStart, handleTouchMove, handleTouchEnd,
  } = useSwipe({
    categories,
    activeCatIndex,
    uiDir,
    onChangeCategory: handleChangeCategory,
  });

  const goToPhrase = useCallback((catId, phraseIndex) => {
    closeSearch();
    setActiveCategory(catId);
    setFlipped((prev) => ({ ...prev, [`${catId}-${phraseIndex}`]: true }));
    setTimeout(() => {
      const el = phraseRefs.current[`${catId}-${phraseIndex}`];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  }, [closeSearch, setActiveCategory, setFlipped]);

  /* Scroll active tab into view + scroll page to top */
  useEffect(() => {
    const btn = tabBtnRefs.current[activeCategory];
    if (!btn) return;
    const t = setTimeout(() => {
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
    return () => clearTimeout(t);
  }, [activeCategory]);

  /* Search results view */
  if (filtered) {
    return (
      <div className={styles.searchResults}>
        <p className={styles.searchCount}>
          {filtered.length} نتیجه پیدا شد
        </p>
        <div className={styles.resultList}>
          {filtered.map((p, i) => (
            <PhraseRow
              key={i}
              p={p}
              color={p.catColor}
              label={`${p.catIcon} ${p.catTitle}`}
              onNavigate={() => goToPhrase(p.catId, p.phraseIndex)}
            />
          ))}
        </div>
      </div>
    );
  }

  /* Main category view */
  return (
    <>
      {/* Category Tabs */}
      <div className={styles.tabs}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            ref={(el) => { tabBtnRefs.current[cat.id] = el; }}
            onClick={() => handleChangeCategory(cat.id)}
            className={`${styles.tabButton} ${activeCatId === cat.id ? styles.tabButtonActive : ""}`}
            style={activeCatId === cat.id ? { background: cat.color } : undefined}
          >
            {cat.icon} {cat.title}
          </button>
        ))}
      </div>

      {/* Swipeable Panels */}
      <div className={styles.swipeContainer}>
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={styles.swipeStrip}
          style={{
            transform: `translateX(calc(-100vw + ${swipeOffset}px))`,
            transition: isTransitioning ? "transform 0.28s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
            willChange: swipeOffset !== 0 || isTransitioning ? "transform" : "auto",
          }}
        >
          {/* Left panel */}
          <div className={styles.swipePanel} style={{ direction: uiDir }}>
            {leftCat && <CategoryPanel cat={leftCat} />}
          </div>

          {/* Current panel */}
          <div className={styles.swipePanel} style={{ direction: uiDir }}>
            {current && (
              <>
                <div className={styles.contentArea}>
                  <div className={styles.cardList}>
                    {current.phrases.map((p, i) => (
                      <FlipCard
                        key={i}
                        ref={(el) => { phraseRefs.current[`${activeCatId}-${i}`] = el; }}
                        p={p}
                        color={current.color}
                        isFlipped={!!flipped[`${activeCatId}-${i}`]}
                        onToggle={() => setFlipped((prev) => ({
                          ...prev,
                          [`${activeCatId}-${i}`]: !prev[`${activeCatId}-${i}`],
                        }))}
                      />
                    ))}
                  </div>
                </div>
                {current.tip && <TipBox color={current.color} text={current.tip} />}
              </>
            )}
          </div>

          {/* Right panel */}
          <div className={styles.swipePanel} style={{ direction: uiDir }}>
            {rightCat && <CategoryPanel cat={rightCat} />}
          </div>
        </div>
      </div>
    </>
  );
}
