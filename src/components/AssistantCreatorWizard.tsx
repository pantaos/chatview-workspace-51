import { useState } from "react";
import {
  X, ChevronRight, ChevronLeft, Check, Sparkles,
  FileText, BarChart3, Mail, Users, Headphones,
  Calendar, Database, Globe, Shield, Zap,
  MessageSquare, PenTool, Search, ClipboardList, BookOpen,
  ArrowRight, Loader2, Upload, TrendingUp, DollarSign,
  UserCheck, Megaphone, Briefcase, HelpCircle, FolderOpen
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

// Step 1: Departments
const departments: WizardOption[] = [
  { id: "sales", label: "Vertrieb / Sales", description: "Angebote, Kundenkommunikation, Pipeline-Management, CRM-Pflege", icon: <TrendingUp className="w-6 h-6" /> },
  { id: "marketing", label: "Marketing", description: "Kampagnen, Content-Erstellung, Social Media, Analysen", icon: <Megaphone className="w-6 h-6" /> },
  { id: "finance", label: "Finance / Controlling", description: "Budgetierung, Reporting, Rechnungsstellung, Kostenanalysen", icon: <DollarSign className="w-6 h-6" /> },
  { id: "hr", label: "HR / Personal", description: "Recruiting, Onboarding, Personalverwaltung, Mitarbeiterkommunikation", icon: <UserCheck className="w-6 h-6" /> },
  { id: "general", label: "Allgemein / Andere", description: "Abteilungsuebergreifend oder keiner bestimmten Abteilung zugeordnet", icon: <Briefcase className="w-6 h-6" /> },
];

// Step 2: Tasks per department (anticipative, realistic)
const tasksByDepartment: Record<string, WizardOption[]> = {
  sales: [
    { id: "proposal-creation", label: "Angebote erstellen", description: "Angebotsdokumente aus Kundenanfragen zusammenstellen und formulieren", icon: <FileText className="w-6 h-6" /> },
    { id: "lead-qualification", label: "Leads qualifizieren", description: "Eingehende Anfragen bewerten und priorisieren", icon: <Search className="w-6 h-6" /> },
    { id: "crm-maintenance", label: "CRM aktuell halten", description: "Kundendaten, Aktivitaeten und Pipeline-Status pflegen", icon: <Database className="w-6 h-6" /> },
    { id: "customer-followup", label: "Kunden nachfassen", description: "Follow-ups nach Meetings oder Angeboten vorbereiten und versenden", icon: <Mail className="w-6 h-6" /> },
    { id: "sales-reporting", label: "Vertriebsberichte erstellen", description: "Wochen- oder Monatsberichte zu Umsatz, Pipeline und Aktivitaeten", icon: <BarChart3 className="w-6 h-6" /> },
  ],
  marketing: [
    { id: "campaign-content", label: "Kampagnen-Texte verfassen", description: "E-Mail-Kampagnen, Landingpages und Werbetexte erstellen", icon: <PenTool className="w-6 h-6" /> },
    { id: "social-media-mgmt", label: "Social Media bespielen", description: "Posts planen, texten und Redaktionsplaene erstellen", icon: <Globe className="w-6 h-6" /> },
    { id: "market-research", label: "Marktrecherchen durchfuehren", description: "Wettbewerber analysieren, Trends identifizieren, Zielgruppen verstehen", icon: <Search className="w-6 h-6" /> },
    { id: "event-planning", label: "Events und Webinare planen", description: "Einladungen, Ablaufplaene und Nachbereitungen organisieren", icon: <Calendar className="w-6 h-6" /> },
    { id: "marketing-reporting", label: "Performance-Reports erstellen", description: "Kampagnen-Ergebnisse auswerten und aufbereiten", icon: <BarChart3 className="w-6 h-6" /> },
  ],
  finance: [
    { id: "invoice-processing", label: "Rechnungen bearbeiten", description: "Eingangsrechnungen pruefen, zuordnen und zur Freigabe vorbereiten", icon: <FileText className="w-6 h-6" /> },
    { id: "budget-planning", label: "Budgets planen und ueberwachen", description: "Kostenplaene erstellen, Abweichungen erkennen und dokumentieren", icon: <BarChart3 className="w-6 h-6" /> },
    { id: "financial-reporting", label: "Monats-/Quartalsberichte erstellen", description: "Finanzkennzahlen zusammenstellen und kommentieren", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "expense-management", label: "Reisekosten und Spesen", description: "Abrechnungen pruefen, kategorisieren und freigeben", icon: <DollarSign className="w-6 h-6" /> },
    { id: "audit-preparation", label: "Audit-Unterlagen vorbereiten", description: "Dokumente fuer interne oder externe Pruefungen zusammenstellen", icon: <Shield className="w-6 h-6" /> },
  ],
  hr: [
    { id: "recruiting-support", label: "Bewerbungen bearbeiten", description: "Stellenausschreibungen formulieren, Bewerbungen sichten und bewerten", icon: <Users className="w-6 h-6" /> },
    { id: "onboarding-process", label: "Onboarding neuer Mitarbeiter", description: "Checklisten, Informationspakete und Einarbeitungsplaene erstellen", icon: <UserCheck className="w-6 h-6" /> },
    { id: "employee-communication", label: "Mitarbeiterkommunikation", description: "Ankuendigungen, Newsletter und interne Updates verfassen", icon: <MessageSquare className="w-6 h-6" /> },
    { id: "contract-management", label: "Vertraege und Dokumente", description: "Arbeitsvertraege, Zeugnisse und Bescheinigungen vorbereiten", icon: <FileText className="w-6 h-6" /> },
    { id: "training-coordination", label: "Weiterbildungen koordinieren", description: "Schulungsangebote zusammenstellen und Teilnahmen organisieren", icon: <BookOpen className="w-6 h-6" /> },
  ],
  general: [
    { id: "email-management", label: "E-Mails verfassen und beantworten", description: "Professionelle E-Mails schnell und fehlerfrei formulieren", icon: <Mail className="w-6 h-6" /> },
    { id: "meeting-support", label: "Meetings vor- und nachbereiten", description: "Agenden erstellen, Protokolle schreiben, Action Items extrahieren", icon: <Calendar className="w-6 h-6" /> },
    { id: "document-creation", label: "Dokumente und Berichte erstellen", description: "Texte, Zusammenfassungen und Praesentationen verfassen", icon: <FileText className="w-6 h-6" /> },
    { id: "information-gathering", label: "Informationen zusammentragen", description: "Recherchen durchfuehren und aus verschiedenen Quellen buendeln", icon: <Search className="w-6 h-6" /> },
    { id: "task-coordination", label: "Aufgaben koordinieren", description: "To-dos verwalten, Prioritaeten setzen, Ueberblick behalten", icon: <ClipboardList className="w-6 h-6" /> },
  ],
};

// Step 3: Pain Points per task (anticipative)
const painPointsByTask: Record<string, WizardOption[]> = {
  // Sales
  "proposal-creation": [
    { id: "manual-assembly", label: "Ich stelle Angebote manuell aus vielen Quellen zusammen", description: "Preislisten, Vorlagen, Kundendaten - alles muss einzeln zusammengesucht werden", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "inconsistent-quality", label: "Angebote sehen jedes Mal anders aus", description: "Kein einheitliches Format, unterschiedliche Qualitaet je nach Verfasser", icon: <FileText className="w-6 h-6" /> },
    { id: "slow-turnaround", label: "Angebotserstellung dauert zu lange", description: "Kunden warten tagelang, weil interne Abstimmung Zeit frisst", icon: <Zap className="w-6 h-6" /> },
    { id: "missing-info", label: "Mir fehlen oft wichtige Informationen", description: "Ich muss bei Kollegen nachfragen, bevor ich ein Angebot fertigstellen kann", icon: <HelpCircle className="w-6 h-6" /> },
  ],
  "lead-qualification": [
    { id: "no-criteria", label: "Mir fehlen klare Kriterien zur Bewertung", description: "Ich weiss nicht genau, welche Leads Prioritaet haben sollten", icon: <HelpCircle className="w-6 h-6" /> },
    { id: "scattered-data", label: "Lead-Infos sind ueber viele Tools verstreut", description: "E-Mails, CRM, LinkedIn - ich muss ueberall nachschauen", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "time-consuming", label: "Die Recherche zu jedem Lead dauert zu lange", description: "Manuell Firmeninfos und Ansprechpartner zusammentragen kostet viel Zeit", icon: <Zap className="w-6 h-6" /> },
  ],
  "crm-maintenance": [
    { id: "forgotten-updates", label: "Ich vergesse oft, das CRM zu aktualisieren", description: "Nach Meetings oder Telefonaten bleibt die Dokumentation liegen", icon: <Database className="w-6 h-6" /> },
    { id: "duplicate-entries", label: "Es gibt viele Duplikate und veraltete Daten", description: "Die Datenqualitaet im CRM ist schlecht", icon: <Shield className="w-6 h-6" /> },
    { id: "manual-entry", label: "Dateneingabe ist reine Fleissarbeit", description: "Ich tippe immer wieder dieselben Informationen manuell ein", icon: <Zap className="w-6 h-6" /> },
  ],
  "customer-followup": [
    { id: "forget-followups", label: "Ich vergesse Follow-ups oder mache sie zu spaet", description: "Ohne Erinnerung bleiben wichtige Nachfassaktionen liegen", icon: <Calendar className="w-6 h-6" /> },
    { id: "repetitive-texts", label: "Ich schreibe immer wieder aehnliche Texte", description: "Follow-up-Mails aehneln sich, aber ich formuliere jedes Mal neu", icon: <PenTool className="w-6 h-6" /> },
    { id: "no-context", label: "Mir fehlt der Kontext zum letzten Gespraech", description: "Ich muss erst in Notizen und E-Mails suchen, was besprochen wurde", icon: <Search className="w-6 h-6" /> },
  ],
  "sales-reporting": [
    { id: "data-collection", label: "Daten aus verschiedenen Systemen zusammensuchen", description: "CRM, Excel, E-Mails - die Zahlen liegen ueberall verstreut", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "formatting-effort", label: "Berichte muessen immer wieder formatiert werden", description: "Viel Zeit geht fuer Layout und Darstellung drauf", icon: <FileText className="w-6 h-6" /> },
    { id: "lack-of-insights", label: "Mir fehlen oft die richtigen Kennzahlen", description: "Ich weiss nicht genau, welche KPIs relevant sind", icon: <BarChart3 className="w-6 h-6" /> },
  ],
  // Marketing
  "campaign-content": [
    { id: "writers-block", label: "Mir faellt oft nichts Passendes ein", description: "Der Einstieg in neue Texte kostet mich viel Zeit und Energie", icon: <PenTool className="w-6 h-6" /> },
    { id: "brand-consistency", label: "Texte passen nicht immer zur Markensprache", description: "Unterschiedliche Verfasser schreiben in unterschiedlichem Stil", icon: <Shield className="w-6 h-6" /> },
    { id: "repetitive-writing", label: "Ich schreibe immer wieder aehnliche Texte", description: "Variationen fuer verschiedene Kanaele sind muehsam", icon: <Zap className="w-6 h-6" /> },
  ],
  "social-media-mgmt": [
    { id: "content-ideas", label: "Mir gehen die Content-Ideen aus", description: "Regelmaessig frischen Content zu liefern ist anstrengend", icon: <HelpCircle className="w-6 h-6" /> },
    { id: "platform-adaptation", label: "Jede Plattform braucht anderen Content", description: "LinkedIn, Instagram, Twitter - ueberall andere Formate und Toene", icon: <Globe className="w-6 h-6" /> },
    { id: "scheduling-chaos", label: "Der Redaktionsplan ist chaotisch", description: "Posts werden ad-hoc erstellt statt strategisch geplant", icon: <Calendar className="w-6 h-6" /> },
  ],
  "market-research": [
    { id: "info-overload", label: "Zu viele Quellen, zu wenig Struktur", description: "Informationen sind ueberall, aber ich verliere den Ueberblick", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "outdated-data", label: "Meine Marktdaten sind oft veraltet", description: "Es ist schwer, immer aktuelle Informationen zu haben", icon: <Database className="w-6 h-6" /> },
    { id: "analysis-paralysis", label: "Ich weiss nicht, wo ich anfangen soll", description: "Die Menge an Informationen ueberfordert mich", icon: <HelpCircle className="w-6 h-6" /> },
  ],
  "event-planning": [
    { id: "coordination-overhead", label: "Die Abstimmung mit allen Beteiligten ist aufwendig", description: "Viele E-Mails und Rueckfragen bis alles steht", icon: <Users className="w-6 h-6" /> },
    { id: "template-missing", label: "Ich erstelle jedes Mal alles von Grund auf", description: "Keine wiederverwendbaren Vorlagen fuer Einladungen und Ablaufplaene", icon: <FileText className="w-6 h-6" /> },
    { id: "followup-forgotten", label: "Die Nachbereitung geht oft unter", description: "Feedback einholen und Ergebnisse dokumentieren wird vergessen", icon: <ClipboardList className="w-6 h-6" /> },
  ],
  "marketing-reporting": [
    { id: "data-collection", label: "Daten aus verschiedenen Tools zusammentragen", description: "Google Analytics, Social Media, E-Mail-Tool - alles separat", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "visualization-effort", label: "Die Aufbereitung kostet zu viel Zeit", description: "Aus Rohdaten ansprechende Charts und Berichte machen ist muehsam", icon: <BarChart3 className="w-6 h-6" /> },
    { id: "no-actionable-insights", label: "Berichte fuehren selten zu konkreten Massnahmen", description: "Zahlen sind da, aber Handlungsempfehlungen fehlen", icon: <Zap className="w-6 h-6" /> },
  ],
  // Finance
  "invoice-processing": [
    { id: "manual-checking", label: "Jede Rechnung muss manuell geprueft werden", description: "Betraege, Kontierungen und Genehmigungen einzeln kontrollieren", icon: <Shield className="w-6 h-6" /> },
    { id: "lost-invoices", label: "Rechnungen gehen in der E-Mail-Flut unter", description: "Ohne klaren Prozess werden Rechnungen zu spaet bearbeitet", icon: <Mail className="w-6 h-6" /> },
    { id: "approval-delays", label: "Freigaben dauern zu lange", description: "Verantwortliche reagieren nicht rechtzeitig", icon: <Zap className="w-6 h-6" /> },
  ],
  "budget-planning": [
    { id: "scattered-data", label: "Budgetdaten liegen in verschiedenen Tabellen", description: "Kein zentraler Ueberblick ueber alle Kostenstelllen", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "version-chaos", label: "Viele Versionen, keine Uebersicht", description: "Verschiedene Excel-Dateien mit unterschiedlichen Staenden", icon: <FileText className="w-6 h-6" /> },
    { id: "deviation-detection", label: "Abweichungen werden zu spaet erkannt", description: "Budget-Ueberschreitungen fallen erst am Monatsende auf", icon: <BarChart3 className="w-6 h-6" /> },
  ],
  "financial-reporting": [
    { id: "data-collection", label: "Daten aus ERP und Buchhaltung zusammenfuehren", description: "Manuelle Konsolidierung aus verschiedenen Systemen", icon: <Database className="w-6 h-6" /> },
    { id: "formatting-effort", label: "Berichte muessen immer gleich aussehen", description: "Viel Zeit fuer Formatierung und Standardisierung", icon: <FileText className="w-6 h-6" /> },
    { id: "commentary-writing", label: "Kommentare zu Zahlen schreiben ist zeitaufwendig", description: "Jede Abweichung muss erklaert und bewertet werden", icon: <PenTool className="w-6 h-6" /> },
  ],
  "expense-management": [
    { id: "receipt-chaos", label: "Belege gehen verloren oder sind unvollstaendig", description: "Mitarbeiter reichen Belege zu spaet oder falsch ein", icon: <FileText className="w-6 h-6" /> },
    { id: "policy-checking", label: "Richtlinien-Konformitaet manuell pruefen", description: "Jede Abrechnung einzeln gegen Reiserichtlinien pruefen", icon: <Shield className="w-6 h-6" /> },
    { id: "categorization", label: "Ausgaben muessen manuell kategorisiert werden", description: "Kostenstelle, Projekt und Kategorie zuordnen ist muehsam", icon: <ClipboardList className="w-6 h-6" /> },
  ],
  "audit-preparation": [
    { id: "document-search", label: "Unterlagen zusammensuchen kostet Tage", description: "Dokumente liegen in verschiedenen Ordnern und Systemen", icon: <Search className="w-6 h-6" /> },
    { id: "completeness-check", label: "Ich bin unsicher, ob alles vollstaendig ist", description: "Keine klare Checkliste, was der Pruefer braucht", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "last-minute-prep", label: "Vorbereitung passiert immer auf den letzten Druecker", description: "Keine laufende Dokumentation, alles wird kurz vorher zusammengesucht", icon: <Zap className="w-6 h-6" /> },
  ],
  // HR
  "recruiting-support": [
    { id: "job-posting-effort", label: "Stellenausschreibungen formulieren dauert lange", description: "Jede Stelle braucht einen eigenen, ansprechenden Text", icon: <PenTool className="w-6 h-6" /> },
    { id: "screening-volume", label: "Zu viele Bewerbungen, zu wenig Zeit", description: "Hunderte Bewerbungen sichten und vergleichen ist ueberwältigend", icon: <Users className="w-6 h-6" /> },
    { id: "candidate-communication", label: "Kommunikation mit Bewerbern ist muehsam", description: "Zu- und Absagen, Terminvereinbarungen - viele einzelne Nachrichten", icon: <Mail className="w-6 h-6" /> },
  ],
  "onboarding-process": [
    { id: "checklist-tracking", label: "Onboarding-Checklisten werden nicht konsequent abgearbeitet", description: "Schritte werden vergessen oder in falscher Reihenfolge gemacht", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "info-package", label: "Jeder neue Mitarbeiter stellt dieselben Fragen", description: "Keine zentrale Wissensquelle fuer neue Kollegen", icon: <BookOpen className="w-6 h-6" /> },
    { id: "stakeholder-coordination", label: "Abstimmung zwischen IT, HR und Fachabteilung ist komplex", description: "Viele Beteiligte muessen koordiniert werden", icon: <Users className="w-6 h-6" /> },
  ],
  "employee-communication": [
    { id: "repetitive-messages", label: "Ich schreibe immer wieder aehnliche Nachrichten", description: "Geburtstage, Jubilaeen, Richtlinien-Updates - aehnliche Texte", icon: <PenTool className="w-6 h-6" /> },
    { id: "tone-consistency", label: "Der Ton soll professionell aber nahbar sein", description: "Die richtige Balance zu finden ist schwierig", icon: <MessageSquare className="w-6 h-6" /> },
    { id: "reach-all", label: "Nicht alle Mitarbeiter werden erreicht", description: "Wichtige Infos gehen in der E-Mail-Flut unter", icon: <Mail className="w-6 h-6" /> },
  ],
  "contract-management": [
    { id: "template-outdated", label: "Vorlagen sind veraltet oder nicht auffindbar", description: "Verschiedene Versionen kursieren im Unternehmen", icon: <FileText className="w-6 h-6" /> },
    { id: "individual-adjustments", label: "Jeder Vertrag braucht individuelle Anpassungen", description: "Standard-Vorlagen muessen immer wieder manuell geaendert werden", icon: <PenTool className="w-6 h-6" /> },
    { id: "deadline-tracking", label: "Fristen werden verpasst", description: "Probezeiten, Vertragsverlaengerungen und Kuendigungsfristen", icon: <Calendar className="w-6 h-6" /> },
  ],
  "training-coordination": [
    { id: "overview-missing", label: "Kein Ueberblick ueber Weiterbildungsbedarf", description: "Wer braucht welche Schulung? Das ist unklar", icon: <HelpCircle className="w-6 h-6" /> },
    { id: "booking-management", label: "Anmeldungen und Terminfindung sind aufwendig", description: "Viele E-Mails und Rueckfragen fuer jede Schulung", icon: <Calendar className="w-6 h-6" /> },
    { id: "documentation-gap", label: "Schulungsnachweise fehlen", description: "Teilnahmen werden nicht systematisch dokumentiert", icon: <ClipboardList className="w-6 h-6" /> },
  ],
  // General
  "email-management": [
    { id: "repetitive-texts", label: "Ich schreibe immer wieder aehnliche Texte", description: "Standardantworten und Formulierungen wiederholen sich staendig", icon: <PenTool className="w-6 h-6" /> },
    { id: "time-consuming", label: "E-Mails kosten mich zu viel Zeit am Tag", description: "Ich verbringe Stunden mit dem Formulieren von Nachrichten", icon: <Zap className="w-6 h-6" /> },
    { id: "tone-difficulty", label: "Den richtigen Ton zu treffen ist schwierig", description: "Formell, freundlich, bestimmt - je nach Empfaenger unterschiedlich", icon: <MessageSquare className="w-6 h-6" /> },
  ],
  "meeting-support": [
    { id: "no-agenda", label: "Meetings haben oft keine klare Agenda", description: "Ohne Struktur werden Meetings ineffizient", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "protocol-forgotten", label: "Protokolle werden selten geschrieben", description: "Ergebnisse und Aufgaben gehen nach dem Meeting verloren", icon: <FileText className="w-6 h-6" /> },
    { id: "action-items-lost", label: "Action Items werden nicht nachverfolgt", description: "Vereinbarte Aufgaben geraten in Vergessenheit", icon: <ClipboardList className="w-6 h-6" /> },
  ],
  "document-creation": [
    { id: "blank-page", label: "Der Anfang faellt mir immer schwer", description: "Vor dem leeren Dokument sitzen und nicht wissen, wie anfangen", icon: <PenTool className="w-6 h-6" /> },
    { id: "structure-unclear", label: "Ich weiss nicht, wie ich den Text strukturieren soll", description: "Gliederung und Aufbau kosten viel Ueberlegung", icon: <FileText className="w-6 h-6" /> },
    { id: "version-management", label: "Viele Versionen, keine Uebersicht", description: "Dokument_v2_final_FINAL.docx - welches ist das aktuelle?", icon: <FolderOpen className="w-6 h-6" /> },
  ],
  "information-gathering": [
    { id: "scattered-sources", label: "Informationen liegen in vielen verschiedenen Tools", description: "SharePoint, E-Mails, Teams, CRM - ueberall muss ich suchen", icon: <FolderOpen className="w-6 h-6" /> },
    { id: "time-wasted", label: "Ich suche laenger als ich eigentlich arbeite", description: "Die Recherche dauert oft laenger als die eigentliche Aufgabe", icon: <Zap className="w-6 h-6" /> },
    { id: "outdated-info", label: "Ich bin mir nie sicher, ob die Info aktuell ist", description: "Veraltete Dokumente und widersprueechliche Informationen", icon: <HelpCircle className="w-6 h-6" /> },
  ],
  "task-coordination": [
    { id: "lost-overview", label: "Ich verliere den Ueberblick ueber meine Aufgaben", description: "To-dos in E-Mails, Notizen, Teams - nichts ist zentral", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "priority-unclear", label: "Mir faellt es schwer, Prioritaeten zu setzen", description: "Alles scheint dringend, aber ich weiss nicht, was zuerst", icon: <HelpCircle className="w-6 h-6" /> },
    { id: "delegation-hard", label: "Aufgaben delegieren ist umstaendlich", description: "Auftraege klar formulieren und nachverfolgen kostet Zeit", icon: <Users className="w-6 h-6" /> },
  ],
};

// Step 4: Concretization suggestions based on pain points
interface ConcretizationSuggestion {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  type: "integration" | "knowledge" | "feature";
}

const getConcretizationSuggestions = (
  department: string,
  task: string,
  painPoints: string[]
): ConcretizationSuggestion[] => {
  const suggestions: ConcretizationSuggestion[] = [];

  // Integration suggestions based on pain points
  const needsEmailAccess = painPoints.some(p =>
    ["repetitive-texts", "customer-followup", "candidate-communication", "reach-all",
     "lost-invoices", "forget-followups", "repetitive-messages", "time-consuming",
     "tone-difficulty"].includes(p)
  );
  const needsDocumentAccess = painPoints.some(p =>
    ["manual-assembly", "scattered-data", "document-search", "template-outdated",
     "info-package", "scattered-sources", "version-management", "version-chaos",
     "template-missing", "blank-page", "data-collection"].includes(p)
  );
  const needsCalendarAccess = painPoints.some(p =>
    ["forget-followups", "coordination-overhead", "booking-management", "deadline-tracking",
     "scheduling-chaos", "no-agenda", "followup-forgotten"].includes(p)
  );
  const needsTeamsAccess = painPoints.some(p =>
    ["stakeholder-coordination", "coordination-overhead", "action-items-lost",
     "protocol-forgotten", "reach-all"].includes(p)
  );
  const needsCrmAccess = ["sales"].includes(department) || painPoints.some(p =>
    ["crm-maintenance", "forgotten-updates", "scattered-data", "no-context",
     "duplicate-entries", "manual-entry"].includes(p)
  );

  if (needsEmailAccess) {
    suggestions.push({
      id: "outlook", label: "Microsoft Outlook anbinden",
      description: "E-Mails lesen, verfassen und automatisch verarbeiten",
      icon: <Mail className="w-6 h-6" />, type: "integration"
    });
  }
  if (needsDocumentAccess) {
    suggestions.push({
      id: "sharepoint", label: "SharePoint / OneDrive anbinden",
      description: "Auf Dokumente, Vorlagen und Dateien zugreifen",
      icon: <Database className="w-6 h-6" />, type: "integration"
    });
  }
  if (needsCalendarAccess) {
    suggestions.push({
      id: "calendar", label: "Kalender anbinden",
      description: "Termine einsehen, Erinnerungen setzen, Verfuegbarkeiten pruefen",
      icon: <Calendar className="w-6 h-6" />, type: "integration"
    });
  }
  if (needsTeamsAccess) {
    suggestions.push({
      id: "teams", label: "Microsoft Teams anbinden",
      description: "Chat-Nachrichten und Meeting-Informationen nutzen",
      icon: <MessageSquare className="w-6 h-6" />, type: "integration"
    });
  }
  if (needsCrmAccess) {
    suggestions.push({
      id: "crm", label: "CRM-System anbinden",
      description: "Kundendaten, Pipeline und Vertriebsaktivitaeten nutzen",
      icon: <Users className="w-6 h-6" />, type: "integration"
    });
  }

  // Knowledge base suggestions
  const needsTemplates = painPoints.some(p =>
    ["inconsistent-quality", "template-outdated", "template-missing", "brand-consistency",
     "individual-adjustments", "formatting-effort", "blank-page", "structure-unclear",
     "repetitive-writing", "repetitive-texts", "repetitive-messages"].includes(p)
  );
  const needsGuidelines = painPoints.some(p =>
    ["no-criteria", "policy-checking", "completeness-check", "overview-missing",
     "no-actionable-insights", "priority-unclear", "tone-consistency", "tone-difficulty"].includes(p)
  );

  if (needsTemplates) {
    suggestions.push({
      id: "templates", label: "Vorlagen in Knowledge Base hinterlegen",
      description: "Bestehende Vorlagen hochladen, damit der Assistent sie als Basis nutzt",
      icon: <Upload className="w-6 h-6" />, type: "knowledge"
    });
  }
  if (needsGuidelines) {
    suggestions.push({
      id: "guidelines", label: "Richtlinien und Leitfaeden hochladen",
      description: "Interne Richtlinien bereitstellen, damit der Assistent sie einhaelt",
      icon: <BookOpen className="w-6 h-6" />, type: "knowledge"
    });
  }

  // Always offer these if not already suggested
  if (!needsTemplates && !needsGuidelines) {
    suggestions.push({
      id: "knowledge-general", label: "Eigene Dokumente als Wissensbasis nutzen",
      description: "PDFs, Word-Dateien oder andere Unterlagen hochladen, die der Assistent kennen soll",
      icon: <Upload className="w-6 h-6" />, type: "knowledge"
    });
  }

  // Feature suggestion
  suggestions.push({
    id: "no-extras", label: "Keine weiteren Anbindungen noetig",
    description: "Der Assistent soll eigenstaendig ohne externe Tools arbeiten",
    icon: <Shield className="w-6 h-6" />, type: "feature"
  });

  return suggestions;
};


// ---- Config generation ----

function generateAssistantConfig(
  department: string,
  task: string,
  painPoints: string[],
  concretizations: string[],
  freeTextTask: string,
  freeTextPain: string
) {
  const deptLabels: Record<string, string> = {
    sales: "Vertrieb", marketing: "Marketing", finance: "Finance",
    hr: "HR", general: "Allgemein"
  };

  const taskOptions = tasksByDepartment[department] || [];
  const taskLabel = taskOptions.find(t => t.id === task)?.label || freeTextTask || "Allgemeine Aufgabe";
  const taskDesc = taskOptions.find(t => t.id === task)?.description || freeTextTask || "";

  const title = `${taskLabel}-Assistent`;
  const description = `Unterstuetzt im Bereich ${deptLabels[department] || "Allgemein"}: ${taskDesc}`;

  // Gather selected pain point labels for system prompt
  const allPainOptions = painPointsByTask[task] || [];
  const selectedPainLabels = allPainOptions
    .filter(p => painPoints.includes(p.id))
    .map(p => p.label);
  if (freeTextPain) selectedPainLabels.push(freeTextPain);

  // Build integrations from concretizations
  const integrationIds = ["outlook", "sharepoint", "calendar", "teams", "crm"];
  const selectedIntegrations = concretizations.filter(c => integrationIds.includes(c));
  const wantsKnowledge = concretizations.some(c => ["templates", "guidelines", "knowledge-general"].includes(c));

  const integrationDescriptions: Record<string, string> = {
    outlook: "Du hast Zugriff auf Microsoft Outlook. Du kannst E-Mails lesen, verfassen und organisieren.",
    sharepoint: "Du hast Zugriff auf SharePoint und OneDrive. Du kannst Dokumente suchen, lesen und als Vorlagen nutzen.",
    calendar: "Du hast Zugriff auf den Kalender. Du kannst Termine einsehen, Erinnerungen vorschlagen und Verfuegbarkeiten pruefen.",
    teams: "Du hast Zugriff auf Microsoft Teams. Du kannst Chat-Nachrichten senden und Meeting-Informationen abrufen.",
    crm: "Du hast Zugriff auf das CRM-System. Du kannst Kundendaten einsehen und Vertriebsprozesse unterstuetzen.",
  };

  const systemPrompt = [
    `Du bist ein spezialisierter KI-Assistent fuer die Abteilung ${deptLabels[department] || "Allgemein"}.`,
    `Deine Hauptaufgabe: ${taskLabel} - ${taskDesc}.`,
    "",
    "Der Nutzer hat folgende konkrete Herausforderungen beschrieben, die du gezielt loesen sollst:",
    ...selectedPainLabels.map(p => `- ${p}`),
    "",
    selectedIntegrations.length > 0
      ? "Verfuegbare Integrationen:\n" + selectedIntegrations.map(i => integrationDescriptions[i]).join("\n")
      : "",
    "",
    wantsKnowledge
      ? "Der Nutzer hat Dokumente in der Knowledge Base hinterlegt. Nutze diese als Referenz fuer Vorlagen, Richtlinien und Informationen. Beziehe dich aktiv darauf, wenn es relevant ist."
      : "",
    "",
    "Wichtige Regeln:",
    "- Antworte immer auf Deutsch, es sei denn, der Nutzer schreibt in einer anderen Sprache.",
    "- Frage nach, wenn dir wichtige Informationen fehlen, anstatt Annahmen zu treffen.",
    "- Halte dich an Unternehmensrichtlinien und behandle alle Informationen vertraulich.",
    "- Wenn du dir bei etwas unsicher bist, kommuniziere das transparent.",
    "- Formuliere Antworten so, dass sie direkt verwendbar sind - keine generischen Textbausteine.",
    "- Beruecksichtige den spezifischen Kontext des Nutzers und seine Abteilung.",
  ].filter(Boolean).join("\n");

  // Generate conversation starters based on task and pain points
  const starterTemplates: Record<string, Array<{ displayText: string; fullPrompt: string }>> = {
    "proposal-creation": [
      { displayText: "Angebot aus Kundenanfrage erstellen", fullPrompt: "Ich habe eine Kundenanfrage erhalten und moechte daraus ein Angebot erstellen. Bitte frage mich nach den Details der Anfrage." },
      { displayText: "Bestehendes Angebot anpassen", fullPrompt: "Ich moechte ein bestehendes Angebot fuer einen neuen Kunden anpassen. Hilf mir dabei." },
      { displayText: "Angebotstext verbessern", fullPrompt: "Ich habe einen Angebotsentwurf und moechte den Text professioneller und ueberzeugender formulieren." },
    ],
    "lead-qualification": [
      { displayText: "Neuen Lead bewerten", fullPrompt: "Ich habe einen neuen Lead erhalten. Hilf mir, diesen systematisch zu qualifizieren." },
      { displayText: "Lead-Recherche durchfuehren", fullPrompt: "Ich brauche Hintergrundinformationen zu einem potenziellen Kunden. Bitte frage mich nach dem Unternehmen." },
    ],
    "campaign-content": [
      { displayText: "Kampagnentext erstellen", fullPrompt: "Ich brauche einen Text fuer eine Marketingkampagne. Bitte frage mich nach Zielgruppe, Kanal und Botschaft." },
      { displayText: "E-Mail-Kampagne formulieren", fullPrompt: "Ich moechte eine E-Mail-Kampagne erstellen. Hilf mir mit Betreffzeile und Inhalt." },
      { displayText: "Bestehenden Text variieren", fullPrompt: "Ich habe einen Text und brauche Variationen fuer verschiedene Kanaele." },
    ],
    "recruiting-support": [
      { displayText: "Stellenausschreibung erstellen", fullPrompt: "Ich moechte eine ansprechende Stellenausschreibung formulieren. Bitte frage mich nach der Position und den Anforderungen." },
      { displayText: "Bewerbung einschaetzen", fullPrompt: "Ich moechte eine Bewerbung bewerten. Ich zeige dir die Unterlagen." },
      { displayText: "Absage formulieren", fullPrompt: "Ich brauche eine wertschaetzende Absage fuer einen Bewerber." },
    ],
    "email-management": [
      { displayText: "E-Mail aus Stichpunkten erstellen", fullPrompt: "Ich habe Stichpunkte und moechte daraus eine professionelle E-Mail verfassen. Bitte frage mich nach den Details." },
      { displayText: "Auf eine E-Mail antworten", fullPrompt: "Ich habe eine E-Mail erhalten und moechte professionell antworten." },
      { displayText: "E-Mail-Vorlage erstellen", fullPrompt: "Ich brauche eine wiederverwendbare E-Mail-Vorlage fuer einen bestimmten Anlass." },
    ],
    "meeting-support": [
      { displayText: "Meeting-Agenda erstellen", fullPrompt: "Ich brauche eine strukturierte Agenda. Bitte frage mich nach dem Thema und den Teilnehmern." },
      { displayText: "Protokoll schreiben", fullPrompt: "Ich habe Notizen von einem Meeting und moechte daraus ein strukturiertes Protokoll erstellen." },
      { displayText: "Action Items extrahieren", fullPrompt: "Hilf mir, aus meinen Meeting-Notizen die konkreten Aufgaben mit Verantwortlichen zu extrahieren." },
    ],
  };

  const defaultStarters = [
    { displayText: "Wie kannst du mir helfen?", fullPrompt: "Erklaere mir kurz, was du alles fuer mich tun kannst und wie ich am besten mit dir arbeite." },
    { displayText: "Neue Aufgabe starten", fullPrompt: "Ich habe eine neue Aufgabe fuer dich. Bitte frage mich, was genau ich brauche." },
    { displayText: "Vorlage nutzen", fullPrompt: "Ich moechte eine bestehende Vorlage als Basis verwenden. Hilf mir bei der Anpassung." },
  ];

  const starters = starterTemplates[task] || defaultStarters;

  const iconMap: Record<string, string> = {
    sales: "TrendingUp", marketing: "Megaphone", finance: "DollarSign",
    hr: "UserCheck", general: "Briefcase"
  };

  const tagMap: Record<string, { id: string; name: string; color: string }> = {
    sales: { id: "sales", name: "Vertrieb", color: "#10B981" },
    marketing: { id: "marketing", name: "Marketing", color: "#8B5CF6" },
    finance: { id: "finance", name: "Finance", color: "#3B82F6" },
    hr: { id: "hr", name: "HR", color: "#F59E0B" },
    general: { id: "general", name: "Allgemein", color: "#6B7280" },
  };

  return {
    title,
    description,
    systemPrompt,
    starters,
    icon: iconMap[department] || "MessageSquare",
    tags: [tagMap[department] || { id: "general", name: "Allgemein", color: "#6B7280" }],
  };
}

// ---- Component ----

const STEPS = ["department", "task", "painpoints", "concretization"] as const;
type StepId = typeof STEPS[number];

const stepTitles: Record<StepId, { title: string; subtitle: string }> = {
  department: {
    title: "In welchem Bereich arbeitest du?",
    subtitle: "Das hilft uns, dir die passendsten Vorschlaege zu machen.",
  },
  task: {
    title: "Welche Aufgabe moechtest du vereinfachen?",
    subtitle: "Waehle die Aufgabe, die dich am meisten Zeit kostet - oder beschreibe sie selbst.",
  },
  painpoints: {
    title: "Was genau macht diese Aufgabe schwierig?",
    subtitle: "Je genauer du den Schmerz beschreibst, desto besser kann der Assistent helfen.",
  },
  concretization: {
    title: "Was wuerde dir dabei am meisten helfen?",
    subtitle: "Wir schlagen dir passende Anbindungen und Ressourcen vor.",
  },
};

const AssistantCreatorWizard = ({ open, onClose, onCreateAssistant }: AssistantCreatorWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [department, setDepartment] = useState<string>("");
  const [task, setTask] = useState<string>("");
  const [freeTextTask, setFreeTextTask] = useState("");
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [freeTextPain, setFreeTextPain] = useState("");
  const [concretizations, setConcretizations] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [creationComplete, setCreationComplete] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<ReturnType<typeof generateAssistantConfig> | null>(null);
  const [showFreeText, setShowFreeText] = useState(false);
  const [showFreeTextPain, setShowFreeTextPain] = useState(false);

  if (!open) return null;

  const stepId = STEPS[currentStep];
  const totalSteps = STEPS.length;
  const progress = ((currentStep + 1) / (totalSteps + 1)) * 100;

  const handleDepartmentSelect = (id: string) => {
    setDepartment(id);
    setTask("");
    setFreeTextTask("");
    setPainPoints([]);
    setFreeTextPain("");
    setConcretizations([]);
    setShowFreeText(false);
    setShowFreeTextPain(false);
    setTimeout(() => setCurrentStep(1), 300);
  };

  const handleTaskSelect = (id: string) => {
    setTask(id);
    setShowFreeText(false);
    setPainPoints([]);
    setFreeTextPain("");
    setConcretizations([]);
    setShowFreeTextPain(false);
    setTimeout(() => setCurrentStep(2), 300);
  };

  const handleTaskFreeText = () => {
    if (freeTextTask.trim()) {
      setTask("custom");
      setTimeout(() => setCurrentStep(2), 300);
    }
  };

  const handlePainPointToggle = (id: string) => {
    setPainPoints(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleConcretizationToggle = (id: string) => {
    if (id === "no-extras") {
      setConcretizations(["no-extras"]);
    } else {
      setConcretizations(prev => {
        const filtered = prev.filter(c => c !== "no-extras");
        return filtered.includes(id) ? filtered.filter(c => c !== id) : [...filtered, id];
      });
    }
  };

  const canProceedPainPoints = painPoints.length > 0 || freeTextPain.trim().length > 0;
  const canProceedConcretization = concretizations.length > 0;

  const handleCreate = async () => {
    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const config = generateAssistantConfig(department, task, painPoints, concretizations, freeTextTask, freeTextPain);
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
    setDepartment("");
    setTask("");
    setFreeTextTask("");
    setPainPoints([]);
    setFreeTextPain("");
    setConcretizations([]);
    setIsCreating(false);
    setCreationComplete(false);
    setGeneratedConfig(null);
    setShowFreeText(false);
    setShowFreeTextPain(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Creating screen
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
              {concretizations.filter(c => !["no-extras", "templates", "guidelines", "knowledge-general"].includes(c)).map(c => (
                <Badge key={c} variant="outline" className="text-xs">
                  {c === "outlook" ? "Outlook" : c === "sharepoint" ? "SharePoint" : c === "calendar" ? "Kalender" : c === "teams" ? "Teams" : c === "crm" ? "CRM" : c}
                </Badge>
              ))}
              {concretizations.some(c => ["templates", "guidelines", "knowledge-general"].includes(c)) && (
                <Badge variant="outline" className="text-xs">Knowledge Base</Badge>
              )}
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

  // Render options for current step
  const renderStepContent = () => {
    switch (stepId) {
      case "department":
        return (
          <div className="space-y-3">
            {departments.map(option => (
              <button
                key={option.id}
                onClick={() => handleDepartmentSelect(option.id)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                  department === option.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-accent/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  department === option.id ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                }`}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        );

      case "task": {
        const tasks = tasksByDepartment[department] || [];
        return (
          <div className="space-y-3">
            {tasks.map(option => (
              <button
                key={option.id}
                onClick={() => handleTaskSelect(option.id)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                  task === option.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-accent/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  task === option.id ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                }`}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{option.description}</div>
                </div>
              </button>
            ))}

            {/* Free text option */}
            {!showFreeText ? (
              <button
                onClick={() => setShowFreeText(true)}
                className="w-full text-left p-5 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-accent/50 transition-all duration-200 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent text-muted-foreground">
                  <PenTool className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">Andere Aufgabe beschreiben</div>
                  <div className="text-sm text-muted-foreground mt-0.5">Deine Aufgabe ist nicht dabei? Beschreibe sie in eigenen Worten.</div>
                </div>
              </button>
            ) : (
              <div className="p-5 rounded-xl border-2 border-primary/40 bg-primary/5 space-y-3">
                <Textarea
                  value={freeTextTask}
                  onChange={(e) => setFreeTextTask(e.target.value)}
                  placeholder="Beschreibe die Aufgabe, bei der dich der Assistent unterstuetzen soll..."
                  className="min-h-[80px] bg-background"
                  autoFocus
                />
                <Button onClick={handleTaskFreeText} disabled={!freeTextTask.trim()} size="sm">
                  Weiter <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        );
      }

      case "painpoints": {
        const painOptions = task !== "custom" ? (painPointsByTask[task] || []) : [];
        return (
          <div className="space-y-3">
            {painOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handlePainPointToggle(option.id)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                  painPoints.includes(option.id)
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-accent/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  painPoints.includes(option.id) ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                }`}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{option.description}</div>
                </div>
                {painPoints.includes(option.id) && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}

            {/* Free text pain */}
            {!showFreeTextPain ? (
              <button
                onClick={() => setShowFreeTextPain(true)}
                className="w-full text-left p-5 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-accent/50 transition-all duration-200 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent text-muted-foreground">
                  <PenTool className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">Eigene Herausforderung beschreiben</div>
                  <div className="text-sm text-muted-foreground mt-0.5">Dein Problem ist nicht dabei? Beschreibe es in eigenen Worten.</div>
                </div>
              </button>
            ) : (
              <div className="p-5 rounded-xl border-2 border-primary/40 bg-primary/5 space-y-3">
                <Textarea
                  value={freeTextPain}
                  onChange={(e) => setFreeTextPain(e.target.value)}
                  placeholder="Was genau macht diese Aufgabe fuer dich schwierig?"
                  className="min-h-[80px] bg-background"
                  autoFocus
                />
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => setCurrentStep(3)}
                disabled={!canProceedPainPoints}
              >
                Weiter
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      }

      case "concretization": {
        const suggestions = getConcretizationSuggestions(department, task, painPoints);
        const integrationSuggestions = suggestions.filter(s => s.type === "integration");
        const knowledgeSuggestions = suggestions.filter(s => s.type === "knowledge");
        const otherSuggestions = suggestions.filter(s => s.type === "feature");

        return (
          <div className="space-y-6">
            {integrationSuggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Empfohlene Integrationen</p>
                <div className="space-y-3">
                  {integrationSuggestions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleConcretizationToggle(s.id)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                        concretizations.includes(s.id)
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-accent/50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        concretizations.includes(s.id) ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                      }`}>
                        {s.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">{s.label}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">{s.description}</div>
                      </div>
                      {concretizations.includes(s.id) && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {knowledgeSuggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Knowledge Base</p>
                <div className="space-y-3">
                  {knowledgeSuggestions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleConcretizationToggle(s.id)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                        concretizations.includes(s.id)
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-accent/50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        concretizations.includes(s.id) ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                      }`}>
                        {s.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">{s.label}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">{s.description}</div>
                      </div>
                      {concretizations.includes(s.id) && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {otherSuggestions.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleConcretizationToggle(s.id)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                    concretizations.includes(s.id)
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-accent/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    concretizations.includes(s.id) ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                  }`}>
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground">{s.label}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{s.description}</div>
                  </div>
                  {concretizations.includes(s.id) && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleCreate}
                disabled={!canProceedConcretization}
              >
                Assistent erstellen
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      }
    }
  };

  const { title, subtitle } = stepTitles[stepId];

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button onClick={handleBack} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            <span className="text-sm text-muted-foreground">Schritt {currentStep + 1} von {totalSteps}</span>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <Progress value={progress} className="mb-10 h-1" />

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
};

export default AssistantCreatorWizard;
