import { PanelLeftClose, PanelLeft, FileText, Clock, Play, Eye, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: "form" | "processing" | "approval";
  status: "current" | "pending" | "completed";
}

interface WorkflowSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  workflowName?: string;
  workflowDescription?: string;
  steps?: WorkflowStep[];
  currentStep?: number;
}

const WorkflowSidebar = ({
  isCollapsed,
  onToggleCollapse,
  workflowName = "Workflow",
  workflowDescription = "Complete the workflow steps below.",
  steps = [],
  currentStep = 0,
}: WorkflowSidebarProps) => {
  // Default sample steps if none provided
  const defaultSteps: WorkflowStep[] = [
    {
      id: "1",
      title: "Enter Your Scenes",
      description: "Enter each scene with a title and script.",
      type: "form",
      status: "current",
    },
    {
      id: "2",
      title: "Upload Scene Images",
      description: "Upload one image for each scene you created.",
      type: "form",
      status: "pending",
    },
    {
      id: "3",
      title: "Preparing Preview",
      description: "Preparing Preview of image and video",
      type: "processing",
      status: "pending",
    },
    {
      id: "4",
      title: "Review Scenes & Images",
      description: "Review and approve your content.",
      type: "approval",
      status: "pending",
    },
    {
      id: "5",
      title: "Generate Video",
      description: "Generate your final video.",
      type: "processing",
      status: "pending",
    },
    {
      id: "6",
      title: "Download & Share",
      description: "Download or share your video.",
      type: "form",
      status: "pending",
    },
  ];

  const displaySteps = steps.length > 0 ? steps : defaultSteps;
  const totalSteps = displaySteps.length;
  const progress = (currentStep / totalSteps) * 100;

  const getStepIcon = (step: WorkflowStep) => {
    if (step.status === "completed") {
      return <CheckCircle className="h-5 w-5 text-primary" />;
    }
    if (step.status === "current") {
      return (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Play className="h-4 w-4 text-primary" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
        <Clock className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  };

  if (isCollapsed) {
    return (
      <aside className="w-16 h-full bg-background border-r border-border flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-muted transition-colors mb-6"
        >
          <PanelLeft className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Collapsed step indicators */}
        <div className="flex flex-col items-center gap-3">
          {displaySteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              {step.status === "completed" ? (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
              ) : step.status === "current" ? (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="h-4 w-4 text-primary" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              {index < displaySteps.length - 1 && (
                <div className="w-px h-4 bg-border my-1" />
              )}
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 h-full bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">Workflow Overview</h2>
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <PanelLeftClose className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Workflow Info */}
          <div className="pb-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">{workflowName}</h3>
            <p className="text-xs text-muted-foreground mt-1">{workflowDescription}</p>
          </div>

          {/* Progress */}
          <div className="py-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Progress</span>
              <span className="text-xs font-medium text-foreground">{currentStep} / {totalSteps}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Steps */}
          <div className="py-4 space-y-3">
            {displaySteps.map((step, index) => (
              <div key={step.id} className="relative">
                <div
                  className={cn(
                    "p-4 rounded-xl border transition-colors",
                    step.status === "current"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {step.status === "completed" ? (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                      ) : step.status === "current" ? (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Play className="h-5 w-5 text-primary" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground">{step.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {step.type}
                        </span>
                        {step.status === "current" && (
                          <Play className="h-3 w-3 text-primary" />
                        )}
                        {step.status === "pending" && (
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{step.description}</p>
                    </div>
                  </div>
                </div>
                {/* Connector line */}
                {index < displaySteps.length - 1 && (
                  <div className="absolute left-8 top-full w-px h-3 bg-border" />
                )}
              </div>
            ))}
          </div>

          {/* Step counter */}
          <div className="text-center text-sm text-muted-foreground pt-2">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default WorkflowSidebar;
