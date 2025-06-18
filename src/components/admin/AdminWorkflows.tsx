
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bot, Workflow, Search, Users, Edit, Settings } from "lucide-react";
import { WorkflowItem, Assistant, Workflow as WorkflowType, WorkflowTag } from "@/types/workflow";
import { User, UserTeam, AccessPermission } from "@/types/admin";
import WorkflowCreationDialog from "@/components/WorkflowCreationDialog";
import { toast } from "sonner";

const AdminWorkflows = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showNewWorkflowDialog, setShowNewWorkflowDialog] = useState(false);

  // Default tags
  const [defaultTags] = useState<WorkflowTag[]>([
    { id: "productivity", name: "Productivity", color: "#3B82F6" },
    { id: "creative", name: "Creative", color: "#10B981" },
    { id: "education", name: "Education", color: "#F59E0B" },
    { id: "business", name: "Business", color: "#8B5CF6" },
    { id: "development", name: "Development", color: "#EF4444" },
  ]);

  // Mock data for workflows and assistants
  const [workflowItems, setWorkflowItems] = useState<WorkflowItem[]>([
    {
      id: "1",
      title: "Trendcast Video Creator",
      description: "Create engaging video content from trends",
      icon: "Video",
      tags: [{ id: "1", name: "Video", color: "blue" }],
      type: "workflow",
      steps: [],
      route: "/trendcast"
    },
    {
      id: "2",
      title: "Content Strategist",
      description: "AI assistant for content strategy and planning",
      icon: "Brain",
      tags: [{ id: "2", name: "Content", color: "green" }],
      type: "assistant",
      systemPrompt: "You are a content strategist...",
      starters: []
    },
    {
      id: "3",
      title: "Report Card Generator",
      description: "Generate professional report cards",
      icon: "FileText",
      tags: [{ id: "3", name: "Reports", color: "purple" }],
      type: "workflow",
      steps: [],
      route: "/reportcard"
    }
  ]);

  // Mock permissions data
  const [permissions, setPermissions] = useState<AccessPermission[]>([
    { id: "1", workflowId: "1", userId: "1", type: "user" },
    { id: "2", workflowId: "1", teamId: "1", type: "team" },
    { id: "3", workflowId: "2", teamId: "2", type: "team" }
  ]);

  // Mock users and teams data
  const users: User[] = [
    { id: "1", firstName: "Moin", lastName: "Arian", email: "moin@example.com", accountType: "Admin", teams: [], tokensUsed: 0, workflowsCreated: 0, assistantsCreated: 0, createdAt: "" },
    { id: "2", firstName: "Sarah", lastName: "Johnson", email: "sarah@example.com", accountType: "User", teams: [], tokensUsed: 0, workflowsCreated: 0, assistantsCreated: 0, createdAt: "" }
  ];

  const teams: UserTeam[] = [
    { id: "1", name: "Engineering", color: "blue" },
    { id: "2", name: "Marketing", color: "green" },
    { id: "3", name: "Content", color: "purple" }
  ];

  const filteredItems = workflowItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && item.type === selectedFilter;
  });

  const getPermissionsForItem = (itemId: string) => {
    return permissions.filter(p => p.workflowId === itemId);
  };

  const getPermissionDisplay = (itemId: string) => {
    const itemPermissions = getPermissionsForItem(itemId);
    const userPermissions = itemPermissions.filter(p => p.type === "user");
    const teamPermissions = itemPermissions.filter(p => p.type === "team");
    
    const displayUsers = userPermissions.map(p => {
      const user = users.find(u => u.id === p.userId);
      return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
    });
    
    const displayTeams = teamPermissions.map(p => {
      const team = teams.find(t => t.id === p.teamId);
      return team ? team.name : "Unknown Team";
    });
    
    return [...displayUsers, ...displayTeams];
  };

  const handleCreateWorkflow = (workflowData: any) => {
    if (workflowData.type === 'assistant') {
      const iconMap: Record<string, string> = {
        "Chat": "MessageSquare",
        "Code": "Code",
        "Image": "Image",
        "Document": "FileText",
        "Video": "Video",
        "Music": "Music",
        "Bot": "Bot"
      };

      const newAssistant: Assistant = {
        id: `assistant-${Date.now()}`,
        title: workflowData.title,
        description: workflowData.description,
        icon: iconMap[workflowData.selectedIcon] || "MessageSquare",
        tags: workflowData.tags || [],
        type: "assistant" as const,
        systemPrompt: workflowData.systemPrompt,
        starters: workflowData.starters,
        isFavorite: false
      };

      setWorkflowItems(prev => [...prev, newAssistant]);
    } else {
      const newWorkflow: WorkflowType = {
        id: `workflow-${Date.now()}`,
        title: workflowData.title,
        description: workflowData.description,
        icon: workflowData.selectedIcon,
        tags: workflowData.tags || [],
        type: "workflow" as const,
        steps: workflowData.steps,
        route: `/workflow/${workflowData.title.toLowerCase().replace(/\s+/g, '-')}`,
        isFavorite: false
      };

      setWorkflowItems(prev => [...prev, newWorkflow]);
    }
    
    toast.success("New workflow created successfully!");
  };

  const handleCreateTag = (tagData: { name: string; color: string }) => {
    // In a real app, this would update the tags in a global state or database
    toast.success(`Tag "${tagData.name}" created successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Workflows & Assistants</h2>
          <p className="text-muted-foreground">Manage content access and permissions</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowNewWorkflowDialog(true)}
        >
          <Bot className="w-4 h-4 mr-2" />
          Add Assistant
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search workflows and assistants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["all", "workflow", "assistant"].map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className="capitalize"
            >
              {filter === "all" ? "All" : filter + "s"}
            </Button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {item.type === "workflow" ? (
                      <Workflow className="w-5 h-5 text-primary" />
                    ) : (
                      <Bot className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {item.type}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="w-4 h-4" />
                  Access Permissions
                </div>
                <div className="text-xs text-muted-foreground">
                  {getPermissionDisplay(item.id).length > 0 ? (
                    <div className="space-y-1">
                      {getPermissionDisplay(item.id).map((permission, index) => (
                        <div key={index} className="bg-accent/50 px-2 py-1 rounded">
                          {permission}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded border border-yellow-200">
                      No permissions set
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Users className="w-3 h-3 mr-1" />
                  Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      <WorkflowCreationDialog
        open={showNewWorkflowDialog}
        onClose={() => setShowNewWorkflowDialog(false)}
        onCreateWorkflow={handleCreateWorkflow}
        availableTags={defaultTags}
        onCreateTag={handleCreateTag}
      />
    </div>
  );
};

export default AdminWorkflows;
