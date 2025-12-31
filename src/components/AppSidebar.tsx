import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  LayoutDashboard,
  Users,
  MessageSquare,
  History,
  Compass,
  Bot,
  Sparkles,
  Workflow,
  Settings,
  Shield,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

type SidebarMode = "nav" | "chat" | "workflow";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: "form" | "processing" | "approval";
  status: "current" | "pending" | "completed";
}

interface AppSidebarProps {
  workflowName?: string;
  workflowDescription?: string;
  workflowSteps?: WorkflowStep[];
  currentWorkflowStep?: number;
}

// Routes that show chat mode option
const chatRoutes = ["/chat", "/dashboard"];
// Routes that show workflow mode option
const workflowRoutes = ["/trendcast", "/reportcard", "/image-cropper"];

// Sample data
const chatHistory = [
  { id: "1", title: "Offering Assistance", timestamp: "2 hours ago" },
  { id: "2", title: "Project Planning", timestamp: "Yesterday" },
  { id: "3", title: "Code Review Help", timestamp: "2 days ago" },
];

const assistantsList = [
  { id: "1", name: "Panta AI" },
  { id: "2", name: "Research Helper" },
  { id: "3", name: "Writing Assistant" },
];

const AppSidebar = ({
  workflowName = "Workflow",
  workflowDescription,
  workflowSteps = [],
  currentWorkflowStep = 0,
}: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [assistantsOpen, setAssistantsOpen] = useState(true);
  const [workflowsOpen, setWorkflowsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("nav");

  // Check if we're on a route that supports secondary modes
  const isChatRoute = chatRoutes.some((route) => location.pathname.startsWith(route));
  const isWorkflowRoute = workflowRoutes.some((route) => location.pathname.startsWith(route));
  const hasSecondaryMode = isChatRoute || isWorkflowRoute;

  // Auto-switch mode based on route
  useEffect(() => {
    if (isChatRoute) {
      setSidebarMode("chat");
    } else if (isWorkflowRoute) {
      setSidebarMode("workflow");
    } else {
      setSidebarMode("nav");
    }
  }, [location.pathname, isChatRoute, isWorkflowRoute]);

  const mainNavItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "community", label: "Community Feed", icon: Users, href: "/community-feed" },
    { id: "history", label: "History", icon: History, href: "/history" },
  ];

  const assistants: NavItem[] = [
    { id: "erkunden", label: "Erkunden", icon: Compass, href: "/chat" },
    { id: "ariangpt", label: "ArianGPT", icon: Bot, href: "/chat" },
    { id: "tonalitatsgpt", label: "TonalitätsGPT", icon: Sparkles, href: "/chat" },
  ];

  const workflows: NavItem[] = [
    { id: "workflow-1", label: "Sample workflow 1", icon: Workflow, href: "/trendcast" },
    { id: "workflow-2", label: "Sample workflow 2", icon: Workflow, href: "/reportcard" },
    { id: "workflow-3", label: "Sample workflow 3", icon: Workflow, href: "/image-cropper" },
  ];

  const bottomNavItems: NavItem[] = [
    { id: "admin", label: "Admin", icon: Shield, href: "/admin-settings" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href;
  };

  const handleNavClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      navigate(item.href);
    }
  };

  const NavButton = ({ item, indent = false }: { item: NavItem; indent?: boolean }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    if (isCollapsed) {
      return (
        <button
          onClick={() => handleNavClick(item)}
          className={cn(
            "w-full flex items-center justify-center p-2 rounded-lg transition-colors",
            active
              ? "bg-primary/10 text-primary"
              : "text-foreground/70 hover:bg-muted hover:text-foreground"
          )}
          title={item.label}
        >
          <Icon className="h-5 w-5" />
        </button>
      );
    }

    return (
      <button
        onClick={() => handleNavClick(item)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          indent && "pl-6",
          active
            ? "bg-primary/10 text-primary"
            : "text-foreground/70 hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  // Render collapsed sidebar
  if (isCollapsed) {
    return (
      <aside className="w-14 h-screen bg-background border-r border-border flex flex-col items-center py-3 flex-shrink-0">
        {/* Mode toggle icons at top */}
        {hasSecondaryMode && (
          <div className="flex flex-col gap-1 mb-4 pb-3 border-b border-border">
            {isChatRoute && (
              <button
                onClick={() => setSidebarMode("chat")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  sidebarMode === "chat" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
                title="Chat"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            )}
            {isWorkflowRoute && (
              <button
                onClick={() => setSidebarMode("workflow")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  sidebarMode === "workflow" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
                title="Workflow"
              >
                <Workflow className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Main nav icons */}
        <div className="flex flex-col gap-1">
          {mainNavItems.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </div>

        <div className="flex-1" />

        {/* Bottom icons */}
        <div className="flex flex-col gap-1">
          {bottomNavItems.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </div>

        {/* Expand button */}
        <button
          onClick={() => setIsCollapsed(false)}
          className="mt-3 p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
          title="Expand"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      </aside>
    );
  }

  // Render Chat Mode Content
  const renderChatContent = () => (
    <div className="p-3 space-y-4">
      {/* New Chat Button */}
      <button
        onClick={() => navigate("/chat")}
        className="w-full flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus className="h-4 w-4" />
        New Chat
      </button>

      {/* Assistants */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Assistants</p>
        <div className="space-y-1">
          {assistantsList.map((assistant) => (
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
  );

  // Render Workflow Mode Content
  const renderWorkflowContent = () => (
    <div className="p-3 space-y-4">
      {/* Workflow Header */}
      <div>
        <h3 className="font-medium text-foreground">{workflowName}</h3>
        {workflowDescription && (
          <p className="text-xs text-muted-foreground mt-1">{workflowDescription}</p>
        )}
      </div>

      {/* Progress */}
      {workflowSteps.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium text-foreground">
              {currentWorkflowStep + 1} / {workflowSteps.length}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentWorkflowStep + 1) / workflowSteps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-1">
        {workflowSteps.map((step, index) => (
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
  );

  // Render Navigation Content
  const renderNavContent = () => (
    <>
      <nav className="space-y-1">
        {mainNavItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </nav>

      {/* Assistants Section */}
      <div className="mt-6">
        <Collapsible open={assistantsOpen} onOpenChange={setAssistantsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 px-3 py-2 w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            {assistantsOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            Assistants
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1">
            {assistants.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Workflows Section */}
      <div className="mt-4">
        <Collapsible open={workflowsOpen} onOpenChange={setWorkflowsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 px-3 py-2 w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            {workflowsOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            Workflows
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1">
            {workflows.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );

  return (
    <aside className="w-64 h-screen bg-background border-r border-border flex flex-col flex-shrink-0">
      {/* Header with mode toggle */}
      <div className="h-14 px-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-1">
          {/* Mode toggle icons - only show when on relevant routes */}
          {hasSecondaryMode ? (
            <>
              {isChatRoute && (
                <button
                  onClick={() => setSidebarMode("chat")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    sidebarMode === "chat" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  )}
                  title="Chat"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              )}
              {isWorkflowRoute && (
                <button
                  onClick={() => setSidebarMode("workflow")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    sidebarMode === "workflow" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  )}
                  title="Workflow"
                >
                  <Workflow className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setSidebarMode("nav")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  sidebarMode === "nav" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
                title="Navigation"
              >
                <LayoutDashboard className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-foreground">PANTA</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {sidebarMode === "chat" && (
            <button
              onClick={() => navigate("/chat")}
              className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          {sidebarMode === "workflow" && (
            <button
              className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
              title="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
            title="Collapse"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content based on mode */}
      <ScrollArea className="flex-1 px-3 py-4">
        {sidebarMode === "chat" && renderChatContent()}
        {sidebarMode === "workflow" && renderWorkflowContent()}
        {sidebarMode === "nav" && renderNavContent()}
      </ScrollArea>

      {/* Bottom Navigation - always visible */}
      <div className="px-3 py-2 border-t border-border">
        <nav className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              AO
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <span className="text-sm font-medium text-foreground truncate">
              Arian Okhovat
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
