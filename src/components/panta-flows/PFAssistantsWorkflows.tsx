import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Workflow, Video, FileVideo, UserCircle, Upload, Mail, Plus } from "lucide-react";
import { mockAssistantsWorkflows } from "@/data/pantaFlowsData";
import { AssistantWorkflow } from "@/types/pantaFlows";
import { WorkflowAdminConfig, mockWorkflows } from "@/types/workflowAdmin";
import { WorkflowConfigDialog } from "@/components/admin/WorkflowConfigDialog";
import PFAssistantDetailDialog from "./PFAssistantDetailDialog";

const iconMap: Record<string, React.ReactNode> = {
  Video: <Video className="w-5 h-5 text-white" />,
  FileVideo: <FileVideo className="w-5 h-5 text-white" />,
  UserCircle: <UserCircle className="w-5 h-5 text-white" />,
  Upload: <Upload className="w-5 h-5 text-white" />,
  Mail: <Mail className="w-5 h-5 text-white" />,
};

const PFAssistantsWorkflows = () => {
  const [selectedAssistant, setSelectedAssistant] = useState<AssistantWorkflow | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowAdminConfig[]>(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowAdminConfig | null>(null);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);

  const assistants = mockAssistantsWorkflows.filter((item) => item.type === "assistant");

  const handleWorkflowClick = (workflow: WorkflowAdminConfig) => {
    setSelectedWorkflow(workflow);
    setWorkflowDialogOpen(true);
  };

  const handleWorkflowUpdate = (updatedWorkflow: WorkflowAdminConfig) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w))
    );
    setSelectedWorkflow(updatedWorkflow);
  };

  const getApprovalCount = (workflow: WorkflowAdminConfig) => {
    return workflow.steps.filter(
      (s) => s.type === "approval" || s.collaboration?.enabled
    ).length;
  };

  return (
    <div className="space-y-8">
      {/* Assistants Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Assistenten</h3>
          <p className="text-sm text-muted-foreground">KI-Assistenten aus dem Pool — Tenants zuordnen</p>
        </div>

        <div className="space-y-3">
          {assistants.map((item) => (
            <Card
              key={item.id}
              className="p-5 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setSelectedAssistant(item)}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted/30 rounded-lg shrink-0">
                  <Bot className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold">{item.name}</h4>
                    <Badge variant="secondary" className="text-xs">Assistent</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  {item.assignments.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {item.assignments.map((a) => (
                        <Badge key={a.tenantId} variant="outline" className="text-xs">
                          {a.tenantName} · {a.visibility === "organization" ? "Alle" : "Admin"}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflows Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Workflows</h3>
          <p className="text-sm text-muted-foreground">Workflow-Konfiguration und Tenant-Zuordnung</p>
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
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-muted/50">
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
      </div>

      {/* Dialogs */}
      <PFAssistantDetailDialog
        item={selectedAssistant}
        open={!!selectedAssistant}
        onOpenChange={(o) => !o && setSelectedAssistant(null)}
      />

      {selectedWorkflow && (
        <WorkflowConfigDialog
          workflow={selectedWorkflow}
          open={workflowDialogOpen}
          onOpenChange={setWorkflowDialogOpen}
          onWorkflowUpdate={handleWorkflowUpdate}
        />
      )}
    </div>
  );
};

export default PFAssistantsWorkflows;
