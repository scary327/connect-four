import s from "./MenuBar.module.css";
import Button from "@shared/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import Typography from "@shared/ui/Typography/Typography";
import { useTranslation } from "react-i18next";

const MENU_ITEMS = [
  { key: "play", link: "/game" },
  { key: "settings", link: "/settings" },
  { key: "localHistory", link: "/history" },
];

const MenuBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("menu");

  return (
    <div className="centered">
      <Typography.H1>{t("title")}</Typography.H1>
      <ul className={s.menuList}>
        {MENU_ITEMS.map((item) => (
          <Button
            key={item.key}
            onClick={() => navigate(item.link)}
            className={s.menuButton}
            size="extraLarge"
          >
            {t(`items.${item.key}`)}
          </Button>
        ))}
      </ul>
    </div>
  );
};

export default MenuBar;
