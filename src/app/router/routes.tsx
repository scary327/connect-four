import type { RouteObject } from "react-router-dom";
import { URLS } from "./urls";
import { lazy } from "react";
import NotFound from "@app/NotFound/NotFound";
import { Loader } from "@shared/ui/Loader/Loader";

const GameBoard = lazy(() => import("../../widgets/GameBoard/GameBoard"));
const MenuBar = lazy(() => import("../../widgets/MenuBar/MenuBar"));

export const PublicRoutes: RouteObject[] = [
  {
    path: URLS.MENU,
    element: <MenuBar />,
  },
  {
    path: URLS.GAME,
    element: (
      <div className="centered">
        <h1>Connect Four</h1>
        <GameBoard rows={6} columns={7} />
      </div>
    ),
  },
  {
    path: URLS.HISTORY,
    element: <Loader />,
  },
  {
    path: URLS.SETTINGS,
    element: <>Settings Page</>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
