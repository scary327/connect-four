export type Player = "player1" | "player2";
export type GameMode = "local" | "bot";
export type CellValue = Player | null;

export interface GameConfig {
  rows: number;
  columns: number;
  winCondition: number;
  mode: GameMode;
  difficulty?: "easy" | "medium" | "insane";
}

export interface GameState {
  id: string;
  mode: GameMode;
  board: CellValue[][];
  currentPlayer: Player;
  moves: number[];
  winner: Player | "draw" | null;
  isGameOver: boolean;
}
