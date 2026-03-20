import styles from "./NavBtn.module.css";

export function NavBtn({ icon, active }) {
  return (
    <button className={`${styles.button} ${active ? styles.active : ""}`}>
      {icon}
    </button>
  );
}
