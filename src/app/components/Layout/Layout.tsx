import React, { memo } from "react";
import { useLocation, useNavigate, Outlet, matchPath } from "react-router-dom";
import styles from "./Layout.module.css";
import { URLS } from "@app/router/urls";
import Button from "@shared/ui/Button/Button";
import Typography from "@shared/ui/Typography/Typography";

const pageTitles: Record<keyof typeof URLS, string> = {
  MENU: "MENU",
  GAME: "GAME",
  HISTORY: "HISTORY",
  SETTINGS: "SETTINGS",
  GAME_SESSION: "GAME SESSION",
};

const Header: React.FC<{
  isHome: boolean;
  title: string;
  onBack: () => void;
}> = memo(({ isHome, title, onBack }) => {
  return (
    <header className={`${styles.header} ${isHome ? styles.hidden : ""}`}>
      <Button
        variant="secondary"
        size="small"
        onClick={onBack}
        className={styles.backButton}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Menu
      </Button>
      <Typography.H2 className={styles.pageTitle}>{title}</Typography.H2>
      <div className={styles.spacer} />
    </header>
  );
});

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeKey = (Object.keys(URLS) as Array<keyof typeof URLS>).find((key) =>
    Boolean(matchPath(URLS[key], location.pathname))
  ) as keyof typeof URLS | undefined;

  const isHomePage = location.pathname === URLS.MENU;
  const pageTitle = routeKey ? pageTitles[routeKey] : pageTitles.MENU;

  const handleBack = () => navigate(-1);

  return (
    <div className={styles.layout}>
      <Header isHome={isHomePage} title={pageTitle} onBack={handleBack} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
