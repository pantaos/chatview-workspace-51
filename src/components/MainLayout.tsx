import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import UnifiedSidebar from "./sidebars/UnifiedSidebar";

interface MainLayoutProps {
  children: ReactNode;
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

// Routes that default to chat mode
const chatRoutes = ["/chat", "/dashboard"];

// Routes that default to workflow mode
const workflowRoutes = ["/trendcast", "/reportcard", "/image-cropper"];

const MainLayout = ({
  children,
  workflowName,
  workflowDescription,
  workflowSteps,
  currentWorkflowStep = 0,
}: MainLayoutProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<"chat" | "workflow">("chat");

  // Auto-switch mode based on route
  useEffect(() => {
    const isChatRoute = chatRoutes.some((route) => location.pathname.startsWith(route));
    const isWorkflowRoute = workflowRoutes.some((route) => location.pathname.startsWith(route));
    
    if (isChatRoute) {
      setSidebarMode("chat");
    } else if (isWorkflowRoute) {
      setSidebarMode("workflow");
    }
  }, [location.pathname]);

  const showSidebar = chatRoutes.some((route) => location.pathname.startsWith(route)) ||
                      workflowRoutes.some((route) => location.pathname.startsWith(route));

  return (
    <div className="flex h-screen w-full bg-background">
      <AppSidebar />
      
      {showSidebar && (
        <UnifiedSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          mode={sidebarMode}
          onModeChange={setSidebarMode}
          workflowName={workflowName}
          workflowDescription={workflowDescription}
          steps={workflowSteps}
          currentStep={currentWorkflowStep}
        />
      )}

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
