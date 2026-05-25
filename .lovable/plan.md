## Ziel
Beim Ausklappen der "Use Case Stories" sollen die ersten 4 Karten exakt dort bleiben wo sie im Scroll-Zustand sind — keine Größen-/Layoutsprünge. Weitere Karten erscheinen in zusätzlichen Reihen darunter.

## Problem heute
- Collapsed: horizontaler Scroller, Karten mit fixer Breite (`w-[180px] sm:w-[220px] md:w-[240px]`) und Höhe `h-[200px] sm:h-[240px]`.
- Expanded: wechselt zu `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5` → Karten werden breiter, 5 statt 4 pro Reihe, alles springt.

## Änderung (nur `src/pages/TemplateLibrary.tsx`)
1. Expanded-Branch ebenfalls als Grid mit **4 Spalten auf Desktop** rendern, passend zur Anzahl sichtbarer Karten im Scroll-Zustand:
   - `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4`
2. Karten behalten Höhe/Stil von `StoryCard` (unverändert). Die Breite richtet sich nach Grid-Spalte — entspricht visuell ~240px wie im Scroller bei Standard-Containerbreite.
3. Kein weiteres Restyling.

## Ergebnis
- Erste Reihe (4 Karten) bleibt optisch identisch.
- "View all" blendet einfach weitere Reihen darunter ein.
- Kein Layoutshift mehr beim Toggle.