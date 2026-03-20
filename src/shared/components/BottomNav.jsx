import { Home, Compass, Search, Bookmark, User } from "lucide-react";
import { NavBtn } from "./NavBtn.jsx";
import styles from "./BottomNav.module.css";

export function BottomNav({ searchOpen, onOpenSearch }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <NavBtn icon={<Home size={20} />} active />
        <NavBtn icon={<Compass size={20} />} />
        <button
          onClick={onOpenSearch}
          className={`${styles.searchButton} ${searchOpen ? styles.searchButtonHidden : ""}`}
        >
          <Search size={22} />
        </button>
        <NavBtn icon={<Bookmark size={20} />} />
        <NavBtn icon={<User size={20} />} />
      </div>
    </div>
  );
}
