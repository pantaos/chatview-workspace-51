import React, { createContext, useContext, useState, ReactNode } from "react";

// Define supported languages
export type LanguageType = "en" | "de" | "fr" | "es";

// Define the context type
interface LanguageContextType {
  language: LanguageType;
  changeLanguage: (lang: LanguageType) => void;
  translate: (key: string) => string;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  changeLanguage: () => {},
  translate: (key) => key
});

// Simple translations for common UI elements
const translations: Record<LanguageType, Record<string, string>> = {
  en: {
    "app.dashboard": "Dashboard",
    "app.history": "History",
    "app.settings": "Settings",
    "app.profile": "Profile",
    "app.logout": "Logout",
    "app.viewAll": "View all",
    
    "dashboard.workflows": "Workflows",
    "dashboard.all": "All",
    "dashboard.recent": "Recent",
    "dashboard.favorites": "Favorites",
    "dashboard.recentHistory": "Recent History",
    "dashboard.newChatWorkflow": "New Workflow",
    "dashboard.workflowSettings": "Workflow Settings",
    "dashboard.creativityLevel": "Adjust the creativity level of AI responses",
    "dashboard.conservative": "Conservative",
    "dashboard.creative": "Creative",
    
    "workflow.chatAssistant": "Chat Assistant",
    "workflow.chatAssistantDesc": "General purpose AI chat assistant",
    "workflow.codeHelper": "Code Helper",
    "workflow.codeHelperDesc": "Generate and explain code",
    "workflow.imageCreator": "Image Creator",
    "workflow.imageCreatorDesc": "Create images from text descriptions",
    "workflow.documentHelper": "Document Helper",
    "workflow.documentHelperDesc": "Summarize and extract from documents",
    "workflow.videoGenerator": "Video Generator",
    "workflow.videoGeneratorDesc": "Create videos from text prompts",
    "workflow.musicComposer": "Music Composer",
    "workflow.musicComposerDesc": "Generate music and audio",
    "workflow.trendcast": "Trendcast",
    "workflow.trendcastDesc": "Turn website content into professional videos",
    
    "menu.editWorkflow": "Edit Workflow",
    "menu.workflowSettings": "Workflow Settings",
    "menu.deleteWorkflow": "Delete Workflow",
    "menu.deleteConfirm": "Are you sure you want to delete this workflow?",
    "menu.undoDelete": "Undo",
    "menu.deleteCancelled": "Workflow deletion cancelled",
    
    "language.en": "English",
    "language.de": "Deutsch",
    "language.fr": "Français",
    "language.es": "Español"
  },
  de: {
    "app.dashboard": "Dashboard",
    "app.history": "Verlauf",
    "app.settings": "Einstellungen",
    "app.profile": "Profil",
    "app.logout": "Abmelden",
    "app.viewAll": "Alle anzeigen",
    
    "dashboard.workflows": "Workflows",
    "dashboard.all": "Alle",
    "dashboard.recent": "Kürzlich",
    "dashboard.favorites": "Favoriten",
    "dashboard.recentHistory": "Kürzliche Aktivität",
    "dashboard.newChatWorkflow": "Neuer Workflow",
    "dashboard.workflowSettings": "Workflow Einstellungen",
    "dashboard.creativityLevel": "Passen Sie die Kreativität der KI-Antworten an",
    "dashboard.conservative": "Konservativ",
    "dashboard.creative": "Kreativ",
    
    "workflow.chatAssistant": "Chat-Assistent",
    "workflow.chatAssistantDesc": "Allgemeiner KI-Chat-Assistent",
    "workflow.codeHelper": "Code-Helfer",
    "workflow.codeHelperDesc": "Code generieren und erklären",
    "workflow.imageCreator": "Bilderzeuger",
    "workflow.imageCreatorDesc": "Bilder aus Textbeschreibungen erstellen",
    "workflow.documentHelper": "Dokumenthelfer",
    "workflow.documentHelperDesc": "Dokumente zusammenfassen und extrahieren",
    "workflow.videoGenerator": "Video-Generator",
    "workflow.videoGeneratorDesc": "Erstellen Sie Videos aus Textprompts",
    "workflow.musicComposer": "Musikkomponist",
    "workflow.musicComposerDesc": "Musik und Audio generieren",
    "workflow.trendcast": "Trendcast",
    "workflow.trendcastDesc": "Verwandeln Sie Website-Inhalte in professionelle Videos",
    
    "menu.editWorkflow": "Workflow bearbeiten",
    "menu.workflowSettings": "Workflow Einstellungen",
    "menu.deleteWorkflow": "Workflow löschen",
    "menu.deleteConfirm": "Möchten Sie diesen Workflow wirklich löschen?",
    "menu.undoDelete": "Rückgängig machen",
    "menu.deleteCancelled": "Workflow-Löschung abgebrochen",
    
    "language.en": "Englisch",
    "language.de": "Deutsch",
    "language.fr": "Französisch",
    "language.es": "Spanisch"
  },
  fr: {
    "app.dashboard": "Tableau de bord",
    "app.history": "Historique",
    "app.settings": "Paramètres",
    "app.profile": "Profil",
    "app.logout": "Déconnexion",
    "app.viewAll": "Tout afficher",
    
    "dashboard.workflows": "Workflows",
    "dashboard.all": "Tous",
    "dashboard.recent": "Récent",
    "dashboard.favorites": "Favoris",
    "dashboard.recentHistory": "Historique récent",
    "dashboard.newChatWorkflow": "Nouveau Workflow",
    "dashboard.workflowSettings": "Paramètres du Workflow",
    "dashboard.creativityLevel": "Ajustez le niveau de créativité des réponses de l'IA",
    "dashboard.conservative": "Conservateur",
    "dashboard.creative": "Créatif",
    
    "workflow.chatAssistant": "Assistant de Chat",
    "workflow.chatAssistantDesc": "Assistant de chat IA à usage général",
    "workflow.codeHelper": "Aide au Code",
    "workflow.codeHelperDesc": "Générer et expliquer le code",
    "workflow.imageCreator": "Créateur d'Images",
    "workflow.imageCreatorDesc": "Créer des images à partir de descriptions textuelles",
    "workflow.documentHelper": "Aide aux Documents",
    "workflow.documentHelperDesc": "Résumer et extraire des documents",
    "workflow.videoGenerator": "Générateur de Vidéo",
    "workflow.videoGeneratorDesc": "Créer des vidéos à partir d'invites textuelles",
    "workflow.musicComposer": "Compositeur de Musique",
    "workflow.musicComposerDesc": "Générer de la musique et de l'audio",
    "workflow.trendcast": "Trendcast",
    "workflow.trendcastDesc": "Transformez le contenu du site Web en vidéos professionnelles",
    
    "menu.editWorkflow": "Modifier le Workflow",
    "menu.workflowSettings": "Paramètres du Workflow",
    "menu.deleteWorkflow": "Supprimer le Workflow",
    "menu.deleteConfirm": "Êtes-vous sûr de vouloir supprimer ce workflow ?",
    "menu.undoDelete": "Annuler",
    "menu.deleteCancelled": "Suppression du workflow annulée",
    
    "language.en": "Anglais",
    "language.de": "Allemand",
    "language.fr": "Français",
    "language.es": "Espagnol"
  },
  es: {
    "app.dashboard": "Panel",
    "app.history": "Historial",
    "app.settings": "Ajustes",
    "app.profile": "Perfil",
    "app.logout": "Cerrar sesión",
    "app.viewAll": "Ver todo",
    
    "dashboard.workflows": "Flujos de trabajo",
    "dashboard.all": "Todos",
    "dashboard.recent": "Reciente",
    "dashboard.favorites": "Favoritos",
    "dashboard.recentHistory": "Historial reciente",
    "dashboard.newChatWorkflow": "Nuevo flujo de trabajo",
    "dashboard.workflowSettings": "Ajustes del flujo de trabajo",
    "dashboard.creativityLevel": "Ajusta el nivel de creatividad de las respuestas de la IA",
    "dashboard.conservative": "Conservador",
    "dashboard.creative": "Creativo",
    
    "workflow.chatAssistant": "Asistente de chat",
    "workflow.chatAssistantDesc": "Asistente de chat de IA de propósito general",
    "workflow.codeHelper": "Ayudante de código",
    "workflow.codeHelperDesc": "Generar y explicar código",
    "workflow.imageCreator": "Creador de imágenes",
    "workflow.imageCreatorDesc": "Crear imágenes a partir de descripciones de texto",
    "workflow.documentHelper": "Ayudante de documentos",
    "workflow.documentHelperDesc": "Resumir y extraer de documentos",
    "workflow.videoGenerator": "Generador de video",
    "workflow.videoGeneratorDesc": "Crear videos a partir de indicaciones de texto",
    "workflow.musicComposer": "Compositor de música",
    "workflow.musicComposerDesc": "Generar música y audio",
    "workflow.trendcast": "Trendcast",
    "workflow.trendcastDesc": "Convierte el contenido del sitio web en videos profesionales",
    
    "menu.editWorkflow": "Editar flujo de trabajo",
    "menu.workflowSettings": "Ajustes del flujo de trabajo",
    "menu.deleteWorkflow": "Eliminar flujo de trabajo",
    "menu.deleteConfirm": "¿Estás seguro de que quieres eliminar este flujo de trabajo?",
    "menu.undoDelete": "Deshacer",
    "menu.deleteCancelled": "Eliminación del flujo de trabajo cancelada",
    
    "language.en": "Inglés",
    "language.de": "Alemán",
    "language.fr": "Francés",
    "language.es": "Español"
  }
};

// Provider component
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

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
