import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Task, TaskStatus } from "@/data/elearningData";
import VideoPlayer from "./VideoPlayer";
import PdfViewer from "./PdfViewer";

interface Props {
  task: Task | null;
  status: TaskStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  onStart: () => void;
}

export default function TaskDialog({ task, status, open, onOpenChange, onComplete, onStart }: Props) {
  if (!task) return null;
  return (
    <Dialog open={open} onOpenChange={(o) => {
      if (o && status === "not_started") onStart();
      onOpenChange(o);
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>{task.description}</DialogDescription>
        </DialogHeader>
        {task.embedType === "video" && task.embedUrl && (
          <VideoPlayer url={task.embedUrl} />
        )}
        {task.embedType === "pdf" && task.embedUrl && (
          <PdfViewer url={task.embedUrl} title={task.title} />
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            Status: {status === "done" ? "Done" : status === "in_progress" ? "In progress" : "Not started"}
          </span>
          <Button onClick={onComplete} disabled={status === "done"}>
            <CheckCircle2 className="h-4 w-4" />
            {status === "done" ? "Completed" : "Mark as complete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
