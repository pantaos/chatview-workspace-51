import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Sparkles,
  Clock,
  TrendingUp,
  Zap,
  ArrowRight,
  Calculator,
  Euro,
  Timer,
  BarChart3,
} from "lucide-react";
import { CPLang } from "./i18n";
import hdiLogo from "@/assets/hdi-logo.png.asset.json";

interface Props {
  lang: CPLang;
  onJumpToPlanner?: () => void;
}

// HDI palette
const HDI_GREEN = "#8FB03E";
const HDI_DARK = "#2C6E31";

const ExecutiveHero = ({ lang, onJumpToPlanner }: Props) => {
  const de = lang === "de";

  // ROI Calculator inputs
  const [postsPerMonth, setPostsPerMonth] = useState(40);
  const [hoursPerPost, setHoursPerPost] = useState(4);
  const [hourlyRate, setHourlyRate] = useState(85);

  const roi = useMemo(() => {
    const minutesWithFlows = 4;
    const hoursWithFlows = (postsPerMonth * minutesWithFlows) / 60;
    const hoursBefore = postsPerMonth * hoursPerPost;
    const hoursSavedMonth = hoursBefore - hoursWithFlows;
    const hoursSavedYear = hoursSavedMonth * 12;
    const costBefore = hoursBefore * hourlyRate;
    const costAfter = hoursWithFlows * hourlyRate;
    const savingsMonth = costBefore - costAfter;
    const savingsYear = savingsMonth * 12;
    const fteEquivalent = hoursSavedYear / 1600; // ~1600 productive hrs / FTE / year
    const percentSaved = (hoursSavedMonth / hoursBefore) * 100;
    return {
      hoursBefore,
      hoursWithFlows,
      hoursSavedMonth,
      hoursSavedYear,
      savingsMonth,
      savingsYear,
      fteEquivalent,
      percentSaved,
    };
  }, [postsPerMonth, hoursPerPost, hourlyRate]);

  const fmtEuro = (n: number) =>
    n.toLocaleString(de ? "de-DE" : "en-US", { maximumFractionDigits: 0 });
  const fmtNum = (n: number, d = 0) =>
    n.toLocaleString(de ? "de-DE" : "en-US", { maximumFractionDigits: d, minimumFractionDigits: d });

  return (
    <div className="px-6 md:px-10 max-w-6xl mx-auto py-8 space-y-8">
      {/* Hero */}
      <div className="rounded-3xl overflow-hidden border border-border shadow-sm">
        <div
          className="relative p-8 md:p-12"
          style={{
            background: `linear-gradient(135deg, ${HDI_DARK} 0%, #1B4D3E 60%, #143b30 100%)`,
          }}
        >
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: HDI_GREEN }} />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: HDI_GREEN }} />

          <div className="relative flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold mb-4 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {de ? "Executive Summary · HDI Marketing" : "Executive summary · HDI Marketing"}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                {de ? (
                  <>Von 4 Stunden pro Post <br />zu 4 Minuten.</>
                ) : (
                  <>From 4 hours per post <br />to 4 minutes.</>
                )}
              </h1>
              <p className="text-white/80 mt-4 text-base md:text-lg leading-relaxed">
                {de
                  ? "PANTA Flows verwandelt HDIs Redaktionsplanung von manueller Recherche in einen KI-gestützten Workflow — von der Trendanalyse bis zum fertigen, freigabebereiten Post. Skaliert Content, ohne das Team zu vergrößern."
                  : "PANTA Flows turns HDI's editorial planning from manual research into an AI-powered workflow — from trend analysis to publish-ready posts. Scale content without growing the team."}
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button
                  size="lg"
                  className="bg-white text-[#1B4D3E] hover:bg-white/90 font-semibold"
                  onClick={onJumpToPlanner}
                >
                  {de ? "Zum Live-Workflow" : "Go to live workflow"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <a href="#roi">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Calculator className="h-4 w-4" />
                    {de ? "ROI berechnen" : "Calculate ROI"}
                  </Button>
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[200px]">
              <img src={hdiLogo.url} alt="HDI" className="h-8 w-auto mb-3 opacity-90 brightness-0 invert" />
              <p className="text-xs text-white/70 uppercase tracking-wide font-semibold">
                {de ? "Pilotphase" : "Pilot phase"}
              </p>
              <p className="text-2xl font-bold text-white mt-1">Q3 2026</p>
            </div>
          </div>

          {/* Before / After strip */}
          <div className="relative grid md:grid-cols-3 gap-3 mt-8">
            <div className="rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wide">
                <Clock className="h-3.5 w-3.5" />
                {de ? "Vorher" : "Before"}
              </div>
              <p className="text-white text-lg font-bold mt-2 leading-tight">
                {de ? "4 h pro Post" : "4 h per post"}
              </p>
              <p className="text-white/70 text-xs mt-1">
                {de ? "Recherche, Briefing, Draft, Abstimmung" : "Research, briefing, draft, alignment"}
              </p>
            </div>
            <div className="rounded-xl bg-white/15 border border-white/25 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wide">
                <Zap className="h-3.5 w-3.5" style={{ color: HDI_GREEN }} />
                {de ? "Mit PANTA Flows" : "With PANTA Flows"}
              </div>
              <p className="text-white text-lg font-bold mt-2 leading-tight">
                {de ? "≈ 4 Minuten pro Post" : "≈ 4 minutes per post"}
              </p>
              <p className="text-white/70 text-xs mt-1">
                {de ? "Trends → Ideen → Post in einem Flow" : "Trends → ideas → post in one flow"}
              </p>
            </div>
            <div className="rounded-xl p-4 border" style={{ background: `linear-gradient(135deg, ${HDI_GREEN} 0%, #6d8a2e 100%)`, borderColor: HDI_GREEN }}>
              <div className="flex items-center gap-2 text-white/90 text-xs font-semibold uppercase tracking-wide">
                <TrendingUp className="h-3.5 w-3.5" />
                {de ? "Effekt" : "Impact"}
              </div>
              <p className="text-white text-lg font-bold mt-2 leading-tight">
                {de ? "60× schneller · 4× Output" : "60× faster · 4× output"}
              </p>
              <p className="text-white/90 text-xs mt-1">
                {de ? "Bei gleichem Team, höherer Qualität" : "Same team, higher quality"}
              </p>
            </div>
          </div>
        </div>

        {/* Metric row */}
        <div className="bg-white grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-t border-border">
          {[
            { label: de ? "Zeit pro Post" : "Time per post", value: "-95 %", sub: de ? "4 h → 4 min" : "4h → 4min" },
            { label: de ? "Content-Output" : "Content output", value: "+280 %", sub: de ? "vs. Q1 2026" : "vs. Q1 2026" },
            { label: de ? "Lead → Abschluss" : "Lead → close", value: "19,8 %", sub: de ? "+2,3 %-Punkte" : "+2.3 pp" },
            { label: de ? "Ø Qualitäts-Score" : "Avg. quality score", value: "8,7 / 10", sub: de ? "Editorial Review" : "Editorial review" },
          ].map((m) => (
            <div key={m.label} className="p-5 text-center">
              <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
              <p className="text-2xl md:text-3xl font-bold mt-1" style={{ color: HDI_DARK }}>
                {m.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Calculator */}
      <Card id="roi" className="p-6 md:p-8 bg-white border-border">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: HDI_GREEN }}>
              <Calculator className="h-3.5 w-3.5" />
              {de ? "ROI-Rechner" : "ROI calculator"}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mt-1">
              {de ? "Zeitersparnis & Kostenimpact — live berechnen" : "Time savings & cost impact — live"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {de
                ? "Passe die Parameter an eure Realität an. Alle Zahlen aktualisieren sich sofort."
                : "Adjust the parameters to your reality. All numbers update instantly."}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 mt-6">
          {/* Sliders */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">{de ? "Posts pro Monat" : "Posts per month"}</Label>
                <span className="text-sm font-bold text-foreground">{postsPerMonth}</span>
              </div>
              <Slider
                value={[postsPerMonth]}
                onValueChange={(v) => setPostsPerMonth(v[0])}
                min={5}
                max={200}
                step={5}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                <span>5</span><span>200</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">{de ? "Stunden pro Post (heute)" : "Hours per post (today)"}</Label>
                <span className="text-sm font-bold text-foreground">{hoursPerPost} h</span>
              </div>
              <Slider
                value={[hoursPerPost]}
                onValueChange={(v) => setHoursPerPost(v[0])}
                min={1}
                max={10}
                step={0.5}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                <span>1 h</span><span>10 h</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">{de ? "Ø Stundensatz" : "Avg. hourly rate"}</Label>
                <span className="text-sm font-bold text-foreground">{fmtEuro(hourlyRate)} €</span>
              </div>
              <Slider
                value={[hourlyRate]}
                onValueChange={(v) => setHourlyRate(v[0])}
                min={40}
                max={200}
                step={5}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                <span>40 €</span><span>200 €</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-[#F8F9FD] p-4 text-xs text-muted-foreground leading-relaxed">
              {de
                ? "Basis: PANTA Flows reduziert die Bearbeitungszeit pro Post auf ≈ 4 Minuten (Trend → Idee → Draft → Freigabe). Basierend auf HDI-Pilot Q1/Q2 2026."
                : "Baseline: PANTA Flows reduces time per post to ≈ 4 minutes (trend → idea → draft → approval). Based on HDI pilot Q1/Q2 2026."}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-3">
            <ResultCard
              icon={<Timer className="h-4 w-4" />}
              label={de ? "Zeitersparnis / Monat" : "Time saved / month"}
              value={`${fmtNum(roi.hoursSavedMonth, 0)} h`}
              sub={de ? `von ${fmtNum(roi.hoursBefore)} h auf ${fmtNum(roi.hoursWithFlows, 1)} h` : `from ${fmtNum(roi.hoursBefore)} h to ${fmtNum(roi.hoursWithFlows, 1)} h`}
              tone="light"
            />
            <ResultCard
              icon={<Timer className="h-4 w-4" />}
              label={de ? "Zeitersparnis / Jahr" : "Time saved / year"}
              value={`${fmtNum(roi.hoursSavedYear, 0)} h`}
              sub={de ? `≈ ${fmtNum(roi.fteEquivalent, 1)} FTE freigespielt` : `≈ ${fmtNum(roi.fteEquivalent, 1)} FTE freed`}
              tone="light"
            />
            <ResultCard
              icon={<Euro className="h-4 w-4" />}
              label={de ? "Kostenersparnis / Monat" : "Cost saved / month"}
              value={`${fmtEuro(roi.savingsMonth)} €`}
              sub={de ? `bei ${fmtEuro(hourlyRate)} €/h` : `at ${fmtEuro(hourlyRate)} €/h`}
              tone="light"
            />
            <ResultCard
              icon={<Euro className="h-4 w-4" />}
              label={de ? "Kostenersparnis / Jahr" : "Cost saved / year"}
              value={`${fmtEuro(roi.savingsYear)} €`}
              sub={de ? "Vollkosten-Basis" : "Fully loaded"}
              tone="dark"
            />
            <div
              className="sm:col-span-2 rounded-2xl p-5 border flex items-center justify-between gap-4 flex-wrap"
              style={{ background: `linear-gradient(135deg, ${HDI_GREEN} 0%, #6d8a2e 100%)`, borderColor: HDI_GREEN }}
            >
              <div>
                <div className="flex items-center gap-2 text-white/90 text-xs font-semibold uppercase tracking-wide">
                  <BarChart3 className="h-3.5 w-3.5" />
                  {de ? "Effizienzgewinn" : "Efficiency gain"}
                </div>
                <p className="text-white text-3xl font-bold mt-1">
                  {fmtNum(roi.percentSaved, 1)} %
                </p>
                <p className="text-white/90 text-xs mt-0.5">
                  {de
                    ? `${fmtNum(roi.hoursSavedYear, 0)} Stunden pro Jahr für Strategie & Kreation frei`
                    : `${fmtNum(roi.hoursSavedYear, 0)} hours per year freed for strategy & creation`}
                </p>
              </div>
              <Button
                size="lg"
                className="bg-white text-[#1B4D3E] hover:bg-white/90 font-semibold"
                onClick={onJumpToPlanner}
              >
                {de ? "Workflow starten" : "Start workflow"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

function ResultCard({
  icon,
  label,
  value,
  sub,
  tone = "light",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  return (
    <div
      className="rounded-2xl border p-4"
      style={
        isDark
          ? { background: `linear-gradient(135deg, ${HDI_DARK} 0%, #1B4D3E 100%)`, borderColor: HDI_DARK }
          : { background: "#F8F9FD", borderColor: "hsl(var(--border))" }
      }
    >
      <div
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide"
        style={{ color: isDark ? "rgba(255,255,255,0.8)" : HDI_GREEN }}
      >
        {icon}
        {label}
      </div>
      <p
        className="text-2xl md:text-3xl font-bold mt-2"
        style={{ color: isDark ? "#fff" : HDI_DARK }}
      >
        {value}
      </p>
      <p
        className="text-xs mt-1"
        style={{ color: isDark ? "rgba(255,255,255,0.75)" : "hsl(var(--muted-foreground))" }}
      >
        {sub}
      </p>
    </div>
  );
}

export default ExecutiveHero;
