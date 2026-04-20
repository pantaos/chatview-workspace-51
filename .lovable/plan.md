
## Dashboard an Screenshot anpassen

Im Screenshot sieht das Dashboard so aus:
- **Hero-Bereich** mit blauem Gradient-Hintergrund, der nur die Begrüßung + Suchleiste enthält
- **Begrüßung zentriert**: "Guten Abend, Arian" (groß, weiß, fett)
- **Suchleiste** darunter (weiß, abgerundet, mit Icons rechts)
- **Außerhalb des Hero** (auf normalem Hintergrund): Tag-Filter, dann "Workflows & Assistenten" Überschrift mit Tabs und Karten
- **Kein Kalender** in der rechten Spalte sichtbar
- Hero ist eine **kompakte Box oben**, nicht die ganze Höhe

Aktuell hat das Dashboard ein 2-Spalten-Layout (Suche links, Kalender rechts) mit ausgedehntem Hero-Hintergrund.

### Änderungen an `src/pages/Index.tsx`

1. **Hero-Sektion umbauen**:
   - Volle Breite, zentrierter Inhalt (kein 2-Spalten-Grid)
   - Begrüßung zentriert über der Suchleiste
   - Suchleiste zentriert, max. Breite ~4xl
   - Kalender-Vorschau aus Hero entfernen
   - Hero wird kompakter (nur Padding für Begrüßung + Search)

2. **Unter dem Hero** (auf Standard-Seitenhintergrund):
   - "Nach Tags filtern" Sektion
   - "Workflows & Assistenten" Überschrift + "Assistent erstellen" Button
   - Tabs (Alle, Assistenten, Workflows, Tools, Favoriten) + Sortier-Button
   - Karten-Grid

3. **Kalender entfernen** vom Dashboard (laut Screenshot nicht mehr vorhanden auf Desktop). Mobile Calendar-Vorschau ebenfalls entfernen, um konsistent zu bleiben.

### Memory Update
- `mem://style/dashboard-hero-layout` aktualisieren: Single-column zentriertes Hero (Begrüßung + Search), Kalender nicht mehr Teil des Dashboards
- `mem://features/dashboard-calendar-preview` entfernen aus Index, ggf. Memory aktualisieren
