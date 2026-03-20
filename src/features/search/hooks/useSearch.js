import { useState, useCallback, useRef } from "react";

export function useSearch({ categories }) {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    searchInputRef.current?.focus();
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearch("");
  }, []);

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
          .map(({ p, idx }) => ({
            ...p,
            catId: cat.id,
            catTitle: cat.title,
            catColor: cat.color,
            catIcon: cat.icon,
            phraseIndex: idx,
          }))
      )
    : null;

  return {
    search,
    setSearch,
    searchOpen,
    searchInputRef,
    openSearch,
    closeSearch,
    filtered,
  };
}
