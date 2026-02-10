

# Plan: PANTA Flows — UI-Verbesserungen

## Uebersicht

Mehrere Verbesserungen am PANTA Flows Dashboard: Tabs links buendig, Logo-Upload fuer Tenants, erweiterte Analytics, und ein neues Popup-Pattern fuer Assistenten/Workflows (aehnlich wie bei Integrations).

---

## 1. Tabs links buendig

In `src/pages/PantaFlows.tsx` die TabsList von `flex` (zentriert) auf `justify-start` aendern, sodass die Tabs am linken Rand beginnen.

---

## 2. Tenant-Typ erweitern

In `src/types/pantaFlows.ts` und `src/data/pantaFlowsData.ts`:
- `logoUrl` wird zu einem konkreten Bildpfad (Mock-Daten mit Platzhalter-URLs)
- Neue Felder: `secondaryColor` und `backgroundColor` neben den bestehenden `primaryColor` und `accentColor`
- `description` bleibt im Typ (wird in manchen Views gebraucht), aber wird aus dem "Neuen Tenant anlegen"-Dialog entfernt

---

## 3. Neuen Tenant anlegen — Dialog anpassen

In `src/components/panta-flows/PFCreateTenantDialog.tsx`:
- **Entfernen**: Beschreibungs-Feld
- **Hinzufuegen**: Logo-Upload als Bild-Datei (lokaler Preview via `URL.createObjectURL`)
- **Hinzufuegen**: Drei Farbfelder statt einem: Primaerfarbe, Akzentfarbe, Hintergrundfarbe (jeweils mit Color-Picker + Hex-Input)

---

## 4. Tenant-Karten mit Logo

In `src/components/panta-flows/PFTenants.tsx`:
- Den farbigen Punkt durch das Tenant-Logo ersetzen (oder Fallback-Initial wenn kein Logo)
- Logo als kleines rundes Bild (32x32) neben dem Namen

---

## 5. Tenant-Detail: Analytics erweitern

In `src/components/panta-flows/PFTenantDetailDialog.tsx`, der Analytics-Tab bekommt deutlich mehr Daten (angelehnt an AdminDashboard):
- **Stat-Cards**: Aktive User, Token-Nutzung (mit Progress-Bar), Queries gesendet, Stunden gespart
- **Chart**: Token-Nutzung ueber Zeit als Area-Chart (mit recharts, wie im AdminDashboard)
- **Top Assistenten**: Liste der meistgenutzten Assistenten des Tenants
- **Usage by Period**: Woche/Monat Vergleich

---

## 6. Tenant-Detail: Theme anpassen

Im Theme-Tab des Tenant-Detail-Dialogs:
- Alle drei Farben editierbar machen (nicht nur readOnly): Primaerfarbe, Akzentfarbe, Hintergrundfarbe
- Logo anzeigen (wenn vorhanden) mit Option zum Aendern (Upload)
- Color-Picker + Hex-Input Kombination (wie im Create-Dialog)

---

## 7. Assistenten & Workflows — Neues Popup-Pattern

`src/components/panta-flows/PFAssistantsWorkflows.tsx` komplett ueberarbeiten:

Statt dem bisherigen "Zuordnen"-Button pro Eintrag kommt ein **Klick auf die Karte** selbst, der einen **Detail-Dialog** oeffnet (aehnlich dem Integration-Dialog-Pattern):

**Dialog-Aufbau:**
- Oben: Icon + Name + Typ-Badge + Beschreibung
- Mitte: "Zugeordnete Tenants" — Liste der aktuellen Zuweisungen mit Tenant-Name, Logo und Sichtbarkeits-Badge
- Unten: "Tenant hinzufuegen" — Dropdown/Select fuer Tenant + Radio fuer Sichtbarkeit ("Gesamte Organisation" / "Nur Admin") + Hinzufuegen-Button

Neuer Dialog: `src/components/panta-flows/PFAssistantDetailDialog.tsx`

Der alte `PFAssignDialog.tsx` wird nicht mehr gebraucht und kann entfernt werden.

---

## Technische Details

### Neue Dateien

| Datei | Zweck |
|-------|-------|
| `src/components/panta-flows/PFAssistantDetailDialog.tsx` | Detail-Popup fuer Assistenten/Workflows mit Beschreibung, Zuweisungen und Zuordnungs-Funktion |

### Geaenderte Dateien

| Datei | Aenderung |
|-------|----------|
| `src/pages/PantaFlows.tsx` | Tabs links buendig (`justify-start`) |
| `src/types/pantaFlows.ts` | Neue Felder `secondaryColor`, `backgroundColor` bei Tenant |
| `src/data/pantaFlowsData.ts` | Mock-Daten mit Logo-URLs und zusaetzlichen Farben |
| `src/components/panta-flows/PFCreateTenantDialog.tsx` | Beschreibung raus, Logo-Upload rein, drei Farbfelder |
| `src/components/panta-flows/PFTenants.tsx` | Logo in Tenant-Karten anzeigen |
| `src/components/panta-flows/PFTenantDetailDialog.tsx` | Analytics mit Charts und mehr Stats, Theme editierbar mit Logo-Upload |
| `src/components/panta-flows/PFAssistantsWorkflows.tsx` | Karten klickbar, oeffnen neuen Detail-Dialog statt altem Assign-Dialog |
| `src/components/panta-flows/PFAssignDialog.tsx` | Entfernen (wird durch PFAssistantDetailDialog ersetzt) |

### Logo-Upload

Da es kein Backend gibt, wird das Logo lokal per `<input type="file" accept="image/*">` hochgeladen und via `URL.createObjectURL()` als Preview angezeigt. Der Blob-URL wird im State gespeichert. Mock-Tenants bekommen einen Platzhalter (farbiger Kreis mit Initial als Fallback).

### Analytics-Charts

Fuer den Tenant-Detail-Analytics-Tab werden die gleichen Chart-Komponenten wie im AdminDashboard genutzt: `recharts` (AreaChart, BarChart) mit `ChartContainer` und `ChartTooltip` aus den UI-Komponenten. Die Daten sind Mock-Daten direkt in der Komponente.

