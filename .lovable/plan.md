

# Plan: Assistenten/Workflows Detail-Dialog im Integrations-Stil

## Uebersicht

Der bestehende `PFAssistantDetailDialog` wird komplett ueberarbeitet und nutzt das `ResponsiveDialog`-Pattern (gleiche Komponente wie bei Google/Microsoft Integrations). Statt einem einfachen kleinen Dialog gibt es einen groesseren Dialog mit Sidebar-Tabs.

---

## Dialog-Aufbau (Tabs)

### Tab "General"
- Icon + Name + Typ-Badge (Assistent/Workflow)
- Beschreibungstext
- Use-Cases als Checkliste (mit Check-Icons, wie bei Integrations)
- Status-Info: Anzahl zugeordneter Tenants

### Tab "Tenants"
- Liste aller aktuell zugeordneten Tenants mit:
  - Tenant-Logo/Initial + Name
  - Sichtbarkeits-Badge ("Alle" / "Nur Admin")
  - Remove-Button (X) zum Entfernen
- Trennlinie
- "Tenant hinzufuegen"-Bereich:
  - Dropdown/Select fuer verfuegbare Tenants
  - Radio-Buttons: "Gesamte Organisation" / "Nur Admin"
  - "Zuordnen"-Button

---

## Technische Umsetzung

### Geaenderte Datei

`src/components/panta-flows/PFAssistantDetailDialog.tsx` — kompletter Umbau:
- Nutzt `ResponsiveDialog`, `ResponsiveDialogBody`, `ResponsiveDialogTabs`, `ResponsiveDialogContent` aus `@/components/ui/responsive-dialog`
- Zwei Tabs: `general` und `tenants`
- Desktop: Sidebar links mit Tab-Navigation, Content rechts (genau wie bei Integrations)
- Mobile: Tabs oben als horizontale Leiste, dann Content
- Gleiche Groesse und Styling wie AdminIntegrationDialog

### Keine weiteren Datei-Aenderungen noetig

`PFAssistantsWorkflows.tsx` bleibt wie es ist — oeffnet den Dialog beim Klick auf eine Karte.
