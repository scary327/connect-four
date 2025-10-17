import React, { memo } from "react";
import styles from "./GameBoard.module.css";
import { useIndicator } from "@shared/hooks/useIndicator";
import { useGameBoard } from "@shared/hooks/useGameBoard";
import GameSettings from "@components/Game/GameSettings/GameSettings";
import Column from "@components/Game/Column/Column";
import Indicator from "@components/Game/Indicator/Indicator";

interface GameBoardProps {
  rows: number;
  columns: number;
}

const GameBoard: React.FC<GameBoardProps> = memo(({ rows, columns }) => {
  const { boardRef, indicatorState, updateIndicator, hideIndicator } =
    useIndicator(columns);

  const {
    board,
    fallingChip,
    animatingCells,
    animationType,
    setAnimationType,
    handleColumnClick,
  } = useGameBoard(rows, columns);

  const columnData = Array.from({ length: columns }, (_, colIndex) =>
    Array.from({ length: rows }, (_, rowIndex) => board[rowIndex][colIndex])
  );

  return (
    <>
      <GameSettings
        animationType={animationType}
        onAnimationTypeChange={setAnimationType}
      />
      <div className={styles.boardContainer}>
        <div
          ref={boardRef}
          className={styles.board}
          onMouseMove={updateIndicator}
          onMouseLeave={hideIndicator}
        >
          {columnData.map((cells, colIndex) => (
            <Column
              key={colIndex}
              columnIndex={colIndex}
              cells={cells}
              animatingCells={animatingCells}
              fallingToRow={
                fallingChip?.columnIndex === colIndex &&
                animationType === "fall"
                  ? fallingChip.targetRow
                  : null
              }
              onColumnClick={() => handleColumnClick(colIndex)}
            />
          ))}
        </div>
        {indicatorState && (
          <Indicator x={indicatorState.x} y={indicatorState.y} />
        )}
      </div>
    </>
  );
});

GameBoard.displayName = "GameBoard";

export default GameBoard;
