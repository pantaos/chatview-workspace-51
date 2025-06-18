
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { User, NewUserData, UserTeam } from "@/types/admin";
import { toast } from "sonner";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: User) => void;
}

const AddUserDialog = ({ open, onOpenChange, onUserAdded }: AddUserDialogProps) => {
  const [formData, setFormData] = useState<NewUserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType: "User",
    teams: []
  });

  // Mock available teams
  const availableTeams: UserTeam[] = [
    { id: "1", name: "Engineering", color: "blue" },
    { id: "2", name: "Marketing", color: "green" },
    { id: "3", name: "Content", color: "purple" },
    { id: "4", name: "Sales", color: "orange" },
    { id: "5", name: "Design", color: "red" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      accountType: formData.accountType,
      teams: availableTeams.filter(team => formData.teams.includes(team.id)),
      tokensUsed: 0,
      workflowsCreated: 0,
      assistantsCreated: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onUserAdded(newUser);
    toast.success("User added successfully");
    onOpenChange(false);
    
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      accountType: "User",
      teams: []
    });
  };

  const toggleTeam = (teamId: string) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams.includes(teamId)
        ? prev.teams.filter(id => id !== teamId)
        : [...prev.teams, teamId]
    }));
  };

  const getTeamBadgeColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      red: "bg-red-100 text-red-800 border-red-200"
    };
    return colorMap[color] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Select
              value={formData.accountType}
              onValueChange={(value: "User" | "Admin") => setFormData({ ...formData, accountType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Teams</Label>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {availableTeams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => toggleTeam(team.id)}
                    className={`p-2 rounded border text-sm transition-colors ${
                      formData.teams.includes(team.id)
                        ? getTeamBadgeColor(team.color)
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
              {formData.teams.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.teams.map((teamId) => {
                    const team = availableTeams.find(t => t.id === teamId);
                    return team ? (
                      <Badge
                        key={teamId}
                        variant="secondary"
                        className="text-xs"
                      >
                        {team.name}
                        <button
                          type="button"
                          onClick={() => toggleTeam(teamId)}
                          className="ml-1 hover:bg-red-100 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add User</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
