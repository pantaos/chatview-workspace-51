## Ziel
Templates und Use Cases ("Tasks") auf einer Seite zusammenführen — im sleeken Template-Library-Design, sauber in zwei Bereiche getrennt: **Assistants** und **Tasks**. "Build an app" entfernen. Die separate `/use-cases`-Seite wird auf die neue gemeinsame Seite weitergeleitet.

## Neue Seite: `/templates` (Explorer)

### Struktur
1. **Header** — Eyebrow "Explorer", H1 "Discover assistants & tasks", Subtitle. Kein "Build an app"-Button.
2. **Top-Level Toggle** (Segment Control, links): `All` · `Assistants` · `Tasks` — bestimmt welche Sections sichtbar sind.
3. **Featured Rail** (nur sichtbar bei `All` / `Assistants`) — bestehende `FeaturedTemplateCard`s.
4. **Suchleiste** (global, durchsucht beide Typen — `name/title`, `description`, `useCases`, `team`, `taskType`, `integrations`).
5. **Filter Pills** (kontextabhängig):
   - Bei Assistants: bestehende Tag-Pills + "Community Apps".
   - Bei Tasks: Team-Pills (Engineering, Sales, HR, …) + Task-Type-Pills.
   - Bei `All`: kompakte Pill-Reihe "Tags · Teams · Task Types" als Dropdowns, um Überladung zu vermeiden.
6. **Sections (vertikal gestapelt)**:
   - **Assistants** — bestehendes 3-Spalten-Grid mit `TemplateCard`. Header: "Assistants · {n}".
   - **Tasks** — gleiches Grid-Layout (3 cols), aber mit neuer schlanker `TaskCard`-Variante (gleicher Card-Style wie `TemplateCard`: `border border-border/60 rounded-xl bg-card`, 9×9 Icon-Container, Titel, kleine Meta-Zeile mit Team + "saves X", Integrations als Mini-Badges). Header: "Tasks · {n}". Klick → `navigate("/use-cases/run/:id")` (bleibt). Zweiter Action "Schedule" → `ScheduleDialog`.
7. **Empty State** pro Section, wenn Filter nichts liefern.

### Verhalten
- Toggle steuert nur Sichtbarkeit; Suche/Filter wirken übergreifend.
- Bei aktiver Suche und `All`-Toggle: beide Sections nebeneinander in der Reihenfolge Assistants → Tasks; Section komplett ausblenden wenn 0 Treffer.
- "Build an app"-Button + zugehörige Imports (Users-Icon dafür) entfernen.

## Änderungen im Detail

### `src/pages/TemplateLibrary.tsx`
- Tasks-Daten importieren (aus extrahiertem Modul, siehe unten) und in eigenem Grid rendern.
- State: `view: 'all' | 'assistants' | 'tasks'`.
- "Build an app"-Button entfernen.
- Subtitle anpassen ("Assistants you can personalize, plus ready-to-run tasks for your team.").
- Sticky Header (passend zu anderen Core-Pages — Pattern aus Editorial/CommunityFeed übernehmen): Title + Subtitle + Toggle + Search + Pills sticky oben mit Border-Bottom; Sections scrollen.

### Neu: `src/data/useCases.ts`
- `UseCase`-Interface + `allUseCases`-Array aus `src/pages/UseCases.tsx` extrahieren, damit beide Seiten dieselbe Quelle nutzen. Icons bleiben Lucide-Komponenten.

### Neu: `src/components/TaskCard.tsx`
- Visuell identisch zu `TemplateCard` (gleiche Border, Radius, Padding, Icon-Tile-Größe).
- Inhalt: Icon · Name · Team-Pill · "saves X" · Integration-Mini-Badges (max 3 + "+N").
- Sekundärer Button "Schedule" (Calendar-Icon, ghost), Primary-Action ist der Card-Klick → Run.

### `src/pages/UseCases.tsx`
- Datei vereinfachen: redirect auf `/templates?view=tasks` (oder Datei + Route entfernen). Empfehlung: **Route auf Redirect umstellen**, Sidebar-Eintrag "Use Cases" entfernen oder auf `/templates` zeigen lassen.

### `src/components/AppSidebar.tsx`
- "Use Cases"-Eintrag entfernen oder mit Templates zusammenlegen (Label "Explorer" oder "Templates"). Ich entferne den Use-Cases-Eintrag und benenne Templates-Eintrag in "Explorer" um — bestätigt das visuelle Zusammenführen.

### `src/App.tsx`
- `/use-cases` → Redirect zu `/templates?view=tasks` (Run-Route `/use-cases/run/:id` bleibt unverändert).

## Out of Scope
- Keine Datenbank-/Persistenz-Änderungen.
- Kein Umbau von `UseCaseRun` oder `ScheduleDialog`.
- Kein Redesign der `TemplateCard` selbst.
