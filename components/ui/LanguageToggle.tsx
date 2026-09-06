"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { Language } from "../../lib/i18n/translations";

export function LanguageToggle() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === "undefined") return "pt";
    const saved = localStorage.getItem("app_lang") as Language;
    if (saved && (saved === "pt" || saved === "en" || saved === "fr")) {
      return saved;
    }
    return "pt";
  });

  useEffect(() => {
    document.cookie = `app_lang=${lang}; path=/`;
  }, [lang]);

  const toggleLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
    document.cookie = `app_lang=${newLang}; path=/`;
    window.dispatchEvent(new Event("languageChange"));
  };

  return (
    <div className="flex items-center space-x-1 border border-slate-800 rounded p-0.5 bg-[#050914] font-mono">
      <Button
        variant={lang === "pt" ? "default" : "ghost"}
        size="sm"
        onClick={() => toggleLanguage("pt")}
        className={`px-1.5 py-0.5 text-[10px] h-5 font-bold rounded ${lang === "pt" ? "bg-sky-700 text-white" : "text-slate-400 hover:text-white"}`}
      >
        PT
      </Button>
      <Button
        variant={lang === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => toggleLanguage("en")}
        className={`px-1.5 py-0.5 text-[10px] h-5 font-bold rounded ${lang === "en" ? "bg-sky-700 text-white" : "text-slate-400 hover:text-white"}`}
      >
        EN
      </Button>
      <Button
        variant={lang === "fr" ? "default" : "ghost"}
        size="sm"
        onClick={() => toggleLanguage("fr")}
        className={`px-1.5 py-0.5 text-[10px] h-5 font-bold rounded ${lang === "fr" ? "bg-sky-700 text-white" : "text-slate-400 hover:text-white"}`}
      >
        FR
      </Button>
    </div>
  );
}
