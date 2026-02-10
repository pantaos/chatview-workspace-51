

# Plan: PANTA Flows — Plattform-Management Dashboard

## Uebersicht

Eine neue Seite `/panta-flows` als uebergeordnetes Plattform-Management-Dashboard. Du als Plattform-Betreiber kannst hier Tenants (Kunden-Organisationen) verwalten, ihnen Assistenten/Workflows zuweisen und plattformweite Community-Posts verschicken. Die Seite wird in der Sidebar unter Admin und Settings als dritter Eintrag angezeigt.

## Aufbau

Die Seite nutzt das gleiche Tab-Pattern wie Admin und Settings (MainLayout + Tabs).

### Tab 1: Dashboard (Uebersicht)
Mini-Analytics mit Stat-Cards:
- Anzahl Tenants
- Aktive User ueber alle Tenants
- Gesamte Token-Nutzung
- Neue Tenants diesen Monat

### Tab 2: Tenants
- Liste aller Tenants als Karten (Name, User-Anzahl, Status)
- Button "Neuen Tenant anlegen" oeffnet Dialog mit Name, Beschreibung, Logo-URL, Theme-Farbe
- Klick auf Tenant oeffnet einen Detail-Dialog mit Sub-Tabs:
  - **Analytics**: Token-Nutzung, aktive User, Queries des Tenants
  - **Theme**: Primaerfarbe, Akzentfarbe, Logo-URL konfigurieren
  - **Admins**: Liste der Admins, Button zum Hinzufuegen eines neuen Admins (Name, E-Mail, Rolle)

### Tab 3: Assistenten & Workflows
- Liste aller verfuegbaren Assistenten und Workflows aus dem Pool
- Jeder Eintrag hat einen "Zuordnen"-Button der einen Dialog oeffnet:
  - Tenant(s) auswaehlen (Multi-Select)
  - Sichtbarkeit: "Nur Admin" oder "Gesamte Organisation"
- Bereits zugeordnete Tenants werden als Badges angezeigt

### Tab 4: Community Posts
- Liste existierender plattformweiter Posts
- Button "Neuen Post erstellen" oeffnet Dialog mit:
  - Titel, Inhalt, Typ
  - Zielgruppe: "Alle Tenants" oder spezifische Tenants auswaehlen (Multi-Select)
- Bestehende Posts zeigen ihre Zielgruppe als Badges

## Technische Details

### Neue Dateien

| Datei | Zweck |
|-------|-------|
| `src/pages/PantaFlows.tsx` | Hauptseite mit Tabs |
| `src/components/panta-flows/PFDashboard.tsx` | Dashboard/Analytics Tab |
| `src/components/panta-flows/PFTenants.tsx` | Tenants-Liste und Verwaltung |
| `src/components/panta-flows/PFTenantDetailDialog.tsx` | Tenant-Detail mit Sub-Tabs (Analytics, Theme, Admins) |
| `src/components/panta-flows/PFCreateTenantDialog.tsx` | Dialog zum Anlegen eines neuen Tenants |
| `src/components/panta-flows/PFAssistantsWorkflows.tsx` | Assistenten/Workflows Pool mit Zuordnung |
| `src/components/panta-flows/PFAssignDialog.tsx` | Dialog zur Tenant-Zuordnung (Tenant-Auswahl + Sichtbarkeit) |
| `src/components/panta-flows/PFCommunityPosts.tsx` | Plattformweite Community Posts |
| `src/components/panta-flows/PFCreatePostDialog.tsx` | Post erstellen mit Tenant-Targeting |
| `src/types/pantaFlows.ts` | TypeScript-Typen (Tenant, PlatformPost, Assignment, etc.) |

### Geaenderte Dateien

| Datei | Aenderung |
|-------|----------|
| `src/App.tsx` | Route `/panta-flows` registrieren |
| `src/components/AppSidebar.tsx` | Neuer Eintrag "PANTA Flows" mit Layers-Icon zwischen Admin und Settings (sowohl collapsed als auch expanded Sidebar) |

### Datenstruktur (Mock-Daten, kein Backend)

```typescript
interface Tenant {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  totalUsers: number;
  activeUsers: number;
  tokensUsed: number;
  tokensLimit: number;
  admins: TenantAdmin[];
  createdAt: string;
  status: 'active' | 'inactive';
}

interface TenantAdmin {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Super Admin';
}

interface AssistantWorkflow {
  id: string;
  name: string;
  type: 'assistant' | 'workflow';
  description: string;
  assignments: TenantAssignment[];
}

interface TenantAssignment {
  tenantId: string;
  tenantName: string;
  visibility: 'admin-only' | 'organization';
}

interface PlatformPost {
  id: string;
  title: string;
  content: string;
  type: string;
  targetType: 'all' | 'specific';
  targetTenants: string[];
  createdAt: string;
  author: string;
}
```

### Sidebar-Integration

Im Bottom-Bereich der Sidebar wird zwischen "Admin" und "Settings" ein neuer Eintrag eingefuegt:
- Icon: `Layers` (von lucide-react)
- Label: "PANTA Flows"
- Route: `/panta-flows`
- Sowohl in der collapsed als auch expanded Sidebar

### Design-Pattern

- Gleiche Tab-Styles wie AdminSettings und Settings (border-bottom active indicator)
- Cards nutzen `bg-card` (weiss) auf `bg-background` (dezentes Blau)
- Dialoge nutzen das bestehende Dialog-Pattern mit fixed Close-Button (z-20, backdrop-blur)
- Stat-Cards im Dashboard-Tab folgen dem gleichen Layout wie AdminDashboard
- Responsive: Tabs horizontal scrollbar auf Mobile, Karten-Grid passt sich an

