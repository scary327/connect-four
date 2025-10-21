import { createBrowserRouter } from "react-router-dom";
import { PublicRoutes } from "./routes";
import ErrorBoundary from "@app/components/ErrorBoundary/ErrorBoundary";
import Layout from "@app/components/Layout/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    children: PublicRoutes,
    errorElement: <ErrorBoundary />,
    element: <Layout />,
  },
]);
