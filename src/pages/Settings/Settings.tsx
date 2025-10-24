import React from "react";
import s from "./Settings.module.css";
import Toggle from "@shared/ui/Toggle/Toggle";
import { useTheme } from "@shared/context/useTheme";
import Typography from "@shared/ui/Typography/Typography";

const Settings: React.FC = () => {
  const { isLight, toggleTheme } = useTheme();

  return (
    <div className="centered">
      <Typography.H1>Settings</Typography.H1>

      <section className={s.section}>
        <Typography.H2 className={s.sectionTitle}>Appearance</Typography.H2>
        <div className={s.row}>
          <Typography.Label className={s.label}>Theme</Typography.Label>
          <div className={s.control}>
            <Toggle
              isOn={isLight}
              onToggle={toggleTheme}
              leftLabel="Dark"
              rightLabel="Light"
              aria-label="Toggle theme"
            />
          </div>
        </div>
        <Typography.Muted className={s.hint}>
          Theme preference is saved to localStorage.
        </Typography.Muted>
      </section>
    </div>
  );
};

export default Settings;
