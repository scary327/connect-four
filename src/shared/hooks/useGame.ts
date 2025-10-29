import { useState, useCallback, useMemo, useEffect } from "react";
import { useBotWasm } from "./useBotWasm";

import type { GameState, GameConfig, GameMode } from "src/types/game";
import {
  checkWinner,
  getWinningLine,
  isBoardFull,
  findAvailableRow,
  switchPlayer,
} from "../utils/gameHelpers";
import { useLocalStorage } from "./useLocalStorage";
import { LOCALSTORAGE_GAME_NAME } from "@shared/constants/localStorageNames";

interface UseGameReturn extends GameState {
  makeMove: (column: number, isBot?: boolean) => boolean;
  pendingBotMove: number | null;
  applyBotMove: (column: number) => void;
  resetGame: () => void;
  setGameMode: (mode: GameMode) => void;
}

export const useGame = (config: GameConfig, gameId: string): UseGameReturn => {
  const { rows, columns, winCondition, mode, difficulty = "easy" } = config;

  const [gameMode, setGameMode] = useState<GameMode>(mode);

  const createInitialState = useCallback(
    (id: string, currentMode: GameMode = gameMode): GameState => ({
      id,
      mode: currentMode,
      board: Array.from({ length: rows }, () => Array(columns).fill(null)),
      currentPlayer: "player1",
      moves: [],
      winner: null,
      winningLine: undefined,
      winCondition: winCondition,
      difficulty: difficulty,
      isGameOver: false,
    }),
    [rows, columns, gameMode, winCondition, difficulty]
  );

  const [games, setGames] = useLocalStorage<{ [key: string]: GameState }>(
    LOCALSTORAGE_GAME_NAME,
    {}
  );

  const updateGameById = useCallback(
    (id: string, updater: (state: GameState) => GameState): void => {
      setGames((prev) => {
        if (!prev || !(id in prev)) return prev;
        const current = prev[id];
        return { ...prev, [id]: updater(current) };
      });
    },
    [setGames]
  );

  const gameState = useMemo((): GameState => {
    return games[gameId] ?? createInitialState(gameId);
  }, [games, gameId, createInitialState]);

  useEffect(() => {
    if (!games[gameId]) {
      const initialState = createInitialState(gameId);
      setGames((prev) => {
        const prevMap = prev ?? {};
        const next: { [key: string]: GameState } = {
          [gameId]: initialState,
          ...prevMap,
        };

        const keys = Object.keys(next);
        if (keys.length > 10) {
          const toRemove = keys.slice(10);
          for (const k of toRemove) {
            delete next[k];
          }
        }

        return next;
      });
    }
  }, [gameId, games, createInitialState, setGames]);

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

      const newState: GameState = {
        ...gameState,
        board: newBoard,
        moves: [...gameState.moves, column],
        winner: hasWon ? gameState.currentPlayer : isDraw ? "draw" : null,
        winningLine,
        isGameOver: hasWon || isDraw,
        currentPlayer:
          hasWon || isDraw
            ? gameState.currentPlayer
            : switchPlayer(gameState.currentPlayer),
      };

      updateGameById(gameId, () => newState);

      return true;
    },
    [gameState, columns, winCondition, gameMode, gameId, updateGameById]
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
  ]);

  const resetGame = useCallback(() => {
    const newInitial = createInitialState(gameId);
    updateGameById(gameId, () => newInitial);
  }, [createInitialState, gameId, updateGameById]);

  const handleSetGameMode = useCallback(
    (newMode: GameMode) => {
      setGameMode(newMode);
      const newInitial = createInitialState(gameId, newMode);
      updateGameById(gameId, () => newInitial);
    },
    [createInitialState, gameId, updateGameById]
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
