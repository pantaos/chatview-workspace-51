import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  MessageSquare,
  Settings,
  Shield,
  ChevronDown,
  ChevronRight,
  PanelLeft,
  Inbox,
  X,
  Filter,
  LayoutDashboard,
  CheckCheck,
  History,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample notifications data - now as initial state
const initialNotifications = [
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

interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  type?: "form" | "processing" | "approval";
  status: "current" | "pending" | "completed";
}

interface AppSidebarProps {
  workflowName?: string;
  workflowDescription?: string;
  workflowSteps?: WorkflowStep[];
  currentWorkflowStep?: number;
}

// Helper for relative time in German
const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `vor ${diffMins}m`;
  if (diffHours < 24) return `vor ${diffHours}h`;
  if (diffDays === 1) return "vor 1 Tag";
  return `vor ${diffDays} Tagen`;
};

// Sample data
const chatHistory = [
  { id: "1", title: "Offering Assistance", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: "2", title: "Project Planning", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: "3", title: "Code Review Help", timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
];

// Combined Apps (Assistants + Workflows)
const apps = [
  { id: "1", name: "TonalitätsGPT", href: "/chat" },
  { id: "2", name: "Trendcast", href: "/trendcast" },
  { id: "3", name: "Report Card", href: "/reportcard" },
  { id: "4", name: "ArianGPT", href: "/chat" },
  { id: "5", name: "Image Cropper", href: "/image-cropper" },
];

const AppSidebar = ({
  workflowName,
  workflowSteps = [],
  currentWorkflowStep = 0,
}: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  // Collapsible states
  const [historyOpen, setHistoryOpen] = useState(true);
  const [appsOpen, setAppsOpen] = useState(true);
  const [workflowOpen, setWorkflowOpen] = useState(true);
  
  const unreadCount = notifications.filter(n => n.unread).length;
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Check if we're in a workflow
  const hasActiveWorkflow = workflowSteps.length > 0 && workflowName;
  const totalSteps = workflowSteps.length;
  const completedSteps = workflowSteps.filter(s => s.status === "completed").length;

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href;
  };

  // Inbox Content Component (reusable for both mobile and desktop)
  const InboxContent = () => (
    <>
      {/* Inbox Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0">
        <h3 className="text-sm font-medium text-foreground/90">Inbox</h3>
        <div className="flex items-center gap-0.5">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-muted-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-md transition-all duration-200"
            >
              <CheckCheck className="h-3 w-3" />
              <span>Mark all read</span>
            </button>
          )}
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
          <p className="text-[11px] text-muted-foreground/70 px-4 py-2 uppercase tracking-wider font-medium">Today</p>
          {notifications.map((notif) => (
            <button
              key={notif.id}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3 transition-all duration-200 text-left group relative min-h-[60px]",
                notif.unread 
                  ? "bg-primary/[0.06] hover:bg-primary/[0.10]" 
                  : "hover:bg-muted/50"
              )}
            >
              {notif.unread && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary/60 rounded-r" />
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
                  <span className="text-[13px] text-muted-foreground/80">{notif.action}</span>
                  <span className="text-[13px] text-foreground/80">{notif.project}</span>
                </div>
                <p className="text-[12px] text-muted-foreground/70 truncate mt-0.5 leading-relaxed">{notif.preview}</p>
              </div>
              <span className="text-[11px] text-muted-foreground/60 flex-shrink-0 mt-0.5">{notif.time}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </>
  );

  // Render collapsed sidebar
  if (isCollapsed) {
    return (
      <aside className="w-14 h-screen bg-background border-r border-border flex flex-col items-center py-3 flex-shrink-0">
        {/* Logo with hover toggle */}
        <div 
          className="relative mb-4 cursor-pointer"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          onClick={() => setIsCollapsed(false)}
        >
          {isLogoHovered ? (
            <div className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <PanelLeft className="h-5 w-5" />
            </div>
          ) : (
            <img 
              src="/panta-logo.png" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
            />
          )}
        </div>

        {/* Main nav icons */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => navigate("/chat")}
            className="p-2 rounded-lg text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
            title="Neuer Chat"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isActive("/dashboard")
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
            title="Dashboard"
          >
            <LayoutDashboard className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate("/community-feed")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isActive("/community-feed")
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
            title="Community Feed"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowInbox(!showInbox)}
            className={cn(
              "p-2 rounded-lg transition-colors relative",
              showInbox
                ? "bg-muted text-foreground"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
            title="Inbox"
          >
            <Inbox className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary/60 rounded-full" />
            )}
          </button>
          <button
            onClick={() => navigate("/history")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isActive("/history")
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
            title="History"
          >
            <History className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1" />

        {/* Bottom icons */}
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => navigate("/admin-settings")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isActive("/admin-settings")
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
            title="Admin"
          >
            <Shield className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate("/settings")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isActive("/settings")
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="p-1 mt-1"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                AO
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </aside>
    );
  }

  // Render Inbox Panel - now supports mobile fullscreen drawer
  const renderInboxPanel = () => {
    if (isMobile) {
      return (
        <Drawer open={showInbox} onOpenChange={setShowInbox}>
          <DrawerContent className="h-[95vh] max-h-[95vh] flex flex-col">
            <InboxContent />
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <div className="absolute left-full top-0 ml-2 w-80 h-[480px] bg-background border border-border/60 rounded-xl shadow-xl shadow-black/5 z-50 flex flex-col overflow-hidden animate-fade-in">
        <InboxContent />
      </div>
    );
  };

  return (
    <aside className="w-64 h-screen bg-background border-r border-border flex flex-col flex-shrink-0 relative">
      {/* Header with Logo and Toggle */}
      <div className="h-14 px-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <img 
            src="/panta-logo.png" 
            alt="Logo" 
            className="w-7 h-7 object-contain"
          />
          <span className="text-sm font-bold text-foreground">PANTA</span>
        </div>
        
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
          title="Sidebar einklappen"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      </div>
      {/* Inbox Panel */}
      {showInbox && renderInboxPanel()}

      {/* Main Content */}
      <ScrollArea className="flex-1 px-3 py-4">
        {/* Quick Actions */}
        <nav className="space-y-0.5 mb-6">
          <button
            onClick={() => navigate("/chat")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            <span>New Chat</span>
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive("/dashboard")
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => navigate("/community-feed")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive("/community-feed")
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <MessageSquare className="h-4 w-4 flex-shrink-0" />
            <span>Community Feed</span>
          </button>
          <button
            onClick={() => setShowInbox(!showInbox)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              showInbox
                ? "bg-muted text-foreground"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <Inbox className="h-4 w-4 flex-shrink-0" />
              <span>Inbox</span>
            </div>
            {unreadCount > 0 && (
              <span className="w-2 h-2 bg-primary/60 rounded-full" />
            )}
          </button>
          <button
            onClick={() => navigate("/history")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive("/history")
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <History className="h-4 w-4 flex-shrink-0" />
            <span>History</span>
          </button>
        </nav>

        {/* Active Workflow Section (only when in a workflow) - NOW AT TOP */}
        {hasActiveWorkflow && (
          <Collapsible open={workflowOpen} onOpenChange={setWorkflowOpen} className="mb-4">
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              <div className="flex items-center gap-2">
                {workflowOpen ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <span className="truncate">{workflowName}</span>
              </div>
            </CollapsibleTrigger>
            
            {/* Progress indicator */}
            <div className="px-3 py-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                <span>Step {currentWorkflowStep + 1} of {totalSteps}</span>
                <span>{Math.round(((completedSteps) / totalSteps) * 100)}%</span>
              </div>
              <div className="flex gap-1">
                {workflowSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      step.status === "completed" 
                        ? "bg-primary" 
                        : step.status === "current"
                        ? "bg-primary/50"
                        : "bg-muted-foreground/20"
                    )}
                  />
                ))}
              </div>
            </div>
            
            <CollapsibleContent className="space-y-0.5">
              {workflowSteps.map((step, index) => (
                <button
                  key={step.id}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors text-left",
                    step.status === "current"
                      ? "bg-primary/10 text-primary font-medium"
                      : step.status === "completed"
                      ? "text-foreground/50"
                      : "text-foreground/40"
                  )}
                >
                  <span className="text-xs w-4 text-center">{index + 1}.</span>
                  <span className="truncate">{step.title}</span>
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Apps Section (Combined Assistants + Workflows) */}
        <Collapsible open={appsOpen} onOpenChange={setAppsOpen} className="mb-4">
          <CollapsibleTrigger className="flex items-center gap-2 px-3 py-2 w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            {appsOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            Apps
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-0.5 mt-1">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => navigate(app.href)}
                className={cn(
                  "w-full flex items-center px-3 py-1.5 text-sm rounded-md transition-colors",
                  isActive(app.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="truncate">{app.name}</span>
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* History Section - NOW AT BOTTOM */}
        <Collapsible open={historyOpen} onOpenChange={setHistoryOpen} className="mb-4">
          <CollapsibleTrigger className="flex items-center gap-2 px-3 py-2 w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            {historyOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            History
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-0.5 mt-1">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => navigate("/chat")}
                className="w-full flex flex-col items-start px-3 py-2 text-foreground/70 hover:bg-muted hover:text-foreground rounded-md transition-colors"
              >
                <span className="text-sm truncate w-full text-left">{chat.title}</span>
                <span className="text-xs text-muted-foreground">{getRelativeTime(chat.timestamp)}</span>
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="px-3 py-2 border-t border-border space-y-0.5">
        <button
          onClick={() => navigate("/admin-settings")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            isActive("/admin-settings")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Shield className="h-4 w-4" />
          <span>Admin</span>
        </button>
        <button
          onClick={() => navigate("/settings")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            isActive("/settings")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
        
        {/* User Profile - Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md hover:bg-muted transition-colors">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                  AO
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground truncate">
                Arian Okhovat
              </span>
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="start" side="top" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/settings?tab=profile")}>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings?tab=general")}>
              <Settings className="mr-2 h-4 w-4" />
              Allgemein
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Abmelden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default AppSidebar;
