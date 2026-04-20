
## Token Tracking & Limits System

A new admin-only "Token Limits" tab inside the Admin Panel for full control over org-wide, per-model, per-team, and optional per-user token usage and caps. UI-only (mock data), prepared so a future backend can wire up real enforcement.

### Where it lives

New tab in `src/pages/AdminSettings.tsx`:
`Analytics · Users · Teams · Approvals · Community · Skills · Integrations · **Token Limits**`

Icon: `Gauge` (lucide). Admin-only — visibility already gated by `userType` check at top of page.

### Tab layout (`src/components/admin/AdminTokenLimits.tsx` — new)

Single page, clean list-based design (matches minimalist memory). Three stacked sections + one optional toggle section, each as a section header with cards inside — no nested tabs.

```text
┌─ Organization ─────────────────────────────────────┐
│ Total used: 6,742,300 / 10,000,000 tokens   [████░] │
│ Requests: 12,430                                    │
│ Global token limit:  [ 10,000,000 ] tokens   [Save] │
│ Reset cycle: ( ) Monthly  (•) Custom               │
└────────────────────────────────────────────────────┘

┌─ Models ───────────────────────────────────────────┐
│ Each row: model name · category badge · usage bar  │
│ · individual limit input · enabled toggle          │
│                                                    │
│ GPT-5            Text    2.1M / 4M   [4,000,000] ⬤ │
│ GPT-4o           Text    1.8M / 3M   [3,000,000] ⬤ │
│ Claude Sonnet    Text    900K / 2M   [2,000,000] ⬤ │
│ GPT-5 Mini       Text    600K / 1M   [1,000,000] ⬤ │
│ DALL-E 3         Image   180 / 500   [   500   ] ⬤ │
│ Gemini Flash Img Image    45 / 200   [   200   ] ⬤ │
└────────────────────────────────────────────────────┘

┌─ Team Model Access ────────────────────────────────┐
│ Matrix: rows = teams, cols = models                │
│ Checkbox per cell. "Select all" per row.           │
│                                                    │
│            GPT-5  GPT-4o  Claude  Mini  DALL-E ... │
│ Engineering  ☑     ☑      ☑      ☐    ☐          │
│ Marketing    ☐     ☑      ☐      ☑    ☑          │
│ Content      ☐     ☐      ☑      ☑    ☑          │
└────────────────────────────────────────────────────┘

┌─ User Daily Limits ───────────────────────────────┐
│ Enable per-user daily token caps   [ Switch ]     │
│ ── (when ON) ──                                    │
│ Default daily limit per user: [ 50,000 ] tokens    │
│ Override per user:  [ Manage user overrides → ]    │
│   opens dialog: searchable user list with         │
│   inline per-user limit input + reset to default  │
└────────────────────────────────────────────────────┘
```

### Components & files

| File | Change |
|------|--------|
| `src/components/admin/AdminTokenLimits.tsx` | **New** — main tab, all 4 sections |
| `src/components/admin/TeamModelAccessMatrix.tsx` | **New** — checkbox matrix subcomponent |
| `src/components/admin/UserDailyLimitsDialog.tsx` | **New** — per-user override dialog |
| `src/types/admin.ts` | **Add** types: `ModelLimit`, `TeamModelAccess`, `UserDailyLimit`, `OrgTokenLimits` |
| `src/data/tokenLimitsData.ts` | **New** — mock data: models list, current usage, team access matrix, user overrides |
| `src/pages/AdminSettings.tsx` | Add `token-limits` tab entry + `TabsContent` |

### Type sketch (added to `src/types/admin.ts`)

```ts
type ModelCategory = 'text' | 'image';
interface ModelLimit {
  id: string;
  name: string;            // "GPT-5", "DALL-E 3"
  category: ModelCategory;
  enabled: boolean;
  limit: number;           // tokens (text) or requests (image)
  used: number;
}
interface TeamModelAccess { teamId: string; modelIds: string[]; }
interface UserDailyLimit { userId: string; limit: number; usedToday: number; }
interface OrgTokenLimits {
  globalLimit: number;
  globalUsed: number;
  totalRequests: number;
  resetCycle: 'monthly' | 'custom';
  userDailyLimitsEnabled: boolean;
  defaultUserDailyLimit: number;
}
```

### Behavior (frontend-only, mock state)

- All inputs use local `useState` seeded from mock data; `Save` buttons show a `toast.success`.
- Usage bars use the existing `Progress` component; turn amber at >75%, red at >90%.
- Disabled model rows are dimmed and excluded from the team access matrix columns.
- Team access matrix changes are auto-saved with toast (no explicit Save).
- User Daily Limits section: when toggle is OFF, default-limit input + override button are disabled/greyed.
- `UserDailyLimitsDialog` uses `ResponsiveDialog`, lists users from existing mock users with search, inline number input + "Reset to default" button per row.

### Mock data source

`src/data/tokenLimitsData.ts` exports:
- `mockModels: ModelLimit[]` — 4 text + 2 image
- `mockOrgLimits: OrgTokenLimits`
- `mockTeamAccess: TeamModelAccess[]` — keyed against existing team ids 1–3
- `mockUserDailyLimits: UserDailyLimit[]`

### Out of scope (note for user)

Actual enforcement (counting tokens on requests, blocking when over limit) requires backend. This plan delivers the full admin UI + mock state so the frontend is ready; the user can ask for the Lovable Cloud + edge-function enforcement layer as a follow-up.

### Memory update

Add `mem://features/token-limits-admin` summarizing: tab location, 4 sections (Org / Models / Team Access matrix / Optional User Daily Limits), admin-only, mock-data UI awaiting backend enforcement.
