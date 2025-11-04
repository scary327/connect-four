import React, { memo, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./GameBoard.module.css";
import { useGame } from "@shared/hooks/useGame";
import { useGameBoard } from "@shared/hooks/useGameBoard";
import Column from "@components/Game/Column/Column";
import GameInfo from "@components/Game/GameInfo/GameInfo";
import { findAvailableRow, generateGameId } from "@shared/utils/gameHelpers";
import type { GameMode } from "src/types/game";

interface GameBoardProps {
  rows: number;
  columns: number;
  winCondition?: number;
  mode?: GameMode;
  difficulty?: "easy" | "medium" | "insane";
}

const GameBoard: React.FC<GameBoardProps> = memo(
  ({
    rows,
    columns,
    winCondition = 4,
    mode = "local",
    difficulty = "easy",
  }) => {
    const params = useParams();
    const gameId = params.id ?? generateGameId();

    const game = useGame(
      { rows, columns, winCondition, mode, difficulty },
      gameId
    );

    const {
      currentPlayer,
      mode: gameMode,
      isGameOver,
      board: gameBoard,
      moves: gameMoves,
      makeMove: makeMoveFn,
      pendingBotMove,
      applyBotMove,
      resetGame,
      setGameMode,
      winner,
    } = game;

    const {
      fallingChip,
      animatingCells,
      animationType,
      startFalling,
      startAnimating,
    } = useGameBoard();

    const lastAnimatedMoveRef = React.useRef<number>(-1);

    const handleColumnClick = (columnIndex: number) => {
      if (isGameOver) return;
      if (fallingChip || animatingCells.size > 0) return;

      if (gameMode === "bot" && currentPlayer === "player2") return;

      const targetRow = findAvailableRow(gameBoard, columnIndex);
      if (targetRow === -1) return;

      const actor = currentPlayer;

      if (animationType === "fall") {
        lastAnimatedMoveRef.current = gameMoves.length;
        startFalling(columnIndex, targetRow, actor);
        setTimeout(() => {
          makeMoveFn(columnIndex);
        }, 50 + targetRow * 100);
      } else {
        lastAnimatedMoveRef.current = gameMoves.length;
        const moveSuccess = makeMoveFn(columnIndex);
        if (moveSuccess) {
          startAnimating(targetRow, columnIndex);
        }
      }
    };

    useEffect(() => {
      if (pendingBotMove == null) return;
      if (isGameOver) return;
      if (fallingChip || animatingCells.size > 0) return;

      const columnIndex = pendingBotMove;
      const targetRow = findAvailableRow(gameBoard, columnIndex);
      if (targetRow === -1) return;

      lastAnimatedMoveRef.current = gameMoves.length;

      if (animationType === "fall") {
        startFalling(columnIndex, targetRow, "player2");
        setTimeout(() => {
          applyBotMove(columnIndex);
        }, 50 + targetRow * 100);
      } else {
        applyBotMove(columnIndex);
        startAnimating(targetRow, columnIndex);
      }
    }, [
      pendingBotMove,
      isGameOver,
      fallingChip,
      animatingCells,
      gameBoard,
      gameMoves.length,
      animationType,
      startFalling,
      startAnimating,
      applyBotMove,
    ]);

    const prevMovesRef = React.useRef<number>(gameMoves.length || 0);

    useEffect(() => {
      if (gameMoves.length > prevMovesRef.current) {
        const lastIdx = gameMoves.length - 1;

        if (lastIdx <= lastAnimatedMoveRef.current) {
          prevMovesRef.current = gameMoves.length;
          return;
        }

        const lastCol = gameMoves[lastIdx];
        const lastPlayer = lastIdx % 2 === 0 ? "player1" : "player2";

        if (
          lastPlayer === "player2" &&
          !fallingChip &&
          animatingCells.size === 0
        ) {
          const prevMoves = gameMoves.slice(0, lastIdx);
          const prevCount = prevMoves.reduce(
            (acc, c) => (c === lastCol ? acc + 1 : acc),
            0
          );
          const targetRow = rows - 1 - prevCount;

          if (targetRow >= 0 && targetRow < rows) {
            lastAnimatedMoveRef.current = lastIdx;

            if (animationType === "fall") {
              startFalling(lastCol, targetRow, "player2");
              setTimeout(() => {
                startAnimating(targetRow, lastCol);
              }, 50 + targetRow * 100);
            } else {
              startAnimating(targetRow, lastCol);
            }
          }
        }
      }

      prevMovesRef.current = gameMoves.length;
    }, [
      gameMoves,
      fallingChip,
      animatingCells,
      rows,
      animationType,
      startFalling,
      startAnimating,
    ]);

    const columnData = Array.from({ length: columns }, (_, colIndex) =>
      Array.from(
        { length: rows },
        (_, rowIndex) => gameBoard[rowIndex][colIndex]
      )
    );

    const winningSet = new Set<string>();
    if (game.winningLine) {
      for (const [r, c] of game.winningLine) {
        winningSet.add(`${r}-${c}`);
      }
    }

    return (
      <>
        <GameInfo
          currentPlayer={currentPlayer}
          winner={winner}
          mode={gameMode}
          onReset={resetGame}
          onModeChange={setGameMode}
        />
        <div
          className={`${styles.boardContainer} ${
            gameMode === "bot" && currentPlayer === "player2" && !isGameOver
              ? styles.blocked
              : ""
          }`}
        >
          <div className={styles.board}>
            {columnData.map((cells, colIndex) => (
              <Column
                key={colIndex}
                columnIndex={colIndex}
                cells={cells}
                winningCells={winningSet}
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
