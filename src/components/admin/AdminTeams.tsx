
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Settings, UserPlus, Trash2 } from "lucide-react";
import { Team } from "@/types/admin";
import AddTeamDialog from "./AddTeamDialog";
import TeamManagementDialog from "./TeamManagementDialog";
import { toast } from "sonner";

const AdminTeams = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Mock data - in real app this would come from API
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Engineering",
      color: "blue",
      description: "Development and technical team",
      createdAt: "2024-01-15",
      members: [
        { id: "1", firstName: "Moin", lastName: "Arian", email: "moin@example.com" },
        { id: "3", firstName: "David", lastName: "Chen", email: "david@example.com" }
      ]
    },
    {
      id: "2",
      name: "Marketing",
      color: "green",
      description: "Marketing and growth team",
      createdAt: "2024-02-20",
      members: [
        { id: "2", firstName: "Sarah", lastName: "Johnson", email: "sarah@example.com" }
      ]
    },
    {
      id: "3",
      name: "Content",
      color: "purple",
      description: "Content creation and strategy",
      createdAt: "2024-03-10",
      members: [
        { id: "2", firstName: "Sarah", lastName: "Johnson", email: "sarah@example.com" }
      ]
    },
    {
      id: "4",
      name: "Design",
      color: "orange",
      description: "UI/UX and visual design",
      createdAt: "2024-04-05",
      members: []
    }
  ]);

  const getTeamColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "from-blue-500 to-blue-600 border-blue-200",
      green: "from-green-500 to-green-600 border-green-200",
      purple: "from-purple-500 to-purple-600 border-purple-200",
      orange: "from-orange-500 to-orange-600 border-orange-200",
      red: "from-red-500 to-red-600 border-red-200"
    };
    return colorMap[color] || "from-gray-500 to-gray-600 border-gray-200";
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
  };

  const handleTeamAdded = (newTeam: Team) => {
    setTeams([...teams, newTeam]);
    toast.success("Team created successfully");
  };

  const handleTeamUpdated = (updatedTeam: Team) => {
    setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
    setSelectedTeam(null);
    toast.success("Team updated successfully");
  };

  const handleTeamDeleted = (teamId: string) => {
    setTeams(teams.filter(t => t.id !== teamId));
    setSelectedTeam(null);
    toast.success("Team deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Team Management</h2>
          <p className="text-muted-foreground">Organize users into teams and manage team access</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-primary hover:bg-black hover:text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Team
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teams.map((team) => (
          <Card
            key={team.id}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2"
            onClick={() => handleTeamClick(team)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTeamColor(team.color)} flex items-center justify-center`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {team.members.length} members
                </Badge>
              </div>
              <CardTitle className="text-lg">{team.name}</CardTitle>
              {team.description && (
                <p className="text-sm text-muted-foreground">{team.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {team.members.slice(0, 3).map((member, index) => (
                    <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                        {member.firstName[0]}{member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {team.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-medium">+{team.members.length - 3}</span>
                    </div>
                  )}
                  {team.members.length === 0 && (
                    <div className="text-sm text-muted-foreground">No members</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialogs */}
      <AddTeamDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onTeamAdded={handleTeamAdded}
      />

      {selectedTeam && (
        <TeamManagementDialog
          team={selectedTeam}
          open={!!selectedTeam}
          onOpenChange={(open) => !open && setSelectedTeam(null)}
          onTeamUpdated={handleTeamUpdated}
          onTeamDeleted={handleTeamDeleted}
        />
      )}
    </div>
  );
};

export default AdminTeams;
