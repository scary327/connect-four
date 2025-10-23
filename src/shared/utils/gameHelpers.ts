import type { Player, GameMode, CellValue } from "src/types/game";

/**
 * Генерирует уникальный ID игры
 */
export const generateGameId = (): string => {
  return `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Проверяет победу по вертикали, горизонтали и диагоналям
 */
export const checkWinner = (
  board: CellValue[][],
  lastRow: number,
  lastCol: number,
  player: Player
): boolean => {
  const rows = board.length;
  const cols = board[0].length;

  // Проверка по горизонтали
  const checkHorizontal = (): boolean => {
    let count = 0;
    for (let c = 0; c < cols; c++) {
      if (board[lastRow][c] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }
    return false;
  };

  // Проверка по вертикали
  const checkVertical = (): boolean => {
    let count = 0;
    for (let r = 0; r < rows; r++) {
      if (board[r][lastCol] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }
    return false;
  };

  // Проверка по диагонали (слева-направо вниз)
  const checkDiagonalRight = (): boolean => {
    let count = 0;
    const startRow = lastRow - Math.min(lastRow, lastCol);
    const startCol = lastCol - Math.min(lastRow, lastCol);

    let r = startRow;
    let c = startCol;

    while (r < rows && c < cols) {
      if (board[r][c] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
      r++;
      c++;
    }
    return false;
  };

  // Проверка по диагонали (справа-налево вниз)
  const checkDiagonalLeft = (): boolean => {
    let count = 0;
    const startRow = lastRow - Math.min(lastRow, cols - 1 - lastCol);
    const startCol = lastCol + Math.min(lastRow, cols - 1 - lastCol);

    let r = startRow;
    let c = startCol;

    while (r < rows && c >= 0) {
      if (board[r][c] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
      r++;
      c--;
    }
    return false;
  };

  return (
    checkHorizontal() ||
    checkVertical() ||
    checkDiagonalRight() ||
    checkDiagonalLeft()
  );
};

/**
 * Проверяет, заполнена ли доска (ничья)
 */
export const isBoardFull = (board: CellValue[][]): boolean => {
  return board[0].every((cell) => cell !== null);
};

/**
 * Находит первую свободную строку в колонке (снизу вверх)
 */
export const findAvailableRow = (
  board: CellValue[][],
  column: number
): number => {
  const rows = board.length;
  for (let row = rows - 1; row >= 0; row--) {
    if (board[row][column] === null) {
      return row;
    }
  }
  return -1; // Колонка заполнена
};

/**
 * Переключает игрока
 */
export const switchPlayer = (currentPlayer: Player): Player => {
  return currentPlayer === "player1" ? "player2" : "player1";
};

/**
 * Получает цвет для игрока
 */
export const getPlayerColor = (player: Player): string => {
  return player === "player1" ? "#ff8c42" : "#00D9FF";
};

/**
 * Получает имя игрока
 */
export const getPlayerName = (player: Player, mode: GameMode): string => {
  if (player === "player1") return "Игрок 1";
  return mode === "bot" ? "Бот" : "Игрок 2";
};
