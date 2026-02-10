import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Users,
  User,
  Shield,
  Clock,
  MessageSquare,
  Video,
  FileVideo,
  UserCircle,
  Upload,
  Mail,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { mockTenants, mockAssistantsWorkflows } from "@/data/pantaFlowsData";
import { Tenant } from "@/types/pantaFlows";
import {
  WorkflowAdminConfig,
  WorkflowStepAdmin,
  CollaborationConfig,
  stepTypeBadgeColors,
  mockWorkflows,
} from "@/types/workflowAdmin";
import { toast } from "sonner";

const iconMap: Record<string, React.ReactNode> = {
  Video: <Video className="w-5 h-5 text-white" />,
  FileVideo: <FileVideo className="w-5 h-5 text-white" />,
  UserCircle: <UserCircle className="w-5 h-5 text-white" />,
  Upload: <Upload className="w-5 h-5 text-white" />,
  Mail: <Mail className="w-5 h-5 text-white" />,
};

const stepTypeColors: Record<string, string> = {
  form: "bg-blue-500",
  processing: "bg-amber-500",
  approval: "bg-green-500",
  branch: "bg-purple-500",
  output: "bg-slate-500",
};

const mockTeams = [
  { id: "1", name: "Content Team", memberCount: 12 },
  { id: "2", name: "Marketing", memberCount: 8 },
  { id: "3", name: "Editorial", memberCount: 15 },
];

const mockUsers = [
  { id: "1", name: "Sarah Chen", email: "sarah@company.com" },
  { id: "2", name: "Mike Johnson", email: "mike@company.com" },
  { id: "3", name: "Emma Wilson", email: "emma@company.com" },
];

const mockRoles = [
  { id: "editor", name: "Editor", userCount: 25 },
  { id: "reviewer", name: "Reviewer", userCount: 10 },
  { id: "admin", name: "Admin", userCount: 5 },
];

type View = "tenants" | "workflows" | "steps" | "picker";

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

const AdminApprovals = () => {
  const [view, setView] = useState<View>("tenants");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowAdminConfig | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowAdminConfig[]>(mockWorkflows);
  const [collaborationOpen, setCollaborationOpen] = useState<Record<string, boolean>>({});
  const [escalationOpen, setEscalationOpen] = useState<Record<string, boolean>>({});

  // Picker state
  const [pickerStepId, setPickerStepId] = useState<string | null>(null);
  const [pickerType, setPickerType] = useState<"teams" | "users" | "roles">("users");
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerSelected, setPickerSelected] = useState<string[]>([]);

  const getWorkflowsForTenant = (tenantId: string) => {
    const assignedWorkflowNames = mockAssistantsWorkflows
      .filter((aw) => aw.type === "workflow" && aw.assignments.some((a) => a.tenantId === tenantId))
      .map((aw) => aw.name);

    return workflows.filter((w) =>
      assignedWorkflowNames.some(
        (name) => w.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(w.name.toLowerCase())
      )
    );
  };

  const handleStepUpdate = (stepId: string, updates: Partial<WorkflowStepAdmin>) => {
    if (!selectedWorkflow) return;
    const updatedSteps = selectedWorkflow.steps.map((step) =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    const updated = { ...selectedWorkflow, steps: updatedSteps };
    setSelectedWorkflow(updated);
    setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const handleCollaborationUpdate = (stepId: string, updates: Partial<CollaborationConfig>) => {
    if (!selectedWorkflow) return;
    const step = selectedWorkflow.steps.find((s) => s.id === stepId);
    if (!step) return;

    const newCollaboration: CollaborationConfig = {
      enabled: step.collaboration?.enabled ?? false,
      type: step.collaboration?.type ?? "approval",
      assigneeType: step.collaboration?.assigneeType ?? "user",
      assigneeIds: step.collaboration?.assigneeIds ?? [],
      timeoutHours: step.collaboration?.timeoutHours ?? 24,
      requireComments: step.collaboration?.requireComments ?? false,
      allowReassignment: step.collaboration?.allowReassignment ?? true,
      ...updates,
    };

    handleStepUpdate(stepId, { collaboration: newCollaboration });
  };

  const openPicker = (stepId: string, type: "teams" | "users" | "roles") => {
    const step = selectedWorkflow?.steps.find((s) => s.id === stepId);
    setPickerStepId(stepId);
    setPickerType(type);
    setPickerSearch("");
    setPickerSelected(step?.collaboration?.assigneeIds ?? []);
    setView("picker");
  };

  const savePicker = () => {
    if (pickerStepId) {
      handleCollaborationUpdate(pickerStepId, { assigneeIds: pickerSelected });
      toast.success(`${pickerSelected.length} assignees selected`);
    }
    setView("steps");
  };

  const getFilteredItems = () => {
    const search = pickerSearch.toLowerCase();
    if (pickerType === "teams") return mockTeams.filter((t) => t.name.toLowerCase().includes(search));
    if (pickerType === "roles") return mockRoles.filter((r) => r.name.toLowerCase().includes(search));
    return mockUsers.filter((u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
  };

  const getApprovalCount = (workflow: WorkflowAdminConfig) => {
    return workflow.steps.filter((s) => s.collaboration?.enabled).length;
  };

  // --- Picker View ---
  if (view === "picker") {
    const items = getFilteredItems();
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setView("steps")} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {pickerType === "teams" ? "Select Teams" : pickerType === "roles" ? "Select Roles" : "Select Users"}
          </h3>
        </div>

        <Input
          placeholder={`Search ${pickerType}...`}
          value={pickerSearch}
          onChange={(e) => setPickerSearch(e.target.value)}
          className="min-h-[44px]"
        />
        <p className="text-sm text-muted-foreground">{items.length} {pickerType} available</p>

        <div className="space-y-1">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-3 hover:bg-muted/30 px-2 rounded-lg transition-colors cursor-pointer min-h-[56px]"
              onClick={() => {
                setPickerSelected((prev) =>
                  prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id]
                );
              }}
            >
              <Checkbox checked={pickerSelected.includes(item.id)} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.email || `${item.memberCount || item.userCount} ${item.memberCount ? "members" : "users"}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <p className="text-sm text-muted-foreground">{pickerSelected.length} selected</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setView("steps")} className="min-h-[44px]">Cancel</Button>
            <Button size="sm" onClick={savePicker} className="min-h-[44px]">Save</Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Steps View ---
  if (view === "steps" && selectedWorkflow) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => { setView("workflows"); setSelectedWorkflow(null); }} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">{selectedWorkflow.name}</h3>
            <p className="text-sm text-muted-foreground">Approvals & Handovers verwalten</p>
          </div>
        </div>

        <div className="space-y-3">
          {selectedWorkflow.steps.map((step, idx) => {
            const badgeColors = stepTypeBadgeColors[step.type] || stepTypeBadgeColors.form;
            const dotColor = stepTypeColors[step.type] || "bg-muted";
            const hasGate = step.collaboration?.enabled;
            const isOpen = collaborationOpen[step.id] || hasGate;

            return (
              <div key={step.id} className="rounded-xl border border-border/40 bg-card/50 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                  <span className="text-sm font-medium">{idx + 1}. {step.title}</span>
                  <Badge className={`${badgeColors.bg} ${badgeColors.text} border-0 text-[10px]`}>
                    {step.type}
                  </Badge>
                  {hasGate && (
                    <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/30 ml-auto">
                      {step.collaboration?.type === "handoff" ? "Handover" : "Approval"} Active
                    </Badge>
                  )}
                </div>

                {/* Collaboration collapsible */}
                <Collapsible
                  open={isOpen}
                  onOpenChange={(open) => setCollaborationOpen((prev) => ({ ...prev, [step.id]: open }))}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-3 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Add Approval/Handover</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pt-4 space-y-4">
                    <div className="flex items-center justify-between min-h-[44px]">
                      <div>
                        <p className="text-sm font-medium">Enable Gate</p>
                        <p className="text-xs text-muted-foreground">Add an approval or handover step</p>
                      </div>
                      <Switch
                        checked={step.collaboration?.enabled ?? false}
                        onCheckedChange={(checked) => handleCollaborationUpdate(step.id, { enabled: checked })}
                      />
                    </div>

                    {step.collaboration?.enabled && (
                      <>
                        <div className="h-px bg-border/40" />

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Type</Label>
                          <RadioGroup
                            value={step.collaboration.type}
                            onValueChange={(value) =>
                              handleCollaborationUpdate(step.id, { type: value as "approval" | "handoff" })
                            }
                            className="flex gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="approval" id={`admin-${step.id}-approval`} />
                              <Label htmlFor={`admin-${step.id}-approval`} className="cursor-pointer text-sm">Approval</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="handoff" id={`admin-${step.id}-handoff`} />
                              <Label htmlFor={`admin-${step.id}-handoff`} className="cursor-pointer text-sm">Handover</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Assign to</Label>
                          <RadioGroup
                            value={step.collaboration.assigneeType}
                            onValueChange={(value) =>
                              handleCollaborationUpdate(step.id, {
                                assigneeType: value as "user" | "team" | "role",
                                assigneeIds: [],
                              })
                            }
                            className="flex gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="user" id={`admin-${step.id}-user`} />
                              <Label htmlFor={`admin-${step.id}-user`} className="cursor-pointer text-sm flex items-center gap-1">
                                <User className="w-3 h-3" /> User
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="team" id={`admin-${step.id}-team`} />
                              <Label htmlFor={`admin-${step.id}-team`} className="cursor-pointer text-sm flex items-center gap-1">
                                <Users className="w-3 h-3" /> Team
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="role" id={`admin-${step.id}-role`} />
                              <Label htmlFor={`admin-${step.id}-role`} className="cursor-pointer text-sm flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Role
                              </Label>
                            </div>
                          </RadioGroup>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openPicker(
                                step.id,
                                step.collaboration!.assigneeType === "team"
                                  ? "teams"
                                  : step.collaboration!.assigneeType === "role"
                                  ? "roles"
                                  : "users"
                              )
                            }
                            className="w-full justify-between min-h-[44px]"
                          >
                            <span>
                              {step.collaboration.assigneeIds.length > 0
                                ? `${step.collaboration.assigneeIds.length} selected`
                                : "Select Assignees"}
                            </span>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Timeout (hours)
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              max={168}
                              value={step.collaboration.timeoutHours}
                              onChange={(e) =>
                                handleCollaborationUpdate(step.id, { timeoutHours: parseInt(e.target.value) || 24 })
                              }
                              className="h-11"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between min-h-[44px]">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Require Comments</span>
                            </div>
                            <Switch
                              checked={step.collaboration.requireComments}
                              onCheckedChange={(checked) =>
                                handleCollaborationUpdate(step.id, { requireComments: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between min-h-[44px]">
                            <span className="text-sm">Allow Reassignment</span>
                            <Switch
                              checked={step.collaboration.allowReassignment}
                              onCheckedChange={(checked) =>
                                handleCollaborationUpdate(step.id, { allowReassignment: checked })
                              }
                            />
                          </div>
                        </div>

                        {/* Escalation */}
                        <Collapsible
                          open={escalationOpen[step.id]}
                          onOpenChange={(open) => setEscalationOpen((prev) => ({ ...prev, [step.id]: open }))}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <span>Escalation Settings</span>
                            {escalationOpen[step.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-3 space-y-3">
                            <div className="flex items-center justify-between min-h-[44px]">
                              <span className="text-sm">Enable Escalation</span>
                              <Switch
                                checked={step.collaboration.escalation?.enabled ?? false}
                                onCheckedChange={(checked) =>
                                  handleCollaborationUpdate(step.id, {
                                    escalation: {
                                      enabled: checked,
                                      afterHours: step.collaboration?.escalation?.afterHours ?? 24,
                                      toType: step.collaboration?.escalation?.toType ?? "team",
                                      toIds: step.collaboration?.escalation?.toIds ?? [],
                                      notifyOriginal: step.collaboration?.escalation?.notifyOriginal ?? true,
                                    },
                                  })
                                }
                              />
                            </div>
                            {step.collaboration.escalation?.enabled && (
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Escalate after (hours)</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  value={step.collaboration.escalation.afterHours}
                                  onChange={(e) =>
                                    handleCollaborationUpdate(step.id, {
                                      escalation: {
                                        ...step.collaboration!.escalation!,
                                        afterHours: parseInt(e.target.value) || 24,
                                      },
                                    })
                                  }
                                  className="h-11"
                                />
                              </div>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      </>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Workflows View ---
  if (view === "workflows" && selectedTenant) {
    const tenantWorkflows = getWorkflowsForTenant(selectedTenant.id);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => { setView("tenants"); setSelectedTenant(null); }} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2.5">
            <TenantLogo tenant={selectedTenant} />
            <div>
              <h3 className="text-lg font-semibold">{selectedTenant.name}</h3>
              <p className="text-sm text-muted-foreground">Approvals & Handovers</p>
            </div>
          </div>
        </div>

        {tenantWorkflows.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tenantWorkflows.map((workflow) => {
              const approvalCount = getApprovalCount(workflow);
              return (
                <div
                  key={workflow.id}
                  className="aspect-square flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-muted/50 hover:border-primary/30 transition-all group cursor-pointer text-center"
                  onClick={() => { setSelectedWorkflow(workflow); setView("steps"); }}
                >
                  <div className={`w-12 h-12 ${workflow.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                    {iconMap[workflow.icon] || <Video className="w-5 h-5 text-white" />}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{workflow.name}</h3>
                  <div className="flex flex-wrap items-center justify-center gap-1">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-muted/50">
                      {workflow.steps.length} Steps
                    </Badge>
                    {approvalCount > 0 && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-green-500/10 text-green-600 border-green-500/30">
                        {approvalCount} Gates
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Keine Workflows zugeordnet</p>
          </div>
        )}
      </div>
    );
  }

  // --- Tenants View ---
  const activeTenants = mockTenants.filter((t) => t.status === "active");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Approvals & Handovers</h3>
        <p className="text-sm text-muted-foreground">Wähle einen Tenant, um Approval- und Handover-Gates für dessen Workflows zu verwalten</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTenants.map((tenant) => {
          const workflowCount = getWorkflowsForTenant(tenant.id).length;
          const totalGates = getWorkflowsForTenant(tenant.id).reduce((acc, w) => acc + getApprovalCount(w), 0);
          return (
            <Card
              key={tenant.id}
              className="p-5 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => { setSelectedTenant(tenant); setView("workflows"); }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <TenantLogo tenant={tenant} />
                  <h4 className="font-semibold">{tenant.name}</h4>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{workflowCount} Workflows</span>
                {totalGates > 0 && (
                  <span className="text-green-600">{totalGates} Gates</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminApprovals;
