import React, { memo } from "react";
import styles from "./Chip.module.css";
import { getPlayerColor } from "@shared/utils/gameHelpers";
import type { Player } from "src/types/game";

interface ChipProps {
  player: Player;
  isAnimating?: boolean;
}

const Chip: React.FC<ChipProps> = memo(({ player, isAnimating = false }) => {
  const color = getPlayerColor(player);

  return (
    <div
      className={`${styles.chip} ${isAnimating ? styles.dropping : ""}`}
      style={
        {
          "--chip-color": color,
          "--chip-shadow": `${color}80`,
        } as React.CSSProperties
      }
    />
  );
});

Chip.displayName = "Chip";

export default Chip;
