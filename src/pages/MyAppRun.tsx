import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { CommunityApp, seedCommunityApps } from "@/data/communityApps";
import { MiniApp } from "@/components/app-builder/MiniApp";

export default function MyAppRun() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState<CommunityApp | null>(null);

  useEffect(() => {
    let stored: CommunityApp[] = [];
    try {
      stored = JSON.parse(localStorage.getItem("communityApps") || "[]");
    } catch {}
    const all = [...stored, ...seedCommunityApps];
    setApp(all.find((a) => a.id === id) ?? null);
  }, [id]);

  const Icon = app
    ? ((LucideIcons[app.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>) || Sparkles)
    : Sparkles;

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto bg-muted/20">
        {/* App chrome header */}
        <div className="sticky top-0 z-10 bg-background/85 backdrop-blur border-b border-border/60">
          <div className="container max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/my-apps")} className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">My Apps</span>
            </Button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{app?.title ?? "App"}</div>
                <div className="text-[11px] text-muted-foreground truncate hidden sm:block">
                  {app?.description}
                </div>
              </div>
            </div>
            {app?.status === "approved" && (
              <Button variant="outline" size="sm" className="gap-1 hidden sm:inline-flex">
                <ExternalLink className="h-3.5 w-3.5" />
                Share
              </Button>
            )}
          </div>
        </div>

        {/* App body — full screen, centered with comfortable max width */}
        <div className="container max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
          {app ? (
            <div className="rounded-2xl border border-border/60 bg-background p-4 md:p-8 shadow-[0_1px_0_hsl(var(--border))]">
              <MiniApp app={app} />
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">App not found.</p>
              <Button variant="link" onClick={() => navigate("/my-apps")} className="mt-1">
                Back to My Apps
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
