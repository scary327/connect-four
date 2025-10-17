import React, { memo } from "react";
import styles from "./Cell.module.css";
import Chip from "../Chip/Chip";
import type { CellValue } from "@shared/hooks/useGameBoard";

interface CellProps {
  value: CellValue;
  isAnimating?: boolean;
  onClick: (e?: React.MouseEvent) => void;
}

const Cell: React.FC<CellProps> = memo(
  ({ value, isAnimating = false, onClick }) => {
    return (
      <div className={styles.cell} onClick={onClick}>
        {value && <Chip isAnimating={isAnimating} />}
      </div>
    );
  }
);

Cell.displayName = "Cell";

export default Cell;
