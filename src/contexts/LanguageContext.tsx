import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "de";

interface LanguageContextType {
  language: Language;
  translate: (key: string) => string;
  switchLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  translate: (key: string) => key,
  switchLanguage: () => {}
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>((localStorage.getItem('language') as Language) || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const translate = (key: string) => {
    return translationMap[language][key] || translationMap["en"][key] || key;
  };

  const switchLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleLanguageSwitch = (lang: Language) => {
    switchLanguage(lang);
  };

  const translationMap: Record<Language, Record<string, string>> = {
    en: {
      'app.title': 'My App',
      'app.greeting': 'Hello',
      'app.farewell': 'Goodbye',
      'app.viewAll': 'View All',
      'menu.editWorkflow': 'Edit Workflow',
      'menu.workflowSettings': 'Workflow Settings',
      'menu.deleteWorkflow': 'Delete Workflow',
      'menu.deleteConfirm': 'Are you sure you want to delete this workflow?',
      'menu.undoDelete': 'Undo',
      'menu.deleteCancelled': 'Delete cancelled',
      'dashboard.workflows': 'Workflows',
      'dashboard.newWorkflow': 'New Workflow',
      'dashboard.recent': 'Recent',
      'dashboard.all': 'All',
      'dashboard.favorites': 'Favorites',
      'dashboard.recentHistory': 'Recent History',
      'dashboard.workflowSettings': 'Workflow Settings',
      'dashboard.creativityLevel': 'Creativity Level',
      'dashboard.conservative': 'Conservative',
      'dashboard.creative': 'Creative',
      'dashboard.newChatWorkflow': 'New Chat-based Workflow',
      'workflow.trendcast': 'Trendcast',
      'workflow.trendcastDesc': 'Turn website content into professional videos',
      'trendcast.uploadLinks': 'Upload Links and Images',
      'trendcast.scriptSummary': 'Script Summary',
      'trendcast.audioFile': 'Audio File with Custom Voice',
      'trendcast.createVideo': 'Create Video',
      'trendcast.preview': 'Preview Video',
      'trendcast.addMoreLinks': 'Add More Links',
      'trendcast.generateScript': 'Generate Script',
      'trendcast.generateAudio': 'Generate Audio',
      'trendcast.generateVideo': 'Generate Video',
      'trendcast.download': 'Download',
      'trendcast.useCaption': 'Use Caption (Caption will be displayed on the video)',
      'trendcast.useSubtitles': 'Use Subtitles (Subtitles will be displayed on the video)',
      'trendcast.approximateLength': 'Approximate Length of Audio',
      'trendcast.link': 'Link',
      'trendcast.caption': 'Caption',
      'trendcast.options': 'Options',
      'minutes': 'Minutes',
      'seconds': 'Seconds',
      'wordCount': 'Word Count',
      'approxAudioLength': 'Approx. Audio Length',
      'generating': 'Generating',
      'generatingAudio': 'Generating Audio',
      'generatingVideo': 'Generating Video',
      'thisCanTakeAMinute': 'This can take a minute',
      'next': 'Next',
      'downloaded': 'Downloaded',
      'createNewTrendcast': 'Create New Trendcast',
    },
    de: {
      'app.title': 'Meine App',
      'app.greeting': 'Hallo',
      'app.farewell': 'Auf Wiedersehen',
      'app.viewAll': 'Alle anzeigen',
      'menu.editWorkflow': 'Workflow bearbeiten',
      'menu.workflowSettings': 'Workflow-Einstellungen',
      'menu.deleteWorkflow': 'Workflow löschen',
      'menu.deleteConfirm': 'Möchten Sie diesen Workflow wirklich löschen?',
      'menu.undoDelete': 'Rückgängig machen',
      'menu.deleteCancelled': 'Löschen abgebrochen',
      'dashboard.workflows': 'Workflows',
      'dashboard.newWorkflow': 'Neuer Workflow',
      'dashboard.recent': 'Kürzlich',
      'dashboard.all': 'Alle',
      'dashboard.favorites': 'Favoriten',
      'dashboard.recentHistory': 'Kürzliche Historie',
      'dashboard.workflowSettings': 'Workflow Einstellungen',
      'dashboard.creativityLevel': 'Kreativitätslevel',
      'dashboard.conservative': 'Konservativ',
      'dashboard.creative': 'Kreativ',
      'dashboard.newChatWorkflow': 'Neuer Chat-basierter Workflow',
      'workflow.trendcast': 'Trendcast',
      'workflow.trendcastDesc': 'Verwandle Webinhalte in professionelle Videos',
      'trendcast.uploadLinks': 'Links und Bilder hochladen',
      'trendcast.scriptSummary': 'Skriptzusammenfassung',
      'trendcast.audioFile': 'Audiodatei mit individueller Stimme',
      'trendcast.createVideo': 'Video erstellen',
      'trendcast.preview': 'Videovorschau',
      'trendcast.addMoreLinks': 'Weitere Links hinzufügen',
      'trendcast.generateScript': 'Skript generieren',
      'trendcast.generateAudio': 'Audio generieren',
      'trendcast.generateVideo': 'Video generieren',
      'trendcast.download': 'Herunterladen',
      'trendcast.useCaption': 'Beschriftung verwenden (Beschriftung wird im Video angezeigt)',
      'trendcast.useSubtitles': 'Untertitel verwenden (Untertitel werden im Video angezeigt)',
      'trendcast.approximateLength': 'Ungefähre Länge des Audios',
      'trendcast.link': 'Link',
      'trendcast.caption': 'Beschriftung',
      'trendcast.options': 'Optionen',
      'minutes': 'Minuten',
      'seconds': 'Sekunden',
      'wordCount': 'Wörteranzahl',
      'approxAudioLength': 'Ungefähre Audiolänge',
      'generating': 'Generierung',
      'generatingAudio': 'Audio wird generiert',
      'generatingVideo': 'Video wird generiert',
      'thisCanTakeAMinute': 'Dies kann eine Minute dauern',
      'next': 'Weiter',
      'downloaded': 'Heruntergeladen',
      'createNewTrendcast': 'Neuen Trendcast erstellen',
    }
  };

  return (
    <LanguageContext.Provider value={{ language, translate, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
