"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";

export function LanguageToggle() {
  const [lang, setLang] = useState<"pt" | "en">("pt");

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as "pt" | "en";
    if (saved && (saved === "pt" || saved === "en")) {
      setLang(saved);
      document.cookie = `app_lang=${saved}; path=/`;
    }
  }, []);

  const toggleLanguage = (newLang: "pt" | "en") => {
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
        className="px-2 py-0.5 text-[11px] h-6"
      >
        PT
      </Button>
      <Button
        variant={lang === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => toggleLanguage("en")}
        className="px-2 py-0.5 text-[11px] h-6"
      >
        EN
      </Button>
    </div>
  );
}
