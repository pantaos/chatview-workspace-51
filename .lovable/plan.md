

# Konfiguration: Add Workflows to Tenant + Approvals & Handovers Tab in Admin

## Overview

Three changes:
1. **Konfiguration**: Add ability to assign new workflows to a tenant directly from the tenant detail view
2. **WorkflowConfigDialog**: Hide the "Tenants" sidebar tab when opened from the Konfiguration context (since we're already in a specific tenant)
3. **Remove approval/handover config from WorkflowConfigDialog** and create a new **"Approvals & Handovers"** tab in the Admin Panel with a simplified, tenant-based view for adding gates to workflow steps

## Changes

### 1. Add workflow assignment in PFKonfiguration

**`src/components/panta-flows/PFKonfiguration.tsx`**

When viewing a tenant's workflows, add an "Add Workflow" section below the assigned workflows grid:
- Show a dropdown/select of workflows not yet assigned to this tenant
- "Hinzufuegen" button to assign
- When assigned, the workflow appears in the grid above
- This replaces the current text "Workflows koennen im Tab Assistenten & Workflows zugeordnet werden"

Track assignments in local state so newly added workflows appear in the grid immediately.

### 2. Hide Tenants tab when opened from Konfiguration

**`src/components/admin/WorkflowConfigDialog.tsx`**

- Add an optional prop `hideTenants?: boolean` to `WorkflowConfigDialogProps`
- When `hideTenants` is true, skip rendering the "Tenants" sidebar button and mobile tab
- Also remove the approval/handover collaboration section from step configs entirely (moved to Admin)

**`src/components/panta-flows/PFKonfiguration.tsx`**

- Pass `hideTenants={true}` when opening WorkflowConfigDialog

### 3. Remove Approval/Handover from WorkflowConfigDialog

**`src/components/admin/WorkflowConfigDialog.tsx`**

- Add an optional prop `hideCollaboration?: boolean`
- When true, skip rendering the `renderCollaborationSection(step)` call in `renderStepConfig`
- PFKonfiguration passes `hideCollaboration={true}`

### 4. New "Approvals & Handovers" tab in Admin Panel

**`src/components/admin/AdminApprovals.tsx`** (new file)

A simplified, tenant-based approval management view:
- **Step 1 - Tenant Grid**: Shows tenant cards (same style as PFKonfiguration)
- **Step 2 - Workflow Grid**: Click a tenant to see its assigned workflows as an icon grid
- **Step 3 - Workflow Steps**: Click a workflow to see a simplified step list showing:
  - Step name and type badge (colored dot)
  - Whether the step has an approval/handover gate (badge indicator)
  - NO detailed config (no system prompts, no processing settings, no editable title/description)
  - Only the "Add Approval/Handover" collapsible section per step (reuses the same collaboration config pattern: type, assignee, timeout, escalation)
- Back navigation between views

**`src/pages/AdminSettings.tsx`**

- Add new tab: `{ id: "approvals", label: "Approvals & Handovers", shortLabel: "Approvals", icon: Shield }`
- Import and render `AdminApprovals` component
- Place it between "Teams" and "Community Feed" tabs

## Technical Details

- The `AdminApprovals` component will import `mockWorkflows`, `mockTenants`, `mockAssistantsWorkflows` and reuse the same collaboration config types (`CollaborationConfig`, `EscalationConfig`)
- The collaboration section rendering logic (type radio, assignee picker, timeout, escalation) will be extracted or duplicated from `WorkflowConfigDialog` into `AdminApprovals` -- keeping it self-contained
- The team/user/role picker sub-screens will be replicated in AdminApprovals for assignee selection
- State management: 3-level drill-down (tenants -> workflows -> steps) with back buttons
- The workflow icon grid and tenant cards reuse the same visual patterns already established

