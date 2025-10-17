import React from "react";
import styles from "./GameBoard.module.css";

interface GameBoardProps {
  rows: number;
  columns: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ rows, columns }) => {
  return (
    <div
      className={styles.board}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows * columns }).map((_, index) => (
        <div key={index} className={styles.cell} />
      ))}
    </div>
  );
};

export default GameBoard;
