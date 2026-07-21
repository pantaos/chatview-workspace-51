import { useState } from "react";
import {
  Users,
  Calculator,
  FileText,
  CheckCircle2,
  Filter,
  Download,
  Calendar as CalendarIcon,
  ChevronRight,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Lightbulb,
  Zap,
  Target,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { CPLang } from "./i18n";

interface Props {
  lang: CPLang;
}

const spark = (base: number, delta: number) =>
  Array.from({ length: 14 }, (_, i) => ({
    v: base + Math.sin(i / 2) * (base * 0.05) + (i / 13) * delta + Math.random() * (base * 0.02),
  }));

// HDI brand palette — offizielle Farbreihenfolge
const HDI_UNIVERSALGRUEN = "#8FB03E"; // 1
const HDI_GRUEN = "#2C6E31";          // 2
const HDI_HELLBLAU = "#00A3A8";       // 3
const HDI_BLAU = "#003960";           // 4
const HDI_DUNKELROT = "#8D1429";      // 5
const HDI_OCKER = "#DB6301";          // 6
const HDI_GELBOCKER = "#FF9900";      // 7
const HDI_GRAU = "#6E6E6E";           // 8
const HDI_MITTELGRAU = "#A6A6A6";     // 9
const HDI_HELLGRAU = "#D0D0D0";       // 10

const DARK_GREEN = "#1B4D3E";
const GREEN = HDI_UNIVERSALGRUEN;

const InfoButton = ({ text }: { text: string }) => (
  <Tooltip delayDuration={100}>
    <TooltipTrigger asChild>
      <button
        type="button"
        aria-label="Info"
        className="inline-flex items-center justify-center rounded-full p-1 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <Info className="h-3.5 w-3.5 text-white/40 hover:text-white/70" />
      </button>
    </TooltipTrigger>
    <TooltipContent
      side="top"
      className="max-w-[260px] bg-[#0f2a22] border-white/10 text-white/90 text-xs leading-relaxed"
    >
      {text}
    </TooltipContent>
  </Tooltip>
);

const PerformanceDashboard = ({ lang }: Props) => {
  const de = lang === "de";
  const [channel, setChannel] = useState("all");
  const [period, setPeriod] = useState("jun2026");

  const t = {
    eyebrow: de ? "Analytics Overview" : "Analytics Overview",
    title: de ? "Performance" : "Performance",
    titleBold: de ? "Dashboard" : "Dashboard",
    last30: de ? "Letzte 30 Tage" : "Last 30 days",
    export: de ? "Report exportieren" : "Export report",
    funnelTitle: de ? "Conversion Funnel" : "Conversion Funnel",
    actual: de ? "Ist" : "Actual",
    target: de ? "Ziel" : "Target",
    campTitle: de ? "Kampagnen nach Business Impact (Top 5)" : "Top campaigns by business impact",
    campHeaders: de
      ? ["Kampagne", "Neue Leads", "Abschlüsse"]
      : ["Campaign", "New leads", "Contracts"],
    allCamps: de ? "Alle Kampagnen anzeigen" : "View all campaigns",
    topProducts: de ? "Top Produkte nach Abschlüssen" : "Top products by contracts",
    topContent: de ? "Content mit den meisten Abschlüssen" : "Content with most contracts",
    contentHeaders: de ? ["Content", "Abschlüsse"] : ["Content", "Contracts"],
    allContent: de ? "Alle Contents anzeigen" : "View all content",
    aiInsights: de ? "KI-Erkenntnisse" : "AI Insights",
    allInsights: de ? "Alle Insights anzeigen" : "View all insights",
    aiScore: de ? "KI Performance Score" : "AI Performance Score",
    aiScoreSub: de
      ? "12 % über dem Branchen-Durchschnitt für Versicherer."
      : "12 % above insurance industry baseline.",
    vs: de ? "vs. Mai 2026" : "vs. May 2026",
    dataAsOf: de
      ? "Datenstand: 2. Juni 2026, 08:30 Uhr · Die angezeigten Daten können durch nachträgliche Verarbeitungen noch abweichen."
      : "Data as of: 2 June 2026, 08:30 · Values may still change through post-processing.",
  };

  const kpis = [
    { icon: Users, label: de ? "Neue Leads" : "New leads", value: "2.481", delta: "+18 %", prev: "2.099", pct: 78, color: GREEN },
    { icon: Calculator, label: de ? "Angebotsrechner" : "Quote calculator", value: "1.294", delta: "+22 %", prev: "1.060", pct: 62, color: "#C8D55A" },
    { icon: FileText, label: de ? "Neue Angebote" : "New quotes", value: "842", delta: "+15 %", prev: "732", pct: 55, color: "#6BB0B0" },
    { icon: CheckCircle2, label: de ? "Verträge" : "Contracts", value: "486", delta: "+11 %", prev: "437", pct: 48, color: HDI_HELLBLAU },
    { icon: Target, label: de ? "Conversion" : "Conversion", value: "19,8 %", delta: "+2,3 PP", prev: "17,5 %", pct: 82, color: HDI_BLAU, isScore: true },
  ];

  const funnel = [
    { label: de ? "Awareness" : "Awareness", value: "940k", pct: 94, color: GREEN, width: "100%" },
    { label: de ? "Interest" : "Interest", value: "420k", pct: 42, color: "#C8D55A", width: "78%" },
    { label: de ? "Consideration" : "Consideration", value: "180k", pct: 18, color: "#6BB0B0", width: "56%" },
    { label: de ? "Action" : "Action", value: "31k", pct: 3.1, color: HDI_BLAU, width: "34%" },
  ];

  const campaigns = [
    { name: de ? "Unfallversicherung – Sommer" : "Accident insurance – summer", leads: "542", closes: 126 },
    { name: de ? "Berufsunfähigkeitsversicherung" : "Disability insurance", leads: "451", closes: 98 },
    { name: de ? "Kfz-Versicherung Wechsel" : "Auto insurance switch", leads: "381", closes: 72 },
    { name: de ? "Privathaftpflicht Aktion" : "Private liability promo", leads: "312", closes: 61 },
    { name: de ? "Hausratversicherung – Schutz" : "Home contents – protect", leads: "298", closes: 54 },
  ];

  const products = [
    { name: de ? "Kfz-Versicherung" : "Auto", value: 162, share: "33,3 %", color: HDI_UNIVERSALGRUEN },
    { name: de ? "Berufsunfähigkeitsversicherung" : "Disability", value: 114, share: "23,5 %", color: HDI_GRUEN },
    { name: de ? "Privathaftpflicht" : "Private liability", value: 76, share: "15,6 %", color: HDI_HELLBLAU },
    { name: de ? "Hausratversicherung" : "Home contents", value: 58, share: "11,9 %", color: HDI_BLAU },
    { name: de ? "Unfallversicherung" : "Accident", value: 49, share: "10,1 %", color: HDI_OCKER },
    { name: de ? "Sonstige" : "Other", value: 27, share: "5,6 %", color: HDI_HELLGRAU },
  ];

  const contentRows = [
    { title: de ? "5 Dinge, die bei der BU wirklich zählen" : "5 things that really matter with disability cover", closes: 81 },
    { title: de ? "Kfz-Versicherung wechseln – so einfach geht's" : "Switching auto insurance – how easy it is", closes: 64 },
    { title: de ? "Unfallversicherung: Darum ist sie so wichtig" : "Accident cover: why it matters", closes: 42 },
    { title: de ? "Hausratversicherung: So schützen Sie Ihr Zuhause" : "Home contents: how to protect your home", closes: 37 },
    { title: de ? "Privathaftpflicht: Kleine Ursache, große Wirkung" : "Private liability: small cause, big effect", closes: 29 },
  ];

  const insights = [
    { icon: TrendingUp, text: de ? "Berufsunfähigkeitsversicherung ist aktuell das stärkste Wachstumsthema (+28 % Leads diese Woche)." : "Disability insurance is currently the strongest growth topic (+28% leads this week)." },
    { icon: Sparkles, text: de ? "Conversion im Angebotsrechner ist um 2,1 %-Punkte gestiegen – neuer Bestwert." : "Quote calculator conversion is up 2.1 pp — a new record." },
    { icon: MessageSquare, text: de ? "ChatGPT erwähnt HDI in 8 von 10 relevanten Suchanfragen zu Versicherungen." : "ChatGPT mentions HDI in 8 of 10 relevant insurance queries." },
    { icon: Lightbulb, text: de ? "2 neue Landingpages erzeugen 37 % aller Leads." : "2 new landing pages generate 37% of all leads." },
  ];

  const glassCard = "bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md";

  return (
    <div className="px-4 md:px-8 max-w-[1440px] mx-auto pt-6 pb-12">
      {/* Dark command center shell */}
      <div
        className="rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-[0_32px_64px_-12px_rgba(27,77,62,0.25)] relative overflow-hidden"
        style={{ backgroundColor: DARK_GREEN }}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 blur-[100px] -mr-48 -mt-48 pointer-events-none"
          style={{ backgroundColor: GREEN, opacity: 0.12 }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 blur-[90px] -ml-36 -mb-36 pointer-events-none"
          style={{ backgroundColor: HDI_HELLBLAU, opacity: 0.08 }}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 relative z-10">
          <div>
            <p className="font-bold tracking-widest text-xs uppercase mb-2" style={{ color: GREEN }}>
              {t.eyebrow}
            </p>
            <h2 className="text-white text-3xl md:text-4xl font-light italic">
              {t.title} <span className="font-bold not-italic">{t.titleBold}</span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger
                className="w-[180px] rounded-full border-white/10 text-white/80 bg-white/5 hover:bg-white/10"
              >
                <CalendarIcon className="h-4 w-4 text-white/60" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jun2026">1 – 30 {de ? "Juni" : "June"} 2026</SelectItem>
                <SelectItem value="may2026">1 – 31 {de ? "Mai" : "May"} 2026</SelectItem>
                <SelectItem value="q2">Q2 2026</SelectItem>
                <SelectItem value="ytd">{de ? "Jahr bis heute" : "Year to date"}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger
                className="w-[150px] rounded-full border-white/10 text-white/80 bg-white/5 hover:bg-white/10"
              >
                <Filter className="h-4 w-4 text-white/60" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{de ? "Alle Kanäle" : "All channels"}</SelectItem>
                <SelectItem value="web">Website / Blog</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="rounded-full font-semibold text-sm shadow-lg"
              style={{ backgroundColor: GREEN, color: DARK_GREEN }}
            >
              <Download className="h-4 w-4 mr-1.5" />
              {t.export}
            </Button>
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8 relative z-10">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div
                key={k.label}
                className={cn(glassCard, "p-5 transition hover:bg-white/[0.07]")}
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider leading-tight">
                    {k.label}
                  </p>
                  <Icon className="h-4 w-4 text-white/40 flex-shrink-0" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {k.value}
                  </span>
                  <span className="text-xs font-medium" style={{ color: k.color }}>
                    {k.delta}
                  </span>
                </div>
                <p className="text-[11px] text-white/40 mt-1">{t.vs} ({k.prev})</p>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${k.pct}%`, backgroundColor: k.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Main visuals: Funnel + Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          {/* Funnel */}
          <div className={cn(glassCard, "lg:col-span-2 p-6 md:p-8")}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">{t.funnelTitle}</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GREEN }} />
                  <span className="text-white/50 text-xs">{t.actual}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="text-white/50 text-xs">{t.target}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {funnel.map((f, i) => (
                <div key={f.label} className="relative">
                  <div className="flex justify-between text-xs text-white/40 mb-1.5 uppercase tracking-tighter">
                    <span>{f.label}</span>
                    <span>{f.value}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg transition-all"
                      style={{
                        width: f.width,
                        backgroundColor: f.color,
                        color: i === 0 || i === 1 ? DARK_GREEN : "#fff",
                        boxShadow: i === 0 ? `0 0 24px ${f.color}40` : undefined,
                      }}
                    >
                      {f.pct}%
                    </div>
                    <div className="h-12 flex-1 bg-white/5 rounded-xl border border-white/10 flex items-center px-4">
                      <span className="text-white/30 text-xs font-medium">
                        {100 - f.pct}% {t.target}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product distribution */}
          <div className={cn(glassCard, "p-6 md:p-8 flex flex-col")}>
            <h3 className="text-white font-semibold mb-6">{t.topProducts}</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-44 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={products}
                      dataKey="value"
                      innerRadius={42}
                      outerRadius={68}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {products.map((p) => (
                        <Cell key={p.name} fill={p.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-white text-2xl font-bold tracking-tighter">486</span>
                  <span className="text-white/40 text-[10px] uppercase font-bold">
                    {de ? "Verträge" : "Contracts"}
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 w-full">
                {products.slice(0, 4).map((p) => (
                  <div key={p.name} className="flex flex-col border-l-2 pl-3 min-w-0" style={{ borderColor: p.color }}>
                    <span className="text-white/40 text-[10px] uppercase font-bold truncate">{p.name}</span>
                    <span className="text-white font-bold text-sm">{p.share}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns + Content + AI Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          {/* Campaigns */}
          <div className={cn(glassCard, "p-6")}>
            <h3 className="text-white font-semibold mb-4">{t.campTitle}</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-white/40 border-b border-white/10">
                  <th className="text-left font-medium pb-2">{t.campHeaders[0]}</th>
                  <th className="text-right font-medium pb-2">{t.campHeaders[1]}</th>
                  <th className="text-right font-medium pb-2">{t.campHeaders[2]}</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.name} className="border-b border-white/5 last:border-0">
                    <td className="py-2.5 text-white/90 text-sm">{c.name}</td>
                    <td className="py-2.5 text-right text-white/90 tabular-nums text-sm">{c.leads}</td>
                    <td className="py-2.5 text-right text-white font-semibold tabular-nums text-sm">{c.closes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="text-sm font-semibold mt-4 flex items-center gap-1" style={{ color: GREEN }}>
              {t.allCamps} <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Content */}
          <div className={cn(glassCard, "p-6")}>
            <h3 className="text-white font-semibold mb-4">{t.topContent}</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-white/40 border-b border-white/10">
                  <th className="text-left font-medium pb-2">{t.contentHeaders[0]}</th>
                  <th className="text-right font-medium pb-2">{t.contentHeaders[1]}</th>
                </tr>
              </thead>
              <tbody>
                {contentRows.map((r) => (
                  <tr key={r.title} className="border-b border-white/5 last:border-0">
                    <td className="py-2 text-white/90 pr-2 text-sm">{r.title}</td>
                    <td className="py-2 text-right text-white font-semibold tabular-nums text-sm">{r.closes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="text-sm font-semibold mt-4 flex items-center gap-1" style={{ color: GREEN }}>
              {t.allContent} <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* AI Score + Insights */}
          <div className="space-y-6">
            <div
              className="rounded-3xl p-6 border"
              style={{ backgroundColor: `${GREEN}15`, borderColor: `${GREEN}40` }}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GREEN }}>
                  {t.aiScore}
                </p>
                <Zap className="h-5 w-5" style={{ color: GREEN }} />
              </div>
              <div className="text-4xl font-black text-white italic">
                84<span className="text-xl opacity-50">/100</span>
              </div>
              <p className="text-white/70 text-xs mt-3 leading-relaxed">{t.aiScoreSub}</p>
            </div>

            <div className={cn(glassCard, "p-6 flex-1")}>
              <h3 className="text-white font-semibold mb-4">{t.aiInsights}</h3>
              <div className="space-y-3">
                {insights.slice(0, 3).map((ins, i) => {
                  const Icon = ins.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${GREEN}20` }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: GREEN }} />
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">{ins.text}</p>
                    </div>
                  );
                })}
              </div>
              <button className="text-sm font-semibold mt-4 flex items-center gap-1" style={{ color: GREEN }}>
                {t.allInsights} <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* AI insights footer rail */}
        <div className="flex gap-4 overflow-x-auto pb-2 relative z-10">
          {insights.map((ins, i) => {
            const Icon = ins.icon;
            return (
              <div
                key={i}
                className="flex-none max-w-sm bg-white/5 border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-4"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: i === 0 ? `${HDI_BLAU}30` : "rgba(255,255,255,0.08)" }}
                >
                  <Icon className="h-5 w-5" style={{ color: i === 0 ? "#7BA7C7" : "rgba(255,255,255,0.7)" }} />
                </div>
                <p className="text-white/80 text-sm italic leading-relaxed">"{ins.text}"</p>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-white/30 mt-6 relative z-10">{t.dataAsOf}</p>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
