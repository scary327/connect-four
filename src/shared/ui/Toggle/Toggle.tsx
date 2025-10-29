import React, { memo } from "react";
import styles from "./Toggle.module.css";

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
}

const Toggle: React.FC<ToggleProps> = memo(
  ({ isOn, onToggle, label, leftLabel, rightLabel }) => {
    return (
      <div className={styles.toggleWrapper}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.toggleContainer}>
          {leftLabel && (
            <span
              className={`${styles.sideLabel} ${!isOn ? styles.active : ""} ${
                styles.leftLabel
              }`}
            >
              {leftLabel}
            </span>
          )}
          <button
            className={`${styles.toggle} ${isOn ? styles.on : styles.off}`}
            onClick={onToggle}
            role="switch"
            aria-checked={isOn}
            type="button"
          >
            <span className={styles.toggleThumb} />
            <span className={styles.toggleTrack} />
          </button>
          {rightLabel && (
            <span
              className={`${styles.sideLabel} ${isOn ? styles.active : ""} ${
                styles.rightLabel
              }`}
            >
              {rightLabel}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
