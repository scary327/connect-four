import React, { memo } from "react";
import styles from "./Column.module.css";
import Cell from "../Cell/Cell";
import FallingChip from "../FallingChip/FallingChip";
import type { CellValue, Player } from "src/types/game";

interface FallingChipData {
  targetRow: number;
  player: Player;
}

interface ColumnProps {
  columnIndex: number;
  cells: CellValue[];
  animatingCells: Set<string>;
  fallingChip: FallingChipData | null;
  onColumnClick: () => void;
}

const Column: React.FC<ColumnProps> = memo(
  ({ columnIndex, cells, animatingCells, fallingChip, onColumnClick }) => {
    return (
      <div className={styles.column} onClick={onColumnClick}>
        {fallingChip && (
          <FallingChip
            targetRow={fallingChip.targetRow}
            player={fallingChip.player}
          />
        )}
        {cells.map((cell, rowIndex) => {
          const cellKey = `${rowIndex}-${columnIndex}`;
          const isAnimating = animatingCells.has(cellKey);

          return (
            <Cell
              key={rowIndex}
              value={cell}
              isAnimating={isAnimating}
              onClick={(e) => {
                e.stopPropagation();
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
