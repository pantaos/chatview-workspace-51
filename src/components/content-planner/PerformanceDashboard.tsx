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
  Info,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Lightbulb,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import hdiLogo from "@/assets/hdi-logo.png.asset.json";

interface Props {
  lang: CPLang;
}

const spark = (base: number, delta: number) =>
  Array.from({ length: 14 }, (_, i) => ({
    v: base + Math.sin(i / 2) * (base * 0.05) + (i / 13) * delta + Math.random() * (base * 0.02),
  }));

const GREEN = "hsl(142 71% 32%)";
const GREEN_SOFT = "hsl(142 60% 92%)";
const GREEN_TINT = "hsl(142 50% 96%)";

const PerformanceDashboard = ({ lang }: Props) => {
  const de = lang === "de";
  const [channel, setChannel] = useState("all");
  const [period, setPeriod] = useState("jun2026");

  const t = {
    title: de ? "Performance Dashboard" : "Performance Dashboard",
    subtitle: de
      ? "Alle Kennzahlen im Vergleich zum 1 – 31 Mai 2026"
      : "All metrics vs. 1 – 31 May 2026",
    allChannels: de ? "Alle Kanäle" : "All channels",
    export: de ? "Report exportieren" : "Export report",
    funnelTitle: de ? "Funnel: Vom Lead zum Vertrag" : "Funnel: From lead to contract",
    campTitle: de ? "Kampagnen nach Business Impact (Top 5)" : "Top campaigns by business impact",
    campHeaders: de
      ? ["Kampagne", "Neue Leads", "Abschlüsse"]
      : ["Campaign", "New leads", "Contracts"],
    allCamps: de ? "Alle Kampagnen anzeigen" : "View all campaigns",
    topProducts: de ? "Top Produkte nach Abschlüssen" : "Top products by contracts",
    topContent: de ? "Content mit den meisten Abschlüssen" : "Content with most contracts",
    contentHeaders: de ? ["Content", "Abschlüsse"] : ["Content", "Contracts"],
    allContent: de ? "Alle Contents anzeigen" : "View all content",
    aiInsights: "AI Insights",
    allInsights: de ? "Alle Insights anzeigen" : "View all insights",
    vs: de ? "vs. Mai 2026" : "vs. May 2026",
    dataAsOf: de
      ? "Datenstand: 2. Juni 2026, 08:30 Uhr · Die angezeigten Daten können durch nachträgliche Verarbeitungen noch abweichen."
      : "Data as of: 2 June 2026, 08:30 · Values may still change through post-processing.",
  };

  const kpis = [
    { icon: Users, label: de ? "Neue Leads" : "New leads", value: "2.481", delta: "+18 %", prev: "2.099", data: spark(2000, 500) },
    { icon: Calculator, label: de ? "Angebotsrechner abgeschlossen" : "Quote calc. completed", value: "1.294", delta: "+22 %", prev: "1.060", data: spark(1000, 300) },
    { icon: FileText, label: de ? "Neue Angebote erstellt" : "New quotes created", value: "842", delta: "+15 %", prev: "732", data: spark(700, 150) },
    { icon: CheckCircle2, label: de ? "Abgeschlossene Verträge" : "Contracts closed", value: "486", delta: "+11 %", prev: "437", data: spark(430, 60) },
    { icon: Filter, label: de ? "Lead → Abschluss Conversion" : "Lead → close conversion", value: "19,8 %", delta: "+2,3 %-Punkte", prev: "17,5 %", data: spark(17, 3) },
  ];

  const funnel = [
    { label: de ? "Neue Leads" : "New leads", value: "2.481", delta: "+18 %", pct: "100 %" },
    { label: de ? "Angebotsrechner abgeschlossen" : "Quote calc. completed", value: "1.294", delta: "+22 %", pct: "52,1 %" },
    { label: de ? "Neue Angebote erstellt" : "New quotes created", value: "842", delta: "+15 %", pct: "33,9 %" },
    { label: de ? "Abgeschlossene Verträge" : "Contracts closed", value: "486", delta: "+11 %", pct: "19,8 %" },
  ];

  const campaigns = [
    { name: de ? "Unfallversicherung – Sommer" : "Accident insurance – summer", leads: "542", closes: 126 },
    { name: de ? "Berufsunfähigkeitsversicherung" : "Disability insurance", leads: "451", closes: 98 },
    { name: de ? "Kfz-Versicherung Wechsel" : "Auto insurance switch", leads: "381", closes: 72 },
    { name: de ? "Privathaftpflicht Aktion" : "Private liability promo", leads: "312", closes: 61 },
    { name: de ? "Hausratversicherung – Schutz" : "Home contents – protect", leads: "298", closes: 54 },
  ];

  const products = [
    { name: de ? "Kfz-Versicherung" : "Auto", value: 162, share: "33,3 %", color: "hsl(142 71% 32%)" },
    { name: de ? "Berufsunfähigkeitsversicherung" : "Disability", value: 114, share: "23,5 %", color: "hsl(142 65% 42%)" },
    { name: de ? "Privathaftpflicht" : "Private liability", value: 76, share: "15,6 %", color: "hsl(142 55% 55%)" },
    { name: de ? "Hausratversicherung" : "Home contents", value: 58, share: "11,9 %", color: "hsl(142 45% 68%)" },
    { name: de ? "Unfallversicherung" : "Accident", value: 49, share: "10,1 %", color: "hsl(142 40% 78%)" },
    { name: de ? "Sonstige" : "Other", value: 27, share: "5,6 %", color: "hsl(142 25% 88%)" },
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

  return (
    <div className="px-6 md:px-10 max-w-[1400px] mx-auto pt-8 pb-12 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <img src={hdiLogo.url} alt="HDI" className="h-9 w-auto" />
          <div className="h-9 w-px bg-border" />
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {t.title}
              <Info className="h-4 w-4 text-muted-foreground" />
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[220px] bg-white">
              <CalendarIcon className="h-4 w-4" />
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
            <SelectTrigger className="w-[160px] bg-white">
              <Filter className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allChannels}</SelectItem>
              <SelectItem value="web">Website / Blog</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white">
            <Download className="h-4 w-4" />
            {t.export}
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="p-4 bg-white border-border">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground leading-tight">{k.label}</p>
                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-3">{k.value}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: GREEN }}>↑ {k.delta}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t.vs} ({k.prev})</p>
              <div className="h-8 mt-2 -mx-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={k.data}>
                    <Line type="monotone" dataKey="v" stroke={GREEN} strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Funnel + Campaigns */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5 bg-white border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-4">
            {t.funnelTitle}
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </h3>
          <div className="grid grid-cols-4 gap-1.5">
            {funnel.map((f, i) => (
              <div key={f.label} className="relative">
                <div
                  className="rounded-lg p-3 text-center"
                  style={{
                    backgroundColor: `hsl(142 55% ${96 - i * 6}%)`,
                    clipPath: i < funnel.length - 1 ? "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)" : "none",
                  }}
                >
                  <p className="text-[11px] font-medium text-foreground/80 leading-tight min-h-[28px]">{f.label}</p>
                  <p className="text-xl font-bold text-foreground mt-2">{f.value}</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: GREEN }}>↑ {f.delta}</p>
                </div>
                <p className="text-[11px] text-muted-foreground text-center mt-2">{f.pct}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 bg-white border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-4">
            {t.campTitle}
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left font-medium pb-2">{t.campHeaders[0]}</th>
                <th className="text-right font-medium pb-2">{t.campHeaders[1]}</th>
                <th className="text-right font-medium pb-2">{t.campHeaders[2]}</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.name} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 text-foreground">{c.name}</td>
                  <td className="py-2.5 text-right text-foreground">{c.leads}</td>
                  <td className="py-2.5 text-right text-foreground">{c.closes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="text-sm font-medium mt-3 flex items-center gap-1" style={{ color: GREEN }}>
            {t.allCamps} <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </Card>
      </div>

      {/* Products + Content + Insights */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 bg-white border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-4">
            {t.topProducts}
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={products} dataKey="value" innerRadius={38} outerRadius={60} paddingAngle={2}>
                    {products.map((p) => (
                      <Cell key={p.name} fill={p.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5 text-xs">
              {products.map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-foreground flex-1 truncate">{p.name}</span>
                  <span className="text-muted-foreground tabular-nums">{p.value} ({p.share})</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-4">
            {t.topContent}
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left font-medium pb-2">{t.contentHeaders[0]}</th>
                <th className="text-right font-medium pb-2">{t.contentHeaders[1]}</th>
              </tr>
            </thead>
            <tbody>
              {contentRows.map((r) => (
                <tr key={r.title} className="border-b border-border/50 last:border-0">
                  <td className="py-2 text-foreground pr-2">{r.title}</td>
                  <td className="py-2 text-right text-foreground tabular-nums">{r.closes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="text-sm font-medium mt-3 flex items-center gap-1" style={{ color: GREEN }}>
            {t.allContent} <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </Card>

        <Card className="p-5 bg-white border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-4">
            {t.aiInsights}
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </h3>
          <div className="space-y-3">
            {insights.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: GREEN_SOFT }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: GREEN }} />
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{ins.text}</p>
                </div>
              );
            })}
          </div>
          <button className="text-sm font-medium mt-4 flex items-center gap-1" style={{ color: GREEN }}>
            {t.allInsights} <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </Card>
      </div>

      <p className="text-[11px] text-muted-foreground pt-2">{t.dataAsOf}</p>
    </div>
  );
};

export default PerformanceDashboard;
