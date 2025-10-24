import React from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { URLS } from "@app/router/urls";
import Button from "@shared/ui/Button/Button";
import Typography from "@shared/ui/Typography/Typography";

const pageTitles: Record<keyof typeof URLS, string> = {
  MENU: "Главная",
  GAME: "Игра",
  HISTORY: "История",
  SETTINGS: "Настройки",
};

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeKey = (Object.keys(URLS) as Array<keyof typeof URLS>).find(
    (key) => URLS[key] === location.pathname
  ) as keyof typeof URLS | undefined;

  const isHomePage = location.pathname === URLS.MENU;
  const pageTitle = routeKey ? pageTitles[routeKey] : "Страница";

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.layout}>
      <header className={`${styles.header} ${isHomePage ? styles.hidden : ""}`}>
        <Button
          variant="secondary"
          size="small"
          onClick={handleBack}
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
        <Typography.H2 className={styles.pageTitle}>{pageTitle}</Typography.H2>
        <div className={styles.spacer} />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
