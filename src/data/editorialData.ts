export type PostFormat = "Ratgeber" | "Kolumne" | "Interview" | "News" | "Case Study" | "Listicle" | "Reel-Skript";

export interface ExistingPost {
  id: string;
  title: string;
  format: PostFormat;
  topic: string;
  excerpt: string;
  publishedAt: string;
  performance: "low" | "mid" | "high";
  tags: string[];
}

export interface TopicCluster {
  id: string;
  name: string;
  postCount: number;
  lastUsed: string;
  trend: "up" | "flat" | "down";
}

export interface ContentSuggestion {
  id: string;
  title: string;
  topic: string;
  format: PostFormat;
  rationale: string;
  basedOnPostIds: string[];
  freshInsight?: string;
  estimatedDate?: string;
}

export type ApprovalStage = "Draft" | "SEO Check" | "Legal/GEO" | "Final Review" | "Approved" | "Published";

export interface PlannedPost {
  id: string;
  title: string;
  topic: string;
  format: PostFormat;
  scheduledDate: string; // ISO date
  stage: ApprovalStage;
  assignee?: string;
  sourceSuggestionId?: string;
  recycledFromId?: string;
}

export const mockExistingPosts: ExistingPost[] = [
  { id: "p1", title: "5 Tipps für eine bessere Altersvorsorge", format: "Ratgeber", topic: "Altersvorsorge", excerpt: "Ein praktischer Leitfaden für junge Berufstätige…", publishedAt: "2025-09-12", performance: "high", tags: ["Vorsorge", "Finanzen"] },
  { id: "p2", title: "Warum die private Krankenversicherung wieder boomt", format: "Kolumne", topic: "Krankenversicherung", excerpt: "Persönliche Einschätzung zum aktuellen Markt…", publishedAt: "2025-08-30", performance: "mid", tags: ["PKV", "Gesundheit"] },
  { id: "p3", title: "Interview: 'Hausratversicherung wird unterschätzt'", format: "Interview", topic: "Hausrat", excerpt: "Gespräch mit Schadensregulierer…", publishedAt: "2025-10-04", performance: "high", tags: ["Hausrat", "Schaden"] },
  { id: "p4", title: "Neue BU-Tarife im Vergleich", format: "Case Study", topic: "Berufsunfähigkeit", excerpt: "Vergleich von 6 BU-Tarifen anhand realer Profile…", publishedAt: "2025-07-21", performance: "high", tags: ["BU", "Vergleich"] },
  { id: "p5", title: "10 Fehler beim Abschluss einer Risikolebensversicherung", format: "Listicle", topic: "Risikoleben", excerpt: "Häufige Stolperfallen beim Abschluss…", publishedAt: "2025-06-18", performance: "mid", tags: ["RLV", "Familie"] },
  { id: "p6", title: "Cyber-Police für KMU – lohnt sich das?", format: "Ratgeber", topic: "Cyber", excerpt: "Risikoanalyse und Tarife für mittelständische Betriebe…", publishedAt: "2025-09-28", performance: "low", tags: ["Cyber", "Gewerbe"] },
  { id: "p7", title: "Inflation und Kaufkraftverlust in der Lebensversicherung", format: "Kolumne", topic: "Altersvorsorge", excerpt: "Was Kund:innen jetzt wissen müssen…", publishedAt: "2025-05-11", performance: "mid", tags: ["Vorsorge", "Inflation"] },
  { id: "p8", title: "Schadenmeldung in 3 Schritten", format: "Ratgeber", topic: "Schaden", excerpt: "So geht die Online-Schadenmeldung schnell…", publishedAt: "2025-04-02", performance: "high", tags: ["Service", "Schaden"] },
];

export const mockTopicClusters: TopicCluster[] = [
  { id: "t1", name: "Altersvorsorge", postCount: 12, lastUsed: "vor 3 Wochen", trend: "up" },
  { id: "t2", name: "Krankenversicherung", postCount: 8, lastUsed: "vor 6 Wochen", trend: "flat" },
  { id: "t3", name: "Berufsunfähigkeit", postCount: 9, lastUsed: "vor 4 Monaten", trend: "up" },
  { id: "t4", name: "Hausrat & Schaden", postCount: 14, lastUsed: "vor 2 Wochen", trend: "flat" },
  { id: "t5", name: "Cyber & Gewerbe", postCount: 5, lastUsed: "vor 2 Monaten", trend: "up" },
  { id: "t6", name: "Risikoleben", postCount: 6, lastUsed: "vor 5 Monaten", trend: "down" },
];

export const mockSuggestions: ContentSuggestion[] = [
  {
    id: "s1",
    title: "Altersvorsorge 2026: Was sich durch das neue Rentenpaket ändert",
    topic: "Altersvorsorge",
    format: "Ratgeber",
    rationale: "Cluster 'Altersvorsorge' performt überdurchschnittlich (3 High-Performer). Letzter Beitrag liegt 3 Wochen zurück.",
    basedOnPostIds: ["p1", "p7"],
    freshInsight: "Bundesregierung plant Anpassung des Rentenpakets II zum Q1/2026 – aktueller Aufhänger.",
    estimatedDate: "2026-05-04",
  },
  {
    id: "s2",
    title: "BU-Vergleich Update: Diese 3 Tarife wurden 2025 überarbeitet",
    topic: "Berufsunfähigkeit",
    format: "Case Study",
    rationale: "Format 'Case Study' zur BU lieferte den höchsten Engagement-Wert. Recycling mit aktualisierten Tarifen sinnvoll.",
    basedOnPostIds: ["p4"],
    freshInsight: "Neue Bedingungswerke von Allianz, Swiss Life und HDI seit Q4/2025 verfügbar.",
    estimatedDate: "2026-05-11",
  },
  {
    id: "s3",
    title: "Cyber für KMU: Warum kleine Unternehmen jetzt besonders gefährdet sind",
    topic: "Cyber",
    format: "Kolumne",
    rationale: "Cyber-Cluster wächst (Trend ↑), aber bisheriger Beitrag p6 hatte schwache Performance. Neuer Winkel als Kolumne empfohlen.",
    basedOnPostIds: ["p6"],
    freshInsight: "BSI-Lagebericht 2025: +28% Ransomware-Attacken auf KMU.",
    estimatedDate: "2026-05-18",
  },
  {
    id: "s4",
    title: "Hausratversicherung: 7 Schäden, die Kund:innen oft vergessen zu melden",
    topic: "Hausrat",
    format: "Listicle",
    rationale: "Hausrat-Cluster ist der größte (14 Posts). Listicle-Format fehlt bisher zu diesem Thema.",
    basedOnPostIds: ["p3", "p8"],
    estimatedDate: "2026-05-25",
  },
  {
    id: "s5",
    title: "Risikoleben neu gedacht – was junge Familien 2026 beachten sollten",
    topic: "Risikoleben",
    format: "Ratgeber",
    rationale: "Cluster 'Risikoleben' im Abwärtstrend – Re-Aktivierung mit Zielgruppen-Fokus empfohlen.",
    basedOnPostIds: ["p5"],
    estimatedDate: "2026-06-01",
  },
];

export const mockPlannedPosts: PlannedPost[] = [
  { id: "pp1", title: "Altersvorsorge 2026: Rentenpaket-Update", topic: "Altersvorsorge", format: "Ratgeber", scheduledDate: "2026-05-04", stage: "SEO Check", assignee: "Sarah K.", sourceSuggestionId: "s1" },
  { id: "pp2", title: "BU-Tarife 2025 im Re-Vergleich", topic: "Berufsunfähigkeit", format: "Case Study", scheduledDate: "2026-05-11", stage: "Draft", assignee: "Markus L.", sourceSuggestionId: "s2" },
  { id: "pp3", title: "Cyber-Risiken für KMU – Kolumne", topic: "Cyber", format: "Kolumne", scheduledDate: "2026-05-18", stage: "Legal/GEO", assignee: "Anna S.", sourceSuggestionId: "s3" },
  { id: "pp4", title: "Hausrat: 7 vergessene Schäden", topic: "Hausrat", format: "Listicle", scheduledDate: "2026-05-25", stage: "Final Review", assignee: "Jonas M.", sourceSuggestionId: "s4" },
];

export const stageColors: Record<ApprovalStage, string> = {
  "Draft": "bg-muted text-muted-foreground",
  "SEO Check": "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "Legal/GEO": "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "Final Review": "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  "Approved": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "Published": "bg-primary/15 text-primary",
};

export const allFormats: PostFormat[] = ["Ratgeber", "Kolumne", "Interview", "News", "Case Study", "Listicle", "Reel-Skript"];
