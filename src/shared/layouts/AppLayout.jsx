import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useOnline } from "../hooks/useOnline.js";
import { useTranslation } from "../hooks/useTranslation.js";
import { OfflineBanner } from "../components/OfflineBanner.jsx";
import { BottomNav } from "../components/BottomNav.jsx";
import { Header } from "../components/Header.jsx";
import { SearchBar } from "../../features/search/components/SearchBar.jsx";
import { PairPicker } from "../../features/pairs/components/PairPicker.jsx";
import { LoadingScreen } from "../components/LoadingScreen.jsx";
import { usePairLoader } from "../../features/pairs/hooks/usePairLoader.js";
import { useSearch } from "../../features/search/hooks/useSearch.js";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  const online = useOnline();
  const { dir } = useTranslation();
  const { activePairId, pairData, loading, switchPair, pairManifest } = usePairLoader();
  const meta = pairData?.meta;
  const categories = pairData?.categories ?? [];

  const {
    search, setSearch, searchOpen, searchInputRef,
    openSearch, closeSearch, filtered,
  } = useSearch({ categories });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [flipped, setFlipped] = useState({});

  const handleSwitchPair = (id) => {
    const switched = switchPair(id);
    if (switched) {
      setActiveCategory(null);
      setFlipped({});
      setSearch("");
    }
    setPickerOpen(false);
  };

  if (loading || !pairData) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.layout}>
      {!online && <OfflineBanner />}

      <Header meta={meta} online={online} onOpenPicker={() => setPickerOpen(true)} />

      {pickerOpen && (
        <PairPicker
          manifest={pairManifest}
          activePairId={activePairId}
          onSelect={handleSwitchPair}
          onClose={() => setPickerOpen(false)}
        />
      )}

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        searchOpen={searchOpen}
        searchInputRef={searchInputRef}
        onClose={closeSearch}
        online={online}
      />

      <Outlet context={{
        categories,
        dir,
        meta,
        filtered,
        activeCategory,
        setActiveCategory,
        flipped,
        setFlipped,
        search,
        closeSearch,
      }} />

      <BottomNav searchOpen={searchOpen} onOpenSearch={openSearch} />
    </div>
  );
}
