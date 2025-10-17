import React, { memo } from "react";
import styles from "./Chip.module.css";

interface ChipProps {
  isAnimating?: boolean;
}

const Chip: React.FC<ChipProps> = memo(({ isAnimating = false }) => {
  return (
    <div className={`${styles.chip} ${isAnimating ? styles.dropping : ""}`} />
  );
});

Chip.displayName = "Chip";

export default Chip;
