import React from "react";
import Toggle from "@shared/ui/Toggle/Toggle";
import { useTheme } from "@shared/context/useTheme";
import Typography from "@shared/ui/Typography/Typography";
import GameSettings from "@components/Game/GameSettings/GameSettings";
import SettingSection from "@shared/ui/SettingSection/SettingSection";
import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import type { AnimationType } from "@shared/hooks/useGameBoard";

const Settings: React.FC = () => {
  const { isLight, toggleTheme } = useTheme();
  const [animationType, setAnimationType] = useLocalStorage<AnimationType>(
    "connect4-animation-type",
    "fall"
  );

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
      <GameSettings
        animationType={animationType}
        onAnimationTypeChange={setAnimationType}
      />
    </div>
  );
};

export default Settings;
