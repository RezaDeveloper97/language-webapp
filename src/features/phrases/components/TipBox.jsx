import styles from "./TipBox.module.css";

export function TipBox({ color, text }) {
  return (
    <div className={styles.box} style={{ "--accent": color }}>
      {text}
    </div>
  );
}
