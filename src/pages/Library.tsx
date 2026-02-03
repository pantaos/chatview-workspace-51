import { useState, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import { LibraryCard } from "@/components/library/LibraryCard";
import { LibraryFilters } from "@/components/library/LibraryFilters";
import { LibraryPreviewDialog } from "@/components/library/LibraryPreviewDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockLibraryItems } from "@/data/libraryData";
import { LibraryItem, LibraryFilterType, LibrarySortOption, LibrarySourceFilter } from "@/types/library";

export default function Library() {
  const [sourceFilter, setSourceFilter] = useState<LibrarySourceFilter>("all");
  const [sortOption, setSortOption] = useState<LibrarySortOption>("newest");
  const [typeFilters, setTypeFilters] = useState<LibraryFilterType[]>([]);
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreview = (item: LibraryItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  const handleDownload = (item: LibraryItem) => {
    // In a real app, this would trigger an actual download
    console.log("Downloading:", item.name);
    // For demo purposes, just show a notification
    alert(`Downloading: ${item.name}`);
  };

  const filteredItems = useMemo(() => {
    let items = [...mockLibraryItems];

    // Source filter
    if (sourceFilter === "workflows") {
      items = items.filter((item) => item.source.type === "workflow");
    } else if (sourceFilter === "chats") {
      items = items.filter((item) => item.source.type === "chat");
    }

    // Type filters
    if (typeFilters.length > 0) {
      items = items.filter((item) => typeFilters.includes(item.type));
    }

    // Sort
    items.sort((a, b) => {
      switch (sortOption) {
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "newest":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return items;
  }, [sourceFilter, sortOption, typeFilters]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Library</h1>
            <p className="mt-1 text-muted-foreground">
              All your generated content in one place
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            value={sourceFilter}
            onValueChange={(v) => setSourceFilter(v as LibrarySourceFilter)}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList className="bg-transparent p-0 h-auto gap-4">
                <TabsTrigger
                  value="all"
                  className="px-0 pb-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-foreground"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="workflows"
                  className="px-0 pb-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-foreground"
                >
                  Workflows
                </TabsTrigger>
                <TabsTrigger
                  value="chats"
                  className="px-0 pb-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-foreground"
                >
                  Chats
                </TabsTrigger>
              </TabsList>

              {/* Filters */}
              <LibraryFilters
                sortOption={sortOption}
                onSortChange={setSortOption}
                typeFilters={typeFilters}
                onTypeFilterChange={setTypeFilters}
              />
            </div>

            {/* Content Grid */}
            <TabsContent value="all" className="mt-0">
              <ContentGrid
                items={filteredItems}
                onPreview={handlePreview}
                onDownload={handleDownload}
              />
            </TabsContent>
            <TabsContent value="workflows" className="mt-0">
              <ContentGrid
                items={filteredItems}
                onPreview={handlePreview}
                onDownload={handleDownload}
              />
            </TabsContent>
            <TabsContent value="chats" className="mt-0">
              <ContentGrid
                items={filteredItems}
                onPreview={handlePreview}
                onDownload={handleDownload}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Preview Dialog */}
      <LibraryPreviewDialog
        item={previewItem}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onDownload={handleDownload}
      />
    </MainLayout>
  );
}

interface ContentGridProps {
  items: LibraryItem[];
  onPreview: (item: LibraryItem) => void;
  onDownload: (item: LibraryItem) => void;
}

function ContentGrid({ items, onPreview, onDownload }: ContentGridProps) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">No content found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {items.map((item) => (
        <LibraryCard
          key={item.id}
          item={item}
          onPreview={onPreview}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}
