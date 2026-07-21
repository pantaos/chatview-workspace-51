import { Bot, Sparkles, TrendingUp, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CPLang } from "./i18n";

const HDI_UNIVERSALGRUEN = "#8FB03E";
const HDI_HELLBLAU = "#00A3A8";
const HDI_BLAU = "#003960";
const HDI_OCKER = "#DB6301";
const DARK_GREEN = "#1B4D3E";
const GREEN = HDI_UNIVERSALGRUEN;

const glassCard = "bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md";

const InfoDot = ({ text }: { text: string }) => (
  <Tooltip delayDuration={100}>
    <TooltipTrigger asChild>
      <button
        type="button"
        aria-label="Info"
        className="inline-flex items-center justify-center rounded-full p-1 hover:bg-white/10 transition-colors"
      >
        <Info className="h-3.5 w-3.5 text-white/40 hover:text-white/70" />
      </button>
    </TooltipTrigger>
    <TooltipContent
      side="top"
      sideOffset={8}
      className="z-[200] max-w-[280px] bg-[#0f2a22] border-white/10 text-white/90 text-xs leading-relaxed shadow-xl"
    >
      {text}
    </TooltipContent>
  </Tooltip>
);

interface Props {
  lang: CPLang;
}

const models = [
  { key: "ChatGPT", color: GREEN },
  { key: "Gemini", color: HDI_HELLBLAU },
  { key: "Perplexity", color: HDI_BLAU },
  { key: "Claude", color: HDI_OCKER },
];

const prompts = [
  { p: "Welche Berufsunfähigkeitsversicherung ist zu empfehlen?", en: "Which disability insurance do you recommend?", scores: [92, 74, 88, 61] },
  { p: "Wo kann ich meine Kfz-Versicherung wechseln?", en: "Where can I switch my car insurance?", scores: [81, 66, 79, 52] },
  { p: "Was leistet eine gute Privathaftpflicht?", en: "What does good private liability cover?", scores: [74, 58, 71, 44] },
  { p: "Beste Hausratversicherung 2026", en: "Best home contents insurance 2026", scores: [69, 51, 65, 39] },
  { p: "Unfallversicherung sinnvoll oder nicht?", en: "Is accident insurance worth it?", scores: [63, 48, 60, 35] },
  { p: "HDI vs. Allianz Vergleich", en: "HDI vs. Allianz comparison", scores: [88, 72, 85, 58] },
];

const share = [
  { brand: "HDI", pct: 27, color: GREEN, highlight: true },
  { brand: "Allianz", pct: 24, color: "#7BA7C7" },
  { brand: "AXA", pct: 16, color: "#C8D55A" },
  { brand: "Ergo", pct: 13, color: "#6BB0B0" },
  { brand: "HUK-Coburg", pct: 11, color: HDI_OCKER },
  { brand: "Andere", pct: 9, color: "rgba(255,255,255,0.25)" },
];

const heatColor = (score: number) => {
  if (score >= 80) return `${GREEN}`;
  if (score >= 65) return `${GREEN}B3`;
  if (score >= 50) return `${GREEN}66`;
  if (score >= 35) return `${HDI_OCKER}80`;
  return `${HDI_OCKER}40`;
};

const AIVisibility = ({ lang }: Props) => {
  const de = lang === "de";

  return (
    <div className="mb-8 relative z-10">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
        <div>
          <p className="font-bold tracking-widest text-xs uppercase mb-2" style={{ color: GREEN }}>
            {de ? "AI Search Analytics" : "AI Search Analytics"}
          </p>
          <h3 className="text-white text-2xl md:text-3xl font-light italic">
            {de ? "KI-" : "AI "}
            <span className="font-bold not-italic">
              {de ? "Sichtbarkeit" : "Visibility"}
            </span>
          </h3>
          <p className="text-white/50 text-sm mt-1 max-w-2xl">
            {de
              ? "Wie oft wird HDI in Antworten von ChatGPT, Gemini, Perplexity & Claude erwähnt – bei den 250 wichtigsten Versicherungs-Prompts."
              : "How often HDI is mentioned in ChatGPT, Gemini, Perplexity & Claude answers — across the 250 most relevant insurance prompts."}
          </p>
        </div>
        <div
          className="text-[11px] text-white/50 border border-white/10 bg-white/5 rounded-full px-3 py-1.5 flex items-center gap-2 self-start md:self-auto"
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: GREEN }} />
          {de ? "Datenquelle: Peec AI API (Enterprise) · API-ready" : "Source: Peec AI API (Enterprise) · API-ready"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Visibility Index */}
        <div className={cn(glassCard, "p-6 flex flex-col")}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${GREEN}22` }}>
                <Bot className="h-4 w-4" style={{ color: GREEN }} />
              </div>
              <div>
                <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">
                  {de ? "AI Visibility Index" : "AI Visibility Index"}
                </p>
              </div>
            </div>
            <InfoDot
              text={
                de
                  ? "Gewichteter Mittelwert aller Nennungen von HDI in relevanten LLM-Antworten (Sichtbarkeit + Position + Sentiment)."
                  : "Weighted mean of all HDI mentions across relevant LLM answers (visibility + position + sentiment)."
              }
            />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-white italic tracking-tight">72</span>
            <span className="text-lg text-white/40 font-bold">/100</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendingUp className="h-3.5 w-3.5" style={{ color: GREEN }} />
            <span className="text-xs font-semibold" style={{ color: GREEN }}>+6 Pkt.</span>
            <span className="text-xs text-white/40">{de ? "vs. Vormonat" : "vs. last month"}</span>
          </div>

          <div className="mt-5 space-y-2.5">
            {models.map((m, i) => {
              const val = [78, 61, 74, 55][i];
              return (
                <div key={m.key}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white/60 font-medium">{m.key}</span>
                    <span className="text-white/80 font-semibold tabular-nums">{val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${val}%`, backgroundColor: m.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Share of Voice */}
        <div className={cn(glassCard, "p-6 flex flex-col")}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${HDI_HELLBLAU}22` }}>
                <Sparkles className="h-4 w-4" style={{ color: HDI_HELLBLAU }} />
              </div>
              <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">
                {de ? "Share of Voice in LLMs" : "Share of Voice in LLMs"}
              </p>
            </div>
            <InfoDot
              text={
                de
                  ? "Anteil der Nennungen von HDI im Vergleich zu Wettbewerbern über alle vier LLMs hinweg."
                  : "Share of HDI mentions vs. competitors across all four LLMs."
              }
            />
          </div>

          {/* Stacked bar */}
          <div className="flex h-3 w-full rounded-full overflow-hidden mb-4 shadow-inner">
            {share.map((s) => (
              <div
                key={s.brand}
                style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                className={cn(s.highlight && "ring-2 ring-white/40 z-10 rounded-full")}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-1">
            {share.map((s) => (
              <div key={s.brand} className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className={cn("text-xs truncate", s.highlight ? "text-white font-semibold" : "text-white/60")}>
                  {s.brand}
                </span>
                <span className="text-xs text-white/40 tabular-nums ml-auto">{s.pct}%</span>
              </div>
            ))}
          </div>

          <div
            className="mt-5 p-3 rounded-2xl text-xs leading-relaxed"
            style={{ backgroundColor: `${GREEN}15`, color: "rgba(255,255,255,0.85)" }}
          >
            <span className="font-bold" style={{ color: GREEN }}>+3 PP</span>{" "}
            {de
              ? "seit Q1 2026 – HDI hat Allianz erstmals in ChatGPT-Antworten überholt."
              : "since Q1 2026 – HDI overtook Allianz in ChatGPT answers for the first time."}
          </div>
        </div>

        {/* Sentiment */}
        <div className={cn(glassCard, "p-6 flex flex-col")}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${HDI_OCKER}22` }}>
                <TrendingUp className="h-4 w-4" style={{ color: HDI_OCKER }} />
              </div>
              <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">
                {de ? "Sentiment & Kontext" : "Sentiment & context"}
              </p>
            </div>
            <InfoDot
              text={
                de
                  ? "In welchem Ton HDI in KI-Antworten erwähnt wird – und mit welchen Themen die Marke assoziiert wird."
                  : "The tone in which HDI is mentioned in AI answers – and which topics the brand is associated with."
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: de ? "Positiv" : "Positive", val: 68, color: GREEN },
              { label: de ? "Neutral" : "Neutral", val: 27, color: "#A6A6A6" },
              { label: de ? "Kritisch" : "Critical", val: 5, color: HDI_OCKER },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
                <div className="text-white text-xl font-bold tabular-nums">{s.val}%</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: s.color }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-2">
            {de ? "Top Assoziationen" : "Top associations"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              de ? "vertrauenswürdig" : "trustworthy",
              de ? "günstiger Tarif" : "affordable",
              de ? "starker Service" : "strong service",
              "Berufsunfähigkeit",
              "Kfz",
              de ? "schnelle Regulierung" : "fast claims",
            ].map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Prompt Coverage Heatmap */}
      <div className={cn(glassCard, "p-6 md:p-8 mt-6")}>
        <div className="flex items-start justify-between mb-5 gap-4">
          <div>
            <h4 className="text-white font-semibold mb-1">
              {de ? "Prompt Coverage Heatmap" : "Prompt coverage heatmap"}
            </h4>
            <p className="text-white/50 text-xs">
              {de
                ? "Sichtbarkeitswert von HDI je Prompt und LLM (0–100). Grün = hohe Präsenz, orange = Handlungsbedarf."
                : "HDI visibility score per prompt and LLM (0–100). Green = strong presence, orange = action needed."}
            </p>
          </div>
          <InfoDot
            text={
              de
                ? "Der Wert kombiniert: wird HDI erwähnt? An welcher Position in der Antwort? Wird es empfohlen? Ein Score < 50 bedeutet: Wettbewerber dominieren diesen Prompt."
                : "The score combines: is HDI mentioned? Where in the answer? Is it recommended? A score < 50 means competitors dominate this prompt."
            }
          />
        </div>

        {/* Header */}
        <div className="grid gap-2 items-center text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-2"
          style={{ gridTemplateColumns: "minmax(180px,1fr) repeat(4, 72px)" }}>
          <div>{de ? "Prompt" : "Prompt"}</div>
          {models.map((m) => (
            <div key={m.key} className="text-center">{m.key}</div>
          ))}
        </div>

        <div className="space-y-1.5">
          {prompts.map((row) => (
            <div
              key={row.p}
              className="grid gap-2 items-center py-1.5 border-t border-white/5"
              style={{ gridTemplateColumns: "minmax(180px,1fr) repeat(4, 72px)" }}
            >
              <div className="text-white/80 text-sm pr-3 truncate">
                {de ? row.p : row.en}
              </div>
              {row.scores.map((score, idx) => (
                <div
                  key={idx}
                  className="h-9 rounded-lg flex items-center justify-center text-xs font-bold tabular-nums text-white shadow-sm"
                  style={{ backgroundColor: heatColor(score) }}
                >
                  {score}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-5 text-[11px] text-white/50">
          <span className="uppercase tracking-wider font-semibold">{de ? "Skala" : "Scale"}</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded" style={{ backgroundColor: `${HDI_OCKER}40` }} />
            <div className="w-4 h-3 rounded" style={{ backgroundColor: `${HDI_OCKER}80` }} />
            <div className="w-4 h-3 rounded" style={{ backgroundColor: `${GREEN}66` }} />
            <div className="w-4 h-3 rounded" style={{ backgroundColor: `${GREEN}B3` }} />
            <div className="w-4 h-3 rounded" style={{ backgroundColor: GREEN }} />
          </div>
          <span>0</span>
          <span className="ml-auto">100</span>
        </div>
      </div>
    </div>
  );
};

export default AIVisibility;
