
import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronLeft } from "lucide-react";
import { Team, TeamMember, User } from "@/types/admin";
import { toast } from "sonner";

interface TeamManagementDialogProps {
  team: Team;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeamUpdated: (team: Team) => void;
  onTeamDeleted: (teamId: string) => void;
}

type ScreenType = "general" | "members" | "add-members" | "workflows" | "add-workflows" | "danger";

// Mock data
const allUsers: User[] = [
  { id: "1", firstName: "Moin", lastName: "Arian", email: "moin@example.com", accountType: "Admin", teams: [], tokensUsed: 1250, workflowsCreated: 5, assistantsCreated: 2, createdAt: "2024-01-15" },
  { id: "2", firstName: "Sarah", lastName: "Johnson", email: "sarah@example.com", accountType: "User", teams: [], tokensUsed: 890, workflowsCreated: 3, assistantsCreated: 1, createdAt: "2024-02-20" },
  { id: "3", firstName: "David", lastName: "Chen", email: "david@example.com", accountType: "User", teams: [], tokensUsed: 456, workflowsCreated: 2, assistantsCreated: 0, createdAt: "2024-03-10" },
  { id: "4", firstName: "Emma", lastName: "Wilson", email: "emma@example.com", accountType: "User", teams: [], tokensUsed: 320, workflowsCreated: 1, assistantsCreated: 0, createdAt: "2024-04-05" },
  { id: "5", firstName: "Alex", lastName: "Rodriguez", email: "alex@example.com", accountType: "User", teams: [], tokensUsed: 125, workflowsCreated: 0, assistantsCreated: 0, createdAt: "2024-05-10" }
];

const allWorkflows = [
  { id: "1", title: "Content Generator", icon: "✨" },
  { id: "2", title: "Code Review Assistant", icon: "💻" },
  { id: "3", title: "Email Composer", icon: "📧" },
  { id: "4", title: "Data Analyzer", icon: "📊" },
  { id: "5", title: "Meeting Summarizer", icon: "📝" }
];

const TeamManagementDialog = ({ 
  team, 
  open, 
  onOpenChange, 
  onTeamUpdated, 
  onTeamDeleted 
}: TeamManagementDialogProps) => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>("general");
  const [editData, setEditData] = useState({
    name: team.name,
    description: team.description || "",
    color: team.color
  });

  const [allocatedWorkflows, setAllocatedWorkflows] = useState([
    { id: "1", title: "Content Generator", icon: "✨" },
    { id: "2", title: "Code Review Assistant", icon: "💻" }
  ]);

  // Add members screen state
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Add workflows screen state
  const [workflowSearchTerm, setWorkflowSearchTerm] = useState("");
  const [selectedWorkflowIds, setSelectedWorkflowIds] = useState<string[]>([]);

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

  const handleRemoveWorkflow = (workflowId: string) => {
    setAllocatedWorkflows(prev => prev.filter(w => w.id !== workflowId));
    toast.success("Workflow removed");
  };

  // Add members logic
  const existingMemberIds = team.members.map(m => m.id);
  const availableUsers = allUsers.filter(u => !existingMemberIds.includes(u.id));
  const filteredUsers = availableUsers.filter(u =>
    u.firstName.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );

  const handleAddMembers = () => {
    const newMembers: TeamMember[] = selectedUserIds.map(userId => {
      const user = allUsers.find(u => u.id === userId)!;
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl
      };
    });
    const updatedTeam: Team = { ...team, members: [...team.members, ...newMembers] };
    onTeamUpdated(updatedTeam);
    setSelectedUserIds([]);
    setMemberSearchTerm("");
    setActiveScreen("members");
    toast.success(`${newMembers.length} member${newMembers.length > 1 ? 's' : ''} added`);
  };

  // Add workflows logic
  const allocatedWorkflowIds = allocatedWorkflows.map(w => w.id);
  const availableWorkflows = allWorkflows.filter(w => !allocatedWorkflowIds.includes(w.id));
  const filteredWorkflows = availableWorkflows.filter(w =>
    w.title.toLowerCase().includes(workflowSearchTerm.toLowerCase())
  );

  const handleAddWorkflows = () => {
    const newWorkflows = selectedWorkflowIds.map(wId => allWorkflows.find(w => w.id === wId)!);
    setAllocatedWorkflows(prev => [...prev, ...newWorkflows]);
    setSelectedWorkflowIds([]);
    setWorkflowSearchTerm("");
    setActiveScreen("workflows");
    toast.success(`${newWorkflows.length} workflow${newWorkflows.length > 1 ? 's' : ''} added`);
  };

  const tabs = [
    { id: "general" as ScreenType, label: "General" },
    { id: "members" as ScreenType, label: "Members" },
    { id: "workflows" as ScreenType, label: "Workflows" },
    { id: "danger" as ScreenType, label: "Danger Zone" },
  ];

  const isSubScreen = activeScreen === "add-members" || activeScreen === "add-workflows";

  const handleBack = () => {
    if (activeScreen === "add-members") {
      setSelectedUserIds([]);
      setMemberSearchTerm("");
      setActiveScreen("members");
    } else if (activeScreen === "add-workflows") {
      setSelectedWorkflowIds([]);
      setWorkflowSearchTerm("");
      setActiveScreen("workflows");
    }
  };

  const renderContent = () => {
    switch (activeScreen) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-foreground mb-1">General</h2>
              <p className="text-sm text-muted-foreground">Basic team settings and information</p>
            </div>
            
            <div className="h-px bg-border/50" />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Team Name</label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="max-w-md"
              />
            </div>

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
              <Button size="sm" variant="outline" onClick={() => setActiveScreen("add-members")}>
                Add
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

      case "add-members":
        return (
          <div className="space-y-4 h-full flex flex-col">
            <Input
              placeholder="Search users..."
              value={memberSearchTerm}
              onChange={(e) => setMemberSearchTerm(e.target.value)}
            />

            <p className="text-sm text-muted-foreground">{filteredUsers.length} users available</p>

            <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
              {filteredUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {memberSearchTerm ? "No users found." : "All users are already members."}
                </p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      if (selectedUserIds.includes(user.id)) {
                        setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
                      } else {
                        setSelectedUserIds([...selectedUserIds, user.id]);
                      }
                    }}
                  >
                    <Checkbox checked={selectedUserIds.includes(user.id)} />
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="text-xs bg-muted">
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <p className="text-sm text-muted-foreground">{selectedUserIds.length} selected</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBack}>Cancel</Button>
                <Button size="sm" onClick={handleAddMembers} disabled={selectedUserIds.length === 0}>
                  Add {selectedUserIds.length > 0 ? selectedUserIds.length : ""}
                </Button>
              </div>
            </div>
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
              <Button size="sm" variant="outline" onClick={() => setActiveScreen("add-workflows")}>
                Add
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

      case "add-workflows":
        return (
          <div className="space-y-4 h-full flex flex-col">
            <Input
              placeholder="Search workflows..."
              value={workflowSearchTerm}
              onChange={(e) => setWorkflowSearchTerm(e.target.value)}
            />

            <p className="text-sm text-muted-foreground">{filteredWorkflows.length} workflows available</p>

            <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
              {filteredWorkflows.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {workflowSearchTerm ? "No workflows found." : "All workflows are already allocated."}
                </p>
              ) : (
                filteredWorkflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center gap-3 py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      if (selectedWorkflowIds.includes(workflow.id)) {
                        setSelectedWorkflowIds(selectedWorkflowIds.filter(id => id !== workflow.id));
                      } else {
                        setSelectedWorkflowIds([...selectedWorkflowIds, workflow.id]);
                      }
                    }}
                  >
                    <Checkbox checked={selectedWorkflowIds.includes(workflow.id)} />
                    <span className="text-lg">{workflow.icon}</span>
                    <span className="text-sm font-medium text-foreground">{workflow.title}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <p className="text-sm text-muted-foreground">{selectedWorkflowIds.length} selected</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBack}>Cancel</Button>
                <Button size="sm" onClick={handleAddWorkflows} disabled={selectedWorkflowIds.length === 0}>
                  Add {selectedWorkflowIds.length > 0 ? selectedWorkflowIds.length : ""}
                </Button>
              </div>
            </div>
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 rounded-xl border-border/60 shadow-lg overflow-hidden [&>button]:hidden h-[500px]">
        {/* Header with X button top right */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 shrink-0">
          <h2 className="text-lg font-semibold">{team.name}</h2>
          <DialogClose className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md transition-all">
            <X className="h-4 w-4" />
          </DialogClose>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar - hidden on sub-screens */}
          {!isSubScreen && (
            <div className="w-52 border-r border-border/40 flex flex-col shrink-0">
              <nav className="flex-1 p-2 space-y-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveScreen(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeScreen === tab.id
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sub-screen header with back button */}
            {isSubScreen && (
              <div className="flex items-center gap-3 p-4 border-b border-border/40">
                <button
                  onClick={handleBack}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-base font-medium text-foreground">
                  {activeScreen === "add-members" ? "Add Members" : "Add Workflows"}
                </h2>
              </div>
            )}

            <div className="flex-1 p-6 overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamManagementDialog;
