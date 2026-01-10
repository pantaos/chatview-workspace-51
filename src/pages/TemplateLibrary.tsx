import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateCard } from "@/components/TemplateCard";
import { FeaturedTemplateCard } from "@/components/FeaturedTemplateCard";
import { TemplatePreviewDialog } from "@/components/TemplatePreviewDialog";
import { templates, TemplateItem } from "@/data/templates";
import { Search, LayoutGrid, X } from "lucide-react";
import { toast } from "sonner";

export default function TemplateLibrary() {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
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

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all";

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl mx-auto py-6 px-4 md:px-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <LayoutGrid className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Template Library</h1>
                <p className="text-muted-foreground text-sm">
                  Entdecke und füge vorgefertigte Assistenten und Apps hinzu
                </p>
              </div>
            </div>
          </div>

          {/* Featured Hero Section */}
          {featuredTemplates.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Empfohlen</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
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

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Filter zurücksetzen
              </Button>
            )}
          </div>

          {/* All Templates */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {hasActiveFilters
                ? `${filteredTemplates.length} Ergebnis${filteredTemplates.length !== 1 ? "se" : ""}`
                : "Alle Templates"}
            </h2>
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
