import type { GameState, GameConfig, GameMode } from "src/types/game";
import {
  checkWinner,
  getWinningLine,
  isBoardFull,
  findAvailableRow,
  switchPlayer,
} from "../utils/gameHelpers";
import init, { compute_move } from "wasm/connect4_bot/pkg/connect4_bot";

export class GameEngine {
  private initPromise: Promise<void> | null = null;
  private inited = false;
  private games: { [key: string]: GameState } = {};
  private config: GameConfig;
  private setGames?: (
    value:
      | { [key: string]: GameState }
      | ((prev: { [key: string]: GameState }) => { [key: string]: GameState })
  ) => void;

  constructor(
    config: GameConfig,
    setGames?: (
      value:
        | { [key: string]: GameState }
        | ((prev: { [key: string]: GameState }) => { [key: string]: GameState })
    ) => void
  ) {
    this.config = config;
    this.setGames = setGames;
  }

  private async ensureWasmInit(): Promise<void> {
    if (this.inited) return;
    if (!this.initPromise) {
      this.initPromise = (async () => {
        try {
          await init();
          this.inited = true;
        } catch (err) {
          console.error("GameEngine: wasm init failed", err);
        }
      })();
    }
    return this.initPromise;
  }

  createInitialState(id: string, mode: GameMode = "local"): GameState {
    const { rows, columns, winCondition, difficulty = "easy" } = this.config;
    return {
      id,
      mode,
      board: Array.from({ length: rows }, () => Array(columns).fill(null)),
      currentPlayer: "player1",
      moves: [],
      winner: null,
      winningLine: undefined,
      winCondition,
      difficulty,
      isGameOver: false,
    };
  }

  makeMove(
    state: GameState,
    column: number,
    isBot: boolean = false
  ): GameState | null {
    const { columns, winCondition } = this.config;
    if (state.isGameOver || column < 0 || column >= columns) return null;
    if (state.mode === "bot" && state.currentPlayer === "player2" && !isBot)
      return null;

    const availableRow = findAvailableRow(state.board, column);
    if (availableRow === -1) return null;

    const newBoard = state.board.map((row) => [...row]);
    newBoard[availableRow][column] = state.currentPlayer;
    const hasWon = checkWinner(
      newBoard,
      availableRow,
      column,
      state.currentPlayer,
      winCondition
    );
    const isDraw = !hasWon && isBoardFull(newBoard);

    return {
      ...state,
      board: newBoard,
      moves: [...state.moves, column],
      winner: hasWon ? state.currentPlayer : isDraw ? "draw" : null,
      winningLine: hasWon
        ? getWinningLine(
            newBoard,
            availableRow,
            column,
            state.currentPlayer,
            winCondition
          ) || undefined
        : undefined,
      isGameOver: hasWon || isDraw,
      currentPlayer:
        hasWon || isDraw
          ? state.currentPlayer
          : switchPlayer(state.currentPlayer),
    };
  }

  getGame(gameId: string): GameState {
    return this.games[gameId] || this.createInitialState(gameId);
  }

  async getBotMove(
    moves: number[],
    difficulty: string,
    rows: number,
    columns: number,
    winCondition: number
  ): Promise<number | null> {
    await this.ensureWasmInit();
    if (!this.inited) return null;
    try {
      const column = await compute_move(
        new Uint8Array(moves),
        difficulty,
        rows,
        columns,
        winCondition
      );
      return typeof column === "number" && column >= 0 && column < columns
        ? column
        : null;
    } catch (err) {
      console.error("GameEngine.getBotMove error:", err);
      return null;
    }
  }

  ensureGameExists(gameId: string) {
    if (!this.setGames || gameId in this.games) return;
    const initialState = this.createInitialState(gameId);
    this.setGames((prev) => {
      const prevMap = prev ?? {};
      if (gameId in prevMap) return prevMap;
      const next = { [gameId]: initialState, ...prevMap };
      const keys = Object.keys(next);
      if (keys.length > 10) {
        keys.slice(10).forEach((k) => delete next[k]);
      }
      return next;
    });
  }

  updateGame(gameId: string, updater: (state: GameState) => GameState) {
    if (!this.setGames) return;
    this.setGames((prev) => {
      if (!prev || !(gameId in prev)) return prev;
      return { ...prev, [gameId]: updater(prev[gameId]) };
    });
  }

  setGamesStorage(games: { [key: string]: GameState }) {
    this.games = games;
  }
}
