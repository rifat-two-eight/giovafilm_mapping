"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./locales/en.json";
import es from "./locales/es.json";

import { store } from "@/redux/store";
import { baseApi } from "@/redux/api/baseApi";

export type Language = "es" | "en";

type TranslationDictionary = typeof en;

const translations: Record<Language, any> = { en, es };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_language") as Language;
    if (savedLang === "en" || savedLang === "es") {
      setLanguageState(savedLang);
      document.documentElement.lang = savedLang;
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "app_language" && (e.newValue === "en" || e.newValue === "es")) {
        setLanguageState(e.newValue as Language);
        document.documentElement.lang = e.newValue;
        try {
          store.dispatch(baseApi.util.resetApiState());
        } catch {
          // Ignore if store not ready
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
    document.documentElement.lang = lang;
    try {
      store.dispatch(baseApi.util.resetApiState());
    } catch {
      // Ignore if store not ready
    }
  };

  const t = (keyPath: string, fallback?: string): string => {
    if (!keyPath) return fallback || "";
    const keys = keyPath.split(".");
    let result: any = translations[language];

    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key];
      } else {
        result = undefined;
        break;
      }
    }

    if (typeof result === "string" && result.trim() !== "") {
      return result;
    }

    // Fallback to English dictionary if current language is not English
    if (language !== "en") {
      let fallbackResult: any = translations["en"];
      for (const fk of keys) {
        if (fallbackResult && typeof fallbackResult === "object" && fk in fallbackResult) {
          fallbackResult = fallbackResult[fk];
        } else {
          fallbackResult = undefined;
          break;
        }
      }
      if (typeof fallbackResult === "string" && fallbackResult.trim() !== "") {
        return fallbackResult;
      }
    }

    if (fallback !== undefined) {
      return fallback;
    }

    // Return empty string instead of raw dot-notation keypath
    // so that expressions like `t("foo.bar") || "Fallback"` gracefully evaluate to the fallback!
    return "";
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
