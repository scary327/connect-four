import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateGame.module.css";
import Typography from "@shared/ui/Typography/Typography";
import type { GameMode } from "src/types/game";
import Button from "@shared/ui/Button/Button";

const CreateGame: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<GameMode>("local");
  const [rows, setRows] = useState(6);
  const [columns, setColumns] = useState(7);
  const [winCondition, setWinCondition] = useState(4);

  const handleStartGame = () => {
    // Generate a game ID (could use uuid or timestamp)
    const gameId = Date.now().toString();

    // Pass parameters via state
    navigate(`/game/${gameId}`, {
      state: {
        mode,
        rows,
        columns,
        winCondition,
      },
    });
  };

  return (
    <div className="centered">
      <Typography.H1>Create Game</Typography.H1>

      <div className={styles.createGame}>
        {/* Game mode */}
        <div className={styles.section}>
          <Typography.H2 className={styles.sectionTitle}>
            Game mode
          </Typography.H2>
          <div className={styles.modeSwitch}>
            <button
              className={`${styles.modeButton} ${
                mode === "local" ? styles.active : ""
              }`}
              onClick={() => setMode("local")}
            >
              <Typography.ButtonText>2 Players</Typography.ButtonText>
            </button>
            <button
              className={`${styles.modeButton} ${
                mode === "bot" ? styles.active : ""
              }`}
              onClick={() => setMode("bot")}
              disabled
              title="Скоро..."
            >
              <Typography.ButtonText>Vs Bot</Typography.ButtonText>
            </button>
          </div>
        </div>

        {/* Board size */}
        <div className={styles.section}>
          <Typography.H2 className={styles.sectionTitle}>
            Board size
          </Typography.H2>
          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <Typography.Label>Rows:</Typography.Label>
              <input
                type="number"
                min={4}
                max={10}
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                className={styles.numberInput}
              />
            </div>
            <div className={styles.inputField}>
              <Typography.Label>Columns:</Typography.Label>
              <input
                type="number"
                min={4}
                max={10}
                value={columns}
                onChange={(e) => setColumns(Number(e.target.value))}
                className={styles.numberInput}
              />
            </div>
          </div>
        </div>

        {/* Win condition */}
        <div className={styles.section}>
          <Typography.H2 className={styles.sectionTitle}>
            Pieces to win
          </Typography.H2>
          <div className={styles.inputField}>
            <input
              type="number"
              min={3}
              max={Math.min(rows, columns)}
              value={winCondition}
              onChange={(e) => setWinCondition(Number(e.target.value))}
              className={styles.numberInput}
            />
          </div>
        </div>

        {/* Start button */}
        <Button onClick={handleStartGame} variant="primary">
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default CreateGame;
