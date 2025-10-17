import type { RouteObject } from "react-router-dom";
import { URLS } from "./urls";
import { lazy, Suspense } from "react";
import NotFound from "@app/NotFound/NotFound";

const GameBoard = lazy(() => import("../../widgets/GameBoard/GameBoard"));

export const PublicRoutes: RouteObject[] = [
  {
    path: URLS.MENU,
    element: <>Menu Page</>,
  },
  {
    path: URLS.GAME,
    element: (
      <Suspense fallback={<>Loading...</>}>
        <div className="centered">
          <h1>Connect Four</h1>
          <GameBoard rows={6} columns={7} />
        </div>
      </Suspense>
    ),
  },
  {
    path: URLS.HISTORY,
    element: <>History Page</>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
