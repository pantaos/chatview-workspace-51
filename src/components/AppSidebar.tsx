import { useState } from "react";
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
  Mail,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
}

interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [assistantsOpen, setAssistantsOpen] = useState(true);
  const [workflowsOpen, setWorkflowsOpen] = useState(true);

  const mainNavItems: NavItem[] = [
    { id: "new-chat", label: "New Chat", icon: Plus, href: "/chat" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "community", label: "Community Feed", icon: Users, href: "/community-feed" },
    { id: "messages", label: "Messages", icon: MessageSquare, href: "/chat" },
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

  return (
    <aside className="w-64 h-screen bg-muted/30 border-r border-border flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <MessageSquare className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-foreground truncate">PANTA</h1>
          <p className="text-xs text-muted-foreground truncate">Flows QA</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex-shrink-0">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Messages</TooltipContent>
        </Tooltip>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
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
      </div>

      {/* Bottom Navigation */}
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
          <span className="text-sm font-medium text-foreground truncate">
            Arian Okhovat
          </span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
