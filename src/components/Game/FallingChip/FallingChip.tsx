import React, { memo } from "react";
import styles from "./FallingChip.module.css";
import { getPlayerColor } from "@shared/utils/gameHelpers";
import type { Player } from "src/types/game";

interface FallingChipProps {
  targetRow: number;
  player: Player;
}

const FallingChip: React.FC<FallingChipProps> = memo(
  ({ targetRow, player }) => {
    const distance = targetRow * 68; // 60px cell + 8px gap
    const color = getPlayerColor(player);

    return (
      <div
        className={styles.fallingChip}
        style={
          {
            "--fall-distance": `${distance}px`,
            "--fall-duration": `${50 + targetRow * 100}ms`,
            "--chip-color": color,
            "--chip-shadow": `${color}80`,
          } as React.CSSProperties
        }
      />
    );
  }
);

FallingChip.displayName = "FallingChip";

export default FallingChip;
