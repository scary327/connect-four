import { lazy, useRef } from "react";

const GameBoard = lazy(() => import("@widgets/GameBoard/GameBoard"));

function App() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  // dev-only: log every render with a count
  // eslint-disable-next-line no-console
  console.log(`[App] render #${renderCount.current}`);

  return (
    <div className="centered">
      <h1>Connect Four</h1>
      <GameBoard rows={6} columns={7} />
    </div>
  );
}

export default App;
