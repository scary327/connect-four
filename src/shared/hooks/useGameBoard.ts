import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Player } from "src/types/game";

export type AnimationType = "drop" | "fall";

interface FallingChipState {
  columnIndex: number;
  targetRow: number;
  player: Player;
}

interface UseGameBoardReturn {
  fallingChip: FallingChipState | null;
  animatingCells: Set<string>;
  animationType: AnimationType;
  setAnimationType: (type: AnimationType) => void;
  startFalling: (
    columnIndex: number,
    targetRow: number,
    player: Player
  ) => void;
  startAnimating: (row: number, column: number) => void;
}

export const useGameBoard = (rows: number): UseGameBoardReturn => {
  console.log("useGameBoard rows:", rows);
  const [fallingChip, setFallingChip] = useState<FallingChipState | null>(null);
  const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set());
  const [animationType, setAnimationType] = useLocalStorage<AnimationType>(
    "connect4-animation-type",
    "fall"
  );

  /**
   * Запускает анимацию падения сверху
   */
  const startFalling = useCallback(
    (columnIndex: number, targetRow: number, player: Player) => {
      setFallingChip({ columnIndex, targetRow, player });

      setTimeout(() => {
        setFallingChip(null);
      }, 50 + targetRow * 100);
    },
    []
  );

  /**
   * Запускает анимацию появления на месте
   */
  const startAnimating = useCallback((row: number, column: number) => {
    const cellKey = `${row}-${column}`;
    setAnimatingCells((prev) => new Set(prev).add(cellKey));

    setTimeout(() => {
      setAnimatingCells((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });
    }, 500);
  }, []);

  return {
    fallingChip,
    animatingCells,
    animationType,
    setAnimationType,
    startFalling,
    startAnimating,
  };
};
