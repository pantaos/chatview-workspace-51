

# Plan: Experience PANTA Flows — Interaktive Produkt-Demo-Seite

## Übersicht

Eine neue, eigenständige Seite (`/experience`) die als interaktive Produkt-Demo funktioniert. Man kann sich durchklicken und versteht was PANTA Flows ist, welche Bausteine es gibt (Chat, Assistenten, Apps) und sieht am HDI Content-Workflow ein konkretes Beispiel Schritt für Schritt.

Die Seite wird als externer Link aus den Settings heraus geöffnet (neuer Tab) und hat **kein Sidebar-Layout** — sie steht komplett für sich, clean und präsentationstauglich.

---

## Aufbau der Seite

### Section 1: Hero

Voller Gradient-Header (wie Dashboard, aber grösser) mit:
- PANTA Logo
- "Die Enterprise-KI-Plattform" Headline
- Subline: "Strukturiert. Skalierbar. DSGVO-konform."
- CTA-Button: "Workflow-Demo starten" (scrollt zu Section 3)

### Section 2: Drei Bausteine

Drei schlanke Karten nebeneinander (responsive: untereinander auf Mobile):

| Chat | Assistenten | Apps |
|------|------------|------|
| Flexible, sichere KI | Rollen- & aufgabenspezifische KI | End-to-End Business Engines |
| Multi-Model, Websuche | Team-Sharing | Review-Schritte & Ubergaben |

Minimales Design — Icon, Titel, 2-3 Bullet Points. Keine schweren Cards, eher wie die Integrations-Kacheln.

### Section 3: HDI Workflow Demo (Interaktiv)

Das Herzstück. Ein interaktiver Stepper der die 7 Schritte des HDI Content-Workflows zeigt:

```text
Step 1: Choose Insurance Topic
Step 2: Find Content Ideas (AI/RSS)
Step 3: Create First Article Draft
Step 4: Tips zur Anpassung
Step 5: Final Preview & Approval
Step 6: Vorteile der neuen Bestimmungen
Step 7: Ausblick & Handlungsempfehlungen
```

**UI-Pattern:**
- Links: Vertikale Step-Liste mit Nummern und Titeln (aktiver Step hervorgehoben)
- Rechts: Content-Preview des aktiven Steps mit dem echten Inhalt aus dem PDF
- "Weiter" / "Zurück" Buttons zum Durchklicken
- Approval-Steps haben ein spezielles Badge/Icon

Auf Mobile: Steps als horizontaler Dot-Indicator oben, Content darunter.

### Section 4: Footer

- Integrationen als kleine Icon-Reihe (Microsoft, Google, Notion, OpenAI, ElevenLabs, etc.)
- "Kontakt: hello@pantaos.com"
- Link zurück zur App

---

## Verlinkung aus Settings

In der Settings-Seite unter dem "General" Tab wird ein neuer Eintrag hinzugefügt:

```text
[Rocket Icon]  Experience PANTA Flows
               Interaktive Produkt-Demo ansehen
                                          [External Link →]
```

Öffnet `/experience` in einem neuen Tab.

---

## Technische Details

### Neue Dateien

| Datei | Zweck |
|-------|-------|
| `src/pages/Experience.tsx` | Die komplette Demo-Seite (kein MainLayout, standalone) |
| `src/data/hdiWorkflowDemo.ts` | HDI Workflow Steps mit Content aus dem PDF |

### Geänderte Dateien

| Datei | Änderung |
|-------|----------|
| `src/App.tsx` | Route `/experience` hinzufügen |
| `src/pages/Settings.tsx` | Link zur Experience-Seite im General Tab |

### Seiten-Design

- **Kein MainLayout/Sidebar** — die Seite steht für sich
- Nutzt den gleichen Theme-Gradient wie das Dashboard
- Background: `bg-background` (das dezente Blau)
- Cards: `bg-card` (reines Weiss)
- Smooth Scroll zwischen Sections
- Animierte Transitions beim Step-Wechsel

### HDI Demo Daten

Die 7 Steps aus dem PDF werden als strukturierte Daten abgelegt:

```typescript
interface DemoStep {
  id: number;
  title: string;        // z.B. "Choose the Insurance Topic"
  type: 'input' | 'ai-processing' | 'preview' | 'approval';
  content: string;      // Der echte Content aus dem PDF
  isApproval?: boolean;
}
```

### Responsive

- Desktop: 2-Column Layout bei der Workflow-Demo (Steps links, Content rechts)
- Tablet: Gleich aber kompakter
- Mobile: Single Column, Steps als Dots oben

