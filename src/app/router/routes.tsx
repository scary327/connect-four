import type { RouteObject } from "react-router-dom";
import { URLS } from "./urls";
import { lazy } from "react";
import NotFound from "@app/components/NotFound/NotFound";

const MenuBar = lazy(() => import("../../pages/MenuBar/MenuBar"));
const Settings = lazy(() => import("../../pages/Settings/Settings"));
const GameSession = lazy(() => import("../../pages/GameBoard/GameSession"));
const CreateGame = lazy(() => import("../../pages/CreateGame/CreateGame"));
const LocalHistory = lazy(
  () => import("../../pages/LocalHistory/LocalHistory")
);

export const PublicRoutes: RouteObject[] = [
  {
    path: URLS.MENU,
    element: <MenuBar />,
  },
  {
    path: URLS.GAME,
    element: <CreateGame />,
  },
  {
    path: URLS.GAME_SESSION,
    element: <GameSession />,
  },
  {
    path: URLS.HISTORY,
    element: <LocalHistory />,
  },
  {
    path: URLS.SETTINGS,
    element: <Settings />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
