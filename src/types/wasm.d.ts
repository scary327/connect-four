declare module "wasm/connect4_bot/pkg/connect4_bot" {
  export default function init(input?: unknown): Promise<void>;

  export function compute_move(
    moves: Uint8Array,
    difficulty: string,
    rows: number,
    columns: number,
    winCondition: number
  ): number;
}
