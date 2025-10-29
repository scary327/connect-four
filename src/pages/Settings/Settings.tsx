import React from "react";
import Toggle from "@shared/ui/Toggle/Toggle";
import { useTheme } from "@shared/context/useTheme";
import Typography from "@shared/ui/Typography/Typography";
import SettingSection from "@shared/ui/SettingSection/SettingSection";
import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
import type { AnimationType } from "@shared/hooks/useGameBoard";
import {
  LOCALSTORAGE_ANIMATION_TYPE,
  LOCALSTORAGE_LANGUAGE,
} from "@shared/constants/localStorageNames";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isLight, toggleTheme } = useTheme();
  const [animationType, setAnimationType] = useLocalStorage<AnimationType>(
    LOCALSTORAGE_ANIMATION_TYPE,
    "fall"
  );
  const [language, setLanguage] = useLocalStorage<"ru" | "en">(
    LOCALSTORAGE_LANGUAGE,
    "en" as const
  );

  const handleToggle = () => {
    setAnimationType(animationType === "fall" ? "drop" : "fall");
  };

  const handleLanguageToggle = () => {
    const newLang = language === "en" ? "ru" : "en";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const isRussian = language === "ru";

  return (
    <div className="centered">
      <Typography.H1>{t("settings.title")}</Typography.H1>

      <SettingSection
        title={t("settings.appearance.title")}
        description={t("settings.appearance.description")}
      >
        <Toggle
          isOn={isLight}
          onToggle={toggleTheme}
          leftLabel={t("settings.appearance.dark")}
          rightLabel={t("settings.appearance.light")}
          aria-label={t("settings.appearance.theme")}
          label={t("settings.appearance.theme")}
        />
      </SettingSection>

      <SettingSection
        title={t("settings.animation.title")}
        description={t("settings.animation.description")}
      >
        <Toggle
          isOn={animationType === "fall"}
          onToggle={handleToggle}
          label={t("settings.animation.label")}
          leftLabel={t("settings.animation.drop")}
          rightLabel={t("settings.animation.fall")}
        />
      </SettingSection>

      <SettingSection
        title={t("settings.language.title")}
        description={t("settings.language.description")}
      >
        <Toggle
          isOn={isRussian}
          onToggle={handleLanguageToggle}
          leftLabel={t("settings.language.english")}
          rightLabel={t("settings.language.russian")}
          aria-label="Toggle language"
          label={t("settings.language.title")}
        />
      </SettingSection>
    </div>
  );
};

export default Settings;
