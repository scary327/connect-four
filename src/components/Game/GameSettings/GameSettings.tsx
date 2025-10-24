import React, { memo } from "react";
// styles replaced by SettingSection visuals; keep module file for backward-compat if needed
import "./GameSettings.module.css";
import Toggle from "@shared/ui/Toggle/Toggle";
import SettingSection from "@shared/ui/SettingSection/SettingSection";
import type { AnimationType } from "@shared/hooks/useGameBoard";

interface GameSettingsProps {
  animationType: AnimationType;
  onAnimationTypeChange: (type: AnimationType) => void;
}

const GameSettings: React.FC<GameSettingsProps> = memo(
  ({ animationType, onAnimationTypeChange }) => {
    const handleToggle = () => {
      onAnimationTypeChange(animationType === "fall" ? "drop" : "fall");
    };

    return (
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
    );
  }
);

GameSettings.displayName = "GameSettings";

export default GameSettings;
