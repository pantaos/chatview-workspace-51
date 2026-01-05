
import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { UserPlus, Trash2, X, ChevronRight, Plus } from "lucide-react";
import { Team, TeamMember } from "@/types/admin";
import AddTeamMemberDialog from "./AddTeamMemberDialog";
import WorkflowAllocationDialog from "./WorkflowAllocationDialog";
import { toast } from "sonner";

interface TeamManagementDialogProps {
  team: Team;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeamUpdated: (team: Team) => void;
  onTeamDeleted: (teamId: string) => void;
}

type TabType = "general" | "members" | "workflows" | "danger";

const TeamManagementDialog = ({ 
  team, 
  open, 
  onOpenChange, 
  onTeamUpdated, 
  onTeamDeleted 
}: TeamManagementDialogProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [editData, setEditData] = useState({
    name: team.name,
    description: team.description || "",
    color: team.color
  });

  const [allocatedWorkflows, setAllocatedWorkflows] = useState([
    { id: "1", title: "Content Generator", icon: "✨" },
    { id: "2", title: "Code Review Assistant", icon: "💻" }
  ]);

  const colors = [
    { name: "Blue", value: "blue" },
    { name: "Green", value: "green" },
    { name: "Purple", value: "purple" },
    { name: "Orange", value: "orange" },
    { name: "Red", value: "red" }
  ];

  const getColorPreview = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      red: "bg-red-500"
    };
    return colorMap[color] || "bg-gray-500";
  };

  const handleSave = () => {
    const updatedTeam: Team = {
      ...team,
      name: editData.name,
      description: editData.description,
      color: editData.color
    };
    onTeamUpdated(updatedTeam);
    toast.success("Team updated");
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
      onTeamDeleted(team.id);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    const updatedTeam: Team = {
      ...team,
      members: team.members.filter(m => m.id !== memberId)
    };
    onTeamUpdated(updatedTeam);
  };

  const handleMembersAdded = (newMembers: TeamMember[]) => {
    const updatedTeam: Team = {
      ...team,
      members: [...team.members, ...newMembers]
    };
    onTeamUpdated(updatedTeam);
  };

  const handleWorkflowsUpdated = (teamId: string, workflowIds: string[]) => {
    toast.success(`${workflowIds.length} workflows allocated to ${team.name}`);
  };

  const handleRemoveWorkflow = (workflowId: string) => {
    setAllocatedWorkflows(prev => prev.filter(w => w.id !== workflowId));
    toast.success("Workflow removed");
  };

  const tabs = [
    { id: "general" as TabType, label: "General" },
    { id: "members" as TabType, label: "Members" },
    { id: "workflows" as TabType, label: "Workflows" },
    { id: "danger" as TabType, label: "Danger Zone" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-foreground mb-1">General</h2>
              <p className="text-sm text-muted-foreground">Basic team settings and information</p>
            </div>
            
            <div className="h-px bg-border/50" />

            {/* Team Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Team Name</label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="max-w-md"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Optional team description"
                rows={3}
                className="max-w-md resize-none"
              />
            </div>

            {/* Team Color */}
            <div className="flex items-center justify-between max-w-md">
              <div>
                <p className="text-sm font-medium text-foreground">Team Color</p>
                <p className="text-xs text-muted-foreground">Choose a color to identify this team</p>
              </div>
              <div className="flex gap-1.5">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setEditData({ ...editData, color: color.value })}
                    className={`w-6 h-6 rounded-full ${getColorPreview(color.value)} transition-all ${
                      editData.color === color.value 
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                        : "hover:scale-110"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button size="sm" onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        );

      case "members":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-foreground mb-1">Members</h2>
                <p className="text-sm text-muted-foreground">{team.members.length} team members</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowAddMemberDialog(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
            
            <div className="h-px bg-border/50" />

            {team.members.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No members in this team yet.</p>
            ) : (
              <div className="space-y-1">
                {team.members.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback className="text-xs bg-muted">
                          {member.firstName[0]}{member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "workflows":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-foreground mb-1">Workflows</h2>
                <p className="text-sm text-muted-foreground">{allocatedWorkflows.length} allocated workflows</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowWorkflowDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Workflow
              </Button>
            </div>
            
            <div className="h-px bg-border/50" />

            {allocatedWorkflows.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No workflows allocated yet.</p>
            ) : (
              <div className="space-y-1">
                {allocatedWorkflows.map((workflow) => (
                  <div 
                    key={workflow.id} 
                    className="flex items-center justify-between py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{workflow.icon}</span>
                      <span className="text-sm font-medium text-foreground">{workflow.title}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveWorkflow(workflow.id)}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "danger":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-foreground mb-1">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">Irreversible actions</p>
            </div>
            
            <div className="h-px bg-border/50" />

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">Delete Team</p>
                <p className="text-xs text-muted-foreground">Permanently delete this team and remove all members</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden h-[500px]">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-52 border-r border-border/40 flex flex-col shrink-0">
              {/* Close button */}
              <div className="p-3 border-b border-border/40">
                <DialogClose className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
                  <X className="h-4 w-4" />
                </DialogClose>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-2 space-y-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddTeamMemberDialog
        open={showAddMemberDialog}
        onOpenChange={setShowAddMemberDialog}
        onMembersAdded={handleMembersAdded}
        existingMembers={team.members}
      />

      <WorkflowAllocationDialog
        team={team}
        open={showWorkflowDialog}
        onOpenChange={setShowWorkflowDialog}
        onWorkflowsUpdated={handleWorkflowsUpdated}
      />
    </>
  );
};

export default TeamManagementDialog;
