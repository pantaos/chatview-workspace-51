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
import { UseCase, UseCaseLocalized, Lang } from "@/data/useCases";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: UseCase | null;
  onSave: (u: UseCase) => void;
}

const empty = (): UseCase => ({
  id: `task-${Date.now()}`,
  name: "",
  icon: Sparkles,
  saves: "—",
  status: "ready",
  integrations: [],
  team: "Marketing",
  taskType: "Reporting",
  description: "",
  longDescription: "",
  duration: "2-3 min",
  bestFor: "Marketing Team",
  language: "Deutsch",
  createdBy: "PANTA",
  inputs: [],
  prefilledPrompt: "",
  i18n: { de: {}, en: {} },
});

export default function PFTaskEditorDialog({ open, onOpenChange, initial, onSave }: Props) {
  const [lang, setLang] = useState<Lang>("de");
  const [task, setTask] = useState<UseCase>(empty());

  useEffect(() => {
    if (open) {
      setTask(initial ? { ...initial, i18n: { de: {}, en: {}, ...(initial.i18n ?? {}) } } : empty());
      setLang("de");
    }
  }, [open, initial]);

  const valueFor = (key: keyof UseCaseLocalized): any => {
    if (lang === "de") {
      switch (key) {
        case "name": return task.name;
        case "description": return task.description ?? "";
        case "longDescription": return task.longDescription ?? "";
        case "inputs": return task.inputs ?? [];
        case "prefilledPrompt": return task.prefilledPrompt ?? "";
      }
    }
    return task.i18n?.[lang]?.[key] ?? "";
  };
  const howItWorksValue = (): string => {
    const v = valueFor("inputs") as string[] | undefined;
    return (v ?? []).join("\n");
  };
  const setHowItWorks = (text: string) =>
    setField("inputs", text.split("\n").map((l) => l.trim()).filter(Boolean));

  const setField = (key: keyof UseCaseLocalized, value: any) => {
    if (lang === "de") {
      setTask((p) => ({ ...p, [key]: value }));
    } else {
      setTask((p) => ({
        ...p,
        i18n: { ...p.i18n, [lang]: { ...(p.i18n?.[lang] ?? {}), [key]: value } },
      }));
    }
  };

  const inputsValue = (): string => {
    const v = valueFor("inputs") as string[] | undefined;
    return (v ?? []).join("\n");
  };
  const setInputs = (text: string) =>
    setField("inputs", text.split("\n").map((l) => l.trim()).filter(Boolean));

  const setBase = <K extends keyof UseCase>(key: K, value: UseCase[K]) =>
    setTask((p) => ({ ...p, [key]: value }));

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? `Use Case bearbeiten · ${initial.name}` : "Neuer Use Case"}
      className="max-w-2xl h-[640px]"
    >
      <ResponsiveDialogBody>
        <ResponsiveDialogContent>
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Use Cases haben nur einen vorgefertigten Prompt – kein System Prompt.
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

            <div className="rounded-xl border border-border/60 p-4 space-y-4 bg-card">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Inhalte ({lang === "de" ? "Deutsch" : "English"})
              </div>
              <Field label="Name">
                <Input
                  value={valueFor("name") || ""}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="z. B. Blog Post erstellen"
                />
              </Field>
              <Field label="Kurzbeschreibung">
                <Input
                  value={valueFor("description") || ""}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Ein Satz, was der Use Case macht"
                />
              </Field>
              <Field label="Detaillierte Beschreibung">
                <Textarea
                  rows={4}
                  value={valueFor("longDescription") || ""}
                  onChange={(e) => setField("longDescription", e.target.value)}
                  placeholder="Beschreibe ausführlich, wofür der Use Case gut ist..."
                />
              </Field>
              <Field label="So funktioniert's (ein Schritt pro Zeile)">
                <Textarea
                  rows={4}
                  value={howItWorksValue()}
                  onChange={(e) => setHowItWorks(e.target.value)}
                  placeholder={"Du verbindest die nötigen Tools.\nDer Assistent analysiert die Eingabe.\nDu erhältst das Ergebnis."}
                />
              </Field>
              <Field label="Beispiel-Prompt">
                <Textarea
                  rows={6}
                  value={valueFor("prefilledPrompt") || ""}
                  onChange={(e) => setField("prefilledPrompt", e.target.value)}
                  placeholder="Schreibe einen SEO-optimierten Blog Post zum Thema [Thema]..."
                />
              </Field>
            </div>


            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onSave(task);
                  onOpenChange(false);
                }}
                disabled={!task.name.trim()}
              >
                {initial ? "Save changes" : "Create task"}
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
