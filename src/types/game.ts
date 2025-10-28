export type Player = "player1" | "player2";
export type GameMode = "local" | "bot";
export type CellValue = Player | null;

export interface GameConfig {
  rows: number;
  columns: number;
  winCondition: number;
  mode: GameMode;
  difficulty?: "easy" | "medium" | "hard" | "insane";
}

export interface GameState {
  id: string;
  mode: GameMode;
  board: CellValue[][];
  currentPlayer: Player;
  moves: number[];
  winner: Player | "draw" | null;
  winCondition?: number;
  difficulty?: "easy" | "medium" | "hard" | "insane";
  winningLine?: Array<[number, number]>;
  isGameOver: boolean;
}

export interface GameResults {
  player_1: [number, number][];
  player_2: [number, number][];
  board_state: "win" | "draw" | "ongoing";
  winner: {
    who: "player_1" | "player_2" | null;
    positions: [number, number][]; // winning positions
  };
}
