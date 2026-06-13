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
import { toast } from "sonner";
import {
  CPLang,
  CPContent,
  CPAudience,
  CPTopic,
  CPSeasonRule,
  CP_CONTENT,
} from "@/components/content-planner/i18n";

export type AdminModuleId =
  | "audiences"
  | "topics"
  | "seasonal"
  | "trends"
  | "formats"
  | "governance";


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

const AdminConfig = ({ module, lang }: { module: AdminModuleId; lang: CPLang }) => {
  const c: CPContent = CP_CONTENT[lang];

  const [audiences, setAudiences] = useState<CPAudience[]>(c.audiences);
  const [topics, setTopics] = useState<CPTopic[]>(c.topics);
  const [seasons, setSeasons] = useState<CPSeasonRule[]>(c.seasons);
  const [formats, setFormats] = useState(c.formats);

  // Trend signals
  const [region, setRegion] = useState(c.trendDefaults.region);
  const [timeframe, setTimeframe] = useState(c.trendDefaults.timeframe);
  const [frequency, setFrequency] = useState(c.trendDefaults.frequency);
  const [keywordSet, setKeywordSet] = useState(c.trendDefaults.keywordSet);
  const [threshold, setThreshold] = useState(c.trendDefaults.threshold);
  const [weight, setWeight] = useState(c.trendDefaults.weight);

  // Governance
  const [topicApprover, setTopicApprover] = useState(c.governanceDefaults.topicApprover);
  const [articleApprover, setArticleApprover] = useState(c.governanceDefaults.articleApprover);
  const [blocked, setBlocked] = useState(c.governanceDefaults.blocked);
  const [mandatory, setMandatory] = useState(c.governanceDefaults.mandatory);

  const updateAudience = (id: string, key: keyof CPAudience, val: string) =>
    setAudiences((prev) => prev.map((a) => (a.id === id ? { ...a, [key]: val } : a)));
  const updateTopic = (id: string, key: keyof CPTopic, val: string | boolean) =>
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: val } : t)));
  const updateSeason = (id: string, key: keyof CPSeasonRule, val: string) =>
    setSeasons((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: val } : r)));

  if (module === "audiences") {
    return (
      <div>
        <ModuleHead icon={Users} title={c.audiencesHead} desc={c.audiencesDesc} />
        <Accordion type="multiple" className="space-y-2">
          {audiences.map((a) => (
            <AccordionItem key={a.id} value={a.id} className="border border-border rounded-lg bg-white px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Users className="h-4 w-4 text-primary" /> {a.name || c.newAudience}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-4 pb-2">
                  <Field label={c.f.name} value={a.name} onChange={(v) => updateAudience(a.id, "name", v)} />
                  <Field label={c.f.age} value={a.age} onChange={(v) => updateAudience(a.id, "age", v)} />
                  <Field label={c.f.phase} value={a.phase} onChange={(v) => updateAudience(a.id, "phase", v)} area />
                  <Field label={c.f.topics} value={a.topics} onChange={(v) => updateAudience(a.id, "topics", v)} area />
                  <Field label={c.f.channels} value={a.channels} onChange={(v) => updateAudience(a.id, "channels", v)} />
                  <Field label={c.f.tone} value={a.tone} onChange={(v) => updateAudience(a.id, "tone", v)} />
                  <Field label={c.f.cta} value={a.cta} onChange={(v) => updateAudience(a.id, "cta", v)} />
                  <Field label={c.f.nogo} value={a.nogo} onChange={(v) => updateAudience(a.id, "nogo", v)} />
                </div>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setAudiences((p) => p.filter((x) => x.id !== a.id))}>
                  <Trash2 className="h-4 w-4" /> {c.removeAudience}
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
          <Plus className="h-4 w-4" /> {c.addAudience}
        </Button>
      </div>
    );
  }

  if (module === "topics") {
    return (
      <div>
        <ModuleHead icon={Tags} title={c.topicsHead} desc={c.topicsDesc} />
        <Accordion type="multiple" className="space-y-2">
          {topics.map((t) => (
            <AccordionItem key={t.id} value={t.id} className="border border-border rounded-lg bg-white px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Tags className="h-4 w-4 text-primary" /> {t.name || c.newTopic}
                  <Badge variant="secondary" className="text-[10px]">{t.sparte}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-4 pb-2">
                  <Field label={c.f.topic} value={t.name} onChange={(v) => updateTopic(t.id, "name", v)} />
                  <Field label={c.f.sparte} value={t.sparte} onChange={(v) => updateTopic(t.id, "sparte", v)} />
                  <Field label={c.f.audiences} value={t.audiences} onChange={(v) => updateTopic(t.id, "audiences", v)} />
                  <Field label={c.f.season} value={t.season} onChange={(v) => updateTopic(t.id, "season", v)} />
                  <Field label={c.f.keywords} value={t.keywords} onChange={(v) => updateTopic(t.id, "keywords", v)} area />
                  <Field label={c.f.formats} value={t.formats} onChange={(v) => updateTopic(t.id, "formats", v)} area />
                  <Field label={c.f.priority} value={t.priority} onChange={(v) => updateTopic(t.id, "priority", v)} />
                  <label className="flex items-center gap-3 mt-6">
                    <Switch checked={t.approval} onCheckedChange={(v) => updateTopic(t.id, "approval", v)} />
                    <span className="text-sm text-foreground">{c.approvalRequired}</span>
                  </label>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setTopics((p) => p.filter((x) => x.id !== t.id))}>
                  <Trash2 className="h-4 w-4" /> {c.removeTopic}
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button
          variant="outline"
          className="mt-3 w-full border-dashed"
          onClick={() => setTopics((p) => [...p, { id: `t${Date.now()}`, name: "", sparte: "", audiences: "", season: "", keywords: "", formats: "", priority: c.weightOptions[1], approval: true }])}
        >
          <Plus className="h-4 w-4" /> {c.addTopic}
        </Button>
      </div>
    );
  }

  if (module === "seasonal") {
    return (
      <div>
        <ModuleHead icon={CalendarRange} title={c.seasonalHead} desc={c.seasonalDescAdmin} />
        <div className="space-y-2">
          {seasons.map((r) => (
            <div key={r.id} className="grid md:grid-cols-[1fr_140px_1.4fr_auto] gap-3 items-end p-3 rounded-lg border border-border bg-white">
              <Field label={c.f.occasion} value={r.occasion} onChange={(v) => updateSeason(r.id, "occasion", v)} />
              <Field label={c.f.window} value={r.window} onChange={(v) => updateSeason(r.id, "window", v)} />
              <Field label={c.f.affectedTopics} value={r.topics} onChange={(v) => updateSeason(r.id, "topics", v)} />
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
          <Plus className="h-4 w-4" /> {c.addSeason}
        </Button>
      </div>
    );
  }

  if (module === "trends") {
    return (
      <div>
        <ModuleHead icon={TrendingUp} title={c.trendsHead} desc={c.trendsDescAdmin} />
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 mb-5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <p className="text-sm text-emerald-800"><span className="font-medium">{c.apiConnected}</span> · {c.apiConnectedSuffix}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{c.f.region}</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {c.regionOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{c.f.timeframe}</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {c.timeframeOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{c.f.frequency}</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {c.frequencyOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Field label={c.f.keywordSet} value={keywordSet} onChange={setKeywordSet} area />
          </div>
          <Field label={c.f.threshold} value={threshold} onChange={setThreshold} />
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{c.f.weight}</Label>
            <Select value={weight} onValueChange={setWeight}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {c.weightOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
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
        <ModuleHead icon={LayoutTemplate} title={c.formatsHead} desc={c.formatsDesc} />
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
      <ModuleHead icon={ShieldCheck} title={c.governanceHead} desc={c.governanceDesc} />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label={c.f.topicApprover} value={topicApprover} onChange={setTopicApprover} />
        <Field label={c.f.articleApprover} value={articleApprover} onChange={setArticleApprover} />
        <Field label={c.f.blocked} value={blocked} onChange={setBlocked} area />
        <Field label={c.f.mandatory} value={mandatory} onChange={setMandatory} area />
      </div>
    </div>
  );
};

export const AdminPublishBar = ({ lang }: { lang: CPLang }) => {
  const c = CP_CONTENT[lang];
  const simulate = () => toast.info(c.simulateToast);
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-white border border-border rounded-xl p-4">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{c.changeModelLabel}</span> {c.changeModelText}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={simulate}>
          <Sparkles className="h-4 w-4" /> {c.simulateBtn}
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.success(c.saveDraftToast)}>
          {c.saveDraftBtn}
        </Button>
        <Button size="sm" onClick={() => toast.success(c.publishToast)}>
          {c.publishBtn}
        </Button>
      </div>
    </div>
  );
};

export default AdminConfig;
