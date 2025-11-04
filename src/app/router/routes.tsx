import type { RouteObject } from "react-router-dom";
import { URLS } from "./urls";
import { lazy } from "react";
import NotFound from "@app/components/NotFound/NotFound";

const MenuBar = lazy(() => import("../../pages/MenuBar/MenuBar"));
const Settings = lazy(() => import("../../pages/Settings/Settings"));
const GameSession = lazy(() => import("../../pages/GameBoard/GameSession"));
const GameCreator = lazy(() => import("../../pages/GameCreator/GameCreator"));
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
    element: <GameCreator />,
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
