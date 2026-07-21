import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AdminConfig, { AdminModuleId, AdminPublishBar } from "@/components/content-planner/AdminConfig";
import DevDocButton, { DevDocId } from "@/components/content-planner/DevDocs";
import CalendarAppMock from "@/components/content-planner/CalendarAppMock";
import PerformanceDashboard from "@/components/content-planner/PerformanceDashboard";
import { CPLang, CPContent, CPSuggestion, CP_CONTENT } from "@/components/content-planner/i18n";
import hdiLogoAsset from "@/assets/hdi-logo.png.asset.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { de as deLocale } from "date-fns/locale";
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
  Users,
  Tags,
  LayoutTemplate,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type StepId = "calendar" | "logic" | "suggestions" | "briefing" | "package";

const STEP_ICONS: Record<StepId, any> = {
  calendar: CalendarDays,
  logic: Compass,
  suggestions: CalendarRange,
  briefing: FileSearch,
  package: Package,
};

const ADMIN_ICONS: Record<AdminModuleId, any> = {
  audiences: Users,
  topics: Tags,
  seasonal: CalendarRange,
  trends: TrendingUp,
  formats: LayoutTemplate,
  governance: ShieldCheck,
};

const DERIVATIVE_ICONS: Record<string, any> = {
  linkedin: Linkedin,
  instagram: Instagram,
  video: Video,
  faq: FileText,
};

const ContentPlanner = () => {
  const [lang, setLang] = useState<CPLang>("de");
  const c = CP_CONTENT[lang];

  // Top-level view switch
  const [view, setView] = useState<"planner" | "calendarApp" | "performance">("planner");

  const [activeStep, setActiveStep] = useState<StepId>("calendar");
  const [completed, setCompleted] = useState<Set<StepId>>(new Set());

  // Admin mode
  const [adminMode, setAdminMode] = useState(false);
  const [adminModule, setAdminModule] = useState<AdminModuleId | "preview">("audiences");

  // Step 1 state
  const [period, setPeriod] = useState("Q1 2026");
  const [customRange, setCustomRange] = useState<{ from?: Date; to?: Date }>({});
  const [customOpen, setCustomOpen] = useState(false);
  const [fields, setFields] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [targets, setTargets] = useState<string[]>([]);
  const [calendarFilled, setCalendarFilled] = useState(false);
  const [filling, setFilling] = useState(false);

  // Step 2 state
  const [useSeasonal, setUseSeasonal] = useState(true);
  const [useTrends, setUseTrends] = useState(true);
  const [usePriorities, setUsePriorities] = useState(true);

  // Step 3 state
  const [suggestions, setSuggestions] = useState<CPSuggestion[]>(c.suggestions);
  const [generating, setGenerating] = useState(false);

  // Step 4 state
  const [selectedTopic, setSelectedTopic] = useState<CPSuggestion | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [briefingReady, setBriefingReady] = useState(false);

  // Step 5 state
  const [building, setBuilding] = useState(false);
  const [packageReady, setPackageReady] = useState(false);

  // Re-seed language-dependent demo data when the language changes
  useEffect(() => {
    setFields([c.topicFields[3], c.topicFields[2], c.topicFields[0]]);
    setChannels([c.channels[0], c.channels[1]]);
    setTargets([c.targetGroups[0]]);
    setSuggestions(CP_CONTENT[lang].suggestions);
    setSelectedTopic(null);
    setBriefingReady(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const STEPS = c.steps as { id: StepId; title: string; subtitle: string }[];
  const stepIndex = STEPS.findIndex((s) => s.id === activeStep);

  const fillCalendar = () => {
    setFilling(true);
    setCalendarFilled(false);
    setTimeout(() => {
      setFilling(false);
      setCalendarFilled(true);
      toast.success(c.fillToast);
    }, 1600);
  };

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
      setSuggestions(CP_CONTENT[lang].suggestions);
      toast.success(c.regenToast);
    }, 1400);
  };

  const cycleStatus = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const order: CPSuggestion["status"][] = ["proposal", "review", "approved"];
        const next = order[(order.indexOf(s.status) + 1) % order.length];
        return { ...s, status: next };
      })
    );
  };

  const statusStyles: Record<CPSuggestion["status"], string> = {
    proposal: "bg-muted text-muted-foreground",
    review: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
  };

  const pickTopic = (s: CPSuggestion) => {
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
      toast.success(c.packageToast);
    }, 1800);
  };

  return (
    <MainLayout mobileTitle={c.titleUser}>
      <div
        className="min-h-full bg-[#F8F9FD]"
        style={{
          // HDI brand scope: re-map primary token to HDI Universalgrün
          ["--primary" as any]: "77 48% 47%",
          ["--primary-foreground" as any]: "0 0% 100%",
          ["--ring" as any]: "77 48% 47%",
        }}
      >
        {/* HDI co-branding bar */}
        <div className="border-b border-border bg-white">
          <div className="px-6 md:px-10 max-w-6xl mx-auto py-3 flex items-center gap-3">
            <img src={hdiLogoAsset.url} alt="HDI" className="h-7 w-auto" />
            <div className="h-6 w-px bg-border" />
            <p className="text-xs text-muted-foreground">
              {lang === "de" ? "Content Planung · powered by PANTA Flows" : "Content planning · powered by PANTA Flows"}
            </p>
          </div>
        </div>

        {/* View switch */}
        <div className="px-6 md:px-10 max-w-6xl mx-auto pt-6">
          <div className="inline-flex rounded-xl border border-border bg-white p-1">
            {([
              { id: "planner", label: c.titleUser },
              { id: "calendarApp", label: "Content Calendar App" },
              { id: "performance", label: lang === "de" ? "Performance" : "Performance" },
            ] as const).map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-lg transition-colors",
                  view === v.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {view === "calendarApp" && <CalendarAppMock />}
        {view === "performance" && <PerformanceDashboard lang={lang} />}

        {view === "planner" && (<>
        {/* Header */}
        <div className="px-6 md:px-10 pt-8 pb-6 max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                <Sparkles className="h-4 w-4" />
                {c.brandTag}
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                {adminMode ? c.titleAdmin : c.titleUser}
              </h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">
                {adminMode ? c.subtitleAdmin : c.subtitleUser}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <DevDocButton docId="overview" lang={lang} />
              <LangToggle lang={lang} onChange={setLang} label={c.langLabel} />
              <label className={cn(
                "flex items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 cursor-pointer transition-colors",
                adminMode ? "border-primary ring-1 ring-primary" : "border-border"
              )}>
                <Settings2 className={cn("h-4 w-4", adminMode ? "text-primary" : "text-muted-foreground")} />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground leading-tight">{c.adminModeTitle}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">{c.adminModeSubtitle}</p>
                </div>
                <Switch checked={adminMode} onCheckedChange={setAdminMode} className="ml-1" />
              </label>
            </div>
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
                <p className="text-sm font-semibold text-foreground mt-2 leading-tight">{c.previewTitle}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.previewSubtitle}</p>
              </button>
              {c.adminModules.map((m) => {
                const id = m.id as AdminModuleId;
                const Icon = ADMIN_ICONS[id];
                const isActive = adminModule === id;
                return (
                  <button
                    key={id}
                    onClick={() => setAdminModule(id)}
                    className={cn(
                      "min-w-[150px] text-left rounded-xl border p-3 transition-all bg-white",
                      isActive ? "border-primary ring-1 ring-primary shadow-sm" : "border-border hover:border-primary/40"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
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
              const Icon = STEP_ICONS[s.id];
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
                      {isDone ? <Check className="h-4 w-4" /> : i + 1}
                    </div>
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
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
            <div className="flex justify-end mb-3">
              <DevDocButton docId="admin" lang={lang} />
            </div>
            <Card className="p-6 bg-white border-border">
              <AdminConfig key={lang} module={adminModule} lang={lang} />
            </Card>
            <AdminPublishBar lang={lang} />
          </div>
        )}

        {/* Content (user wizard) */}
        {(!adminMode || adminModule === "preview") && (
        <div className="px-6 md:px-10 max-w-6xl mx-auto py-6">
          {adminMode && adminModule === "preview" && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
              <Eye className="h-4 w-4" /> {c.previewBanner}
            </div>
          )}
          {activeStep === "calendar" && (
            <Card className="p-6 bg-white border-border">
              <SectionHead icon={CalendarDays} title={c.step1Title} desc={c.step1Desc} docId="calendar" lang={lang} />
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <Label className="text-sm font-medium">{c.periodLabel}</Label>
                  <Select
                    value={period === "__custom__" || period.startsWith("custom:") ? "__custom__" : period}
                    onValueChange={(v) => {
                      if (v === "__custom__") {
                        setPeriod("__custom__");
                        setTimeout(() => setCustomOpen(true), 150);
                      } else {
                        setPeriod(v);
                      }
                    }}
                  >
                    <SelectTrigger className="mt-2 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {c.periodOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(period === "__custom__" || period.startsWith("custom:")) && (
                    <Popover open={customOpen} onOpenChange={setCustomOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="mt-2 w-full justify-start bg-white font-normal">
                          <CalendarDays className="h-4 w-4" />
                          {customRange.from && customRange.to
                            ? `${format(customRange.from, "d. MMM yyyy", { locale: lang === "de" ? deLocale : undefined })} – ${format(customRange.to, "d. MMM yyyy", { locale: lang === "de" ? deLocale : undefined })}`
                            : c.customPeriodPlaceholder}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                        <CalendarPicker
                          mode="range"
                          selected={customRange as any}
                          onSelect={(r: any) => setCustomRange(r || {})}
                          numberOfMonths={2}
                          initialFocus
                          locale={lang === "de" ? deLocale : undefined}
                          className="p-3 pointer-events-auto"
                        />
                        <div className="flex justify-between gap-2 border-t p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCustomRange({});
                            }}
                          >
                            {c.customPeriodClear}
                          </Button>
                          <Button
                            size="sm"
                            disabled={!customRange.from || !customRange.to}
                            onClick={() => {
                              if (customRange.from && customRange.to) {
                                const locale = lang === "de" ? deLocale : undefined;
                                const label = `${format(customRange.from, "d. MMM yyyy", { locale })} – ${format(customRange.to, "d. MMM yyyy", { locale })}`;
                                setPeriod(`custom:${label}`);
                                setCustomOpen(false);
                              }
                            }}
                          >
                            {c.customPeriodApply}
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <ChipGroup label={c.targetsLabel} options={c.targetGroups} selected={targets} onToggle={(v) => toggle(targets, v, setTargets)} />
                <ChipGroup label={c.fieldsLabel} options={c.topicFields} selected={fields} onToggle={(v) => toggle(fields, v, setFields)} />
                <ChipGroup label={c.channelsLabel} options={c.channels} selected={channels} onToggle={(v) => toggle(channels, v, setChannels)} />
              </div>

              <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
                <p className="text-sm text-muted-foreground max-w-md">{c.fillHint}</p>
                <Button onClick={fillCalendar} disabled={filling || period === "__custom__"}>
                  {filling ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> {c.fillingBtn}</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> {calendarFilled ? c.refillBtn : c.fillBtn}</>
                  )}
                </Button>
              </div>

              {calendarFilled && !filling && <CalendarOverview period={period.startsWith("custom:") ? period.slice(7) : period} c={c} />}

              <FooterNav onNext={completeAndNext} nextLabel={c.nextToLogic} nextDisabled={!calendarFilled} back={c.back} />
            </Card>
          )}

          {/* STEP 2 */}
          {activeStep === "logic" && (
            <Card className="p-6 bg-white border-border">
              <SectionHead icon={Compass} title={c.step2Title} desc={c.step2Desc} docId="logic" lang={lang} />
              <div className="space-y-3 mt-6">
                <ToggleRow checked={useSeasonal} onChange={setUseSeasonal} icon={CalendarRange} title={c.seasonalTitle} desc={c.seasonalDesc} />
                <ToggleRow checked={useTrends} onChange={setUseTrends} icon={TrendingUp} title={c.trendsTitle} desc={c.trendsDesc} />
                <ToggleRow checked={usePriorities} onChange={setUsePriorities} icon={Sparkles} title={c.prioTitle} desc={c.prioDesc} />
              </div>
              <FooterNav onBack={() => goTo("calendar")} onNext={completeAndNext} nextLabel={c.generateBtn} back={c.back} />
            </Card>
          )}

          {/* STEP 3 */}
          {activeStep === "suggestions" && (
            <Card className="p-6 bg-white border-border">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <SectionHead icon={CalendarRange} title={c.step3Title} desc={c.step3Desc} docId="suggestions" lang={lang} />
                <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating}>
                  {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  {c.regenBtn}
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
                        <p className="text-[10px] text-muted-foreground">{c.scoreLabel}</p>
                      </div>
                      <button
                        onClick={() => cycleStatus(s.id)}
                        className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors", statusStyles[s.status])}
                        title={c.changeStatusTitle}
                      >
                        {c.statusLabels[s.status]}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <FooterNav onBack={() => goTo("logic")} onNext={completeAndNext} nextLabel={c.nextToAnalyze} back={c.back} />
            </Card>
          )}

          {/* STEP 4 */}
          {activeStep === "briefing" && (
            <Card className="p-6 bg-white border-border">
              <SectionHead icon={FileSearch} title={c.step4Title} desc={c.step4Desc} docId="briefing" lang={lang} />
              <div className="grid md:grid-cols-[280px_1fr] gap-6 mt-6">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{c.pickTopicLabel}</p>
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
                      <p className="text-sm">{c.pickEmpty}</p>
                    </div>
                  )}
                  {selectedTopic && analyzing && (
                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                      <Loader2 className="h-8 w-8 mb-3 animate-spin text-primary" />
                      <p className="text-sm">{c.analyzingText}</p>
                    </div>
                  )}
                  {selectedTopic && briefingReady && (
                    <div className="space-y-5 animate-fade-in">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" /> {c.trendsBlockTitle}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {c.briefingTrends.map((t) => (
                            <Badge key={t.topic} variant="secondary" className="gap-1">
                              {t.topic} <span className="text-emerald-600 font-semibold">{t.momentum}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">{c.questionsBlockTitle}</p>
                        <ul className="space-y-1.5">
                          {c.briefingQuestions.map((q) => (
                            <li key={q} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="text-sm font-semibold text-foreground mb-1">{c.briefingBlockTitle}</p>
                        <p className="text-sm text-muted-foreground">{c.briefingBlockText(selectedTopic.topic)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <FooterNav onBack={() => goTo("suggestions")} onNext={completeAndNext} nextLabel={c.nextToPackage} nextDisabled={!briefingReady} back={c.back} />
            </Card>
          )}

          {/* STEP 5 */}
          {activeStep === "package" && (
            <Card className="p-6 bg-white border-border">
              <SectionHead icon={Package} title={c.step5Title} desc={c.step5Desc} docId="package" lang={lang} />

              {!packageReady && !building && (
                <div className="mt-6 text-center py-10 border border-dashed border-border rounded-lg">
                  <Package className="h-10 w-10 mx-auto text-primary/60 mb-3" />
                  <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">{c.packageHint}</p>
                  <Button onClick={buildPackage}>
                    <Sparkles className="h-4 w-4" /> {c.genPackageBtn}
                  </Button>
                </div>
              )}

              {building && (
                <div className="mt-6 text-center py-12">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">{c.buildingText}</p>
                </div>
              )}

              {packageReady && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  <div className="border border-primary/30 bg-primary/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-5 w-5 text-primary" />
                      <p className="font-semibold text-foreground">{c.masterTitle}</p>
                      <Badge variant="secondary" className="text-[10px]">{c.masterChannel}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {c.masterDesc(selectedTopic?.topic ?? c.step4Title)}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{c.derivativesLabel}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {c.derivatives.map((d) => {
                      const Icon = DERIVATIVE_ICONS[d.key] ?? FileText;
                      return (
                        <div key={d.key} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-white">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{d.label}</p>
                            <p className="text-xs text-muted-foreground">{d.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                    <p className="text-sm text-emerald-800">
                      <span className="font-medium">{c.hitlLabel}</span> {c.hitlText}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={() => { setCompleted((p) => new Set(p).add("package")); toast.success(c.sendApprovalToast); }}>
                      <CheckCircle2 className="h-4 w-4" /> {c.sendApprovalBtn}
                    </Button>
                    <Button variant="outline" onClick={buildPackage}>
                      <RefreshCw className="h-4 w-4" /> {c.regenBtn}
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" onClick={() => goTo("briefing")}>
                  <ArrowLeft className="h-4 w-4" /> {c.back}
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
              <span className="font-semibold text-foreground">{c.guidingLabel}</span> {c.guidingText}
            </p>
          </div>
        </div>
        )}
        </>)}
      </div>
    </MainLayout>
  );
};

const LangToggle = ({ lang, onChange, label }: { lang: CPLang; onChange: (l: CPLang) => void; label: string }) => (
  <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-2.5 py-2">
    <span className="sr-only">{label}</span>
    <div className="inline-flex rounded-lg bg-muted/40 p-0.5">
      {(["de", "en"] as CPLang[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={cn(
            "px-3 py-1 text-xs font-semibold rounded-md transition-colors uppercase",
            lang === l ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  </div>
);

const CalendarOverview = ({ period, c }: { period: string; c: CPContent }) => {
  const weekDays = c.weekDays;
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
          <p className="text-sm font-semibold text-foreground">{c.calHeader}</p>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {Object.keys(c.calEntries).length} {c.calBadgeSuffix} · {period}
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
            const entry = day ? c.calEntries[day] : null;
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
      <p className="text-xs text-muted-foreground mt-2">{c.calFootnote}</p>
    </div>
  );
};

const SectionHead = ({ icon: Icon, title, desc, docId, lang }: { icon: any; title: string; desc: string; docId?: DevDocId; lang?: CPLang }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
    {docId && lang && <DevDocButton docId={docId} lang={lang} className="shrink-0" />}
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

const FooterNav = ({ onBack, onNext, nextLabel, nextDisabled, back }: { onBack?: () => void; onNext: () => void; nextLabel: string; nextDisabled?: boolean; back: string }) => (
  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
    {onBack ? (
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" /> {back}
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
