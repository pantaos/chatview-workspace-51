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
    title: "Einführung in Versicherungen",
    description: "Grundlagen, Begriffe und Marktüberblick.",
    scheduledAt: inDays(-7),
    teamsLink: "https://teams.microsoft.com/l/meetup-join/sample-1",
    materials: [
      { id: "mat1", moduleId: "m1", type: "pdf", title: "Skript: Grundlagen", url: "https://www.africau.edu/images/default/sample.pdf" },
      { id: "mat2", moduleId: "m1", type: "video", title: "Willkommensvideo", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    ],
    tasks: [
      { id: "t1", moduleId: "m1", title: "Wissenscheck", description: "Beantworte die Quizfragen zum Modul." },
    ],
  },
  {
    id: "m2",
    order: 2,
    title: "Customer Needs Analysis",
    description: "Bedürfnisse erkennen, richtig fragen, verstehen.",
    scheduledAt: inDays(2),
    teamsLink: "https://teams.microsoft.com/l/meetup-join/sample-2",
    materials: [
      { id: "mat4", moduleId: "m2", type: "video", title: "Fragetechniken", url: "https://www.youtube.com/embed/5i2Hn8OG94o" },
      { id: "mat5", moduleId: "m2", type: "pdf", title: "Cheatsheet Bedarfsanalyse", url: "https://www.africau.edu/images/default/sample.pdf" },
    ],
    tasks: [
      { id: "t2", moduleId: "m2", title: "Rollenspiel vorbereiten", description: "Bereite ein Kundengespräch vor." },
    ],
  },
  {
    id: "m3",
    order: 3,
    title: "Lösungsvorstellung",
    description: "Produkte & Lösungen überzeugend präsentieren.",
    scheduledAt: inDays(9),
    teamsLink: "https://teams.microsoft.com/l/meetup-join/sample-3",
    materials: [
      { id: "mat6", moduleId: "m3", type: "video", title: "Präsentationstechniken", url: "https://www.youtube.com/embed/oUwjDXxXp-Q" },
    ],
    tasks: [
      { id: "t3", moduleId: "m3", title: "Pitch aufnehmen", description: "Nimm einen 2-minütigen Pitch auf." },
    ],
  },
  {
    id: "m4",
    order: 4,
    title: "Einwandbehandlung",
    description: "Typische Einwände erkennen und sicher beantworten.",
    scheduledAt: inDays(16),
    teamsLink: "https://teams.microsoft.com/l/meetup-join/sample-4",
    materials: [
      { id: "mat8", moduleId: "m4", type: "pdf", title: "Einwand-Katalog", url: "https://www.africau.edu/images/default/sample.pdf" },
    ],
    tasks: [
      { id: "t5", moduleId: "m4", title: "Top 5 Einwände", description: "Formuliere Antworten auf 5 häufige Einwände." },
    ],
  },
  {
    id: "m5",
    order: 5,
    title: "Abschluss & Follow-up",
    description: "Abschlussgespräche erfolgreich führen und nachfassen.",
    scheduledAt: inDays(23),
    teamsLink: "https://teams.microsoft.com/l/meetup-join/sample-5",
    materials: [
      { id: "mat10", moduleId: "m5", type: "video", title: "Closing-Techniken", url: "https://www.youtube.com/embed/9bZkp7q19f0" },
    ],
    tasks: [
      { id: "t6", moduleId: "m5", title: "Follow-up Mail", description: "Schreibe eine Follow-up Mail.", embedType: "pdf", embedUrl: "https://www.africau.edu/images/default/sample.pdf" },
    ],
  },
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", title: "Welcome to the cohort!", body: "Excited to kick things off this week. Check Module 1 for materials.", createdAt: inDays(-3), author: "Instructor" },
  { id: "a2", title: "Office hours Friday", body: "Drop in any time between 14:00–16:00 for questions.", createdAt: inDays(-1), author: "Instructor" },
];

const LS = {
  role: "elearning:role",
  modules: "elearning:modules:v2",
  announcements: "elearning:announcements:v2",
  progress: (studentId: string) => `elearning:progress:${studentId}:v2`,
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
