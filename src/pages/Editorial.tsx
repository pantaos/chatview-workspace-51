import { useState, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Sparkles,
  Calendar as CalendarIcon,
  Repeat,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Plus,
  Globe,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Wand2,
  Lightbulb,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  mockExistingPosts,
  mockTopicClusters,
  mockSuggestions,
  mockPlannedPosts,
  stageColors,
  allFormats,
  type ContentSuggestion,
  type ExistingPost,
  type PlannedPost,
  type PostFormat,
  type ApprovalStage,
} from "@/data/editorialData";

const APPROVAL_STAGES: ApprovalStage[] = ["Draft", "SEO Check", "Legal/GEO", "Final Review", "Approved", "Published"];

const Editorial = () => {
  const [activeTab, setActiveTab] = useState("library");

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Editorial Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bestehende Beiträge recyceln, Vorschläge generieren, Redaktionsplan erstellen und Übergaben verwalten.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent p-0 h-auto gap-6 border-b border-border/40 w-full justify-start rounded-none mb-6 overflow-x-auto scrollbar-hide">
            {[
              { v: "library", label: "Content-Bibliothek" },
              { v: "suggestions", label: "Vorschläge" },
              { v: "plan", label: "Redaktionsplan" },
              { v: "convert", label: "Format-Konvertierung" },
            ].map((t) => (
              <TabsTrigger
                key={t.v}
                value={t.v}
                className="px-0 pb-2 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-foreground whitespace-nowrap"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="library"><LibraryTab /></TabsContent>
          <TabsContent value="suggestions"><SuggestionsTab /></TabsContent>
          <TabsContent value="plan"><PlanTab /></TabsContent>
          <TabsContent value="convert"><ConvertTab /></TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

/* ============================================================
   TAB 1: Content Library
   ============================================================ */
const LibraryTab = () => {
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return mockExistingPosts.filter((p) => {
      const matchesSearch = !search.trim() || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesTopic = topicFilter === "all" || p.topic === topicFilter;
      return matchesSearch && matchesTopic;
    });
  }, [search, topicFilter]);

  const topics = Array.from(new Set(mockExistingPosts.map((p) => p.topic)));

  return (
    <div className="space-y-6">
      {/* Topic clusters */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Themen-Cluster
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {mockTopicClusters.map((c) => (
            <button
              key={c.id}
              onClick={() => setTopicFilter(c.name)}
              className={cn(
                "border rounded-xl p-3 text-left bg-card hover:shadow-sm transition-all",
                topicFilter === c.name ? "border-primary ring-1 ring-primary/30" : "border-border/60"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground truncate">{c.name}</span>
                {c.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500 shrink-0" />}
                {c.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500 shrink-0" />}
                {c.trend === "flat" && <Minus className="h-3 w-3 text-muted-foreground shrink-0" />}
              </div>
              <div className="text-[11px] text-muted-foreground">{c.postCount} Posts · {c.lastUsed}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Beiträge durchsuchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={topicFilter} onValueChange={setTopicFilter}>
          <SelectTrigger className="w-full sm:w-48 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Themen</SelectItem>
            {topics.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Posts list */}
      <div className="border border-border/60 rounded-xl bg-card divide-y divide-border/40">
        {filtered.map((p) => (
          <div key={p.id} className="p-4 hover:bg-muted/30 transition-colors group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                  <Badge variant="secondary" className="text-[10px]">{p.format}</Badge>
                  <Badge variant="outline" className="text-[10px]">{p.topic}</Badge>
                  {p.performance === "high" && <Badge className="text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15">High Performer</Badge>}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{p.excerpt}</p>
                <div className="text-[11px] text-muted-foreground mt-1">Veröffentlicht: {p.publishedAt}</div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  <Repeat className="h-3 w-3 mr-1" /> Recyceln
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  <Wand2 className="h-3 w-3 mr-1" /> Konvertieren
                </Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">Keine Beiträge gefunden.</div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   TAB 2: Suggestions
   ============================================================ */
const SuggestionsTab = () => {
  const [includeResearch, setIncludeResearch] = useState(true);
  const [planTarget, setPlanTarget] = useState<ContentSuggestion | null>(null);

  return (
    <div className="space-y-6">
      {/* Generator card */}
      <div className="border border-border/60 rounded-xl bg-card p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">KI-Vorschläge generieren</h3>
            <p className="text-xs text-muted-foreground">Basierend auf deiner Content-Bibliothek und Themen-Performance.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="research" checked={includeResearch} onCheckedChange={(c) => setIncludeResearch(!!c)} />
            <Label htmlFor="research" className="text-xs font-normal cursor-pointer flex items-center gap-1">
              <Globe className="h-3 w-3" /> Aktuelle Web-Recherche einbeziehen
            </Label>
          </div>
          <div className="flex-1" />
          <Button size="sm" onClick={() => toast.success("Neue Vorschläge generiert")}>
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Generieren
          </Button>
        </div>
      </div>

      {/* Suggestions list */}
      <div className="space-y-3">
        {mockSuggestions.map((s) => (
          <div key={s.id} className="border border-border/60 rounded-xl bg-card p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                  <Badge variant="secondary" className="text-[10px]">{s.format}</Badge>
                  <Badge variant="outline" className="text-[10px]">{s.topic}</Badge>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-2">
                  <Lightbulb className="h-3 w-3 mt-0.5 shrink-0 text-amber-500" />
                  <span>{s.rationale}</span>
                </div>
                {s.freshInsight && (
                  <div className="flex items-start gap-1.5 text-xs text-foreground/80 bg-muted/40 rounded-md p-2 mt-2">
                    <Globe className="h-3 w-3 mt-0.5 shrink-0 text-blue-500" />
                    <span><span className="font-medium">Aktuelle Erkenntnis:</span> {s.freshInsight}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
              <div className="text-[11px] text-muted-foreground">
                Basierend auf {s.basedOnPostIds.length} bestehende{s.basedOnPostIds.length === 1 ? "m" : "n"} Beitrag
                {s.estimatedDate && ` · Vorschlag: ${s.estimatedDate}`}
              </div>
              <div className="flex gap-1.5">
                <Button size="sm" variant="ghost" className="h-7 text-xs">Verwerfen</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <Globe className="h-3 w-3 mr-1" /> Recherchieren
                </Button>
                <Button size="sm" className="h-7 text-xs" onClick={() => setPlanTarget(s)}>
                  <CalendarIcon className="h-3 w-3 mr-1" /> In Plan übernehmen
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddToPlanDialog
        suggestion={planTarget}
        open={!!planTarget}
        onClose={() => setPlanTarget(null)}
      />
    </div>
  );
};

/* ============================================================
   TAB 3: Plan (Calendar)
   ============================================================ */
const PlanTab = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1)); // May 2026
  const [generateOpen, setGenerateOpen] = useState(false);
  const [selected, setSelected] = useState<PlannedPost | null>(null);

  const monthLabel = currentMonth.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  // Build calendar grid
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const postsByDate = useMemo(() => {
    const map = new Map<string, PlannedPost[]>();
    mockPlannedPosts.forEach((p) => {
      const arr = map.get(p.scheduledDate) || [];
      arr.push(p);
      map.set(p.scheduledDate, arr);
    });
    return map;
  }, []);

  const fmtIso = (d: Date) => d.toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-base font-semibold capitalize min-w-[160px] text-center">{monthLabel}</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setGenerateOpen(true)}>
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Plan generieren
          </Button>
          <Button size="sm">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Beitrag hinzufügen
          </Button>
        </div>
      </div>

      {/* Stage legend */}
      <div className="flex flex-wrap gap-1.5">
        {APPROVAL_STAGES.map((s) => (
          <Badge key={s} variant="secondary" className={cn("text-[10px] font-normal", stageColors[s])}>{s}</Badge>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border/40 bg-muted/30">
          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
            <div key={d} className="px-2 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((date, idx) => {
            const iso = date ? fmtIso(date) : "";
            const dayPosts = date ? postsByDate.get(iso) || [] : [];
            return (
              <div
                key={idx}
                className={cn(
                  "min-h-[96px] border-r border-b border-border/40 p-1.5 last:border-r-0",
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
                          onClick={() => setSelected(p)}
                          className={cn(
                            "w-full text-left px-1.5 py-1 rounded text-[10px] leading-tight truncate",
                            stageColors[p.stage],
                            "hover:opacity-80 transition-opacity"
                          )}
                          title={p.title}
                        >
                          {p.title}
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

      <PlannedPostDialog post={selected} onClose={() => setSelected(null)} />
      <GeneratePlanDialog open={generateOpen} onClose={() => setGenerateOpen(false)} />
    </div>
  );
};

/* ============================================================
   TAB 4: Format Conversion
   ============================================================ */
const ConvertTab = () => {
  const [sourceId, setSourceId] = useState<string>(mockExistingPosts[0].id);
  const [targetFormat, setTargetFormat] = useState<PostFormat>("Kolumne");
  const [includeFresh, setIncludeFresh] = useState(true);
  const [output, setOutput] = useState<string>("");

  const sourcePost = mockExistingPosts.find((p) => p.id === sourceId)!;

  const handleConvert = () => {
    setOutput(
      `# ${sourcePost.title} – neu als ${targetFormat}\n\n${sourcePost.excerpt}\n\n${
        includeFresh ? "(Mit aktualisierten Marktdaten und Recherche-Updates aus dem Web.)\n\n" : ""
      }[Vom KI-Modell generierter Entwurf im Format '${targetFormat}'. Original-Beitrag wurde stilistisch und strukturell angepasst…]`
    );
    toast.success(`Beitrag in '${targetFormat}' konvertiert`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Source */}
      <div className="border border-border/60 rounded-xl bg-card p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Quell-Beitrag</h3>
          <p className="text-xs text-muted-foreground">Wähle einen bestehenden Beitrag zur Umwandlung.</p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Beitrag</Label>
          <Select value={sourceId} onValueChange={setSourceId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {mockExistingPosts.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.title} ({p.format})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/40 rounded-md p-3">
          <div className="font-medium text-foreground mb-1">{sourcePost.title}</div>
          <div className="flex gap-1.5 mb-2">
            <Badge variant="secondary" className="text-[10px]">{sourcePost.format}</Badge>
            <Badge variant="outline" className="text-[10px]">{sourcePost.topic}</Badge>
          </div>
          <p>{sourcePost.excerpt}</p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Ziel-Format</Label>
          <Select value={targetFormat} onValueChange={(v) => setTargetFormat(v as PostFormat)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {allFormats.filter((f) => f !== sourcePost.format).map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="fresh" checked={includeFresh} onCheckedChange={(c) => setIncludeFresh(!!c)} />
          <Label htmlFor="fresh" className="text-xs font-normal cursor-pointer flex items-center gap-1">
            <Globe className="h-3 w-3" /> Aktuelle Recherche einbeziehen
          </Label>
        </div>

        <Button onClick={handleConvert} className="w-full">
          <Wand2 className="h-3.5 w-3.5 mr-1.5" /> In {targetFormat} umwandeln
        </Button>
      </div>

      {/* Output */}
      <div className="border border-border/60 rounded-xl bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Ergebnis</h3>
            <p className="text-xs text-muted-foreground">Vorschau des umgewandelten Beitrags.</p>
          </div>
          {output && (
            <Button size="sm" variant="outline" className="h-7 text-xs">
              <CalendarIcon className="h-3 w-3 mr-1" /> In Plan übernehmen
            </Button>
          )}
        </div>
        {output ? (
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[280px] text-xs font-mono" />
        ) : (
          <div className="border border-dashed border-border/60 rounded-lg p-8 text-center text-xs text-muted-foreground">
            Wähle ein Ziel-Format und klicke auf "Umwandeln", um eine Vorschau zu erhalten.
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   Dialogs
   ============================================================ */
const AddToPlanDialog = ({
  suggestion,
  open,
  onClose,
}: {
  suggestion: ContentSuggestion | null;
  open: boolean;
  onClose: () => void;
}) => {
  const [date, setDate] = useState(suggestion?.estimatedDate || "");
  const [stages, setStages] = useState<ApprovalStage[]>(["Draft", "SEO Check", "Legal/GEO", "Final Review"]);

  const toggleStage = (s: ApprovalStage) => {
    setStages((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  if (!suggestion) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>In Redaktionsplan übernehmen</DialogTitle>
          <DialogDescription>{suggestion.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Geplantes Datum</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Approval-Gates
            </Label>
            <p className="text-xs text-muted-foreground">Wähle die Übergaben, die vor Veröffentlichung durchlaufen werden müssen.</p>
            <div className="space-y-2 pt-1">
              {APPROVAL_STAGES.filter((s) => s !== "Approved" && s !== "Published").map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <Checkbox
                    id={`stage-${s}`}
                    checked={stages.includes(s)}
                    onCheckedChange={() => toggleStage(s)}
                    disabled={s === "Draft"}
                  />
                  <Label htmlFor={`stage-${s}`} className="text-sm font-normal cursor-pointer">{s}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Abbrechen</Button>
          <Button onClick={() => { toast.success("Zum Redaktionsplan hinzugefügt"); onClose(); }}>
            Hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PlannedPostDialog = ({ post, onClose }: { post: PlannedPost | null; onClose: () => void }) => {
  if (!post) return null;
  const stageIdx = APPROVAL_STAGES.indexOf(post.stage);

  return (
    <Dialog open={!!post} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{post.title}</DialogTitle>
          <DialogDescription>{post.scheduledDate} · {post.format} · {post.topic}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-xs text-muted-foreground">Verantwortlich</Label>
            <div className="text-sm">{post.assignee || "—"}</div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Approval-Pipeline</Label>
            <div className="space-y-2">
              {APPROVAL_STAGES.map((s, i) => {
                const completed = i < stageIdx;
                const current = i === stageIdx;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0",
                      completed && "bg-primary text-primary-foreground",
                      current && "bg-primary/20 text-primary border border-primary",
                      !completed && !current && "bg-muted text-muted-foreground"
                    )}>
                      {completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <span className={cn("text-sm", current && "font-medium text-foreground", !current && "text-muted-foreground")}>
                      {s}
                    </span>
                    {current && (
                      <Badge className={cn("text-[10px] ml-auto", stageColors[s])}>aktuell</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Schließen</Button>
          <Button onClick={() => { toast.success(`An nächste Stufe übergeben`); onClose(); }}>
            <ArrowRight className="h-3.5 w-3.5 mr-1.5" /> An nächste Stufe übergeben
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const GeneratePlanDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [from, setFrom] = useState("2026-05-01");
  const [to, setTo] = useState("2026-05-31");
  const [postsPerWeek, setPostsPerWeek] = useState("2");
  const [includeResearch, setIncludeResearch] = useState(true);
  const [includeApprovals, setIncludeApprovals] = useState(true);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Redaktionsplan generieren
          </DialogTitle>
          <DialogDescription>
            KI erstellt einen vollständigen Plan basierend auf deiner Content-Bibliothek.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Von</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Bis</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Beiträge pro Woche</Label>
            <Select value={postsPerWeek} onValueChange={setPostsPerWeek}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["1", "2", "3", "4", "5"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/40">
            <div className="flex items-center gap-2">
              <Checkbox id="gen-research" checked={includeResearch} onCheckedChange={(c) => setIncludeResearch(!!c)} />
              <Label htmlFor="gen-research" className="text-sm font-normal cursor-pointer">
                Aktuelle Web-Recherche einbeziehen
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="gen-app" checked={includeApprovals} onCheckedChange={(c) => setIncludeApprovals(!!c)} />
              <Label htmlFor="gen-app" className="text-sm font-normal cursor-pointer">
                Standard Approval-Gates anwenden (SEO, Legal/GEO, Final)
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Abbrechen</Button>
          <Button onClick={() => { toast.success("Redaktionsplan generiert"); onClose(); }}>
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Generieren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Editorial;
