
## Sleeker Suggestion Items + Feature Request Note

Make the suggestion rows in `SearchSuggestions.tsx` minimal: just the title and a small type badge. Description is hidden visually but still searched against.

### Changes to `src/components/SearchSuggestions.tsx`

- Remove the leading icon block (no `Icon` circle on the left).
- Remove the description line from the rendered row.
- Keep matching logic unchanged — title AND description are still fuzzy-matched.
- Tighten row padding (`py-2` instead of `py-2.5`) and use a single-line layout: title left, type badge right.
- Keep the small "Vorschläge" header, rounded-2xl panel, hover/active state, keyboard nav.

Resulting row:
```text
┌─────────────────────────────────────────────┐
│  Trendcast Generator              [Workflow]│
│  Email Draft                      [Skill]   │
└─────────────────────────────────────────────┘
```

### Feature Request Note (English)

Append a short feature request to the end of the chat reply (plain English, not in code):

> **Feature Request — Smart Suggestion Ranking**
> Right now suggestions match by simple substring on title + description. Next iteration should rank results by: (1) recency of use, (2) match position (title hits beat description hits), (3) user pin/favorite status. Also consider showing a "no matches — create new workflow?" CTA when query length ≥ 3 returns zero results.

### Files

| File | Change |
|------|--------|
| `src/components/SearchSuggestions.tsx` | Remove icon + description from row, tighten layout, keep description in match logic |
