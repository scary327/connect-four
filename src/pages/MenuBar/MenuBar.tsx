import React from "react";
import s from "./MenuBar.module.css";
import Button from "@shared/ui/Button/Button";
import { useNavigate } from "react-router-dom";

const MENU_ITEMS = [
  { label: "PLAY", link: "/game" },
  { label: "SETTINGS", link: "/settings" },
  { label: "LOCAL HISTORY", link: "/history" },
];

const MenuBar = () => {
  const navigate = useNavigate();

  return (
    <div className="centered">
      <h1>Menu</h1>
      <ul className={s.menuList}>
        {MENU_ITEMS.map((item) => (
          <Button
            key={item.label}
            onClick={() => navigate(item.link)}
            className={s.menuButton}
            size="extraLarge"
          >
            {item.label}
          </Button>
        ))}
      </ul>
    </div>
  );
};

export default MenuBar;
