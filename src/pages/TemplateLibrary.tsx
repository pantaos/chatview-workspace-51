import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExplorerCard, pickTone } from "@/components/explorer/ExplorerCard";
import { TemplatePreviewDialog } from "@/components/TemplatePreviewDialog";
import { TaskPreviewDialog } from "@/components/TaskPreviewDialog";
import ScheduleDialog from "@/components/ScheduleDialog";
import { templates, templateTags, TemplateItem } from "@/data/templates";
import { CommunityApp, seedCommunityApps } from "@/data/communityApps";
import { allUseCases, useCaseTeams, UseCase } from "@/data/useCases";
import { Search, Sparkles, ListChecks, LayoutGrid, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function communityAppToTemplate(app: CommunityApp): TemplateItem & { __community: true } {
  return {
    id: app.id,
    title: app.title,
    description: app.description,
    icon: app.icon,
    tags: app.tags,
    category: "app",
    screenshots: [],
    useCases: [],
    features: [],
    customizable: [],
    systemPrompt: "",
    suggestedIntegrations: [],
    starters: [],
    visibility: app.visibility,
    __community: true,
  };
}

export default function TemplateLibrary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [assistantTag, setAssistantTag] = useState<string>("all");
  const [taskTeam, setTaskTeam] = useState<string>("all");

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<UseCase | null>(null);
  const [selectedTask, setSelectedTask] = useState<UseCase | null>(null);
  const [communityApps, setCommunityApps] = useState<CommunityApp[]>([]);

  useEffect(() => {
    let stored: CommunityApp[] = [];
    try {
      stored = JSON.parse(localStorage.getItem("communityApps") || "[]");
    } catch {}
    setCommunityApps([...stored, ...seedCommunityApps].filter((a) => a.status === "approved"));
  }, []);

  const assistants = useMemo(
    () => [
      ...templates.filter((t) => t.category === "assistant"),
      ...communityApps.map(communityAppToTemplate),
    ],
    [communityApps]
  );

  const filteredAssistants = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return assistants.filter((t) => {
      const matchSearch =
        q === "" ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      const matchTag = assistantTag === "all" || t.tags.some((tag) => tag.id === assistantTag);
      return matchSearch && matchTag;
    });
  }, [assistants, searchQuery, assistantTag]);

  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allUseCases.filter((uc) => {
      const matchSearch =
        q === "" ||
        uc.name.toLowerCase().includes(q) ||
        uc.team.toLowerCase().includes(q) ||
        uc.taskType.toLowerCase().includes(q);
      const matchTeam = taskTeam === "all" || uc.team === taskTeam;
      return matchSearch && matchTeam;
    });
  }, [searchQuery, taskTeam]);

  const handleAdd = (t: TemplateItem) => {
    setPreviewOpen(false);
    toast.success(`"${t.title}" wird hinzugefügt...`);
    sessionStorage.setItem("addTemplate", JSON.stringify(t));
    navigate("/");
  };

  const usedTagIds = new Set(assistants.flatMap((a) => a.tags.map((t) => t.id)));
  const visibleTags = templateTags.filter((t) => usedTagIds.has(t.id));

  const visibleAssistants = filteredAssistants.slice(0, 8);
  const visibleTasks = filteredTasks.slice(0, 8);

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        {/* Top search bar */}
        <div className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-border/60">
          <div className="container max-w-7xl mx-auto px-4 md:px-8 py-4">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates, assistants and tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 rounded-full bg-muted/40 border-border/40 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
          {/* Page heading */}
          <header>
            <h1 className="text-3xl font-bold text-foreground">Explore</h1>
            <p className="mt-1 text-muted-foreground">
              Discover inspiration, assistants and tools to get your work done.
            </p>
          </header>

          {/* Use Case Stories highlighted band */}
          <section className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-6 md:p-7">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">Use Case Stories</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Discover what PANTA can do for you.
                </p>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {visibleTasks.slice(0, 5).map((task) => (
                <button
                  key={`story-${task.id}`}
                  onClick={() => setSelectedTask(task)}
                  className="text-left rounded-xl bg-card border border-border/60 p-5 flex flex-col min-h-[180px] transition-all hover:border-foreground/20 hover:shadow-sm"
                >
                  <h3 className="text-sm font-bold text-foreground leading-tight">
                    {task.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-4 flex-1">
                    {task.description ||
                      `Ready-to-run for the ${task.team} team. ${task.taskType}.`}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-primary text-xs font-medium">
                    <span>Learn more</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Assistants section */}
          <Section
            icon={Sparkles}
            title="Assistants"
            count={filteredAssistants.length}
            pills={[
              { id: "all", label: "All" },
              ...visibleTags.map((t) => ({ id: t.id, label: t.name })),
            ]}
            activePill={assistantTag}
            onPill={setAssistantTag}
            onViewAll={() => {}}
          >
            {visibleAssistants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {visibleAssistants.map((t) => {
                  const Icon =
                    ((LucideIcons as any)[t.icon] as LucideIcon) || LucideIcons.Sparkles;
                  return (
                    <ExplorerCard
                      key={t.id}
                      icon={Icon}
                      title={t.title}
                      description={t.description}
                      tone={pickTone(t.id)}
                      meta={t.tags[0]?.name ?? "Assistant"}
                      onClick={() => {
                        setSelectedTemplate(t);
                        setPreviewOpen(true);
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <Empty label="assistants" />
            )}
          </Section>

          {/* Tasks section */}
          <Section
            icon={ListChecks}
            title="Use Cases"
            count={filteredTasks.length}
            pills={[
              { id: "all", label: "All" },
              ...useCaseTeams.map((t) => ({ id: t, label: t })),
            ]}
            activePill={taskTeam}
            onPill={setTaskTeam}
            onViewAll={() => {}}
          >
            {visibleTasks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {visibleTasks.map((task) => (
                  <ExplorerCard
                    key={task.id}
                    icon={task.icon as LucideIcon}
                    title={task.name}
                    description={`Ready-to-run for the ${task.team} team. ${task.taskType}.`}
                    tone={pickTone(task.id + task.team)}
                    meta={`${task.saves}`}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            ) : (
              <Empty label="tasks" />
            )}
          </Section>

          {/* Use cases (themes) */}
          <Section icon={LayoutGrid} title="Use cases" count={useCaseTeams.length} onViewAll={() => {}}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {useCaseTeams.slice(0, 8).map((team) => {
                const count = allUseCases.filter((u) => u.team === team).length;
                return (
                  <ExplorerCard
                    key={team}
                    icon={LucideIcons.Layers}
                    title={team}
                    description={`Browse ${count} ready tasks tailored for the ${team} team.`}
                    tone={pickTone(team)}
                    meta={`${count} tasks`}
                    onClick={() => {
                      setTaskTeam(team);
                      window.scrollTo({ top: 400, behavior: "smooth" });
                    }}
                  />
                );
              })}
            </div>
          </Section>

          {/* Footer banner */}
          <div className="rounded-2xl border border-border/60 bg-muted/30 px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>
                Can't find what you need?{" "}
                <button className="text-primary hover:underline font-medium">Request a template</button>{" "}
                or suggest a new idea.
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <TemplatePreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        template={selectedTemplate}
        onAdd={handleAdd}
      />

      <TaskPreviewDialog
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onRun={(t) => {
          setSelectedTask(null);
          navigate(`/use-cases/run/${t.id}`);
        }}
        onSchedule={(t) => {
          setSelectedTask(null);
          setScheduleTarget(t);
        }}
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

function Section({
  icon: Icon,
  title,
  count,
  pills,
  activePill,
  onPill,
  onViewAll,
  children,
}: {
  icon: LucideIcon;
  title: string;
  count: number;
  pills?: { id: string; label: string }[];
  activePill?: string;
  onPill?: (id: string) => void;
  onViewAll?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-foreground/80" />
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {count}
          </span>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {pills && pills.length > 1 && (
        <div className="mb-4 flex gap-1.5 overflow-x-auto scrollbar-hide">
          {pills.map((p) => (
            <button
              key={p.id}
              onClick={() => onPill?.(p.id)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors border",
                activePill === p.id
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/40"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {children}
    </section>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-10 text-center text-muted-foreground text-sm">
      No {label} match your filters.
    </div>
  );
}
