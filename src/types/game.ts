export type Player = "player1" | "player2";
export type GameMode = "local" | "bot";
export type CellValue = Player | null;
export type Difficulty = "easy" | "medium" | "insane";

export interface GameConfig {
  rows: number;
  columns: number;
  winCondition: number;
  mode: GameMode;
  difficulty?: Difficulty;
}

export interface GameState {
  id: string;
  mode: GameMode;
  board: CellValue[][];
  currentPlayer: Player;
  moves: number[];
  winner: Player | "draw" | null;
  winCondition?: number;
  difficulty?: Difficulty;
  winningLine?: Array<[number, number]>;
  isGameOver: boolean;
}

export interface GameResults {
  player_1: [number, number][];
  player_2: [number, number][];
  board_state: "win" | "draw" | "ongoing";
  winner: {
    who: "player_1" | "player_2" | null;
    positions: [number, number][];
  };
}
