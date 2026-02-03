import { useState, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import { LibraryCard } from "@/components/library/LibraryCard";
import { LibraryFilters } from "@/components/library/LibraryFilters";
import { LibraryPreviewDialog } from "@/components/library/LibraryPreviewDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockLibraryItems } from "@/data/libraryData";
import { LibraryItem, LibraryFilterType, LibrarySortOption, LibrarySourceFilter } from "@/types/library";
import { toast } from "@/hooks/use-toast";

export default function Library() {
  // Generated content state
  const [generatedSourceFilter, setGeneratedSourceFilter] = useState<LibrarySourceFilter>("all");
  const [generatedSortOption, setGeneratedSortOption] = useState<LibrarySortOption>("newest");
  const [generatedTypeFilters, setGeneratedTypeFilters] = useState<LibraryFilterType[]>([]);
  
  // Uploaded content state
  const [uploadedSortOption, setUploadedSortOption] = useState<LibrarySortOption>("newest");
  const [uploadedTypeFilters, setUploadedTypeFilters] = useState<LibraryFilterType[]>([]);
  
  // Shared state
  const [items, setItems] = useState<LibraryItem[]>(mockLibraryItems);
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreview = (item: LibraryItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  const handleDownload = (item: LibraryItem) => {
    console.log("Downloading:", item.name);
    toast({
      title: "Download started",
      description: `Downloading ${item.name}...`,
    });
  };

  const handleDelete = (item: LibraryItem) => {
    if (confirm(`Delete "${item.name}"? This action cannot be undone.`)) {
      setItems(prev => prev.filter(i => i.id !== item.id));
      toast({
        title: "Deleted",
        description: `${item.name} has been removed.`,
      });
    }
  };

  const generatedItems = useMemo(() => {
    let filtered = items.filter(item => item.category === "generated");

    // Source filter
    if (generatedSourceFilter === "workflows") {
      filtered = filtered.filter((item) => item.source.type === "workflow");
    } else if (generatedSourceFilter === "chats") {
      filtered = filtered.filter((item) => item.source.type === "chat");
    }

    // Type filters
    if (generatedTypeFilters.length > 0) {
      filtered = filtered.filter((item) => generatedTypeFilters.includes(item.type));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (generatedSortOption) {
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

    return filtered;
  }, [items, generatedSourceFilter, generatedSortOption, generatedTypeFilters]);

  const uploadedItems = useMemo(() => {
    let filtered = items.filter(item => item.category === "uploaded");

    // Type filters
    if (uploadedTypeFilters.length > 0) {
      filtered = filtered.filter((item) => uploadedTypeFilters.includes(item.type));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (uploadedSortOption) {
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

    return filtered;
  }, [items, uploadedSortOption, uploadedTypeFilters]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Library</h1>
            <p className="mt-1 text-muted-foreground">
              All your content in one place
            </p>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Generated Content */}
            <div>
              <Tabs
                value={generatedSourceFilter}
                onValueChange={(v) => setGeneratedSourceFilter(v as LibrarySourceFilter)}
                className="w-full"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">Generated Content</h2>
                    <TabsList className="bg-transparent p-0 h-auto gap-4 justify-start">
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
                  </div>
                  <LibraryFilters
                    sortOption={generatedSortOption}
                    onSortChange={setGeneratedSortOption}
                    typeFilters={generatedTypeFilters}
                    onTypeFilterChange={setGeneratedTypeFilters}
                  />
                </div>

                <TabsContent value="all" className="mt-0">
                  <ContentGrid
                    items={generatedItems}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                  />
                </TabsContent>
                <TabsContent value="workflows" className="mt-0">
                  <ContentGrid
                    items={generatedItems}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                  />
                </TabsContent>
                <TabsContent value="chats" className="mt-0">
                  <ContentGrid
                    items={generatedItems}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right: Uploaded Content */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold text-foreground">Uploaded Content</h2>
                <LibraryFilters
                  sortOption={uploadedSortOption}
                  onSortChange={setUploadedSortOption}
                  typeFilters={uploadedTypeFilters}
                  onTypeFilterChange={setUploadedTypeFilters}
                />
              </div>
              <ContentGrid
                items={uploadedItems}
                onPreview={handlePreview}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            </div>
          </div>
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
  onDelete: (item: LibraryItem) => void;
}

function ContentGrid({ items, onPreview, onDownload, onDelete }: ContentGridProps) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">No content found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item) => (
        <LibraryCard
          key={item.id}
          item={item}
          onPreview={onPreview}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
