import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Sparkles as SparklesIcon,
  Users,
  User,
  X,
  Play,
  Copy,
  Check,
} from "lucide-react";
import { UseCase } from "@/data/useCases";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface TaskPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  task: UseCase | null;
  onRun: (task: UseCase) => void;
  onSchedule: (task: UseCase) => void;
}

export function TaskPreviewDialog({
  open,
  onClose,
  task,
  onRun,
}: TaskPreviewDialogProps) {
  const isMobile = useIsMobile();
  const [promptDraft, setPromptDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!task) return null;
  const Icon = task.icon;

  const duration = task.duration || task.saves;
  const result = task.taskType || "Antwortentwurf";
  const bestFor = task.bestFor || `${task.team} Team`;
  const createdBy = task.createdBy || "PANTA";

  const defaultPrompt =
    task.prefilledPrompt ||
    `Bitte führe die Aufgabe "${task.name}" aus. ${task.description ?? ""}`.trim();
  const promptValue = promptDraft ?? defaultPrompt;

  const steps = (task.inputs && task.inputs.length > 0)
    ? task.inputs
    : [
        `Du verbindest die nötigen Tools mit PANTA.`,
        `${task.name} analysiert die Eingabe.`,
        `Der Assistent verarbeitet die Daten und erstellt das Ergebnis.`,
        `Du prüfst und nutzt das Ergebnis – oder passt es an.`,
      ];

  const example = task.longDescription || task.description ||
    `Beispiel: ${task.name} liefert dir in wenigen Sekunden ein nutzbares Ergebnis – ohne manuelle Zwischenschritte.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Kopieren fehlgeschlagen");
    }
  };

  const handleRun = () => {
    toast.success(`"${task.name}" im Chat geöffnet`);
    onRun({ ...task, prefilledPrompt: promptValue });
  };

  const body = (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-7 pt-7 pb-5">
        <div>
          <h2 className="text-2xl font-bold leading-tight text-foreground">{task.name}</h2>
          <span className="inline-block mt-3 rounded-md bg-primary/10 text-primary px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase">
            Use Case
          </span>
        </div>

        <p className="text-sm text-muted-foreground mt-5 leading-relaxed">
          {task.description || `Ready-to-run task für dein ${task.team} Team.`}
        </p>
      </div>

      {/* Two-column body */}
      <div className="px-7 pb-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: How it works + Description */}
        <div className="space-y-7">
          <div>
            <h3 className="text-base font-bold mb-4 text-foreground">How it works:</h3>
            <ul className="space-y-3.5">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 shrink-0">
                    <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                  </div>
                  <span className="leading-snug">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold mb-2 text-foreground">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{example}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
            <Meta icon={<Clock className="h-3.5 w-3.5" />} label="Dauer" value={duration} />
            <Meta icon={<SparklesIcon className="h-3.5 w-3.5" />} label="Ergebnis" value={result} />
            <Meta icon={<Users className="h-3.5 w-3.5" />} label="Geeignet für" value={bestFor} />
            <Meta icon={<User className="h-3.5 w-3.5" />} label="Erstellt von" value={createdBy} />
          </div>
        </div>

        {/* Right: Try it now */}
        <div className="space-y-3 flex flex-col">
          <h3 className="text-base font-bold text-foreground">Try it now:</h3>
          <p className="text-sm text-muted-foreground">
            Enter the text you want to turn into a result.
          </p>
          <div className="relative rounded-2xl border border-border/60 bg-muted/40 p-4 pt-9 flex-1 min-h-[260px]">
            <button
              onClick={handleCopy}
              className="absolute right-2.5 top-2.5 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
              title="Prompt kopieren"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <Textarea
              rows={9}
              value={promptValue}
              onChange={(e) => setPromptDraft(e.target.value)}
              placeholder="Paste your text here..."
              className="text-sm resize-none border-0 bg-transparent p-0 focus-visible:ring-0 shadow-none leading-relaxed h-full min-h-[200px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleRun} className="rounded-xl">
              <Play className="h-4 w-4 mr-2" />
              Im Chat ausprobieren
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{task.name}</DrawerTitle>
          </DrawerHeader>
          {body}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{task.name}</DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 z-20 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 backdrop-blur transition-colors">
          <X className="h-4 w-4" />
        </DialogClose>
        {body}
      </DialogContent>
    </Dialog>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-xs font-medium text-foreground mt-1 leading-snug line-clamp-2">{value}</div>
    </div>
  );
}
