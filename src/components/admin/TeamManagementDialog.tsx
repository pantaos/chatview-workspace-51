
import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Trash2, Settings, Users, Plus, X, ChevronRight, Workflow } from "lucide-react";
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

const TeamManagementDialog = ({ 
  team, 
  open, 
  onOpenChange, 
  onTeamUpdated, 
  onTeamDeleted 
}: TeamManagementDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
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
    setIsEditing(false);
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
    toast.success("Workflow removed from team");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 ${getColorPreview(team.color)} rounded-lg flex items-center justify-center`}>
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground">{team.name}</h3>
                <p className="text-xs text-muted-foreground">{team.members.length} members</p>
              </div>
            </div>
            <DialogClose className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            {isEditing ? (
              <div className="px-5 py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Team Name</label>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="h-10"
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">Team Color</p>
                  </div>
                  <div className="flex gap-1.5">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setEditData({ ...editData, color: color.value })}
                        className={`w-7 h-7 rounded-full ${getColorPreview(color.value)} transition-all ${
                          editData.color === color.value 
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" 
                            : "hover:scale-105"
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={2}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" size="sm" className="h-8" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" className="h-8" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {/* Team Settings Row */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors border-b border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">Team Settings</p>
                      <p className="text-xs text-muted-foreground">Edit name, color, and description</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Workflows Section */}
                <div className="border-b border-border/30">
                  <div className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Workflows</span>
                      <span className="text-xs text-muted-foreground">({allocatedWorkflows.length})</span>
                    </div>
                    <button
                      onClick={() => setShowWorkflowDialog(true)}
                      className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                  
                  {allocatedWorkflows.length === 0 ? (
                    <div className="px-5 pb-4">
                      <p className="text-xs text-muted-foreground">No workflows allocated yet</p>
                    </div>
                  ) : (
                    <div className="pb-2">
                      {allocatedWorkflows.map((workflow) => (
                        <div 
                          key={workflow.id} 
                          className="flex items-center justify-between px-5 py-2.5 hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-base">{workflow.icon}</span>
                            <span className="text-sm text-foreground">{workflow.title}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveWorkflow(workflow.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Members Section */}
                <div>
                  <div className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Members</span>
                      <span className="text-xs text-muted-foreground">({team.members.length})</span>
                    </div>
                    <button
                      onClick={() => setShowAddMemberDialog(true)}
                      className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                  
                  {team.members.length === 0 ? (
                    <div className="px-5 pb-4">
                      <p className="text-xs text-muted-foreground">No members in this team yet</p>
                    </div>
                  ) : (
                    <div className="pb-2">
                      {team.members.map((member) => (
                        <div 
                          key={member.id} 
                          className="flex items-center justify-between px-5 py-2.5 hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
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
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Danger Zone */}
                <div className="border-t border-border/30">
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-destructive/5 transition-colors text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Delete Team</span>
                  </button>
                </div>
              </div>
            )}
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
