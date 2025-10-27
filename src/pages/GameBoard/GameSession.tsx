import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import type { GameMode } from "src/types/game";
import GameBoard from "./GameBoard";

interface GameState {
  mode: GameMode;
  rows: number;
  columns: number;
  winCondition: number;
  difficulty?: "easy" | "medium" | "insane";
}

const GameSession: React.FC = () => {
  const location = useLocation();
  const state = location.state as GameState | null;

  if (!state) {
    return <Navigate to="/game" replace />;
  }

  const { rows, columns, winCondition, mode, difficulty = "easy" } = state;

  return (
    <div className="centered">
      <GameBoard
        rows={rows}
        columns={columns}
        winCondition={winCondition}
        mode={mode}
        difficulty={difficulty}
      />
    </div>
  );
};

export default GameSession;
