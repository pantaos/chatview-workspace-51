

# Plan: Subtiler Theme-Hintergrund statt reinem Weiss

## Idee

Statt auf jeder Seite einzeln etwas zu ändern, passen wir einfach die **CSS-Variable `--background`** an. Aktuell ist die `0 0% 100%` (reines Weiss). Wir ändern sie zu einem ganz leichten Blau-Ton, der den Hue der Primary-Farbe (229 = Blau) übernimmt:

**Vorher:** `--background: 0 0% 100%` (reines Weiss #FFFFFF)
**Nachher:** `--background: 225 30% 98%` (ganz zartes Blau, ca. #F8F9FD)

Das ist so subtil, dass man es kaum bemerkt — aber im Vergleich zu purem Weiss fühlt sich die UI sofort wärmer und gebrandeter an. Jede Stelle, die `bg-background` nutzt (MainLayout, Cards, Popover, etc.) bekommt automatisch diesen Ton.

## Was sich ändert

### 1. CSS-Variable `--background` (Light Mode)

Nur eine Zeile in `src/index.css`:

```
--background: 0 0% 100%;
```
wird zu:
```
--background: 225 30% 98%;
```

Das ergibt einen Farbton wie `#F8F9FD` — fast weiss, aber mit einem ganz leichten blauen Unterton.

### 2. Card-Hintergrund leicht anpassen

Die `--card` Variable ebenfalls minimal anpassen, damit Cards nicht auf dem gleichen Hintergrund "verschwinden", sondern sich leicht abheben:

```
--card: 0 0% 100%;
```
bleibt bei `0 0% 100%` (reines Weiss) — so entsteht ein natürlicher Kontrast: leicht blauer Hintergrund mit weissen Cards darauf.

### 3. Dashboard Gradient-Hero

Zusätzlich bekommt der Dashboard-Header (Greeting + Suchfeld + Tags) den farbigen Gradient wie im Screenshot:
- Gradient von Primary-Blau zu einem helleren Blau/Teal
- Weisser Text für Greeting
- Abgerundete untere Ecken für weichen Übergang
- Suchfeld und Tags visuell angepasst

## Dateien

| Datei | Änderung |
|-------|----------|
| `src/index.css` | `--background` auf `225 30% 98%` setzen, `--popover` ebenfalls leicht anpassen |
| `src/pages/Index.tsx` | Dashboard-Header mit Gradient-Container wrappen |

## Warum dieser Ansatz

- **Eine Zeile CSS** ändert den gesamten App-Hintergrund — kein manuelles Styling pro Seite nötig
- Cards bleiben weiss und heben sich natürlich vom leicht blauen Hintergrund ab
- Wenn der Client-Theme wechselt (z.B. zu Pink), muss nur die CSS-Variable angepasst werden
- Login-Seite ist nicht betroffen (hat eigenen Gradient-Hintergrund)
- Dark Mode bleibt unverändert (hat eigene `--background` Variable)
