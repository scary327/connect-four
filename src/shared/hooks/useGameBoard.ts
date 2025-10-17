import { useState, useCallback } from "react";

export type CellValue = null | "orange";
export type AnimationType = "drop" | "fall";

interface FallingChipState {
  columnIndex: number;
  targetRow: number;
}

interface UseGameBoardReturn {
  board: CellValue[][];
  fallingChip: FallingChipState | null;
  animatingCells: Set<string>;
  animationType: AnimationType;
  setAnimationType: (type: AnimationType) => void;
  handleColumnClick: (columnIndex: number) => void;
}

export const useGameBoard = (
  rows: number,
  columns: number
): UseGameBoardReturn => {
  const [board, setBoard] = useState<CellValue[][]>(
    Array.from({ length: rows }, () => Array(columns).fill(null))
  );
  const [fallingChip, setFallingChip] = useState<FallingChipState | null>(null);
  const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set());
  const [animationType, setAnimationType] = useState<AnimationType>("fall");

  const handleColumnClick = useCallback(
    (columnIndex: number) => {
      // Проверяем, не падает ли уже фишка
      if (fallingChip || animatingCells.size > 0) return;

      // Находим первую свободную ячейку снизу вверх
      for (let row = rows - 1; row >= 0; row--) {
        if (board[row][columnIndex] === null) {
          const cellKey = `${row}-${columnIndex}`;

          if (animationType === "fall") {
            // Анимация падения сверху
            setFallingChip({ columnIndex, targetRow: row });

            setTimeout(() => {
              setBoard((prevBoard) => {
                const newBoard = prevBoard.map((row) => [...row]);
                newBoard[row][columnIndex] = "orange";
                return newBoard;
              });
              setFallingChip(null);
            }, 50 + row * 100);
          } else {
            // Анимация drop на месте
            setAnimatingCells((prev) => new Set(prev).add(cellKey));

            setBoard((prevBoard) => {
              const newBoard = prevBoard.map((row) => [...row]);
              newBoard[row][columnIndex] = "orange";
              return newBoard;
            });

            setTimeout(() => {
              setAnimatingCells((prev) => {
                const newSet = new Set(prev);
                newSet.delete(cellKey);
                return newSet;
              });
            }, 500);
          }

          break;
        }
      }
    },
    [board, rows, fallingChip, animatingCells, animationType]
  );

  return {
    board,
    fallingChip,
    animatingCells,
    animationType,
    setAnimationType,
    handleColumnClick,
  };
};
