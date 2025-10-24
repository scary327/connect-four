import { Suspense, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { Loader } from "@shared/ui/Loader/Loader";
import { ThemeProvider } from "@shared/context/ThemeContext";

function App() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  // dev-only: log every render with a count
  console.log(`[App] render #${renderCount.current}`);

  return (
    <ThemeProvider>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
