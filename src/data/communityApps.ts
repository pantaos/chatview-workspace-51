import { WorkflowTag } from "@/types/workflow";
import { TemplateVisibility } from "@/data/templates";

export type CommunityAppStatus = "pending" | "approved" | "rejected";
export type DemoAppType = "dashboard" | "tracker" | "notes" | "calculator";

export interface CommunityAppReviewSummary {
  framework: string;
  hasBackend: boolean;
  detectedColors: string[];
  standardized: boolean;
}

export interface CommunityApp {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: WorkflowTag[];
  submittedBy: string;
  submittedAt: string; // ISO
  status: CommunityAppStatus;
  rejectionReason?: string;
  fileName: string;
  reviewSummary: CommunityAppReviewSummary;
  visibility?: TemplateVisibility;
  demoType?: DemoAppType;
}

export const DEMO_TEMPLATES: { type: DemoAppType; title: string; description: string; icon: string; tagId: string }[] = [
  { type: "dashboard", title: "Revenue Pulse", description: "Real-time revenue dashboard with weekly trends and top customers.", icon: "BarChart3", tagId: "analysis" },
  { type: "tracker", title: "Habit Tracker", description: "Track daily habits with streaks and a weekly heatmap.", icon: "CheckCircle2", tagId: "productivity" },
  { type: "notes", title: "Quick Notes", description: "Lightweight note-taking with tags and instant search.", icon: "Notebook", tagId: "productivity" },
  { type: "calculator", title: "Tip Splitter", description: "Split bills with custom tip percentages and per-person totals.", icon: "Calculator", tagId: "productivity" },
];

export const seedCommunityApps: CommunityApp[] = [
  {
    id: "ca-invoice-splitter",
    title: "Invoice Splitter",
    description: "Drop a multi-invoice PDF and split it into one file per vendor.",
    icon: "FileText",
    tags: [{ id: "productivity", name: "Produktivität", color: "#3B82F6" }],
    submittedBy: "Nina Brandt",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    status: "pending",
    fileName: "invoice-splitter.zip",
    reviewSummary: {
      framework: "React + Vite",
      hasBackend: true,
      detectedColors: ["#5673eb", "#F97316"],
      standardized: true,
    },
    demoType: "tracker",
    title: "Meeting Recap Composer",
    description: "Turns raw meeting notes into a clean recap with action items.",
    icon: "Notebook",
    tags: [{ id: "communication", name: "Kommunikation", color: "#F59E0B" }],
    submittedBy: "Liam Becker",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: "approved",
    fileName: "meeting-recap.zip",
    reviewSummary: {
      framework: "React + Vite",
      hasBackend: false,
      detectedColors: ["#5673eb"],
      standardized: true,
    },
    visibility: { scope: "public", tenantIds: [] },
    demoType: "notes",
  },
  {
    id: "ca-color-stealer",
    title: "Brand Color Stealer",
    description: "Paste a URL and extract the brand's color palette as tokens.",
    icon: "Palette",
    tags: [{ id: "creative", name: "Kreativ", color: "#8B5CF6" }],
    submittedBy: "Sara Klein",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    status: "rejected",
    rejectionReason: "Frontend wiring incomplete — API key handling exposes the secret on the client.",
    fileName: "color-stealer.zip",
    reviewSummary: {
      framework: "React + Vite",
      hasBackend: true,
      detectedColors: ["#111111", "#FACC15"],
      standardized: false,
    },
    demoType: "dashboard",
  },
];
