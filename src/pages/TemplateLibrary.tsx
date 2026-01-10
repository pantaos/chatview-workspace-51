import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplatePreviewDialog } from "@/components/TemplatePreviewDialog";
import { templates, templateTags, TemplateItem } from "@/data/templates";
import { Search, LayoutGrid, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

export default function TemplateLibrary() {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedCategory("all");
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.useCases.some((uc) =>
          uc.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;

      // Tags filter
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tagId) =>
          template.tags.some((tag) => tag.id === tagId)
        );

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [searchQuery, selectedCategory, selectedTags]);

  const featuredTemplates = useMemo(() => {
    return templates.filter((t) => t.isFeatured);
  }, []);

  const handleTemplateClick = (template: TemplateItem) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handleAddTemplate = (template: TemplateItem) => {
    setPreviewOpen(false);
    // Navigate to home with template data to open NewWorkflowDialog pre-filled
    toast.success(`"${template.title}" wird hinzugefügt...`);
    
    // Store template in sessionStorage to pass to Index page
    sessionStorage.setItem("addTemplate", JSON.stringify(template));
    navigate("/");
  };

  const hasActiveFilters = searchQuery !== "" || selectedTags.length > 0 || selectedCategory !== "all";

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl mx-auto py-6 px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
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

            {/* Category Tabs */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="all">Alle</TabsTrigger>
                  <TabsTrigger value="assistant">Assistenten</TabsTrigger>
                  <TabsTrigger value="workflow">Workflows</TabsTrigger>
                  <TabsTrigger value="app">Apps</TabsTrigger>
                </TabsList>
              </Tabs>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Filter zurücksetzen
                </Button>
              )}
            </div>

            {/* Tag Filters */}
            <div className="flex flex-wrap gap-2">
              {templateTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer transition-colors"
                  style={
                    selectedTags.includes(tag.id)
                      ? { backgroundColor: tag.color, borderColor: tag.color }
                      : { borderColor: `${tag.color}50`, color: tag.color }
                  }
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Featured Section */}
          {!hasActiveFilters && featuredTemplates.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Empfohlen
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => handleTemplateClick(template)}
                  />
                ))}
              </div>
            </div>
          )}

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
