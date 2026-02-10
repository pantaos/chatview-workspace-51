

# Move Workflow Configuration to PANTA Flows

## Overview

Move the workflow customization feature from the Admin Panel into the PANTA Flows "Assistenten & Workflows" tab. The key idea: merge the resource pool (assistants + workflows) with the workflow configuration, so you can manage tenant assignments AND configure workflow internals from one place.

## UX Concept

The "Assistenten & Workflows" tab will show two sections:

1. **Assistenten** -- listed as cards (like today), clicking opens the existing detail dialog with General + Tenants tabs
2. **Workflows** -- displayed as the square icon grid (migrated from Admin), clicking opens the WorkflowConfigDialog but enhanced with a new **"Tenants"** tab for per-tenant assignment and per-tenant configuration overrides

This gives a clear visual distinction between assistants (list cards) and workflows (icon grid), while keeping everything in one place. The workflow detail dialog gets a "Tenants" tab where you can assign tenants and set visibility -- just like the assistant dialog already does.

## Changes

### 1. Remove Workflows tab from Admin Panel
- **`src/pages/AdminSettings.tsx`**: Remove the "workflows" tab entry and its `TabsContent`. Remove the `AdminWorkflowsTab` import.

### 2. Enhance PFAssistantsWorkflows component
- **`src/components/panta-flows/PFAssistantsWorkflows.tsx`**: Split into two sections:
  - **Assistenten section**: Keep the current card-based list, filtered to `type === "assistant"`
  - **Workflows section**: Add the square icon grid from `AdminWorkflowsTab`, using `mockWorkflows` from `workflowAdmin.ts`. Clicking a workflow opens the `WorkflowConfigDialog`.
  - Import and integrate `WorkflowConfigDialog` and `WorkflowAdminConfig` types.

### 3. Add Tenants tab to WorkflowConfigDialog
- **`src/components/admin/WorkflowConfigDialog.tsx`**: Add a "Tenants" sidebar entry (after Overview, before steps). The Tenants screen shows:
  - Currently assigned tenants with colored avatar, name, visibility badge, and remove button
  - "Add tenant" section with tenant selector and visibility radio (same pattern as `PFAssistantDetailDialog`)
  - This reuses `mockTenants` from `pantaFlowsData` and `TenantAssignment` type

### 4. Link workflow assignments to AssistantWorkflow data
- **`src/types/pantaFlows.ts`**: No changes needed -- `AssistantWorkflow` already supports `type: 'workflow'` with assignments
- **`src/data/pantaFlowsData.ts`**: Optionally link `mockAssistantsWorkflows` workflow entries to `mockWorkflows` via a `configId` field, or keep them as separate data sets that coexist in the UI

## Technical Details

- The `WorkflowConfigDialog` stays in `src/components/admin/` (or could be moved to a shared location) since it's a standalone dialog component
- The icon grid rendering logic from `AdminWorkflowsTab` will be extracted into `PFAssistantsWorkflows` directly
- The "Add Workflow" dashed button in the grid remains as a placeholder
- `AdminWorkflowsTab.tsx` can be deleted or kept as unused -- deleting is cleaner
- The assistant detail dialog (`PFAssistantDetailDialog`) remains unchanged since it already handles tenant assignments well

## Result

One unified hub under PANTA Flows where platform admins can:
- See all assistants (cards) and workflows (icon grid) at a glance
- Configure workflow steps, prompts, and approval gates (existing WorkflowConfigDialog)
- Assign workflows and assistants to tenants with visibility control
- No more switching between Admin Panel and PANTA Flows for workflow management

