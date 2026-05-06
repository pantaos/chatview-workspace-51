import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/TemplateCard";
import { TaskCard } from "@/components/TaskCard";
import { FeaturedTemplateCard } from "@/components/FeaturedTemplateCard";
import { TemplatePreviewDialog } from "@/components/TemplatePreviewDialog";
import ScheduleDialog from "@/components/ScheduleDialog";
import { templates, templateTags, TemplateItem } from "@/data/templates";
import { CommunityApp, seedCommunityApps } from "@/data/communityApps";
import { allUseCases, useCaseTeams, useCaseTaskTypes, UseCase } from "@/data/useCases";
import { Search, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type View = "all" | "assistants" | "tasks";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const initialView = (searchParams.get("view") as View) || "all";
  const [view, setView] = useState<View>(initialView);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedTaskType, setSelectedTaskType] = useState<string>("all");

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<UseCase | null>(null);
  const [communityApps, setCommunityApps] = useState<CommunityApp[]>([]);

  useEffect(() => {
    let stored: CommunityApp[] = [];
    try {
      stored = JSON.parse(localStorage.getItem("communityApps") || "[]");
    } catch {}
    setCommunityApps([...stored, ...seedCommunityApps].filter((a) => a.status === "approved"));
  }, []);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (view === "all") next.delete("view");
    else next.set("view", view);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const assistants = useMemo(
    () => templates.filter((t) => t.category === "assistant"),
    []
  );
  const community = useMemo(() => communityApps.map(communityAppToTemplate), [communityApps]);
  const allAssistants = useMemo(() => [...assistants, ...community], [assistants, community]);

  const filteredAssistants = useMemo(() => {
    return allAssistants.filter((t) => {
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
  }, [allAssistants, searchQuery, selectedTag]);

  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allUseCases.filter((uc) => {
      const matchSearch =
        q === "" ||
        uc.name.toLowerCase().includes(q) ||
        uc.team.toLowerCase().includes(q) ||
        uc.taskType.toLowerCase().includes(q) ||
        uc.integrations.some((i) => i.toLowerCase().includes(q));
      const matchTeam = selectedTeam === "all" || uc.team === selectedTeam;
      const matchType = selectedTaskType === "all" || uc.taskType === selectedTaskType;
      return matchSearch && matchTeam && matchType;
    });
  }, [searchQuery, selectedTeam, selectedTaskType]);

  const featured = useMemo(() => assistants.filter((t) => t.isFeatured), [assistants]);

  const showAssistants = view === "all" || view === "assistants";
  const showTasks = view === "all" || view === "tasks";

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
    setSelectedTeam("all");
    setSelectedTaskType("all");
  };

  const usedTagIds = new Set(allAssistants.flatMap((a) => a.tags.map((t) => t.id)));
  const visibleTags = templateTags.filter((t) => usedTagIds.has(t.id));

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        {/* Sticky header */}
        <div className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-border/60">
          <div className="container max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-4">
            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary mb-2">
                <Sparkles className="h-3 w-3" />
                Explorer
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Discover assistants & tasks
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                Personalize an assistant or run a ready-made task for your team.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Segment toggle */}
                <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5">
                  {([
                    { id: "all", label: "All" },
                    { id: "assistants", label: "Assistants" },
                    { id: "tasks", label: "Tasks" },
                  ] as { id: View; label: string }[]).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setView(opt.id)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                        view === opt.id
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assistants and tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 rounded-lg bg-background border-border/60"
                  />
                </div>
              </div>

              {/* Contextual filter pills */}
              {showAssistants && (
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                  <FilterPill
                    active={selectedTag === "all"}
                    onClick={() => setSelectedTag("all")}
                  >
                    All tags
                  </FilterPill>
                  {visibleTags.map((tag) => (
                    <FilterPill
                      key={tag.id}
                      active={selectedTag === tag.id}
                      onClick={() => setSelectedTag(tag.id)}
                    >
                      {tag.name}
                    </FilterPill>
                  ))}
                  {community.length > 0 && (
                    <FilterPill
                      active={selectedTag === COMMUNITY_CATEGORY}
                      onClick={() => setSelectedTag(COMMUNITY_CATEGORY)}
                    >
                      <Users className="h-3 w-3 mr-1 inline" />
                      Community
                    </FilterPill>
                  )}
                </div>
              )}

              {showTasks && (
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                  <FilterPill
                    active={selectedTeam === "all" && selectedTaskType === "all"}
                    onClick={() => { setSelectedTeam("all"); setSelectedTaskType("all"); }}
                  >
                    All teams
                  </FilterPill>
                  {useCaseTeams.map((t) => (
                    <FilterPill
                      key={t}
                      active={selectedTeam === t}
                      onClick={() => setSelectedTeam(selectedTeam === t ? "all" : t)}
                    >
                      {t}
                    </FilterPill>
                  ))}
                  <span className="mx-1 self-center text-border">·</span>
                  {useCaseTaskTypes.map((t) => (
                    <FilterPill
                      key={t}
                      active={selectedTaskType === t}
                      onClick={() => setSelectedTaskType(selectedTaskType === t ? "all" : t)}
                    >
                      {t}
                    </FilterPill>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container max-w-6xl mx-auto py-8 px-4 md:px-6 space-y-12">
          {/* Featured rail */}
          {showAssistants && featured.length > 0 && searchQuery === "" && selectedTag === "all" && (
            <div>
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

          {/* Assistants */}
          {showAssistants && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Assistants · {filteredAssistants.length}
                </h2>
              </div>
              {filteredAssistants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAssistants.map((t) => (
                    <TemplateCard
                      key={t.id}
                      template={t}
                      onClick={() => handleClick(t)}
                      isCommunity={(t as any).__community === true}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState onClear={clearFilters} label="assistants" />
              )}
            </section>
          )}

          {/* Tasks */}
          {showTasks && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Tasks · {filteredTasks.length}
                </h2>
                <span className="text-xs text-muted-foreground">Ready-to-run automations</span>
              </div>
              {filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onRun={() => navigate(`/use-cases/run/${task.id}`)}
                      onSchedule={() => setScheduleTarget(task)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState onClear={clearFilters} label="tasks" />
              )}
            </section>
          )}
        </div>
      </div>

      <TemplatePreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        template={selectedTemplate}
        onAdd={handleAdd}
      />

      {scheduleTarget && (
        <ScheduleDialog
          open={!!scheduleTarget}
          onOpenChange={(o) => !o && setScheduleTarget(null)}
          useCaseName={scheduleTarget.name}
        />
      )}
    </MainLayout>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors border",
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/40"
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({ onClear, label }: { onClear: () => void; label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-12 text-center text-muted-foreground">
      <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
      <p className="text-sm">No {label} match your filters.</p>
      <Button variant="link" onClick={onClear} className="mt-1">
        Clear filters
      </Button>
    </div>
  );
}
