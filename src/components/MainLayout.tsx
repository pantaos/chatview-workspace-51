import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import ChatSidebar from "./sidebars/ChatSidebar";
import WorkflowSidebar from "./sidebars/WorkflowSidebar";

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

// Routes that show chat sidebar
const chatRoutes = ["/chat", "/dashboard"];

// Routes that show workflow sidebar
const workflowRoutes = ["/trendcast", "/reportcard", "/image-cropper"];

const MainLayout = ({
  children,
  workflowName,
  workflowDescription,
  workflowSteps,
  currentWorkflowStep = 0,
}: MainLayoutProps) => {
  const location = useLocation();
  const [isSecondarySidebarCollapsed, setIsSecondarySidebarCollapsed] = useState(false);

  const isChatRoute = chatRoutes.some((route) => location.pathname.startsWith(route));
  const isWorkflowRoute = workflowRoutes.some((route) => location.pathname.startsWith(route));

  const showSecondarySidebar = isChatRoute || isWorkflowRoute;

  return (
    <div className="flex h-screen w-full bg-background">
      <AppSidebar />
      
      {/* Secondary sidebar based on route */}
      {showSecondarySidebar && (
        <>
          {isChatRoute && (
            <ChatSidebar
              isCollapsed={isSecondarySidebarCollapsed}
              onToggleCollapse={() => setIsSecondarySidebarCollapsed(!isSecondarySidebarCollapsed)}
            />
          )}
          {isWorkflowRoute && (
            <WorkflowSidebar
              isCollapsed={isSecondarySidebarCollapsed}
              onToggleCollapse={() => setIsSecondarySidebarCollapsed(!isSecondarySidebarCollapsed)}
              workflowName={workflowName}
              workflowDescription={workflowDescription}
              steps={workflowSteps}
              currentStep={currentWorkflowStep}
            />
          )}
        </>
      )}

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
