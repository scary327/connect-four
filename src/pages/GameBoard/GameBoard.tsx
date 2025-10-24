import React, { memo, useState } from "react";
import styles from "./GameBoard.module.css";
import { useIndicator } from "@shared/hooks/useIndicator";
import { useGame } from "@shared/hooks/useGame";
import { useGameBoard } from "@shared/hooks/useGameBoard";
import Column from "@components/Game/Column/Column";
import GameInfo from "@components/Game/GameInfo/GameInfo";
import Indicator from "@components/Game/Indicator/Indicator";
import { findAvailableRow } from "@shared/utils/gameHelpers";

interface GameBoardProps {
  rows: number;
  columns: number;
}

const GameBoard: React.FC<GameBoardProps> = memo(({ rows, columns }) => {
  const game = useGame({ rows, columns, mode: "local" });

  const {
    fallingChip,
    animatingCells,
    animationType,
    startFalling,
    startAnimating,
  } = useGameBoard(rows);

  // Используем оптимизированный хук
  const { boardRef, indicatorStateRef, updateIndicator, hideIndicator } =
    useIndicator(columns);

  // Локальный стейт для отображения индикатора, чтобы триггерить ререндер при изменении позиции
  const [localIndicator, setLocalIndicator] = useState(
    indicatorStateRef.current
  );

  // Обертка над updateIndicator — обновляет ref и обновляет local state
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const newIndicatorState = updateIndicator(event);
    setLocalIndicator(newIndicatorState);
  };

  // Обработчик скрытия индикатора - очищаем ref и local state
  const handleMouseLeave = () => {
    hideIndicator();
    setLocalIndicator(null);
  };

  const handleColumnClick = (columnIndex: number) => {
    if (game.isGameOver) return;
    if (fallingChip || animatingCells.size > 0) return;

    const targetRow = findAvailableRow(game.board, columnIndex);
    if (targetRow === -1) return;

    const currentPlayer = game.currentPlayer;

    if (animationType === "fall") {
      startFalling(columnIndex, targetRow, currentPlayer);
      setTimeout(() => {
        game.makeMove(columnIndex);
      }, 50 + targetRow * 100);
    } else {
      const moveSuccess = game.makeMove(columnIndex);
      if (moveSuccess) {
        startAnimating(targetRow, columnIndex);
      }
    }
  };

  const columnData = Array.from({ length: columns }, (_, colIndex) =>
    Array.from(
      { length: rows },
      (_, rowIndex) => game.board[rowIndex][colIndex]
    )
  );

  return (
    <>
      <GameInfo
        currentPlayer={game.currentPlayer}
        winner={game.winner}
        mode={game.mode}
        onReset={game.resetGame}
        onModeChange={game.setGameMode}
      />
      <div className={styles.boardContainer}>
        <div
          ref={boardRef}
          className={styles.board}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {columnData.map((cells, colIndex) => (
            <Column
              key={colIndex}
              columnIndex={colIndex}
              cells={cells}
              animatingCells={animatingCells}
              fallingChip={
                fallingChip?.columnIndex === colIndex &&
                animationType === "fall"
                  ? {
                      targetRow: fallingChip.targetRow,
                      player: fallingChip.player,
                    }
                  : null
              }
              onColumnClick={() => handleColumnClick(colIndex)}
            />
          ))}
        </div>
        {localIndicator && !game.isGameOver && (
          <Indicator x={localIndicator.x} y={localIndicator.y} />
        )}
      </div>
    </>
  );
});

GameBoard.displayName = "GameBoard";

export default GameBoard;
