import React from "react";
import Toggle from "@shared/ui/Toggle/Toggle";
import { useTheme } from "@shared/context/useTheme";
import Typography from "@shared/ui/Typography/Typography";
import SettingSection from "@shared/ui/SettingSection/SettingSection";
import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import type { AnimationType } from "@shared/hooks/useGameBoard";

const Settings: React.FC = () => {
  const { isLight, toggleTheme } = useTheme();
  const [animationType, setAnimationType] = useLocalStorage<AnimationType>(
    "connect4-animation-type",
    "fall"
  );

  const handleToggle = () => {
    setAnimationType(animationType === "fall" ? "drop" : "fall");
  };

  return (
    <div className="centered">
      <Typography.H1>Settings</Typography.H1>

      <SettingSection
        title="Appearance"
        description="Theme preference is saved to localStorage."
      >
        <Toggle
          isOn={isLight}
          onToggle={toggleTheme}
          leftLabel="Dark"
          rightLabel="Light"
          aria-label="Toggle theme"
          label="Theme"
        />
      </SettingSection>
      <SettingSection
        title="Animation"
        description="Choose how new chips appear on the board."
      >
        <Toggle
          isOn={animationType === "fall"}
          onToggle={handleToggle}
          label="Animation Type"
          leftLabel="Drop"
          rightLabel="Fall"
        />
      </SettingSection>
    </div>
  );
};

export default Settings;
