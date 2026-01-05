import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  LayoutDashboard,
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
  Inbox,
  X,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample notifications data
const notifications = [
  {
    id: "1",
    user: { name: "Jörg Salamon", avatar: "", initials: "JS" },
    action: "commented in",
    project: "HDI",
    preview: "Präsentation Content Generation am 16.01.2026",
    time: "7h",
    unread: true,
  },
  {
    id: "2",
    user: { name: "Jörg Salamon", avatar: "", initials: "JS" },
    action: "commented in",
    project: "panta Ingenieure",
    preview: "Workflows für Wiki und Tender bestätigt. Interne Abstimmung...",
    time: "7h",
    unread: true,
  },
  {
    id: "3",
    user: { name: "Maria Chen", avatar: "", initials: "MC" },
    action: "mentioned you in",
    project: "Design Review",
    preview: "Can you take a look at the new mockups?",
    time: "1d",
    unread: false,
  },
  {
    id: "4",
    user: { name: "Alex Kim", avatar: "", initials: "AK" },
    action: "assigned you to",
    project: "Sprint Planning",
    preview: "New task: Update dashboard components",
    time: "2d",
    unread: false,
  },
];

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
  const [showInbox, setShowInbox] = useState(false);
  
  const unreadCount = notifications.filter(n => n.unread).length;

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
    { id: "community", label: "Community Feed", icon: MessageSquare, href: "/community-feed" },
    { id: "inbox", label: "Inbox", icon: Inbox, onClick: () => setShowInbox(!showInbox) },
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
          item.id === "inbox" ? (
            <button
              key={item.id}
              onClick={() => setShowInbox(!showInbox)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                showInbox
                  ? "bg-muted text-foreground"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Inbox className="h-5 w-5 flex-shrink-0" />
                <span>Inbox</span>
              </div>
              {unreadCount > 0 && (
                <span className="w-2 h-2 bg-primary/60 rounded-full" />
              )}
            </button>
          ) : (
            <NavButton key={item.id} item={item} />
          )
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

  // Render Inbox Panel (Subtle, Modern Design)
  const renderInboxPanel = () => (
    <div className="absolute left-full top-0 ml-2 w-80 h-[480px] bg-background border border-border/60 rounded-xl shadow-xl shadow-black/5 z-50 flex flex-col overflow-hidden animate-fade-in">
      {/* Inbox Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <h3 className="text-sm font-medium text-foreground/90">Inbox</h3>
        <div className="flex items-center gap-0.5">
          <button className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200">
            <Filter className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => setShowInbox(false)}
            className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Inbox Content */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          <p className="text-[11px] text-muted-foreground/50 px-4 py-2 uppercase tracking-wider font-medium">Today</p>
          {notifications.map((notif, index) => (
            <button
              key={notif.id}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3 transition-all duration-200 text-left group",
                notif.unread 
                  ? "bg-primary/[0.02] hover:bg-primary/[0.04]" 
                  : "hover:bg-muted/40"
              )}
            >
              {/* Unread indicator line */}
              {notif.unread && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary/40 rounded-r" />
              )}
              <Avatar className="h-7 w-7 flex-shrink-0 mt-0.5">
                <AvatarImage src={notif.user.avatar} />
                <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium">
                  {notif.user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={cn(
                    "text-[13px] text-foreground/90",
                    notif.unread ? "font-medium" : "font-normal"
                  )}>
                    {notif.user.name}
                  </span>
                  <span className="text-[13px] text-muted-foreground/60">{notif.action}</span>
                  <span className="text-[13px] text-foreground/70">{notif.project}</span>
                </div>
                <p className="text-[12px] text-muted-foreground/50 truncate mt-0.5 leading-relaxed">{notif.preview}</p>
              </div>
              <span className="text-[11px] text-muted-foreground/40 flex-shrink-0 mt-0.5">{notif.time}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <aside className="w-64 h-screen bg-background border-r border-border flex flex-col flex-shrink-0 relative">
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

      {/* Inbox Panel */}
      {showInbox && renderInboxPanel()}

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
