
# Plan: Smart Admin Workflow Customization Tab

## Overview

A new **"Workflows"** tab in the Admin Panel for configuring workflow steps, customization parameters, and adding approval/handover gates. Different clients can use the same workflow logic but with more or fewer approval steps.

---

## Architecture

### Tab Location
Position the new "Workflows" tab between "Teams" and "Community Feed" in Admin Panel.

### Components
1. **Workflow Grid** - Square cards (4-per-row) matching Integrations pattern
2. **Workflow Configuration Dialog** - Multi-tab dialog using ResponsiveDialog (like AdminIntegrationDialog)

---

## 1. Workflow Grid

Same design pattern as Integrations - square cards with:
- Workflow icon
- Workflow name  
- Step count + Approval count badges
- Click opens configuration dialog

```text
+------------------+------------------+------------------+------------------+
|   TrendCast      |   HDI Content    |   ASB Avatar     |   BitProject     |
|   [icon]         |   [icon]         |   [icon]         |   [icon]         |
|   8 Steps        |   10 Steps       |   14 Steps       |   5 Steps        |
|   2 Approvals    |   3 Approvals    |   6 Approvals    |   0 Approvals    |
+------------------+------------------+------------------+------------------+
```

---

## 2. Workflow Configuration Dialog

Using the same pattern as AdminIntegrationDialog with:
- Tab navigation per step (Overview, Step1, Step2, ...)
- Sub-screens for user/team pickers
- Clean key-value layout

### Tab Structure

| Tab | Content |
|-----|---------|
| **Overview** | Workflow metadata, welcome message, global settings |
| **Step 1** ... **Step N** | Per-step configuration based on step type |

---

## 3. Per-Step Configuration (Based on Document Analysis)

### Every Step Gets Collaboration Options

At the bottom of EVERY step configuration, add a collapsible section:

**"+ Add Approval/Handover"**

When enabled, shows:
- Type: Approval / Handover (radio)
- Assignee Type: User / Team / Role (radio)
- Select button → opens picker sub-screen
- Timeout Hours (number input)
- Require Comments (toggle)
- Allow Reassignment (toggle)
- Escalation settings (collapsible)

This allows clients to add approval gates to any step in a workflow.

---

### Step Type: Form

Configuration options (from document):
| Setting | Control |
|---------|---------|
| Title | Text input |
| Description | Textarea |
| Submit Button Text | Text input |
| Fields | Field list (read-only, shows field labels) |

**Image Cropping (if file fields present):**
| Setting | Control |
|---------|---------|
| Enable Cropping | Toggle |
| Width | Number input |
| Height | Number input |
| Aspect Ratio | Calculated display |

---

### Step Type: Processing

Configuration based on processor type (from document analysis):

| Processor | Configurable Parameters | Controls |
|-----------|------------------------|----------|
| scrape_and_generate_script | target_duration (30-300s), max_script_length | Slider, Number |
| text_to_speech | voice_id, stability, similarity_boost | Voice picker, Sliders |
| extract_text_and_generate_script | min_script_length, max_script_length | Range slider |
| content_to_video_generate_scenes | min_scenes, max_scenes | Range slider |
| generate_titles_and_bullets | max_bullets | Number input |
| generate_background_images | template_path, title_color, max_bullets | Dropdown, Color picker |
| generate_mcq_from_script | num_questions (1-20) | Number input |
| json_to_video | use_captions, use_subtitles, caption_mode | Toggles, Dropdown |
| ftp_distribution | ftp_server, upload_xml, upload_videos | Config panel |

**Polling Configuration (for long-running):**
| Setting | Control | Range |
|---------|---------|-------|
| Interval Seconds | Slider | 1-60 |
| Timeout Seconds | Number | 60-7200 |
| Max Retries | Number | 1-500 |

---

### Step Type: Approval

Configuration options:
| Setting | Control |
|---------|---------|
| Title | Text input |
| Description | Textarea |
| On Approve → | Step dropdown |
| On Reject → | Step dropdown |
| Auto Approve | Toggle |
| Approval Message | Text input |
| Rejection Message | Text input |
| Group By Field | Field dropdown |

**Collaboration Settings (built-in for approval steps):**
| Setting | Control |
|---------|---------|
| Enable Multi-User | Toggle |
| Assignee Type | Radio: User / Team / Role |
| Select Assignees | Button → picker sub-screen |
| Timeout Hours | Number input |
| Require Comments | Toggle |
| Allow Reassignment | Toggle |
| Escalation | Collapsible config panel |

---

### Step Type: Branch

| Setting | Control |
|---------|---------|
| Title | Text input |
| Description | Textarea |
| Branch Field | Field picker |
| Route Mapping | Value → Step mapping list |

---

### Step Type: Output

| Setting | Control |
|---------|---------|
| Output Type | Dropdown: text / completion / download |
| Template | HTML editor with variable picker |

---

## 4. UI Layout Per Step

Clean, minimal layout following existing patterns:

```text
+---------------------------------------------------+
| STEP CONFIGURATION                                |
+---------------------------------------------------+
| Step Title:  [_________________________]          |
| Description: [___________________________         |
|              ___________________________]         |
+---------------------------------------------------+
| PROCESSOR SETTINGS (for processing steps)         |
|                                                   |
| Script Length                                     |
| Min: [____]  Max: [____]                         |
|                                                   |
| Auto Execute: [toggle]                           |
+---------------------------------------------------+
| + ADD APPROVAL/HANDOVER                    [▼]   |
|                                                   |
| (when expanded)                                   |
| ○ Approval  ○ Handover                           |
|                                                   |
| Assign to:                                        |
| ○ User  ○ Team  ○ Role                          |
| [Select Assignees →]                             |
|                                                   |
| Timeout: [48] hours                              |
| □ Require Comments                               |
| □ Allow Reassignment                             |
|                                                   |
| + Escalation Settings                      [▼]   |
+---------------------------------------------------+
```

---

## 5. Files to Create

| File | Purpose |
|------|---------|
| `src/components/admin/AdminWorkflowsTab.tsx` | Main workflow grid component |
| `src/components/admin/WorkflowConfigDialog.tsx` | Configuration dialog with step tabs |
| `src/types/workflowAdmin.ts` | TypeScript interfaces |

## 6. Files to Modify

| File | Change |
|------|--------|
| `src/pages/AdminSettings.tsx` | Add "Workflows" tab |

---

## 7. Mock Data (Based on Document)

Sample workflows with their actual customizable parameters:

| Workflow | Steps | Key Customizations |
|----------|-------|-------------------|
| TrendCast Versa | 8 | target_duration, voice_id, caption_mode |
| HDI Content-to-Video | 10 | script_length range, scene count, image cropping |
| ASB AI Avatar | 14 | script_length, scene count, max_bullets, num_questions |
| BitProject FTP | 5 | category options, FTP config, schema_type |
| BitProject Newsletter | 6 | RSS sources, email template |

---

## Technical Details

### TypeScript Interfaces

```typescript
interface WorkflowAdminConfig {
  id: string;
  name: string;
  description: string;
  welcomeMessage: string;
  steps: WorkflowStepAdmin[];
  settings: WorkflowSettings;
}

interface WorkflowStepAdmin {
  id: string;
  title: string;
  type: 'form' | 'processing' | 'approval' | 'branch' | 'output';
  processorType?: string;
  config: StepConfig;
  collaboration?: CollaborationConfig; // Can be added to ANY step
}

interface CollaborationConfig {
  enabled: boolean;
  type: 'approval' | 'handoff';
  assigneeType: 'user' | 'team' | 'role';
  assigneeIds: string[];
  timeoutHours: number;
  requireComments: boolean;
  allowReassignment: boolean;
  escalation?: EscalationConfig;
}

interface EscalationConfig {
  enabled: boolean;
  afterHours: number;
  toType: 'user' | 'team' | 'role';
  toIds: string[];
  notifyOriginal: boolean;
}
```

---

## Summary

1. **New "Workflows" tab** in Admin with square card grid
2. **Per-step configuration** with actual customizable parameters from the document
3. **Every step can have approval/handover added** - enabling different clients to add more approval gates to the same workflow
4. **Dialog follows AdminIntegrationDialog pattern** - tabs for each step, sub-screens for pickers
5. **Clean, minimal UI** - no heavy cards, simple key-value layouts with toggles and inputs
