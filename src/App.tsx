import "./App.css";
import GameBoard from "./components/GameBoard/GameBoard";

function App() {
  return (
    <div className="centered">
      <h1>Connect Four</h1>
      <GameBoard rows={6} columns={7} />
    </div>
  );
}

export default App;
