import { useTheme } from "@/contexts/ThemeContext";
import * as LucideIcons from "lucide-react";
import { Sparkles } from "lucide-react";

interface PreviewStepProps {
  title: string;
  description: string;
  icon: string;
}

function MockChrome({ themed, primary, accent, title, icon }: { themed: boolean; primary: string; accent: string; title: string; icon: string }) {
  const Icon =
    (LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>) || Sparkles;
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <div className="flex h-32">
        {/* Sidebar */}
        <div
          className="w-10 flex flex-col items-center gap-2 py-2"
          style={{ background: themed ? `${primary}10` : "#f3f4f6" }}
        >
          <div className="h-5 w-5 rounded-md" style={{ background: themed ? primary : "#9ca3af" }} />
          <div className="h-1.5 w-5 rounded-full bg-muted-foreground/30" />
          <div className="h-1.5 w-5 rounded-full bg-muted-foreground/30" />
          <div className="h-1.5 w-5 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="flex-1 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded-md flex items-center justify-center"
              style={{ background: themed ? `${primary}20` : "#e5e7eb", color: themed ? primary : "#6b7280" }}
            >
              <Icon className="h-3 w-3" />
            </div>
            <div className="text-[11px] font-semibold truncate">{title || "Untitled app"}</div>
          </div>
          <div className="flex gap-1">
            <div
              className="h-1.5 w-10 rounded-full"
              style={{ background: themed ? primary : "#9ca3af" }}
            />
            <div className="h-1.5 w-8 rounded-full bg-muted-foreground/20" />
            <div className="h-1.5 w-6 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-full rounded-full bg-muted-foreground/15" />
            <div className="h-1.5 w-3/4 rounded-full bg-muted-foreground/15" />
          </div>
          <div className="flex justify-end">
            <div
              className="h-3 w-10 rounded-md"
              style={{ background: themed ? accent : "#d1d5db" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PreviewStep({ title, description, icon }: PreviewStepProps) {
  const { theme } = useTheme();
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Preview & submit</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Here's how your app will look once it's standardized to the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Original</div>
          <MockChrome themed={false} primary={theme.primaryColor} accent={theme.accentColor} title={title} icon={icon} />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Standardized</div>
          <MockChrome themed primary={theme.primaryColor} accent={theme.accentColor} title={title} icon={icon} />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Summary</div>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between gap-3"><span className="text-muted-foreground">Title</span><span className="font-medium truncate">{title || "—"}</span></div>
          <div className="flex justify-between gap-3"><span className="text-muted-foreground">Description</span><span className="font-medium text-right truncate max-w-[60%]">{description || "—"}</span></div>
          <div className="flex justify-between gap-3"><span className="text-muted-foreground">Framework</span><span className="font-medium">React + Vite</span></div>
          <div className="flex justify-between gap-3"><span className="text-muted-foreground">Standardized</span><span className="font-medium text-emerald-600">Yes</span></div>
        </div>
      </div>
    </div>
  );
}
