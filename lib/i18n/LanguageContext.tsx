"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./locales/en.json";
import es from "./locales/es.json";

export type Language = "es" | "en";

type TranslationDictionary = typeof en;

const translations: Record<Language, any> = { en, es };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_language") as Language;
    if (savedLang === "en" || savedLang === "es") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
    document.documentElement.lang = lang;
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let result: any = translations[language];

    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key];
      } else {
        // Fallback to English dictionary
        let fallbackResult: any = translations["en"];
        for (const fk of keys) {
          if (fallbackResult && typeof fallbackResult === "object" && fk in fallbackResult) {
            fallbackResult = fallbackResult[fk];
          } else {
            return keyPath;
          }
        }
        return typeof fallbackResult === "string" ? fallbackResult : keyPath;
      }
    }

    return typeof result === "string" ? result : keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
