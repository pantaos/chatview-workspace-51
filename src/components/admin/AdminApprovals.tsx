import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
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
  ChevronLeft,
  Lock,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
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

const AdminApprovals = () => {
  const [workflows, setWorkflows] = useState<WorkflowAdminConfig[]>(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowAdminConfig | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [collaborationOpen, setCollaborationOpen] = useState<Record<string, boolean>>({});
  const [escalationOpen, setEscalationOpen] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();

  // Picker state
  const [pickerMode, setPickerMode] = useState(false);
  const [pickerStepId, setPickerStepId] = useState<string | null>(null);
  const [pickerType, setPickerType] = useState<"teams" | "users" | "roles">("users");
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerSelected, setPickerSelected] = useState<string[]>([]);

  const handleOpenWorkflow = (workflow: WorkflowAdminConfig) => {
    setSelectedWorkflow(workflow);
    setActiveStepId(workflow.steps[0]?.id ?? null);
    setDialogOpen(true);
    setPickerMode(false);
    setCollaborationOpen({});
    setEscalationOpen({});
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
    setPickerMode(true);
  };

  const savePicker = () => {
    if (pickerStepId) {
      handleCollaborationUpdate(pickerStepId, { assigneeIds: pickerSelected });
      toast.success(`${pickerSelected.length} assignees selected`);
    }
    setPickerMode(false);
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

  // --- Sidebar ---
  const renderSidebar = () => {
    if (!selectedWorkflow) return null;
    return (
      <nav className="flex-1 p-2 space-y-0.5">
        {selectedWorkflow.steps.map((step, idx) => {
          const dotColor = stepTypeColors[step.type] || "bg-muted";
          const hasGate = step.collaboration?.enabled;
          return (
            <button
              key={step.id}
              onClick={() => { setActiveStepId(step.id); setPickerMode(false); }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                activeStepId === step.id && !pickerMode
                  ? "bg-background text-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
              <span className="truncate flex-1">
                {idx + 1}. {step.title}
              </span>
              {hasGate && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>
    );
  };

  // --- Mobile Tabs ---
  const renderMobileTabs = () => {
    if (!selectedWorkflow) return null;
    return (
      <div className="border-b border-border/40 shrink-0">
        <div className="flex overflow-x-auto scrollbar-hide px-4 py-2 gap-1">
          {selectedWorkflow.steps.map((step, idx) => {
            const hasGate = step.collaboration?.enabled;
            return (
              <button
                key={step.id}
                onClick={() => { setActiveStepId(step.id); setPickerMode(false); }}
                className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors min-h-[44px] flex items-center gap-1.5 ${
                  activeStepId === step.id && !pickerMode
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {idx + 1}. {step.title}
                {hasGate && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Step Content (Approval/Handover only) ---
  const renderStepContent = (step: WorkflowStepAdmin) => {
    const badgeColors = stepTypeBadgeColors[step.type] || stepTypeBadgeColors.form;
    const isOpen = collaborationOpen[step.id] || step.collaboration?.enabled;
    const hasGate = step.collaboration?.enabled;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium text-foreground">{step.title}</h3>
          <Badge className={`${badgeColors.bg} ${badgeColors.text} border-0 text-[10px]`}>
            {step.type}
          </Badge>
          {step.processorType && (
            <span className="text-xs text-muted-foreground ml-auto">{step.processorType}</span>
          )}
        </div>

        {step.description && (
          <p className="text-sm text-muted-foreground">{step.description}</p>
        )}

        <div className="h-px bg-border/30" />

        <Collapsible
          open={isOpen}
          onOpenChange={(open) => setCollaborationOpen((prev) => ({ ...prev, [step.id]: open }))}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-4 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Add Approval/Handover</span>
              {hasGate && (
                <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/30">
                  Active
                </Badge>
              )}
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
  };

  // --- Picker Content ---
  const renderPickerContent = () => {
    const items = getFilteredItems();
    return (
      <div className="h-full flex flex-col">
        <div className="shrink-0 space-y-4 pb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setPickerMode(false)} className="min-h-[44px]">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <span className="text-sm font-medium">
              {pickerType === "teams" ? "Select Teams" : pickerType === "roles" ? "Select Roles" : "Select Users"}
            </span>
          </div>
          <Input
            placeholder={`Search ${pickerType}...`}
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            className="min-h-[44px]"
          />
          <p className="text-sm text-muted-foreground">{items.length} {pickerType} available</p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-1 -mx-2 px-2">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors cursor-pointer min-h-[56px]"
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

        <div className="shrink-0 flex items-center justify-between pt-4 border-t border-border/40 mt-4">
          <p className="text-sm text-muted-foreground">{pickerSelected.length} selected</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPickerMode(false)} className="min-h-[44px]">Cancel</Button>
            <Button size="sm" onClick={savePicker} className="min-h-[44px]">Save</Button>
          </div>
        </div>
      </div>
    );
  };

  // --- Dialog Content ---
  const renderDialogContent = () => {
    if (pickerMode) return renderPickerContent();

    const step = selectedWorkflow?.steps.find((s) => s.id === activeStepId);
    if (!step) return null;
    return renderStepContent(step);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Approvals & Handovers</h3>
        <p className="text-sm text-muted-foreground">Klicke auf einen Workflow, um Approval- und Handover-Gates pro Step zu verwalten</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {workflows.map((workflow) => {
          const approvalCount = getApprovalCount(workflow);
          return (
            <div
              key={workflow.id}
              className="aspect-square flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-muted/50 hover:border-primary/30 transition-all group cursor-pointer text-center"
              onClick={() => handleOpenWorkflow(workflow)}
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
                    {approvalCount} Gates
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedWorkflow && (
        <ResponsiveDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={pickerMode ? "" : selectedWorkflow.name}
        >
          {pickerMode && (
            <div className="px-4 md:px-6 py-3 border-b border-border/40 shrink-0" />
          )}
          <ResponsiveDialogBody
            sidebar={!pickerMode ? renderSidebar() : undefined}
            showSidebar={!pickerMode}
          >
            {!pickerMode && isMobile && renderMobileTabs()}
            <ResponsiveDialogContent>{renderDialogContent()}</ResponsiveDialogContent>
          </ResponsiveDialogBody>
        </ResponsiveDialog>
      )}
    </div>
  );
};

export default AdminApprovals;
