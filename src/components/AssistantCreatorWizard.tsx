import { useState } from "react";
import { 
  X, ChevronRight, ChevronLeft, Check, Sparkles, 
  FileText, BarChart3, Mail, Users, Headphones,
  Calendar, Database, Globe, Shield, Zap,
  MessageSquare, PenTool, Search, ClipboardList, BookOpen,
  ArrowRight, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface WizardOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  options: WizardOption[];
  multiSelect?: boolean;
}

interface AssistantCreatorWizardProps {
  open: boolean;
  onClose: () => void;
  onCreateAssistant: (data: {
    title: string;
    description: string;
    systemPrompt: string;
    starters: Array<{ displayText: string; fullPrompt: string }>;
    icon: string;
    tags: Array<{ id: string; name: string; color: string }>;
  }) => void;
}

const wizardSteps: WizardStep[] = [
  {
    id: "use-case",
    title: "Was moechtest du mit deinem Assistenten erreichen?",
    subtitle: "Waehle den Bereich, in dem dich der Assistent unterstuetzen soll.",
    options: [
      { id: "content", label: "Texte & Inhalte erstellen", description: "E-Mails, Berichte, Praesentationen, Social Media Posts verfassen", icon: <PenTool className="w-6 h-6" /> },
      { id: "data", label: "Daten analysieren & aufbereiten", description: "Tabellen auswerten, Zusammenfassungen erstellen, Trends erkennen", icon: <BarChart3 className="w-6 h-6" /> },
      { id: "communication", label: "Kommunikation & Korrespondenz", description: "Kunden- und interne Kommunikation beschleunigen", icon: <Mail className="w-6 h-6" /> },
      { id: "knowledge", label: "Wissen & Recherche", description: "Informationen finden, Dokumente durchsuchen, FAQ beantworten", icon: <Search className="w-6 h-6" /> },
      { id: "process", label: "Prozesse & Aufgaben organisieren", description: "Checklisten, Freigaben, Aufgabenverteilung automatisieren", icon: <ClipboardList className="w-6 h-6" /> },
    ]
  },
  {
    id: "task",
    title: "Welche konkrete Aufgabe soll der Assistent uebernehmen?",
    subtitle: "Je genauer du die Aufgabe beschreibst, desto besser kann der Assistent helfen.",
    options: [] // dynamically filled based on step 1
  },
  {
    id: "audience",
    title: "Wer wird diesen Assistenten nutzen?",
    subtitle: "Dies hilft uns, die Sprache und Komplexitaet anzupassen.",
    options: [
      { id: "self", label: "Nur ich selbst", description: "Persoenlicher Assistent fuer meine taegliche Arbeit", icon: <Users className="w-6 h-6" /> },
      { id: "team", label: "Mein Team", description: "Mehrere Kollegen im selben Fachbereich", icon: <Users className="w-6 h-6" /> },
      { id: "department", label: "Gesamte Abteilung", description: "Abteilungsweiter Einsatz mit verschiedenen Rollen", icon: <Users className="w-6 h-6" /> },
      { id: "external", label: "Externe (Kunden, Partner)", description: "Kommunikation mit Personen ausserhalb des Unternehmens", icon: <Globe className="w-6 h-6" /> },
    ]
  },
  {
    id: "integrations",
    title: "Welche Tools nutzt du taeglich?",
    subtitle: "Der Assistent kann mit deinen bestehenden Tools zusammenarbeiten.",
    multiSelect: true,
    options: [
      { id: "outlook", label: "Microsoft Outlook", description: "E-Mails lesen, verfassen und organisieren", icon: <Mail className="w-6 h-6" /> },
      { id: "sharepoint", label: "SharePoint / OneDrive", description: "Dokumente und Dateien verwalten", icon: <Database className="w-6 h-6" /> },
      { id: "teams", label: "Microsoft Teams", description: "Chat-Nachrichten und Meetings", icon: <MessageSquare className="w-6 h-6" /> },
      { id: "calendar", label: "Kalender", description: "Termine und Verfuegbarkeiten verwalten", icon: <Calendar className="w-6 h-6" /> },
      { id: "crm", label: "CRM-System", description: "Kundendaten und Vertriebsprozesse", icon: <Users className="w-6 h-6" /> },
      { id: "none", label: "Keine Integration noetig", description: "Der Assistent soll eigenstaendig arbeiten", icon: <Shield className="w-6 h-6" /> },
    ]
  },
  {
    id: "style",
    title: "Wie soll der Assistent kommunizieren?",
    subtitle: "Waehle den Ton, der am besten zu deinem Arbeitsumfeld passt.",
    options: [
      { id: "formal", label: "Formell & professionell", description: "Geschaeftliche Korrespondenz, offizielle Dokumente", icon: <FileText className="w-6 h-6" /> },
      { id: "friendly", label: "Freundlich & hilfsbereit", description: "Nahbar, erklaerend, geduldig", icon: <Headphones className="w-6 h-6" /> },
      { id: "concise", label: "Kurz & praegnant", description: "Auf den Punkt, keine Umschweife, Bullet Points", icon: <Zap className="w-6 h-6" /> },
      { id: "educational", label: "Erklaerend & lehrreich", description: "Hintergruende liefern, Zusammenhaenge aufzeigen", icon: <BookOpen className="w-6 h-6" /> },
    ]
  }
];

const taskOptionsByUseCase: Record<string, WizardOption[]> = {
  content: [
    { id: "email-drafts", label: "E-Mails formulieren", description: "Professionelle E-Mails auf Basis von Stichpunkten erstellen", icon: <Mail className="w-6 h-6" /> },
    { id: "reports", label: "Berichte & Zusammenfassungen", description: "Ausfuehrliche Berichte oder Executive Summaries schreiben", icon: <FileText className="w-6 h-6" /> },
    { id: "social-media", label: "Social Media & Marketing", description: "Posts, Kampagnentexte und Werbematerial erstellen", icon: <Globe className="w-6 h-6" /> },
    { id: "presentations", label: "Praesentationen vorbereiten", description: "Folieninhalte, Talking Points und Handouts", icon: <BarChart3 className="w-6 h-6" /> },
    { id: "documentation", label: "Dokumentation & Anleitungen", description: "Prozessbeschreibungen, Handbuecher, SOPs", icon: <BookOpen className="w-6 h-6" /> },
  ],
  data: [
    { id: "data-summary", label: "Daten zusammenfassen", description: "Tabellen und Zahlen in verstaendliche Texte uebersetzen", icon: <BarChart3 className="w-6 h-6" /> },
    { id: "trend-analysis", label: "Trends & Muster erkennen", description: "Regelmaessige Auswertungen und Entwicklungen aufzeigen", icon: <Search className="w-6 h-6" /> },
    { id: "kpi-tracking", label: "KPI-Reporting", description: "Kennzahlen ueberwachen und Abweichungen melden", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "data-cleaning", label: "Daten bereinigen & strukturieren", description: "Duplikate finden, Formate vereinheitlichen", icon: <Database className="w-6 h-6" /> },
  ],
  communication: [
    { id: "customer-replies", label: "Kundenanfragen beantworten", description: "Standardantworten formulieren und personalisieren", icon: <Headphones className="w-6 h-6" /> },
    { id: "meeting-prep", label: "Meeting-Vorbereitung", description: "Agenden erstellen, Protokolle zusammenfassen", icon: <Calendar className="w-6 h-6" /> },
    { id: "internal-comms", label: "Interne Mitteilungen", description: "Ankuendigungen, Updates und Rundschreiben verfassen", icon: <MessageSquare className="w-6 h-6" /> },
    { id: "translation", label: "Uebersetzungen & Lokalisierung", description: "Texte in andere Sprachen uebertragen", icon: <Globe className="w-6 h-6" /> },
  ],
  knowledge: [
    { id: "doc-search", label: "Dokumentensuche & QA", description: "Antworten in bestehenden Dokumenten finden", icon: <Search className="w-6 h-6" /> },
    { id: "faq-bot", label: "FAQ & Wissensdatenbank", description: "Haeufige Fragen automatisch beantworten", icon: <BookOpen className="w-6 h-6" /> },
    { id: "research", label: "Recherche & Zusammenstellung", description: "Informationen aus verschiedenen Quellen buendeln", icon: <Database className="w-6 h-6" /> },
    { id: "onboarding", label: "Onboarding-Begleitung", description: "Neuen Mitarbeitern Wissen vermitteln", icon: <Users className="w-6 h-6" /> },
  ],
  process: [
    { id: "task-management", label: "Aufgaben verteilen & tracken", description: "To-dos erstellen und Fortschritt verfolgen", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "approval-flows", label: "Freigabeprozesse", description: "Genehmigungen einholen und dokumentieren", icon: <Shield className="w-6 h-6" /> },
    { id: "checklists", label: "Checklisten & Qualitaetssicherung", description: "Standardprozesse abarbeiten und pruefen", icon: <Check className="w-6 h-6" /> },
    { id: "scheduling", label: "Terminplanung & Koordination", description: "Verfuegbarkeiten abgleichen und Termine finden", icon: <Calendar className="w-6 h-6" /> },
  ],
};

function generateAssistantConfig(selections: Record<string, string | string[]>) {
  const useCase = selections["use-case"] as string;
  const task = selections["task"] as string;
  const audience = selections["audience"] as string;
  const integrations = selections["integrations"] as string[];
  const style = selections["style"] as string;

  // Build title
  const taskLabels: Record<string, string> = {
    "email-drafts": "E-Mail Assistent",
    "reports": "Berichts-Assistent",
    "social-media": "Social Media Assistent",
    "presentations": "Praesentations-Assistent",
    "documentation": "Dokumentations-Assistent",
    "data-summary": "Daten-Assistent",
    "trend-analysis": "Trend-Analyse Assistent",
    "kpi-tracking": "KPI-Reporting Assistent",
    "data-cleaning": "Datenqualitaets-Assistent",
    "customer-replies": "Kundenkommunikations-Assistent",
    "meeting-prep": "Meeting-Assistent",
    "internal-comms": "Kommunikations-Assistent",
    "translation": "Uebersetzungs-Assistent",
    "doc-search": "Wissens-Assistent",
    "faq-bot": "FAQ-Assistent",
    "research": "Recherche-Assistent",
    "onboarding": "Onboarding-Assistent",
    "task-management": "Aufgaben-Assistent",
    "approval-flows": "Freigabe-Assistent",
    "checklists": "Qualitaets-Assistent",
    "scheduling": "Termin-Assistent",
  };

  const title = taskLabels[task] || "Mein Assistent";

  // Build description
  const taskDescriptions: Record<string, string> = {
    "email-drafts": "Hilft beim Verfassen professioneller E-Mails",
    "reports": "Erstellt Berichte und Executive Summaries",
    "social-media": "Generiert Social-Media-Inhalte und Marketingtexte",
    "presentations": "Bereitet Praesentationsinhalte und Talking Points vor",
    "documentation": "Erstellt Prozessdokumentationen und Anleitungen",
    "data-summary": "Fasst Daten verstaendlich zusammen",
    "trend-analysis": "Analysiert Trends und erkennt Muster",
    "kpi-tracking": "Ueberwacht Kennzahlen und erstellt Reports",
    "data-cleaning": "Bereinigt und strukturiert Datensaetze",
    "customer-replies": "Formuliert personalisierte Kundenantworten",
    "meeting-prep": "Bereitet Meetings vor und fasst Ergebnisse zusammen",
    "internal-comms": "Verfasst interne Mitteilungen und Updates",
    "translation": "Uebersetzt und lokalisiert Texte",
    "doc-search": "Durchsucht Dokumente und beantwortet Fragen",
    "faq-bot": "Beantwortet haeufige Fragen automatisch",
    "research": "Recherchiert und buendelt Informationen",
    "onboarding": "Begleitet neue Mitarbeiter beim Einstieg",
    "task-management": "Verteilt und verfolgt Aufgaben",
    "approval-flows": "Organisiert Freigabeprozesse",
    "checklists": "Fuehrt durch Checklisten und Qualitaetspruefungen",
    "scheduling": "Koordiniert Termine und Verfuegbarkeiten",
  };

  const description = taskDescriptions[task] || "Ein individueller KI-Assistent";

  // Build system prompt
  const styleInstructions: Record<string, string> = {
    formal: "Kommuniziere stets formell und professionell. Verwende eine geschaeftliche Sprache, vermeide Umgangssprache und achte auf korrekte Anrede.",
    friendly: "Kommuniziere freundlich, nahbar und hilfsbereit. Erklaere Sachverhalte geduldig und biete proaktiv weitere Hilfe an.",
    concise: "Antworte kurz und praegnant. Verwende Bullet Points, vermeide unnoetige Fuellwoerter und komme direkt auf den Punkt.",
    educational: "Erklaere Hintergruende und Zusammenhaenge ausfuehrlich. Liefere Kontext und hilf dem Nutzer, das Thema zu verstehen.",
  };

  const audienceContext: Record<string, string> = {
    self: "Du unterstuetzt einen einzelnen Mitarbeiter bei seiner taeglichen Arbeit.",
    team: "Du unterstuetzt ein Team von Fachkollegen. Achte auf konsistente Qualitaet und einheitliche Standards.",
    department: "Du wirst abteilungsweit eingesetzt. Beruecksichtige verschiedene Rollen und Wissensniveaus.",
    external: "Deine Antworten richten sich teilweise an externe Personen (Kunden, Partner). Achte besonders auf professionelles Auftreten und Datenschutz.",
  };

  const integrationContext = integrations
    .filter(i => i !== "none")
    .map(i => {
      const map: Record<string, string> = {
        outlook: "Du hast Zugriff auf Microsoft Outlook. Du kannst E-Mails lesen, verfassen und organisieren.",
        sharepoint: "Du hast Zugriff auf SharePoint und OneDrive. Du kannst Dokumente suchen, lesen und verwalten.",
        teams: "Du hast Zugriff auf Microsoft Teams. Du kannst Chat-Nachrichten senden und Meeting-Informationen abrufen.",
        calendar: "Du hast Zugriff auf den Kalender. Du kannst Termine einsehen und Verfuegbarkeiten pruefen.",
        crm: "Du hast Zugriff auf das CRM-System. Du kannst Kundendaten einsehen und Vertriebsprozesse unterstuetzen.",
      };
      return map[i] || "";
    })
    .filter(Boolean);

  const systemPrompt = [
    `Du bist ein spezialisierter KI-Assistent fuer den Bereich "${title.replace(' Assistent', '')}".`,
    `Deine Hauptaufgabe: ${description}.`,
    "",
    styleInstructions[style] || "",
    "",
    audienceContext[audience] || "",
    "",
    integrationContext.length > 0
      ? "Verfuegbare Integrationen:\n" + integrationContext.join("\n")
      : "",
    "",
    "Wichtige Regeln:",
    "- Antworte immer auf Deutsch, es sei denn, der Nutzer schreibt in einer anderen Sprache.",
    "- Frage nach, wenn dir wichtige Informationen fehlen, anstatt Annahmen zu treffen.",
    "- Halte dich an Unternehmensrichtlinien und behandle alle Informationen vertraulich.",
    "- Wenn du dir bei etwas unsicher bist, kommuniziere das transparent.",
  ].filter(Boolean).join("\n");

  // Build conversation starters
  const startersByTask: Record<string, Array<{ displayText: string; fullPrompt: string }>> = {
    "email-drafts": [
      { displayText: "E-Mail aus Stichpunkten erstellen", fullPrompt: "Ich habe folgende Stichpunkte und moechte daraus eine professionelle E-Mail verfassen. Bitte frage mich nach den Stichpunkten und dem Empfaenger." },
      { displayText: "Antwort auf eine E-Mail formulieren", fullPrompt: "Ich habe eine E-Mail erhalten und moechte professionell antworten. Ich werde dir die Original-E-Mail zeigen." },
      { displayText: "E-Mail-Betreff optimieren", fullPrompt: "Ich brauche einen praegnanten und professionellen Betreff fuer eine E-Mail. Bitte frage mich, worum es in der E-Mail geht." },
    ],
    "reports": [
      { displayText: "Bericht aus Daten erstellen", fullPrompt: "Ich moechte aus Rohdaten einen strukturierten Bericht erstellen. Bitte frage mich nach den Daten und dem gewuenschten Format." },
      { displayText: "Executive Summary schreiben", fullPrompt: "Ich brauche eine Executive Summary fuer ein Projekt. Bitte frage mich nach den wichtigsten Punkten." },
      { displayText: "Monatsbericht zusammenfassen", fullPrompt: "Hilf mir, den Monatsbericht zusammenzufassen. Ich werde dir die relevanten Informationen geben." },
    ],
    "customer-replies": [
      { displayText: "Kundenanfrage beantworten", fullPrompt: "Ich habe eine Kundenanfrage erhalten und moechte professionell antworten. Ich zeige dir die Anfrage." },
      { displayText: "Reklamation bearbeiten", fullPrompt: "Ein Kunde hat eine Reklamation eingereicht. Hilf mir, eine empathische und loesungsorientierte Antwort zu formulieren." },
      { displayText: "Follow-up E-Mail verfassen", fullPrompt: "Ich moechte bei einem Kunden nachfassen. Bitte frage mich nach dem Kontext und dem Ziel der Nachricht." },
    ],
    "meeting-prep": [
      { displayText: "Meeting-Agenda erstellen", fullPrompt: "Ich brauche eine strukturierte Agenda fuer ein Meeting. Bitte frage mich nach dem Thema, den Teilnehmern und der geplanten Dauer." },
      { displayText: "Protokoll zusammenfassen", fullPrompt: "Ich habe Notizen von einem Meeting und moechte daraus ein strukturiertes Protokoll erstellen." },
      { displayText: "Action Items extrahieren", fullPrompt: "Hilf mir, aus Meeting-Notizen die konkreten Action Items mit Verantwortlichen und Deadlines zu extrahieren." },
    ],
    "doc-search": [
      { displayText: "Dokument zusammenfassen", fullPrompt: "Ich habe ein Dokument und moechte die wichtigsten Punkte zusammengefasst bekommen." },
      { displayText: "Information in Dokumenten finden", fullPrompt: "Ich suche eine bestimmte Information in unseren Dokumenten. Bitte frage mich, wonach ich suche." },
      { displayText: "Dokumente vergleichen", fullPrompt: "Ich moechte zwei Dokumente vergleichen und die Unterschiede herausarbeiten." },
    ],
    "task-management": [
      { displayText: "Aufgabenliste erstellen", fullPrompt: "Ich brauche eine strukturierte Aufgabenliste fuer ein Projekt. Bitte frage mich nach dem Projekt und den Zielen." },
      { displayText: "Prioritaeten setzen", fullPrompt: "Hilf mir, meine aktuellen Aufgaben nach Prioritaet und Dringlichkeit zu sortieren." },
      { displayText: "Projekt-Status zusammenfassen", fullPrompt: "Ich moechte einen Ueberblick ueber den Status meiner laufenden Aufgaben erstellen." },
    ],
  };

  // Default starters if no specific ones exist
  const defaultStarters = [
    { displayText: "Wie kannst du mir helfen?", fullPrompt: "Erklaere mir kurz, was du alles fuer mich tun kannst und wie ich am besten mit dir arbeite." },
    { displayText: "Neue Aufgabe starten", fullPrompt: "Ich habe eine neue Aufgabe fuer dich. Bitte frage mich, was genau ich brauche." },
    { displayText: "Letzte Arbeit fortsetzen", fullPrompt: "Ich moechte an meiner letzten Aufgabe weiterarbeiten. Hilf mir, den Faden wieder aufzunehmen." },
  ];

  const starters = startersByTask[task] || defaultStarters;

  // Determine icon
  const iconMap: Record<string, string> = {
    content: "PenTool",
    data: "BarChart3",
    communication: "Mail",
    knowledge: "Search",
    process: "ClipboardList",
  };

  // Determine tags
  const tagMap: Record<string, { id: string; name: string; color: string }> = {
    content: { id: "creative", name: "Creative", color: "#10B981" },
    data: { id: "productivity", name: "Productivity", color: "#3B82F6" },
    communication: { id: "business", name: "Business", color: "#8B5CF6" },
    knowledge: { id: "education", name: "Education", color: "#F59E0B" },
    process: { id: "productivity", name: "Productivity", color: "#3B82F6" },
  };

  return {
    title,
    description,
    systemPrompt,
    starters,
    icon: iconMap[useCase] || "MessageSquare",
    tags: [tagMap[useCase] || { id: "productivity", name: "Productivity", color: "#3B82F6" }],
  };
}

const AssistantCreatorWizard = ({ open, onClose, onCreateAssistant }: AssistantCreatorWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [creationComplete, setCreationComplete] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<ReturnType<typeof generateAssistantConfig> | null>(null);

  if (!open) return null;

  const getStepsWithDynamicOptions = (): WizardStep[] => {
    return wizardSteps.map(step => {
      if (step.id === "task") {
        const selectedUseCase = selections["use-case"] as string;
        return {
          ...step,
          options: taskOptionsByUseCase[selectedUseCase] || [],
        };
      }
      return step;
    });
  };

  const steps = getStepsWithDynamicOptions();
  const step = steps[currentStep];
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / (totalSteps + 1)) * 100; // +1 for creation step

  const handleSelect = (optionId: string) => {
    if (step.multiSelect) {
      const current = (selections[step.id] as string[]) || [];
      if (optionId === "none") {
        setSelections(prev => ({ ...prev, [step.id]: ["none"] }));
      } else {
        const filtered = current.filter(id => id !== "none");
        const updated = filtered.includes(optionId)
          ? filtered.filter(id => id !== optionId)
          : [...filtered, optionId];
        setSelections(prev => ({ ...prev, [step.id]: updated }));
      }
    } else {
      setSelections(prev => ({ ...prev, [step.id]: optionId }));
      // Auto-advance for single select
      setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          handleCreate();
        }
      }, 300);
    }
  };

  const isSelected = (optionId: string) => {
    const val = selections[step.id];
    if (Array.isArray(val)) return val.includes(optionId);
    return val === optionId;
  };

  const canProceed = () => {
    const val = selections[step.id];
    if (Array.isArray(val)) return val.length > 0;
    return !!val;
  };

  const handleCreate = async () => {
    setIsCreating(true);
    // Simulate creation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    const config = generateAssistantConfig(selections);
    setGeneratedConfig(config);
    setIsCreating(false);
    setCreationComplete(true);
  };

  const handleConfirm = () => {
    if (generatedConfig) {
      onCreateAssistant(generatedConfig);
      toast.success(`"${generatedConfig.title}" wurde erfolgreich erstellt`);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelections({});
    setIsCreating(false);
    setCreationComplete(false);
    setGeneratedConfig(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Creation / generating screen
  if (isCreating) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Dein Assistent wird erstellt</h2>
            <p className="text-muted-foreground">Basierend auf deinen Angaben wird der optimale Assistent konfiguriert...</p>
          </div>
          <Progress value={66} className="w-64 mx-auto" />
        </div>
      </div>
    );
  }

  // Success screen
  if (creationComplete && generatedConfig) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-auto">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <button onClick={handleClose} className="absolute top-6 right-6 p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Dein Assistent ist fertig</h2>
            <p className="text-muted-foreground">Hier ist eine Vorschau deines neuen Assistenten.</p>
          </div>

          {/* Preview Card */}
          <Card className="p-6 mb-6 border-2 border-primary/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{generatedConfig.title}</h3>
                <p className="text-sm text-muted-foreground">{generatedConfig.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {generatedConfig.tags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {(selections["integrations"] as string[])?.filter(i => i !== "none").map(integration => (
                <Badge key={integration} variant="outline" className="text-xs">
                  {integration === "outlook" ? "Outlook" : 
                   integration === "sharepoint" ? "SharePoint" :
                   integration === "teams" ? "Teams" :
                   integration === "calendar" ? "Kalender" :
                   integration === "crm" ? "CRM" : integration}
                </Badge>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Schnellstart-Aktionen:</p>
              {generatedConfig.starters.map((starter, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer">
                  <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{starter.displayText}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* System Prompt Preview (collapsible) */}
          <details className="mb-8">
            <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              System-Prompt anzeigen
            </summary>
            <Card className="mt-3 p-4">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {generatedConfig.systemPrompt}
              </pre>
            </Card>
          </details>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Nochmal anpassen
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Assistent erstellen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step view
  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            <span className="text-sm text-muted-foreground">Schritt {currentStep + 1} von {totalSteps}</span>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="mb-10 h-1" />

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">{step.title}</h2>
          <p className="text-muted-foreground">{step.subtitle}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {step.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                isSelected(option.id)
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-accent/50"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isSelected(option.id) ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
              }`}>
                {option.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground">{option.label}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{option.description}</div>
              </div>
              {step.multiSelect && isSelected(option.id) && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Multi-select continue button */}
        {step.multiSelect && (
          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => {
                if (currentStep < totalSteps - 1) {
                  setCurrentStep(prev => prev + 1);
                } else {
                  handleCreate();
                }
              }}
              disabled={!canProceed()}
            >
              Weiter
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantCreatorWizard;
