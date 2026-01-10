import { WorkflowTag } from "@/types/workflow";

export interface CustomizableField {
  id: string;
  label: string;
  description: string;
  required: boolean;
  type: 'knowledge' | 'tone' | 'language' | 'integrations' | 'custom';
}

export interface TemplateItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: WorkflowTag[];
  category: 'assistant' | 'workflow' | 'app';
  
  // App Store Details
  screenshots: string[];
  useCases: string[];
  features: string[];
  
  // Personalisierung
  customizable: CustomizableField[];
  
  // Vorkonfiguration
  systemPrompt: string;
  suggestedIntegrations: string[];
  starters: { displayText: string; fullPrompt: string }[];
  
  // Metadaten
  rating?: number;
  usageCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const templateTags: WorkflowTag[] = [
  { id: "productivity", name: "Produktivität", color: "#3B82F6" },
  { id: "business", name: "Business", color: "#10B981" },
  { id: "creative", name: "Kreativ", color: "#8B5CF6" },
  { id: "communication", name: "Kommunikation", color: "#F59E0B" },
  { id: "analysis", name: "Analyse", color: "#EF4444" },
  { id: "support", name: "Support", color: "#06B6D4" },
];

export const templates: TemplateItem[] = [
  {
    id: "email-assistant",
    title: "E-Mail Assistent",
    description: "Professionelle E-Mails schnell und im Stil deines Unternehmens verfassen",
    icon: "Mail",
    tags: [
      { id: "productivity", name: "Produktivität", color: "#3B82F6" },
      { id: "communication", name: "Kommunikation", color: "#F59E0B" },
    ],
    category: "assistant",
    screenshots: [
      "/lovable-uploads/0c9f0369-7790-4186-ac9f-7338379e785f.png",
      "/lovable-uploads/7a507605-9b7e-466b-8f20-bb8c9e8d9c68.png",
    ],
    useCases: [
      "Professionelle E-Mails schnell verfassen",
      "Kundenanfragen beantworten",
      "Follow-up Nachrichten schreiben",
      "E-Mails in andere Sprachen übersetzen",
    ],
    features: [
      "Lernt deinen Schreibstil",
      "Mehrsprachige Unterstützung",
      "Integration mit Outlook/Gmail",
    ],
    customizable: [
      {
        id: "tone",
        label: "Tonalität",
        description: "Wie soll der Assistent schreiben? Formell, locker, freundlich?",
        required: true,
        type: "tone",
      },
      {
        id: "knowledge",
        label: "Knowledge Base",
        description: "Füge Dokumente hinzu, damit der Assistent deinen Kontext kennt",
        required: false,
        type: "knowledge",
      },
      {
        id: "signature",
        label: "E-Mail Signatur",
        description: "Deine Standard-Signatur für E-Mails",
        required: false,
        type: "custom",
      },
    ],
    systemPrompt: "Du bist ein professioneller E-Mail-Assistent. Du hilfst beim Verfassen von klaren, professionellen E-Mails. Achte auf den Ton und Stil des Unternehmens.",
    suggestedIntegrations: ["microsoft", "google"],
    starters: [
      { displayText: "Follow-up E-Mail verfassen", fullPrompt: "Hilf mir, eine professionelle Follow-up E-Mail zu verfassen für..." },
      { displayText: "Auf Beschwerde antworten", fullPrompt: "Ich muss auf eine Kundenbeschwerde antworten. Der Kunde ist unzufrieden weil..." },
    ],
    rating: 4.8,
    usageCount: 12400,
    isFeatured: true,
  },
  {
    id: "faq-bot",
    title: "FAQ Bot",
    description: "Beantwortet häufig gestellte Fragen basierend auf deiner Knowledge Base",
    icon: "HelpCircle",
    tags: [
      { id: "support", name: "Support", color: "#06B6D4" },
      { id: "business", name: "Business", color: "#10B981" },
    ],
    category: "assistant",
    screenshots: [
      "/lovable-uploads/0c9f0369-7790-4186-ac9f-7338379e785f.png",
    ],
    useCases: [
      "Kundenanfragen automatisch beantworten",
      "Interne FAQs für Mitarbeiter",
      "Produktinformationen bereitstellen",
      "Onboarding neuer Mitarbeiter unterstützen",
    ],
    features: [
      "Lernt aus deiner Knowledge Base",
      "Versteht Kontext und Nuancen",
      "24/7 verfügbar",
    ],
    customizable: [
      {
        id: "knowledge",
        label: "Knowledge Base",
        description: "Lade deine FAQs, Dokumente und Handbücher hoch",
        required: true,
        type: "knowledge",
      },
      {
        id: "tone",
        label: "Tonalität",
        description: "Freundlich, professionell oder locker?",
        required: false,
        type: "tone",
      },
      {
        id: "escalation",
        label: "Eskalationsregeln",
        description: "Wann soll an einen Menschen weitergeleitet werden?",
        required: false,
        type: "custom",
      },
    ],
    systemPrompt: "Du bist ein hilfreicher FAQ-Bot. Beantworte Fragen basierend auf der bereitgestellten Knowledge Base. Wenn du dir unsicher bist, weise darauf hin.",
    suggestedIntegrations: ["notion"],
    starters: [
      { displayText: "Was sind eure Öffnungszeiten?", fullPrompt: "Was sind eure Öffnungszeiten?" },
      { displayText: "Wie kann ich mein Passwort zurücksetzen?", fullPrompt: "Wie kann ich mein Passwort zurücksetzen?" },
    ],
    rating: 4.6,
    usageCount: 8900,
    isNew: true,
  },
  {
    id: "content-creator",
    title: "Content Creator",
    description: "Erstelle ansprechende Inhalte für Social Media, Blog und mehr",
    icon: "Palette",
    tags: [
      { id: "creative", name: "Kreativ", color: "#8B5CF6" },
      { id: "communication", name: "Kommunikation", color: "#F59E0B" },
    ],
    category: "assistant",
    screenshots: [
      "/lovable-uploads/7a507605-9b7e-466b-8f20-bb8c9e8d9c68.png",
    ],
    useCases: [
      "Social Media Posts erstellen",
      "Blog-Artikel schreiben",
      "Marketing-Texte verfassen",
      "Content-Kalender planen",
    ],
    features: [
      "Kennt aktuelle Trends",
      "Passt sich deiner Marke an",
      "Multi-Plattform Support",
    ],
    customizable: [
      {
        id: "brand",
        label: "Markenidentität",
        description: "Brand Guidelines, Tone of Voice, Zielgruppe",
        required: true,
        type: "custom",
      },
      {
        id: "platforms",
        label: "Plattformen",
        description: "Für welche Kanäle soll Content erstellt werden?",
        required: false,
        type: "custom",
      },
    ],
    systemPrompt: "Du bist ein kreativer Content Creator. Erstelle ansprechende, originelle Inhalte die zur Marke passen.",
    suggestedIntegrations: [],
    starters: [
      { displayText: "LinkedIn Post erstellen", fullPrompt: "Erstelle einen LinkedIn Post über..." },
      { displayText: "Blog-Artikel Ideen", fullPrompt: "Generiere 5 Blog-Artikel Ideen zum Thema..." },
    ],
    rating: 4.7,
    usageCount: 15600,
    isFeatured: true,
  },
  {
    id: "report-generator",
    title: "Report Generator",
    description: "Erstelle professionelle Reports und Zusammenfassungen aus deinen Daten",
    icon: "FileText",
    tags: [
      { id: "analysis", name: "Analyse", color: "#EF4444" },
      { id: "business", name: "Business", color: "#10B981" },
    ],
    category: "workflow",
    screenshots: [
      "/lovable-uploads/0c9f0369-7790-4186-ac9f-7338379e785f.png",
    ],
    useCases: [
      "Monatliche Reports erstellen",
      "Meeting-Zusammenfassungen",
      "Datenanalysen präsentieren",
      "Executive Summaries schreiben",
    ],
    features: [
      "Strukturierte Ausgabe",
      "Diagramme und Visualisierungen",
      "Export in verschiedene Formate",
    ],
    customizable: [
      {
        id: "template",
        label: "Report-Vorlage",
        description: "Welche Struktur sollen Reports haben?",
        required: true,
        type: "custom",
      },
      {
        id: "data",
        label: "Datenquellen",
        description: "Woher kommen die Daten für die Reports?",
        required: false,
        type: "integrations",
      },
    ],
    systemPrompt: "Du bist ein professioneller Report-Generator. Erstelle strukturierte, übersichtliche Reports aus den bereitgestellten Daten.",
    suggestedIntegrations: ["microsoft", "google", "notion"],
    starters: [
      { displayText: "Monatlichen Report erstellen", fullPrompt: "Erstelle einen monatlichen Report basierend auf..." },
      { displayText: "Meeting zusammenfassen", fullPrompt: "Fasse folgendes Meeting zusammen..." },
    ],
    rating: 4.5,
    usageCount: 6700,
  },
  {
    id: "translator",
    title: "Übersetzer Pro",
    description: "Professionelle Übersetzungen mit Kontext und Nuancen",
    icon: "Languages",
    tags: [
      { id: "communication", name: "Kommunikation", color: "#F59E0B" },
      { id: "productivity", name: "Produktivität", color: "#3B82F6" },
    ],
    category: "assistant",
    screenshots: [
      "/lovable-uploads/7a507605-9b7e-466b-8f20-bb8c9e8d9c68.png",
    ],
    useCases: [
      "Dokumente übersetzen",
      "E-Mails in Fremdsprachen",
      "Marketing-Texte lokalisieren",
      "Technische Dokumentation",
    ],
    features: [
      "Kontextbewusste Übersetzungen",
      "Branchen-spezifisches Vokabular",
      "Beibehaltung des Tons",
    ],
    customizable: [
      {
        id: "languages",
        label: "Zielsprachen",
        description: "In welche Sprachen soll hauptsächlich übersetzt werden?",
        required: true,
        type: "language",
      },
      {
        id: "glossary",
        label: "Glossar",
        description: "Spezifische Begriffe und deren Übersetzungen",
        required: false,
        type: "knowledge",
      },
    ],
    systemPrompt: "Du bist ein professioneller Übersetzer. Übersetze Texte kontextbewusst und behalte den ursprünglichen Ton bei.",
    suggestedIntegrations: [],
    starters: [
      { displayText: "Ins Englische übersetzen", fullPrompt: "Übersetze folgenden Text ins Englische..." },
      { displayText: "Dokument lokalisieren", fullPrompt: "Lokalisiere dieses Marketing-Dokument für den deutschen Markt..." },
    ],
    rating: 4.9,
    usageCount: 21000,
    isFeatured: true,
  },
  {
    id: "meeting-assistant",
    title: "Meeting Assistent",
    description: "Bereite Meetings vor und erstelle automatisch Protokolle",
    icon: "Users",
    tags: [
      { id: "productivity", name: "Produktivität", color: "#3B82F6" },
      { id: "business", name: "Business", color: "#10B981" },
    ],
    category: "app",
    screenshots: [
      "/lovable-uploads/0c9f0369-7790-4186-ac9f-7338379e785f.png",
      "/lovable-uploads/7a507605-9b7e-466b-8f20-bb8c9e8d9c68.png",
    ],
    useCases: [
      "Meeting-Agenden erstellen",
      "Protokolle automatisch generieren",
      "Action Items tracken",
      "Follow-ups versenden",
    ],
    features: [
      "Kalender-Integration",
      "Automatische Transkription",
      "Action Item Tracking",
    ],
    customizable: [
      {
        id: "format",
        label: "Protokoll-Format",
        description: "Wie sollen Protokolle strukturiert sein?",
        required: true,
        type: "custom",
      },
      {
        id: "integrations",
        label: "Kalender-Integration",
        description: "Verbinde mit deinem Kalender für automatische Meeting-Erkennung",
        required: false,
        type: "integrations",
      },
    ],
    systemPrompt: "Du bist ein Meeting-Assistent. Hilf bei der Vorbereitung und Nachbereitung von Meetings.",
    suggestedIntegrations: ["microsoft", "google"],
    starters: [
      { displayText: "Meeting-Agenda erstellen", fullPrompt: "Erstelle eine Agenda für ein Meeting zum Thema..." },
      { displayText: "Protokoll generieren", fullPrompt: "Erstelle ein Protokoll aus folgenden Meeting-Notizen..." },
    ],
    rating: 4.4,
    usageCount: 9800,
    isNew: true,
  },
];
