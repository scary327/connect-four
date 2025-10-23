import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { GameState, GameConfig, GameMode } from "src/types/game";
import {
  generateGameId,
  checkWinner,
  isBoardFull,
  findAvailableRow,
  switchPlayer,
} from "../utils/gameHelpers";

interface UseGameReturn extends GameState {
  makeMove: (column: number) => boolean;
  resetGame: () => void;
  setGameMode: (mode: GameMode) => void;
}

export const useGame = (config: GameConfig): UseGameReturn => {
  const { rows, columns } = config;

  const [gameMode, setGameMode] = useLocalStorage<GameMode>(
    "connect4-game-mode",
    config.mode
  );

  const createInitialState = useCallback(
    (): GameState => ({
      id: generateGameId(),
      mode: gameMode,
      board: Array.from({ length: rows }, () => Array(columns).fill(null)),
      currentPlayer: "player1",
      moves: [],
      winner: null,
      isGameOver: false,
    }),
    [rows, columns, gameMode]
  );

  const [gameState, setGameState] = useState<GameState>(createInitialState);

  /**
   * Делает ход в указанную колонку
   * @returns true если ход успешен, false если нет
   */
  const makeMove = useCallback(
    (column: number): boolean => {
      // Проверки валидности хода
      if (gameState.isGameOver) return false;
      if (column < 0 || column >= columns) return false;

      const availableRow = findAvailableRow(gameState.board, column);
      if (availableRow === -1) return false; // Колонка заполнена

      // Создаем новую доску с ходом
      const newBoard = gameState.board.map((row) => [...row]);
      newBoard[availableRow][column] = gameState.currentPlayer;

      // Проверяем победу
      const hasWon = checkWinner(
        newBoard,
        availableRow,
        column,
        gameState.currentPlayer
      );

      // Проверяем ничью
      const isDraw = !hasWon && isBoardFull(newBoard);

      // Обновляем состояние игры
      setGameState({
        ...gameState,
        board: newBoard,
        moves: [...gameState.moves, column],
        winner: hasWon ? gameState.currentPlayer : isDraw ? "draw" : null,
        isGameOver: hasWon || isDraw,
        currentPlayer:
          hasWon || isDraw
            ? gameState.currentPlayer
            : switchPlayer(gameState.currentPlayer),
      });

      return true;
    },
    [gameState, columns]
  );

  /**
   * Сбрасывает игру
   */
  const resetGame = useCallback(() => {
    setGameState(createInitialState());
  }, [createInitialState]);

  /**
   * Устанавливает режим игры
   */
  const handleSetGameMode = useCallback(
    (mode: GameMode) => {
      setGameMode(mode);
      setGameState({
        ...createInitialState(),
        mode,
      });
    },
    [createInitialState, setGameMode]
  );

  return {
    ...gameState,
    makeMove,
    resetGame,
    setGameMode: handleSetGameMode,
  };
};
