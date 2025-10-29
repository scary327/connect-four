import React from "react";
import Toggle from "@shared/ui/Toggle/Toggle";
import Select from "@shared/ui/Select/Select";
import type { SelectOption } from "@shared/ui/Select/Select";
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
import { SUPPORTED_LANGUAGES } from "@shared/constants";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation("settings");
  const { isLight, toggleTheme } = useTheme();
  const [animationType, setAnimationType] = useLocalStorage<AnimationType>(
    LOCALSTORAGE_ANIMATION_TYPE,
    "fall"
  );
  const [language, setLanguage] = useLocalStorage<"ru" | "en" | "es">(
    LOCALSTORAGE_LANGUAGE,
    "en" as const
  );

  const handleToggle = () => {
    setAnimationType(animationType === "fall" ? "drop" : "fall");
  };

  return (
    <div className="centered">
      <Typography.H1>{t("title")}</Typography.H1>

      <SettingSection
        title={t("appearance.title")}
        description={t("appearance.description")}
      >
        <Toggle
          isOn={isLight}
          onToggle={toggleTheme}
          leftLabel={t("appearance.dark")}
          rightLabel={t("appearance.light")}
          aria-label={t("appearance.theme")}
          label={t("appearance.theme")}
        />
      </SettingSection>

      <SettingSection
        title={t("animation.title")}
        description={t("animation.description")}
      >
        <Toggle
          isOn={animationType === "fall"}
          onToggle={handleToggle}
          label={t("animation.label")}
          leftLabel={t("animation.drop")}
          rightLabel={t("animation.fall")}
        />
      </SettingSection>

      <SettingSection
        title={t("language.title")}
        description={t("language.description")}
      >
        <Select
          value={language}
          onChange={(v) => {
            setLanguage(v as "ru" | "en" | "es");
            i18n.changeLanguage(v);
          }}
          options={SUPPORTED_LANGUAGES.map(
            (lng) =>
              ({
                value: lng,
                label:
                  lng === "en"
                    ? t("language.english")
                    : lng === "ru"
                    ? t("language.russian")
                    : t("language.spanish"),
              } as SelectOption<string>)
          )}
          label={t("language.title")}
          placeholder={t("language.title")}
        />
      </SettingSection>
    </div>
  );
};

export default Settings;
