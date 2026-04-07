

# Skills-in-Chat Architecture + Strategic Platform Improvements

## Context

Based on the meeting summary, PANTA OS has two strategic goals:
1. **Personal productivity** — help one person do the work of many
2. **End-to-end process rethinking** — conversational workflows with approvals/handoffs

The Use Case Marketplace should be retired in favor of **Skills** that live inside the chat. This plan covers where Skills are managed, how they surface, and strategic improvements aligned with both goals.

---

## Part 1: Skills Management in Settings

Add a new **"Skills"** tab to the Settings page (`src/pages/Settings.tsx`), sitting alongside General, Profile, and Integrations.

**Tab structure:**
```text
Settings
├── General
├── Profile
├── Skills  ← NEW
│   ├── My Skills (personal, user-created)
│   └── Team Skills (shared by team/org, read-only unless admin)
└── Integrations
```

**My Skills section:**
- List of user-created skill cards (name, description, trigger phrases, last used)
- "Create Skill" button opening a dialog with: name, description, system prompt/instruction, trigger keywords, required integrations, schedule (optional)
- Edit/delete/duplicate actions per skill
- Toggle to enable/disable individual skills

**Team Skills section:**
- Read-only list of skills shared by the team or organization
- Shows who created it, which team it belongs to, usage count
- Users can "pin" team skills to prioritize them in their chat
- Admins see an "Edit" option; regular users see "View Details"

---

## Part 2: Skills in Admin Panel (Team Management)

In the Admin Panel (`src/pages/AdminSettings.tsx`), add a **"Skills"** tab alongside the existing tabs (Analytics, Users, Teams, Approvals, Community, Integrations).

**Admin Skills tab:**
- Grid of all organization-wide skills with status badges (active/draft/disabled)
- Create/edit skills with: name, instruction prompt, trigger phrases, required integrations, assigned teams, schedule defaults
- Assignment matrix: which teams/users have access to which skills
- Usage analytics per skill (how often triggered, by whom)

Also enhance the **Teams tab** (`AdminTeams.tsx`): when clicking into a team's management dialog, add a "Skills" section showing skills assigned to that team, with ability to assign/remove skills.

---

## Part 3: Strategic Platform Improvements

### Goal 1: Personal Productivity (10x output)

**A. Skill-aware Chat (core change to `ChatInterface.tsx`)**
- When user types a message, the chat checks against available skill trigger phrases
- If a match is found, the chat shows a subtle "Using skill: Weekly Summary" badge and executes the structured instruction
- Missing parameters are collected inline via `InlineChatForm` — no screen navigation
- Results appear directly in the chat thread (text, tables, download links)

**B. Quick Actions in Search Bar**
- The main SearchChat on the dashboard gets skill-aware autocomplete
- Typing "/" shows available skills as suggestions (like Slack commands)
- Selecting one pre-fills the chat with the skill context

**C. Scheduled Skills → Actions/Inbox**
- Skills can be scheduled (daily, weekly) from Settings
- When triggered, a notification appears in the Actions/Inbox
- Clicking the notification opens the chat with the skill pre-loaded, ready for human-in-the-loop input
- This replaces the marketplace's "Schedule" button with a settings-driven approach

### Goal 2: End-to-End Process Rethinking

**D. Skills as Workflow Steps**
- In the workflow editor / Approvals & Handovers configuration, allow inserting a "Skill step" into any workflow
- This means a conversational workflow can call a skill mid-flow (e.g., "generate summary" skill runs between data collection and approval)
- Connects the personal productivity layer with the enterprise process layer

**E. Contextual Chat Surface**
- When a user enters a conversational workflow, the chat adapts — showing workflow-specific skills alongside general ones
- The screen doesn't change; the chat thread becomes the unified surface for both ad-hoc tasks and structured processes

---

## Files to Create/Modify

| File | Change |
|------|--------|
| `src/types/skills.ts` | New — Skill, SkillCategory, SkillSchedule types |
| `src/data/skillsData.ts` | New — Mock skills data (personal + team) |
| `src/components/settings/SkillsTab.tsx` | New — My Skills + Team Skills UI |
| `src/components/settings/SkillEditor.tsx` | New — Create/edit skill dialog |
| `src/components/settings/SkillCard.tsx` | New — Individual skill display card |
| `src/components/admin/AdminSkills.tsx` | New — Admin skills management tab |
| `src/pages/Settings.tsx` | Add "Skills" tab |
| `src/pages/AdminSettings.tsx` | Add "Skills" tab |
| `src/components/admin/TeamManagementDialog.tsx` | Add skills section to team detail |
| `src/components/ChatInterface.tsx` | Add skill detection + inline execution |
| `src/components/SearchChat.tsx` | Add "/" command autocomplete for skills |
| `src/pages/Actions.tsx` | Connect scheduled skill notifications |

---

## Implementation Order

1. Types and mock data (`skills.ts`, `skillsData.ts`)
2. Settings Skills tab (My Skills + Team Skills with CRUD)
3. Admin Skills tab + team assignment
4. Chat skill detection and inline execution
5. "/" command autocomplete in SearchChat
6. Scheduled skills → Actions/Inbox integration

