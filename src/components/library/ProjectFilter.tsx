import { Badge } from "@/components/ui/badge";
import { X, FolderOpen } from "lucide-react";
import { MockProject } from "@/types/library";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectFilterProps {
  projects: MockProject[];
  selectedProjects: string[];
  onProjectSelect: (projectId: string) => void;
  onProjectRemove: (projectId: string) => void;
  onClearAll: () => void;
}

export function ProjectFilter({
  projects,
  selectedProjects,
  onProjectSelect,
  onProjectRemove,
  onClearAll,
}: ProjectFilterProps) {
  const isMobile = useIsMobile();

  if (projects.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <FolderOpen className="h-3 w-3" />
        Projects:
      </span>
      
      {projects.map((project) => {
        const isSelected = selectedProjects.includes(project.id);
        return (
          <Badge
            key={project.id}
            variant={isSelected ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              isSelected 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "text-muted-foreground border-border hover:bg-accent"
            } ${isMobile ? 'text-xs px-2 py-0.5' : 'text-xs px-2 py-0.5'}`}
            onClick={() => 
              isSelected ? onProjectRemove(project.id) : onProjectSelect(project.id)
            }
          >
            {project.name}
            {isSelected && (
              <X className="h-2.5 w-2.5 ml-1" />
            )}
          </Badge>
        );
      })}
      
      {selectedProjects.length > 0 && (
        <button
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
