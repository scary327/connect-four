import { useState, useCallback, useEffect } from "react";
import { useBotWasm } from "./useBotWasm";

import type { GameState, GameConfig, GameMode } from "src/types/game";
import {
  generateGameId,
  checkWinner,
  getWinningLine,
  isBoardFull,
  findAvailableRow,
  switchPlayer,
} from "../utils/gameHelpers";

interface UseGameReturn extends GameState {
  makeMove: (column: number, isBot?: boolean) => boolean;
  pendingBotMove: number | null;
  applyBotMove: (column: number) => void;
  resetGame: () => void;
  setGameMode: (mode: GameMode) => void;
}

export const useGame = (config: GameConfig): UseGameReturn => {
  const { rows, columns, winCondition, mode, difficulty = "easy" } = config;

  const [gameMode, setGameMode] = useState<GameMode>(mode);

  const createInitialState = useCallback(
    (): GameState => ({
      id: generateGameId(),
      mode: gameMode,
      board: Array.from({ length: rows }, () => Array(columns).fill(null)),
      currentPlayer: "player1",
      moves: [],
      winner: null,
      winningLine: undefined,
      isGameOver: false,
    }),
    [rows, columns, gameMode]
  );

  const [gameState, setGameState] = useState<GameState>(createInitialState);

  const makeMove = useCallback(
    (column: number, isBot: boolean = false): boolean => {
      if (gameState.isGameOver) return false;
      if (gameMode === "bot" && gameState.currentPlayer === "player2" && !isBot)
        return false;
      if (column < 0 || column >= columns) return false;

      const availableRow = findAvailableRow(gameState.board, column);
      if (availableRow === -1) return false;

      const newBoard = gameState.board.map((row) => [...row]);
      newBoard[availableRow][column] = gameState.currentPlayer;

      const hasWon = checkWinner(
        newBoard,
        availableRow,
        column,
        gameState.currentPlayer,
        winCondition
      );

      const winningLine = hasWon
        ? getWinningLine(
            newBoard,
            availableRow,
            column,
            gameState.currentPlayer,
            winCondition
          ) || undefined
        : undefined;

      const isDraw = !hasWon && isBoardFull(newBoard);

      setGameState({
        ...gameState,
        board: newBoard,
        moves: [...gameState.moves, column],
        winner: hasWon ? gameState.currentPlayer : isDraw ? "draw" : null,
        winningLine: winningLine,
        isGameOver: hasWon || isDraw,
        currentPlayer:
          hasWon || isDraw
            ? gameState.currentPlayer
            : switchPlayer(gameState.currentPlayer),
      });

      return true;
    },
    [gameState, columns, winCondition, gameMode]
  );

  const [pendingBotMove, setPendingBotMove] = useState<number | null>(null);

  const applyBotMove = useCallback(
    (column: number) => {
      makeMove(column, true);
      setPendingBotMove(null);
    },
    [makeMove]
  );

  const botMoveFn = useBotWasm();
  useEffect(() => {
    if (
      gameMode === "bot" &&
      gameState.currentPlayer === "player2" &&
      !gameState.isGameOver &&
      botMoveFn
    ) {
      let cancelled = false;
      const id = setTimeout(async () => {
        const column = await botMoveFn(
          gameState.moves,
          difficulty,
          rows,
          columns,
          winCondition
        );

        if (cancelled) return;
        if (typeof column === "number" && column >= 0 && column < columns) {
          setPendingBotMove(column);
        }
      }, 40);

      return () => {
        cancelled = true;
        clearTimeout(id);
      };
    }
  }, [
    gameMode,
    gameState.currentPlayer,
    gameState.isGameOver,
    botMoveFn,
    gameState.moves,
    difficulty,
    rows,
    columns,
    winCondition,
    makeMove,
  ]);

  const resetGame = useCallback(() => {
    setGameState(createInitialState());
  }, [createInitialState]);

  const handleSetGameMode = useCallback(
    (mode: GameMode) => {
      setGameMode(mode);
      setGameState({
        ...createInitialState(),
        mode,
      });
    },
    [createInitialState]
  );

  return {
    ...gameState,
    makeMove,
    pendingBotMove,
    applyBotMove,
    resetGame,
    setGameMode: handleSetGameMode,
  };
};
