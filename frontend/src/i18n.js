import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import englishTranslations from "../public/locales/english/translation.json";
import hindiTranslations from "../public/locales/hindi/translation.json";
import spanishTranslations from "../public/locales/spanish/translation.json";
import frenchTranslations from "../public/locales/french/translation.json";
import bengaliTranslations from "../public/locales/bengali/translation.json";
import tamilTranslations from "../public/locales/Tamil/translation.json";
import portugeeseTranslations from "../public/locales/portugeese/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(Backend)
  .init({
    debug: true,
    fallbackLng: "en",
    returnObjects: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: { translation: englishTranslations },
      hi: { translation: hindiTranslations },
      es: { translation: spanishTranslations },
      fr: { translation: frenchTranslations },
      bn: { translation: bengaliTranslations },
      ta: { translation: tamilTranslations },
      pt: { translation: portugeeseTranslations },
    },
  });

export default i18n;
