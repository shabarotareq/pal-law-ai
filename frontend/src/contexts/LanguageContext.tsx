"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Lang = "ar" | "en";
type LanguageContextType = {
  lang: Lang;
  toggleLanguage: () => void;
  setLang: (l: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ar";
    const saved = localStorage.getItem("lang");
    return saved === "en" ? "en" : "ar";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    // optional: update <html lang=...> if you want:
    if (typeof document !== "undefined")
      document.documentElement.lang = lang === "ar" ? "ar" : "en";
  }, [lang]);

  const toggleLanguage = () => setLang((p) => (p === "ar" ? "en" : "ar"));

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
