import React, { memo } from "react";
import styles from "./GameSettings.module.css";
import Toggle from "@shared/ui/Toggle/Toggle";
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
      <div className={styles.settings}>
        <Toggle
          isOn={animationType === "fall"}
          onToggle={handleToggle}
          label="Animation Type"
          leftLabel="Drop"
          rightLabel="Fall"
        />
      </div>
    );
  }
);

GameSettings.displayName = "GameSettings";

export default GameSettings;
