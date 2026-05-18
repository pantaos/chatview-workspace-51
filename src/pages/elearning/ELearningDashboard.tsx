import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ELearningLayout from "./ELearningLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, ExternalLink, ArrowRight, Megaphone } from "lucide-react";
import {
  getModules,
  getAnnouncements,
  getProgress,
  moduleCompletion,
  Module,
  Announcement,
  ProgressState,
} from "@/data/elearningData";

export default function ELearningDashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [progress, setProgress] = useState<ProgressState>({ materialsOpened: {}, videoProgress: {}, taskStatus: {} });

  useEffect(() => {
    setModules(getModules());
    setAnnouncements(getAnnouncements());
    setProgress(getProgress());
  }, []);

  const upcoming = modules
    .filter((m) => new Date(m.scheduledAt).getTime() >= Date.now())
    .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt))[0];

  const openItems: { moduleTitle: string; moduleId: string; label: string }[] = [];
  modules.forEach((m) => {
    m.tasks.forEach((t) => {
      if (progress.taskStatus[t.id] !== "done") openItems.push({ moduleTitle: m.title, moduleId: m.id, label: `Task · ${t.title}` });
    });
    m.materials.forEach((mat) => {
      if (mat.type === "video") {
        if ((progress.videoProgress[mat.id] || 0) < 90)
          openItems.push({ moduleTitle: m.title, moduleId: m.id, label: `Video · ${mat.title}` });
      } else if (!progress.materialsOpened[mat.id]) {
        openItems.push({ moduleTitle: m.title, moduleId: m.id, label: `${mat.type === "pdf" ? "PDF" : "Link"} · ${mat.title}` });
      }
    });
  });

  return (
    <ELearningLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-1.5">Pick up where you left off.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {upcoming && (
            <div className="rounded-2xl bg-white border p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-primary font-medium mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Next session
                  </div>
                  <h2 className="text-xl font-semibold">{upcoming.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(upcoming.scheduledAt).toLocaleString()}
                  </p>
                </div>
                <Button asChild>
                  <a href={upcoming.teamsLink} target="_blank" rel="noreferrer">
                    Join <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white border p-6">
            <h3 className="font-semibold mb-4">Module progress</h3>
            <div className="space-y-4">
              {modules.map((m) => {
                const pct = moduleCompletion(m, progress);
                return (
                  <Link key={m.id} to={`/elearning/modules/${m.id}`} className="block group">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {m.order}. {m.title}
                      </span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-white border p-6">
            <h3 className="font-semibold mb-4">Open items</h3>
            {openItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">All caught up.</p>
            ) : (
              <ul className="divide-y">
                {openItems.slice(0, 6).map((i, idx) => (
                  <li key={idx} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{i.label}</div>
                      <div className="text-xs text-muted-foreground truncate">{i.moduleTitle}</div>
                    </div>
                    <Link to={`/elearning/modules/${i.moduleId}`} className="text-primary text-sm inline-flex items-center gap-1 shrink-0">
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><Megaphone className="h-4 w-4" /> Announcements</h3>
              <Link to="/elearning/announcements" className="text-xs text-primary">All</Link>
            </div>
            <ul className="space-y-4">
              {announcements.slice(0, 3).map((a) => (
                <li key={a.id}>
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {new Date(a.createdAt).toLocaleDateString()} · {a.author}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{a.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ELearningLayout>
  );
}
