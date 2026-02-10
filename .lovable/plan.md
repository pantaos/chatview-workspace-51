

# Tenant-Based Workflow Configuration

## Overview

Restructure the workflow management approach: keep "Assistenten & Workflows" as a simple resource pool (assistants and workflows with tenant assignment badges), and add a new **"Konfiguration"** tab to PANTA Flows where workflow configuration is organized by tenant.

## UX Flow

1. **"Assistenten & Workflows" tab** -- reverts to showing assistants and workflows as simple list cards (like the original), each showing which tenants they're assigned to. Clicking opens the detail dialog for tenant assignment only (no workflow step editing here).

2. **New "Konfiguration" tab** -- shows tenant cards in a grid. Clicking a tenant expands/opens a view showing the workflows assigned to that tenant as the square icon grid. Clicking a workflow icon opens the existing `WorkflowConfigDialog` for step-level configuration.

## Changes

### 1. Revert PFAssistantsWorkflows to resource pool only

**`src/components/panta-flows/PFAssistantsWorkflows.tsx`**
- Remove the workflow icon grid, `WorkflowConfigDialog` import, and all workflow config state (`selectedWorkflow`, `workflowDialogOpen`, etc.)
- Show workflows as simple card items (same style as assistants) filtered from `mockAssistantsWorkflows` where `type === "workflow"`
- Each workflow card shows name, description, and tenant assignment badges
- Clicking a workflow opens `PFAssistantDetailDialog` (which already handles both types with General + Tenants tabs)

### 2. Create new PFKonfiguration component

**`src/components/panta-flows/PFKonfiguration.tsx`** (new file)
- Lists all tenants as clickable cards (reusing the same card style from PFTenants)
- Clicking a tenant shows the workflows assigned to that tenant in the square icon grid
- Unassigned workflows appear in a separate "Nicht zugeordnet" section at the bottom
- Clicking a workflow icon opens `WorkflowConfigDialog` for full step-level editing
- Back button to return to tenant list view

### 3. Add tab to PantaFlows page

**`src/pages/PantaFlows.tsx`**
- Add a new tab entry: `{ id: "config", label: "Konfiguration", shortLabel: "Konfig." }`
- Add `TabsContent` rendering `PFKonfiguration`
- Import the new component

### 4. Clean up WorkflowConfigDialog

**`src/components/admin/WorkflowConfigDialog.tsx`**
- Keep the Tenants tab since it's useful for managing assignments from within the config dialog too
- No other changes needed

## Technical Details

- The tenant-to-workflow mapping uses `mockAssistantsWorkflows` entries with `type === "workflow"` and their `assignments` array to determine which workflows belong to which tenant
- The workflow icon grid rendering reuses `mockWorkflows` from `workflowAdmin.ts` for the actual config data (icon, steps, etc.)
- A lookup maps `mockAssistantsWorkflows` workflow names to `mockWorkflows` entries for opening the config dialog
- The new component manages two states: tenant list view and single-tenant detail view with workflow grid

