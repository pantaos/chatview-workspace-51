
import { Skill } from "@/types/skills";

export const personalSkills: Skill[] = [
  {
    id: "ps-1",
    name: "Wöchentliche Zusammenfassung",
    description: "Erstellt eine Zusammenfassung aller E-Mails, Meetings und Aufgaben der letzten Woche",
    icon: "FileText",
    instruction: "Erstelle eine strukturierte Zusammenfassung der Aktivitäten der letzten Woche. Gruppiere nach: E-Mails (wichtigste Threads), Meetings (Entscheidungen & Action Items), und offene Aufgaben. Format: Markdown mit Überschriften.",
    triggers: {
      phrases: ["wöchentliche zusammenfassung", "weekly summary", "wochenbericht"],
      slashCommand: "/weekly-summary"
    },
    parameters: [
      { id: "p1", name: "timeframe", label: "Zeitraum", type: "select", required: true, options: ["Letzte 7 Tage", "Letzte 14 Tage", "Dieser Monat"] },
    ],
    requiredIntegrations: ["microsoft", "google"],
    status: "active",
    scope: "personal",
    schedule: {
      enabled: true,
      frequency: "weekly",
      day: "Montag",
      time: "08:00",
      notifyOnComplete: true
    },
    createdBy: { id: "u1", name: "Moin Arian" },
    usageCount: 24,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ps-2",
    name: "Meeting-Vorbereitung",
    description: "Analysiert den Kalender und bereitet kontextrelevante Informationen für das nächste Meeting vor",
    icon: "Calendar",
    instruction: "Prüfe den Kalender des Nutzers für das nächste Meeting. Recherchiere Teilnehmer, fasse den letzten E-Mail-Verkehr zusammen und erstelle eine Agenda-Empfehlung.",
    triggers: {
      phrases: ["meeting vorbereiten", "nächstes meeting", "meeting prep"],
      slashCommand: "/meeting-prep"
    },
    parameters: [],
    requiredIntegrations: ["microsoft"],
    status: "active",
    scope: "personal",
    createdBy: { id: "u1", name: "Moin Arian" },
    usageCount: 12,
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ps-3",
    name: "E-Mail-Entwurf",
    description: "Erstellt einen professionellen E-Mail-Entwurf basierend auf Kontext und Anweisungen",
    icon: "Mail",
    instruction: "Erstelle einen professionellen E-Mail-Entwurf. Berücksichtige den Ton (formell/informell) und bisherigen Kontext. Biete 2 Varianten an.",
    triggers: {
      phrases: ["email schreiben", "mail entwurf", "draft email"],
      slashCommand: "/email-draft"
    },
    parameters: [
      { id: "p1", name: "recipient", label: "Empfänger", type: "text", required: true, placeholder: "Name oder E-Mail" },
      { id: "p2", name: "topic", label: "Betreff/Thema", type: "text", required: true, placeholder: "Worum geht es?" },
      { id: "p3", name: "tone", label: "Tonalität", type: "select", required: false, options: ["Formell", "Informell", "Freundlich"] },
    ],
    requiredIntegrations: [],
    status: "active",
    scope: "personal",
    createdBy: { id: "u1", name: "Moin Arian" },
    usageCount: 38,
    lastUsed: new Date(Date.now() - 4 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

export const teamSkills: Skill[] = [
  {
    id: "ts-1",
    name: "PR Review Alert",
    description: "Überwacht Pull Requests und fasst Änderungen zusammen zur schnellen Review",
    icon: "GitPullRequest",
    instruction: "Prüfe offene Pull Requests im konfigurierten Repository. Fasse Änderungen zusammen, identifiziere potenzielle Konflikte und erstelle eine Review-Checkliste.",
    triggers: {
      phrases: ["pr review", "pull request prüfen", "code review"],
      slashCommand: "/pr-review"
    },
    parameters: [
      { id: "p1", name: "repo", label: "Repository", type: "select", required: true, options: ["panta-os/frontend", "panta-os/backend", "panta-os/infra"] },
    ],
    requiredIntegrations: ["github"],
    status: "active",
    scope: "team",
    teamId: "t-eng",
    teamName: "Engineering",
    createdBy: { id: "u2", name: "Sarah Mueller" },
    usageCount: 89,
    lastUsed: new Date(Date.now() - 3 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ts-2",
    name: "Standup Bot",
    description: "Sammelt Standup-Updates vom Team und erstellt eine konsolidierte Übersicht",
    icon: "Users",
    instruction: "Frage jeden Teamteilnehmer nach: Was habe ich gestern gemacht? Was mache ich heute? Gibt es Blocker? Konsolidiere die Antworten in einer Übersicht.",
    triggers: {
      phrases: ["standup", "daily standup", "standup starten"],
      slashCommand: "/standup"
    },
    parameters: [],
    requiredIntegrations: ["slack"],
    status: "active",
    scope: "team",
    teamId: "t-eng",
    teamName: "Engineering",
    schedule: {
      enabled: true,
      frequency: "daily",
      time: "09:00",
      notifyOnComplete: true
    },
    createdBy: { id: "u2", name: "Sarah Mueller" },
    usageCount: 156,
    lastUsed: new Date(Date.now() - 12 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ts-3",
    name: "Content-Freigabe",
    description: "Prüft und leitet Content-Entwürfe durch den Genehmigungsprozess",
    icon: "CheckSquare",
    instruction: "Analysiere den eingereichten Content-Entwurf. Prüfe auf Markenkonformität, Tonalität und Vollständigkeit. Erstelle einen Prüfbericht und leite zur Genehmigung weiter.",
    triggers: {
      phrases: ["content freigabe", "content prüfen", "content approval"],
      slashCommand: "/content-review"
    },
    parameters: [
      { id: "p1", name: "content", label: "Content-Entwurf", type: "textarea", required: true, placeholder: "Text einfügen oder Datei hochladen" },
      { id: "p2", name: "channel", label: "Kanal", type: "select", required: true, options: ["Newsletter", "Social Media", "Blog", "Website"] },
    ],
    requiredIntegrations: [],
    status: "active",
    scope: "team",
    teamId: "t-mkt",
    teamName: "Marketing",
    createdBy: { id: "u3", name: "Lisa Weber" },
    usageCount: 42,
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ts-4",
    name: "Kundendaten-Recherche",
    description: "Recherchiert und konsolidiert Kundendaten aus CRM und E-Mails vor einem Gespräch",
    icon: "Search",
    instruction: "Recherchiere den angegebenen Kunden im CRM. Fasse letzte Interaktionen, offene Deals und relevante E-Mail-Verläufe zusammen. Erstelle eine kompakte Kundenübersicht.",
    triggers: {
      phrases: ["kundenrecherche", "kunde vorbereiten", "customer research"],
      slashCommand: "/customer-research"
    },
    parameters: [
      { id: "p1", name: "customerName", label: "Kundenname", type: "text", required: true, placeholder: "Firma oder Kontaktname" },
    ],
    requiredIntegrations: ["hubspot", "microsoft"],
    status: "active",
    scope: "team",
    teamId: "t-sales",
    teamName: "Sales",
    createdBy: { id: "u4", name: "Thomas Klein" },
    usageCount: 67,
    lastUsed: new Date(Date.now() - 6 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

export const allSkills: Skill[] = [...personalSkills, ...teamSkills];

// Helper to match user input against skill triggers
export function findMatchingSkill(input: string, skills: Skill[]): Skill | null {
  const lowerInput = input.toLowerCase().trim();
  
  // Check slash commands first
  if (lowerInput.startsWith("/")) {
    const match = skills.find(s => 
      s.status === "active" && s.triggers.slashCommand === lowerInput
    );
    if (match) return match;
  }
  
  // Check trigger phrases
  for (const skill of skills) {
    if (skill.status !== "active") continue;
    for (const phrase of skill.triggers.phrases) {
      if (lowerInput.includes(phrase.toLowerCase())) {
        return skill;
      }
    }
  }
  
  return null;
}

// Get available slash commands for autocomplete
export function getSlashCommands(skills: Skill[]): { command: string; name: string; description: string }[] {
  return skills
    .filter(s => s.status === "active" && s.triggers.slashCommand)
    .map(s => ({
      command: s.triggers.slashCommand!,
      name: s.name,
      description: s.description,
    }));
}
