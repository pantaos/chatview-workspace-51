import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ELearningLayout from "./ELearningLayout";
import { Progress } from "@/components/ui/progress";
import { Calendar, ArrowRight } from "lucide-react";
import { getModules, getProgress, moduleCompletion, Module, ProgressState } from "@/data/elearningData";

export default function ELearningModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<ProgressState>({ materialsOpened: {}, videoProgress: {}, taskStatus: {} });

  useEffect(() => {
    setModules(getModules());
    setProgress(getProgress());
  }, []);

  return (
    <ELearningLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Modules</h1>
        <p className="text-muted-foreground mt-1.5">Work through the curriculum in order.</p>
      </div>

      <div className="space-y-3">
        {modules.map((m) => {
          const pct = moduleCompletion(m, progress);
          return (
            <Link
              key={m.id}
              to={`/elearning/modules/${m.id}`}
              className="block rounded-2xl bg-white border p-5 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold shrink-0">
                  {m.order}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{m.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{m.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(m.scheduledAt).toLocaleString()}
                    </span>
                    <span>{m.materials.length} materials · {m.tasks.length} tasks</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={pct} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </ELearningLayout>
  );
}
