import { Suspense, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { Loader } from "@shared/ui/Loader/Loader";

function App() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  // dev-only: log every render with a count
  // eslint-disable-next-line no-console
  console.log(`[App] render #${renderCount.current}`);

  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
