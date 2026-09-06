"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { Language } from "../../lib/i18n/translations";

export function LanguageToggle() {
  const [lang, setLang] = useState<Language>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as Language;
    if (saved && (saved === "pt" || saved === "en" || saved === "fr")) {
      setLang(saved);
      document.cookie = `app_lang=${saved}; path=/`;
    }
  }, []);

  const toggleLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
    document.cookie = `app_lang=${newLang}; path=/`;
    window.dispatchEvent(new Event("languageChange"));
  };

  return (
    <div className="flex items-center space-x-1 border border-slate-800 rounded p-0.5 bg-[#080d19]">
      <Button
        variant={lang === "pt" ? "default" : "ghost"}
        size="sm"
        onClick={() => toggleLanguage("pt")}
        className="px-2 py-0.5 text-[11px] h-6 font-bold"
      >
        PT
      </Button>
      <Button
        variant={lang === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => toggleLanguage("en")}
        className="px-2 py-0.5 text-[11px] h-6 font-bold"
      >
        EN
      </Button>
      <Button
        variant={lang === "fr" ? "default" : "ghost"}
        size="sm"
        onClick={() => toggleLanguage("fr")}
        className="px-2 py-0.5 text-[11px] h-6 font-bold"
      >
        FR
      </Button>
    </div>
  );
}
