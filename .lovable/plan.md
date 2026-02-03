
# Library Page Implementation Plan

## Overview
Create a new "Library" page that displays all generated content from workflows and chats. The page will showcase videos, images, files (PDFs, Word docs), and links in a modern, sleek grid layout with hover actions for preview, download, and opening links.

## Page Location & Navigation
The Library will be added below "Dashboard" in the sidebar navigation, accessible at `/library`.

## Design Approach

### Header Section
- Large "Library" headline (matching Community Feed style: `text-3xl font-bold`)
- Subline describing the content: "All your generated content in one place"

### Tab Navigation
Following the existing Dashboard pattern with underline-style tabs:
- **All** - Shows all content types
- **Workflows** - Content from workflow executions (Trendcast videos, Report Cards, etc.)
- **Chats** - Content from chat conversations (images, files)

### Filter System
Horizontal filter bar with:
- **Date Filter**: Dropdown to sort/filter by date (Newest, Oldest, This Week, This Month)
- **Type Filter**: Multi-select badges for content types:
  - Video
  - Image
  - PDF
  - Word
  - Links
  - Other

## Content Cards

### Grid Layout
```text
+------------------+------------------+------------------+
|   [Thumbnail]    |   [Thumbnail]    |   [Thumbnail]    |
|   Video.mp4      |   Design.png     |   Report.pdf     |
|   Trendcast      |   Chat           |   Report Card    |
|   2 hours ago    |   Yesterday      |   3 days ago     |
+------------------+------------------+------------------+
```

Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

### Card Design
Each card will have:
- **Thumbnail area** (aspect-video ratio)
  - Videos: Video thumbnail with play icon overlay
  - Images: Image preview
  - PDFs/Docs: File type icon with color coding
  - Links: Favicon or link icon with gradient background
- **Content info below thumbnail**:
  - File name (truncated with tooltip)
  - Source badge (workflow name or "Chat")
  - Timestamp (relative time using date-fns)
  - File type badge

### Hover Actions
On hover, an overlay appears with action buttons:
- **Preview** (Eye icon) - Opens preview dialog/modal
- **Download** (Download icon) - Downloads the file
- **Open** (ExternalLink icon) - For links, opens in new tab

## File Structure

### New Files to Create

1. **`src/pages/Library.tsx`** - Main Library page component
2. **`src/components/library/LibraryCard.tsx`** - Individual content card component
3. **`src/components/library/LibraryFilters.tsx`** - Filter bar component
4. **`src/components/library/LibraryPreviewDialog.tsx`** - Preview modal for content

### Files to Modify

1. **`src/App.tsx`** - Add route for `/library`
2. **`src/components/AppSidebar.tsx`** - Add Library navigation item with FolderOpen icon

## Technical Details

### Data Structure
```typescript
interface LibraryItem {
  id: string;
  name: string;
  type: 'video' | 'image' | 'pdf' | 'word' | 'link' | 'other';
  source: {
    type: 'workflow' | 'chat';
    name: string;
    id: string;
  };
  thumbnail?: string;
  url: string;
  createdAt: Date;
  size?: number;
  mimeType?: string;
}
```

### Mock Data
The page will include mock data representing:
- Videos from Trendcast workflow
- Images from Chat Assistant
- PDFs from Report Card workflow
- External links shared in chats

### Component Breakdown

**Library.tsx**
- Uses MainLayout wrapper
- Page header with title and subtitle
- LibraryFilters component
- Tabs component (All, Workflows, Chats)
- Grid of LibraryCard components

**LibraryCard.tsx**
- Thumbnail area with type-specific rendering
- Hover overlay with action buttons
- Content info section
- Click handlers for preview/download/open

**LibraryFilters.tsx**
- Date dropdown (Select component)
- Type filter badges (toggle buttons)
- Clear filters button

**LibraryPreviewDialog.tsx**
- Modal dialog for content preview
- Video player for videos
- Image viewer for images
- PDF preview or download prompt for documents

### Sidebar Integration
Add navigation item in AppSidebar.tsx after Dashboard:
```typescript
<button
  onClick={() => handleNavigate("/library")}
  className={cn(
    "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
    isActive("/library")
      ? "bg-primary/10 text-primary"
      : "text-foreground/70 hover:bg-muted hover:text-foreground"
  )}
>
  <FolderOpen className="h-4 w-4 flex-shrink-0" />
  <span>Library</span>
</button>
```

Also add to collapsed sidebar view.

### Icon Selection
- FolderOpen (lucide-react) for sidebar navigation
- Play, Eye, Download, ExternalLink for card actions
- FileVideo, FileImage, FileText, File for type indicators

## Implementation Order
1. Create Library page with basic structure
2. Add route in App.tsx
3. Add navigation in AppSidebar (both expanded and collapsed states)
4. Create LibraryCard component
5. Create LibraryFilters component
6. Create LibraryPreviewDialog component
7. Add mock data and filtering logic
8. Style and polish

## Visual Style Notes
Following the project's minimalist aesthetic:
- Use subtle shadows and borders (matching WorkflowCard)
- Cards with white background, light border
- Hover effects: subtle scale, shadow increase
- Type badges with muted colors
- Grid gaps of 4-6 units
- Consistent padding matching other pages (p-8)
