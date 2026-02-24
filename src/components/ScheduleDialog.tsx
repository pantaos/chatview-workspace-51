import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle2, Bell, Repeat } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  useCaseName: string;
}

const frequencies = [
  { id: "daily", label: "Daily", description: "Runs every day" },
  { id: "weekly", label: "Weekly", description: "Runs once a week" },
  { id: "biweekly", label: "Bi-weekly", description: "Runs every 2 weeks" },
  { id: "monthly", label: "Monthly", description: "Runs once a month" },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

const ScheduleDialog = ({ open, onOpenChange, useCaseName }: ScheduleDialogProps) => {
  const [frequency, setFrequency] = useState("weekly");
  const [day, setDay] = useState("Monday");
  const [time, setTime] = useState("09:00 AM");
  const [notifyOnComplete, setNotifyOnComplete] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      onOpenChange(false);
      setSaved(false);
      toast.success(`"${useCaseName}" scheduled ${frequency}`, {
        description: `${frequency === "daily" ? "Every day" : `Every ${day}`} at ${time}`,
      });
    }, 1500);
  };

  const selectedFreq = frequencies.find((f) => f.id === frequency);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Schedule Automation
          </DialogTitle>
          <DialogDescription>
            Set up "{useCaseName}" to run automatically
          </DialogDescription>
        </DialogHeader>

        {saved ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <p className="text-sm font-semibold text-foreground">Schedule Saved!</p>
            <p className="text-xs text-muted-foreground text-center">
              {useCaseName} will run {frequency === "daily" ? "daily" : `every ${day}`} at {time}
            </p>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* Frequency */}
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">Frequency</label>
              <div className="grid grid-cols-2 gap-2">
                {frequencies.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFrequency(f.id)}
                    className={cn(
                      "flex flex-col items-start p-3 rounded-lg border text-left transition-all",
                      frequency === f.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/60 hover:border-border hover:bg-muted/30"
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">{f.label}</span>
                    <span className="text-[10px] text-muted-foreground">{f.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Day (if not daily) */}
            {frequency !== "daily" && (
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block">Day</label>
                <Select value={day} onValueChange={setDay}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Time */}
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">Time</label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {times.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notify toggle */}
            <button
              onClick={() => setNotifyOnComplete(!notifyOnComplete)}
              className={cn(
                "flex items-center gap-3 w-full p-3 rounded-lg border transition-all text-left",
                notifyOnComplete
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/60 hover:bg-muted/30"
              )}
            >
              <Bell className={cn("h-4 w-4", notifyOnComplete ? "text-primary" : "text-muted-foreground")} />
              <div>
                <span className="text-sm font-medium text-foreground">Notify on completion</span>
                <p className="text-[10px] text-muted-foreground">Get a Slack message when the run completes</p>
              </div>
            </button>

            {/* Preview */}
            <div className="border border-border/60 rounded-lg bg-muted/30 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Repeat className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">Schedule Preview</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{useCaseName}</span> will run{" "}
                {frequency === "daily"
                  ? "every day"
                  : frequency === "weekly"
                  ? `every ${day}`
                  : frequency === "biweekly"
                  ? `every other ${day}`
                  : `on the first ${day} of each month`}{" "}
                at <span className="font-medium text-foreground">{time}</span>
                {notifyOnComplete && " with Slack notifications"}.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" className="flex-1 gap-1.5" onClick={handleSave}>
                <Calendar className="h-3.5 w-3.5" />
                Save Schedule
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
