import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Users,
  User,
  Shield,
  Clock,
  MessageSquare,
  Lock,
  Info,
  ArrowRight,
  X,
  Plus,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  WorkflowAdminConfig,
  WorkflowStepAdmin,
  CollaborationConfig,
  stepTypeBadgeColors,
} from "@/types/workflowAdmin";
import { mockTenants } from "@/data/pantaFlowsData";
import { TenantAssignment } from "@/types/pantaFlows";

interface WorkflowConfigDialogProps {
  workflow: WorkflowAdminConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkflowUpdate: (workflow: WorkflowAdminConfig) => void;
}

type ScreenType = "overview" | "tenants" | string | `${string}-teams` | `${string}-users` | `${string}-roles`;

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

const stepTypeColors: Record<string, string> = {
  form: "bg-blue-500",
  processing: "bg-amber-500",
  approval: "bg-green-500",
  branch: "bg-purple-500",
  output: "bg-slate-500",
};

export const WorkflowConfigDialog = ({
  workflow,
  open,
  onOpenChange,
  onWorkflowUpdate,
}: WorkflowConfigDialogProps) => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [collaborationOpen, setCollaborationOpen] = useState<Record<string, boolean>>({});
  const [escalationOpen, setEscalationOpen] = useState<Record<string, boolean>>({});
  const [tenantAssignments, setTenantAssignments] = useState<TenantAssignment[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [tenantVisibility, setTenantVisibility] = useState<"organization" | "admin-only">("organization");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (open) {
      setActiveScreen("overview");
      setSearchTerm("");
      setTempSelectedIds([]);
      setCurrentStepId(null);
      setCollaborationOpen({});
      setEscalationOpen({});
    }
  }, [open]);

  const isSubScreen =
    activeScreen.includes("-teams") ||
    activeScreen.includes("-users") ||
    activeScreen.includes("-roles");

  const availableTenants = mockTenants.filter(
    (t) => !tenantAssignments.some((a) => a.tenantId === t.id)
  );

  const handleAssignTenant = () => {
    if (!selectedTenantId) return;
    const tenant = mockTenants.find((t) => t.id === selectedTenantId);
    if (!tenant) return;
    setTenantAssignments((prev) => [
      ...prev,
      { tenantId: tenant.id, tenantName: tenant.name, visibility: tenantVisibility },
    ]);
    setSelectedTenantId("");
    toast.success(`${tenant.name} zugeordnet`);
  };

  const handleRemoveTenant = (tenantId: string) => {
    setTenantAssignments((prev) => prev.filter((a) => a.tenantId !== tenantId));
    toast.success("Tenant entfernt");
  };

  const handleBack = () => {
    if (currentStepId) {
      setActiveScreen(currentStepId);
      setCurrentStepId(null);
      setSearchTerm("");
      setTempSelectedIds([]);
    }
  };

  const handleStepUpdate = (stepId: string, updates: Partial<WorkflowStepAdmin>) => {
    const updatedSteps = workflow.steps.map((step) =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    onWorkflowUpdate({ ...workflow, steps: updatedSteps });
  };

  const handleStepConfigUpdate = (stepId: string, configUpdates: Record<string, any>) => {
    const updatedSteps = workflow.steps.map((step) =>
      step.id === stepId ? { ...step, config: { ...step.config, ...configUpdates } } : step
    );
    onWorkflowUpdate({ ...workflow, steps: updatedSteps });
  };

  const handleCollaborationUpdate = (stepId: string, updates: Partial<CollaborationConfig>) => {
    const step = workflow.steps.find((s) => s.id === stepId);
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

  const handleSelectClick = (stepId: string, type: "teams" | "users" | "roles") => {
    const step = workflow.steps.find((s) => s.id === stepId);
    if (step?.collaboration) {
      setCurrentStepId(stepId);
      setTempSelectedIds([...step.collaboration.assigneeIds]);
      setActiveScreen(`${stepId}-${type}`);
    }
  };

  const handleSaveSelection = () => {
    if (!currentStepId) return;
    handleCollaborationUpdate(currentStepId, { assigneeIds: tempSelectedIds });
    toast.success(`${tempSelectedIds.length} assignees selected`);
    handleBack();
  };

  const toggleSelection = (id: string) => {
    if (tempSelectedIds.includes(id)) {
      setTempSelectedIds(tempSelectedIds.filter((i) => i !== id));
    } else {
      setTempSelectedIds([...tempSelectedIds, id]);
    }
  };

  const getFilteredItems = () => {
    const type = activeScreen.split("-")[1];
    if (type === "teams") {
      return mockTeams.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    } else if (type === "roles") {
      return mockRoles.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
      return mockUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  // --- Sidebar Tabs ---
  const renderSidebar = () => {
    return (
      <nav className="flex-1 p-2 space-y-0.5">
        <button
          onClick={() => setActiveScreen("overview")}
          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
            activeScreen === "overview"
              ? "bg-background text-foreground font-medium shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveScreen("tenants")}
          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
            activeScreen === "tenants"
              ? "bg-background text-foreground font-medium shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Tenants</span>
          {tenantAssignments.length > 0 && (
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 ml-auto">{tenantAssignments.length}</Badge>
          )}
        </button>
        {workflow.steps.map((step, idx) => {
          const isLocked = step.editable === false;
          const dotColor = stepTypeColors[step.type] || "bg-muted";
          return (
            <button
              key={step.id}
              onClick={() => setActiveScreen(step.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                activeScreen === step.id
                  ? "bg-background text-foreground font-medium shadow-sm"
                  : isLocked
                  ? "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
              <span className="truncate flex-1">
                {idx + 1}. {step.title}
              </span>
              {isLocked && <Lock className="w-3 h-3 shrink-0 text-muted-foreground/40" />}
            </button>
          );
        })}
      </nav>
    );
  };

  // --- Mobile Tabs ---
  const renderMobileTabs = () => {
    return (
      <div className="border-b border-border/40 shrink-0">
        <div className="flex overflow-x-auto scrollbar-hide px-4 py-2 gap-1">
          <button
            onClick={() => setActiveScreen("overview")}
            className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors min-h-[44px] ${
              activeScreen === "overview"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveScreen("tenants")}
            className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors min-h-[44px] flex items-center gap-1.5 ${
              activeScreen === "tenants"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Tenants
            {tenantAssignments.length > 0 && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{tenantAssignments.length}</Badge>
            )}
          </button>
          {workflow.steps.map((step, idx) => {
            const isLocked = step.editable === false;
            return (
              <button
                key={step.id}
                onClick={() => setActiveScreen(step.id)}
                className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors min-h-[44px] flex items-center gap-1.5 ${
                  activeScreen === step.id
                    ? "bg-primary text-primary-foreground font-medium"
                    : isLocked
                    ? "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {idx + 1}. {step.title}
                {isLocked && <Lock className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Collaboration Section ---
  const renderCollaborationSection = (step: WorkflowStepAdmin) => {
    const isOpen = collaborationOpen[step.id] || step.collaboration?.enabled;
    const hasCollaboration = step.collaboration?.enabled;

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={(open) => setCollaborationOpen((prev) => ({ ...prev, [step.id]: open }))}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-4 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Add Approval/Handover</span>
            {hasCollaboration && (
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
                    <RadioGroupItem value="approval" id={`${step.id}-approval`} />
                    <Label htmlFor={`${step.id}-approval`} className="cursor-pointer text-sm">
                      Approval
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="handoff" id={`${step.id}-handoff`} />
                    <Label htmlFor={`${step.id}-handoff`} className="cursor-pointer text-sm">
                      Handover
                    </Label>
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
                    <RadioGroupItem value="user" id={`${step.id}-user`} />
                    <Label htmlFor={`${step.id}-user`} className="cursor-pointer text-sm flex items-center gap-1">
                      <User className="w-3 h-3" /> User
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="team" id={`${step.id}-team`} />
                    <Label htmlFor={`${step.id}-team`} className="cursor-pointer text-sm flex items-center gap-1">
                      <Users className="w-3 h-3" /> Team
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="role" id={`${step.id}-role`} />
                    <Label htmlFor={`${step.id}-role`} className="cursor-pointer text-sm flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Role
                    </Label>
                  </div>
                </RadioGroup>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleSelectClick(
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
    );
  };

  // --- Step Config ---
  const renderStepConfig = (step: WorkflowStepAdmin) => {
    const badgeColors = stepTypeBadgeColors[step.type] || stepTypeBadgeColors.form;
    const isLocked = step.editable === false;

    return (
      <div className="space-y-4">
        {/* Header: Title + Badge inline */}
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium text-foreground">{step.title}</h3>
          <Badge className={`${badgeColors.bg} ${badgeColors.text} border-0 text-[10px]`}>
            {step.type}
          </Badge>
          {step.processorType && (
            <span className="text-xs text-muted-foreground ml-auto">{step.processorType}</span>
          )}
        </div>

        {/* Locked Banner */}
        {isLocked && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border/30">
            <Lock className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-xs text-muted-foreground">
              Core step — configuration locked. Approval/Handover gates can still be added below.
            </span>
          </div>
        )}

        {/* Editable fields */}
        <div className={isLocked ? "opacity-50 pointer-events-none space-y-3" : "space-y-3"}>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={step.title}
              onChange={(e) => handleStepUpdate(step.id, { title: e.target.value })}
              disabled={isLocked}
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={step.description || ""}
              onChange={(e) => handleStepUpdate(step.id, { description: e.target.value })}
              disabled={isLocked}
              rows={2}
            />
          </div>
        </div>

        {/* Processing Step Config */}
        {step.type === "processing" && (
          <div className={isLocked ? "opacity-50 pointer-events-none space-y-4" : "space-y-4"}>
            <div className="h-px bg-border/30" />

            {/* System Prompt - shown for AI-driven processors */}
            {(step.processorType === "scrape_and_generate_script" ||
              step.processorType === "extract_text_and_generate_script") && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">System Prompt</Label>
                <Textarea
                  value={step.config.systemPrompt || ""}
                  onChange={(e) => handleStepConfigUpdate(step.id, { systemPrompt: e.target.value })}
                  disabled={isLocked}
                  rows={6}
                  placeholder="The AI prompt used to generate content in this step..."
                  className="font-mono text-xs leading-relaxed"
                />
                <p className="text-[10px] text-muted-foreground/60">
                  Background prompt controlling AI behavior for this step.
                </p>
              </div>
            )}

            {step.processorType === "scrape_and_generate_script" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Target Duration (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[step.config.targetDuration || 120]}
                      onValueChange={([value]) => handleStepConfigUpdate(step.id, { targetDuration: value })}
                      min={30}
                      max={300}
                      step={10}
                      className="flex-1"
                      disabled={isLocked}
                    />
                    <span className="text-sm w-12 text-right text-muted-foreground">
                      {step.config.targetDuration || 120}s
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Max Script Length</Label>
                  <Input
                    type="number"
                    value={step.config.maxScriptLength || 4500}
                    onChange={(e) => handleStepConfigUpdate(step.id, { maxScriptLength: parseInt(e.target.value) })}
                    disabled={isLocked}
                    className="h-10"
                  />
                </div>
              </>
            )}

            {step.processorType === "text_to_speech" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Voice ID</Label>
                  <Input
                    value={step.config.voiceId || ""}
                    onChange={(e) => handleStepConfigUpdate(step.id, { voiceId: e.target.value })}
                    disabled={isLocked}
                    className="h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Stability</Label>
                    <Slider
                      value={[step.config.stability || 0.5]}
                      onValueChange={([value]) => handleStepConfigUpdate(step.id, { stability: value })}
                      min={0}
                      max={1}
                      step={0.1}
                      disabled={isLocked}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Similarity</Label>
                    <Slider
                      value={[step.config.similarityBoost || 0.75]}
                      onValueChange={([value]) => handleStepConfigUpdate(step.id, { similarityBoost: value })}
                      min={0}
                      max={1}
                      step={0.1}
                      disabled={isLocked}
                    />
                  </div>
                </div>
              </>
            )}

            {(step.processorType === "extract_text_and_generate_script" ||
              step.processorType === "content_to_video_generate_scenes") && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Min {step.processorType.includes("scene") ? "Scenes" : "Length"}
                  </Label>
                  <Input
                    type="number"
                    value={step.config.minScriptLength || step.config.minScenes || 3}
                    onChange={(e) =>
                      handleStepConfigUpdate(step.id, {
                        [step.processorType?.includes("scene") ? "minScenes" : "minScriptLength"]:
                          parseInt(e.target.value),
                      })
                    }
                    disabled={isLocked}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Max {step.processorType.includes("scene") ? "Scenes" : "Length"}
                  </Label>
                  <Input
                    type="number"
                    value={step.config.maxScriptLength || step.config.maxScenes || 10}
                    onChange={(e) =>
                      handleStepConfigUpdate(step.id, {
                        [step.processorType?.includes("scene") ? "maxScenes" : "maxScriptLength"]:
                          parseInt(e.target.value),
                      })
                    }
                    disabled={isLocked}
                    className="h-10"
                  />
                </div>
              </div>
            )}

            {step.processorType === "generate_titles_and_bullets" && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Max Bullets</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={step.config.maxBullets || 5}
                  onChange={(e) => handleStepConfigUpdate(step.id, { maxBullets: parseInt(e.target.value) })}
                  disabled={isLocked}
                  className="h-10"
                />
              </div>
            )}

            {step.processorType === "generate_mcq_from_script" && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Number of Questions</Label>
                <Slider
                  value={[step.config.numQuestions || 5]}
                  onValueChange={([value]) => handleStepConfigUpdate(step.id, { numQuestions: value })}
                  min={1}
                  max={20}
                  step={1}
                  disabled={isLocked}
                />
                <p className="text-xs text-muted-foreground text-right">{step.config.numQuestions || 5} questions</p>
              </div>
            )}

            {step.processorType === "json_to_video" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between min-h-[40px]">
                  <span className="text-sm">Use Captions</span>
                  <Switch
                    checked={step.config.useCaptions ?? true}
                    onCheckedChange={(checked) => handleStepConfigUpdate(step.id, { useCaptions: checked })}
                    disabled={isLocked}
                  />
                </div>
                <div className="flex items-center justify-between min-h-[40px]">
                  <span className="text-sm">Use Subtitles</span>
                  <Switch
                    checked={step.config.useSubtitles ?? false}
                    onCheckedChange={(checked) => handleStepConfigUpdate(step.id, { useSubtitles: checked })}
                    disabled={isLocked}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between min-h-[40px]">
              <span className="text-sm">Auto Execute</span>
              <Switch
                checked={step.config.autoExecute ?? true}
                onCheckedChange={(checked) => handleStepConfigUpdate(step.id, { autoExecute: checked })}
                disabled={isLocked}
              />
            </div>
          </div>
        )}

        {/* Approval Step Config */}
        {step.type === "approval" && (
          <div className={isLocked ? "opacity-50 pointer-events-none space-y-3" : "space-y-3"}>
            <div className="h-px bg-border/30" />
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Approval Message</Label>
              <Input
                value={step.config.approvalMessage || ""}
                onChange={(e) => handleStepConfigUpdate(step.id, { approvalMessage: e.target.value })}
                placeholder="Content approved"
                disabled={isLocked}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Rejection Message</Label>
              <Input
                value={step.config.rejectionMessage || ""}
                onChange={(e) => handleStepConfigUpdate(step.id, { rejectionMessage: e.target.value })}
                placeholder="Content rejected"
                disabled={isLocked}
                className="h-10"
              />
            </div>
            <div className="flex items-center justify-between min-h-[40px]">
              <span className="text-sm">Auto Approve</span>
              <Switch
                checked={step.config.autoApprove ?? false}
                onCheckedChange={(checked) => handleStepConfigUpdate(step.id, { autoApprove: checked })}
                disabled={isLocked}
              />
            </div>
          </div>
        )}

        <div className="h-px bg-border/30" />

        {/* Collaboration Section - ALWAYS enabled even on locked steps */}
        {renderCollaborationSection(step)}
      </div>
    );
  };

  // --- Pipeline Visualization ---
  const renderPipeline = () => {
    return (
      <div className="flex flex-wrap items-center gap-1">
        {workflow.steps.map((step, idx) => {
          const dotColor = stepTypeColors[step.type] || "bg-muted";
          const isLocked = step.editable === false;
          return (
            <div key={step.id} className="flex items-center gap-1">
              <button
                onClick={() => setActiveScreen(step.id)}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] border transition-colors hover:bg-muted/50 ${
                  isLocked
                    ? "border-border/20 text-muted-foreground/50 bg-muted/10"
                    : "border-border/40 text-foreground bg-background"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                {step.title}
                {isLocked && <Lock className="w-2.5 h-2.5" />}
              </button>
              {idx < workflow.steps.length - 1 && (
                <ArrowRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // --- Content ---
  const renderContent = () => {
    // Sub-screen (team/user/role picker)
    if (isSubScreen) {
      const items = getFilteredItems();
      const type = activeScreen.split("-")[1];

      return (
        <div className="h-full flex flex-col">
          <div className="shrink-0 space-y-4 pb-4">
            <Input
              placeholder={`Search ${type}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-h-[44px]"
            />
            <p className="text-sm text-muted-foreground">{items.length} {type} available</p>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-1 -mx-2 px-2">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors cursor-pointer min-h-[56px]"
                onClick={() => toggleSelection(item.id)}
              >
                <Checkbox checked={tempSelectedIds.includes(item.id)} />
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
            <p className="text-sm text-muted-foreground">{tempSelectedIds.length} selected</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleBack} className="min-h-[44px]">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveSelection} className="min-h-[44px]">
                Save
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Tenants
    if (activeScreen === "tenants") {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Zugeordnete Tenants</h3>
            {tenantAssignments.length > 0 ? (
              <div className="space-y-2">
                {tenantAssignments.map((a) => {
                  const tenant = mockTenants.find((t) => t.id === a.tenantId);
                  return (
                    <div key={a.tenantId} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: tenant?.primaryColor || "#888" }}
                        >
                          {a.tenantName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{a.tenantName}</span>
                        <Badge variant="outline" className="text-xs">
                          {a.visibility === "organization" ? "Alle" : "Nur Admin"}
                        </Badge>
                      </div>
                      <button
                        onClick={() => handleRemoveTenant(a.tenantId)}
                        className="p-1.5 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Noch keinem Tenant zugeordnet.</p>
            )}
          </div>

          {availableTenants.length > 0 && (
            <div className="border-t border-border/40 pt-4 space-y-3">
              <h3 className="text-sm font-medium">Tenant hinzufügen</h3>
              <select
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Tenant auswählen…</option>
                {availableTenants.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wf-visibility"
                    checked={tenantVisibility === "organization"}
                    onChange={() => setTenantVisibility("organization")}
                    className="accent-primary"
                  />
                  <span className="text-sm">Gesamte Organisation</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wf-visibility"
                    checked={tenantVisibility === "admin-only"}
                    onChange={() => setTenantVisibility("admin-only")}
                    className="accent-primary"
                  />
                  <span className="text-sm">Nur Admin</span>
                </label>
              </div>

              <Button size="sm" onClick={handleAssignTenant} disabled={!selectedTenantId} className="w-full min-h-[44px]">
                <Plus className="h-4 w-4 mr-1" /> Zuordnen
              </Button>
            </div>
          )}
        </div>
      );
    }

    // Overview
    if (activeScreen === "overview") {
      return (
        <div className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">{workflow.description}</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Workflow Name</Label>
              <Input
                value={workflow.name}
                onChange={(e) => onWorkflowUpdate({ ...workflow, name: e.target.value })}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Textarea
                value={workflow.description}
                onChange={(e) => onWorkflowUpdate({ ...workflow, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Welcome Message</Label>
              <Textarea
                value={workflow.welcomeMessage}
                onChange={(e) => onWorkflowUpdate({ ...workflow, welcomeMessage: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <div className="h-px bg-border/30" />

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Pipeline</Label>
            {renderPipeline()}
          </div>
        </div>
      );
    }

    // Step config
    const step = workflow.steps.find((s) => s.id === activeScreen);
    if (step) {
      return renderStepConfig(step);
    }

    return null;
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange} title={isSubScreen ? "" : workflow.name}>
      {isSubScreen && (
        <div className="flex items-center gap-2 px-4 md:px-6 py-3 border-b border-border/40 shrink-0">
          <Button variant="ghost" size="sm" onClick={handleBack} className="min-h-[44px]">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <span className="text-sm font-medium">
            {activeScreen.includes("-teams")
              ? "Select Teams"
              : activeScreen.includes("-roles")
              ? "Select Roles"
              : "Select Users"}
          </span>
        </div>
      )}

      <ResponsiveDialogBody
        sidebar={!isSubScreen && renderSidebar()}
        showSidebar={!isSubScreen}
      >
        {!isSubScreen && isMobile && renderMobileTabs()}
        <ResponsiveDialogContent>{renderContent()}</ResponsiveDialogContent>
      </ResponsiveDialogBody>
    </ResponsiveDialog>
  );
};
