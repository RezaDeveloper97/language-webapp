import { useState, useRef, useCallback } from "react";

const SWIPE_THRESHOLD = 50;

export function useSwipe({ categories, activeCatIndex, uiDir, onChangeCategory }) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchRef = useRef({ startX: 0, startY: 0, locked: null });

  const leftCat = uiDir === "rtl"
    ? (activeCatIndex < categories.length - 1 ? categories[activeCatIndex + 1] : null)
    : (activeCatIndex > 0 ? categories[activeCatIndex - 1] : null);

  const rightCat = uiDir === "rtl"
    ? (activeCatIndex > 0 ? categories[activeCatIndex - 1] : null)
    : (activeCatIndex < categories.length - 1 ? categories[activeCatIndex + 1] : null);

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
    if (deltaX > 0 && !leftCat) offset = deltaX * 0.25;
    if (deltaX < 0 && !rightCat) offset = deltaX * 0.25;
    setSwipeOffset(offset);
  }, [isTransitioning, leftCat, rightCat]);

  const handleTouchEnd = useCallback(() => {
    const ref = touchRef.current;
    if (ref.locked !== "h") { setSwipeOffset(0); return; }

    const deltaX = swipeOffset;

    if (deltaX > SWIPE_THRESHOLD && leftCat) {
      setIsTransitioning(true);
      setSwipeOffset(window.innerWidth);
      setTimeout(() => {
        onChangeCategory(leftCat.id);
        setSwipeOffset(0);
        setIsTransitioning(false);
      }, 280);
    } else if (deltaX < -SWIPE_THRESHOLD && rightCat) {
      setIsTransitioning(true);
      setSwipeOffset(-window.innerWidth);
      setTimeout(() => {
        onChangeCategory(rightCat.id);
        setSwipeOffset(0);
        setIsTransitioning(false);
      }, 280);
    } else {
      setIsTransitioning(true);
      setSwipeOffset(0);
      setTimeout(() => setIsTransitioning(false), 280);
    }
  }, [swipeOffset, leftCat, rightCat, onChangeCategory]);

  return {
    swipeOffset,
    isTransitioning,
    leftCat,
    rightCat,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
