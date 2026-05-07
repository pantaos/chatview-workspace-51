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

  const [assistantTag, setAssistantTag] = useState<string>("all");
  const [storiesExpanded, setStoriesExpanded] = useState(false);
  const [assistantsExpanded, setAssistantsExpanded] = useState(false);

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
    return assistants.filter((t) => {
      const matchTag = assistantTag === "all" || t.tags.some((tag) => tag.id === assistantTag);
      return matchTag;
    });
  }, [assistants, assistantTag]);

  const handleAdd = (t: TemplateItem) => {
    setPreviewOpen(false);
    toast.success(`"${t.title}" wird hinzugefügt...`);
    sessionStorage.setItem("addTemplate", JSON.stringify(t));
    navigate("/");
  };

  const usedTagIds = new Set(assistants.flatMap((a) => a.tags.map((t) => t.id)));
  const visibleTags = templateTags.filter((t) => usedTagIds.has(t.id));

  const allStories = allUseCases;
  const visibleStories = storiesExpanded ? allStories : allStories.slice(0, 5);
  const visibleAssistants = assistantsExpanded ? filteredAssistants : filteredAssistants.slice(0, 8);

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
          {/* Page heading */}
          <header>
            <h1 className="text-3xl font-bold text-foreground">Explore</h1>
            <p className="mt-1 text-muted-foreground">
              Discover inspiration, assistants and tools to get your work done.
            </p>
          </header>

          {/* Use Case Stories highlighted band */}
          <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.10] via-primary/[0.04] to-transparent p-6 md:p-8">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative mb-6 flex items-end justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] uppercase mb-2">
                  <Sparkles className="h-3 w-3" /> Inspiration
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Use Case Stories</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Discover what PANTA can do for you.
                </p>
              </div>
              {allStories.length > 5 && (
                <button
                  onClick={() => setStoriesExpanded((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
                >
                  {storiesExpanded ? "Show less" : "View all"} <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
            <div
              className={cn(
                "relative",
                storiesExpanded && "max-h-[520px] overflow-y-auto pr-1"
              )}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {visibleStories.map((task, i) => (
                  <button
                    key={`story-${task.id}`}
                    onClick={() => setSelectedTask(task)}
                    className="group relative text-left rounded-2xl bg-card/95 backdrop-blur border border-border/60 p-5 flex flex-col min-h-[200px] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.35)]"
                  >
                    
                    <div className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-[11px] font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-sm font-bold text-foreground leading-tight">
                      {task.name}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-4 flex-1">
                      {task.description ||
                        `Ready-to-run for the ${task.team} team. ${task.taskType}.`}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-primary text-xs font-semibold">
                      <span>Learn more</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Assistants section */}
          <Section
            title="Assistants"
            count={filteredAssistants.length}
            pills={[
              { id: "all", label: "All" },
              ...visibleTags.map((t) => ({ id: t.id, label: t.name })),
            ]}
            activePill={assistantTag}
            onPill={setAssistantTag}
            onViewAll={
              filteredAssistants.length > 8
                ? () => setAssistantsExpanded((v) => !v)
                : undefined
            }
            viewAllLabel={assistantsExpanded ? "Show less" : "View all"}
          >
            {visibleAssistants.length > 0 ? (
              <div className={cn(assistantsExpanded && "max-h-[640px] overflow-y-auto pr-1")}>
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
              </div>
            ) : (
              <Empty label="assistants" />
            )}
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
  title,
  count,
  pills,
  activePill,
  onPill,
  onViewAll,
  viewAllLabel = "View all",
  children,
}: {
  title: string;
  count: number;
  pills?: { id: string; label: string }[];
  activePill?: string;
  onPill?: (id: string) => void;
  onViewAll?: () => void;
  viewAllLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
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
            {viewAllLabel} <ArrowRight className="h-3 w-3" />
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
