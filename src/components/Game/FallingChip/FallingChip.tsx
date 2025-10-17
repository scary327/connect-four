import React, { memo } from "react";
import styles from "./FallingChip.module.css";

interface FallingChipProps {
  targetRow: number;
}

const FallingChip: React.FC<FallingChipProps> = memo(({ targetRow }) => {
  const distance = targetRow * 68; // 60px cell + 8px gap

  return (
    <div
      className={styles.fallingChip}
      style={
        {
          "--fall-distance": `${distance}px`,
          "--fall-duration": `${50 + targetRow * 100}ms`,
        } as React.CSSProperties
      }
    />
  );
});

FallingChip.displayName = "FallingChip";

export default FallingChip;
