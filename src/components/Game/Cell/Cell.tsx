import React, { memo } from "react";
import styles from "./Cell.module.css";
import Chip from "../Chip/Chip";
import type { CellValue } from "src/types/game";

interface CellProps {
  value: CellValue;
  isAnimating?: boolean;
  isWinning?: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Cell: React.FC<CellProps> = memo(
  ({ value, isAnimating = false, isWinning = false, onClick }) => {
    return (
      <div className={styles.cell} onClick={onClick}>
        {value && (
          <Chip
            player={value}
            isAnimating={isAnimating}
            isWinning={isWinning}
          />
        )}
      </div>
    );
  }
);

Cell.displayName = "Cell";

export default Cell;
