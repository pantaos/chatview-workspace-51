
## Fix: Suggestions panel hidden behind hero gradient

The "Vorschläge" panel renders directly under the search bar but the hero's blue gradient background sits on top of (or clips) the dropdown, so only the header strip is visible.

### Root cause
In `src/pages/Index.tsx`, the hero container has the gradient + likely `overflow-hidden` / rounded corners, and the `SearchSuggestions` overlay is rendered **inside** that container. The dropdown extends below the hero box and gets clipped by the hero's bounds, while the tag-filter section below covers what little spills out.

### Fix

1. **`src/pages/Index.tsx`** — lift the suggestions out of the hero clip context:
   - Ensure the wrapper around `SearchChat` + `SearchSuggestions` is `relative` and **not** inside an `overflow-hidden` ancestor. Either remove `overflow-hidden` from the hero or move the suggestions wrapper to sit above the hero with `z-50`.
   - Add `z-50` to the suggestions positioning wrapper so it stacks above the tag-filter section.

2. **`src/components/SearchSuggestions.tsx`** — make the panel visually solid against the gradient:
   - Keep `bg-background` but add `shadow-2xl` + a stronger `border` so it reads as a floating card over the hero edge.
   - Already uses `top-full mt-2 z-50` — confirm it's not being clipped by `overflow-hidden` on a parent.

### Files

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Remove `overflow-hidden` on hero (or relocate suggestions wrapper) and add `z-50` to suggestions container |
| `src/components/SearchSuggestions.tsx` | Slight contrast tweak so the floating panel reads cleanly across hero/page boundary |
