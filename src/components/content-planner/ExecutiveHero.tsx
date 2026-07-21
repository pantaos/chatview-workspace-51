import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Clock,
  TrendingUp,
  Zap,
  ArrowRight,
  Linkedin,
  Instagram,
  FileText,
  Loader2,
  CheckCircle2,
  ThumbsUp,
  MessageCircle,
  Share2,
  Copy,
  Wand2,
} from "lucide-react";
import { CPLang } from "./i18n";
import hdiLogo from "@/assets/hdi-logo.png.asset.json";
import { toast } from "sonner";

interface Props {
  lang: CPLang;
  onJumpToPlanner?: () => void;
}

// HDI palette
const HDI_GREEN = "#8FB03E";
const HDI_DARK = "#2C6E31";
const HDI_BLUE = "#003960";
const HDI_OCKER = "#DB6301";

const ExecutiveHero = ({ lang, onJumpToPlanner }: Props) => {
  const de = lang === "de";

  // Live post generator
  const [topic, setTopic] = useState(
    de ? "Berufsunfähigkeitsversicherung für junge Berufseinsteiger" : "Disability insurance for young professionals"
  );
  const [channel, setChannel] = useState<"linkedin" | "instagram" | "blog">("linkedin");
  const [tone, setTone] = useState<"informativ" | "emotional" | "aktivierend">("informativ");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{
    hook: string;
    body: string;
    cta: string;
    hashtags: string[];
  } | null>(null);

  const generatePost = () => {
    setGenerating(true);
    setGenerated(null);
    setTimeout(() => {
      const samples = getSample(topic, channel, tone, de);
      setGenerated(samples);
      setGenerating(false);
    }, 1500);
  };

  const copyAll = () => {
    if (!generated) return;
    const text = `${generated.hook}\n\n${generated.body}\n\n${generated.cta}\n\n${generated.hashtags.map((h) => `#${h}`).join(" ")}`;
    navigator.clipboard.writeText(text);
    toast.success(de ? "In Zwischenablage kopiert" : "Copied to clipboard");
  };

  const fmtEuro = (n: number) =>
    n.toLocaleString(de ? "de-DE" : "en-US", { maximumFractionDigits: 0 });

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
                <a href="#demo">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    {de ? "Live-Demo" : "Live demo"}
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
              <div className="mt-3 pt-3 border-t border-white/15">
                <p className="text-xs text-white/70">Version</p>
                <p className="text-sm font-semibold text-white">PANTA Flows 2.4</p>
              </div>
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

      {/* Live Post Generator */}
      <Card id="demo" className="p-6 bg-white border-border">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: HDI_GREEN }}>
              <Wand2 className="h-3.5 w-3.5" />
              {de ? "Live-Demo" : "Live demo"}
            </div>
            <h3 className="text-xl font-bold text-foreground mt-1">
              {de ? "Post-Generator — live in 4 Sekunden" : "Post generator — live in 4 seconds"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {de
                ? "Wähle Thema, Kanal & Tonalität — HDI-Brand-Guidelines sind schon im System."
                : "Pick topic, channel & tone — HDI brand guidelines are already built in."}
            </p>
          </div>
          <Badge variant="outline" className="bg-white">HDI Brand-safe</Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">{de ? "Thema" : "Topic"}</Label>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1.5 bg-white" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">{de ? "Kanal" : "Channel"}</Label>
                <Select value={channel} onValueChange={(v: any) => setChannel(v)}>
                  <SelectTrigger className="mt-1.5 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="blog">{de ? "Blog / Website" : "Blog / Website"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">{de ? "Tonalität" : "Tone"}</Label>
                <Select value={tone} onValueChange={(v: any) => setTone(v)}>
                  <SelectTrigger className="mt-1.5 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informativ">{de ? "Informativ" : "Informative"}</SelectItem>
                    <SelectItem value="emotional">{de ? "Emotional" : "Emotional"}</SelectItem>
                    <SelectItem value="aktivierend">{de ? "Aktivierend" : "Activating"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-[#F8F9FD] p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                {de ? "Automatisch berücksichtigt" : "Automatically applied"}
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" style={{ color: HDI_GREEN }} />{de ? "HDI Brand Voice & Farbwelt" : "HDI brand voice & palette"}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" style={{ color: HDI_GREEN }} />{de ? "Compliance-Regeln (BaFin, DSGVO)" : "Compliance rules (BaFin, GDPR)"}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" style={{ color: HDI_GREEN }} />{de ? "Aktuelle Trend-Signale" : "Latest trend signals"}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" style={{ color: HDI_GREEN }} />{de ? "Zielgruppen aus dem Admin" : "Audiences from admin config"}</li>
              </ul>
            </div>

            <Button
              size="lg"
              onClick={generatePost}
              disabled={generating}
              className="w-full font-semibold"
              style={{ background: HDI_DARK }}
            >
              {generating ? (
                <><Loader2 className="h-4 w-4 animate-spin" />{de ? "Generiere Post…" : "Generating post…"}</>
              ) : (
                <><Sparkles className="h-4 w-4" />{de ? "Post generieren" : "Generate post"}</>
              )}
            </Button>
          </div>

          {/* Preview */}
          <div>
            <div className="rounded-2xl border border-border bg-[#F8F9FD] p-5 min-h-[420px] flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                {channel === "linkedin" && <Linkedin className="h-4 w-4 text-[#0A66C2]" />}
                {channel === "instagram" && <Instagram className="h-4 w-4 text-[#E1306C]" />}
                {channel === "blog" && <FileText className="h-4 w-4" style={{ color: HDI_BLUE }} />}
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  {channel === "linkedin" ? "LinkedIn Post" : channel === "instagram" ? "Instagram Caption" : de ? "Blog-Artikel" : "Blog article"}
                </p>
              </div>

              {!generated && !generating && (
                <div className="flex-1 flex items-center justify-center text-center text-muted-foreground text-sm px-6">
                  {de ? 'Klicke auf „Post generieren“, um eine Live-Vorschau zu erhalten.' : 'Click "Generate post" for a live preview.'}
                </div>
              )}

              {generating && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground text-sm">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: HDI_GREEN }} />
                  {de ? "PANTA Flows verfasst Post im HDI-Stil…" : "PANTA Flows drafting post in HDI style…"}
                </div>
              )}

              {generated && !generating && (
                <div className="flex-1 flex flex-col">
                  {/* Fake social header */}
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                    <div className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center">
                      <img src={hdiLogo.url} alt="HDI" className="h-4 w-auto" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">HDI Deutschland</p>
                      <p className="text-[11px] text-muted-foreground">{de ? "Gesponsert · Jetzt" : "Sponsored · Now"}</p>
                    </div>
                  </div>

                  <div className="pt-3 space-y-3 flex-1">
                    <p className="text-sm font-semibold text-foreground">{generated.hook}</p>
                    <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{generated.body}</p>
                    <p className="text-sm font-semibold" style={{ color: HDI_DARK }}>{generated.cta}</p>
                    <p className="text-xs text-[#0A66C2]">
                      {generated.hashtags.map((h) => `#${h}`).join(" ")}
                    </p>
                  </div>

                  {/* Fake engagement */}
                  <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" />{de ? "Wird gefallen" : "Will resonate"}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{de ? "Diskussion" : "Discussion"}</span>
                    <span className="flex items-center gap-1"><Share2 className="h-3.5 w-3.5" />{de ? "Teilen" : "Share"}</span>
                  </div>
                </div>
              )}
            </div>

            {generated && !generating && (
              <div className="flex items-center gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={copyAll} className="bg-white">
                  <Copy className="h-3.5 w-3.5" />{de ? "Kopieren" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" onClick={generatePost} className="bg-white">
                  <Sparkles className="h-3.5 w-3.5" />{de ? "Variante" : "Variant"}
                </Button>
                <div className="ml-auto text-xs text-muted-foreground">
                  {de ? "Generiert in " : "Generated in "}<span className="font-semibold text-foreground">3,8 s</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

const SliderRow = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <Label className="text-sm font-medium">{label}</Label>
      <span className="text-sm font-bold text-foreground tabular-nums">{display}</span>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={([v]) => onChange(v)}
    />
  </div>
);

function getSample(
  topic: string,
  channel: "linkedin" | "instagram" | "blog",
  tone: "informativ" | "emotional" | "aktivierend",
  de: boolean
) {
  const hooks = {
    informativ: {
      de: `${topic} — was wirklich wichtig ist:`,
      en: `${topic} — what really matters:`,
    },
    emotional: {
      de: `Was, wenn morgen alles anders ist? ${topic}.`,
      en: `What if everything changes tomorrow? ${topic}.`,
    },
    aktivierend: {
      de: `Nur 3 Minuten Zeit? Dann sichere jetzt deine Zukunft. ${topic}.`,
      en: `Just 3 minutes? Then secure your future today. ${topic}.`,
    },
  };

  const bodyLinkedIn = {
    de: `Viele unterschätzen, wie schnell ein Ausfall im Job zur finanziellen Belastung wird.\n\n• 1 von 4 Berufstätigen wird vor der Rente berufsunfähig\n• Ø 6 Monate ohne Einkommen, bevor staatliche Hilfe greift\n• Wer früh einsteigt, spart bis zu 40 % Beitrag\n\nUnser Angebotsrechner zeigt in 3 Minuten, was zu dir passt — ohne Verpflichtung.`,
    en: `Many underestimate how quickly losing your ability to work becomes a financial burden.\n\n• 1 in 4 workers becomes disabled before retirement\n• Ø 6 months without income before state support kicks in\n• Starting early can save up to 40% in premiums\n\nOur quote calculator shows what fits you in 3 minutes — no strings attached.`,
  };

  const bodyInstagram = {
    de: `Absicherung muss nicht kompliziert sein 💚\n\nIn 3 Minuten weißt du, wie viel du wirklich brauchst — persönlich, transparent, ohne Kleingedrucktes.`,
    en: `Protection doesn't have to be complicated 💚\n\nIn 3 minutes you'll know what you really need — personal, transparent, no fine print.`,
  };

  const bodyBlog = {
    de: `In diesem Artikel erfährst du:\n\n1. Warum ${topic} für dich relevant ist\n2. Die 3 häufigsten Irrtümer\n3. Was du in den ersten 5 Jahren beachten solltest\n4. Wie viel Absicherung wirklich sinnvoll ist\n\nHDI-Experten haben aus über 500 Kundengesprächen die wichtigsten Learnings zusammengetragen.`,
    en: `In this article you'll learn:\n\n1. Why ${topic} matters for you\n2. The 3 most common misconceptions\n3. What to watch out for in the first 5 years\n4. How much cover really makes sense\n\nHDI experts distilled the key learnings from over 500 customer conversations.`,
  };

  const body = channel === "linkedin" ? bodyLinkedIn : channel === "instagram" ? bodyInstagram : bodyBlog;

  const cta = {
    de: "👉 Jetzt kostenlos berechnen auf hdi.de",
    en: "👉 Get your free calculation on hdi.de",
  };

  const hashtags =
    channel === "linkedin"
      ? ["HDI", "Versicherung", "Absicherung", "Karriere", "Berufsunfähigkeit"]
      : channel === "instagram"
      ? ["hdi", "absicherung", "zukunftsicher", "geldtipps", "financialfreedom"]
      : ["HDI", "Ratgeber", "Versicherungswissen"];

  return {
    hook: hooks[tone][de ? "de" : "en"],
    body: body[de ? "de" : "en"],
    cta: cta[de ? "de" : "en"],
    hashtags,
  };
}

export default ExecutiveHero;
