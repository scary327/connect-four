import React, { memo, useRef, useEffect, useState, useCallback } from "react";
import styles from "./Column.module.css";
import Cell from "../Cell/Cell";
import FallingChip from "../FallingChip/FallingChip";
import type { CellValue, Player } from "src/types/game";
import Indicator from "../Indicator/Indicator";

interface FallingChipData {
  targetRow: number;
  player: Player;
}

interface ColumnProps {
  columnIndex: number;
  cells: CellValue[];
  animatingCells: Set<string>;
  fallingChip: FallingChipData | null;
  winningCells?: Set<string>;
  onColumnClick: () => void;
  showIndicator?: boolean;
}

const Column: React.FC<ColumnProps> = memo(
  ({
    columnIndex,
    cells,
    animatingCells,
    fallingChip,
    winningCells,
    onColumnClick,
    showIndicator = true,
  }) => {
    const colRef = useRef<HTMLDivElement | null>(null);
    const posRef = useRef<{ x: number; y: number } | null>(null);

    const handleMouseMove = useCallback(() => {
      const rect = colRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const topY = rect.top;
      posRef.current = { x: centerX, y: topY };
    }, []);

    const handleMouseLeave = useCallback(() => {
      posRef.current = null;
    }, []);

    return (
      <div
        className={styles.column}
        onClick={onColumnClick}
        ref={colRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {fallingChip && (
          <FallingChip
            targetRow={fallingChip.targetRow}
            player={fallingChip.player}
          />
        )}
        {cells.map((cell, rowIndex) => {
          const cellKey = `${rowIndex}-${columnIndex}`;
          const isAnimating = animatingCells.has(cellKey);
          const isWinning = winningCells ? winningCells.has(cellKey) : false;

          return (
            <Cell
              key={rowIndex}
              value={cell}
              isAnimating={isAnimating}
              isWinning={isWinning}
              onClick={(e) => {
                e.stopPropagation();
                onColumnClick();
              }}
            />
          );
        })}

        {showIndicator && <ColumnIndicator posRef={posRef} />}
      </div>
    );
  }
);

const ColumnIndicator: React.FC<{
  posRef: React.RefObject<{ x: number; y: number } | null>;
}> = memo(({ posRef }) => {
  const [posLocal, setPosLocal] = useState<{ x: number; y: number } | null>(
    posRef.current
  );
  const prevRef = useRef<{ x: number; y: number } | null>(posLocal);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function loop() {
      const s = posRef.current;
      if (s) {
        const changed =
          !prevRef.current ||
          prevRef.current.x !== s.x ||
          prevRef.current.y !== s.y;
        if (changed) {
          prevRef.current = { x: s.x, y: s.y };
          setPosLocal({ x: s.x, y: s.y });
        }
      } else if (prevRef.current !== null) {
        prevRef.current = null;
        setPosLocal(null);
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [posRef]);

  if (!posLocal) return null;
  return <Indicator x={posLocal.x} y={posLocal.y} />;
});

Column.displayName = "Column";

export default Column;
