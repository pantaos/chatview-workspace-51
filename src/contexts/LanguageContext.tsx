
import React, { createContext, useContext, useState, ReactNode } from "react";

export type LanguageType = "en" | "de" | "fr" | "es" | "zh";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export interface LanguageContextType {
  currentLanguage: LanguageType;
  changeLanguage: (lang: LanguageType) => void;
  translate: (key: string) => string;
  languages: { code: LanguageType; name: string }[];
}

const translations: Translations = {
  en: {
    "dashboard.workflows": "Workflows",
    "dashboard.all": "All",
    "dashboard.recent": "Recent",
    "dashboard.favorites": "Favorites",
    "dashboard.newChatWorkflow": "New Workflow",
    "dashboard.workflowSettings": "Workflow Settings",
    "dashboard.creativityLevel": "Set the creativity level for AI responses:",
    "dashboard.conservative": "Conservative",
    "dashboard.creative": "Creative",
    "dashboard.recentHistory": "Recent History",
    "app.viewAll": "View All",
    "app.settings": "Settings",
    "app.logout": "Logout",
    "app.profile": "Profile"
  },
  de: {
    "dashboard.workflows": "Arbeitsabläufe",
    "dashboard.all": "Alle",
    "dashboard.recent": "Aktuell",
    "dashboard.favorites": "Favoriten",
    "dashboard.newChatWorkflow": "Neuer Arbeitsablauf",
    "dashboard.workflowSettings": "Arbeitsablauf-Einstellungen",
    "dashboard.creativityLevel": "Stellen Sie den Kreativitätsgrad für KI-Antworten ein:",
    "dashboard.conservative": "Konservativ",
    "dashboard.creative": "Kreativ",
    "dashboard.recentHistory": "Letzte Aktivitäten",
    "app.viewAll": "Alle anzeigen",
    "app.settings": "Einstellungen",
    "app.logout": "Abmelden",
    "app.profile": "Profil"
  }
};

const languages = [
  { code: "en" as LanguageType, name: "English" },
  { code: "de" as LanguageType, name: "Deutsch" },
  { code: "fr" as LanguageType, name: "Français" },
  { code: "es" as LanguageType, name: "Español" },
  { code: "zh" as LanguageType, name: "中文" }
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>("en");

  const changeLanguage = (lang: LanguageType) => {
    setCurrentLanguage(lang);
  };

  const translate = (key: string): string => {
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      return translations[currentLanguage][key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage, 
      translate,
      languages 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
