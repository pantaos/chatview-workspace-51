

## Tenant Spending & Budget — Super Admin control

Per-tenant plan budget and overage cap are **set only by the super admin** in the PANTA Flows tenant detail dialog. The org admin (Token Limits tab) sees their spending and budget **read-only**.

### 1. Data model

**`src/types/pantaFlows.ts`** — extend `Tenant`:
```ts
planName: string;            // "Pro"
planBudgetEur: number;       // included AI budget
overageEnabled: boolean;
overageCapEur: number;       // extra allowed beyond plan
```

**`src/data/pantaFlowsData.ts`** — seed each mock tenant with these fields (e.g. Pro €50 + €100 overage).

### 2. Super Admin UI — `src/components/panta-flows/PFTenantDetailDialog.tsx`

Add a new tab **"Billing"** (Wallet icon) between **Analytics** and **Theme**.

```text
┌─ Billing ──────────────────────────────────────┐
│  Spent this cycle    Plan budget    Overage cap │
│  €34.20              €50.00         €100.00     │
│  [████████░░] 23% of €150 total allowed         │
│                                                 │
│  Status: Within plan budget · €15.80 remaining  │
│                                                 │
│  ── Plan ───────────────────────────────────    │
│  Plan name           [ Pro            ]         │
│  Included budget (€) [ 50             ]  [Save] │
│                                                 │
│  ── Overage ────────────────────────────────    │
│  Allow spend beyond plan budget   [Switch]      │
│  Max additional spend (€)   [ 100  ]    [Save]  │
│  Hard stop at €150.00 total.                    │
└─────────────────────────────────────────────────┘
```

- Spent computed via `(tenant.tokensUsed / 1000) * EUR_PER_1K_TOKENS` (reuse `src/data/billingData.ts`).
- Local `useState` seeded from tenant; Save → `toast.success`.
- Same status/color logic (ok / amber / red) as existing AdminTokenLimits.

### 3. Org Admin UI — `src/components/admin/AdminTokenLimits.tsx`

Convert the existing **Spending & Budget** card to **read-only**:
- Keep the three stat tiles, progress bar, and status line.
- **Remove** the Switch, the overage `Input`, and the Save button.
- Replace with a small note: *"Plan budget and overage cap are managed by your platform administrator."*
- Source values from `mockBilling` (unchanged) — later this would come from the tenant record.

### Files

| File | Change |
|------|--------|
| `src/types/pantaFlows.ts` | Add billing fields to `Tenant` |
| `src/data/pantaFlowsData.ts` | Seed billing fields on each mock tenant |
| `src/components/panta-flows/PFTenantDetailDialog.tsx` | New "Billing" tab with stats + editable plan budget + overage controls |
| `src/components/admin/AdminTokenLimits.tsx` | Make Spending & Budget read-only; remove overage edit controls |

### Out of scope
Real € metering and enforcement (needs backend). This delivers UI + mock state with the correct ownership: super-admin edits, org-admin views.

