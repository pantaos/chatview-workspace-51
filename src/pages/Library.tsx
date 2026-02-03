import { useState, useMemo, useRef } from "react";
import MainLayout from "@/components/MainLayout";
import { LibraryCard } from "@/components/library/LibraryCard";
import { LibraryFilters } from "@/components/library/LibraryFilters";
import { LibraryPreviewDialog } from "@/components/library/LibraryPreviewDialog";
import { ProjectFilter } from "@/components/library/ProjectFilter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { mockLibraryItems, mockProjects } from "@/data/libraryData";
import { LibraryItem, LibraryFilterType, LibrarySortOption, LibrarySourceFilter } from "@/types/library";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export default function Library() {
  // Top-level category tab
  const [categoryTab, setCategoryTab] = useState<"generated" | "uploaded">("generated");
  
  // Generated content state
  const [generatedSourceFilter, setGeneratedSourceFilter] = useState<LibrarySourceFilter>("all");
  const [generatedSortOption, setGeneratedSortOption] = useState<LibrarySortOption>("newest");
  const [generatedTypeFilters, setGeneratedTypeFilters] = useState<LibraryFilterType[]>([]);
  const [generatedProjectFilters, setGeneratedProjectFilters] = useState<string[]>([]);
  
  // Uploaded content state
  const [uploadedSortOption, setUploadedSortOption] = useState<LibrarySortOption>("newest");
  const [uploadedTypeFilters, setUploadedTypeFilters] = useState<LibraryFilterType[]>([]);
  const [uploadedProjectFilters, setUploadedProjectFilters] = useState<string[]>([]);
  
  // Shared state
  const [items, setItems] = useState<LibraryItem[]>(mockLibraryItems);
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, this would upload to storage
      Array.from(files).forEach(file => {
        const newItem: LibraryItem = {
          id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: getFileType(file.type),
          category: "uploaded",
          source: { type: "upload", name: "Direct Upload", id: "upload" },
          url: URL.createObjectURL(file),
          createdAt: new Date(),
          size: file.size,
          mimeType: file.type,
        };
        setItems(prev => [newItem, ...prev]);
      });
      
      toast({
        title: "Upload complete",
        description: `${files.length} file(s) uploaded successfully.`,
      });
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileType = (mimeType: string): LibraryItem["type"] => {
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.includes("word") || mimeType.includes("document")) return "word";
    return "other";
  };

  // Project filter handlers
  const handleGeneratedProjectSelect = (projectId: string) => {
    setGeneratedProjectFilters(prev => [...prev, projectId]);
  };
  
  const handleGeneratedProjectRemove = (projectId: string) => {
    setGeneratedProjectFilters(prev => prev.filter(id => id !== projectId));
  };
  
  const handleUploadedProjectSelect = (projectId: string) => {
    setUploadedProjectFilters(prev => [...prev, projectId]);
  };
  
  const handleUploadedProjectRemove = (projectId: string) => {
    setUploadedProjectFilters(prev => prev.filter(id => id !== projectId));
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

    // Project filters
    if (generatedProjectFilters.length > 0) {
      filtered = filtered.filter((item) => item.projectId && generatedProjectFilters.includes(item.projectId));
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
  }, [items, generatedSourceFilter, generatedSortOption, generatedTypeFilters, generatedProjectFilters]);

  const uploadedItems = useMemo(() => {
    let filtered = items.filter(item => item.category === "uploaded");

    // Type filters
    if (uploadedTypeFilters.length > 0) {
      filtered = filtered.filter((item) => uploadedTypeFilters.includes(item.type));
    }

    // Project filters
    if (uploadedProjectFilters.length > 0) {
      filtered = filtered.filter((item) => item.projectId && uploadedProjectFilters.includes(item.projectId));
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
  }, [items, uploadedSortOption, uploadedTypeFilters, uploadedProjectFilters]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Library</h1>
            <p className="mt-1 text-muted-foreground">
              All your content in one place
            </p>
          </div>

          {/* Top-Level Category Tabs */}
          <Tabs
            value={categoryTab}
            onValueChange={(v) => setCategoryTab(v as "generated" | "uploaded")}
            className="w-full"
          >
            <TabsList className="bg-transparent p-0 h-auto gap-6 justify-start mb-6">
              <TabsTrigger
                value="generated"
                className="px-0 pb-2 text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-foreground"
              >
                Generated Content
              </TabsTrigger>
              <TabsTrigger
                value="uploaded"
                className="px-0 pb-2 text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-foreground"
              >
                Uploaded Content
              </TabsTrigger>
            </TabsList>

            {/* Generated Content Tab */}
            <TabsContent value="generated" className="mt-0">
              <Tabs
                value={generatedSourceFilter}
                onValueChange={(v) => setGeneratedSourceFilter(v as LibrarySourceFilter)}
                className="w-full"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
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

                  <LibraryFilters
                    sortOption={generatedSortOption}
                    onSortChange={setGeneratedSortOption}
                    typeFilters={generatedTypeFilters}
                    onTypeFilterChange={setGeneratedTypeFilters}
                  />
                </div>

                {/* Project Filter */}
                <div className="mb-4">
                  <ProjectFilter
                    projects={mockProjects}
                    selectedProjects={generatedProjectFilters}
                    onProjectSelect={handleGeneratedProjectSelect}
                    onProjectRemove={handleGeneratedProjectRemove}
                    onClearAll={() => setGeneratedProjectFilters([])}
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
            </TabsContent>

            {/* Uploaded Content Tab */}
            <TabsContent value="uploaded" className="mt-0">
              <div className="flex items-center justify-between gap-4 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUploadClick}
                  className="h-8 px-3 text-xs"
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />
                <LibraryFilters
                  sortOption={uploadedSortOption}
                  onSortChange={setUploadedSortOption}
                  typeFilters={uploadedTypeFilters}
                  onTypeFilterChange={setUploadedTypeFilters}
                />
              </div>

              {/* Project Filter */}
              <div className="mb-4">
                <ProjectFilter
                  projects={mockProjects}
                  selectedProjects={uploadedProjectFilters}
                  onProjectSelect={handleUploadedProjectSelect}
                  onProjectRemove={handleUploadedProjectRemove}
                  onClearAll={() => setUploadedProjectFilters([])}
                />
              </div>

              <ContentGrid
                items={uploadedItems}
                onPreview={handlePreview}
                onDownload={handleDownload}
                onDelete={handleDelete}
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
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
