import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Video, FileVideo, UserCircle, Upload, Mail, Plus } from "lucide-react";
import { mockTenants, mockAssistantsWorkflows } from "@/data/pantaFlowsData";
import { Tenant, AssistantWorkflow } from "@/types/pantaFlows";
import { WorkflowAdminConfig, mockWorkflows } from "@/types/workflowAdmin";
import { WorkflowConfigDialog } from "@/components/admin/WorkflowConfigDialog";
import { toast } from "sonner";

const iconMap: Record<string, React.ReactNode> = {
  Video: <Video className="w-5 h-5 text-white" />,
  FileVideo: <FileVideo className="w-5 h-5 text-white" />,
  UserCircle: <UserCircle className="w-5 h-5 text-white" />,
  Upload: <Upload className="w-5 h-5 text-white" />,
  Mail: <Mail className="w-5 h-5 text-white" />,
};

const TenantLogo = ({ tenant }: { tenant: Tenant }) => {
  if (tenant.logoUrl) {
    return <img src={tenant.logoUrl} alt={tenant.name} className="w-8 h-8 rounded-full object-cover border" />;
  }
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ backgroundColor: tenant.primaryColor }}
    >
      {tenant.name.charAt(0)}
    </div>
  );
};

const PFKonfiguration = () => {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowAdminConfig[]>(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowAdminConfig | null>(null);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  // Track local assignments (copy from mock so we can mutate)
  const [localAssignments, setLocalAssignments] = useState<AssistantWorkflow[]>(
    mockAssistantsWorkflows.filter(aw => aw.type === "workflow")
  );
  const [selectedNewWorkflow, setSelectedNewWorkflow] = useState("");

  // Get workflow names assigned to a tenant
  const getWorkflowsForTenant = (tenantId: string) => {
    const assignedWorkflowNames = localAssignments
      .filter((aw) => aw.assignments.some((a) => a.tenantId === tenantId))
      .map((aw) => aw.name);

    return workflows.filter((w) =>
      assignedWorkflowNames.some((name) => w.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(w.name.toLowerCase()))
    );
  };

  // Get workflows NOT assigned to the selected tenant
  const getUnassignedForTenant = (tenantId: string) => {
    const assignedWorkflowNames = localAssignments
      .filter((aw) => aw.assignments.some((a) => a.tenantId === tenantId))
      .map((aw) => aw.name);

    return workflows.filter((w) =>
      !assignedWorkflowNames.some((name) => w.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(w.name.toLowerCase()))
    );
  };

  const handleAddWorkflowToTenant = (tenantId: string) => {
    if (!selectedNewWorkflow) return;
    const wf = workflows.find(w => w.id === selectedNewWorkflow);
    const tenant = mockTenants.find(t => t.id === tenantId);
    if (!wf || !tenant) return;

    // Find or create the assignment entry
    const existingAssignment = localAssignments.find(
      (aw) => aw.name.toLowerCase().includes(wf.name.toLowerCase()) || wf.name.toLowerCase().includes(aw.name.toLowerCase())
    );

    if (existingAssignment) {
      setLocalAssignments(prev => prev.map(aw =>
        aw.id === existingAssignment.id
          ? { ...aw, assignments: [...aw.assignments, { tenantId, tenantName: tenant.name, visibility: "organization" as const }] }
          : aw
      ));
    } else {
      setLocalAssignments(prev => [...prev, {
        id: `aw-new-${Date.now()}`,
        name: wf.name,
        type: "workflow" as const,
        description: wf.description,
        assignments: [{ tenantId, tenantName: tenant.name, visibility: "organization" as const }],
      }]);
    }

    setSelectedNewWorkflow("");
    toast.success(`${wf.name} wurde ${tenant.name} zugeordnet`);
  };

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

  const renderWorkflowGrid = (workflowList: WorkflowAdminConfig[]) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {workflowList.map((workflow) => {
        const approvalCount = getApprovalCount(workflow);
        return (
          <div
            key={workflow.id}
            className="aspect-square flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-muted/50 hover:border-primary/30 transition-all group cursor-pointer text-center"
            onClick={() => handleWorkflowClick(workflow)}
          >
            <div className={`w-12 h-12 ${workflow.iconBg} rounded-xl flex items-center justify-center mb-3`}>
              {iconMap[workflow.icon] || <Video className="w-5 h-5 text-white" />}
            </div>
            <h3 className="font-medium text-sm mb-1">{workflow.name}</h3>
            <p className="text-[10px] text-muted-foreground line-clamp-1 mb-2">{workflow.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-1">
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-muted/50">
                {workflow.steps.length} Steps
              </Badge>
              {approvalCount > 0 && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-green-500/10 text-green-600 border-green-500/30">
                  {approvalCount} Approvals
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Tenant detail view with workflow grid
  if (selectedTenant) {
    const tenantWorkflows = getWorkflowsForTenant(selectedTenant.id);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedTenant(null)} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2.5">
            <TenantLogo tenant={selectedTenant} />
            <div>
              <h3 className="text-lg font-semibold">{selectedTenant.name}</h3>
              <p className="text-sm text-muted-foreground">Workflow-Konfiguration</p>
            </div>
          </div>
        </div>

        {tenantWorkflows.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Zugeordnete Workflows</h4>
            {renderWorkflowGrid(tenantWorkflows)}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Keine Workflows zugeordnet</p>
            <p className="text-xs mt-1">Füge unten einen Workflow hinzu</p>
          </div>
        )}

        {/* Add workflow to tenant */}
        {(() => {
          const unassignedForTenant = getUnassignedForTenant(selectedTenant.id);
          if (unassignedForTenant.length === 0) return null;
          return (
            <div className="space-y-3 pt-4 border-t border-border/40">
              <h4 className="text-sm font-medium text-muted-foreground">Workflow hinzufügen</h4>
              <div className="flex gap-2">
                <select
                  value={selectedNewWorkflow}
                  onChange={(e) => setSelectedNewWorkflow(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Workflow auswählen…</option>
                  {unassignedForTenant.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
                <Button size="sm" onClick={() => handleAddWorkflowToTenant(selectedTenant.id)} disabled={!selectedNewWorkflow} className="min-h-[40px]">
                  <Plus className="h-4 w-4 mr-1" /> Hinzufügen
                </Button>
              </div>
            </div>
          );
        })()}

        {selectedWorkflow && (
          <WorkflowConfigDialog
            workflow={selectedWorkflow}
            open={workflowDialogOpen}
            onOpenChange={setWorkflowDialogOpen}
            onWorkflowUpdate={handleWorkflowUpdate}
            hideTenants
            hideCollaboration
          />
        )}
      </div>
    );
  }

  // Tenant list view
  const activeTenants = mockTenants.filter((t) => t.status === "active");
  const inactiveTenants = mockTenants.filter((t) => t.status === "inactive");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Konfiguration</h3>
        <p className="text-sm text-muted-foreground">Workflow-Konfiguration pro Tenant — wähle einen Tenant aus</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTenants.map((tenant) => {
          const workflowCount = getWorkflowsForTenant(tenant.id).length;
          return (
            <Card
              key={tenant.id}
              className="p-5 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setSelectedTenant(tenant)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <TenantLogo tenant={tenant} />
                  <h4 className="font-semibold">{tenant.name}</h4>
                </div>
                <Badge variant="default">Aktiv</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{tenant.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {tenant.totalUsers} User</span>
                <span>{workflowCount} Workflows</span>
              </div>
            </Card>
          );
        })}
        {inactiveTenants.map((tenant) => (
          <Card
            key={tenant.id}
            className="p-5 cursor-pointer hover:shadow-md transition-all duration-200 opacity-60"
            onClick={() => setSelectedTenant(tenant)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <TenantLogo tenant={tenant} />
                <h4 className="font-semibold">{tenant.name}</h4>
              </div>
              <Badge variant="secondary">Inaktiv</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{tenant.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {tenant.totalUsers} User</span>
            </div>
          </Card>
        ))}
      </div>

      {selectedWorkflow && (
        <WorkflowConfigDialog
          workflow={selectedWorkflow}
          open={workflowDialogOpen}
          onOpenChange={setWorkflowDialogOpen}
          onWorkflowUpdate={handleWorkflowUpdate}
          hideTenants
          hideCollaboration
        />
      )}
    </div>
  );
};

export default PFKonfiguration;
