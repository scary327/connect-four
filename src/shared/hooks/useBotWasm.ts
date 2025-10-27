import { useRef } from "react";
import init, { compute_move } from "wasm/connect4_bot/pkg/connect4_bot";

export function useBotWasm() {
  const inited = useRef(false);

  async function ensureWasmInit() {
    if (!inited.current) {
      await init();
      inited.current = true;
    }
  }

  async function getBotMove(
    moves: number[],
    difficulty: string,
    rows: number,
    columns: number,
    winCondition: number
  ) {
    await ensureWasmInit();
    return compute_move(
      new Uint8Array(moves),
      difficulty,
      rows,
      columns,
      winCondition
    );
  }

  return getBotMove;
}
