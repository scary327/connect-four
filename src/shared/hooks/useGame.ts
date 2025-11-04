import { useState, useCallback, useMemo, useEffect } from "react";
import type { GameState, GameConfig, GameMode } from "src/types/game";
import { useLocalStorage } from "./useLocalStorage";
import { LOCALSTORAGE_GAME_NAME } from "@shared/constants/localStorageNames";
import { GameEngine } from "../engine/GameEngine";

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
  const [games, setGames] = useLocalStorage<{ [key: string]: GameState }>(
    LOCALSTORAGE_GAME_NAME,
    {}
  );
  const [pendingBotMove, setPendingBotMove] = useState<number | null>(null);

  const engine = useMemo(() => {
    const e = new GameEngine(config, setGames);
    e.setGamesStorage(games);
    return e;
  }, [config, setGames, games]);

  const gameState = useMemo(() => engine.getGame(gameId), [engine, gameId]);

  useEffect(() => {
    engine.ensureGameExists(gameId);
  }, [engine, gameId]);

  const makeMove = useCallback(
    (column: number, isBot: boolean = false): boolean => {
      const newState = engine.makeMove(gameState, column, isBot);
      if (!newState) return false;
      engine.updateGame(gameId, () => newState);
      return true;
    },
    [engine, gameState, gameId]
  );

  const applyBotMove = useCallback(
    (column: number) => {
      makeMove(column, true);
      setPendingBotMove(null);
    },
    [makeMove]
  );

  useEffect(() => {
    if (
      gameMode === "bot" &&
      gameState.currentPlayer === "player2" &&
      !gameState.isGameOver
    ) {
      let cancelled = false;
      const id = setTimeout(async () => {
        const column = await engine.getBotMove(
          gameState.moves,
          difficulty,
          rows,
          columns,
          winCondition
        );
        if (!cancelled && typeof column === "number") setPendingBotMove(column);
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
    engine,
    gameState.moves,
    difficulty,
    rows,
    columns,
    winCondition,
  ]);

  const resetGame = useCallback(() => {
    engine.updateGame(gameId, () => engine.createInitialState(gameId));
  }, [engine, gameId]);

  const handleSetGameMode = useCallback(
    (newMode: GameMode) => {
      setGameMode(newMode);
      engine.updateGame(gameId, () =>
        engine.createInitialState(gameId, newMode)
      );
    },
    [engine, gameId]
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
