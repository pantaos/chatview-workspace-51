export type CPLang = "de" | "en";

export interface CPSuggestion {
  id: string;
  date: string;
  topic: string;
  field: string;
  channel: string;
  score: number;
  reason: string;
  status: "proposal" | "review" | "approved";
}

export interface CPAudience {
  id: string;
  name: string;
  age: string;
  phase: string;
  topics: string;
  channels: string;
  tone: string;
  cta: string;
  nogo: string;
}

export interface CPTopic {
  id: string;
  name: string;
  sparte: string;
  audiences: string;
  season: string;
  keywords: string;
  formats: string;
  priority: string;
  approval: boolean;
}

export interface CPSeasonRule {
  id: string;
  occasion: string;
  window: string;
  topics: string;
}

export interface CPContent {
  // header
  brandTag: string;
  titleUser: string;
  titleAdmin: string;
  subtitleUser: string;
  subtitleAdmin: string;
  adminModeTitle: string;
  adminModeSubtitle: string;
  langLabel: string;

  // admin nav
  previewTitle: string;
  previewSubtitle: string;
  previewBanner: string;

  // steps
  steps: { id: string; title: string; subtitle: string }[];

  // chip groups / selects
  periodLabel: string;
  periodOptions: { value: string; label: string }[];
  customPeriodLabel: string;
  customPeriodPlaceholder: string;
  customPeriodApply: string;
  customPeriodClear: string;
  targetsLabel: string;
  fieldsLabel: string;
  channelsLabel: string;
  topicFields: string[];
  channels: string[];
  targetGroups: string[];

  // step 1
  step1Title: string;
  step1Desc: string;
  fillHint: string;
  fillBtn: string;
  refillBtn: string;
  fillingBtn: string;
  fillToast: string;
  nextToLogic: string;

  // calendar overview
  calHeader: string;
  calBadgeSuffix: string;
  calFootnote: string;
  weekDays: string[];
  calEntries: Record<number, { label: string; field: string; color: string }>;

  // step 2
  step2Title: string;
  step2Desc: string;
  seasonalTitle: string;
  seasonalDesc: string;
  trendsTitle: string;
  trendsDesc: string;
  prioTitle: string;
  prioDesc: string;
  generateBtn: string;

  // step 3
  step3Title: string;
  step3Desc: string;
  regenBtn: string;
  scoreLabel: string;
  statusLabels: Record<CPSuggestion["status"], string>;
  changeStatusTitle: string;
  regenToast: string;
  nextToAnalyze: string;
  suggestions: CPSuggestion[];

  // step 4
  step4Title: string;
  step4Desc: string;
  pickTopicLabel: string;
  pickEmpty: string;
  analyzingText: string;
  trendsBlockTitle: string;
  questionsBlockTitle: string;
  briefingBlockTitle: string;
  briefingBlockText: (topic: string) => string;
  briefingTrends: { topic: string; momentum: string }[];
  briefingQuestions: string[];
  nextToPackage: string;

  // step 5
  step5Title: string;
  step5Desc: string;
  packageHint: string;
  genPackageBtn: string;
  buildingText: string;
  masterTitle: string;
  masterChannel: string;
  masterDesc: (topic: string) => string;
  derivativesLabel: string;
  derivatives: { key: string; label: string; desc: string }[];
  hitlLabel: string;
  hitlText: string;
  sendApprovalBtn: string;
  sendApprovalToast: string;
  packageToast: string;

  // common
  back: string;
  guidingLabel: string;
  guidingText: string;

  // admin modules
  adminModules: { id: string; title: string; subtitle: string }[];
  audiencesHead: string;
  audiencesDesc: string;
  newAudience: string;
  removeAudience: string;
  addAudience: string;
  topicsHead: string;
  topicsDesc: string;
  newTopic: string;
  removeTopic: string;
  addTopic: string;
  approvalRequired: string;
  seasonalHead: string;
  seasonalDescAdmin: string;
  addSeason: string;
  trendsHead: string;
  trendsDescAdmin: string;
  apiConnected: string;
  apiConnectedSuffix: string;
  formatsHead: string;
  formatsDesc: string;
  governanceHead: string;
  governanceDesc: string;

  // admin field labels
  f: Record<string, string>;
  regionOptions: string[];
  timeframeOptions: string[];
  frequencyOptions: string[];
  weightOptions: string[];

  // admin data
  audiences: CPAudience[];
  topics: CPTopic[];
  seasons: CPSeasonRule[];
  formats: { id: string; label: string; on: boolean }[];
  trendDefaults: { region: string; timeframe: string; frequency: string; keywordSet: string; threshold: string; weight: string };
  governanceDefaults: { topicApprover: string; articleApprover: string; blocked: string; mandatory: string };

  // publish bar
  simulateToast: string;
  changeModelLabel: string;
  changeModelText: string;
  simulateBtn: string;
  saveDraftBtn: string;
  saveDraftToast: string;
  publishBtn: string;
  publishToast: string;
}

const de: CPContent = {
  brandTag: "PANTA OS",
  titleUser: "KI-gestützte Content-Planung",
  titleAdmin: "Content-Planung · Admin",
  subtitleUser:
    "Von der Kalender-Vorbefüllung bis zum kanalübergreifenden Content-Paket – mit Human-in-the-loop in jedem Schritt.",
  subtitleAdmin:
    "Pflege die redaktionelle Intelligenz – Zielgruppen, Themen, Regeln & Signale – im Look des echten Kalenders.",
  adminModeTitle: "Admin-Modus",
  adminModeSubtitle: "Konfiguration & Regeln",
  langLabel: "Sprache",

  previewTitle: "Vorschau als Nutzer",
  previewSubtitle: "Echter Output",
  previewBanner: "Vorschau als Nutzer – so sieht die Redaktion den konfigurierten Kalender.",

  steps: [
    { id: "calendar", title: "Kalender befüllen", subtitle: "Zeitraum & Themenfelder" },
    { id: "logic", title: "Themenlogik & Signale", subtitle: "Saisonale Regeln & Trends" },
    { id: "suggestions", title: "Vorschlagskalender", subtitle: "Konkrete Themen" },
    { id: "briefing", title: "Themenanalyse & Briefing", subtitle: "Analyse & Grundlage" },
    { id: "package", title: "Content-Paket erstellen", subtitle: "Master + Ableitungen" },
  ],

  periodLabel: "Zeitraum",
  periodOptions: [
    { value: "Q1 2026", label: "Q1 2026 (Jan – Mär)" },
    { value: "Q2 2026", label: "Q2 2026 (Apr – Jun)" },
    { value: "Q3 2026", label: "Q3 2026 (Jul – Sep)" },
    { value: "Q4 2026", label: "Q4 2026 (Okt – Dez)" },
    { value: "2026", label: "Gesamtjahr 2026" },
    { value: "__custom__", label: "Individueller Zeitraum…" },
  ],
  customPeriodLabel: "Individueller Zeitraum",
  customPeriodPlaceholder: "Start- und Enddatum wählen",
  customPeriodApply: "Übernehmen",
  customPeriodClear: "Zurücksetzen",
  targetsLabel: "Zielgruppen & Region",
  fieldsLabel: "Themenfelder",
  channelsLabel: "Kanäle & Frequenz",
  topicFields: ["KFZ", "Unfall", "Haftpflicht", "Hausrat", "Rechtsschutz", "Tierhalter"],
  channels: ["Website / Blog", "LinkedIn", "Instagram", "Newsletter", "YouTube"],
  targetGroups: ["Privatkunden", "Gewerbe", "Junge Familien", "Senioren", "Selbstständige"],

  step1Title: "1. Kalender befüllen",
  step1Desc: "Lege Zeitraum, Themenfelder, Kanäle und Zielgruppen fest.",
  fillHint:
    "Auf Basis deiner Auswahl befüllt die KI den Kalender automatisch mit Themenvorschlägen aus saisonalen Regeln, Trends und HDI-Prioritäten.",
  fillBtn: "Kalender automatisch befüllen",
  refillBtn: "Kalender neu befüllen",
  fillingBtn: "Kalender wird befüllt…",
  fillToast: "Kalender automatisch befüllt",
  nextToLogic: "Weiter zu Themenlogik",

  calHeader: "Vorbefüllter Kalender",
  calBadgeSuffix: "Vorschläge",
  calFootnote:
    "Die KI hat den Kalender automatisch mit Vorschlägen aus saisonalen Regeln, Trends und HDI-Prioritäten vorbefüllt.",
  weekDays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  calEntries: {
    6: { label: "Einbruchschutz", field: "Hausrat", color: "bg-blue-100 text-blue-700 border-blue-200" },
    9: { label: "Reel: KFZ-Tipp", field: "Instagram", color: "bg-pink-100 text-pink-700 border-pink-200" },
    13: { label: "Haftpflicht 2026", field: "LinkedIn", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    16: { label: "Newsletter", field: "Unfall", color: "bg-amber-100 text-amber-700 border-amber-200" },
    20: { label: "Winterreifen", field: "KFZ", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    23: { label: "Story: Hausrat", field: "Instagram", color: "bg-pink-100 text-pink-700 border-pink-200" },
    27: { label: "Unfall-Familie", field: "Newsletter", color: "bg-amber-100 text-amber-700 border-amber-200" },
    30: { label: "Blog: Recht", field: "Rechtsschutz", color: "bg-blue-100 text-blue-700 border-blue-200" },
  },

  step2Title: "2. Themenlogik & Signale",
  step2Desc: "Bestimme, welche Logik und Signale die KI für Vorschläge nutzen soll.",
  seasonalTitle: "Saisonale Regeln & feste Versicherungslogik",
  seasonalDesc: "Wiederkehrende Anlässe und Kalenderdaten als Basis.",
  trendsTitle: "Google-Trends-Signale als Zusatzimpuls",
  trendsDesc: "Aktuelle Nachfrage-Spitzen fließen in das Ranking ein.",
  prioTitle: "Strategische Prioritäten von HDI",
  prioDesc: "Gewichtung nach Geschäftszielen und Fokusprodukten.",
  generateBtn: "Vorschläge generieren",

  step3Title: "3. Vorschlagskalender",
  step3Desc: "Konkrete Themenvorschläge mit Datum, Kanal und Relevanz-Score.",
  regenBtn: "Neu generieren",
  scoreLabel: "Score",
  statusLabels: { proposal: "Vorschlag", review: "In Prüfung", approved: "Freigegeben" },
  changeStatusTitle: "Status ändern",
  regenToast: "Vorschlagskalender aktualisiert",
  nextToAnalyze: "Thema analysieren",
  suggestions: [
    { id: "s1", date: "06. Jan", topic: "Einbruchschutz im Winter", field: "Hausrat", channel: "Blog", score: 94, reason: "Saisonaler Peak + steigendes Google-Trends-Signal in der Region.", status: "proposal" },
    { id: "s2", date: "13. Jan", topic: "Haftpflicht 2026: Was sich ändert", field: "Haftpflicht", channel: "LinkedIn", score: 91, reason: "Gesetzesänderung + hohe strategische Priorität von HDI.", status: "proposal" },
    { id: "s3", date: "20. Jan", topic: "Winterreifen-Pflicht & KFZ-Schutz", field: "KFZ", channel: "Instagram", score: 88, reason: "Wiederkehrender saisonaler Anlass mit hoher Reichweite.", status: "proposal" },
    { id: "s4", date: "27. Jan", topic: "Unfallversicherung für Familien", field: "Unfall", channel: "Newsletter", score: 82, reason: "Passende Zielgruppe + relevante Unterthemen identifiziert.", status: "proposal" },
  ],

  step4Title: "4. Themenanalyse & Briefing",
  step4Desc: "Wähle ein Thema – die KI analysiert Trends und erstellt automatisch ein Content-Briefing.",
  pickTopicLabel: "Thema wählen",
  pickEmpty: "Wähle links ein Thema, um die Analyse zu starten.",
  analyzingText: "Analysiere Trends, Unterthemen & Nutzerfragen…",
  trendsBlockTitle: "Passende Trends & Unterthemen",
  questionsBlockTitle: "Häufige Nutzerfragen",
  briefingBlockTitle: "Automatisches Content-Briefing",
  briefingBlockText: (t) =>
    `Fachliche und kommunikative Einordnung für „${t}" – inkl. Zielgruppe, Kernbotschaft und Tonalität als Grundlage für die Erstellung.`,
  briefingTrends: [
    { topic: "Smart-Home Sicherheit", momentum: "+38%" },
    { topic: "Versicherung & Förderung", momentum: "+21%" },
    { topic: "Nachbarschaftshilfe Winter", momentum: "+12%" },
  ],
  briefingQuestions: [
    "Welcher Einbruchschutz wird von der Versicherung gefördert?",
    "Was muss ich nach einem Einbruch sofort tun?",
    "Bin ich auch auf Reisen über die Hausratversicherung geschützt?",
  ],
  nextToPackage: "Content-Paket erstellen",

  step5Title: "5. Content-Paket erstellen",
  step5Desc: "Zuerst das Master Content Piece – danach Ableitungen für alle Kanäle.",
  packageHint:
    "Auf Basis des Briefings erstellt die KI einen Master-Artikel und leitet daraus kanalspezifische Formate ab.",
  genPackageBtn: "Paket generieren",
  buildingText: "Erstelle Master-Artikel und Ableitungen…",
  masterTitle: "Master Content Piece",
  masterChannel: "Website / Blog",
  masterDesc: (t) => `${t} – vollständiger Blogartikel als Basis für alle Ableitungen.`,
  derivativesLabel: "Ableitungen",
  derivatives: [
    { key: "linkedin", label: "LinkedIn Post", desc: "Pointierter Hook + Karussell-Idee" },
    { key: "instagram", label: "Instagram Reel", desc: "Script + 3 Bildideen" },
    { key: "video", label: "Video-Script", desc: "Optional: 45-Sekunden-Teaser" },
    { key: "faq", label: "FAQ & Teaser", desc: "Newsletter-Snippet + FAQ-Block" },
  ],
  hitlLabel: "Human-in-the-loop:",
  hitlText: "Menschliche Prüfung und finale Freigabe vor Veröffentlichung erforderlich.",
  sendApprovalBtn: "Zur Freigabe senden",
  sendApprovalToast: "Zur Freigabe gesendet",
  packageToast: "Content-Paket erstellt – bereit zur finalen Freigabe",

  back: "Zurück",
  guidingLabel: "Leitprinzip:",
  guidingText:
    "Keine automatische Veröffentlichung, sondern ein KI-gestützter Vorschlags- und Produktionsprozess mit Human-in-the-loop. Feedback & Optimierung fließen kontinuierlich zurück.",

  adminModules: [
    { id: "audiences", title: "Zielgruppen", subtitle: "Steuernde Datensätze" },
    { id: "topics", title: "Themen & Sparten", subtitle: "Versicherungslogik" },
    { id: "seasonal", title: "Saisonale Regeln", subtitle: "Zeitfenster & Anlässe" },
    { id: "trends", title: "Trend-Signale", subtitle: "Google Trends & Scoring" },
    { id: "formats", title: "Content-Formate", subtitle: "Verfügbare Formate" },
    { id: "governance", title: "Freigabe & Governance", subtitle: "Regeln & Compliance" },
  ],
  audiencesHead: "Zielgruppen",
  audiencesDesc:
    "Zielgruppen sind steuernde Datensätze – sie beeinflussen Themenauswahl, Sprache, Kanal, Beispiele und CTA.",
  newAudience: "Neue Zielgruppe",
  removeAudience: "Zielgruppe entfernen",
  addAudience: "Zielgruppe hinzufügen",
  topicsHead: "Themen & Versicherungssparten",
  topicsDesc:
    "Konkrete Themen mit Sparte, Zielgruppen, Saisonfenster, Trend-Keywords, Formaten und Freigabepflicht.",
  newTopic: "Neues Thema",
  removeTopic: "Thema entfernen",
  addTopic: "Thema hinzufügen",
  approvalRequired: "Freigabe erforderlich",
  seasonalHead: "Saisonale Regeln",
  seasonalDescAdmin: "Wiederkehrende Anlässe und Zeitfenster, ab wann welche Themen relevant werden.",
  addSeason: "Saisonregel hinzufügen",
  trendsHead: "Trend-Signale (Google Trends)",
  trendsDescAdmin:
    "Datenquelle & Scoring. Trends gelten als relatives Signal, nicht als alleiniger Entscheidungsgeber.",
  apiConnected: "API verbunden",
  apiConnectedSuffix: "Credentials im Systembereich hinterlegt",
  formatsHead: "Content-Formate",
  formatsDesc: "Welche Formate stehen der Redaktion zur Verfügung?",
  governanceHead: "Freigabe & Governance",
  governanceDesc:
    "Wer darf freigeben, welche Aussagen sind gesperrt und welche Bausteine sind verpflichtend?",

  f: {
    name: "Name",
    age: "Altersrahmen",
    phase: "Lebensphase / Trigger",
    topics: "Typische Themen",
    channels: "Bevorzugte Kanäle",
    tone: "Sprache / Tonalität",
    cta: "CTA / nächster Schritt",
    nogo: "No-Go / Risikofilter",
    topic: "Thema",
    sparte: "Versicherungssparte",
    audiences: "Zielgruppen",
    season: "Saisonfenster",
    keywords: "Trend-Keywords",
    formats: "Passende Formate",
    priority: "Priorität",
    occasion: "Anlass",
    window: "Zeitfenster",
    affectedTopics: "Betroffene Themen",
    region: "Region",
    timeframe: "Zeitraum",
    frequency: "Abfragefrequenz",
    keywordSet: "Keyword-Set je Versicherungsthema",
    threshold: "Mindestschwelle Relevanz (%)",
    weight: "Gewichtung im Scoring",
    topicApprover: "Themen-Freigabe durch",
    articleApprover: "Artikel-Freigabe durch",
    blocked: "Gesperrte Aussagen",
    mandatory: "Verpflichtende Textbausteine",
  },
  regionOptions: ["Deutschland", "Bundesland", "Lokal"],
  timeframeOptions: ["7 Tage", "30 Tage", "90 Tage", "12 Monate"],
  frequencyOptions: ["Täglich", "Wöchentlich"],
  weightOptions: ["Niedrig", "Mittel", "Hoch"],

  audiences: [
    { id: "a1", name: "Junge Erwachsene", age: "18–29 Jahre", phase: "Studium, erster Job, erste Wohnung, erstes Auto", topics: "Haftpflicht, Hausrat, Kfz, Reise, Fahrrad/E-Bike, Unfall", channels: "Instagram, TikTok/Short Video, Website-Ratgeber", tone: "Einfach, konkret, wenig Versicherungsjargon", cta: "Mehr erfahren · Checkliste ansehen", nogo: "Zu vertrieblich, zu kompliziert, zu belehrend" },
    { id: "a2", name: "Hausbesitzer 50+", age: "50–70 Jahre", phase: "Eigenheim, Familie erwachsen, Vermögensaufbau", topics: "Wohngebäude, Hausrat, Einbruchschutz, Haftpflicht", channels: "Website-Ratgeber, Newsletter, Facebook", tone: "Sachlich, vertrauensvoll, beratend", cta: "Beratung anfragen · Schaden vermeiden", nogo: "Keine pauschalen Deckungszusagen" },
  ],
  topics: [
    { id: "t1", name: "Einbruchschutz", sparte: "Hausrat / Wohngebäude", audiences: "Mieter, Eigentümer, Familien, ältere Menschen", season: "Vor Ferienzeiten, Herbst/Winter, dunkle Jahreszeit", keywords: "Einbruchschutz, Wohnung sichern, Türschloss, Fenster sichern", formats: "Blogartikel, Checkliste, Instagram-Kurzvideo", priority: "Saisonal hoch", approval: true },
    { id: "t2", name: "Winterreifen & Kfz-Schutz", sparte: "Kfz", audiences: "Autofahrer, junge Erwachsene, Pendler", season: "Oktober–Dezember", keywords: "Winterreifen Pflicht, Kfz Winter, Reifenwechsel", formats: "Instagram-Post, Blogartikel, Reel", priority: "Saisonal hoch", approval: false },
  ],
  seasons: [
    { id: "r1", occasion: "Kfz-Wechselsaison", window: "Sep – Nov", topics: "Winterreifen, Kfz-Tarifvergleich" },
    { id: "r2", occasion: "Reisezeit / Urlaub", window: "Jun – Aug", topics: "Reiseversicherung, Einbruchschutz" },
    { id: "r3", occasion: "Schulanfang (je Bundesland)", window: "Aug – Sep", topics: "Schulweg, Unfallversicherung Kinder" },
  ],
  formats: [
    { id: "f1", label: "Blogartikel", on: true },
    { id: "f2", label: "LinkedIn-Beitrag", on: true },
    { id: "f3", label: "Instagram-Post", on: true },
    { id: "f4", label: "Instagram-Video / Reel", on: true },
    { id: "f5", label: "Newsletter", on: true },
    { id: "f6", label: "FAQ", on: false },
    { id: "f7", label: "Checkliste", on: true },
  ],
  trendDefaults: { region: "Deutschland", timeframe: "30 Tage", frequency: "Täglich", keywordSet: "Einbruchschutz, Wohnung sichern, Türschloss", threshold: "20", weight: "Mittel" },
  governanceDefaults: { topicApprover: "Redaktionsleitung", articleApprover: "Compliance + Redaktion", blocked: "Pauschale Deckungszusagen, Garantieversprechen, Vergleiche mit Wettbewerbern", mandatory: "Rechtlicher Hinweis, Beratungs-CTA" },

  simulateToast:
    "Diese Änderung würde 14 neue Themenvorschläge im nächsten Quartal erzeugen und 3 bestehende höher priorisieren.",
  changeModelLabel: "Sicheres Änderungsmodell:",
  changeModelText:
    "Änderungen laufen als Entwurf und gehen erst nach Veröffentlichung live (mit Versionierung & Rollback).",
  simulateBtn: "Auswirkungen simulieren",
  saveDraftBtn: "Entwurf speichern",
  saveDraftToast: "Als Entwurf gespeichert",
  publishBtn: "Veröffentlichen",
  publishToast: "Neue Version veröffentlicht",
};

const en: CPContent = {
  brandTag: "PANTA OS",
  titleUser: "AI-powered content planning",
  titleAdmin: "Content planning · Admin",
  subtitleUser:
    "From pre-filling the calendar to a cross-channel content package – with a human in the loop at every step.",
  subtitleAdmin:
    "Maintain the editorial intelligence – audiences, topics, rules & signals – in the look of the real calendar.",
  adminModeTitle: "Admin mode",
  adminModeSubtitle: "Configuration & rules",
  langLabel: "Language",

  previewTitle: "Preview as user",
  previewSubtitle: "Real output",
  previewBanner: "Preview as user – this is how the editorial team sees the configured calendar.",

  steps: [
    { id: "calendar", title: "Fill calendar", subtitle: "Period & topic fields" },
    { id: "logic", title: "Topic logic & signals", subtitle: "Seasonal rules & trends" },
    { id: "suggestions", title: "Suggestion calendar", subtitle: "Concrete topics" },
    { id: "briefing", title: "Topic analysis & briefing", subtitle: "Analysis & basis" },
    { id: "package", title: "Create content package", subtitle: "Master + derivatives" },
  ],

  periodLabel: "Period",
  periodOptions: [
    { value: "Q1 2026", label: "Q1 2026 (Jan – Mar)" },
    { value: "Q2 2026", label: "Q2 2026 (Apr – Jun)" },
    { value: "Q3 2026", label: "Q3 2026 (Jul – Sep)" },
    { value: "Q4 2026", label: "Q4 2026 (Oct – Dec)" },
    { value: "2026", label: "Full year 2026" },
    { value: "__custom__", label: "Custom range…" },
  ],
  customPeriodLabel: "Custom range",
  customPeriodPlaceholder: "Pick start and end date",
  customPeriodApply: "Apply",
  customPeriodClear: "Reset",
  targetsLabel: "Audiences & region",
  fieldsLabel: "Topic fields",
  channelsLabel: "Channels & frequency",
  topicFields: ["Auto", "Accident", "Liability", "Home contents", "Legal", "Pet owner"],
  channels: ["Website / Blog", "LinkedIn", "Instagram", "Newsletter", "YouTube"],
  targetGroups: ["Private clients", "Business", "Young families", "Seniors", "Self-employed"],

  step1Title: "1. Fill calendar",
  step1Desc: "Define period, topic fields, channels and audiences.",
  fillHint:
    "Based on your selection, the AI automatically fills the calendar with topic suggestions from seasonal rules, trends and HDI priorities.",
  fillBtn: "Fill calendar automatically",
  refillBtn: "Refill calendar",
  fillingBtn: "Filling calendar…",
  fillToast: "Calendar filled automatically",
  nextToLogic: "Continue to topic logic",

  calHeader: "Pre-filled calendar · January 2026",
  calBadgeSuffix: "suggestions",
  calFootnote:
    "The AI automatically pre-filled the calendar with suggestions from seasonal rules, trends and HDI priorities.",
  weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  calEntries: {
    6: { label: "Burglary protection", field: "Home contents", color: "bg-blue-100 text-blue-700 border-blue-200" },
    9: { label: "Reel: car tip", field: "Instagram", color: "bg-pink-100 text-pink-700 border-pink-200" },
    13: { label: "Liability 2026", field: "LinkedIn", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    16: { label: "Newsletter", field: "Accident", color: "bg-amber-100 text-amber-700 border-amber-200" },
    20: { label: "Winter tyres", field: "Auto", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    23: { label: "Story: contents", field: "Instagram", color: "bg-pink-100 text-pink-700 border-pink-200" },
    27: { label: "Accident family", field: "Newsletter", color: "bg-amber-100 text-amber-700 border-amber-200" },
    30: { label: "Blog: legal", field: "Legal", color: "bg-blue-100 text-blue-700 border-blue-200" },
  },

  step2Title: "2. Topic logic & signals",
  step2Desc: "Decide which logic and signals the AI should use for suggestions.",
  seasonalTitle: "Seasonal rules & fixed insurance logic",
  seasonalDesc: "Recurring occasions and calendar dates as a basis.",
  trendsTitle: "Google Trends signals as an additional impulse",
  trendsDesc: "Current demand peaks feed into the ranking.",
  prioTitle: "Strategic priorities from HDI",
  prioDesc: "Weighting by business goals and focus products.",
  generateBtn: "Generate suggestions",

  step3Title: "3. Suggestion calendar",
  step3Desc: "Concrete topic suggestions with date, channel and relevance score.",
  regenBtn: "Regenerate",
  scoreLabel: "Score",
  statusLabels: { proposal: "Suggestion", review: "In review", approved: "Approved" },
  changeStatusTitle: "Change status",
  regenToast: "Suggestion calendar updated",
  nextToAnalyze: "Analyze topic",
  suggestions: [
    { id: "s1", date: "06 Jan", topic: "Burglary protection in winter", field: "Home contents", channel: "Blog", score: 94, reason: "Seasonal peak + rising Google Trends signal in the region.", status: "proposal" },
    { id: "s2", date: "13 Jan", topic: "Liability 2026: what's changing", field: "Liability", channel: "LinkedIn", score: 91, reason: "Legal change + high strategic priority for HDI.", status: "proposal" },
    { id: "s3", date: "20 Jan", topic: "Winter tyre obligation & car cover", field: "Auto", channel: "Instagram", score: 88, reason: "Recurring seasonal occasion with high reach.", status: "proposal" },
    { id: "s4", date: "27 Jan", topic: "Accident insurance for families", field: "Accident", channel: "Newsletter", score: 82, reason: "Matching audience + relevant sub-topics identified.", status: "proposal" },
  ],

  step4Title: "4. Topic analysis & briefing",
  step4Desc: "Pick a topic – the AI analyzes trends and automatically creates a content briefing.",
  pickTopicLabel: "Choose topic",
  pickEmpty: "Choose a topic on the left to start the analysis.",
  analyzingText: "Analyzing trends, sub-topics & user questions…",
  trendsBlockTitle: "Matching trends & sub-topics",
  questionsBlockTitle: "Frequent user questions",
  briefingBlockTitle: "Automatic content briefing",
  briefingBlockText: (t) =>
    `Subject-matter and communicative framing for "${t}" – incl. audience, core message and tone as the basis for creation.`,
  briefingTrends: [
    { topic: "Smart-home security", momentum: "+38%" },
    { topic: "Insurance & subsidies", momentum: "+21%" },
    { topic: "Neighbourhood help in winter", momentum: "+12%" },
  ],
  briefingQuestions: [
    "Which burglary protection is subsidized by insurers?",
    "What should I do immediately after a break-in?",
    "Am I also covered while travelling under home contents insurance?",
  ],
  nextToPackage: "Create content package",

  step5Title: "5. Create content package",
  step5Desc: "First the master content piece – then derivatives for all channels.",
  packageHint:
    "Based on the briefing, the AI creates a master article and derives channel-specific formats from it.",
  genPackageBtn: "Generate package",
  buildingText: "Creating master article and derivatives…",
  masterTitle: "Master content piece",
  masterChannel: "Website / Blog",
  masterDesc: (t) => `${t} – full blog article as the basis for all derivatives.`,
  derivativesLabel: "Derivatives",
  derivatives: [
    { key: "linkedin", label: "LinkedIn post", desc: "Sharp hook + carousel idea" },
    { key: "instagram", label: "Instagram reel", desc: "Script + 3 image ideas" },
    { key: "video", label: "Video script", desc: "Optional: 45-second teaser" },
    { key: "faq", label: "FAQ & teaser", desc: "Newsletter snippet + FAQ block" },
  ],
  hitlLabel: "Human-in-the-loop:",
  hitlText: "Human review and final approval required before publishing.",
  sendApprovalBtn: "Send for approval",
  sendApprovalToast: "Sent for approval",
  packageToast: "Content package created – ready for final approval",

  back: "Back",
  guidingLabel: "Guiding principle:",
  guidingText:
    "No automatic publishing, but an AI-assisted suggestion and production process with a human in the loop. Feedback & optimization flow back continuously.",

  adminModules: [
    { id: "audiences", title: "Audiences", subtitle: "Controlling datasets" },
    { id: "topics", title: "Topics & lines", subtitle: "Insurance logic" },
    { id: "seasonal", title: "Seasonal rules", subtitle: "Windows & occasions" },
    { id: "trends", title: "Trend signals", subtitle: "Google Trends & scoring" },
    { id: "formats", title: "Content formats", subtitle: "Available formats" },
    { id: "governance", title: "Approval & governance", subtitle: "Rules & compliance" },
  ],
  audiencesHead: "Audiences",
  audiencesDesc:
    "Audiences are controlling datasets – they influence topic selection, language, channel, examples and CTA.",
  newAudience: "New audience",
  removeAudience: "Remove audience",
  addAudience: "Add audience",
  topicsHead: "Topics & insurance lines",
  topicsDesc:
    "Concrete topics with line, audiences, seasonal window, trend keywords, formats and approval requirement.",
  newTopic: "New topic",
  removeTopic: "Remove topic",
  addTopic: "Add topic",
  approvalRequired: "Approval required",
  seasonalHead: "Seasonal rules",
  seasonalDescAdmin: "Recurring occasions and windows defining when which topics become relevant.",
  addSeason: "Add seasonal rule",
  trendsHead: "Trend signals (Google Trends)",
  trendsDescAdmin:
    "Data source & scoring. Trends count as a relative signal, not the sole decision-maker.",
  apiConnected: "API connected",
  apiConnectedSuffix: "Credentials stored in the system area",
  formatsHead: "Content formats",
  formatsDesc: "Which formats are available to the editorial team?",
  governanceHead: "Approval & governance",
  governanceDesc:
    "Who may approve, which statements are blocked and which building blocks are mandatory?",

  f: {
    name: "Name",
    age: "Age range",
    phase: "Life phase / trigger",
    topics: "Typical topics",
    channels: "Preferred channels",
    tone: "Language / tone",
    cta: "CTA / next step",
    nogo: "No-go / risk filter",
    topic: "Topic",
    sparte: "Insurance line",
    audiences: "Audiences",
    season: "Seasonal window",
    keywords: "Trend keywords",
    formats: "Matching formats",
    priority: "Priority",
    occasion: "Occasion",
    window: "Window",
    affectedTopics: "Affected topics",
    region: "Region",
    timeframe: "Period",
    frequency: "Query frequency",
    keywordSet: "Keyword set per insurance topic",
    threshold: "Minimum relevance threshold (%)",
    weight: "Weight in scoring",
    topicApprover: "Topic approval by",
    articleApprover: "Article approval by",
    blocked: "Blocked statements",
    mandatory: "Mandatory text blocks",
  },
  regionOptions: ["Germany", "State", "Local"],
  timeframeOptions: ["7 days", "30 days", "90 days", "12 months"],
  frequencyOptions: ["Daily", "Weekly"],
  weightOptions: ["Low", "Medium", "High"],

  audiences: [
    { id: "a1", name: "Young adults", age: "18–29 years", phase: "Studies, first job, first flat, first car", topics: "Liability, home contents, car, travel, bike/e-bike, accident", channels: "Instagram, TikTok/short video, website guides", tone: "Simple, concrete, little insurance jargon", cta: "Learn more · View checklist", nogo: "Too salesy, too complicated, too preachy" },
    { id: "a2", name: "Homeowners 50+", age: "50–70 years", phase: "Own home, grown family, wealth building", topics: "Buildings, home contents, burglary protection, liability", channels: "Website guides, newsletter, Facebook", tone: "Factual, trustworthy, advisory", cta: "Request advice · Avoid damage", nogo: "No blanket coverage promises" },
  ],
  topics: [
    { id: "t1", name: "Burglary protection", sparte: "Home contents / buildings", audiences: "Tenants, owners, families, older people", season: "Before holiday seasons, autumn/winter, dark season", keywords: "Burglary protection, secure home, door lock, secure windows", formats: "Blog article, checklist, Instagram short video", priority: "Seasonally high", approval: true },
    { id: "t2", name: "Winter tyres & car cover", sparte: "Auto", audiences: "Drivers, young adults, commuters", season: "October–December", keywords: "Winter tyre obligation, car winter, tyre change", formats: "Instagram post, blog article, reel", priority: "Seasonally high", approval: false },
  ],
  seasons: [
    { id: "r1", occasion: "Car change season", window: "Sep – Nov", topics: "Winter tyres, car tariff comparison" },
    { id: "r2", occasion: "Travel time / holidays", window: "Jun – Aug", topics: "Travel insurance, burglary protection" },
    { id: "r3", occasion: "Back to school (by state)", window: "Aug – Sep", topics: "School route, children's accident insurance" },
  ],
  formats: [
    { id: "f1", label: "Blog article", on: true },
    { id: "f2", label: "LinkedIn post", on: true },
    { id: "f3", label: "Instagram post", on: true },
    { id: "f4", label: "Instagram video / reel", on: true },
    { id: "f5", label: "Newsletter", on: true },
    { id: "f6", label: "FAQ", on: false },
    { id: "f7", label: "Checklist", on: true },
  ],
  trendDefaults: { region: "Germany", timeframe: "30 days", frequency: "Daily", keywordSet: "Burglary protection, secure home, door lock", threshold: "20", weight: "Medium" },
  governanceDefaults: { topicApprover: "Editorial management", articleApprover: "Compliance + editorial", blocked: "Blanket coverage promises, guarantee claims, comparisons with competitors", mandatory: "Legal notice, advisory CTA" },

  simulateToast:
    "This change would generate 14 new topic suggestions next quarter and prioritize 3 existing ones higher.",
  changeModelLabel: "Safe change model:",
  changeModelText:
    "Changes run as a draft and only go live after publishing (with versioning & rollback).",
  simulateBtn: "Simulate impact",
  saveDraftBtn: "Save draft",
  saveDraftToast: "Saved as draft",
  publishBtn: "Publish",
  publishToast: "New version published",
};

export const CP_CONTENT: Record<CPLang, CPContent> = { de, en };
