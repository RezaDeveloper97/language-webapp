import styles from "./NavBtn.module.css";

export function NavBtn({ icon, active, onClick }) {
  return (
    <button className={`${styles.button} ${active ? styles.active : ""}`} onClick={onClick}>
      {icon}
    </button>
  );
}
