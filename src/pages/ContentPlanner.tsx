import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AdminConfig, { ADMIN_MODULES, AdminModuleId, AdminPublishBar } from "@/components/content-planner/AdminConfig";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Compass,
  CalendarRange,
  FileSearch,
  Package,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  Linkedin,
  Instagram,
  FileText,
  Video,
  Loader2,
  Check,
  Eye,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type StepId = "calendar" | "logic" | "suggestions" | "briefing" | "package";

const STEPS: { id: StepId; n: number; title: string; subtitle: string; icon: any }[] = [
  { id: "calendar", n: 1, title: "Kalender befüllen", subtitle: "Zeitraum & Themenfelder", icon: CalendarDays },
  { id: "logic", n: 2, title: "Themenlogik & Signale", subtitle: "Saisonale Regeln & Trends", icon: Compass },
  { id: "suggestions", n: 3, title: "Vorschlagskalender", subtitle: "Konkrete Themen", icon: CalendarRange },
  { id: "briefing", n: 4, title: "Themenanalyse & Briefing", subtitle: "Analyse & Grundlage", icon: FileSearch },
  { id: "package", n: 5, title: "Content-Paket erstellen", subtitle: "Master + Ableitungen", icon: Package },
];

const TOPIC_FIELDS = ["KFZ", "Unfall", "Haftpflicht", "Hausrat", "Rechtsschutz", "Tierhalter"];
const CHANNELS = ["Website / Blog", "LinkedIn", "Instagram", "Newsletter", "YouTube"];
const TARGET_GROUPS = ["Privatkunden", "Gewerbe", "Junge Familien", "Senioren", "Selbstständige"];

interface Suggestion {
  id: string;
  date: string;
  topic: string;
  field: string;
  channel: string;
  score: number;
  reason: string;
  status: "Vorschlag" | "In Prüfung" | "Freigegeben";
}

const INITIAL_SUGGESTIONS: Suggestion[] = [
  { id: "s1", date: "06. Jan", topic: "Einbruchschutz im Winter", field: "Hausrat", channel: "Blog", score: 94, reason: "Saisonaler Peak + steigendes Google-Trends-Signal in der Region.", status: "Vorschlag" },
  { id: "s2", date: "13. Jan", topic: "Haftpflicht 2026: Was sich ändert", field: "Haftpflicht", channel: "LinkedIn", score: 91, reason: "Gesetzesänderung + hohe strategische Priorität von HDI.", status: "Vorschlag" },
  { id: "s3", date: "20. Jan", topic: "Winterreifen-Pflicht & KFZ-Schutz", field: "KFZ", channel: "Instagram", score: 88, reason: "Wiederkehrender saisonaler Anlass mit hoher Reichweite.", status: "Vorschlag" },
  { id: "s4", date: "27. Jan", topic: "Unfallversicherung für Familien", field: "Unfall", channel: "Newsletter", score: 82, reason: "Passende Zielgruppe + relevante Unterthemen identifiziert.", status: "Vorschlag" },
];

const BRIEFING_TRENDS = [
  { topic: "Smart-Home Sicherheit", momentum: "+38%" },
  { topic: "Versicherung & Förderung", momentum: "+21%" },
  { topic: "Nachbarschaftshilfe Winter", momentum: "+12%" },
];

const BRIEFING_QUESTIONS = [
  "Welcher Einbruchschutz wird von der Versicherung gefördert?",
  "Was muss ich nach einem Einbruch sofort tun?",
  "Bin ich auch auf Reisen über die Hausratversicherung geschützt?",
];

const DERIVATIVES = [
  { icon: Linkedin, label: "LinkedIn Post", desc: "Pointierter Hook + Karussell-Idee" },
  { icon: Instagram, label: "Instagram Reel", desc: "Script + 3 Bildideen" },
  { icon: Video, label: "Video-Script", desc: "Optional: 45-Sekunden-Teaser" },
  { icon: FileText, label: "FAQ & Teaser", desc: "Newsletter-Snippet + FAQ-Block" },
];

const statusStyles: Record<Suggestion["status"], string> = {
  Vorschlag: "bg-muted text-muted-foreground",
  "In Prüfung": "bg-amber-100 text-amber-700",
  Freigegeben: "bg-emerald-100 text-emerald-700",
};

const ContentPlanner = () => {
  const [activeStep, setActiveStep] = useState<StepId>("calendar");
  const [completed, setCompleted] = useState<Set<StepId>>(new Set());

  // Admin mode
  const [adminMode, setAdminMode] = useState(false);
  const [adminModule, setAdminModule] = useState<AdminModuleId | "preview">("audiences");

  // Step 1 state
  const [period, setPeriod] = useState("Q1 2026");
  const [fields, setFields] = useState<string[]>(["Hausrat", "Haftpflicht", "KFZ"]);
  const [channels, setChannels] = useState<string[]>(["Blog", "LinkedIn"]);
  const [targets, setTargets] = useState<string[]>(["Privatkunden"]);
  const [calendarFilled, setCalendarFilled] = useState(false);
  const [filling, setFilling] = useState(false);

  const fillCalendar = () => {
    setFilling(true);
    setCalendarFilled(false);
    setTimeout(() => {
      setFilling(false);
      setCalendarFilled(true);
      toast.success("Kalender automatisch befüllt");
    }, 1600);
  };

  // Step 2 state
  const [useSeasonal, setUseSeasonal] = useState(true);
  const [useTrends, setUseTrends] = useState(true);
  const [usePriorities, setUsePriorities] = useState(true);

  // Step 3 state
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);
  const [generating, setGenerating] = useState(false);

  // Step 4 state
  const [selectedTopic, setSelectedTopic] = useState<Suggestion | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [briefingReady, setBriefingReady] = useState(false);

  // Step 5 state
  const [building, setBuilding] = useState(false);
  const [packageReady, setPackageReady] = useState(false);

  const stepIndex = STEPS.findIndex((s) => s.id === activeStep);

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) =>
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const goTo = (id: StepId) => setActiveStep(id);

  const completeAndNext = () => {
    setCompleted((prev) => new Set(prev).add(activeStep));
    const next = STEPS[stepIndex + 1];
    if (next) setActiveStep(next.id);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setSuggestions(INITIAL_SUGGESTIONS);
      toast.success("Vorschlagskalender aktualisiert");
    }, 1400);
  };

  const cycleStatus = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const order: Suggestion["status"][] = ["Vorschlag", "In Prüfung", "Freigegeben"];
        const next = order[(order.indexOf(s.status) + 1) % order.length];
        return { ...s, status: next };
      })
    );
  };

  const pickTopic = (s: Suggestion) => {
    setSelectedTopic(s);
    setBriefingReady(false);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setBriefingReady(true);
    }, 1600);
  };

  const buildPackage = () => {
    setBuilding(true);
    setPackageReady(false);
    setTimeout(() => {
      setBuilding(false);
      setPackageReady(true);
      toast.success("Content-Paket erstellt – bereit zur finalen Freigabe");
    }, 1800);
  };

  return (
    <MainLayout mobileTitle="Content-Planung">
      <div className="min-h-full bg-[#F8F9FD]">
        {/* Header */}
        <div className="px-6 md:px-10 pt-8 pb-6 max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                <Sparkles className="h-4 w-4" />
                PANTA OS
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                {adminMode ? "Content-Planung · Admin" : "KI-gestützte Content-Planung"}
              </h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">
                {adminMode
                  ? "Pflege die redaktionelle Intelligenz – Zielgruppen, Themen, Regeln & Signale – im Look des echten Kalenders."
                  : "Von der Kalender-Vorbefüllung bis zum kanalübergreifenden Content-Paket – mit Human-in-the-loop in jedem Schritt."}
              </p>
            </div>
            <label className={cn(
              "flex items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 cursor-pointer transition-colors",
              adminMode ? "border-primary ring-1 ring-primary" : "border-border"
            )}>
              <Settings2 className={cn("h-4 w-4", adminMode ? "text-primary" : "text-muted-foreground")} />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground leading-tight">Admin-Modus</p>
                <p className="text-[11px] text-muted-foreground leading-tight">Konfiguration & Regeln</p>
              </div>
              <Switch checked={adminMode} onCheckedChange={setAdminMode} className="ml-1" />
            </label>
          </div>
        </div>

        {/* Admin module nav */}
        {adminMode && (
          <div className="px-6 md:px-10 max-w-6xl mx-auto">
            <div className="flex items-stretch gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setAdminModule("preview")}
                className={cn(
                  "min-w-[140px] text-left rounded-xl border p-3 transition-all bg-white",
                  adminModule === "preview" ? "border-primary ring-1 ring-primary shadow-sm" : "border-border hover:border-primary/40"
                )}
              >
                <Eye className={cn("h-4 w-4", adminModule === "preview" ? "text-primary" : "text-muted-foreground")} />
                <p className="text-sm font-semibold text-foreground mt-2 leading-tight">Vorschau als Nutzer</p>
                <p className="text-xs text-muted-foreground mt-0.5">Echter Output</p>
              </button>
              {ADMIN_MODULES.map((m) => {
                const isActive = adminModule === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setAdminModule(m.id)}
                    className={cn(
                      "min-w-[150px] text-left rounded-xl border p-3 transition-all bg-white",
                      isActive ? "border-primary ring-1 ring-primary shadow-sm" : "border-border hover:border-primary/40"
                    )}
                  >
                    <m.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    <p className="text-sm font-semibold text-foreground mt-2 leading-tight">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stepper (user wizard) */}
        {(!adminMode || adminModule === "preview") && (
        <div className="px-6 md:px-10 max-w-6xl mx-auto">
          <div className="flex items-stretch gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {STEPS.map((s, i) => {
              const isActive = s.id === activeStep;
              const isDone = completed.has(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => goTo(s.id)}
                  className={cn(
                    "flex-1 min-w-[160px] text-left rounded-xl border p-3 transition-all bg-white",
                    isActive
                      ? "border-primary ring-1 ring-primary shadow-sm"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isDone ? <Check className="h-4 w-4" /> : s.n}
                    </div>
                    <s.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <p className="text-sm font-semibold text-foreground mt-2 leading-tight">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>
        )}

        {/* Admin config content */}
        {adminMode && adminModule !== "preview" && (
          <div className="px-6 md:px-10 max-w-6xl mx-auto py-6">
            <Card className="p-6 bg-white border-border">
              <AdminConfig module={adminModule} />
            </Card>
            <AdminPublishBar />
          </div>
        )}

        {/* Content (user wizard) */}
        {(!adminMode || adminModule === "preview") && (
        <div className="px-6 md:px-10 max-w-6xl mx-auto py-6">
          {adminMode && adminModule === "preview" && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
              <Eye className="h-4 w-4" /> Vorschau als Nutzer – so sieht die Redaktion den konfigurierten Kalender.
            </div>
          )}
          {activeStep === "calendar" && (
            <Card className="p-6 bg-white border-border">
              <SectionHead icon={CalendarDays} title="1. Kalender befüllen" desc="Lege Zeitraum, Themenfelder, Kanäle und Zielgruppen fest." />
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <Label className="text-sm font-medium">Zeitraum</Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="mt-2 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1 2026">Q1 2026 (nächstes Quartal)</SelectItem>
                      <SelectItem value="Q2 2026">Q2 2026</SelectItem>
                      <SelectItem value="H1 2026">H1 2026</SelectItem>
                      <SelectItem value="2026">Gesamtjahr 2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ChipGroup label="Zielgruppen & Region" options={TARGET_GROUPS} selected={targets} onToggle={(v) => toggle(targets, v, setTargets)} />
                <ChipGroup label="Themenfelder" options={TOPIC_FIELDS} selected={fields} onToggle={(v) => toggle(fields, v, setFields)} />
                <ChipGroup label="Kanäle & Frequenz" options={CHANNELS} selected={channels} onToggle={(v) => toggle(channels, v, setChannels)} />
              </div>

              <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
                <p className="text-sm text-muted-foreground max-w-md">
                  Auf Basis deiner Auswahl befüllt die KI den Kalender automatisch mit
                  Themenvorschlägen aus saisonalen Regeln, Trends und HDI-Prioritäten.
                </p>
                <Button onClick={fillCalendar} disabled={filling}>
                  {filling ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Kalender wird befüllt…</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> {calendarFilled ? "Kalender neu befüllen" : "Kalender automatisch befüllen"}</>
                  )}
                </Button>
              </div>

              {calendarFilled && !filling && <CalendarOverview period={period} />}

              <FooterNav onNext={completeAndNext} nextLabel="Weiter zu Themenlogik" nextDisabled={!calendarFilled} />
            </Card>
          )}

          {/* STEP 2 */}
          {activeStep === "logic" && (
            <Card className="p-6 bg-white border-border">
              <SectionHead icon={Compass} title="2. Themenlogik & Signale" desc="Bestimme, welche Logik und Signale die KI für Vorschläge nutzen soll." />
              <div className="space-y-3 mt-6">
                <ToggleRow checked={useSeasonal} onChange={setUseSeasonal} icon={CalendarRange} title="Saisonale Regeln & feste Versicherungslogik" desc="Wiederkehrende Anlässe und Kalenderdaten als Basis." />
                <ToggleRow checked={useTrends} onChange={setUseTrends} icon={TrendingUp} title="Google-Trends-Signale als Zusatzimpuls" desc="Aktuelle Nachfrage-Spitzen fließen in das Ranking ein." />
                <ToggleRow checked={usePriorities} onChange={setUsePriorities} icon={Sparkles} title="Strategische Prioritäten von HDI" desc="Gewichtung nach Geschäftszielen und Fokusprodukten." />
              </div>
              <FooterNav onBack={() => goTo("calendar")} onNext={completeAndNext} nextLabel="Vorschläge generieren" />
            </Card>
          )}

          {/* STEP 3 */}
          {activeStep === "suggestions" && (
            <Card className="p-6 bg-white border-border">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <SectionHead icon={CalendarRange} title="3. Vorschlagskalender" desc="Konkrete Themenvorschläge mit Datum, Kanal und Relevanz-Score." />
                <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating}>
                  {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Neu generieren
                </Button>
              </div>
              <div className="mt-6 space-y-2">
                {suggestions.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/40 transition-colors">
                    <div className="w-14 text-center shrink-0">
                      <p className="text-xs text-muted-foreground">{s.date.split(" ")[1]}</p>
                      <p className="text-lg font-bold text-foreground leading-none">{s.date.split(" ")[0]}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground">{s.topic}</p>
                        <Badge variant="secondary" className="text-[10px]">{s.field}</Badge>
                        <Badge variant="outline" className="text-[10px]">{s.channel}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{s.reason}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center">
                        <p className="text-sm font-bold text-primary">{s.score}</p>
                        <p className="text-[10px] text-muted-foreground">Score</p>
                      </div>
                      <button
                        onClick={() => cycleStatus(s.id)}
                        className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors", statusStyles[s.status])}
                        title="Status ändern"
                      >
                        {s.status}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <FooterNav onBack={() => goTo("logic")} onNext={completeAndNext} nextLabel="Thema analysieren" />
            </Card>
          )}

          {/* STEP 4 */}
          {activeStep === "briefing" && (
            <Card className="p-6 bg-white border-border">
              <SectionHead icon={FileSearch} title="4. Themenanalyse & Briefing" desc="Wähle ein Thema – die KI analysiert Trends und erstellt automatisch ein Content-Briefing." />
              <div className="grid md:grid-cols-[280px_1fr] gap-6 mt-6">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Thema wählen</p>
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => pickTopic(s)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all",
                        selectedTopic?.id === s.id ? "border-primary ring-1 ring-primary bg-primary/5" : "border-border hover:border-primary/40"
                      )}
                    >
                      <p className="text-sm font-medium text-foreground">{s.topic}</p>
                      <p className="text-xs text-muted-foreground">{s.field} · {s.channel}</p>
                    </button>
                  ))}
                </div>
                <div className="min-h-[260px]">
                  {!selectedTopic && (
                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground border border-dashed border-border rounded-lg p-8">
                      <FileSearch className="h-8 w-8 mb-2 opacity-50" />
                      <p className="text-sm">Wähle links ein Thema, um die Analyse zu starten.</p>
                    </div>
                  )}
                  {selectedTopic && analyzing && (
                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                      <Loader2 className="h-8 w-8 mb-3 animate-spin text-primary" />
                      <p className="text-sm">Analysiere Trends, Unterthemen & Nutzerfragen…</p>
                    </div>
                  )}
                  {selectedTopic && briefingReady && (
                    <div className="space-y-5 animate-fade-in">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" /> Passende Trends & Unterthemen
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {BRIEFING_TRENDS.map((t) => (
                            <Badge key={t.topic} variant="secondary" className="gap-1">
                              {t.topic} <span className="text-emerald-600 font-semibold">{t.momentum}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">Häufige Nutzerfragen</p>
                        <ul className="space-y-1.5">
                          {BRIEFING_QUESTIONS.map((q) => (
                            <li key={q} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="text-sm font-semibold text-foreground mb-1">Automatisches Content-Briefing</p>
                        <p className="text-sm text-muted-foreground">
                          Fachliche und kommunikative Einordnung für „{selectedTopic.topic}" – inkl. Zielgruppe,
                          Kernbotschaft und Tonalität als Grundlage für die Erstellung.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <FooterNav onBack={() => goTo("suggestions")} onNext={completeAndNext} nextLabel="Content-Paket erstellen" nextDisabled={!briefingReady} />
            </Card>
          )}

          {/* STEP 5 */}
          {activeStep === "package" && (
            <Card className="p-6 bg-white border-border">
              <SectionHead icon={Package} title="5. Content-Paket erstellen" desc="Zuerst das Master Content Piece – danach Ableitungen für alle Kanäle." />

              {!packageReady && !building && (
                <div className="mt-6 text-center py-10 border border-dashed border-border rounded-lg">
                  <Package className="h-10 w-10 mx-auto text-primary/60 mb-3" />
                  <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                    Auf Basis des Briefings erstellt die KI einen Master-Artikel und leitet daraus
                    kanalspezifische Formate ab.
                  </p>
                  <Button onClick={buildPackage}>
                    <Sparkles className="h-4 w-4" /> Paket generieren
                  </Button>
                </div>
              )}

              {building && (
                <div className="mt-6 text-center py-12">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">Erstelle Master-Artikel und Ableitungen…</p>
                </div>
              )}

              {packageReady && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  <div className="border border-primary/30 bg-primary/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-5 w-5 text-primary" />
                      <p className="font-semibold text-foreground">Master Content Piece</p>
                      <Badge variant="secondary" className="text-[10px]">Website / Blog</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedTopic?.topic ?? "Themenartikel"} – vollständiger Blogartikel als Basis für alle Ableitungen.
                    </p>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ableitungen</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {DERIVATIVES.map((d) => (
                      <div key={d.label} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-white">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <d.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{d.label}</p>
                          <p className="text-xs text-muted-foreground">{d.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                    <p className="text-sm text-emerald-800">
                      <span className="font-medium">Human-in-the-loop:</span> Menschliche Prüfung und finale Freigabe
                      vor Veröffentlichung erforderlich.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={() => { setCompleted((p) => new Set(p).add("package")); toast.success("Zur Freigabe gesendet"); }}>
                      <CheckCircle2 className="h-4 w-4" /> Zur Freigabe senden
                    </Button>
                    <Button variant="outline" onClick={buildPackage}>
                      <RefreshCw className="h-4 w-4" /> Neu generieren
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" onClick={() => goTo("briefing")}>
                  <ArrowLeft className="h-4 w-4" /> Zurück
                </Button>
              </div>
            </Card>
          )}

          {/* Guiding principle banner */}
          <div className="mt-6 flex items-center gap-3 bg-white border border-border rounded-xl p-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Leitprinzip:</span> Keine automatische
              Veröffentlichung, sondern ein KI-gestützter Vorschlags- und Produktionsprozess mit
              Human-in-the-loop. <RefreshCw className="inline h-3.5 w-3.5 text-primary mx-1" /> Feedback &
              Optimierung fließen kontinuierlich zurück.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const CAL_ENTRIES: Record<number, { label: string; field: string; color: string }> = {
  6: { label: "Einbruchschutz", field: "Hausrat", color: "bg-blue-100 text-blue-700 border-blue-200" },
  9: { label: "Reel: KFZ-Tipp", field: "Instagram", color: "bg-pink-100 text-pink-700 border-pink-200" },
  13: { label: "Haftpflicht 2026", field: "LinkedIn", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  16: { label: "Newsletter", field: "Unfall", color: "bg-amber-100 text-amber-700 border-amber-200" },
  20: { label: "Winterreifen", field: "KFZ", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  23: { label: "Story: Hausrat", field: "Instagram", color: "bg-pink-100 text-pink-700 border-pink-200" },
  27: { label: "Unfall-Familie", field: "Newsletter", color: "bg-amber-100 text-amber-700 border-amber-200" },
  30: { label: "Blog: Recht", field: "Rechtsschutz", color: "bg-blue-100 text-blue-700 border-blue-200" },
};

const CalendarOverview = ({ period }: { period: string }) => {
  // Demo month: Januar (startet Donnerstag, 31 Tage)
  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const firstWeekday = 3; // 0=Mo → Donnerstag
  const daysInMonth = 31;
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">
            Vorbefüllter Kalender · Januar 2026
          </p>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {Object.keys(CAL_ENTRIES).length} Vorschläge · {period}
        </Badge>
      </div>
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border bg-muted/40">
          {weekDays.map((d) => (
            <div key={d} className="px-2 py-2 text-[11px] font-medium text-muted-foreground text-center">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const entry = day ? CAL_ENTRIES[day] : null;
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[68px] border-b border-r border-border/60 p-1.5 last:border-r-0",
                  !day && "bg-muted/20"
                )}
              >
                {day && (
                  <>
                    <p className="text-[11px] text-muted-foreground mb-1">{day}</p>
                    {entry && (
                      <div className={cn("text-[10px] leading-tight rounded-md border px-1.5 py-1", entry.color)}>
                        <p className="font-medium truncate">{entry.label}</p>
                        <p className="opacity-70 truncate">{entry.field}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Die KI hat den Kalender automatisch mit Vorschlägen aus saisonalen Regeln, Trends und HDI-Prioritäten vorbefüllt.
      </p>
    </div>
  );
};

const SectionHead = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  </div>
);

const ChipGroup = ({ label, options, selected, onToggle }: { label: string; options: string[]; selected: string[]; onToggle: (v: string) => void }) => (
  <div>
    <Label className="text-sm font-medium">{label}</Label>
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button
            key={o}
            onClick={() => onToggle(o)}
            className={cn(
              "text-sm px-3 py-1.5 rounded-full border transition-colors",
              on ? "bg-primary text-primary-foreground border-primary" : "bg-white text-foreground border-border hover:border-primary/40"
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  </div>
);

const ToggleRow = ({ checked, onChange, icon: Icon, title, desc }: { checked: boolean; onChange: (v: boolean) => void; icon: any; title: string; desc: string }) => (
  <label className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/40 transition-colors cursor-pointer">
    <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} className="mt-0.5" />
    <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
    <div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  </label>
);

const FooterNav = ({ onBack, onNext, nextLabel, nextDisabled }: { onBack?: () => void; onNext: () => void; nextLabel: string; nextDisabled?: boolean }) => (
  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
    {onBack ? (
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" /> Zurück
      </Button>
    ) : (
      <span />
    )}
    <Button onClick={onNext} disabled={nextDisabled}>
      {nextLabel} <ArrowRight className="h-4 w-4" />
    </Button>
  </div>
);

export default ContentPlanner;
