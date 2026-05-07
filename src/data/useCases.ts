import {
  BarChart3,
  Bell,
  Users,
  PieChart,
  Target,
  Briefcase,
  RefreshCw,
  ClipboardList,
  Calendar,
  UserCheck,
  TrendingUp,
  Megaphone,
  Lightbulb,
  Mail,
  DollarSign,
  FileText,
  GraduationCap,
} from "lucide-react";

export type Lang = 'de' | 'en';

export interface UseCaseLocalized {
  name?: string;
  description?: string;
  longDescription?: string;
  inputs?: string[];
  prefilledPrompt?: string;
}

export interface UseCase {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  saves: string;
  status: "ready";
  integrations: string[];
  team: string;
  taskType: string;
  // Store metadata
  description?: string;
  longDescription?: string;
  duration?: string;     // e.g. "3-5 min"
  bestFor?: string;      // e.g. "Content Teams, Marketing"
  language?: string;     // e.g. "Deutsch"
  createdBy?: string;    // e.g. "PANTA"
  inputs?: string[];     // "What you need" pills
  prefilledPrompt?: string; // Pre-written prompt shown in the "Jetzt ausprobieren" textarea
  i18n?: Partial<Record<Lang, UseCaseLocalized>>;
}

export function localizeUseCase(u: UseCase, lang: Lang): UseCase {
  const loc = u.i18n?.[lang];
  if (!loc) return u;
  return {
    ...u,
    name: loc.name ?? u.name,
    description: loc.description ?? u.description,
    longDescription: loc.longDescription ?? u.longDescription,
    inputs: loc.inputs ?? u.inputs,
    prefilledPrompt: loc.prefilledPrompt ?? u.prefilledPrompt,
  };
}

export const useCaseTeams = [
  "Engineering",
  "Sales",
  "HR",
  "Finance",
  "Marketing",
  "Education",
];

export const useCaseTaskTypes = [
  "Reporting",
  "Data Sync",
  "Notifications",
  "Access Mgmt",
  "Research",
];

export const allUseCases: UseCase[] = [
  // Engineering
  { id: "1", name: "Weekly Summary", icon: BarChart3, saves: "1 hr/week", status: "ready", integrations: ["GitHub", "Slack"], team: "Engineering", taskType: "Reporting" },
  { id: "2", name: "PR Review Alert", icon: Bell, saves: "30 min/day", status: "ready", integrations: ["GitHub", "Jira"], team: "Engineering", taskType: "Notifications" },
  { id: "3", name: "Standup Bot", icon: Users, saves: "15 min/day", status: "ready", integrations: ["Slack"], team: "Engineering", taskType: "Reporting" },
  // Sales
  { id: "10", name: "Deal Pipeline Report", icon: PieChart, saves: "2 hr/week", status: "ready", integrations: ["Salesforce", "Slack"], team: "Sales", taskType: "Reporting" },
  { id: "11", name: "Lead Score Digest", icon: Target, saves: "45 min/day", status: "ready", integrations: ["HubSpot", "Slack"], team: "Sales", taskType: "Notifications" },
  { id: "12", name: "Meeting Prep Brief", icon: Briefcase, saves: "20 min/mtg", status: "ready", integrations: ["Salesforce", "Calendar"], team: "Sales", taskType: "Research" },
  { id: "13", name: "CRM Data Sync", icon: RefreshCw, saves: "1 hr/day", status: "ready", integrations: ["Salesforce", "HubSpot"], team: "Sales", taskType: "Data Sync" },
  // HR
  { id: "20", name: "Onboarding Checklist", icon: ClipboardList, saves: "3 hr/hire", status: "ready", integrations: ["Slack", "Notion"], team: "HR", taskType: "Access Mgmt" },
  { id: "21", name: "PTO Balance Alert", icon: Calendar, saves: "30 min/week", status: "ready", integrations: ["BambooHR", "Slack"], team: "HR", taskType: "Notifications" },
  { id: "22", name: "Engagement Survey", icon: UserCheck, saves: "2 hr/month", status: "ready", integrations: ["Slack", "Google Forms"], team: "HR", taskType: "Research" },
  // Marketing
  { id: "30", name: "Campaign Performance", icon: TrendingUp, saves: "1.5 hr/week", status: "ready", integrations: ["Google Ads", "Slack"], team: "Marketing", taskType: "Reporting" },
  { id: "31", name: "Social Media Digest", icon: Megaphone, saves: "45 min/day", status: "ready", integrations: ["Buffer", "Slack"], team: "Marketing", taskType: "Notifications" },
  { id: "32", name: "Content Ideas Generator", icon: Lightbulb, saves: "1 hr/week", status: "ready", integrations: ["Google Trends", "Notion"], team: "Marketing", taskType: "Research" },
  { id: "33", name: "Email Drip Sync", icon: Mail, saves: "30 min/day", status: "ready", integrations: ["Mailchimp", "HubSpot"], team: "Marketing", taskType: "Data Sync" },
  // Finance
  { id: "40", name: "Expense Report Summary", icon: DollarSign, saves: "2 hr/week", status: "ready", integrations: ["QuickBooks", "Slack"], team: "Finance", taskType: "Reporting" },
  { id: "41", name: "Invoice Reminder", icon: Bell, saves: "1 hr/week", status: "ready", integrations: ["QuickBooks", "Email"], team: "Finance", taskType: "Notifications" },
  // Cross-functional
  { id: "50", name: "Angebotsprozess", icon: FileText, saves: "4 Std./Angebot", status: "ready", integrations: ["CRM", "E-Mail", "PDF"], team: "Sales", taskType: "Reporting" },
  // Education
  { id: "60", name: "Report Card Generator", icon: GraduationCap, saves: "2 hr/student", status: "ready", integrations: ["PDF", "Templates"], team: "Education", taskType: "Reporting" },
];
