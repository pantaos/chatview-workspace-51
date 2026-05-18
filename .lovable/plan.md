## E-Learning Platform – Standalone MVP App

Add a new standalone app at `/elearning` (registered in `App.tsx`) that simulates a small learning platform with role switching. All data is mock data stored in `localStorage` (no backend) so it works fully offline within PANTA Flows.

### Routes
```
/elearning              → Dashboard (student or instructor view based on role)
/elearning/modules      → Module list (1–5, in order)
/elearning/modules/:id  → Module detail (materials + tasks)
/elearning/announcements
/elearning/manage       → Instructor-only: create/edit modules, materials, tasks, announcements + progress overview table
```

A single top header with: app title, navigation tabs, **role switcher** (Student / Instructor) — the user requested role toggling "in the edit section of the app", so this is a simple dropdown that persists in localStorage.

### Data model (mock, localStorage)
- `Module` — id, order (1–5), title, description, scheduledAt, teamsLink
- `Material` — id, moduleId, type: `pdf | video | link`, title, url, (videos can be YouTube/MP4)
- `Task` — id, moduleId, title, description, embedType?: `pdf | video`, embedUrl?
- `Announcement` — id, title, body, createdAt, author
- `Progress` (per student, per item) — materials opened (bool), video % watched, task status (`not_started | in_progress | done`)

Seed data: 5 modules with mix of PDF, video (YouTube embed), external link, and 1–2 tasks each. 2 announcements. 1 mock student profile.

### Student experience
- **Dashboard**: next upcoming session card (with Teams link button), per-module progress bars, list of open/unfinished items, latest 3 announcements.
- **Module list**: ordered cards 1–5 with progress bar + scheduled time.
- **Module detail**: tabs/sections for Materials and Tasks.
  - PDF → inline `<iframe>` viewer (toggle open).
  - Video → embedded player (YouTube iframe or `<video>` with `timeupdate` → progress %, auto-complete at ≥90%).
  - External link → opens new tab, marked opened on click.
  - Task click → **modal** (shadcn Dialog) with description, optional embedded PDF/video, "Mark as complete" button.
- All interactions update progress in localStorage; module progress = average of item completion.

### Instructor experience
- **Manage page** with tabs: Modules, Materials, Tasks, Announcements.
  - CRUD via dialogs (create / edit / delete). File "upload" is a URL field for the MVP (mock).
- **Overview table**: rows = students (use 3 mock students for demo), columns = modules, cells show completed item count / total + small progress bar.
- Can also post announcements from here.

### Files to add
- `src/data/elearningData.ts` — types + seed data + localStorage helpers (getModules, saveProgress, etc.)
- `src/pages/elearning/ELearningLayout.tsx` — shared header, nav, role switcher
- `src/pages/elearning/ELearningDashboard.tsx`
- `src/pages/elearning/ELearningModules.tsx`
- `src/pages/elearning/ELearningModuleDetail.tsx`
- `src/pages/elearning/ELearningAnnouncements.tsx`
- `src/pages/elearning/ELearningManage.tsx` (instructor)
- `src/components/elearning/TaskDialog.tsx`
- `src/components/elearning/VideoPlayer.tsx` (tracks % watched)
- `src/components/elearning/PdfViewer.tsx`

### Files to edit
- `src/App.tsx` — register the 5 elearning routes.

### Design
Follow project memory: minimalist, white cards on `#F8F9FD`, primary `#3f5fa9`, 3xl bold page headers + subtitle, list-based layouts with dividers, ResponsiveDialog/Dialog for modals, mobile-first.

### Out of scope (MVP)
- No real file uploads or backend (URL-based mock).
- No real auth — role switch is a UI toggle only.
- No notifications/email.
