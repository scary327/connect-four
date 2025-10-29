import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { SUPPORTED_LANGUAGES } from "@shared/constants";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: import.meta.env.DEV,
    supportedLngs: SUPPORTED_LANGUAGES,
    load: "languageOnly",
    ns: [
      "settings",
      "layout",
      "menu",
      "history",
      "game",
      "create",
      "components",
    ],
    defaultNS: "settings",
    interpolation: { escapeValue: false },
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
