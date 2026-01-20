import { WorkflowTag } from "@/types/workflow";

export interface WorkflowFieldConfig {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'file' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface WorkflowStepConfig {
  id: string;
  title: string;
  description: string;
  prompt: string;
  fields: WorkflowFieldConfig[];
}

export interface WorkflowConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: WorkflowTag[];
  steps: WorkflowStepConfig[];
  createdAt: string;
  updatedAt: string;
}

export const workflowConfigs: Record<string, WorkflowConfig> = {
  "hdi-content": {
    id: "hdi-content",
    name: "HDI Content",
    description: "Content-Generierung für HDI Versicherung",
    icon: "FileText",
    tags: [{ id: "1", name: "Marketing", color: "blue" }],
    steps: [
      {
        id: "input",
        title: "Eingabe",
        description: "Grundlegende Informationen für die Content-Erstellung",
        prompt: "Du bist ein erfahrener Content-Marketing-Experte für die HDI Versicherung. Erstelle ansprechende und informative Inhalte basierend auf den folgenden Eingaben:",
        fields: [
          { id: "topic", name: "topic", label: "Thema", type: "text", placeholder: "z.B. Kfz-Versicherung für junge Fahrer", required: true },
          { id: "tone", name: "tone", label: "Tonalität", type: "select", options: ["Professionell", "Freundlich", "Informativ", "Emotional"], required: true },
          { id: "targetGroup", name: "targetGroup", label: "Zielgruppe", type: "text", placeholder: "z.B. Berufseinsteiger 25-35 Jahre", required: true }
        ]
      },
      {
        id: "processing",
        title: "Verarbeitung",
        description: "Zusätzliche Details und Anpassungen",
        prompt: "Verfeinere den Content basierend auf den zusätzlichen Anforderungen und stelle sicher, dass die Markenrichtlinien eingehalten werden:",
        fields: [
          { id: "keywords", name: "keywords", label: "Keywords", type: "textarea", placeholder: "Wichtige Schlüsselwörter, getrennt durch Kommas", required: false },
          { id: "length", name: "length", label: "Gewünschte Länge", type: "select", options: ["Kurz (100-200 Wörter)", "Mittel (300-500 Wörter)", "Lang (600+ Wörter)"], required: true }
        ]
      },
      {
        id: "output",
        title: "Ausgabe",
        description: "Finalisierung und Export",
        prompt: "Finalisiere den Content und bereite ihn für die Veröffentlichung vor:",
        fields: [
          { id: "format", name: "format", label: "Ausgabeformat", type: "select", options: ["Blog-Artikel", "Social Media Post", "Newsletter", "Landingpage"], required: true }
        ]
      }
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z"
  },
  "trendcast": {
    id: "trendcast",
    name: "Trendcast",
    description: "Video-Content aus Trend-Analysen erstellen",
    icon: "TrendingUp",
    tags: [{ id: "2", name: "Video", color: "purple" }],
    steps: [
      {
        id: "links",
        title: "Links hochladen",
        description: "Trend-Links und Quellen hinzufügen",
        prompt: "Analysiere die folgenden Trend-Quellen und extrahiere die wichtigsten Informationen:",
        fields: [
          { id: "links", name: "links", label: "Trend-Links", type: "textarea", placeholder: "Füge hier deine Links ein (einer pro Zeile)", required: true },
          { id: "topic", name: "topic", label: "Hauptthema", type: "text", placeholder: "z.B. KI-Trends 2024", required: true }
        ]
      },
      {
        id: "script",
        title: "Skript bearbeiten",
        description: "Das generierte Skript anpassen",
        prompt: "Erstelle ein Video-Skript basierend auf den analysierten Trends. Das Skript sollte informativ und unterhaltsam sein:",
        fields: [
          { id: "duration", name: "duration", label: "Video-Dauer", type: "select", options: ["30 Sekunden", "1 Minute", "2 Minuten", "5 Minuten"], required: true },
          { id: "style", name: "style", label: "Stil", type: "select", options: ["Informativ", "Unterhaltsam", "Professionell", "Casual"], required: true }
        ]
      },
      {
        id: "audio",
        title: "Audio generieren",
        description: "Sprachausgabe erstellen",
        prompt: "Generiere eine natürlich klingende Sprachausgabe für das Skript:",
        fields: [
          { id: "voice", name: "voice", label: "Stimme", type: "select", options: ["Männlich - Deutsch", "Weiblich - Deutsch", "Männlich - Englisch", "Weiblich - Englisch"], required: true }
        ]
      },
      {
        id: "video",
        title: "Video erstellen",
        description: "Finales Video generieren",
        prompt: "Erstelle das finale Video mit passenden Visuals und Animationen:",
        fields: [
          { id: "resolution", name: "resolution", label: "Auflösung", type: "select", options: ["1080p (Full HD)", "4K", "720p"], required: true },
          { id: "format", name: "format", label: "Format", type: "select", options: ["16:9 (YouTube)", "9:16 (TikTok/Reels)", "1:1 (Instagram)"], required: true }
        ]
      }
    ],
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z"
  },
  "report-card": {
    id: "report-card",
    name: "Report Card",
    description: "Schüler-Berichte erstellen",
    icon: "GraduationCap",
    tags: [{ id: "3", name: "Bildung", color: "green" }],
    steps: [
      {
        id: "student-info",
        title: "Schüler-Informationen",
        description: "Grunddaten des Schülers eingeben",
        prompt: "Erfasse die grundlegenden Informationen zum Schüler für den Bericht:",
        fields: [
          { id: "studentName", name: "studentName", label: "Schülername", type: "text", placeholder: "Vor- und Nachname", required: true },
          { id: "class", name: "class", label: "Klasse", type: "text", placeholder: "z.B. 5a", required: true },
          { id: "term", name: "term", label: "Halbjahr", type: "select", options: ["1. Halbjahr", "2. Halbjahr"], required: true },
          { id: "schoolYear", name: "schoolYear", label: "Schuljahr", type: "text", placeholder: "z.B. 2023/2024", required: true }
        ]
      },
      {
        id: "performance",
        title: "Leistungsbeurteilung",
        description: "Noten und Bewertungen eingeben",
        prompt: "Erstelle eine detaillierte Leistungsbeurteilung basierend auf den Eingaben:",
        fields: [
          { id: "grades", name: "grades", label: "Noten (Fach: Note)", type: "textarea", placeholder: "Mathematik: 2\nDeutsch: 1\nEnglisch: 2", required: true },
          { id: "behavior", name: "behavior", label: "Sozialverhalten", type: "select", options: ["Sehr gut", "Gut", "Befriedigend", "Ausreichend"], required: true },
          { id: "participation", name: "participation", label: "Mitarbeit", type: "select", options: ["Sehr gut", "Gut", "Befriedigend", "Ausreichend"], required: true }
        ]
      },
      {
        id: "comments",
        title: "Kommentare",
        description: "Individuelle Bemerkungen hinzufügen",
        prompt: "Formuliere konstruktive und ermutigende Kommentare für den Schüler:",
        fields: [
          { id: "strengths", name: "strengths", label: "Stärken", type: "textarea", placeholder: "Besondere Stärken des Schülers", required: false },
          { id: "improvements", name: "improvements", label: "Verbesserungspotential", type: "textarea", placeholder: "Bereiche mit Entwicklungspotential", required: false },
          { id: "recommendations", name: "recommendations", label: "Empfehlungen", type: "textarea", placeholder: "Empfehlungen für die Zukunft", required: false }
        ]
      }
    ],
    createdAt: "2024-01-05T12:00:00Z",
    updatedAt: "2024-01-19T09:15:00Z"
  }
};

export const getWorkflowConfig = (id: string): WorkflowConfig | undefined => {
  return workflowConfigs[id];
};

export const getAllWorkflowConfigs = (): WorkflowConfig[] => {
  return Object.values(workflowConfigs);
};
