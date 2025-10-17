import React, { memo } from "react";
import styles from "./Column.module.css";
import FallingChip from "../FallingChip/FallingChip";
import type { CellValue } from "@shared/hooks/useGameBoard";
import Cell from "../Cell/Cell";

interface ColumnProps {
  columnIndex: number;
  cells: CellValue[];
  animatingCells: Set<string>;
  fallingToRow: number | null;
  onColumnClick: () => void;
}

const Column: React.FC<ColumnProps> = memo(
  ({ columnIndex, cells, animatingCells, fallingToRow, onColumnClick }) => {
    return (
      <div className={styles.column} onClick={onColumnClick}>
        {fallingToRow !== null && <FallingChip targetRow={fallingToRow} />}
        {cells.map((cell, rowIndex) => {
          const cellKey = `${rowIndex}-${columnIndex}`;
          const isAnimating = animatingCells.has(cellKey);

          return (
            <Cell
              key={rowIndex}
              value={cell}
              isAnimating={isAnimating}
              onClick={(e) => {
                e?.stopPropagation();
                onColumnClick();
              }}
            />
          );
        })}
      </div>
    );
  }
);

Column.displayName = "Column";

export default Column;
