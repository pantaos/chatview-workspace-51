import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Calendar, Play, Clock, Users } from "lucide-react";
import { UseCase } from "@/data/useCases";
import { useIsMobile } from "@/hooks/use-mobile";

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
  onSchedule,
}: TaskPreviewDialogProps) {
  const isMobile = useIsMobile();
  if (!task) return null;
  const Icon = task.icon;

  const content = (
    <div className="space-y-5 p-1">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground/70 shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold leading-tight">{task.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Ready-to-run automation for your {task.team} team.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetaRow icon={<Users className="h-3.5 w-3.5" />} label="Team" value={task.team} />
        <MetaRow icon={<Clock className="h-3.5 w-3.5" />} label="Saves" value={task.saves} />
      </div>

      <div>
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Type
        </h3>
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80">
          {task.taskType}
        </span>
      </div>

      {task.integrations.length > 0 && (
        <div>
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Works with
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {task.integrations.map((i) => (
              <span
                key={i}
                className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const footer = (
    <div className="flex gap-2 pt-4 border-t border-border/50 mt-4">
      <Button variant="outline" onClick={() => onSchedule(task)} className="flex-1">
        <Calendar className="h-4 w-4 mr-2" />
        Schedule
      </Button>
      <Button onClick={() => onRun(task)} className="flex-1">
        <Play className="h-4 w-4 mr-2" />
        Run now
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-0">
            <DrawerTitle className="sr-only">{task.name}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 pb-safe">
            {content}
            {footer}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>{task.name}</DialogTitle>
        </DialogHeader>
        {content}
        {footer}
      </DialogContent>
    </Dialog>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 p-2.5">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-sm font-medium text-foreground mt-0.5">{value}</div>
    </div>
  );
}
