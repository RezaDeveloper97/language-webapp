import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, Search, Bookmark, Settings } from "lucide-react";
import { NavBtn } from "./NavBtn.jsx";
import styles from "./BottomNav.module.css";

export function BottomNav({ searchOpen, onOpenSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/" || location.pathname === "";
  const isSettings = location.pathname === "/settings";

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <NavBtn icon={<Home size={20} />} active={isHome} onClick={() => navigate("/")} />
        <NavBtn icon={<Compass size={20} />} />
        <button
          onClick={onOpenSearch}
          className={`${styles.searchButton} ${searchOpen ? styles.searchButtonHidden : ""}`}
        >
          <Search size={22} />
        </button>
        <NavBtn icon={<Bookmark size={20} />} />
        <NavBtn icon={<Settings size={20} />} active={isSettings} onClick={() => navigate("/settings")} />
      </div>
    </div>
  );
}
