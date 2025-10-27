import type { Player } from "src/types/game";

export const generateGameId = (): string => {
  return `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const findAvailableRow = (
  board: (Player | null)[][],
  column: number
): number => {
  for (let row = board.length - 1; row >= 0; row--) {
    if (board[row][column] === null) {
      return row;
    }
  }
  return -1;
};

export const switchPlayer = (player: Player): Player => {
  return player === "player1" ? "player2" : "player1";
};

export const isBoardFull = (board: (Player | null)[][]): boolean => {
  return board[0].every((cell) => cell !== null);
};

/**
 * Проверяет победу игрока в указанной позиции
 * @param board - игровая доска
 * @param row - строка последнего хода
 * @param col - колонка последнего хода
 * @param player - игрок
 * @param winCondition - количество фишек для победы (по умолчанию 4)
 */
export const checkWinner = (
  board: (Player | null)[][],
  row: number,
  col: number,
  player: Player,
  winCondition: number = 4
): boolean => {
  const rows = board.length;
  const cols = board[0].length;

  const checkHorizontal = (): boolean => {
    let count = 0;
    for (let c = 0; c < cols; c++) {
      if (board[row][c] === player) {
        count++;
        if (count >= winCondition) return true;
      } else {
        count = 0;
      }
    }
    return false;
  };

  const checkVertical = (): boolean => {
    let count = 0;
    for (let r = 0; r < rows; r++) {
      if (board[r][col] === player) {
        count++;
        if (count >= winCondition) return true;
      } else {
        count = 0;
      }
    }
    return false;
  };

  const checkDiagonal1 = (): boolean => {
    let count = 0;
    const startRow = row - Math.min(row, col);
    const startCol = col - Math.min(row, col);

    for (let r = startRow, c = startCol; r < rows && c < cols; r++, c++) {
      if (board[r][c] === player) {
        count++;
        if (count >= winCondition) return true;
      } else {
        count = 0;
      }
    }
    return false;
  };

  const checkDiagonal2 = (): boolean => {
    let count = 0;
    const offset = Math.min(row, cols - 1 - col);
    const startRow = row - offset;
    const startCol = col + offset;

    for (let r = startRow, c = startCol; r < rows && c >= 0; r++, c--) {
      if (board[r][c] === player) {
        count++;
        if (count >= winCondition) return true;
      } else {
        count = 0;
      }
    }
    return false;
  };

  return (
    checkHorizontal() || checkVertical() || checkDiagonal1() || checkDiagonal2()
  );
};

export const getPlayerColor = (player: Player): string => {
  return player === "player1" ? "#ff4757" : "#ffa502";
};

export const getPlayerName = (
  player: Player,
  mode: "local" | "bot"
): string => {
  if (mode === "bot") {
    return player === "player1" ? "Вы" : "Бот";
  }
  return player === "player1" ? "Игрок 1" : "Игрок 2";
};
