import React, { memo } from "react";
import styles from "./GameBoard.module.css";
import { useGame } from "@shared/hooks/useGame";
import { useGameBoard } from "@shared/hooks/useGameBoard";
import Column from "@components/Game/Column/Column";
import GameInfo from "@components/Game/GameInfo/GameInfo";
import { findAvailableRow } from "@shared/utils/gameHelpers";
import type { GameMode } from "src/types/game";

interface GameBoardProps {
  rows: number;
  columns: number;
  winCondition?: number;
  mode?: GameMode;
}

const GameBoard: React.FC<GameBoardProps> = memo(
  ({ rows, columns, winCondition = 4, mode = "local" }) => {
    const game = useGame({ rows, columns, winCondition, mode });

    const {
      fallingChip,
      animatingCells,
      animationType,
      startFalling,
      startAnimating,
    } = useGameBoard(rows);

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
          <div className={styles.board}>
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
                showIndicator={!game.isGameOver}
              />
            ))}
          </div>
        </div>
      </>
    );
  }
);

GameBoard.displayName = "GameBoard";

export default GameBoard;
