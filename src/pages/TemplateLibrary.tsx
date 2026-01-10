import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateCard } from "@/components/TemplateCard";
import { FeaturedTemplateCard } from "@/components/FeaturedTemplateCard";
import { TemplatePreviewDialog } from "@/components/TemplatePreviewDialog";
import { templates, templateTags, TemplateItem } from "@/data/templates";
import { Search, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TemplateLibrary() {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTag("all");
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        searchQuery === "" ||
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.useCases.some((uc) =>
          uc.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;

      const matchesTag =
        selectedTag === "all" ||
        template.tags.some((t) => t.id === selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [searchQuery, selectedCategory, selectedTag]);

  const featuredTemplates = useMemo(() => {
    return templates.filter((t) => t.isFeatured);
  }, []);

  const handleTemplateClick = (template: TemplateItem) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handleAddTemplate = (template: TemplateItem) => {
    setPreviewOpen(false);
    toast.success(`"${template.title}" wird hinzugefügt...`);
    sessionStorage.setItem("addTemplate", JSON.stringify(template));
    navigate("/");
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || selectedTag !== "all";

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl mx-auto py-6 px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Template Library</h1>
            <p className="text-muted-foreground mt-2">
              Entdecke und füge vorgefertigte Assistenten und Apps hinzu
            </p>
          </div>

          {/* Featured Hero Section */}
          {featuredTemplates.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Empfohlen</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 pr-16 md:pr-4 scrollbar-hide snap-x snap-mandatory">
                {featuredTemplates.map((template) => (
                  <FeaturedTemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => handleTemplateClick(template)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            {/* Category Tabs - Settings style */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="flex justify-start overflow-x-auto scrollbar-hide bg-transparent border-b border-border rounded-none p-0 h-auto w-full">
                  <TabsTrigger 
                    value="all"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary whitespace-nowrap"
                  >
                    Alle
                  </TabsTrigger>
                  <TabsTrigger 
                    value="assistant"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary whitespace-nowrap"
                  >
                    Assistenten
                  </TabsTrigger>
                  <TabsTrigger 
                    value="workflow"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary whitespace-nowrap"
                  >
                    Workflows
                  </TabsTrigger>
                  <TabsTrigger 
                    value="app"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-muted-foreground data-[state=active]:text-primary whitespace-nowrap"
                  >
                    Apps
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>

            {/* Tag Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              <button
                onClick={() => setSelectedTag("all")}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors",
                  selectedTag === "all" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                Alle
              </button>
              {templateTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.id)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors",
                    selectedTag === tag.id 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* All Templates */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Alle Templates</h2>
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => handleTemplateClick(template)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Keine Templates gefunden</p>
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-2"
                >
                  Filter zurücksetzen
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <TemplatePreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        template={selectedTemplate}
        onAdd={handleAddTemplate}
      />
    </MainLayout>
  );
}
