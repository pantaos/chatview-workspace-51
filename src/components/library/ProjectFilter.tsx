import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, FolderOpen } from "lucide-react";
import { MockProject } from "@/types/library";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProjectFilterProps {
  projects: MockProject[];
  selectedProjects: string[];
  onProjectSelect: (projectId: string) => void;
  onProjectRemove: (projectId: string) => void;
  onClearAll: () => void;
  onCreateProject?: (name: string) => void;
}

export function ProjectFilter({
  projects,
  selectedProjects,
  onProjectSelect,
  onProjectRemove,
  onClearAll,
  onCreateProject,
}: ProjectFilterProps) {
  const isMobile = useIsMobile();
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const handleCreate = () => {
    if (newProjectName.trim() && onCreateProject) {
      onCreateProject(newProjectName.trim());
      setNewProjectName("");
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreate();
    } else if (e.key === "Escape") {
      setIsCreating(false);
      setNewProjectName("");
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground flex items-center gap-1.5 mr-1">
        <FolderOpen className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Projects</span>
      </span>
      
      {projects.map((project) => {
        const isSelected = selectedProjects.includes(project.id);
        return (
          <Badge
            key={project.id}
            variant={isSelected ? "default" : "secondary"}
            className={`cursor-pointer transition-all text-xs px-2.5 py-0.5 ${
              isSelected 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
            }`}
            onClick={() => 
              isSelected ? onProjectRemove(project.id) : onProjectSelect(project.id)
            }
          >
            {project.name}
            {isSelected && (
              <X className="h-3 w-3 ml-1.5 hover:text-primary-foreground/80" />
            )}
          </Badge>
        );
      })}
      
      {/* Add New Project */}
      {onCreateProject && (
        <Popover open={isCreating} onOpenChange={setIsCreating}>
          <PopoverTrigger asChild>
            <Badge
              variant="outline"
              className="cursor-pointer transition-all text-xs px-2.5 py-0.5 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Plus className="h-3 w-3 mr-1" />
              {isMobile ? "New" : "New Project"}
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <div className="space-y-3">
              <p className="text-sm font-medium">Create Project</p>
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Project name..."
                className="h-8 text-sm"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setNewProjectName("");
                  }}
                  className="h-7 px-2 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={!newProjectName.trim()}
                  className="h-7 px-3 text-xs"
                >
                  Create
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Clear All */}
      {selectedProjects.length > 0 && (
        <button
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-1 flex items-center gap-1"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}
