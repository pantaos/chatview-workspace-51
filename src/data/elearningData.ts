export type Role = "student" | "instructor";
export type MaterialType = "pdf" | "video" | "link";
export type TaskStatus = "not_started" | "in_progress" | "done";

export interface Material {
  id: string;
  moduleId: string;
  type: MaterialType;
  title: string;
  url: string;
}

export interface Task {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  embedType?: "pdf" | "video";
  embedUrl?: string;
}

export interface Module {
  id: string;
  order: number;
  title: string;
  description: string;
  scheduledAt: string; // ISO
  teamsLink: string;
  materials: Material[];
  tasks: Task[];
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  author: string;
}

export interface Student {
  id: string;
  name: string;
}

export interface ProgressState {
  materialsOpened: Record<string, boolean>;
  videoProgress: Record<string, number>; // 0-100
  taskStatus: Record<string, TaskStatus>;
}

export const STUDENTS: Student[] = [
  { id: "s1", name: "Alex Schmidt" },
  { id: "s2", name: "Maria Lopez" },
  { id: "s3", name: "Jonas Weber" },
];

const now = new Date();
const inDays = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();

const SEED_MODULES: Module[] = [
  {
    id: "m1",
    order: 1,
    title: "Introduction to AI Workflows",
    description: "Get oriented with the core concepts of AI-driven workflow automation.",
    scheduledAt: inDays(-2),
    teamsLink: "https://teams.microsoft.com/l/meetup-join/sample-1",
    materials: [
      { id: "mat1", moduleId: "m1", type: "pdf", title: "Course Syllabus", url: "https://www.africau.edu/images/default/sample.pdf" },
      { id: "mat2", moduleId: "m1", type: "video", title: "Welcome Video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "mat3", moduleId: "m1", type: "link", title: "Reading: AI Basics", url: "https://en.wikipedia.org/wiki/Artificial_intelligence" },
    ],
    tasks: [
      { id: "t1", moduleId: "m1", title: "Self-introduction", description: "Write a short intro about your background and learning goals." },
    ],
  },
  {
    id: "m2",
    order: 2,
    title: "Prompt Engineering Fundamentals",
    description: "Learn how to craft effective prompts for LLMs.",
    scheduledAt: inDays(2),
    teamsLink: "https://teams.microsoft.com/l/meetup-join/sample-2",
    materials: [
      { id: "mat4", moduleId: "m2", type: "video", title: "Prompt Patterns", url: "https://www.youtube.com/embed/5i2Hn8OG94o" },
      { id: "mat5", moduleId: "m2", type: "pdf", title: "Prompt Cheatsheet", url: "https://www.africau.edu/images/default/sample.pdf" },
    ],
    tasks: [
      { id: "t2", moduleId: "m2", title: "Write 3 prompts", description: "Create three prompts for different use cases and share results.", embedType: "video", embedUrl: "https://www.youtube.com/embed/5i2Hn8OG94o" },
    ],
  },
  {
    id: "m3",
    order: 3,
    title: "Building Your First Agent",
    description: "Hands-on: construct a simple AI agent from scratch.",
    scheduledAt: inDays(7),
    teamsLink: "https://teams.microsoft.com/l/meetup-join/sample-3",
    materials: [
      { id: "mat6", moduleId: "m3", type: "video", title: "Agent Walkthrough", url: "https://www.youtube.com/embed/oUwjDXxXp-Q" },
      { id: "mat7", moduleId: "m3", type: "link", title: "Docs: Agent SDK", url: "https://docs.lovable.dev" },
    ],
    tasks: [
      { id: "t3", moduleId: "m3", title: "Build an agent", description: "Ship a working agent that responds to a single tool call." },
      { id: "t4", moduleId: "m3", title: "Demo recording", description: "Record a 1-minute demo of your agent." },
    ],
  },
  {
    id: "m4",
    order: 4,
    title: "Integrations & Tooling",
    description: "Connect external services and orchestrate multi-step flows.",
    scheduledAt: inDays(14),
    teamsLink: "https://teams.microsoft.com/l/meetup-join/sample-4",
    materials: [
      { id: "mat8", moduleId: "m4", type: "pdf", title: "Integration Patterns", url: "https://www.africau.edu/images/default/sample.pdf" },
      { id: "mat9", moduleId: "m4", type: "link", title: "Composio Docs", url: "https://docs.composio.dev" },
    ],
    tasks: [
      { id: "t5", moduleId: "m4", title: "Integrate a tool", description: "Add one integration to your agent and document it." },
    ],
  },
  {
    id: "m5",
    order: 5,
    title: "Deployment & Best Practices",
    description: "Ship your project and learn ongoing maintenance patterns.",
    scheduledAt: inDays(21),
    teamsLink: "https://teams.microsoft.com/l/meetup-join/sample-5",
    materials: [
      { id: "mat10", moduleId: "m5", type: "video", title: "Going to Production", url: "https://www.youtube.com/embed/9bZkp7q19f0" },
    ],
    tasks: [
      { id: "t6", moduleId: "m5", title: "Final project submission", description: "Submit a link to your deployed project.", embedType: "pdf", embedUrl: "https://www.africau.edu/images/default/sample.pdf" },
    ],
  },
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", title: "Welcome to the cohort!", body: "Excited to kick things off this week. Check Module 1 for materials.", createdAt: inDays(-3), author: "Instructor" },
  { id: "a2", title: "Office hours Friday", body: "Drop in any time between 14:00–16:00 for questions.", createdAt: inDays(-1), author: "Instructor" },
];

const LS = {
  role: "elearning:role",
  modules: "elearning:modules",
  announcements: "elearning:announcements",
  progress: (studentId: string) => `elearning:progress:${studentId}`,
};

// ---------- Role ----------
export function getRole(): Role {
  return (localStorage.getItem(LS.role) as Role) || "student";
}
export function setRole(r: Role) {
  localStorage.setItem(LS.role, r);
}

// ---------- Modules ----------
export function getModules(): Module[] {
  try {
    const stored = localStorage.getItem(LS.modules);
    if (stored) return JSON.parse(stored);
  } catch {}
  localStorage.setItem(LS.modules, JSON.stringify(SEED_MODULES));
  return SEED_MODULES;
}
export function saveModules(modules: Module[]) {
  localStorage.setItem(LS.modules, JSON.stringify(modules));
}
export function getModule(id: string): Module | undefined {
  return getModules().find((m) => m.id === id);
}

// ---------- Announcements ----------
export function getAnnouncements(): Announcement[] {
  try {
    const stored = localStorage.getItem(LS.announcements);
    if (stored) return JSON.parse(stored);
  } catch {}
  localStorage.setItem(LS.announcements, JSON.stringify(SEED_ANNOUNCEMENTS));
  return SEED_ANNOUNCEMENTS;
}
export function saveAnnouncements(a: Announcement[]) {
  localStorage.setItem(LS.announcements, JSON.stringify(a));
}

// ---------- Progress ----------
export function getProgress(studentId: string = "s1"): ProgressState {
  try {
    const stored = localStorage.getItem(LS.progress(studentId));
    if (stored) return JSON.parse(stored);
  } catch {}
  return { materialsOpened: {}, videoProgress: {}, taskStatus: {} };
}
export function saveProgress(p: ProgressState, studentId: string = "s1") {
  localStorage.setItem(LS.progress(studentId), JSON.stringify(p));
}

export function moduleCompletion(module: Module, p: ProgressState): number {
  const items = [
    ...module.materials.map((m) => {
      if (m.type === "video") return Math.min(100, p.videoProgress[m.id] || 0) >= 90 ? 1 : (p.videoProgress[m.id] || 0) / 100;
      return p.materialsOpened[m.id] ? 1 : 0;
    }),
    ...module.tasks.map((t) => {
      const s = p.taskStatus[t.id];
      if (s === "done") return 1;
      if (s === "in_progress") return 0.5;
      return 0;
    }),
  ];
  if (items.length === 0) return 0;
  return Math.round((items.reduce((a, b) => a + b, 0) / items.length) * 100);
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
