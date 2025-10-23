import React, { memo } from "react";
import styles from "./GameBoard.module.css";
import { useIndicator } from "@shared/hooks/useIndicator";
import { useGame } from "@shared/hooks/useGame";
import { useGameBoard } from "@shared/hooks/useGameBoard";
import Column from "@components/Game/Column/Column";
import GameInfo from "@components/Game/GameInfo/GameInfo";
import GameSettings from "@components/Game/GameSettings/GameSettings";
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
    setAnimationType,
    startFalling,
    startAnimating,
  } = useGameBoard(rows);

  const { boardRef, indicatorState, updateIndicator, hideIndicator } =
    useIndicator(columns);

  const handleColumnClick = (columnIndex: number) => {
    if (game.isGameOver) return;
    if (fallingChip || animatingCells.size > 0) return;

    // Находим свободную ячейку ДО того как сделаем ход
    const targetRow = findAvailableRow(game.board, columnIndex);
    if (targetRow === -1) return; // Колонка заполнена

    const currentPlayer = game.currentPlayer;

    // Запускаем анимацию в зависимости от типа
    if (animationType === "fall") {
      // Fall - фишка падает сверху
      startFalling(columnIndex, targetRow, currentPlayer);

      // Делаем ход после задержки анимации
      setTimeout(() => {
        game.makeMove(columnIndex);
      }, 50 + targetRow * 100);
    } else {
      // Drop - фишка появляется на месте с анимацией
      const moveSuccess = game.makeMove(columnIndex);
      if (moveSuccess) {
        startAnimating(targetRow, columnIndex);
      }
    }
  };

  // Транспонируем доску для отображения по колонкам
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
        {indicatorState && !game.isGameOver && (
          <Indicator x={indicatorState.x} y={indicatorState.y} />
        )}
      </div>
    </>
  );
});

GameBoard.displayName = "GameBoard";

export default GameBoard;
