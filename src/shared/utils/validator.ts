import type { GameResults } from "src/types/game";
import { getWinningLine } from "./gameHelpers";
import type { Player } from "src/types/game";

export interface ValidatorOptions {
  rows?: number;
  columns?: number;
  winCondition?: number;
}

export const validator = (
  moves: number[],
  { rows = 6, columns = 7, winCondition = 4 }: ValidatorOptions = {}
): GameResults => {
  const board: (0 | 1 | null)[][] = Array.from({ length: rows }, () =>
    Array(columns).fill(null)
  );

  const player1: [number, number][] = [];
  const player2: [number, number][] = [];

  let winnerPositions: [number, number][] = [];
  let winnerWho: "player_1" | "player_2" | null = null;
  let boardState: "win" | "draw" | "ongoing" = "ongoing";

  const place = (col: number, player: 0 | 1) => {
    if (col < 0 || col >= columns) return null;
    for (let r = rows - 1; r >= 0; r--) {
      if (board[r][col] === null) {
        board[r][col] = player;
        return [r, col] as [number, number];
      }
    }
    return null;
  };

  for (let i = 0; i < moves.length; i++) {
    const col = moves[i];
    const player = i % 2 === 0 ? 0 : 1;

    const pos = place(col, player);
    if (!pos) continue;

    if (player === 0) player1.push(pos);
    else player2.push(pos);

    const boardForHelper = board.map((row) =>
      row.map((v) =>
        v === 0 ? ("player1" as Player) : v === 1 ? ("player2" as Player) : null
      )
    );

    const winning = getWinningLine(
      boardForHelper,
      pos[0],
      pos[1],
      player === 0 ? ("player1" as Player) : ("player2" as Player),
      winCondition
    );

    if (winning && winning.length >= winCondition) {
      winnerPositions = winning as [number, number][];
      winnerWho = player === 0 ? "player_1" : "player_2";
      boardState = "win";
      break;
    }
  }

  if (boardState !== "win") {
    const full = board[0].every((c) => c !== null);
    if (full) {
      boardState = "draw";
    } else {
      boardState = "ongoing";
    }
  }

  return {
    player_1: player1,
    player_2: player2,
    board_state: boardState,
    winner: {
      who: winnerWho,
      positions: winnerPositions,
    },
  };
};
