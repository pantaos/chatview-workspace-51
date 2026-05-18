import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  Sparkles,
  TrendingUp,
  Lightbulb,
  FileText,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type StepId = "setup" | "analysis" | "ideas" | "handover";

const STEPS: { id: StepId; title: string; icon: any }[] = [
  { id: "setup", title: "Briefing", icon: CalendarRange },
  { id: "analysis", title: "Trendanalyse", icon: TrendingUp },
  { id: "ideas", title: "Content-Ideen", icon: Lightbulb },
  { id: "handover", title: "Content erstellen", icon: FileText },
];

const CATEGORY_OPTIONS = [
  "Produkt-Updates",
  "Thought Leadership",
  "Case Studies",
  "How-To / Tutorials",
  "Branchen-News",
  "Behind the Scenes",
  "Employer Branding",
];

const CHANNEL_OPTIONS = ["LinkedIn", "Blog", "Newsletter", "Instagram", "YouTube", "Podcast"];

interface Trend {
  topic: string;
  summary: string;
  momentum: "rising" | "hot" | "steady";
  sources: { name: string; type: string }[];
  matchedCategories: string[];
}

interface Idea {
  id: string;
  title: string;
  format: string;
  channel: string;
  category: string;
  angle: string;
  why: string;
}

const MOCK_TRENDS: Trend[] = [
  {
    topic: "AI Upskilling wird messbar",
    summary:
      "L&D-Teams diskutieren erstmals breit über KPIs für AI-Trainings. Frage „Wie misst man Lerntransfer?“ stieg in 4 Wochen um 180 %.",
    momentum: "hot",
    sources: [
      { name: "LinkedIn (DACH L&D Community)", type: "Social" },
      { name: "HBR Digital Edition", type: "Publikation" },
      { name: "Reddit r/instructionaldesign", type: "Forum" },
    ],
    matchedCategories: ["Thought Leadership", "How-To / Tutorials"],
  },
  {
    topic: "EU AI Act – konkrete Auswirkungen Q3",
    summary:
      "Verlage und Mittelstand suchen pragmatische Checklisten statt juristische Erklärtexte. Hohe Engagement-Rate auf erklärende Carousels.",
    momentum: "rising",
    sources: [
      { name: "EU Kommission Newsroom", type: "Offiziell" },
      { name: "Bitkom Whitepaper", type: "Verband" },
      { name: "LinkedIn Legal Influencer", type: "Social" },
    ],
    matchedCategories: ["Branchen-News", "Thought Leadership"],
  },
  {
    topic: "Mini-Automationen im Newsroom",
    summary:
      "Kurze Reels mit 2–3 konkreten Workflow-Hacks performen aktuell überdurchschnittlich. Sweet Spot: 30–45 Sek.",
    momentum: "rising",
    sources: [
      { name: "Instagram Creator Insights", type: "Social" },
      { name: "Nieman Lab", type: "Publikation" },
    ],
    matchedCategories: ["How-To / Tutorials", "Behind the Scenes"],
  },
  {
    topic: "Onboarding-Fails bei AI-Tools",
    summary:
      "Wachsende Zahl an Erfahrungsberichten zu gescheiterten Tool-Rollouts. Publikum will Lessons Learned, keine Erfolgsstories.",
    momentum: "steady",
    sources: [
      { name: "Slack-Communities (Reworked, Ops Nation)", type: "Community" },
      { name: "Customer-Support-Tickets (intern)", type: "1st Party" },
    ],
    matchedCategories: ["Case Studies", "Thought Leadership"],
  },
];

const MOCK_IDEAS: Idea[] = [
  {
    id: "id1",
    title: "4 KPIs, die AI-Upskilling 2026 wirklich messbar machen",
    format: "Artikel",
    channel: "Blog",
    category: "Thought Leadership",
    angle: "Datenbasierter Leitfaden mit Beispiel-Scorecard",
    why: "Direkter Treffer auf Trend „AI Upskilling messbar“ – L&D-Leads suchen genau diesen Frame.",
  },
  {
    id: "id2",
    title: "EU AI Act in 7 Slides: Was Verlage diese Woche tun sollten",
    format: "Carousel",
    channel: "LinkedIn",
    category: "Branchen-News",
    angle: "Pragmatische Checkliste statt Jura-Deep-Dive",
    why: "Trend „EU AI Act Q3“ + Format, das laut Benchmark aktuell überdurchschnittlich performt.",
  },
  {
    id: "id3",
    title: "3 Mini-Automationen, die Redaktionen pro Woche 6h sparen",
    format: "Reel",
    channel: "Instagram",
    category: "How-To / Tutorials",
    angle: "30-Sek-Reel mit konkreten Workflow-Hacks",
    why: "Greift Mini-Automation-Trend auf, Format passt zu hoher Mobile-Reichweite im Zeitraum.",
  },
  {
    id: "id4",
    title: "Warum unser erstes AI-Tool-Rollout gefloppt ist – 5 Lessons",
    format: "Artikel",
    channel: "LinkedIn",
    category: "Case Studies",
    angle: "Ehrlicher Erfahrungsbericht statt Success Story",
    why: "Publikum belohnt aktuell Vulnerability – Trend „Onboarding-Fails“ deckt das.",
  },
  {
    id: "id5",
    title: "Hinter den Kulissen: Wie wir wöchentlich 20 Trends scannen",
    format: "Post",
    channel: "LinkedIn",
    category: "Behind the Scenes",
    angle: "Tool-Stack + Mini-Prozess",
    why: "Füllt Pflicht-Kategorie „Behind the Scenes“ aus deinem Briefing.",
  },
  {
    id: "id6",
    title: "Release Notes Mai: 5 neue Workflow-Bausteine in PANTA Flows",
    format: "Newsletter",
    channel: "Newsletter",
    category: "Produkt-Updates",
    angle: "Kurzer Changelog + 1 Anwendungsbeispiel pro Baustein",
    why: "Pflicht-Kategorie „Produkt-Updates“ + fixer Termin im Zeitraum.",
  },
];

const Editorial = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<StepId>("setup");

  // Step 1 – Briefing
  const [periodStart, setPeriodStart] = useState("2026-06-01");
  const [periodEnd, setPeriodEnd] = useState("2026-06-30");
  const [categories, setCategories] = useState<string[]>([
    "Produkt-Updates",
    "Thought Leadership",
    "How-To / Tutorials",
  ]);
  const [channels, setChannels] = useState<string[]>(["LinkedIn", "Blog", "Newsletter"]);
  const [postsPerWeek, setPostsPerWeek] = useState("4");
  const [audience, setAudience] = useState("CIOs, Ops-Verantwortliche, L&D Leads im DACH-Mittelstand");
  const [notes, setNotes] = useState(
    "Mind. 1 Produkt-Update pro Woche. Tonalität pragmatisch, datennah, keine Buzzwords."
  );

  // Step 2 – Analysis
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  // Step 3 – Ideas
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideasDone, setIdeasDone] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);

  const toggleArray = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((a) => a !== val) : [...arr, val]);
  };

  const runAnalysis = () => {
    setAnalysisLoading(true);
    setTimeout(() => {
      setAnalysisLoading(false);
      setAnalysisDone(true);
    }, 1200);
  };

  const runIdeas = () => {
    setIdeasLoading(true);
    setTimeout(() => {
      setIdeasLoading(false);
      setIdeasDone(true);
    }, 1200);
  };

  const goNext = () => {
    if (step === "setup") {
      setStep("analysis");
      if (!analysisDone) runAnalysis();
    } else if (step === "analysis") {
      setStep("ideas");
      if (!ideasDone) runIdeas();
    } else if (step === "ideas") {
      if (!selectedIdea) {
        toast.error("Bitte wähle zuerst eine Idee aus.");
        return;
      }
      setStep("handover");
    }
  };

  const goBack = () => {
    const order: StepId[] = ["setup", "analysis", "ideas", "handover"];
    const i = order.indexOf(step);
    if (i > 0) setStep(order[i - 1]);
  };

  const currentIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Redaktionsplan</h1>
          <p className="text-muted-foreground mt-1">
            In vier Schritten von der Trendanalyse zum fertigen Post-Briefing.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isDone = i < currentIndex;
              return (
                <div key={s.id} className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors min-w-0",
                      isActive && "bg-primary text-primary-foreground",
                      isDone && "bg-primary/15 text-primary",
                      !isActive && !isDone && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <Icon className="w-4 h-4 shrink-0" />
                    )}
                    <span className="truncate hidden sm:inline">{s.title}</span>
                    <span className="sm:hidden">{i + 1}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="h-px flex-1 bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <Card className="p-6 sm:p-8">
          {step === "setup" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Briefing für den Redaktionsplan</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Zeitraum und Anforderungen – darauf basieren Analyse und Ideen.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Zeitraum von</Label>
                  <Input id="start" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">Zeitraum bis</Label>
                  <Input id="end" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pflicht-Kategorien</Label>
                <p className="text-xs text-muted-foreground">
                  Welche Kategorien müssen im Plan vorkommen?
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {CATEGORY_OPTIONS.map((c) => {
                    const active = categories.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleArray(categories, c, setCategories)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm border transition-colors",
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:border-primary/40"
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Kanäle</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {CHANNEL_OPTIONS.map((c) => {
                    const active = channels.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleArray(channels, c, setChannels)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm border transition-colors",
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:border-primary/40"
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freq">Posts pro Woche</Label>
                  <Select value={postsPerWeek} onValueChange={setPostsPerWeek}>
                    <SelectTrigger id="freq">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3", "4", "5", "6", "7"].map((n) => (
                        <SelectItem key={n} value={n}>
                          {n} Posts
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aud">Zielgruppe</Label>
                  <Input id="aud" value={audience} onChange={(e) => setAudience(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Weitere Anforderungen</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tonalität, Pflicht-Themen, No-Gos, Kampagnen-Bezüge…"
                />
              </div>
            </div>
          )}

          {step === "analysis" && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Trendanalyse</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Zeitraum {periodStart} – {periodEnd} · Zielgruppe: {audience}
                  </p>
                </div>
                {!analysisLoading && analysisDone && (
                  <Button variant="outline" size="sm" onClick={runAnalysis}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Neu analysieren
                  </Button>
                )}
              </div>

              {analysisLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Analysiere Quellen, Foren und Branchen-News für deinen Zeitraum…
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {MOCK_TRENDS.map((t) => (
                    <div
                      key={t.topic}
                      className="border border-border rounded-lg p-4 sm:p-5 bg-background"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{t.topic}</h3>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "shrink-0",
                            t.momentum === "hot" && "bg-rose-500/15 text-rose-700 dark:text-rose-300",
                            t.momentum === "rising" && "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                            t.momentum === "steady" && "bg-muted text-muted-foreground"
                          )}
                        >
                          {t.momentum === "hot" ? "🔥 Hot" : t.momentum === "rising" ? "↗ Steigend" : "→ Stabil"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{t.summary}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                        <div className="text-muted-foreground">
                          <span className="font-medium text-foreground">Quellen: </span>
                          {t.sources.map((s, i) => (
                            <span key={s.name}>
                              {s.name} <span className="text-muted-foreground/60">({s.type})</span>
                              {i < t.sources.length - 1 ? " · " : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {t.matchedCategories.map((c) => (
                          <Badge key={c} variant="outline" className="text-xs">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "ideas" && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Content-Ideen</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Abgeleitet aus Trends und deinem Briefing. Wähle eine Idee für den Content-Creation-Flow.
                  </p>
                </div>
                {!ideasLoading && ideasDone && (
                  <Button variant="outline" size="sm" onClick={runIdeas}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Neu generieren
                  </Button>
                )}
              </div>

              {ideasLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">Leite konkrete Content-Ideen ab…</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {MOCK_IDEAS.map((idea) => {
                    const active = selectedIdea === idea.id;
                    return (
                      <button
                        key={idea.id}
                        type="button"
                        onClick={() => setSelectedIdea(idea.id)}
                        className={cn(
                          "text-left border rounded-lg p-4 sm:p-5 bg-background transition-all",
                          active
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{idea.title}</h3>
                          {active && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <Badge variant="secondary" className="text-xs">{idea.format}</Badge>
                          <Badge variant="secondary" className="text-xs">{idea.channel}</Badge>
                          <Badge variant="outline" className="text-xs">{idea.category}</Badge>
                        </div>
                        <p className="text-sm text-foreground mb-1">
                          <span className="font-medium">Angle: </span>{idea.angle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Warum jetzt: </span>{idea.why}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {step === "handover" && (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Bereit für die Content-Erstellung</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Deine Auswahl wird an den Content-Creation-Flow übergeben – inkl. Briefing, Kanal und Format.
                </p>
              </div>

              {selectedIdea && (
                <div className="max-w-lg mx-auto border border-border rounded-lg p-4 text-left bg-muted/30">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Ausgewählte Idee</p>
                  <p className="font-medium text-foreground">
                    {MOCK_IDEAS.find((i) => i.id === selectedIdea)?.title}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button
                  size="lg"
                  onClick={() => {
                    toast.success("Übergabe an Content-Creation-Flow");
                    navigate("/trendcast");
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Post jetzt erstellen
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setStep("setup");
                    setAnalysisDone(false);
                    setIdeasDone(false);
                    setSelectedIdea(null);
                  }}
                >
                  Neuen Plan starten
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Footer nav */}
        {step !== "handover" && (
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
            <Button onClick={goNext} disabled={(step === "analysis" && analysisLoading) || (step === "ideas" && ideasLoading)}>
              {step === "setup" && "Trendanalyse starten"}
              {step === "analysis" && "Ideen ableiten"}
              {step === "ideas" && "Weiter"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Editorial;
