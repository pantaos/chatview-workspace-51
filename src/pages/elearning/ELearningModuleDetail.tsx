import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ELearningLayout from "./ELearningLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, ExternalLink, FileText, Video, Link2, CheckCircle2, Circle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import {
  getModule,
  getProgress,
  saveProgress,
  moduleCompletion,
  Module,
  ProgressState,
  Task,
} from "@/data/elearningData";
import VideoPlayer from "@/components/elearning/VideoPlayer";
import PdfViewer from "@/components/elearning/PdfViewer";
import TaskDialog from "@/components/elearning/TaskDialog";

export default function ELearningModuleDetail() {
  const { id } = useParams();
  const [module, setModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<ProgressState>({ materialsOpened: {}, videoProgress: {}, taskStatus: {} });
  const [openMaterial, setOpenMaterial] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!id) return;
    setModule(getModule(id) || null);
    setProgress(getProgress());
  }, [id]);

  const updateProgress = (updater: (p: ProgressState) => ProgressState) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveProgress(next);
      return next;
    });
  };

  const markMaterialOpened = (mid: string) => {
    updateProgress((p) => ({ ...p, materialsOpened: { ...p.materialsOpened, [mid]: true } }));
  };

  const updateVideoProgress = (mid: string, pct: number) => {
    updateProgress((p) => ({
      ...p,
      videoProgress: { ...p.videoProgress, [mid]: Math.max(pct, p.videoProgress[mid] || 0) },
    }));
  };

  const setTaskStatus = (tid: string, status: "in_progress" | "done") => {
    updateProgress((p) => ({ ...p, taskStatus: { ...p.taskStatus, [tid]: status } }));
  };

  if (!module) {
    return (
      <ELearningLayout>
        <p className="text-muted-foreground">Module not found.</p>
      </ELearningLayout>
    );
  }

  const pct = moduleCompletion(module, progress);

  return (
    <ELearningLayout>
      <Link to="/elearning/modules" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> All modules
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-primary font-medium mb-1">Module {module.order}</div>
          <h1 className="text-3xl font-bold tracking-tight">{module.title}</h1>
          <p className="text-muted-foreground mt-1.5">{module.description}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(module.scheduledAt).toLocaleString()}
          </div>
        </div>
        <Button asChild>
          <a href={module.teamsLink} target="_blank" rel="noreferrer">
            Join session <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="rounded-2xl bg-white border p-5 mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">Progress</span>
          <span className="text-muted-foreground">{pct}%</span>
        </div>
        <Progress value={pct} className="h-1.5" />
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Materials</h2>
        <div className="rounded-2xl bg-white border divide-y">
          {module.materials.map((mat) => {
            const Icon = mat.type === "pdf" ? FileText : mat.type === "video" ? Video : Link2;
            const opened = mat.type === "video"
              ? (progress.videoProgress[mat.id] || 0) >= 90
              : !!progress.materialsOpened[mat.id];
            const isOpen = openMaterial === mat.id;
            return (
              <div key={mat.id} className="p-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{mat.title}</div>
                    <div className="text-xs text-muted-foreground capitalize">{mat.type}</div>
                  </div>
                  {opened && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                  {mat.type === "link" ? (
                    <Button variant="outline" size="sm" asChild onClick={() => markMaterialOpened(mat.id)}>
                      <a href={mat.url} target="_blank" rel="noreferrer">
                        Open <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setOpenMaterial(isOpen ? null : mat.id);
                        if (!isOpen && mat.type === "pdf") markMaterialOpened(mat.id);
                      }}
                    >
                      {isOpen ? <>Close <ChevronUp className="h-3.5 w-3.5" /></> : <>View <ChevronDown className="h-3.5 w-3.5" /></>}
                    </Button>
                  )}
                </div>
                {isOpen && mat.type === "pdf" && (
                  <div className="mt-3"><PdfViewer url={mat.url} title={mat.title} /></div>
                )}
                {isOpen && mat.type === "video" && (
                  <div className="mt-3">
                    <VideoPlayer
                      url={mat.url}
                      initialProgress={progress.videoProgress[mat.id] || 0}
                      onProgress={(p) => updateVideoProgress(mat.id, p)}
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={progress.videoProgress[mat.id] || 0} className="h-1 flex-1" />
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {progress.videoProgress[mat.id] || 0}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {module.materials.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">No materials yet.</div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Tasks</h2>
        <div className="rounded-2xl bg-white border divide-y">
          {module.tasks.map((t) => {
            const status = progress.taskStatus[t.id] || "not_started";
            const Icon = status === "done" ? CheckCircle2 : status === "in_progress" ? Clock : Circle;
            const color =
              status === "done" ? "text-emerald-600" : status === "in_progress" ? "text-amber-600" : "text-muted-foreground";
            return (
              <button
                key={t.id}
                className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setActiveTask(t)}
              >
                <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.description}</div>
                </div>
                <span className="text-xs text-muted-foreground capitalize shrink-0">
                  {status.replace("_", " ")}
                </span>
              </button>
            );
          })}
          {module.tasks.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">No tasks yet.</div>
          )}
        </div>
      </section>

      <TaskDialog
        task={activeTask}
        status={activeTask ? (progress.taskStatus[activeTask.id] || "not_started") : "not_started"}
        open={!!activeTask}
        onOpenChange={(o) => !o && setActiveTask(null)}
        onStart={() => activeTask && setTaskStatus(activeTask.id, "in_progress")}
        onComplete={() => {
          if (activeTask) {
            setTaskStatus(activeTask.id, "done");
            setActiveTask(null);
          }
        }}
      />
    </ELearningLayout>
  );
}
