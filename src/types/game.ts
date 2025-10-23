export type Player = "player1" | "player2";
export type GameMode = "local" | "bot";
export type CellValue = null | Player;

export interface GameState {
  id: string;
  mode: GameMode;
  board: CellValue[][];
  currentPlayer: Player;
  moves: number[]; // История ходов (номера колонок)
  winner: Player | "draw" | null;
  isGameOver: boolean;
}

export interface GameConfig {
  rows: number;
  columns: number;
  mode: GameMode;
}
