// src/types/game.ts
export type Player = "player1" | "player2";
export type GameMode = "local" | "bot";

export interface GameConfig {
  rows: number;
  columns: number;
  winCondition: number;
  mode: GameMode;
}

export interface GameState {
  id: string;
  mode: GameMode;
  board: (Player | null)[][];
  currentPlayer: Player;
  moves: number[];
  winner: Player | "draw" | null;
  isGameOver: boolean;
}
