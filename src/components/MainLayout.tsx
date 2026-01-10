import { ReactNode, useState, useEffect, useRef } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Get title from route or use provided mobileTitle
  const title = mobileTitle || routeTitles[location.pathname] || "PANTA";

  // Track scroll position for mobile header
  useEffect(() => {
    const main = mainRef.current;
    if (!main || !isMobile) return;

    const handleScroll = () => {
      setIsScrolled(main.scrollTop > 20);
    };

    main.addEventListener('scroll', handleScroll);
    return () => main.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <header 
          className={cn(
            "fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 transition-all duration-200",
            isScrolled 
              ? "bg-background/95 backdrop-blur-sm border-b border-border justify-between"
              : "bg-transparent justify-start"
          )}
        >
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <span 
            className={cn(
              "text-base font-semibold text-foreground transition-opacity duration-200",
              isScrolled ? "opacity-100" : "opacity-0"
            )}
          >
            {title}
          </span>
          
          {isScrolled && <div className="w-9" />}
        </header>
      )}

      {/* Mobile Sidebar as Sheet */}
      {isMobile ? (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px] [&>button]:hidden">
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

      <main 
        ref={mainRef}
        className={cn("flex-1 overflow-auto", isMobile && "pt-14")}
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
