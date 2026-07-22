import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import hdiLogoAsset from "@/assets/hdi-logo.png.asset.json";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Facebook,
  Instagram,
  LayoutGrid,
  CalendarDays,
  Pencil,
  ChevronRight as ArrowR,
  Clock,
  Hash,
  Image as ImageIcon,
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

type Platform = "all" | "facebook" | "instagram";
type EventStatus = "incomplete" | "approved";

interface CalEvent {
  day: number;
  title: string;
  platform: "Facebook" | "Instagram";
  status: EventStatus;
  time: string;
  audience: string;
  format: string;
  caption: string;
  hashtags: string[];
  cta: string;
  visualBrief: string;
  goal: string;
}

const EVENT_TEMPLATE: Omit<CalEvent, "day">[] = [
  {
    title: "Product Highlight",
    platform: "Instagram",
    status: "incomplete",
    time: "09:00",
    audience: "Junge Familien 28–40",
    format: "Reel · 9:16 · 20 Sek.",
    caption:
      "Deine Familie zählt auf dich – wir zählen auf dich zurück. Mit der HDI Risikolebensversicherung sicherst du in wenigen Minuten das ab, was wirklich zählt. 💚",
    hashtags: ["#HDI", "#Familienschutz", "#Risikoleben", "#FinanziellFrei"],
    cta: "Jetzt Beitrag in 60 Sek. berechnen →",
    visualBrief:
      "Familie am Frühstückstisch, warmes Morgenlicht, HDI-Grün als Akzent im Logo-Corner.",
    goal: "Awareness + Angebotsrechner-Klicks",
  },
  {
    title: "Customer Story",
    platform: "Facebook",
    status: "approved",
    time: "11:30",
    audience: "Hausbesitzer 40–60",
    format: "Single Image + Long-Form Caption",
    caption:
      "„Nach dem Sturm war unser Dach hin – HDI hat innerhalb von 48 Stunden geregelt.\" Familie Weber aus Hannover erzählt, warum sie sich für HDI Wohngebäude entschieden hat.",
    hashtags: ["#HDI", "#Kundenstimme", "#Wohngebäudeversicherung"],
    cta: "Ganze Geschichte lesen",
    visualBrief:
      "Portrait Familie Weber vor renoviertem Haus, dokumentarischer Look, keine Stockfotografie.",
    goal: "Trust + Retention",
  },
  {
    title: "Behind the Scenes",
    platform: "Instagram",
    status: "incomplete",
    time: "14:00",
    audience: "Employer-Branding · 22–35",
    format: "Story-Serie · 5 Frames",
    caption:
      "Ein Tag im Schadenteam Köln – wie aus einer Meldung um 08:14 Uhr eine Lösung um 16:02 Uhr wird.",
    hashtags: ["#LifeAtHDI", "#Insurance", "#Karriere"],
    cta: "Swipe up: Offene Stellen",
    visualBrief: "Handheld iPhone-Look, echte Mitarbeitende, keine Models.",
    goal: "Employer Branding",
  },
  {
    title: "Tips & Tricks",
    platform: "Facebook",
    status: "approved",
    time: "10:00",
    audience: "Autofahrer 25–55",
    format: "Carousel · 5 Slides",
    caption:
      "5 Dinge, die deine Kfz-Prämie senken – und eines davon kennen die wenigsten. Slide 3 lohnt sich. 👀",
    hashtags: ["#Kfz", "#Sparen", "#HDI"],
    cta: "Kfz-Tarif prüfen",
    visualBrief: "Illustrativer Carousel im HDI-Grün, klare Icons, große Zahlen.",
    goal: "Consideration + Tarifrechner",
  },
  {
    title: "New Feature",
    platform: "Instagram",
    status: "incomplete",
    time: "12:00",
    audience: "Bestandskunden App-Nutzer",
    format: "Reel · 9:16 · 15 Sek.",
    caption:
      "Schaden melden per Foto – in der HDI App jetzt in unter 60 Sekunden. Zeigen wir dir. 📱",
    hashtags: ["#HDIApp", "#Schadenmeldung", "#DigitalErsteHilfe"],
    cta: "App öffnen",
    visualBrief: "Screen-Recording der App, dazu Hand mit Handy im HDI-Look.",
    goal: "Feature Adoption",
  },
  {
    title: "Industry News",
    platform: "Facebook",
    status: "approved",
    time: "08:30",
    audience: "Entscheider · Gewerbe",
    format: "Link Post + Kommentar",
    caption:
      "BaFin-Update: Was ändert sich 2026 für gewerbliche Sachversicherungen? Unser Kurz-Take für Geschäftsführer:innen.",
    hashtags: ["#Gewerbe", "#BaFin", "#Regulatorik"],
    cta: "Zum Beitrag im HDI Business-Blog",
    visualBrief: "Editorial Header mit Zitat + Autor-Portrait rechts unten.",
    goal: "Thought Leadership B2B",
  },
  {
    title: "Quote Post",
    platform: "Instagram",
    status: "incomplete",
    time: "18:00",
    audience: "Broad · Brand",
    format: "Single Image · 1:1",
    caption:
      "„Sicherheit ist kein Produkt – sie ist ein Versprechen.\" – Aus unserem Markenmanifest.",
    hashtags: ["#HDI", "#Markenwerte"],
    cta: "—",
    visualBrief: "Typografie-Poster, HDI-Dunkelgrün Hintergrund, große Serif.",
    goal: "Brand Reach",
  },
  {
    title: "Success Story",
    platform: "Facebook",
    status: "approved",
    time: "13:00",
    audience: "SME 10–200 MA",
    format: "Video-Case · 60 Sek.",
    caption:
      "Wie die Bäckerei Möller nach einem Wasserschaden innerhalb einer Woche wieder öffnen konnte – dank HDI Betriebsunterbrechung.",
    hashtags: ["#Mittelstand", "#HDI", "#Betriebsschutz"],
    cta: "Beratung anfragen",
    visualBrief: "Cinematic Doku-Look, Interview + B-Roll aus der Backstube.",
    goal: "Lead Generation SME",
  },
  {
    title: "Poll / Question",
    platform: "Instagram",
    status: "incomplete",
    time: "16:00",
    audience: "Community · alle",
    format: "Story mit Umfrage-Sticker",
    caption:
      "Wovor hast du im Alltag am meisten Sorge? A) Auto B) Wohnung C) Gesundheit D) Familie – tap it.",
    hashtags: ["#HDI"],
    cta: "Antworten & Story teilen",
    visualBrief: "Foto-Collage 4 Alltagsszenen, Umfrage-Sticker mittig.",
    goal: "Engagement + Insights",
  },
  {
    title: "Promo / Offer",
    platform: "Facebook",
    status: "approved",
    time: "09:30",
    audience: "Wechsler Kfz",
    format: "Static + Paid Boost",
    caption:
      "Wechselzeit Kfz: Bis 30.11. abschließen und 2 Monate beitragsfrei fahren. Nur bei HDI.",
    hashtags: ["#Kfz", "#Wechselaktion", "#HDI"],
    cta: "Jetzt wechseln",
    visualBrief: "Product-Shot Auto + großer Preis-Badge in HDI-Grün.",
    goal: "Direct Conversion",
  },
  {
    title: "Event Reminder",
    platform: "Instagram",
    status: "incomplete",
    time: "17:00",
    audience: "Makler & Partner",
    format: "Story-Countdown",
    caption:
      "Noch 3 Tage bis zum HDI Partner-Webinar „Cyber für den Mittelstand\". Sei dabei.",
    hashtags: ["#HDIPartner", "#Cyber"],
    cta: "Kostenlos anmelden",
    visualBrief: "Countdown-Sticker + Speaker-Portraits als Kachel.",
    goal: "Event-Registrierungen",
  },
  {
    title: "Weekend Post",
    platform: "Facebook",
    status: "approved",
    time: "10:30",
    audience: "Broad · Community",
    format: "Feel-Good Single Image",
    caption:
      "Wochenende. Zeit für die Menschen, die zählen. Wir kümmern uns um den Rest. 💚",
    hashtags: ["#HDI", "#Wochenende"],
    cta: "—",
    visualBrief: "Warmes Familienbild im Park, natürliche Farben.",
    goal: "Brand Warmth",
  },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CalendarAppMockProps {
  /** Start month for the calendar (year, month 0-11). Defaults to current month. */
  periodStart?: { year: number; month: number };
  /** End month (inclusive) - limits navigation. */
  periodEnd?: { year: number; month: number };
}

const CalendarAppMock = ({ periodStart, periodEnd }: CalendarAppMockProps) => {
  const [tab, setTab] = useState<"calendar" | "approved">("calendar");
  const [platform, setPlatform] = useState<Platform>("all");

  const initial = periodStart ?? { year: new Date().getFullYear(), month: new Date().getMonth() };
  const [current, setCurrent] = useState(initial);

  // Re-sync when the period from the parent changes
  useEffect(() => {
    if (periodStart) setCurrent(periodStart);
  }, [periodStart?.year, periodStart?.month]);

  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const firstWeekday = new Date(current.year, current.month, 1).getDay(); // 0=Sun

  // Distribute template events across the actual days of the month
  const events: CalEvent[] = EVENT_TEMPLATE.map((e, i) => {
    const day = Math.min(daysInMonth, Math.round(((i + 1) / (EVENT_TEMPLATE.length + 1)) * daysInMonth));
    return { ...e, day };
  }).filter((e, i, arr) => arr.findIndex((x) => x.day === e.day) === i);

  const visibleEvents = events.filter((e) => {
    if (platform === "facebook") return e.platform === "Facebook";
    if (platform === "instagram") return e.platform === "Instagram";
    return true;
  });

  const eventFor = (day: number) => visibleEvents.find((e) => e.day === day) ?? null;

  // Leading days from previous month
  const prevMonthDays = new Date(current.year, current.month, 0).getDate();
  const leading = Array.from({ length: firstWeekday }, (_, i) => prevMonthDays - firstWeekday + 1 + i);

  const cells: { day: number; outside: boolean }[] = [
    ...leading.map((d) => ({ day: d, outside: true })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, outside: false })),
  ];
  let trailing = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: trailing++, outside: true });
  }

  const monthLabel = `${MONTH_NAMES[current.month]} ${current.year}`;

  const canGoPrev = periodStart
    ? current.year > periodStart.year || (current.year === periodStart.year && current.month > periodStart.month)
    : true;
  const canGoNext = periodEnd
    ? current.year < periodEnd.year || (current.year === periodEnd.year && current.month < periodEnd.month)
    : true;

  const goPrev = () => {
    if (!canGoPrev) return;
    const m = current.month === 0 ? 11 : current.month - 1;
    const y = current.month === 0 ? current.year - 1 : current.year;
    setCurrent({ year: y, month: m });
  };
  const goNext = () => {
    if (!canGoNext) return;
    const m = current.month === 11 ? 0 : current.month + 1;
    const y = current.month === 11 ? current.year + 1 : current.year;
    setCurrent({ year: y, month: m });
  };

  const eventStyles: Record<EventStatus, string> = {
    incomplete: "border-blue-200 bg-blue-50 text-blue-700",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="px-6 md:px-10 max-w-6xl mx-auto py-6">
      {/* Title */}
      <div className="mb-5 flex items-center gap-4">
        <img src={hdiLogoAsset.url} alt="HDI" className="h-9 w-auto" />
        <div className="h-9 w-px bg-border" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Calendar App</h1>
          <p className="text-muted-foreground mt-1">Plan, create, and manage your social media content.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-border mb-6">
        {([
          { id: "calendar", label: "Calendar" },
          { id: "approved", label: "Approved Content" },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative pb-3 text-sm font-medium transition-colors",
              tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Calendar card */}
        <Card className="p-5 bg-white border-border">
          {tab === "calendar" ? (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={goPrev} disabled={!canGoPrev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={goNext} disabled={!canGoNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <button className="flex items-center gap-1.5 text-lg font-semibold text-foreground ml-1">
                    {monthLabel} <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {periodStart && (
                    <Button variant="outline" size="sm" className="ml-2" onClick={() => setCurrent(periodStart)}>
                      Jump to start
                    </Button>
                  )}
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> All Platforms
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              {/* Platform pills */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <PlatformPill active={platform === "all"} onClick={() => setPlatform("all")} icon={LayoutGrid} label="All Platforms" />
                <PlatformPill active={platform === "facebook"} onClick={() => setPlatform("facebook")} icon={Facebook} label="Facebook" />
                <PlatformPill active={platform === "instagram"} onClick={() => setPlatform("instagram")} icon={Instagram} label="Instagram" />
              </div>

              {/* Calendar grid */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-7 border-b border-border">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="px-2 py-2.5 text-xs font-medium text-muted-foreground text-center">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {cells.map((cell, i) => {
                    const entry = !cell.outside ? eventFor(cell.day) : null;
                    return (
                      <div
                        key={i}
                        className="min-h-[96px] border-b border-r border-border/60 p-1.5 [&:nth-child(7n)]:border-r-0"
                      >
                        <p className={cn("text-xs mb-1 text-center", cell.outside ? "text-muted-foreground/50" : "text-foreground")}>
                          {cell.day}
                        </p>
                        {entry && (
                          <div className={cn("rounded-md border px-2 py-1.5 text-[11px] leading-tight", eventStyles[entry.status])}>
                            <p className="font-semibold truncate">{entry.title}</p>
                            <p className="opacity-70 truncate">{entry.platform}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-4">
                <LegendDot className="bg-blue-500" label="Incomplete / Needs Content" />
                <LegendDot className="bg-emerald-500" label="Finalized / Approved" />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              {events.filter((e) => e.status === "approved").map((e) => (
                <div key={e.day} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                  <div className="w-12 text-center shrink-0">
                    <p className="text-[11px] text-muted-foreground">{MONTH_NAMES[current.month].slice(0, 3)}</p>
                    <p className="text-lg font-bold text-foreground leading-none">{e.day}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.platform}</p>
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Approved
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Workflow sidebar */}
        <Card className="p-5 bg-muted/30 border-border h-fit">
          <h2 className="text-lg font-semibold text-foreground">Start a Workflow</h2>
          <p className="text-sm text-muted-foreground mt-0.5 mb-4">Choose a workflow to get started.</p>
          <div className="space-y-3">
            <WorkflowCard
              icon={CalendarDays}
              title="Managerial Planning Workflow"
              desc="Plan and approve your content calendar"
            />
            <WorkflowCard
              icon={Pencil}
              title="Content Creation Workflow"
              desc="Create content for calendar items"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const PlatformPill = ({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
      active ? "border-primary bg-primary/5 text-primary" : "border-border bg-white text-foreground hover:border-primary/40"
    )}
  >
    <Icon className="h-4 w-4" /> {label}
  </button>
);

const LegendDot = ({ className, label }: { className: string; label: string }) => (
  <div className="flex items-center gap-2">
    <span className={cn("h-3.5 w-3.5 rounded-sm", className)} />
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);

const WorkflowCard = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <button className="w-full text-left flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-colors hover:border-primary/40">
    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
      <Icon className="h-5 w-5 text-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
    <ArrowR className="h-4 w-4 text-muted-foreground shrink-0" />
  </button>
);

export default CalendarAppMock;
