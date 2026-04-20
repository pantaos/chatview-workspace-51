import { useRef, useState } from "react";
import { UploadCloud, FileArchive, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface UploadStepProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function UploadStep({ file, onFileChange }: UploadStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { theme } = useTheme();

  const accept = (f: File | null) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".zip")) return;
    if (f.size > 20 * 1024 * 1024) return;
    onFileChange(f);
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Upload your app</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Drop the ZIP exported from Lovable, Claude Code, or any vibe-coded project.
        </p>
      </div>

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            accept(e.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            "w-full rounded-2xl border-2 border-dashed bg-muted/30 px-6 py-12 text-center transition-colors",
            "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          )}
          style={dragActive ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}0d` } : undefined}
        >
          <div
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${theme.primaryColor}1a`, color: theme.primaryColor }}
          >
            <UploadCloud className="h-6 w-6" />
          </div>
          <div className="text-sm font-medium text-foreground">Drop your .zip here</div>
          <div className="text-xs text-muted-foreground mt-1">or click to browse · max 20 MB</div>
          <input
            ref={inputRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => accept(e.target.files?.[0] ?? null)}
          />
        </button>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card p-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${theme.primaryColor}1a`, color: theme.primaryColor }}
            >
              <FileArchive className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{file.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{formatSize(file.size)}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Detected: React + Vite
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onFileChange(null)} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
