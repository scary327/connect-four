import type { RouteObject } from "react-router-dom";
import { URLS } from "./urls";
import { lazy } from "react";
import NotFound from "@app/components/NotFound/NotFound";
import { Loader } from "@shared/ui/Loader/Loader";
import Typography from "@shared/ui/Typography/Typography";

const GameBoard = lazy(() => import("../../pages/GameBoard/GameBoard"));
const MenuBar = lazy(() => import("../../pages/MenuBar/MenuBar"));
const Settings = lazy(() => import("../../pages/Settings/Settings"));

export const PublicRoutes: RouteObject[] = [
  {
    path: URLS.MENU,
    element: <MenuBar />,
  },
  {
    path: URLS.GAME,
    element: (
      <div className="centered">
        <Typography.H1>Connect Four</Typography.H1>
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
    element: <Settings />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
