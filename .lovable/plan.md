
# Implementation Plan: Actions Page, Standardized Headers, and Unified Inbox/Messages

## Overview

This plan addresses three interconnected improvements:
1. Create a new "Aktionen" (Actions) page under Inbox
2. Standardize the Library page header to match Community Feed and Admin patterns
3. Merge Inbox and Messages into a unified notification center with popup + dedicated page

---

## 1. New "Aktionen" Page

### What We Will Build

Based on the screenshot, we will create a dedicated Actions page that displays workflow-related actions like approvals, handoffs, and other tasks requiring user attention.

**Page Structure:**
- **Header**: Standardized pattern with headline "Aktionen" and subline "Genehmigungen, Ubergaben und andere Workflow-Aktionen prufen und beantworten"
- **Tabs**: "Ausstehend" (Pending) and "Abgeschlossen" (Completed) with a refresh button
- **Empty State**: Checkmark icon with "Keine ausstehenden Aktionen" message
- **Detail Panel**: Right-side panel showing "Aufgabe auswahlen, um Details anzuzeigen" when no action is selected

### Files to Create
- `src/pages/Actions.tsx` - Main actions page component

### Files to Modify
- `src/App.tsx` - Add route for `/actions`
- `src/components/AppSidebar.tsx` - Add "Aufgaben" (or "Aktionen") as a collapsible item under Inbox

---

## 2. Standardized Library Header

### Current State
The Library page already has a header but will be verified to match the standardized pattern:
```text
Library (3xl bold)
All your content in one place (muted-foreground)
```

This matches the pattern used in:
- Community Feed: "Community Feed" + "Stay updated with..."
- Admin Panel: "Admin Panel" + "Manage users, teams..."

### Files to Verify/Update
- `src/pages/Library.tsx` - Ensure header matches the standard pattern (already looks correct)

---

## 3. Unified Inbox + Messages System

### Current State
- Inbox opens as a popup panel from the sidebar (notifications/comments)
- There is no separate "Messages" route currently visible

### Proposed Solution

We will enhance the existing Inbox popup to include:
1. **Tabs within the popup**: "Nachrichten" (Messages) and "Aufgaben" (Actions)
2. **Quick action links**: "Alle anzeigen" (View All) that navigates to dedicated pages
3. **Badge indicators**: Unread count for messages, pending count for actions

**Popup Enhancement:**
```text
+---------------------------+
| Inbox                  X  |
+---------------------------+
| [Nachrichten] [Aufgaben]  |
+---------------------------+
| Today                     |
| - Notification item 1     |
| - Notification item 2     |
+---------------------------+
| Alle anzeigen -->         |
+---------------------------+
```

### Sidebar Simplification
- Keep single "Inbox" item in sidebar (removes need for separate Messages)
- Inbox popup serves as the quick-access hub
- Dedicated pages (/actions) for detailed views

### Files to Modify
- `src/components/AppSidebar.tsx` - Enhance InboxContent with tabs and "Alle anzeigen" link
- `src/pages/Actions.tsx` - Create the full-page Actions view

---

## Technical Details

### New Actions Page Structure

```text
src/pages/Actions.tsx
├── MainLayout wrapper
├── Header section (standardized)
│   ├── h1: "Aktionen" (text-3xl font-bold)
│   └── p: subtitle (text-muted-foreground)
├── Tabs component
│   ├── TabsList: "Ausstehend", "Abgeschlossen" + Refresh button
│   ├── TabsContent "Ausstehend"
│   │   └── Split layout (list | detail panel)
│   └── TabsContent "Abgeschlossen"
│       └── Completed actions list
└── Empty states with appropriate icons
```

### Sidebar Inbox Enhancement

The existing InboxContent component will be updated to:
1. Add internal tabs for Messages and Actions
2. Add a "View All" link at the bottom that navigates to `/actions`
3. Show pending action count in the Actions tab

### Route Structure

| Route | Page | Purpose |
|-------|------|---------|
| `/actions` | Actions.tsx | Full actions management page |
| `/library` | Library.tsx | Content library (header standardized) |

---

## Visual Consistency

All pages will follow this header pattern:

```text
┌─────────────────────────────────────┐
│ Page Title          (text-3xl bold) │
│ Description text    (muted, mt-1/2) │
└─────────────────────────────────────┘
```

This matches the existing patterns in:
- Community Feed (line 348-350)
- Admin Panel (line 108-110)
- Library (line 208-212) - already correct

---

## Implementation Order

1. Create `src/pages/Actions.tsx` with the new Actions page
2. Add the `/actions` route to `src/App.tsx`
3. Update `src/components/AppSidebar.tsx`:
   - Add "Aufgaben" item that links to `/actions` 
   - Enhance InboxContent with tabs and navigation
4. Verify Library header is standardized (already appears correct)

---

## Summary of Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/Actions.tsx` | Create | New Actions page with pending/completed tabs |
| `src/App.tsx` | Modify | Add `/actions` route |
| `src/components/AppSidebar.tsx` | Modify | Add Aufgaben nav item, enhance Inbox popup with tabs |
| `src/pages/Library.tsx` | Verify | Confirm header matches standard (no changes expected) |
