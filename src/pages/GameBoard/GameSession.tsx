import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import Typography from "@shared/ui/Typography/Typography";
import type { GameMode } from "src/types/game";
import GameBoard from "./GameBoard";

interface GameState {
  mode: GameMode;
  rows: number;
  columns: number;
  winCondition: number;
}

const GameSession: React.FC = () => {
  //   const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as GameState | null;

  if (!state) {
    return <Navigate to="/game" replace />;
  }

  const { rows, columns, winCondition, mode } = state;

  return (
    <div className="centered">
      <Typography.H1>Connect Four</Typography.H1>
      <GameBoard
        rows={rows}
        columns={columns}
        winCondition={winCondition}
        mode={mode}
      />
    </div>
  );
};

export default GameSession;
