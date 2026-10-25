"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Lang, DictKey, t as translate, formatPrice as fp, localizedAge as la } from "./i18n";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
  formatPrice: (amount: number) => string;
  localizedAge: (ageGroup: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "bn") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t: (key, vars) => translate(lang, key, vars),
        formatPrice: (amount) => fp(amount, lang),
        localizedAge: (ageGroup) => la(ageGroup, lang),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
