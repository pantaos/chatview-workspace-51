import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Video, FileVideo, UserCircle, Upload, Mail, Plus } from "lucide-react";
import { WorkflowConfigDialog } from "./WorkflowConfigDialog";
import { WorkflowAdminConfig, mockWorkflows } from "@/types/workflowAdmin";

const iconMap: Record<string, React.ReactNode> = {
  Video: <Video className="w-5 h-5 text-white" />,
  FileVideo: <FileVideo className="w-5 h-5 text-white" />,
  UserCircle: <UserCircle className="w-5 h-5 text-white" />,
  Upload: <Upload className="w-5 h-5 text-white" />,
  Mail: <Mail className="w-5 h-5 text-white" />,
};

const AdminWorkflowsTab = () => {
  const [workflows, setWorkflows] = useState<WorkflowAdminConfig[]>(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowAdminConfig | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleWorkflowClick = (workflow: WorkflowAdminConfig) => {
    setSelectedWorkflow(workflow);
    setDialogOpen(true);
  };

  const handleWorkflowUpdate = (updatedWorkflow: WorkflowAdminConfig) => {
    setWorkflows(prev =>
      prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w)
    );
    setSelectedWorkflow(updatedWorkflow);
  };

  const getApprovalCount = (workflow: WorkflowAdminConfig) => {
    return workflow.steps.filter(s => 
      s.type === 'approval' || s.collaboration?.enabled
    ).length;
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Workflow Customization</h2>
        <p className="text-muted-foreground">
          Configure workflow steps, parameters, and add approval/handover gates for different clients.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {workflows.map((workflow) => {
          const approvalCount = getApprovalCount(workflow);
          
          return (
            <div
              key={workflow.id}
              className="aspect-square flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-muted/50 hover:border-primary/30 transition-all group cursor-pointer text-center"
              onClick={() => handleWorkflowClick(workflow)}
            >
              <div
                className={`w-12 h-12 ${workflow.iconBg} rounded-xl flex items-center justify-center mb-3`}
              >
                {iconMap[workflow.icon] || <Video className="w-5 h-5 text-white" />}
              </div>
              <h3 className="font-medium text-sm mb-1">{workflow.name}</h3>
              <p className="text-[10px] text-muted-foreground line-clamp-1 mb-2">
                {workflow.description}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-1">
                <Badge
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 bg-muted/50"
                >
                  {workflow.steps.length} Steps
                </Badge>
                {approvalCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1.5 py-0 bg-green-500/10 text-green-600 border-green-500/30"
                  >
                    {approvalCount} Approvals
                  </Badge>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Workflow Button */}
        <button
          onClick={() => {}}
          className="aspect-square flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted/30 transition-all"
        >
          <div className="w-12 h-12 rounded-xl border-2 border-dashed border-current flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs">Add Workflow</span>
        </button>
      </div>

      {selectedWorkflow && (
        <WorkflowConfigDialog
          workflow={selectedWorkflow}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onWorkflowUpdate={handleWorkflowUpdate}
        />
      )}
    </div>
  );
};

export default AdminWorkflowsTab;
