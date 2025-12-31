import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  Workflow, 
  PanelLeftClose, 
  PanelLeft,
  Plus,
  MoreHorizontal,
  Bot
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type SidebarMode = "chat" | "workflow";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: "form" | "processing" | "approval";
  status: "current" | "pending" | "completed";
}

interface UnifiedSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mode: SidebarMode;
  onModeChange: (mode: SidebarMode) => void;
  // Workflow props
  workflowName?: string;
  workflowDescription?: string;
  steps?: WorkflowStep[];
  currentStep?: number;
}

// Sample data
const assistants = [
  { id: "1", name: "Panta AI" },
  { id: "2", name: "Research Helper" },
  { id: "3", name: "Writing Assistant" },
];

const chatHistory = [
  { id: "1", title: "Offering Assistance", timestamp: "2 hours ago" },
  { id: "2", title: "Project Planning", timestamp: "Yesterday" },
  { id: "3", title: "Code Review Help", timestamp: "2 days ago" },
  { id: "4", title: "Design Discussion", timestamp: "3 days ago" },
];

const UnifiedSidebar = ({
  isCollapsed,
  onToggleCollapse,
  mode,
  onModeChange,
  workflowName = "Workflow",
  workflowDescription,
  steps = [],
  currentStep = 0,
}: UnifiedSidebarProps) => {
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate("/chat");
  };

  // Collapsed state
  if (isCollapsed) {
    return (
      <aside className="w-12 bg-background border-r border-border flex flex-col items-center py-3 gap-2">
        <button
          onClick={() => onModeChange("chat")}
          className={cn(
            "p-2 rounded-md transition-colors",
            mode === "chat" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <MessageSquare className="h-4 w-4" />
        </button>
        <button
          onClick={() => onModeChange("workflow")}
          className={cn(
            "p-2 rounded-md transition-colors",
            mode === "workflow" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Workflow className="h-4 w-4" />
        </button>
        <div className="flex-1" />
        <button
          onClick={onToggleCollapse}
          className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col">
      {/* Header with mode icons */}
      <div className="h-14 px-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onModeChange("chat")}
            className={cn(
              "p-2 rounded-md transition-colors",
              mode === "chat" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            )}
            title="Chat"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          <button
            onClick={() => onModeChange("workflow")}
            className={cn(
              "p-2 rounded-md transition-colors",
              mode === "workflow" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            )}
            title="Workflow"
          >
            <Workflow className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-1">
          {mode === "chat" && (
            <button
              onClick={handleNewChat}
              className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          {mode === "workflow" && (
            <button
              className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
              title="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
            title="Collapse"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content based on mode */}
      <ScrollArea className="flex-1">
        {mode === "chat" ? (
          <div className="p-3 space-y-4">
            {/* Assistants */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Assistants</p>
              <div className="space-y-1">
                {assistants.map((assistant) => (
                  <button
                    key={assistant.id}
                    onClick={() => navigate("/chat")}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{assistant.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat History */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 px-1">History</p>
              <div className="space-y-1">
                {chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => navigate("/chat")}
                    className="w-full flex flex-col items-start px-2 py-1.5 text-sm hover:bg-muted rounded-md transition-colors"
                  >
                    <span className="text-foreground truncate w-full text-left">{chat.title}</span>
                    <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-4">
            {/* Workflow Header */}
            <div>
              <h3 className="font-medium text-foreground">{workflowName}</h3>
              {workflowDescription && (
                <p className="text-xs text-muted-foreground mt-1">{workflowDescription}</p>
              )}
            </div>

            {/* Progress */}
            {steps.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium text-foreground">
                    {currentStep + 1} / {steps.length}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Steps */}
            <div className="space-y-1">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "px-2 py-2 rounded-md transition-colors",
                    step.status === "current" && "bg-primary/10 border border-primary/20",
                    step.status === "completed" && "opacity-60",
                    step.status === "pending" && "opacity-40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium",
                      step.status === "completed" && "bg-primary text-primary-foreground",
                      step.status === "current" && "bg-primary text-primary-foreground",
                      step.status === "pending" && "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-foreground">{step.title}</span>
                  </div>
                  {step.status === "current" && step.description && (
                    <p className="text-xs text-muted-foreground mt-1 ml-7">{step.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
};

export default UnifiedSidebar;
