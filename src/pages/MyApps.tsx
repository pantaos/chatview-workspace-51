import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus, Clock, CheckCircle2, XCircle, MoreHorizontal, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommunityApp, seedCommunityApps } from "@/data/communityApps";
import { toast } from "sonner";

const STATUS_META: Record<CommunityApp["status"], { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pending review", icon: Clock, className: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  approved: { label: "Approved", icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-500/10 text-red-700 dark:text-red-400" },
};

export default function MyApps() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<CommunityApp[]>([]);

  useEffect(() => {
    let stored: CommunityApp[] = [];
    try {
      stored = JSON.parse(localStorage.getItem("communityApps") || "[]");
    } catch {}
    setApps([...stored, ...seedCommunityApps]);
  }, []);

  const handleDelete = (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
    try {
      const stored = JSON.parse(localStorage.getItem("communityApps") || "[]");
      localStorage.setItem("communityApps", JSON.stringify(stored.filter((a: CommunityApp) => a.id !== id)));
    } catch {}
    toast.success("App removed");
  };

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        <div className="container max-w-3xl mx-auto py-8 px-4 md:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary mb-3">
                <Sparkles className="h-3 w-3" />
                My Apps
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Your submissions</h1>
              <p className="text-muted-foreground mt-1.5 text-sm">
                Track your apps and their review status.
              </p>
            </div>
            <Button onClick={() => navigate("/app-builder")} className="shrink-0">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>

          {apps.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center text-muted-foreground">
              <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No apps yet.</p>
              <Button variant="link" onClick={() => navigate("/app-builder")} className="mt-1">
                Build your first one
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card overflow-hidden">
              {apps.map((app) => {
                const Icon =
                  (LucideIcons[app.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>) ||
                  Sparkles;
                const meta = STATUS_META[app.status];
                const StatusIcon = meta.icon;
                return (
                  <li key={app.id} className="flex items-center gap-3 p-4 hover:bg-muted/30">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-medium truncate">{app.title}</div>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", meta.className)}>
                          <StatusIcon className="h-3 w-3" />
                          {meta.label}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {app.description}
                      </div>
                      {app.status === "rejected" && app.rejectionReason && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1 truncate">
                          {app.rejectionReason}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block shrink-0">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate("/templates")}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/app-builder")}>Resubmit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(app.id)} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
