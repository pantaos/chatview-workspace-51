

# Plan: Workflow Config Dialog Polish

## What Changes

### 1. Overview Tab - Workflow Info Section

Add a clear description of what the workflow does at the top of the Overview tab. This includes a short pipeline visualization showing the flow of steps as a compact horizontal chain:

```
Upload Links -> Generate Script -> Approve Script -> TTS -> Scenes -> ...
```

Each step shown as a small pill/badge with its type color, giving admins an instant understanding of the workflow structure.

### 2. Step Locking (Greyed Out Steps)

Add an `editable` flag to each step in the mock data. Steps that are core infrastructure (like form uploads, rendering, output/download) get `editable: false`. In the dialog:

- **Sidebar tabs**: Locked steps show a lock icon and appear slightly dimmed
- **Step content**: When a locked step is selected, all fields are disabled/read-only with a subtle info banner: "This step is part of the core workflow logic and cannot be customized."
- The "Add Approval/Handover" section at the bottom remains always available, even on locked steps (since that's the whole point - clients can add approval gates anywhere)

Steps marked as locked for TrendCast example:
- Upload Links (form) - locked
- Render Video (processing) - locked
- Download (output) - locked

Steps that remain editable:
- Generate Script - editable (has system prompt, target duration, etc.)
- Text to Speech - editable (voice settings)
- Generate Scenes - editable (scene count)
- Approval steps - always editable

### 3. System Prompt Field

Add a `systemPrompt` field to the `StepConfig` interface. For processing steps like `scrape_and_generate_script` and `extract_text_and_generate_script`, show a dedicated "System Prompt" textarea in the step configuration. This is the AI prompt that runs behind the scenes when the user submits content.

Example for TrendCast "Generate Script" step:
```
System Prompt
[large textarea with the prompt that controls how AI generates the script]
```

This appears as the first field in the processor settings section, clearly labeled, with a helper text: "The AI prompt used to generate content in this step."

### 4. Cleaner Design

- **Remove redundant section headers**: Instead of "Processor Settings" as a header, use a subtle divider only
- **Tighter spacing**: Reduce space-y-6 to space-y-4 in step configs
- **Better step type badge**: Move the badge inline with the step title instead of being a separate row
- **Cleaner overview**: Remove the raw metadata list (Total Steps, Approval Gates, Last Modified) and replace with the pipeline visualization + editable fields only
- **Sidebar step labels**: Show step number and short name, with type indicated by a small colored dot instead of text

---

## Technical Details

### Files Modified

| File | Changes |
|------|---------|
| `src/types/workflowAdmin.ts` | Add `editable` field to `WorkflowStepAdmin`, add `systemPrompt` to `StepConfig`, update mock data with locked steps and sample system prompts |
| `src/components/admin/WorkflowConfigDialog.tsx` | Refactor Overview tab with pipeline view, add lock/disabled state for non-editable steps, add system prompt textarea, cleaner layout |

### Data Model Changes

```typescript
interface WorkflowStepAdmin {
  // ... existing fields
  editable?: boolean; // defaults to true, false = greyed out / read-only
}

interface StepConfig {
  // ... existing fields
  systemPrompt?: string; // AI system prompt for processing steps
}
```

### Mock Data Updates

TrendCast steps with `editable` flags:
- `upload`: editable = false (core form, no customization needed)
- `scrape`: editable = true + systemPrompt = "You are a video script writer..."
- `script_approval`: editable = true
- `tts`: editable = true (voice settings)
- `scenes`: editable = true (scene count)
- `scenes_approval`: editable = true
- `render`: editable = false (core processing)
- `output`: editable = false (core output)

Similar patterns for other workflows.

### UI Behavior

- Locked steps in sidebar: dimmed text + small lock icon
- Locked step content: all Input/Switch/Slider/Textarea get `disabled` prop, reduced opacity via `opacity-50` wrapper
- Info banner at top of locked steps: light muted background with "Core step - configuration locked" text
- Approval/Handover section at bottom: always enabled regardless of step lock status (this is the key feature)
- System prompt textarea: taller than regular textareas (rows=6), appears first in processor settings for applicable step types

