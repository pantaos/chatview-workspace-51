import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import AppSidebar from "./AppSidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MainLayoutProps {
  children: ReactNode;
  mobileTitle?: string;
  workflowName?: string;
  workflowDescription?: string;
  workflowSteps?: Array<{
    id: string;
    title: string;
    description: string;
    type: "form" | "processing" | "approval";
    status: "current" | "pending" | "completed";
  }>;
  currentWorkflowStep?: number;
}

// Map routes to mobile titles
const routeTitles: Record<string, string> = {
  "/": "PANTA",
  "/chat": "Chat",
  "/dashboard": "Dashboard",
  "/templates": "App Store",
  "/community-feed": "Community",
  "/history": "History",
  "/settings": "Settings",
  "/admin-settings": "Admin",
  "/profile": "Profil",
};

const MainLayout = ({
  children,
  mobileTitle,
  workflowName,
  workflowDescription,
  workflowSteps,
  currentWorkflowStep = 0,
}: MainLayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get title from route or use provided mobileTitle
  const title = mobileTitle || routeTitles[location.pathname] || "PANTA";

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <span className="text-base font-semibold text-foreground">
            {title}
          </span>
          
          <div className="w-9" /> {/* Spacer for centering */}
        </header>
      )}

      {/* Mobile Sidebar as Sheet */}
      {isMobile ? (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <AppSidebar
              workflowName={workflowName}
              workflowDescription={workflowDescription}
              workflowSteps={workflowSteps}
              currentWorkflowStep={currentWorkflowStep}
              onNavigate={() => setSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <AppSidebar
          workflowName={workflowName}
          workflowDescription={workflowDescription}
          workflowSteps={workflowSteps}
          currentWorkflowStep={currentWorkflowStep}
        />
      )}

      <main className={cn("flex-1 overflow-auto", isMobile && "pt-14")}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
