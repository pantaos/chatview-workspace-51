import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";
import { TemplateItem, TemplateLocalized, Lang } from "@/data/templates";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: TemplateItem | null; // null = create new
  onSave: (t: TemplateItem) => void;
}

const emptyTpl = (): TemplateItem => ({
  id: `tpl-${Date.now()}`,
  title: "",
  description: "",
  icon: "Sparkles",
  tags: [],
  category: "assistant",
  screenshots: [],
  useCases: [],
  features: [],
  customizable: [],
  systemPrompt: "",
  suggestedIntegrations: [],
  starters: [],
  longDescription: "",
  bestFor: "Teams & Einzelpersonen",
  language: "Deutsch, Englisch",
  createdBy: "PANTA",
  i18n: { de: {}, en: {} },
});

export default function PFAssistantEditorDialog({ open, onOpenChange, initial, onSave }: Props) {
  const [lang, setLang] = useState<Lang>("de");
  const [tpl, setTpl] = useState<TemplateItem>(emptyTpl());

  useEffect(() => {
    if (open) {
      setTpl(initial ? { ...initial, i18n: { de: {}, en: {}, ...(initial.i18n ?? {}) } } : emptyTpl());
      setLang("de");
    }
  }, [open, initial]);

  // Resolve the value to display for the selected language: i18n override or base.
  const baseFor = (key: keyof TemplateLocalized): any => {
    if (lang === "de") {
      // base fields are German source
      switch (key) {
        case "title": return tpl.title;
        case "description": return tpl.description;
        case "longDescription": return tpl.longDescription ?? "";
        case "useCases": return tpl.useCases;
        case "features": return tpl.features;
        case "starters": return tpl.starters;
      }
    }
    return tpl.i18n?.[lang]?.[key] ?? "";
  };

  const setField = (key: keyof TemplateLocalized, value: any) => {
    if (lang === "de") {
      setTpl((p) => ({ ...p, [key]: value }));
    } else {
      setTpl((p) => ({
        ...p,
        i18n: { ...p.i18n, [lang]: { ...(p.i18n?.[lang] ?? {}), [key]: value } },
      }));
    }
  };

  const setBase = <K extends keyof TemplateItem>(key: K, value: TemplateItem[K]) => {
    setTpl((p) => ({ ...p, [key]: value }));
  };

  const starters: { displayText: string; fullPrompt: string }[] = baseFor("starters") || [];
  const updateStarter = (i: number, patch: Partial<{ displayText: string; fullPrompt: string }>) => {
    const next = [...starters];
    next[i] = { ...next[i], ...patch };
    setField("starters", next);
  };
  const addStarter = () =>
    setField("starters", [...starters, { displayText: "", fullPrompt: "" }]);
  const removeStarter = (i: number) =>
    setField("starters", starters.filter((_, idx) => idx !== i));

  const updateList = (key: "useCases" | "features", text: string) => {
    setField(key, text.split("\n").map((l) => l.trim()).filter(Boolean));
  };

  const listValue = (key: "useCases" | "features"): string => {
    const v = baseFor(key) as string[] | undefined;
    return (v ?? []).join("\n");
  };

  const handleSave = () => {
    onSave(tpl);
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? `Edit · ${initial.title}` : "New assistant template"}
      className="max-w-3xl h-[640px]"
    >
      <ResponsiveDialogBody>
        <ResponsiveDialogContent>
          <div className="space-y-5">
            {/* Language switcher */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Pflege Inhalte in mehreren Sprachen. Deutsch ist die Quellsprache.
              </div>
              <div className="inline-flex rounded-lg border border-border/60 bg-muted/30 p-0.5">
                {(["de", "en"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                      lang === l
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {l === "de" ? "Deutsch" : "English"}
                  </button>
                ))}
              </div>
            </div>

            {/* Localized content */}
            <div className="rounded-xl border border-border/60 p-4 space-y-4 bg-card">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Store-Inhalte ({lang === "de" ? "Deutsch" : "English"})
              </div>
              <Field label="Name">
                <Input
                  value={baseFor("title") || ""}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="z. B. E-Mail Assistent"
                />
              </Field>
              <Field label="Kurzbeschreibung (Card)">
                <Input
                  value={baseFor("description") || ""}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Ein Satz, was der Assistent macht"
                />
              </Field>
              <Field label="About this assistant (im Store-Popup)">
                <Textarea
                  rows={3}
                  value={baseFor("longDescription") || ""}
                  onChange={(e) => setField("longDescription", e.target.value)}
                  placeholder="Beschreibe wofür dieser Assistent gut ist und was man damit machen kann."
                />
              </Field>
              <Field label="Use cases (eine pro Zeile)">
                <Textarea
                  rows={3}
                  value={listValue("useCases")}
                  onChange={(e) => updateList("useCases", e.target.value)}
                  placeholder={"Professionelle E-Mails verfassen\nKundenanfragen beantworten"}
                />
              </Field>
              <Field label="Capabilities / Features (eine pro Zeile)">
                <Textarea
                  rows={3}
                  value={listValue("features")}
                  onChange={(e) => updateList("features", e.target.value)}
                  placeholder={"Lernt deinen Schreibstil\nMehrsprachige Unterstützung"}
                />
              </Field>

              {/* Starters */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm">Conversation starters</Label>
                  <Button size="sm" variant="outline" onClick={addStarter}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {starters.length === 0 && (
                    <div className="text-xs text-muted-foreground italic">Noch keine Starter.</div>
                  )}
                  {starters.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          value={s.displayText}
                          onChange={(e) => updateStarter(i, { displayText: e.target.value })}
                          placeholder="Anzeigetext"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeStarter(i)}
                          className="shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        rows={2}
                        value={s.fullPrompt}
                        onChange={(e) => updateStarter(i, { fullPrompt: e.target.value })}
                        placeholder="Vollständiger Prompt, der gesendet wird"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Language-independent config */}
            <div className="rounded-xl border border-border/60 p-4 space-y-4 bg-card">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Konfiguration (sprachunabhängig)
              </div>
              <Field label="Icon (Lucide-Name)">
                <Input
                  value={tpl.icon}
                  onChange={(e) => setBase("icon", e.target.value)}
                  placeholder="z. B. Mail, Sparkles, Bot"
                />
              </Field>
              <Field label="System Prompt">
                <Textarea
                  rows={4}
                  value={tpl.systemPrompt}
                  onChange={(e) => setBase("systemPrompt", e.target.value)}
                  placeholder="Du bist ein hilfreicher Assistent..."
                />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Best for">
                  <Input
                    value={tpl.bestFor || ""}
                    onChange={(e) => setBase("bestFor", e.target.value)}
                    placeholder="Teams & Einzelpersonen"
                  />
                </Field>
                <Field label="Sprachen">
                  <Input
                    value={tpl.language || ""}
                    onChange={(e) => setBase("language", e.target.value)}
                    placeholder="Deutsch, Englisch"
                  />
                </Field>
                <Field label="Created by">
                  <Input
                    value={tpl.createdBy || ""}
                    onChange={(e) => setBase("createdBy", e.target.value)}
                    placeholder="PANTA"
                  />
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!tpl.title.trim()}>
                {initial ? "Save changes" : "Create assistant"}
              </Button>
            </div>
          </div>
        </ResponsiveDialogContent>
      </ResponsiveDialogBody>
    </ResponsiveDialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
