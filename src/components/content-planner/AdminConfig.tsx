import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Tags,
  CalendarRange,
  TrendingUp,
  LayoutTemplate,
  ShieldCheck,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type AdminModuleId =
  | "audiences"
  | "topics"
  | "seasonal"
  | "trends"
  | "formats"
  | "governance";

export const ADMIN_MODULES: { id: AdminModuleId; n: number; title: string; subtitle: string; icon: any }[] = [
  { id: "audiences", n: 1, title: "Zielgruppen", subtitle: "Steuernde Datensätze", icon: Users },
  { id: "topics", n: 2, title: "Themen & Sparten", subtitle: "Versicherungslogik", icon: Tags },
  { id: "seasonal", n: 3, title: "Saisonale Regeln", subtitle: "Zeitfenster & Anlässe", icon: CalendarRange },
  { id: "trends", n: 4, title: "Trend-Signale", subtitle: "Google Trends & Scoring", icon: TrendingUp },
  { id: "formats", n: 5, title: "Content-Formate", subtitle: "Verfügbare Formate", icon: LayoutTemplate },
  { id: "governance", n: 6, title: "Freigabe & Governance", subtitle: "Regeln & Compliance", icon: ShieldCheck },
];

interface Audience {
  id: string;
  name: string;
  age: string;
  phase: string;
  topics: string;
  channels: string;
  tone: string;
  cta: string;
  nogo: string;
}

interface Topic {
  id: string;
  name: string;
  sparte: string;
  audiences: string;
  season: string;
  keywords: string;
  formats: string;
  priority: string;
  approval: boolean;
}

interface SeasonRule {
  id: string;
  occasion: string;
  window: string;
  topics: string;
}

const INIT_AUDIENCES: Audience[] = [
  {
    id: "a1",
    name: "Junge Erwachsene",
    age: "18–29 Jahre",
    phase: "Studium, erster Job, erste Wohnung, erstes Auto",
    topics: "Haftpflicht, Hausrat, Kfz, Reise, Fahrrad/E-Bike, Unfall",
    channels: "Instagram, TikTok/Short Video, Website-Ratgeber",
    tone: "Einfach, konkret, wenig Versicherungsjargon",
    cta: "Mehr erfahren · Checkliste ansehen",
    nogo: "Zu vertrieblich, zu kompliziert, zu belehrend",
  },
  {
    id: "a2",
    name: "Hausbesitzer 50+",
    age: "50–70 Jahre",
    phase: "Eigenheim, Familie erwachsen, Vermögensaufbau",
    topics: "Wohngebäude, Hausrat, Einbruchschutz, Haftpflicht",
    channels: "Website-Ratgeber, Newsletter, Facebook",
    tone: "Sachlich, vertrauensvoll, beratend",
    cta: "Beratung anfragen · Schaden vermeiden",
    nogo: "Keine pauschalen Deckungszusagen",
  },
];

const INIT_TOPICS: Topic[] = [
  {
    id: "t1",
    name: "Einbruchschutz",
    sparte: "Hausrat / Wohngebäude",
    audiences: "Mieter, Eigentümer, Familien, ältere Menschen",
    season: "Vor Ferienzeiten, Herbst/Winter, dunkle Jahreszeit",
    keywords: "Einbruchschutz, Wohnung sichern, Türschloss, Fenster sichern",
    formats: "Blogartikel, Checkliste, Instagram-Kurzvideo",
    priority: "Saisonal hoch",
    approval: true,
  },
  {
    id: "t2",
    name: "Winterreifen & Kfz-Schutz",
    sparte: "Kfz",
    audiences: "Autofahrer, junge Erwachsene, Pendler",
    season: "Oktober–Dezember",
    keywords: "Winterreifen Pflicht, Kfz Winter, Reifenwechsel",
    formats: "Instagram-Post, Blogartikel, Reel",
    priority: "Saisonal hoch",
    approval: false,
  },
];

const INIT_SEASONS: SeasonRule[] = [
  { id: "r1", occasion: "Kfz-Wechselsaison", window: "Sep – Nov", topics: "Winterreifen, Kfz-Tarifvergleich" },
  { id: "r2", occasion: "Reisezeit / Urlaub", window: "Jun – Aug", topics: "Reiseversicherung, Einbruchschutz" },
  { id: "r3", occasion: "Schulanfang (je Bundesland)", window: "Aug – Sep", topics: "Schulweg, Unfallversicherung Kinder" },
];

const INIT_FORMATS = [
  { id: "f1", label: "Blogartikel", on: true },
  { id: "f2", label: "LinkedIn-Beitrag", on: true },
  { id: "f3", label: "Instagram-Post", on: true },
  { id: "f4", label: "Instagram-Video / Reel", on: true },
  { id: "f5", label: "Newsletter", on: true },
  { id: "f6", label: "FAQ", on: false },
  { id: "f7", label: "Checkliste", on: true },
];

const Field = ({ label, value, onChange, area }: { label: string; value: string; onChange: (v: string) => void; area?: boolean }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
    {area ? (
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="bg-white text-sm min-h-[60px]" />
    ) : (
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="bg-white text-sm" />
    )}
  </div>
);

const ModuleHead = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="flex items-start gap-3 mb-5">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  </div>
);

const AdminConfig = ({ module }: { module: AdminModuleId }) => {
  const [audiences, setAudiences] = useState<Audience[]>(INIT_AUDIENCES);
  const [topics, setTopics] = useState<Topic[]>(INIT_TOPICS);
  const [seasons, setSeasons] = useState<SeasonRule[]>(INIT_SEASONS);
  const [formats, setFormats] = useState(INIT_FORMATS);

  // Trend signals
  const [region, setRegion] = useState("Deutschland");
  const [timeframe, setTimeframe] = useState("30 Tage");
  const [frequency, setFrequency] = useState("Täglich");
  const [keywordSet, setKeywordSet] = useState("Einbruchschutz, Wohnung sichern, Türschloss");
  const [threshold, setThreshold] = useState("20");
  const [weight, setWeight] = useState("Mittel");

  // Governance
  const [topicApprover, setTopicApprover] = useState("Redaktionsleitung");
  const [articleApprover, setArticleApprover] = useState("Compliance + Redaktion");
  const [blocked, setBlocked] = useState("Pauschale Deckungszusagen, Garantieversprechen, Vergleiche mit Wettbewerbern");
  const [mandatory, setMandatory] = useState("Rechtlicher Hinweis, Beratungs-CTA");

  const updateAudience = (id: string, key: keyof Audience, val: string) =>
    setAudiences((prev) => prev.map((a) => (a.id === id ? { ...a, [key]: val } : a)));
  const updateTopic = (id: string, key: keyof Topic, val: string | boolean) =>
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: val } : t)));
  const updateSeason = (id: string, key: keyof SeasonRule, val: string) =>
    setSeasons((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: val } : r)));

  if (module === "audiences") {
    return (
      <div>
        <ModuleHead icon={Users} title="Zielgruppen" desc="Zielgruppen sind steuernde Datensätze – sie beeinflussen Themenauswahl, Sprache, Kanal, Beispiele und CTA." />
        <Accordion type="multiple" className="space-y-2">
          {audiences.map((a) => (
            <AccordionItem key={a.id} value={a.id} className="border border-border rounded-lg bg-white px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Users className="h-4 w-4 text-primary" /> {a.name || "Neue Zielgruppe"}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-4 pb-2">
                  <Field label="Name" value={a.name} onChange={(v) => updateAudience(a.id, "name", v)} />
                  <Field label="Altersrahmen" value={a.age} onChange={(v) => updateAudience(a.id, "age", v)} />
                  <Field label="Lebensphase / Trigger" value={a.phase} onChange={(v) => updateAudience(a.id, "phase", v)} area />
                  <Field label="Typische Themen" value={a.topics} onChange={(v) => updateAudience(a.id, "topics", v)} area />
                  <Field label="Bevorzugte Kanäle" value={a.channels} onChange={(v) => updateAudience(a.id, "channels", v)} />
                  <Field label="Sprache / Tonalität" value={a.tone} onChange={(v) => updateAudience(a.id, "tone", v)} />
                  <Field label="CTA / nächster Schritt" value={a.cta} onChange={(v) => updateAudience(a.id, "cta", v)} />
                  <Field label="No-Go / Risikofilter" value={a.nogo} onChange={(v) => updateAudience(a.id, "nogo", v)} />
                </div>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setAudiences((p) => p.filter((x) => x.id !== a.id))}>
                  <Trash2 className="h-4 w-4" /> Zielgruppe entfernen
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button
          variant="outline"
          className="mt-3 w-full border-dashed"
          onClick={() => setAudiences((p) => [...p, { id: `a${Date.now()}`, name: "", age: "", phase: "", topics: "", channels: "", tone: "", cta: "", nogo: "" }])}
        >
          <Plus className="h-4 w-4" /> Zielgruppe hinzufügen
        </Button>
      </div>
    );
  }

  if (module === "topics") {
    return (
      <div>
        <ModuleHead icon={Tags} title="Themen & Versicherungssparten" desc="Konkrete Themen mit Sparte, Zielgruppen, Saisonfenster, Trend-Keywords, Formaten und Freigabepflicht." />
        <Accordion type="multiple" className="space-y-2">
          {topics.map((t) => (
            <AccordionItem key={t.id} value={t.id} className="border border-border rounded-lg bg-white px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Tags className="h-4 w-4 text-primary" /> {t.name || "Neues Thema"}
                  <Badge variant="secondary" className="text-[10px]">{t.sparte}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-4 pb-2">
                  <Field label="Thema" value={t.name} onChange={(v) => updateTopic(t.id, "name", v)} />
                  <Field label="Versicherungssparte" value={t.sparte} onChange={(v) => updateTopic(t.id, "sparte", v)} />
                  <Field label="Zielgruppen" value={t.audiences} onChange={(v) => updateTopic(t.id, "audiences", v)} />
                  <Field label="Saisonfenster" value={t.season} onChange={(v) => updateTopic(t.id, "season", v)} />
                  <Field label="Trend-Keywords" value={t.keywords} onChange={(v) => updateTopic(t.id, "keywords", v)} area />
                  <Field label="Passende Formate" value={t.formats} onChange={(v) => updateTopic(t.id, "formats", v)} area />
                  <Field label="Priorität" value={t.priority} onChange={(v) => updateTopic(t.id, "priority", v)} />
                  <label className="flex items-center gap-3 mt-6">
                    <Switch checked={t.approval} onCheckedChange={(v) => updateTopic(t.id, "approval", v)} />
                    <span className="text-sm text-foreground">Freigabe erforderlich</span>
                  </label>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setTopics((p) => p.filter((x) => x.id !== t.id))}>
                  <Trash2 className="h-4 w-4" /> Thema entfernen
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button
          variant="outline"
          className="mt-3 w-full border-dashed"
          onClick={() => setTopics((p) => [...p, { id: `t${Date.now()}`, name: "", sparte: "", audiences: "", season: "", keywords: "", formats: "", priority: "Mittel", approval: true }])}
        >
          <Plus className="h-4 w-4" /> Thema hinzufügen
        </Button>
      </div>
    );
  }

  if (module === "seasonal") {
    return (
      <div>
        <ModuleHead icon={CalendarRange} title="Saisonale Regeln" desc="Wiederkehrende Anlässe und Zeitfenster, ab wann welche Themen relevant werden." />
        <div className="space-y-2">
          {seasons.map((r) => (
            <div key={r.id} className="grid md:grid-cols-[1fr_140px_1.4fr_auto] gap-3 items-end p-3 rounded-lg border border-border bg-white">
              <Field label="Anlass" value={r.occasion} onChange={(v) => updateSeason(r.id, "occasion", v)} />
              <Field label="Zeitfenster" value={r.window} onChange={(v) => updateSeason(r.id, "window", v)} />
              <Field label="Betroffene Themen" value={r.topics} onChange={(v) => updateSeason(r.id, "topics", v)} />
              <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => setSeasons((p) => p.filter((x) => x.id !== r.id))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-3 w-full border-dashed"
          onClick={() => setSeasons((p) => [...p, { id: `r${Date.now()}`, occasion: "", window: "", topics: "" }])}
        >
          <Plus className="h-4 w-4" /> Saisonregel hinzufügen
        </Button>
      </div>
    );
  }

  if (module === "trends") {
    return (
      <div>
        <ModuleHead icon={TrendingUp} title="Trend-Signale (Google Trends)" desc="Datenquelle & Scoring. Trends gelten als relatives Signal, nicht als alleiniger Entscheidungsgeber." />
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 mb-5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <p className="text-sm text-emerald-800"><span className="font-medium">API verbunden</span> · Credentials im Systembereich hinterlegt</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Deutschland">Deutschland</SelectItem>
                <SelectItem value="Bundesland">Bundesland</SelectItem>
                <SelectItem value="Lokal">Lokal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Zeitraum</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7 Tage">7 Tage</SelectItem>
                <SelectItem value="30 Tage">30 Tage</SelectItem>
                <SelectItem value="90 Tage">90 Tage</SelectItem>
                <SelectItem value="12 Monate">12 Monate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Abfragefrequenz</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Täglich">Täglich</SelectItem>
                <SelectItem value="Wöchentlich">Wöchentlich</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Field label="Keyword-Set je Versicherungsthema" value={keywordSet} onChange={setKeywordSet} area />
          </div>
          <Field label="Mindestschwelle Relevanz (%)" value={threshold} onChange={setThreshold} />
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Gewichtung im Scoring</Label>
            <Select value={weight} onValueChange={setWeight}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Niedrig">Niedrig</SelectItem>
                <SelectItem value="Mittel">Mittel</SelectItem>
                <SelectItem value="Hoch">Hoch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  if (module === "formats") {
    return (
      <div>
        <ModuleHead icon={LayoutTemplate} title="Content-Formate" desc="Welche Formate stehen der Redaktion zur Verfügung?" />
        <div className="space-y-2">
          {formats.map((f) => (
            <label key={f.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-white cursor-pointer">
              <span className="text-sm font-medium text-foreground">{f.label}</span>
              <Switch checked={f.on} onCheckedChange={(v) => setFormats((p) => p.map((x) => (x.id === f.id ? { ...x, on: v } : x)))} />
            </label>
          ))}
        </div>
      </div>
    );
  }

  // governance
  return (
    <div>
      <ModuleHead icon={ShieldCheck} title="Freigabe & Governance" desc="Wer darf freigeben, welche Aussagen sind gesperrt und welche Bausteine sind verpflichtend?" />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Themen-Freigabe durch" value={topicApprover} onChange={setTopicApprover} />
        <Field label="Artikel-Freigabe durch" value={articleApprover} onChange={setArticleApprover} />
        <Field label="Gesperrte Aussagen" value={blocked} onChange={setBlocked} area />
        <Field label="Verpflichtende Textbausteine" value={mandatory} onChange={setMandatory} area />
      </div>
    </div>
  );
};

export const AdminPublishBar = () => {
  const simulate = () =>
    toast.info("Diese Änderung würde 14 neue Themenvorschläge im nächsten Quartal erzeugen und 3 bestehende höher priorisieren.");
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-white border border-border rounded-xl p-4">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Sicheres Änderungsmodell:</span> Änderungen laufen als Entwurf und gehen erst nach Veröffentlichung live (mit Versionierung & Rollback).
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={simulate}>
          <Sparkles className="h-4 w-4" /> Auswirkungen simulieren
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.success("Als Entwurf gespeichert")}>
          Entwurf speichern
        </Button>
        <Button size="sm" onClick={() => toast.success("Neue Version veröffentlicht")}>
          Veröffentlichen
        </Button>
      </div>
    </div>
  );
};

export default AdminConfig;
