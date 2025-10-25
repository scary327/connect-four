import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { Loader } from "@shared/ui/Loader/Loader";
import { ThemeProvider } from "@shared/context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
