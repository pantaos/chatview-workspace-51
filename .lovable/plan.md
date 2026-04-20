
## Smart Workflow/Skill-Vorschläge unter dem Dashboard-Chat

Wenn der User im Dashboard-Suchfeld tippt, sollen passende Workflows, Assistenten und Skills als sleek Vorschlags-Chips direkt unter dem Eingabefeld erscheinen — ähnlich wie bei einer Spotlight-/Command-K-Suche.

### Verhalten

- Sobald der User mindestens 2 Zeichen eingibt, erscheint ein Vorschlags-Panel **direkt unter** der Suchleiste (floating, gleiche Breite wie Suchleiste)
- Fuzzy-Match gegen: `availableWorkflows` (Titel, Beschreibung), `availableAssistants` (Titel), `availableConversationalWorkflows` (Titel) und `allSkills` (Name, Beschreibung, Trigger-Phrasen)
- Max. 5 Treffer, gruppiert nach Typ (Assistent / Workflow / Skill) mit kleinen Typ-Badges
- Jeder Vorschlag zeigt: Icon links, Titel, kurze Beschreibung, Typ-Badge rechts
- Klick auf Vorschlag öffnet das jeweilige Item (Workflow/Assistent: gleiche Logik wie Karten-Klick; Skill: öffnet Chat mit pre-filled Skill)
- Schließt bei Escape, Klick außerhalb oder leerem Input
- Tastatur-Navigation: ↑/↓ zum Auswählen, Enter zum Öffnen
- Modernes Design: weißer Hintergrund, weicher Schatten, abgerundete Ecken (rounded-2xl), subtile Hover-States, gleiche visuelle Sprache wie SearchChat

### Technische Umsetzung

**Neue Komponente** `src/components/SearchSuggestions.tsx`:
- Props: `query: string`, `workflows`, `assistants`, `conversational`, `skills`, `onSelect(item, type)`
- Eigene Match-Funktion (case-insensitive substring + Trigger-Phrase-Match für Skills)
- Rendert Liste mit Icons aus `lucide-react` (passend zum Item-Typ)

**Änderung in `src/pages/Index.tsx`**:
- Wrapper um `SearchChat` mit `relative`-Position
- `SearchSuggestions` floating darunter wenn `searchInput.length >= 2` und nicht im Chat-Modus
- `onSelect`-Handler nutzt vorhandene `handleWorkflowClick` bzw. öffnet Chat mit Skill-Trigger

**Keine Änderung an `SearchChat.tsx`** — Vorschläge sind separates Overlay im Parent, damit die bestehende Slash-Command-Autocomplete im Chat unverändert bleibt.

### Dateien

| Datei | Änderung |
|------|--------|
| `src/components/SearchSuggestions.tsx` | Neu |
| `src/pages/Index.tsx` | Suggestions-Overlay unter SearchChat, State für Input + Outside-Click-Handler |
