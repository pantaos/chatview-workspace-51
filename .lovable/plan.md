

## Community App Store — Upload, AI Review, Publish

A new flow for users to upload vibe-coded apps (Lovable, Claude Code, etc.), run them through a simulated AI review that auto-styles them to match the platform, and submit them for Super Admin approval before they appear in the Template Library as **Community Apps**.

### User journey

```text
[Sidebar: Build an App]
        ↓
/app-builder (upload page)
   1. Drop .zip          → file accepted, name detected
   2. App details         → title, description, tags, icon
   3. AI Review (mocked)  → 4 animated stages
        a. Functionality check
        b. Frontend ↔ Backend wiring
        c. Style standardization (sidebar + tabs + theme colors)
        d. Live preview mock
   4. Preview & Submit    → before/after styling card,
                            "Submit for Approval" CTA
        ↓
[Status: Pending Review]
        ↓
Super Admin → PANTA Flows → Template Store → "Pending Apps" section
   Approve  → app appears in Template Library under "Community Apps"
   Reject   → user sees reason in their "My Apps" list
```

### New surfaces

**1. `/app-builder` — Upload + Review wizard**  
4-step wizard (matches `AssistantCreatorWizard` style: full-screen Dialog, Progress bar, ChevronLeft/Right nav).
- Step 1 — **Upload**: dropzone for `.zip` (≤20 MB), shows filename + size, "Detected: React + Vite" mock badge
- Step 2 — **Details**: title, one-line description, tag pills (reuse `templateTags`), icon picker (Lucide grid)
- Step 3 — **AI Review**: 4 sequential checks with `Loader2` → `Check`. Each ~1.2 s mock delay, ends with a green summary card. Uses tenant theme color for progress accents.
- Step 4 — **Preview & Submit**: side-by-side "Original look" vs "Standardized to platform" mock cards; submit button creates a `CommunityApp` entry with `status: "pending"`.

**2. `/my-apps` — User's submissions**  
Simple list (matches Library row style): app name, status badge (`pending` / `approved` / `rejected`), submitted date, 3-dot menu (View, Resubmit, Delete). Reachable from sidebar and from a banner on `/app-builder` after submit.

**3. PANTA Flows → Template Store → new "Pending Apps" section**  
Adds a collapsible section above the existing template grid showing submissions awaiting review. Each row: app icon, title, submitter, "Review" button → opens a `ResponsiveDialog` with metadata, mock preview screenshot, **Approve** / **Reject (with reason)** buttons. Approved apps drop into the regular template list with `category: 'community-app'` and become editable for visibility (public + tenant overrides — same model as existing templates).

**4. Template Library — "Community Apps" category**  
Adds a category pill alongside existing tag filters. Community apps render with the same `TemplateCard` but get a small "Community" badge (uses `theme.accentColor`). Preview dialog reuses existing `TemplatePreviewDialog`, just adds a "Submitted by {user}" line.

### Data model (mock, in `src/data/communityApps.ts`)

```ts
export interface CommunityApp {
  id: string;
  title: string;
  description: string;
  icon: string;                 // Lucide name
  tags: WorkflowTag[];
  submittedBy: string;          // user name
  submittedAt: string;          // ISO
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  fileName: string;             // original .zip name
  reviewSummary: {              // populated after AI Review step
    framework: string;
    hasBackend: boolean;
    detectedColors: string[];
    standardized: boolean;
  };
  visibility?: TemplateVisibility;  // set by super admin on approval
}
```

State lives in a small Zustand-free module (plain `useState` in pages) seeded from `src/data/communityApps.ts` — consistent with how `templates` and `mockTenants` are handled today. Approved apps are merged into the Template Library list at render time.

### Visual approach

- Upload dropzone: dashed border, `bg-muted/30`, switches to `theme.primaryColor` border on dragover
- AI Review stages: vertical timeline, each row collapses to a Check on completion (pattern from `ConversationalWorkflow`)
- Preview/Standardized cards: white card on `#F8F9FD`, no screenshots — mock chrome (sidebar silhouette + tab row) drawn with divs using theme colors
- Mobile: full-screen wizard, sticky bottom button bar, 44 px touch targets — matches existing dialog patterns
- All accent colors derive from `useTheme()` — no new palette

### Files

| File | Change |
|---|---|
| `src/data/communityApps.ts` | New — interface + 3 seed apps (1 pending, 1 approved, 1 rejected) |
| `src/pages/AppBuilder.tsx` | New — 4-step wizard page |
| `src/pages/MyApps.tsx` | New — user's submissions list |
| `src/components/app-builder/UploadStep.tsx` | New — dropzone |
| `src/components/app-builder/DetailsStep.tsx` | New — title/desc/tags/icon |
| `src/components/app-builder/ReviewStep.tsx` | New — 4-stage mock review |
| `src/components/app-builder/PreviewStep.tsx` | New — before/after + submit |
| `src/components/panta-flows/PFTemplateStore.tsx` | Add "Pending Apps" section + Approve/Reject dialog |
| `src/pages/TemplateLibrary.tsx` | Add "Community Apps" category pill, merge approved apps |
| `src/components/TemplateCard.tsx` | Add optional "Community" badge |
| `src/App.tsx` | Add `/app-builder` and `/my-apps` routes |
| `src/components/AppSidebar.tsx` | Add "Build an App" + "My Apps" entries |

### Out of scope
Real zip parsing, real static analysis, real code transformation, sandboxed execution. The review and standardization are mocked — the architecture leaves clean seams to swap in a real backend pipeline (edge function + storage bucket) later.

