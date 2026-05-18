import { useState, useMemo, useRef, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search, Sparkles, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus,
  Lightbulb, FileText, ArrowRight, GripVertical, X, Send, Trash2, Clock, Target,
  Users, TrendingUp, Inbox, CheckCircle2, Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  contentIdeas as seedIdeas,
  topicClusters,
  statusColors,
  priorityColors,
  allStatuses,
  allFormats,
  channels,
  owners,
  type ContentIdea,
  type Status,
  type Channel,
  type TopicCluster,
  type Priority,
} from "@/data/editorialCockpitData";

const WORKFLOW_STEPS = [
  "Research", "Idea generation", "Prioritization", "Calendar planning",
  "Briefing", "Content production", "Review", "Approval", "Publication",
];

const EditorialCockpit = () => {
  const [tab, setTab] = useState("cockpit");
  const [ideas, setIdeas] = useState<ContentIdea[]>(seedIdeas);
  const [selected, setSelected] = useState<ContentIdea | null>(null);
  const [researchOpen, setResearchOpen] = useState(false);

  // Filters
  const [period, setPeriod] = useState("month");
  const [channel, setChannel] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [cluster, setCluster] = useState<string>("all");

  const filteredIdeas = useMemo(() => {
    return ideas.filter((i) =>
      (channel === "all" || i.channel === channel) &&
      (status === "all" || i.status === status) &&
      (cluster === "all" || i.cluster === cluster)
    );
  }, [ideas, channel, status, cluster]);

  const updateIdea = (id: string, patch: Partial<ContentIdea>) => {
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    if (selected?.id === id) setSelected((s) => (s ? { ...s, ...patch } : s));
  };

  const scheduleIdea = (id: string, date: string) => {
    updateIdea(id, { scheduledDate: date, status: "Planned" });
    toast.success("Im Kalender geplant");
  };

  const dismissIdea = (id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
    toast("Idee verworfen");
  };

  const addIdeasFromResearch = (newIdeas: ContentIdea[]) => {
    setIdeas((prev) => [...newIdeas, ...prev]);
  };

  return (
    <MainLayout>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 md:pt-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-foreground leading-tight">Editorial Cockpit</h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  Recherchieren, Ideen priorisieren, Redaktionsplan steuern — alles in einem Cockpit.
                </p>
              </div>
              <Button size="sm" onClick={() => setResearchOpen(true)} className="shrink-0">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Start Research
              </Button>
            </div>
            <TabsList className="bg-transparent p-0 h-auto gap-6 w-full justify-start rounded-none overflow-x-auto scrollbar-hide -mb-px">
              {[
                { v: "cockpit", label: "Cockpit" },
                { v: "calendar", label: "Kalender & Backlog" },
                { v: "clusters", label: "Themen-Cluster" },
                { v: "workflow", label: "Workflow" },
              ].map((t) => (
                <TabsTrigger
                  key={t.v} value={t.v}
                  className="px-0 pb-2.5 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-foreground whitespace-nowrap"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 pb-12">
          {/* Global filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Diese Woche</SelectItem>
                <SelectItem value="month">Dieser Monat</SelectItem>
                <SelectItem value="quarter">Dieses Quartal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Kanal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kanäle</SelectItem>
                {channels.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                {allStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={cluster} onValueChange={setCluster}>
              <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Cluster" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Cluster</SelectItem>
                {topicClusters.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="cockpit" className="mt-0">
            <CockpitView ideas={filteredIdeas} allIdeas={ideas} onOpen={setSelected} onSchedule={scheduleIdea} onDismiss={dismissIdea} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            <CalendarBacklogView ideas={filteredIdeas} onOpen={setSelected} onSchedule={scheduleIdea} onDismiss={dismissIdea} updateIdea={updateIdea} />
          </TabsContent>
          <TabsContent value="clusters" className="mt-0">
            <ClustersView />
          </TabsContent>
          <TabsContent value="workflow" className="mt-0">
            <WorkflowView />
          </TabsContent>
        </div>
      </Tabs>

      <IdeaDetailDialog idea={selected} onClose={() => setSelected(null)} onUpdate={updateIdea} />
      <ResearchDialog open={researchOpen} onClose={() => setResearchOpen(false)} onCreate={addIdeasFromResearch} />
    </MainLayout>
  );
};

/* ===== Cockpit (KPIs + recent + backlog summary) ===== */
const CockpitView = ({ ideas, allIdeas, onOpen, onSchedule, onDismiss }: {
  ideas: ContentIdea[]; allIdeas: ContentIdea[];
  onOpen: (i: ContentIdea) => void;
  onSchedule: (id: string, date: string) => void;
  onDismiss: (id: string) => void;
}) => {
  const openIdeas = allIdeas.filter((i) => i.status === "Idea").length;
  const plannedMonth = allIdeas.filter((i) => i.status !== "Idea" && i.scheduledDate?.startsWith("2026-05")).length;
  const clustersCovered = new Set(allIdeas.map((i) => i.cluster)).size;
  const waitingApproval = allIdeas.filter((i) => i.status === "Review").length;

  const kpis = [
    { label: "Offene Ideen", value: openIdeas, icon: Lightbulb, hint: "Backlog" },
    { label: "Geplant diesen Monat", value: plannedMonth, icon: CalendarIcon, hint: "Mai 2026" },
    { label: "Cluster-Abdeckung", value: `${clustersCovered}/${topicClusters.length}`, icon: Layers, hint: "Themen aktiv" },
    { label: "Wartet auf Freigabe", value: waitingApproval, icon: CheckCircle2, hint: "Review-Stage" },
  ];

  const backlog = ideas.filter((i) => i.status === "Idea").sort((a, b) => b.priorityScore - a.priorityScore);
  const upcoming = ideas
    .filter((i) => i.scheduledDate)
    .sort((a, b) => (a.scheduledDate! < b.scheduledDate! ? -1 : 1))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="border border-border/60 rounded-xl bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{k.label}</span>
              <k.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground">{k.value}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{k.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border border-border/60 rounded-xl bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Nächste geplante Beiträge</h3>
            <Badge variant="outline" className="text-[10px]">{upcoming.length}</Badge>
          </div>
          <div className="divide-y divide-border/40">
            {upcoming.map((i) => (
              <button key={i.id} onClick={() => onOpen(i)} className="w-full text-left py-2.5 flex items-center justify-between gap-3 hover:bg-muted/30 -mx-2 px-2 rounded-md transition-colors">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{i.title}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span>{i.scheduledDate}</span><span>·</span><span>{i.channel}</span><span>·</span><span>{i.cluster}</span>
                  </div>
                </div>
                <Badge variant="secondary" className={cn("text-[10px] shrink-0", statusColors[i.status])}>{i.status}</Badge>
              </button>
            ))}
            {upcoming.length === 0 && <div className="py-6 text-center text-xs text-muted-foreground">Keine geplanten Beiträge im Filter.</div>}
          </div>
        </div>

        <div className="border border-border/60 rounded-xl bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-1.5"><Inbox className="h-3.5 w-3.5" /> Top Ideen</h3>
            <Badge variant="outline" className="text-[10px]">{backlog.length}</Badge>
          </div>
          <div className="space-y-2">
            {backlog.slice(0, 5).map((i) => (
              <IdeaMiniCard key={i.id} idea={i} onOpen={() => onOpen(i)} onSchedule={onSchedule} onDismiss={onDismiss} />
            ))}
            {backlog.length === 0 && <div className="py-6 text-center text-xs text-muted-foreground">Keine offenen Ideen.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== Calendar + Backlog ===== */
const CalendarBacklogView = ({ ideas, onOpen, onSchedule, onDismiss, updateIdea }: {
  ideas: ContentIdea[];
  onOpen: (i: ContentIdea) => void;
  onSchedule: (id: string, date: string) => void;
  onDismiss: (id: string) => void;
  updateIdea: (id: string, patch: Partial<ContentIdea>) => void;
}) => {
  const [view, setView] = useState<"month" | "week">("month");
  const [cursor, setCursor] = useState(new Date(2026, 4, 1));
  const dragId = useRef<string | null>(null);

  const onDragStart = (id: string) => (e: React.DragEvent) => {
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDrop = (date: Date) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragId.current) return;
    const iso = date.toISOString().slice(0, 10);
    onSchedule(dragId.current, iso);
    dragId.current = null;
  };
  const allowDrop = (e: React.DragEvent) => e.preventDefault();

  const backlog = ideas.filter((i) => i.status === "Idea").sort((a, b) => b.priorityScore - a.priorityScore);
  const scheduled = ideas.filter((i) => i.scheduledDate);

  const monthLabel = cursor.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const buildMonthCells = () => {
    const first = new Date(year, month, 1);
    const start = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < start; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const buildWeekCells = () => {
    const d = new Date(cursor);
    const dow = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - dow);
    return Array.from({ length: 7 }, (_, i) => {
      const x = new Date(d); x.setDate(d.getDate() + i); return x;
    });
  };

  const cells = view === "month" ? buildMonthCells() : buildWeekCells();
  const postsByDate = useMemo(() => {
    const map = new Map<string, ContentIdea[]>();
    scheduled.forEach((p) => {
      if (!p.scheduledDate) return;
      const arr = map.get(p.scheduledDate) || []; arr.push(p); map.set(p.scheduledDate, arr);
    });
    return map;
  }, [scheduled]);

  const move = (delta: number) => {
    if (view === "month") setCursor(new Date(year, month + delta, 1));
    else { const d = new Date(cursor); d.setDate(d.getDate() + delta * 7); setCursor(d); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
      {/* Calendar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(-1)}><ChevronLeft className="h-4 w-4" /></Button>
            <h2 className="text-base font-semibold capitalize min-w-[160px] text-center">{monthLabel}</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <div className="flex gap-1 border border-border/60 rounded-md p-0.5 bg-card">
            <button onClick={() => setView("month")} className={cn("text-xs px-2.5 py-1 rounded", view === "month" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>Monat</button>
            <button onClick={() => setView("week")} className={cn("text-xs px-2.5 py-1 rounded", view === "week" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>Woche</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {allStatuses.map((s) => (
            <Badge key={s} variant="secondary" className={cn("text-[10px] font-normal", statusColors[s])}>{s}</Badge>
          ))}
        </div>

        <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border/40 bg-muted/30">
            {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
              <div key={d} className="px-2 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-center">{d}</div>
            ))}
          </div>
          <div className={cn("grid grid-cols-7", view === "week" && "min-h-[420px]")}>
            {cells.map((date, idx) => {
              const iso = date ? date.toISOString().slice(0, 10) : "";
              const dayPosts = date ? postsByDate.get(iso) || [] : [];
              return (
                <div
                  key={idx}
                  onDragOver={date ? allowDrop : undefined}
                  onDrop={date ? onDrop(date) : undefined}
                  className={cn(
                    "border-r border-b border-border/40 p-1.5 last:border-r-0",
                    view === "month" ? "min-h-[100px]" : "min-h-[420px]",
                    (idx + 1) % 7 === 0 && "border-r-0",
                    !date && "bg-muted/20"
                  )}
                >
                  {date && (
                    <>
                      <div className="text-[11px] text-muted-foreground mb-1">{date.getDate()}</div>
                      <div className="space-y-1">
                        {dayPosts.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => onOpen(p)}
                            className={cn("w-full text-left px-1.5 py-1 rounded text-[10px] leading-tight hover:opacity-80 transition-opacity", statusColors[p.status])}
                            title={p.title}
                          >
                            <div className="font-medium truncate">{p.title}</div>
                            <div className="opacity-70 truncate">{p.channel} · {p.format}</div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Backlog sidebar */}
      <aside className="border border-border/60 rounded-xl bg-card p-4 h-fit lg:sticky lg:top-32">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-1.5"><Inbox className="h-3.5 w-3.5" /> Idea Backlog</h3>
          <Badge variant="outline" className="text-[10px]">{backlog.length}</Badge>
        </div>
        <p className="text-[11px] text-muted-foreground mb-3">Karten in den Kalender ziehen, um sie zu planen.</p>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {backlog.map((i) => (
            <div
              key={i.id}
              draggable
              onDragStart={onDragStart(i.id)}
              className="border border-border/60 rounded-lg p-3 bg-background hover:border-primary/40 transition-colors cursor-grab active:cursor-grabbing group"
            >
              <div className="flex items-start gap-2">
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0 opacity-50 group-hover:opacity-100" />
                <div className="flex-1 min-w-0">
                  <button onClick={() => onOpen(i)} className="text-left text-sm font-medium leading-snug hover:text-primary transition-colors line-clamp-2">{i.title}</button>
                  <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                    <Badge variant="secondary" className="text-[10px]">{i.format}</Badge>
                    <Badge variant="outline" className="text-[10px]">{i.cluster}</Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 flex items-start gap-1">
                    <Lightbulb className="h-3 w-3 mt-0.5 shrink-0 text-amber-500" />{i.rationale}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Target className="h-3 w-3" />{i.priorityScore}</span>
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{i.effort}</span>
                    </div>
                    <div className="flex gap-0.5">
                      <Button size="icon" variant="ghost" className="h-6 w-6" title="Briefing" onClick={() => { toast.success("Briefing generiert"); onOpen(i); }}>
                        <FileText className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive" title="Verwerfen" onClick={() => onDismiss(i.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {backlog.length === 0 && <div className="py-8 text-center text-xs text-muted-foreground">Backlog ist leer 🎉</div>}
        </div>
      </aside>
    </div>
  );
};

const IdeaMiniCard = ({ idea, onOpen, onSchedule, onDismiss }: {
  idea: ContentIdea;
  onOpen: () => void;
  onSchedule: (id: string, date: string) => void;
  onDismiss: (id: string) => void;
}) => (
  <div className="border border-border/60 rounded-lg p-2.5 bg-background">
    <button onClick={onOpen} className="text-left w-full">
      <div className="text-xs font-medium leading-snug line-clamp-2">{idea.title}</div>
      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
        <Badge variant="secondary" className="text-[10px]">{idea.format}</Badge>
        <span className="text-[10px] text-muted-foreground">P{idea.priorityScore}</span>
      </div>
    </button>
    <div className="flex gap-1 mt-2">
      <Button size="sm" variant="outline" className="h-6 text-[10px] flex-1" onClick={() => onSchedule(idea.id, new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10))}>
        <CalendarIcon className="h-3 w-3 mr-1" />Planen
      </Button>
      <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDismiss(idea.id)}>
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  </div>
);

/* ===== Topic Clusters ===== */
const ClustersView = () => {
  const [items, setItems] = useState<TopicCluster[]>(topicClusters);
  const [editing, setEditing] = useState<TopicCluster | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Themen-Cluster</h2>
        <Button size="sm" onClick={() => setEditing({ id: `c${Date.now()}`, name: "", priority: "medium", audience: "", frequency: "", formats: [], businessRelevance: "", postCount: 0 })}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Neuer Cluster
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((c) => (
          <button key={c.id} onClick={() => setEditing(c)} className="text-left border border-border/60 rounded-xl bg-card p-4 hover:border-primary/40 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm">{c.name}</h3>
              <Badge variant="secondary" className={cn("text-[10px]", priorityColors[c.priority])}>{c.priority}</Badge>
            </div>
            <div className="space-y-1.5 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5"><Users className="h-3 w-3" />{c.audience}</div>
              <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{c.frequency}</div>
              <div className="flex items-center gap-1.5"><TrendingUp className="h-3 w-3" />{c.businessRelevance}</div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border/40">
              {c.formats.map((f) => <Badge key={f} variant="outline" className="text-[10px]">{f}</Badge>)}
            </div>
            <div className="text-[10px] text-muted-foreground mt-2">{c.postCount} Beiträge</div>
          </button>
        ))}
      </div>
      <ClusterEditorDialog
        cluster={editing}
        onClose={() => setEditing(null)}
        onSave={(c) => {
          setItems((prev) => prev.some((x) => x.id === c.id) ? prev.map((x) => (x.id === c.id ? c : x)) : [...prev, c]);
          setEditing(null);
          toast.success("Cluster gespeichert");
        }}
      />
    </div>
  );
};

const ClusterEditorDialog = ({ cluster, onClose, onSave }: { cluster: TopicCluster | null; onClose: () => void; onSave: (c: TopicCluster) => void }) => {
  const [draft, setDraft] = useState<TopicCluster | null>(cluster);
  useEffect(() => { setDraft(cluster); }, [cluster]);
  if (!cluster || !draft) return null;
  return (
    <Dialog open={!!cluster} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{cluster.name ? "Cluster bearbeiten" : "Neuer Cluster"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label className="text-xs">Name</Label><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Priorität</Label>
              <Select value={draft.priority} onValueChange={(v) => setDraft({ ...draft, priority: v as Priority })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">low</SelectItem><SelectItem value="medium">medium</SelectItem><SelectItem value="high">high</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Frequenz</Label><Input value={draft.frequency} onChange={(e) => setDraft({ ...draft, frequency: e.target.value })} /></div>
          </div>
          <div><Label className="text-xs">Zielgruppe</Label><Input value={draft.audience} onChange={(e) => setDraft({ ...draft, audience: e.target.value })} /></div>
          <div><Label className="text-xs">Business-Relevanz</Label><Input value={draft.businessRelevance} onChange={(e) => setDraft({ ...draft, businessRelevance: e.target.value })} /></div>
          <div>
            <Label className="text-xs">Bevorzugte Formate</Label>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {allFormats.map((f) => {
                const on = draft.formats.includes(f);
                return (
                  <button key={f} onClick={() => setDraft({ ...draft, formats: on ? draft.formats.filter((x) => x !== f) : [...draft.formats, f] })}
                    className={cn("text-[11px] px-2 py-1 rounded-md border", on ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60 text-muted-foreground")}>
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Abbrechen</Button>
          <Button onClick={() => onSave(draft)}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ===== Workflow ===== */
const WorkflowView = () => (
  <div className="space-y-4">
    <div className="border border-border/60 rounded-xl bg-card p-5">
      <h2 className="text-base font-semibold mb-1">Content-Workflow</h2>
      <p className="text-xs text-muted-foreground mb-4">Vom Research-Auftrag bis zur Publikation — jede Idee durchläuft diese Stationen.</p>
      <div className="flex flex-wrap items-center gap-2">
        {WORKFLOW_STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="border border-border/60 rounded-lg px-3 py-2 bg-background text-xs font-medium">
              <span className="text-[10px] text-muted-foreground mr-1">{i + 1}</span>{s}
            </div>
            {i < WORKFLOW_STEPS.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {[
        { title: "Research", text: "Trends, Foren, Customer Questions strukturiert auswerten." },
        { title: "Briefing", text: "AI-generierte Hooks, Strukturen und CTAs pro Idee." },
        { title: "Production", text: "Übergabe an den Production-Flow per Klick." },
      ].map((b) => (
        <div key={b.title} className="border border-border/60 rounded-xl bg-card p-4">
          <div className="text-sm font-semibold mb-1">{b.title}</div>
          <div className="text-xs text-muted-foreground">{b.text}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ===== Idea Detail Dialog ===== */
const IdeaDetailDialog = ({ idea, onClose, onUpdate }: {
  idea: ContentIdea | null; onClose: () => void;
  onUpdate: (id: string, patch: Partial<ContentIdea>) => void;
}) => {
  if (!idea) return null;
  const briefing = idea.briefing || {
    hook: "—", keyMessage: "—", structure: ["Einleitung", "Hauptteil", "Praxisbeispiel", "CTA"],
    cta: "—", visualIdea: "—", notes: "—",
  };
  return (
    <Dialog open={!!idea} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-2 flex-wrap">
            <Badge variant="secondary" className={cn("text-[10px]", statusColors[idea.status])}>{idea.status}</Badge>
            <Badge variant="outline" className="text-[10px]">{idea.cluster}</Badge>
            <Badge variant="outline" className="text-[10px]">{idea.format}</Badge>
            <Badge variant="outline" className="text-[10px]">{idea.channel}</Badge>
          </div>
          <DialogTitle className="text-lg pt-1">{idea.title}</DialogTitle>
          {idea.description && <DialogDescription>{idea.description}</DialogDescription>}
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <Field label="Status">
            <Select value={idea.status} onValueChange={(v) => onUpdate(idea.id, { status: v as Status })}>
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
              <SelectContent>{allStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Verantwortlich">
            <Select value={idea.owner || ""} onValueChange={(v) => onUpdate(idea.id, { owner: v })}>
              <SelectTrigger className="h-8"><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>{owners.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Geplantes Datum">
            <Input type="date" className="h-8" value={idea.scheduledDate || ""} onChange={(e) => onUpdate(idea.id, { scheduledDate: e.target.value })} />
          </Field>
          <Field label="Kanal">
            <Select value={idea.channel} onValueChange={(v) => onUpdate(idea.id, { channel: v as Channel })}>
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
              <SelectContent>{channels.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Haupt-Keyword"><Input className="h-8" value={idea.mainKeyword} onChange={(e) => onUpdate(idea.id, { mainKeyword: e.target.value })} /></Field>
          <Field label="Priority Score / Effort"><div className="flex items-center gap-2 h-8"><Badge variant="secondary">{idea.priorityScore}</Badge><Badge variant="outline">{idea.effort}</Badge></div></Field>
          <Field label="Quelle / Inspiration"><div className="h-8 flex items-center text-muted-foreground">{idea.source}</div></Field>
          <Field label="Zielgruppe"><div className="h-8 flex items-center text-muted-foreground">{idea.audience || "—"}</div></Field>
        </div>

        <div>
          <Label className="text-xs">Keywords</Label>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {idea.keywords.map((k) => <Badge key={k} variant="outline" className="text-[10px]">{k}</Badge>)}
          </div>
        </div>

        <div className="border border-border/60 rounded-xl bg-muted/20 p-4 space-y-2.5">
          <div className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /><h4 className="text-sm font-semibold">AI-Briefing</h4></div>
          <BriefingRow label="Hook" value={briefing.hook} />
          <BriefingRow label="Key Message" value={briefing.keyMessage} />
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Struktur</div>
            <ol className="list-decimal list-inside text-xs space-y-0.5 text-foreground/90">
              {briefing.structure.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
          <BriefingRow label="CTA" value={briefing.cta} />
          <BriefingRow label="Visual-Idee" value={briefing.visualIdea} />
          <BriefingRow label="Produktions-Notizen" value={briefing.notes} />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose}>Schließen</Button>
          <Button variant="outline" onClick={() => toast.success("Briefing aktualisiert")}><Sparkles className="h-3.5 w-3.5 mr-1.5" />Briefing neu generieren</Button>
          <Button onClick={() => { onUpdate(idea.id, { status: "In Production" }); toast.success("An Production-Flow gesendet"); onClose(); }}>
            <Send className="h-3.5 w-3.5 mr-1.5" />Send to Content Production Flow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</Label>
    <div className="mt-1">{children}</div>
  </div>
);

const BriefingRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</div>
    <div className="text-xs text-foreground/90">{value}</div>
  </div>
);

/* ===== Research Dialog ===== */
const RESEARCH_SOURCES = ["LinkedIn", "Instagram", "Forums", "Industry media", "Customer questions", "Manual links"];
const ANALYSIS_FOCI = ["Trends", "Frequently asked questions", "Relevant discussions", "Keywords", "Content gaps", "Format ideas"];

const ResearchDialog = ({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (i: ContentIdea[]) => void }) => {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [sources, setSources] = useState<string[]>(["LinkedIn", "Industry media"]);
  const [foci, setFoci] = useState<string[]>(["Trends", "Keywords"]);
  const [cluster, setCluster] = useState<string>(topicClusters[0].name);
  const [manualLinks, setManualLinks] = useState("");
  const [running, setRunning] = useState(false);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const run = () => {
    if (!name || !goal) { toast.error("Name und Ziel sind erforderlich"); return; }
    setRunning(true);
    setTimeout(() => {
      const newIdeas: ContentIdea[] = [
        {
          id: `r${Date.now()}1`,
          title: `${cluster}: 3 Trends, die ${name} aufgreifen sollte`,
          rationale: `Aus Research "${name}" — ${foci.join(", ")} via ${sources.join(", ")}.`,
          source: sources.join(" + "),
          format: "Article", channel: "Blog", cluster,
          keywords: ["Trend", "Insight"], mainKeyword: `${cluster} Trends`,
          priorityScore: 82, effort: "M", status: "Idea",
        },
        {
          id: `r${Date.now()}2`,
          title: `FAQ-Carousel: Häufigste Fragen zu ${cluster}`,
          rationale: `Customer-Questions-Cluster zeigt 5 wiederkehrende Fragen.`,
          source: "Customer Questions",
          format: "Carousel", channel: "LinkedIn", cluster,
          keywords: ["FAQ", cluster], mainKeyword: `${cluster} FAQ`,
          priorityScore: 76, effort: "S", status: "Idea",
        },
        {
          id: `r${Date.now()}3`,
          title: `Content-Gap: Bisher keine Reels zu ${cluster}`,
          rationale: `Analyse identifiziert Format-Lücke im Reel-Segment.`,
          source: "Format gap analysis",
          format: "Reel", channel: "Instagram", cluster,
          keywords: ["Reel", "Mobile"], mainKeyword: `${cluster} Reel`,
          priorityScore: 68, effort: "S", status: "Idea",
        },
      ];
      onCreate(newIdeas);
      setRunning(false); onClose();
      setName(""); setGoal(""); setManualLinks("");
      toast.success(`${newIdeas.length} neue Ideen im Backlog`);
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Start Research</DialogTitle>
          <DialogDescription>Strukturierte Auswertung deiner Quellen → priorisierte Content-Ideen.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Research-Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. Q3 AI-Trends" /></div>
            <div>
              <Label className="text-xs">Topic Cluster</Label>
              <Select value={cluster} onValueChange={setCluster}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{topicClusters.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label className="text-xs">Ziel der Recherche</Label><Textarea rows={2} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Was möchtest du herausfinden?" /></div>
          <div>
            <Label className="text-xs">Quellen</Label>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {RESEARCH_SOURCES.map((s) => {
                const on = sources.includes(s);
                return <button key={s} onClick={() => toggle(sources, setSources, s)} className={cn("text-[11px] px-2.5 py-1 rounded-md border", on ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60 text-muted-foreground")}>{s}</button>;
              })}
            </div>
          </div>
          {sources.includes("Manual links") && (
            <div><Label className="text-xs">Manuelle Links (eine pro Zeile)</Label><Textarea rows={3} value={manualLinks} onChange={(e) => setManualLinks(e.target.value)} /></div>
          )}
          <div>
            <Label className="text-xs">Analyse-Fokus</Label>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {ANALYSIS_FOCI.map((s) => {
                const on = foci.includes(s);
                return <button key={s} onClick={() => toggle(foci, setFoci, s)} className={cn("text-[11px] px-2.5 py-1 rounded-md border", on ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60 text-muted-foreground")}>{s}</button>;
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Abbrechen</Button>
          <Button onClick={run} disabled={running}>
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />{running ? "Recherche läuft…" : "Research starten"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditorialCockpit;
