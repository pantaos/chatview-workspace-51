
## Add Spend & Budget Overview to Token Limits

A new top section on the **Token Limits** admin tab that translates raw token usage into euros, shows the plan's included AI budget, and lets admins set an optional overage cap.

### Where it lives

Top of `src/components/admin/AdminTokenLimits.tsx`, above the existing **Organization** card. New section header: **Spending & Budget**.

### Layout

```text
┌─ Spending & Budget ────────────────────────────────────────┐
│  Spent this cycle        Plan budget         Overage cap    │
│  €34.20                  €50.00              €100.00        │
│  of €50.00 included      Pro plan            extra allowed  │
│  [████████░░░░] 68%                                         │
│                                                             │
│  Status: Within plan budget · €15.80 remaining              │
│                                                             │
│  ── Overage settings ──────────────────────────────────     │
│  Allow spending beyond plan budget   [ Switch ]             │
│  Max additional spend (€):  [ 100 ]              [ Save ]   │
│  Hard stop at €150.00 total. Requests rejected after.       │
└─────────────────────────────────────────────────────────────┘
```

Three small stat tiles on top (Spent / Plan budget / Overage cap), one progress bar underneath spanning the row, then an **Overage settings** subsection with a switch, a number input, and a Save button.

Progress bar colors reuse the existing `usageColor` helper (amber >75%, red >90% of *total allowed* = plan + overage).

### New file

**`src/data/billingData.ts`** — mock billing/pricing data:
```ts
export const EUR_PER_1K_TOKENS = 0.005; // single flat rate for mock
export const mockBilling = {
  planName: "Pro",
  planBudgetEur: 50,
  overageEnabled: true,
  overageCapEur: 100,
  cycleStart: "2026-04-01",
  cycleEnd: "2026-04-30",
};
```

### Type additions in `src/types/admin.ts`

```ts
export interface OrgBilling {
  planName: string;
  planBudgetEur: number;
  overageEnabled: boolean;
  overageCapEur: number;
  cycleStart: string;
  cycleEnd: string;
}
```

### Logic in `AdminTokenLimits.tsx`

- `spentEur = (org.globalUsed / 1000) * EUR_PER_1K_TOKENS`
- `totalAllowedEur = planBudgetEur + (overageEnabled ? overageCapEur : 0)`
- `pct = spentEur / totalAllowedEur * 100`
- Status line:
  - `< planBudget` → "Within plan budget · €X remaining"
  - `>= planBudget && overage on` → "Using overage budget · €X of €Y overage used" (amber)
  - `>= totalAllowed` → "Hard limit reached — requests blocked" (red)
- All values editable in local `useState`; `Save` button shows `toast.success("Overage settings saved")`.
- Overage input + Save are disabled (greyed) when the switch is off.

### Files

| File | Change |
|------|--------|
| `src/components/admin/AdminTokenLimits.tsx` | Add `Spending & Budget` card at top, billing state, computed values |
| `src/data/billingData.ts` | **New** — mock billing/plan + €/token rate |
| `src/types/admin.ts` | Add `OrgBilling` interface |

### Out of scope (note)

Real € conversion needs per-model pricing + a backend that meters actual provider spend. This delivers the admin UI surface and the override controls; wiring real billing comes when backend enforcement is added.

### Memory update

Update `mem://features/token-limits-admin` to mention the new top **Spending & Budget** section with plan budget display + overage cap override.
