
# Library Page Enhancement: Two-Column Layout with Project Assignment

## Overview
Restructure the Library page into a two-column layout with **Generated Content** on the left and **Uploaded Content** on the right. Both sections will have the ability to add assets to projects via a contextual menu.

## New Layout Structure

```text
+----------------------------------------------------------+
| Library                                                   |
| All your content in one place                             |
+----------------------------------------------------------+
|                                                           |
| Generated Content              | Uploaded Content         |
| [All] [Workflows] [Chats]      | [Sort] [Filter]          |
| [Sort] [Filter]                |                          |
+-------------------------------|---------------------------+
|                               |                           |
| +------+ +------+ +------+    | +------+ +------+         |
| | vid  | | img  | | pdf  |    | | img  | | doc  |         |
| +------+ +------+ +------+    | +------+ +------+         |
|                               |                           |
| +------+ +------+ +------+    | +------+ +------+         |
| | doc  | | link | | vid  |    | | pdf  | | img  |         |
| +------+ +------+ +------+    | +------+ +------+         |
+----------------------------------------------------------+
```

On mobile, these sections will stack vertically.

## Key Changes

### 1. Split Layout (Left/Right Columns)
- **Left Column**: Generated Content (existing items from workflows and chats)
- **Right Column**: Uploaded Content (files directly uploaded by users)
- Desktop: Side-by-side columns (50/50 split)
- Mobile: Stacked vertically (Generated first, then Uploaded)

### 2. Card Action Menu (3-dot menu)
Each card will have a hover menu with options:
- **Add to Project** - Opens a dropdown to select a project
- **Chat** - Initiate a chat with this asset attached
- **Download** (for files) / **Open Link** (for links)
- **Delete** - Remove the asset (with confirmation)

### 3. Data Model Updates
Add `category` field to LibraryItem:
```typescript
interface LibraryItem {
  // ... existing fields
  category: 'uploaded' | 'generated';
  projectId?: string;  // optional: if assigned to a project
}
```

Add `'upload'` as a new source type:
```typescript
source: {
  type: 'workflow' | 'chat' | 'upload';
  name: string;
  id: string;
}
```

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Library.tsx` | Restructure to two-column layout, add section headers, separate filters per section |
| `src/components/library/LibraryCard.tsx` | Add 3-dot dropdown menu with Chat, Add to Project, Download, Delete options |
| `src/types/library.ts` | Add `category` field, `projectId` field, `'upload'` source type |
| `src/data/libraryData.ts` | Add `category` to existing items, add new mock uploaded items |

### New Components (Optional)
- `LibrarySectionHeader.tsx` - Reusable header for each section with title and filter controls

---

## Library.tsx New Structure

```tsx
<MainLayout>
  <div className="min-h-screen bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Library</h1>
        <p className="text-muted-foreground">All your content in one place</p>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Generated Content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Generated Content</h2>
            <LibraryFilters ... />
          </div>
          <Tabs value={sourceFilter} ...>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="chats">Chats</TabsTrigger>
            </TabsList>
            <TabsContent>
              <ContentGrid items={generatedItems} ... />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Uploaded Content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Uploaded Content</h2>
            <LibraryFilters ... />
          </div>
          <ContentGrid items={uploadedItems} ... />
        </div>
      </div>
    </div>
  </div>
</MainLayout>
```

---

## LibraryCard Menu Structure

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="absolute top-2 right-2 p-1.5 rounded-full 
      bg-black/50 hover:bg-black/70 text-white 
      opacity-0 group-hover:opacity-100 transition-opacity">
      <MoreHorizontal className="h-3.5 w-3.5" />
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    {/* Add to Project - Submenu */}
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <FolderPlus className="mr-2 h-4 w-4" />
        Add to Project
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>Project Alpha</DropdownMenuItem>
        <DropdownMenuItem>Project Beta</DropdownMenuItem>
        <DropdownMenuItem>Marketing Campaign</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
    
    <DropdownMenuItem onClick={() => onChat(item)}>
      <MessageSquare className="mr-2 h-4 w-4" />
      Chat
    </DropdownMenuItem>
    
    {item.type !== "link" ? (
      <DropdownMenuItem onClick={() => onDownload(item)}>
        <Download className="mr-2 h-4 w-4" />
        Download
      </DropdownMenuItem>
    ) : (
      <DropdownMenuItem onClick={() => onOpenLink(item)}>
        <ExternalLink className="mr-2 h-4 w-4" />
        Open Link
      </DropdownMenuItem>
    )}
    
    <DropdownMenuSeparator />
    
    <DropdownMenuItem 
      onClick={() => onDelete(item)} 
      className="text-destructive"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Mock Data Updates

### Add category to existing items
```typescript
{
  id: "1",
  name: "Trendcast_Q1_2026.mp4",
  type: "video",
  category: "generated",  // NEW
  source: { type: "workflow", name: "Trendcast", id: "trendcast-1" },
  // ...
}
```

### Add new uploaded content items
```typescript
{
  id: "upload-1",
  name: "Company_Logo.png",
  type: "image",
  category: "uploaded",
  source: { type: "upload", name: "Direct Upload", id: "upload" },
  thumbnail: "/placeholder.svg",
  url: "#",
  createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  size: 450000,
  mimeType: "image/png",
},
{
  id: "upload-2",
  name: "Product_Specs.pdf",
  type: "pdf",
  category: "uploaded",
  source: { type: "upload", name: "Direct Upload", id: "upload" },
  url: "#",
  createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  size: 320000,
  mimeType: "application/pdf",
}
```

---

## Implementation Order

1. Update `src/types/library.ts` with new fields
2. Update `src/data/libraryData.ts` with categories and new mock items
3. Refactor `src/pages/Library.tsx` to two-column layout
4. Update `src/components/library/LibraryCard.tsx` with 3-dot dropdown menu
5. Add project list mock data for "Add to Project" submenu
6. Test responsive behavior on mobile

---

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Desktop (lg+) | Side-by-side columns |
| Tablet/Mobile | Stacked vertically, Generated Content first |

Grid classes: `grid grid-cols-1 lg:grid-cols-2 gap-8`
