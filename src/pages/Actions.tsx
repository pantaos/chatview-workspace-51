import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  FileText,
  User,
  Calendar
} from "lucide-react";

// Sample action data
interface ActionItem {
  id: string;
  title: string;
  description: string;
  type: "approval" | "handoff" | "review" | "task";
  priority: "high" | "medium" | "low";
  status: "pending" | "completed";
  workflow: string;
  assignedBy: {
    name: string;
    avatar?: string;
    initials: string;
  };
  createdAt: Date;
  dueDate?: Date;
}

const mockPendingActions: ActionItem[] = [
  // Empty for now - shows empty state
];

const mockCompletedActions: ActionItem[] = [
  {
    id: "c1",
    title: "Content-Freigabe HDI Newsletter",
    description: "Newsletter-Inhalte für Q1 2026 wurden genehmigt",
    type: "approval",
    priority: "medium",
    status: "completed",
    workflow: "HDI Content",
    assignedBy: { name: "Maria Chen", initials: "MC" },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

export default function Actions() {
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pendingActions = mockPendingActions;
  const completedActions = mockCompletedActions;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getPriorityColor = (priority: ActionItem["priority"]) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-orange-500";
      case "low": return "text-muted-foreground";
    }
  };

  const getTypeIcon = (type: ActionItem["type"]) => {
    switch (type) {
      case "approval": return CheckCircle2;
      case "handoff": return ChevronRight;
      case "review": return FileText;
      case "task": return Clock;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric" 
    });
  };

  const ActionList = ({ actions }: { actions: ActionItem[] }) => {
    if (actions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {activeTab === "pending" 
              ? "Keine ausstehenden Aktionen" 
              : "Keine abgeschlossenen Aktionen"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {actions.map((action) => {
          const TypeIcon = getTypeIcon(action.type);
          return (
            <button
              key={action.id}
              onClick={() => setSelectedAction(action)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                selectedAction?.id === action.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "mt-0.5 p-1.5 rounded-md",
                action.status === "completed" ? "bg-muted" : "bg-primary/10"
              )}>
                <TypeIcon className={cn(
                  "h-4 w-4",
                  action.status === "completed" ? "text-muted-foreground" : "text-primary"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium text-sm truncate",
                    action.status === "completed" && "text-muted-foreground"
                  )}>
                    {action.title}
                  </span>
                  {action.priority === "high" && action.status === "pending" && (
                    <AlertCircle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {action.workflow}
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatDate(action.createdAt)}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  const ActionDetail = () => {
    if (!selectedAction) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Aufgabe auswählen, um Details anzuzeigen
          </p>
        </div>
      );
    }

    const TypeIcon = getTypeIcon(selectedAction.type);

    return (
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <TypeIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{selectedAction.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedAction.description}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Zugewiesen von:</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={selectedAction.assignedBy.avatar} />
                <AvatarFallback className="text-[8px]">
                  {selectedAction.assignedBy.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{selectedAction.assignedBy.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Erstellt:</span>
            <span className="text-sm">{formatDate(selectedAction.createdAt)}</span>
          </div>

          {selectedAction.dueDate && (
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Fällig:</span>
              <span className="text-sm">{formatDate(selectedAction.dueDate)}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Badge variant="secondary" className="text-xs">
              {selectedAction.workflow}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn("text-xs", getPriorityColor(selectedAction.priority))}
            >
              {selectedAction.priority === "high" && "Hohe Priorität"}
              {selectedAction.priority === "medium" && "Mittlere Priorität"}
              {selectedAction.priority === "low" && "Niedrige Priorität"}
            </Badge>
          </div>
        </div>

        {selectedAction.status === "pending" && (
          <div className="flex gap-2 mt-8">
            <Button className="flex-1">Genehmigen</Button>
            <Button variant="outline" className="flex-1">Ablehnen</Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Standardized Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Aktionen</h1>
            <p className="mt-1 text-muted-foreground">
              Genehmigungen, Übergaben und andere Workflow-Aktionen prüfen und beantworten
            </p>
          </div>

          {/* Tabs with Refresh */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "pending" | "completed")}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-transparent p-0 h-auto gap-6 justify-start">
                <TabsTrigger
                  value="pending"
                  className="px-0 pb-2 text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-foreground"
                >
                  Ausstehend
                  {pendingActions.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {pendingActions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="px-0 pb-2 text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-foreground"
                >
                  Abgeschlossen
                </TabsTrigger>
              </TabsList>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                className="h-8 w-8"
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  isRefreshing && "animate-spin"
                )} />
              </Button>
            </div>

            {/* Split Layout: List + Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
              {/* Actions List */}
              <div className="border border-border/50 rounded-lg bg-card">
                <TabsContent value="pending" className="mt-0 p-3">
                  <ActionList actions={pendingActions} />
                </TabsContent>
                <TabsContent value="completed" className="mt-0 p-3">
                  <ActionList actions={completedActions} />
                </TabsContent>
              </div>

              {/* Detail Panel */}
              <div className="border border-border/50 rounded-lg bg-card hidden lg:flex flex-col">
                <ActionDetail />
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
