
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Workflow as WorkflowIcon, Plus, X } from "lucide-react";
import { Team, Workflow } from "@/types/admin";

interface WorkflowAllocationDialogProps {
  team: Team;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkflowsUpdated: (teamId: string, workflowIds: string[]) => void;
}

const WorkflowAllocationDialog = ({ 
  team, 
  open, 
  onOpenChange, 
  onWorkflowsUpdated 
}: WorkflowAllocationDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);

  // Mock data - in real app this would come from API
  const availableWorkflows: Workflow[] = [
    {
      id: "1",
      title: "Content Generator",
      description: "Generate marketing content using AI",
      icon: "✨",
      createdBy: "Admin",
      createdAt: "2024-01-15",
      isPublic: false,
      tags: ["content", "marketing"]
    },
    {
      id: "2",
      title: "Code Review Assistant",
      description: "AI-powered code review and suggestions",
      icon: "💻",
      createdBy: "Developer",
      createdAt: "2024-02-10",
      isPublic: false,
      tags: ["development", "code"]
    },
    {
      id: "3",
      title: "Report Generator",
      description: "Generate detailed reports from data",
      icon: "📊",
      createdBy: "Analyst",
      createdAt: "2024-03-01",
      isPublic: false,
      tags: ["reports", "analytics"]
    },
    {
      id: "4",
      title: "Email Composer",
      description: "Compose professional emails with AI",
      icon: "✉️",
      createdBy: "Marketing",
      createdAt: "2024-03-15",
      isPublic: false,
      tags: ["email", "communication"]
    }
  ];

  const filteredWorkflows = availableWorkflows.filter(workflow =>
    workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleWorkflowToggle = (workflowId: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(workflowId)
        ? prev.filter(id => id !== workflowId)
        : [...prev, workflowId]
    );
  };

  const handleSave = () => {
    onWorkflowsUpdated(team.id, selectedWorkflows);
    onOpenChange(false);
    setSelectedWorkflows([]);
    setSearchTerm("");
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedWorkflows([]);
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <WorkflowIcon className="w-5 h-5" />
            Allocate Workflows to {team.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-search">Search Workflows</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="workflow-search"
                placeholder="Search workflows by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {selectedWorkflows.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-2">
                Selected Workflows ({selectedWorkflows.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedWorkflows.map(id => {
                  const workflow = availableWorkflows.find(w => w.id === id);
                  return workflow ? (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1">
                      {workflow.icon} {workflow.title}
                      <button
                        onClick={() => handleWorkflowToggle(id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredWorkflows.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No workflows found matching your search.
              </div>
            ) : (
              filteredWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedWorkflows.includes(workflow.id)}
                    onCheckedChange={() => handleWorkflowToggle(workflow.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{workflow.icon}</span>
                      <div className="font-medium">{workflow.title}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {workflow.description}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {workflow.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-black hover:text-white">
              <Plus className="w-4 h-4 mr-2" />
              Allocate Workflows ({selectedWorkflows.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowAllocationDialog;
