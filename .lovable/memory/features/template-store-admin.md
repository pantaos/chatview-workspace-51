---
name: Template store admin
description: Super Admin Template Store tab in PANTA Flows for per-template visibility (public + tenant overrides)
type: feature
---
PANTA Flows has a "Template Store" tab where the Super Admin manages assistant templates and their visibility per tenant.

Visibility model: Each template has `visibility: { scope: 'public' | 'tenants', tenantIds: string[] }`.
- `public` → all tenants see it; `tenantIds` are additionally force-assigned/highlighted.
- `tenants` → only listed tenants see it.

UI: grid of template cards with a Globe/Users badge showing current scope. Click → ResponsiveDialog with radio (Public / Specific tenants) + checkbox list of tenants. Save persists to local state via `toast.success`.

Type lives at `src/data/templates.ts` as `TemplateVisibility`. Component: `src/components/panta-flows/PFTemplateStore.tsx`.

The end-user `/template-library` only shows assistants (workflows/apps removed) and uses a sleeker single-grid layout with featured rail + tag pills. Preview dialog no longer shows screenshots — only header, capabilities, personalization fields, and integrations.
