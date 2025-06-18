
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, UserPlus } from "lucide-react";
import { User, TeamMember } from "@/types/admin";

interface AddTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMembersAdded: (members: TeamMember[]) => void;
  existingMembers: TeamMember[];
}

const AddTeamMemberDialog = ({ 
  open, 
  onOpenChange, 
  onMembersAdded, 
  existingMembers 
}: AddTeamMemberDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock users data - in real app this would come from API
  const allUsers: User[] = [
    {
      id: "1",
      firstName: "Moin",
      lastName: "Arian",
      email: "moin@example.com",
      accountType: "Admin",
      teams: [],
      tokensUsed: 1250,
      workflowsCreated: 5,
      assistantsCreated: 2,
      createdAt: "2024-01-15",
      lastLogin: "2024-06-18"
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      accountType: "User",
      teams: [],
      tokensUsed: 890,
      workflowsCreated: 3,
      assistantsCreated: 1,
      createdAt: "2024-02-20",
      lastLogin: "2024-06-17"
    },
    {
      id: "3",
      firstName: "David",
      lastName: "Chen",
      email: "david@example.com",
      accountType: "User",
      teams: [],
      tokensUsed: 456,
      workflowsCreated: 2,
      assistantsCreated: 0,
      createdAt: "2024-03-10",
      lastLogin: "2024-06-16"
    },
    {
      id: "4",
      firstName: "Emma",
      lastName: "Wilson",
      email: "emma@example.com",
      accountType: "User",
      teams: [],
      tokensUsed: 320,
      workflowsCreated: 1,
      assistantsCreated: 0,
      createdAt: "2024-04-05",
      lastLogin: "2024-06-15"
    },
    {
      id: "5",
      firstName: "Alex",
      lastName: "Rodriguez",
      email: "alex@example.com",
      accountType: "User",
      teams: [],
      tokensUsed: 125,
      workflowsCreated: 0,
      assistantsCreated: 0,
      createdAt: "2024-05-10",
      lastLogin: "2024-06-14"
    }
  ];

  // Filter out users who are already members
  const existingMemberIds = existingMembers.map(member => member.id);
  const availableUsers = allUsers.filter(user => !existingMemberIds.includes(user.id));

  // Filter users based on search term
  const filteredUsers = availableUsers.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleAddMembers = () => {
    const newMembers: TeamMember[] = selectedUsers.map(userId => {
      const user = allUsers.find(u => u.id === userId)!;
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl
      };
    });
    
    onMembersAdded(newMembers);
    setSelectedUsers([]);
    setSearchTerm("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[70vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add Team Members
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            {filteredUsers.length} users available
          </div>

          {/* User list */}
          <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "No users found matching your search." : "All users are already team members."}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => handleUserSelect(user.id, !!checked)}
                  />
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddMembers}
                disabled={selectedUsers.length === 0}
                className="bg-primary hover:bg-black hover:text-white"
              >
                Add {selectedUsers.length} Member{selectedUsers.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberDialog;
