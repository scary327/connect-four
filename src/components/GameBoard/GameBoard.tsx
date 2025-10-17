import React, { memo } from "react";
import styles from "./GameBoard.module.css";
import { useIndicator } from "@shared/hooks/useIndicator";
import Indicator from "@shared/ui/Indicator/Indicator";

interface GameBoardProps {
  rows: number;
  columns: number;
}

const GameBoard: React.FC<GameBoardProps> = memo(({ rows, columns }) => {
  const { boardRef, indicatorState, updateIndicator, hideIndicator } =
    useIndicator(columns);

  return (
    <>
      <div
        ref={boardRef}
        className={styles.board}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
        onMouseMove={updateIndicator}
        onMouseLeave={hideIndicator}
      >
        {Array.from({ length: rows * columns }, (_, index) => (
          <div key={index} className={styles.cell} />
        ))}
      </div>
      {indicatorState && (
        <Indicator x={indicatorState.x} y={indicatorState.y} />
      )}
    </>
  );
});

GameBoard.displayName = "GameBoard";

export default GameBoard;
