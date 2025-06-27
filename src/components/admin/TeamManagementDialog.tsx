
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Settings, Users, Plus, X } from "lucide-react";
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

  // Mock allocated workflows - in real app this would come from API
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

  const getTeamColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      red: "from-red-500 to-red-600"
    };
    return colorMap[color] || "from-gray-500 to-gray-600";
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
    // In a real app, this would update the backend
    console.log(`Allocated workflows ${workflowIds} to team ${teamId}`);
  };

  const handleRemoveWorkflow = (workflowId: string) => {
    setAllocatedWorkflows(prev => prev.filter(w => w.id !== workflowId));
    toast.success("Workflow removed from team");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTeamColor(team.color)} flex items-center justify-center`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <DialogTitle className="text-xl">{team.name}</DialogTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Team Name</Label>
                  <Input
                    id="edit-name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Team Color</Label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setEditData({ ...editData, color: color.value })}
                        className={`w-8 h-8 rounded-full ${getColorPreview(color.value)} ${
                          editData.color === color.value ? "ring-2 ring-primary ring-offset-2" : ""
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button onClick={handleSave} className="bg-primary hover:bg-black hover:text-white">
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {team.description && (
                  <p className="text-muted-foreground">{team.description}</p>
                )}
                
                {/* Workflows Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Allocated Workflows ({allocatedWorkflows.length})</h3>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-primary/10 hover:bg-primary hover:text-white"
                      onClick={() => setShowWorkflowDialog(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Workflows
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {allocatedWorkflows.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                        No workflows allocated to this team yet.
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {allocatedWorkflows.map((workflow) => (
                          <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{workflow.icon}</span>
                              <div className="font-medium">{workflow.title}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveWorkflow(workflow.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Members Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Team Members ({team.members.length})</h3>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-black hover:text-white"
                      onClick={() => setShowAddMemberDialog(true)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {team.members.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                        No members in this team yet.
                      </div>
                    ) : (
                      team.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                                {member.firstName[0]}{member.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.firstName} {member.lastName}</div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
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
