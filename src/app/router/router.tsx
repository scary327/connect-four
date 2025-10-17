import { createBrowserRouter } from "react-router-dom";
import { PublicRoutes } from "./routes";
import ErrorBoundary from "@app/ErrorBoundary/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    children: PublicRoutes,
    errorElement: <ErrorBoundary />,
  },
]);
