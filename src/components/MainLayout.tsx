import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";

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

const MainLayout = ({
  children,
  workflowName,
  workflowDescription,
  workflowSteps,
  currentWorkflowStep = 0,
}: MainLayoutProps) => {
  return (
    <div className="flex h-screen w-full bg-background">
      <AppSidebar
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        workflowSteps={workflowSteps}
        currentWorkflowStep={currentWorkflowStep}
      />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
