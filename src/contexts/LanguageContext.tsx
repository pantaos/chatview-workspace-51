import React, { createContext, useContext, useState, ReactNode } from "react";

export type LanguageType = "en" | "de" | "fr" | "es";

export interface LanguageContextType {
  language: LanguageType;
  changeLanguage: (lang: LanguageType) => void;
  translate: (key: string) => string;
}

// Translations map
const translations: Record<LanguageType, Record<string, string>> = {
  en: {
    "app.viewAll": "View All",
    "dashboard.all": "All",
    "dashboard.recent": "Recent",
    "dashboard.favorites": "Favorites",
    "dashboard.workflows": "Workflows",
    "dashboard.recentHistory": "Recent History",
    "dashboard.workflowSettings": "Workflow Settings",
    "dashboard.creativityLevel": "Adjust the creativity level of your responses",
    "dashboard.conservative": "Conservative",
    "dashboard.creative": "Creative",
    "dashboard.newChatWorkflow": "New Workflow",
    // ... other translations
  },
  de: {
    "app.viewAll": "Alle anzeigen",
    "dashboard.all": "Alle",
    "dashboard.recent": "Kürzlich",
    "dashboard.favorites": "Favoriten",
    "dashboard.workflows": "Arbeitsabläufe",
    "dashboard.recentHistory": "Kürzliche Aktivitäten",
    "dashboard.workflowSettings": "Arbeitsablauf-Einstellungen",
    "dashboard.creativityLevel": "Passen Sie den Kreativitätsgrad Ihrer Antworten an",
    "dashboard.conservative": "Konservativ",
    "dashboard.creative": "Kreativ",
    "dashboard.newChatWorkflow": "Neuer Arbeitsablauf",
    // ... other translations
  },
  fr: {
    "app.viewAll": "Voir tout",
    "dashboard.all": "Tous",
    "dashboard.recent": "Récents",
    "dashboard.favorites": "Favoris",
    "dashboard.workflows": "Workflows",
    "dashboard.recentHistory": "Historique récent",
    "dashboard.workflowSettings": "Paramètres du workflow",
    "dashboard.creativityLevel": "Ajustez le niveau de créativité de vos réponses",
    "dashboard.conservative": "Conservateur",
    "dashboard.creative": "Créatif",
    "dashboard.newChatWorkflow": "Nouveau Workflow",
    // ... other translations
  },
  es: {
    "app.viewAll": "Ver todo",
    "dashboard.all": "Todos",
    "dashboard.recent": "Recientes",
    "dashboard.favorites": "Favoritos",
    "dashboard.workflows": "Flujos de trabajo",
    "dashboard.recentHistory": "Historial reciente",
    "dashboard.workflowSettings": "Configuración del flujo de trabajo",
    "dashboard.creativityLevel": "Ajuste el nivel de creatividad de sus respuestas",
    "dashboard.conservative": "Conservador",
    "dashboard.creative": "Creativo",
    "dashboard.newChatWorkflow": "Nuevo flujo de trabajo",
    // ... other translations
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  changeLanguage: () => {},
  translate: () => ""
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>("en");

  const changeLanguage = (lang: LanguageType) => {
    setLanguage(lang);
  };

  const translate = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};
