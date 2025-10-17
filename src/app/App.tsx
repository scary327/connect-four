import { useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";

function App() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  // dev-only: log every render with a count
  // eslint-disable-next-line no-console
  console.log(`[App] render #${renderCount.current}`);

  return <RouterProvider router={router} />;
}

export default App;
