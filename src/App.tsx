import { lazy } from "react";
const GameBoard = lazy(() => import("@widgets/GameBoard/GameBoard"));

function App() {
  return (
    <div className="centered">
      <h1>Connect Four</h1>
      <GameBoard rows={6} columns={7} />
    </div>
  );
}

export default App;
