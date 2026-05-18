export type Channel = "LinkedIn" | "Blog" | "Newsletter" | "Instagram" | "YouTube" | "Podcast";
export type Status = "Idea" | "Planned" | "In Production" | "Review" | "Approved" | "Published";
export type Priority = "low" | "medium" | "high";
export type Effort = "S" | "M" | "L";
export type Format = "Article" | "Carousel" | "Reel" | "Newsletter" | "Whitepaper" | "Video" | "Podcast" | "Post";

export interface TopicCluster {
  id: string;
  name: string;
  priority: Priority;
  audience: string;
  frequency: string;
  formats: Format[];
  businessRelevance: string;
  postCount: number;
}

export interface ContentIdea {
  id: string;
  title: string;
  description?: string;
  rationale: string;
  source: string;
  format: Format;
  channel: Channel;
  cluster: string;
  keywords: string[];
  mainKeyword: string;
  priorityScore: number; // 0-100
  effort: Effort;
  status: Status;
  owner?: string;
  scheduledDate?: string; // ISO
  audience?: string;
  briefing?: {
    hook: string;
    keyMessage: string;
    structure: string[];
    cta: string;
    visualIdea: string;
    notes: string;
  };
}

export const topicClusters: TopicCluster[] = [
  { id: "c1", name: "AI Upskilling", priority: "high", audience: "L&D Leads, Mid-Manager", frequency: "Wöchentlich", formats: ["Article", "Carousel", "Newsletter"], businessRelevance: "Lead-Generierung Enterprise", postCount: 14 },
  { id: "c2", name: "PANTA Flows", priority: "high", audience: "CIOs, Ops-Verantwortliche", frequency: "2× pro Woche", formats: ["Article", "Video", "Whitepaper"], businessRelevance: "Produkt-Awareness", postCount: 21 },
  { id: "c3", name: "Workflow Automation", priority: "medium", audience: "Process Owner, IT", frequency: "Wöchentlich", formats: ["Article", "Reel", "Post"], businessRelevance: "Mid-Funnel Education", postCount: 9 },
  { id: "c4", name: "AI Governance", priority: "high", audience: "Legal, Compliance, CIO", frequency: "Alle 2 Wochen", formats: ["Whitepaper", "Article"], businessRelevance: "Trust & Enterprise Sales", postCount: 6 },
  { id: "c5", name: "Media Innovation", priority: "medium", audience: "Verlage, Redaktionen", frequency: "Wöchentlich", formats: ["Article", "Podcast"], businessRelevance: "Branchen-Positionierung", postCount: 11 },
  { id: "c6", name: "Customer Questions", priority: "low", audience: "Bestandskund:innen", frequency: "On demand", formats: ["Post", "Carousel"], businessRelevance: "Retention & Support", postCount: 7 },
];

export const owners = ["Sarah K.", "Markus L.", "Anna S.", "Jonas M.", "Lea T."];

export const contentIdeas: ContentIdea[] = [
  {
    id: "i1",
    title: "Wie L&D-Teams 2026 AI-Upskilling messbar machen",
    description: "Leitfaden mit 4 KPIs und einer Beispiel-Scorecard für L&D-Verantwortliche.",
    rationale: "AI-Upskilling-Cluster zeigt höchste Engagement-Rate; Messbarkeit ist die meistgesuchte Folgefrage.",
    source: "LinkedIn-Diskussionen + Kundenanfragen",
    format: "Article",
    channel: "Blog",
    cluster: "AI Upskilling",
    keywords: ["AI Upskilling", "L&D KPI", "Skill Gap"],
    mainKeyword: "AI Upskilling KPI",
    priorityScore: 88,
    effort: "M",
    status: "Idea",
    owner: "Sarah K.",
    audience: "L&D Leads",
    briefing: {
      hook: "75 % der L&D-Teams investieren in AI-Trainings – aber nur 12 % messen den Lerntransfer.",
      keyMessage: "Vier konkrete KPIs machen AI-Upskilling steuerbar.",
      structure: ["Status quo der Skill-Gap-Studien 2025", "Die 4 KPIs im Detail", "Beispiel-Scorecard", "Roll-out in 30 Tagen"],
      cta: "Lade die Scorecard-Vorlage herunter.",
      visualIdea: "Dashboard-Mockup mit den 4 KPIs als Tiles.",
      notes: "Tonalität: pragmatisch, datennah. Keine Buzzwords.",
    },
  },
  {
    id: "i2",
    title: "PANTA Flows Release Notes Mai – 5 neue Workflow-Bausteine",
    rationale: "Produkt-Release liefert klaren Aufhänger; bisherige Release-Posts haben starke CTR.",
    source: "Produkt-Roadmap",
    format: "Newsletter",
    channel: "Newsletter",
    cluster: "PANTA Flows",
    keywords: ["Release", "Workflow"],
    mainKeyword: "PANTA Flows Release",
    priorityScore: 92,
    effort: "S",
    status: "Planned",
    owner: "Markus L.",
    scheduledDate: "2026-05-19",
  },
  {
    id: "i3",
    title: "AI Governance: Was der EU AI Act Q3 wirklich für Verlage bedeutet",
    rationale: "Content-Gap im Cluster Governance; Mitbewerber positionieren sich bereits.",
    source: "Industry Media Scan",
    format: "Whitepaper",
    channel: "Blog",
    cluster: "AI Governance",
    keywords: ["EU AI Act", "Compliance", "Media"],
    mainKeyword: "EU AI Act Verlage",
    priorityScore: 81,
    effort: "L",
    status: "In Production",
    owner: "Anna S.",
    scheduledDate: "2026-05-26",
  },
  {
    id: "i4",
    title: "Reel: 3 Mini-Automationen, die Redaktionen pro Woche 6h sparen",
    rationale: "Format Reel im Cluster Workflow Automation fehlt; hohe Mobile-Reichweite erwartet.",
    source: "Customer Questions",
    format: "Reel",
    channel: "Instagram",
    cluster: "Workflow Automation",
    keywords: ["Automation", "Newsroom"],
    mainKeyword: "Newsroom Automation",
    priorityScore: 74,
    effort: "S",
    status: "Idea",
  },
  {
    id: "i5",
    title: "Case Study: Wie ein Mittelstandsverlag mit PANTA Flows 3 Workflows konsolidiert hat",
    rationale: "Story-getriebener Beitrag; Kunde hat freigegeben.",
    source: "Customer Success Call",
    format: "Article",
    channel: "Blog",
    cluster: "PANTA Flows",
    keywords: ["Case Study", "Verlag"],
    mainKeyword: "PANTA Flows Case Study",
    priorityScore: 79,
    effort: "M",
    status: "Review",
    owner: "Jonas M.",
    scheduledDate: "2026-05-12",
  },
  {
    id: "i6",
    title: "Carousel: 7 Fehler beim Onboarding von AI-Tools in Teams",
    rationale: "Saisonal relevant zum Halbjahres-Onboarding; einfach produzierbar.",
    source: "Forenanalyse",
    format: "Carousel",
    channel: "LinkedIn",
    cluster: "AI Upskilling",
    keywords: ["Onboarding", "Change"],
    mainKeyword: "AI Tool Onboarding",
    priorityScore: 71,
    effort: "S",
    status: "Approved",
    owner: "Lea T.",
    scheduledDate: "2026-05-07",
  },
  {
    id: "i7",
    title: "Podcast-Folge: Media Innovation 2026 mit Gast aus dem Springer-Lab",
    rationale: "Gast bereits zugesagt; passt auf Cluster Media Innovation.",
    source: "Manual",
    format: "Podcast",
    channel: "Podcast",
    cluster: "Media Innovation",
    keywords: ["Podcast", "Innovation"],
    mainKeyword: "Media Innovation 2026",
    priorityScore: 66,
    effort: "L",
    status: "Planned",
    owner: "Sarah K.",
    scheduledDate: "2026-05-21",
  },
  {
    id: "i8",
    title: "FAQ-Post: Die 5 häufigsten Fragen zur PANTA Flows API",
    rationale: "Support-Tickets clustern, Antwort als Content.",
    source: "Customer Questions",
    format: "Post",
    channel: "LinkedIn",
    cluster: "Customer Questions",
    keywords: ["API", "FAQ"],
    mainKeyword: "PANTA Flows API",
    priorityScore: 58,
    effort: "S",
    status: "Idea",
  },
  {
    id: "i9",
    title: "Veröffentlicht: Trendbericht KI in Redaktionen Q1",
    rationale: "Bereits live; Performance-Baseline.",
    source: "Eigener Report",
    format: "Whitepaper",
    channel: "Blog",
    cluster: "Media Innovation",
    keywords: ["Trendbericht"],
    mainKeyword: "KI Redaktion Q1",
    priorityScore: 90,
    effort: "L",
    status: "Published",
    owner: "Anna S.",
    scheduledDate: "2026-05-02",
  },
];

export const statusColors: Record<Status, string> = {
  "Idea": "bg-muted text-muted-foreground",
  "Planned": "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "In Production": "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "Review": "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  "Approved": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "Published": "bg-primary/15 text-primary",
};

export const priorityColors: Record<Priority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  high: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export const channels: Channel[] = ["LinkedIn", "Blog", "Newsletter", "Instagram", "YouTube", "Podcast"];
export const allStatuses: Status[] = ["Idea", "Planned", "In Production", "Review", "Approved", "Published"];
export const allFormats: Format[] = ["Article", "Carousel", "Reel", "Newsletter", "Whitepaper", "Video", "Podcast", "Post"];
