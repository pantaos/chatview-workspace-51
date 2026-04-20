import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/TemplateCard";
import { FeaturedTemplateCard } from "@/components/FeaturedTemplateCard";
import { TemplatePreviewDialog } from "@/components/TemplatePreviewDialog";
import { templates, templateTags, TemplateItem } from "@/data/templates";
import { CommunityApp, seedCommunityApps } from "@/data/communityApps";
import { Search, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const COMMUNITY_CATEGORY = "__community__";

function communityAppToTemplate(app: CommunityApp): TemplateItem & { __community: true; submittedBy: string } {
  return {
    id: app.id,
    title: app.title,
    description: app.description,
    icon: app.icon,
    tags: app.tags,
    category: "app",
    screenshots: [],
    useCases: [],
    features: ["Built and submitted by a community member", "Standardized to platform style"],
    customizable: [],
    systemPrompt: "",
    suggestedIntegrations: [],
    starters: [],
    visibility: app.visibility,
    __community: true,
    submittedBy: app.submittedBy,
  };
}

export default function TemplateLibrary() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [communityApps, setCommunityApps] = useState<CommunityApp[]>([]);

  useEffect(() => {
    let stored: CommunityApp[] = [];
    try {
      stored = JSON.parse(localStorage.getItem("communityApps") || "[]");
    } catch {}
    setCommunityApps([...stored, ...seedCommunityApps].filter((a) => a.status === "approved"));
  }, []);

  const assistants = useMemo(
    () => templates.filter((t) => t.category === "assistant"),
    []
  );

  const community = useMemo(() => communityApps.map(communityAppToTemplate), [communityApps]);

  const all = useMemo(() => [...assistants, ...community], [assistants, community]);

  const filtered = useMemo(() => {
    return all.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        q === "" ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.useCases.some((u) => u.toLowerCase().includes(q));
      if (selectedTag === "all") return matchSearch;
      if (selectedTag === COMMUNITY_CATEGORY) return matchSearch && (t as any).__community === true;
      return matchSearch && t.tags.some((tag) => tag.id === selectedTag);
    });
  }, [all, searchQuery, selectedTag]);

  const featured = useMemo(() => assistants.filter((t) => t.isFeatured), [assistants]);

  const handleClick = (t: TemplateItem) => {
    setSelectedTemplate(t);
    setPreviewOpen(true);
  };

  const handleAdd = (t: TemplateItem) => {
    setPreviewOpen(false);
    toast.success(`"${t.title}" wird hinzugefügt...`);
    sessionStorage.setItem("addTemplate", JSON.stringify(t));
    navigate("/");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag("all");
  };

  const usedTagIds = new Set(all.flatMap((a) => a.tags.map((t) => t.id)));
  const visibleTags = templateTags.filter((t) => usedTagIds.has(t.id));

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl mx-auto py-8 px-4 md:px-6">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary mb-3">
                <Sparkles className="h-3 w-3" />
                Assistant Library
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Discover assistants
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Curated AI assistants and community-built apps. Pick one, personalize it, ship it.
              </p>
            </div>
            <Button onClick={() => navigate("/app-builder")} variant="outline" className="shrink-0">
              <Users className="h-4 w-4 mr-2" />
              Build an app
            </Button>
          </div>

          {/* Featured rail */}
          {featured.length > 0 && (
            <div className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Featured
                </h2>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                {featured.map((t) => (
                  <FeaturedTemplateCard
                    key={t.id}
                    template={t}
                    onClick={() => handleClick(t)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Search + tag filter */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assistants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-background border-border/60"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              <button
                onClick={() => setSelectedTag("all")}
                className={cn(
                  "px-3.5 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors border",
                  selectedTag === "all"
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/40"
                )}
              >
                All
              </button>
              {visibleTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.id)}
                  className={cn(
                    "px-3.5 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors border",
                    selectedTag === tag.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/40"
                  )}
                >
                  {tag.name}
                </button>
              ))}
              {community.length > 0 && (
                <button
                  onClick={() => setSelectedTag(COMMUNITY_CATEGORY)}
                  className={cn(
                    "px-3.5 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors border inline-flex items-center gap-1.5",
                    selectedTag === COMMUNITY_CATEGORY
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/40"
                  )}
                >
                  <Users className="h-3 w-3" />
                  Community Apps
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                All assistants
              </h2>
              <span className="text-xs text-muted-foreground">{filtered.length} results</span>
            </div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    onClick={() => handleClick(t)}
                    isCommunity={(t as any).__community === true}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center text-muted-foreground">
                <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No assistants match your filters.</p>
                <Button variant="link" onClick={clearFilters} className="mt-1">
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <TemplatePreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        template={selectedTemplate}
        onAdd={handleAdd}
      />
    </MainLayout>
  );
}
