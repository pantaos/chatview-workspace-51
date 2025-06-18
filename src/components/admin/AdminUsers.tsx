import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Search, Edit, Trash2, Filter, X } from "lucide-react";
import { User, UserTeam } from "@/types/admin";
import AddUserDialog from "./AddUserDialog";
import EditUserDialog from "./EditUserDialog";
import { toast } from "sonner";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");

  // Mock data - in real app this would come from API
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      firstName: "Moin",
      lastName: "Arian",
      email: "moin@example.com",
      accountType: "Admin",
      teams: [{ id: "1", name: "Engineering", color: "blue" }],
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
      teams: [
        { id: "2", name: "Marketing", color: "green" },
        { id: "3", name: "Content", color: "purple" }
      ],
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
      teams: [{ id: "1", name: "Engineering", color: "blue" }],
      tokensUsed: 456,
      workflowsCreated: 2,
      assistantsCreated: 0,
      createdAt: "2024-03-10",
      lastLogin: "2024-06-16"
    }
  ]);

  // Get unique teams for filter
  const allTeams = Array.from(
    new Set(users.flatMap(user => user.teams.map(team => team.name)))
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFilter("all");
    setTeamFilter("all");
  };

  const hasActiveFilters = searchTerm !== "" || selectedFilter !== "all" || teamFilter !== "all";

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success("User deleted successfully");
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAccountType = selectedFilter === "all" || user.accountType.toLowerCase() === selectedFilter;
    
    const matchesTeam = teamFilter === "all" || user.teams.some(team => team.name === teamFilter);
    
    return matchesSearch && matchesAccountType && matchesTeam;
  });

  const getAccountTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Admin":
        return "default";
      case "Super Admin":
        return "destructive";
      default:
        return "secondary";
    }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">User Management</h2>
          <p className="text-muted-foreground">Manage user accounts, permissions, and teams</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-primary hover:bg-black hover:text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          
          {/* Account Type Filter */}
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Account Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Team Filter */}
          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {allTeams.map((team) => (
                <SelectItem key={team} value={team}>{team}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Users Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Tokens Used</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getAccountTypeBadgeVariant(user.accountType)}>
                    {user.accountType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {user.teams.map((team) => (
                      <span
                        key={team.id}
                        className={`px-2 py-1 rounded text-xs border ${getTeamBadgeColor(team.color)}`}
                      >
                        {team.name}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{user.tokensUsed.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* No results message */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found matching your filters.
        </div>
      )}

      {/* Dialogs */}
      <AddUserDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onUserAdded={(newUser) => setUsers([...users, newUser])}
      />
      
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onUserUpdated={(updatedUser) => {
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminUsers;
