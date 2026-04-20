import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { templateTags } from "@/data/templates";
import { WorkflowTag } from "@/types/workflow";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { Sparkles } from "lucide-react";

const ICON_CHOICES = [
  "Sparkles", "Bot", "Wand2", "Zap", "Rocket", "Code2",
  "FileText", "Image", "Music", "Video", "Calendar", "Mail",
  "MessageSquare", "Search", "Database", "BarChart3", "Palette", "Brush",
];

interface DetailsStepProps {
  title: string;
  description: string;
  selectedTagIds: string[];
  icon: string;
  onChange: (patch: { title?: string; description?: string; selectedTagIds?: string[]; icon?: string }) => void;
}

export function DetailsStep({ title, description, selectedTagIds, icon, onChange }: DetailsStepProps) {
  const toggleTag = (id: string) => {
    onChange({
      selectedTagIds: selectedTagIds.includes(id)
        ? selectedTagIds.filter((t) => t !== id)
        : [...selectedTagIds, id],
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">App details</h3>
        <p className="text-sm text-muted-foreground mt-1">How will others discover your app?</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-title">Title</Label>
        <Input
          id="app-title"
          placeholder="e.g. Invoice Splitter"
          value={title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-desc">One-line description</Label>
        <Textarea
          id="app-desc"
          placeholder="What does it do, in one sentence?"
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-1.5">
          {templateTags.map((tag: WorkflowTag) => {
            const active = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                  active
                    ? "border-transparent text-background"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
                style={active ? { backgroundColor: tag.color } : undefined}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Icon</Label>
        <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
          {ICON_CHOICES.map((name) => {
            const Icon =
              (LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>) ||
              Sparkles;
            const active = icon === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => onChange({ icon: name })}
                className={cn(
                  "aspect-square rounded-xl border flex items-center justify-center transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
