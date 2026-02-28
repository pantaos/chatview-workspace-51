

## Plan: Dashboard Calendar Preview + User Theme Customization

### 1. Add Calendar Preview to Dashboard

Create a `CalendarPreview` component (`src/components/CalendarPreview.tsx`) that renders below the search/chat area in the hero section of the dashboard (`src/pages/Index.tsx`).

- Shows today's date header (e.g. "Freitag, 28. Februar")
- Renders a compact timeline of mock calendar events, styled like the uploaded screenshot reference (left time labels, colored left border, event name + location/link)
- Each event shows: name, time range, location (either "Online" with a clickable meeting link icon, or a physical location)
- Small "Kalender verbinden" hint when no calendar is connected (mock a connected state by default)
- Compact, fits naturally below the SearchChat inside the gradient hero area with a semi-transparent card style (bg-white/10 backdrop-blur)

### 2. Extend ThemeConfig for User Customization

Update `ThemeConfig` in `src/contexts/ThemeContext.tsx` to add:
- `backgroundImage?: string` — optional user-uploaded background image URL (stored as data URL in localStorage)

The tenant sets defaults via PantaFlows admin. The user overrides via Settings.

### 3. Add "Appearance" Section to Settings General Tab

In `src/pages/Settings.tsx`, add a new section under the General tab:

- **Primary Color** picker — lets user override `primaryColor`
- **Accent Color** picker — lets user override `accentColor`  
- **Background Image** — file upload input that reads the image as a data URL and stores it in theme via `updateTheme({ backgroundImage })`
- **Reset to Default** button to clear user overrides back to tenant defaults

### 4. Apply Background Image on Dashboard

In `src/pages/Index.tsx`, if `theme.backgroundImage` is set, use it as the hero section background instead of the gradient. Apply an overlay for text readability.

### Files Changed
- **Create**: `src/components/CalendarPreview.tsx`
- **Edit**: `src/contexts/ThemeContext.tsx` (add `backgroundImage` field)
- **Edit**: `src/pages/Index.tsx` (add CalendarPreview, apply backgroundImage)
- **Edit**: `src/pages/Settings.tsx` (add appearance customization section)
- **Edit**: `src/lib/theme-utils.ts` (no change needed, CSS vars already applied)

